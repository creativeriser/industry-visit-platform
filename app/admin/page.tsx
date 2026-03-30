"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2, Building2, Globe2, Phone, Mail, FileText } from "lucide-react"

export default function AdminDashboard() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        // Optimistic update
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req))
        
        const { error } = await supabase
            .from('organization_requests')
            .update({ status })
            .eq('id', id)
            
        if (error) {
            alert("Error updating request: " + error.message)
            fetchRequests() // Revert on failure
        }
    }

    const pendingRequests = requests.filter(r => r.status === 'pending')

    return (
        <div className="p-6 md:p-10 w-full h-full overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Organization Requests</h1>
                <p className="text-slate-500 mt-2">Approve or reject submitted organization profiles.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : pendingRequests.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No pending requests</h3>
                    <p className="text-slate-500 mt-1">All submitted organizations have been reviewed.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingRequests.map(req => (
                        <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                {/* Left Side: Org Info */}
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-xl font-bold text-slate-900">{req.organization_name}</h2>
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">Pending</Badge>
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
                                    <Button 
                                        onClick={() => handleAction(req.id, 'approved')}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all shadow-emerald-600/20"
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleAction(req.id, 'rejected')}
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium transition-colors"
                                    >
                                        <X className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
