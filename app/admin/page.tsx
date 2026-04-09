"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getCompanies } from "@/lib/companies"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"
import { Check, X, Loader2, Building2, Globe2, Phone, Mail, FileText, Database, Trash2, History, Plus, UserCheck } from "lucide-react"

export default function AdminDashboard() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'directory'>('pending')
    const [companies, setCompanies] = useState<any[]>([])
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newCompany, setNewCompany] = useState({
        name: '',
        discipline: '',
        location: '',
        capacity: '50',
        description: '',
        repName: '',
        repTitle: '',
        repEmail: '',
        repPhone: ''
    })

    const fetchRequests = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('organization_requests')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (!error && data) {
            setRequests(data)
        }
        setLoading(false)
    }

    const fetchAllCompanies = async () => {
        setIsLoadingCompanies(true)
        const data = await getCompanies()
        setCompanies(data)
        setIsLoadingCompanies(false)
    }

    useEffect(() => {
        fetchRequests()
        fetchAllCompanies()
    }, [])

    const handleAction = async (req: any, status: 'approved' | 'rejected') => {
        const id = req.id
        // Optimistic update
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
        
        const { error } = await supabase
            .from('organization_requests')
            .update({ status })
            .eq('id', id)
            
        if (error) {
            alert("Error updating request: " + error.message)
            fetchRequests() // Revert on failure
            return
        }

        if (status === 'approved') {
            
            // Enterprise logic resolving unmapped custom disciplines
            let finalDiscipline = req.industry_sector;
            if (finalDiscipline === 'Other' || finalDiscipline === 'Other (Manual Mapping Required)') {
                const customDiscipline = window.prompt(`This organization requested an unlisted Industry Sector. \n\nPlease explicitly define the new Discipline name you wish to create for them (e.g., 'Data Science'):`);
                
                if (!customDiscipline || customDiscipline.trim() === "") {
                    alert("Approval cancelled safely. A valid discipline must be assigned to create a database record.");
                    
                    // Revert the optimistic update back to pending since it was aborted
                    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'pending' } : r))
                    return; 
                }
                
                finalDiscipline = customDiscipline.trim();
            }

            const { error: insertError } = await supabase.from('companies').insert({
                name: req.organization_name,
                location: "Global / StandardHQ", 
                discipline: finalDiscipline,
                type: 'Industrial Visit',
                capacity: parseInt(req.expected_capacity?.match(/\d+/)?.[0] || "30") || 30,
                description: req.additional_notes || '',
                representative: {
                    name: req.contact_name,
                    role: req.contact_title,
                    email: req.contact_email,
                    phone: req.contact_phone || ""
                },
                tags: [finalDiscipline]
            })

            if (insertError) {
                // Revert optimistic update
                setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'pending' } : r))
                alert("Request approved but FAILED to safely inject Company to Database! RLS Policy is blocking the action. \n\nError: " + insertError.message)
            } else {
                fetchAllCompanies()
            }
        }
    }

    const handleDeleteCompany = async (companyId: number, companyName: string) => {
        if (!confirm(`CRITICAL WARNING: Are you absolutely sure you want to delete '${companyName}'?\n\nBecause of database integrity rules, this will cascade and instantly delete ALL scheduled visits mapped to this company across the platform. This cannot be undone.`)) return;
        
        const originalCompanies = [...companies]
        setCompanies(prev => prev.filter(c => c.id !== companyId))
        
        const { data, error } = await supabase.from('companies').delete().eq('id', companyId).select()
        
        if (error || !data || data.length === 0) {
            alert("SECURITY BLOCK: Cannot delete company. The action failed silently because Admin RLS Policies are missing on the 'companies' table. \n\nExecute the SQL Patch to grant Admins the power to delete companies.")
            setCompanies(originalCompanies) // Absolute Rollback
        }
    }

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        const { data, error } = await supabase.from('companies').insert({
            name: newCompany.name,
            location: newCompany.location,
            discipline: newCompany.discipline,
            type: 'Industrial Visit',
            capacity: parseInt(newCompany.capacity) || 50,
            description: newCompany.description,
            representative: {
                name: newCompany.repName,
                role: newCompany.repTitle,
                email: newCompany.repEmail,
                phone: newCompany.repPhone
            },
            tags: [newCompany.discipline]
        }).select()

        setIsSubmitting(false)

        if (error || !data || data.length === 0) {
            alert("SECURITY BLOCK: The action failed silently. Your database RLS insert policy blocked the creation. \nError: " + (error?.message || "Missing INSERT privileges for Admin role."))
        } else {
            setIsAddModalOpen(false)
            setNewCompany({ name: '', discipline: '', location: '', capacity: '50', description: '', repName: '', repTitle: '', repEmail: '', repPhone: '' })
            fetchAllCompanies()
        }
    }

    const pendingRequests = requests.filter(r => r.status === 'pending')
    const historyRequests = requests.filter(r => r.status === 'approved')

    return (
        <div className="p-6 md:p-10 w-full h-full overflow-y-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Admin Access</h1>
                    <p className="text-slate-500 mt-2">Manage incoming partner requests and explore the active site directory.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button 
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pending' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pending Inbox
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Approved Logs
                    </button>
                    <button 
                        onClick={() => setActiveTab('directory')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'directory' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Live Directory
                    </button>
                    {activeTab === 'directory' && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="ml-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Partner
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'pending' || activeTab === 'history' ? (
                <>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : (activeTab === 'pending' ? pendingRequests : historyRequests).length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                    {activeTab === 'pending' ? <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" /> : <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />}
                    <h3 className="text-lg font-medium text-slate-900">
                        {activeTab === 'pending' ? "No pending requests" : "No approved history"}
                    </h3>
                    <p className="text-slate-500 mt-1">
                        {activeTab === 'pending' ? "All submitted organizations have been reviewed." : "You have not approved any requests yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {(activeTab === 'pending' ? pendingRequests : historyRequests).map(req => (
                        <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                {/* Left Side: Org Info */}
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-xl font-bold text-slate-900">{req.organization_name}</h2>
                                            {req.status === 'pending' ? (
                                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 px-2 py-0.5">Pending</Badge>
                                            ) : req.status === 'approved' ? (
                                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0 px-2 py-0.5">Verified System Partner</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200 border-0 px-2 py-0.5">Rejected</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center text-slate-500 text-sm gap-4">
                                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4"/> {req.industry_sector}</span>
                                            {req.website_url && (
                                                <a href={req.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                                    <Globe2 className="w-4 h-4"/> Website
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Submitter / Contact</p>
                                            <p className="text-sm font-medium text-slate-900">{req.contact_name}</p>
                                            <p className="text-sm text-slate-500">{req.contact_title}</p>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Mail className="w-3.5 h-3.5" /> {req.contact_email}
                                                </div>
                                                {req.contact_phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone className="w-3.5 h-3.5" /> {req.contact_phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Logistics</p>
                                            <p className="text-sm text-slate-900"><span className="font-medium">Capacity:</span> {req.expected_capacity}</p>
                                            <p className="text-sm text-slate-900 mt-2 flex items-start gap-2">
                                                <FileText className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                                                <span className="italic text-slate-600">{req.additional_notes || "No additional notes provided."}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Actions */}
                                <div className="flex flex-row lg:flex-col items-center justify-end gap-3 pt-2 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6 min-w-[140px]">
                                    {activeTab === 'pending' ? (
                                        <>
                                            <Button 
                                                onClick={() => handleAction(req, 'approved')}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all shadow-emerald-600/20"
                                            >
                                                <Check className="w-4 h-4 mr-2" /> Approve
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={() => handleAction(req, 'rejected')}
                                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium transition-colors"
                                            >
                                                <X className="w-4 h-4 mr-2" /> Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-end h-full">
                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 py-1.5 px-3 border border-emerald-200 shadow-sm flex items-center gap-1.5">
                                                <Check className="w-3.5 h-3.5" /> Operations Engaged
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                    )}
                </>
            ) : (
                <div className="space-y-6">
                    {isLoadingCompanies ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : companies.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                            <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No Verified Companies Active</h3>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {companies.map((company, index) => (
                                <div key={company.id || index} className="p-5 border border-slate-200 bg-white shadow-sm rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group hover:border-indigo-300 transition-all hover:shadow-md">
                                    <div className="flex items-start gap-5 flex-1 min-w-0">
                                        <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-400 text-2xl overflow-hidden shrink-0 shadow-sm">
                                            {company.logo ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={company.logo} alt="logo" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                company.name?.charAt(0) || "U"
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{company.name}</h4>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 text-[10px] ml-2">ID: #{company.id}</Badge>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{company.discipline}</p>
                                            <p className="text-sm text-slate-600 line-clamp-2 max-w-2xl">
                                                {company.description || "No specific operational narrative provided for this organization."}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:w-[450px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Location</span>
                                                <span className="font-medium text-slate-700 truncate">{company.location || 'Global/Remote'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Max Capacity</span>
                                                <span className="font-medium text-slate-700">{company.capacity || 'Flexible'} Pax</span>
                                            </div>
                                            <div className="flex flex-col col-span-2 mt-1 border-t border-slate-200/60 pt-2">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Primary Representative</span>
                                                <span className="font-medium text-slate-900 flex items-center gap-2">
                                                    {company.representative?.name || "System Mapped Contact"}
                                                    {company.representative?.role && <span className="text-slate-400 font-normal text-xs">({company.representative.role})</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Elevated Deletion Controls - Moved to right edge */}
                                    <div className="absolute top-4 right-4 lg:relative lg:top-0 lg:right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className="w-8 h-8 rounded-full shadow-sm bg-red-50 hover:bg-red-500 text-red-500 hover:text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCompany(company.id, company.name)
                                            }}
                                            title="Delete Company from Directory"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Modal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                title="Create Partner Entity"
                description="Manually insert an enterprise partner into the Live Directory. This bypasses the inbox queue entirely."
                className="max-w-2xl"
            >
                <form onSubmit={handleCreateCompany} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="c-name">Entity Name *</Label>
                            <Input id="c-name" required placeholder="e.g., Google India" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="c-disc">Discipline / Sector *</Label>
                            <Input id="c-disc" required placeholder="e.g., Computer Science" value={newCompany.discipline} onChange={e => setNewCompany({...newCompany, discipline: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="c-loc">Location *</Label>
                            <Input id="c-loc" required placeholder="e.g., Hyderabad Node" value={newCompany.location} onChange={e => setNewCompany({...newCompany, location: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="c-cap">Max Capacity *</Label>
                            <Input id="c-cap" type="number" required placeholder="50" min="1" value={newCompany.capacity} onChange={e => setNewCompany({...newCompany, capacity: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="c-desc">Overview & Logistics</Label>
                        <Textarea id="c-desc" placeholder="Operational details, requirements, etc..." className="h-24" value={newCompany.description} onChange={e => setNewCompany({...newCompany, description: e.target.value})} />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><UserCheck className="w-4 h-4"/> Representative Context</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="r-name">Name *</Label>
                                <Input id="r-name" required placeholder="Jane Doe" value={newCompany.repName} onChange={e => setNewCompany({...newCompany, repName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="r-title">Title / Role *</Label>
                                <Input id="r-title" required placeholder="University Relations" value={newCompany.repTitle} onChange={e => setNewCompany({...newCompany, repTitle: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="r-email">Email Address *</Label>
                                <Input id="r-email" type="email" required placeholder="contact@company.com" value={newCompany.repEmail} onChange={e => setNewCompany({...newCompany, repEmail: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="r-phone">Phone Number</Label>
                                <Input id="r-phone" placeholder="+1..." value={newCompany.repPhone} onChange={e => setNewCompany({...newCompany, repPhone: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Partner'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
