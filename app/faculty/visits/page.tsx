"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { getCompanies, Company } from "@/lib/companies"
import { Building2, Calendar, Clock, MapPin, ArrowRight, XCircle, CheckCircle, RotateCcw, AlertCircle, Loader2, Route, Radio } from "lucide-react"
import { getDisciplineIcon } from "@/lib/utils"

export default function FacultyVisitsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    
    const [visits, setVisits] = useState<any[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/get-started")
            return
        }

        if (user) {
            loadActiveVisits()
            loadCompanies()
        }
    }, [user, authLoading, router])

    const loadCompanies = async () => {
        const data = await getCompanies()
        setCompanies(data)
    }

    const loadActiveVisits = async () => {
        try {
            const { data, error } = await supabase
                .from('scheduled_visits')
                .select('*')
                .eq('faculty_id', user!.id)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            
            // Group deeply by company_id to prevent duplicates spanning multiple negotiation attempts
            const grouped = new Map()
            data?.forEach((visit: any) => {
                if (!grouped.has(visit.company_id)) {
                    grouped.set(visit.company_id, visit)
                }
            })
            
            // Extract the latest values and aggressively filter out any historical 'cancelled' requests
            const activeUniqueVisits = Array.from(grouped.values()).filter(v => v.status !== 'cancelled')
            
            setVisits(activeUniqueVisits)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'pending_hr':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    text: 'text-amber-600',
                    icon: <Clock className="w-3 h-3 text-amber-500" />,
                    label: 'Pending HR Review'
                }
            case 'approved':
                return {
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    text: 'text-emerald-600',
                    icon: <CheckCircle className="w-3 h-3 text-emerald-500" />,
                    label: 'HR Approved'
                }
            case 'rescheduled':
                return {
                    bg: 'bg-indigo-50',
                    border: 'border-indigo-200',
                    text: 'text-indigo-600',
                    icon: <RotateCcw className="w-3 h-3 text-indigo-500" />,
                    label: 'Alternate Proposed'
                }
            case 'cancelled':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-600',
                    icon: <XCircle className="w-3 h-3 text-red-500" />,
                    label: 'Cancelled'
                }
            case 'published':
                return {
                    bg: 'bg-violet-50',
                    border: 'border-violet-200',
                    text: 'text-violet-600',
                    icon: <Radio className="w-3 h-3 text-violet-500" />,
                    label: 'Live to Students'
                }
            default:
                return {
                    bg: 'bg-slate-50',
                    border: 'border-slate-200',
                    text: 'text-slate-600',
                    icon: <AlertCircle className="w-3 h-3 text-slate-500" />,
                    label: 'Unknown Status'
                }
        }
    }

    if (loading || authLoading) return <div className="p-8 flex justify-center h-full items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>

    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3 tracking-tight">
                    <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600 ring-4 ring-indigo-50/50">
                        <Route className="w-6 h-6" />
                    </div>
                    Active Visits
                </h1>
                <p className="text-slate-500 font-medium text-lg leading-relaxed ml-[52px]">Track and manage your ongoing industry visit negotiations.</p>
            </div>

            {visits.length > 0 ? (
                <div className="flex flex-col gap-5">
                    {visits.map((visit: any) => {
                        const company = companies.find(c => c.id === visit.company_id)
                        const theme = getStatusTheme(visit.status)
                        const DisciplineIcon = getDisciplineIcon(company?.discipline || "")
                        
                        return (
                            <div 
                                key={visit.id} 
                                className={`group relative bg-white rounded-3xl p-4 min-h-[140px] border border-indigo-100/50 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-200 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-6 overflow-hidden w-full ${visit.status === 'cancelled' ? 'opacity-75 grayscale-[0.2]' : ''}`}
                            >
                                {/* Logo Container (Landscape 4:3) */}
                                <div className="h-32 w-48 shrink-0 relative rounded-2xl overflow-hidden shadow-sm hidden sm:block bg-slate-50 border border-slate-100/50 flex items-center justify-center p-6 transition-colors group-hover:bg-slate-100">
                                    {company?.logo ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={company.logo} alt={`${company.name} logo`} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xl">{company?.name?.charAt(0) || "C"}</div>
                                    )}
                                </div>

                                {/* Content Info */}
                                <div className="flex-1 min-w-0 flex flex-col gap-4 py-1 w-full">
                                    <div>
                                         <div className="flex flex-wrap items-center gap-3 mb-1">
                                              <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{company?.name || "Unknown Company"}</h3>
                                              <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border flex items-center gap-1 shadow-sm w-fit ${theme.bg} ${theme.text} ${theme.border}`}>
                                                  {theme.icon && <span>{theme.icon}</span>}
                                                  {theme.label}
                                              </div>
                                         </div>

                                         <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-sm text-slate-500 font-medium w-full">
                                              <div className="flex items-center gap-2 max-w-full">
                                                   <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                   <span className="truncate">{company?.location || "Unknown Location"}</span>
                                              </div>
                                              <div className="hidden sm:block text-slate-200 shrink-0">|</div>
                                              <div className="flex items-center gap-1.5 max-w-full min-w-0">
                                                   <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                                   <span className="truncate relative top-[1px]">{visit.proposed_date}</span>
                                              </div>
                                         </div>
                                    </div>

                                    {/* Tags perfectly listed under title */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex text-[11px] font-bold px-2.5 py-1 rounded-md items-center gap-1.5 text-sky-700 bg-sky-50 border border-sky-100/50 shadow-sm">
                                             <DisciplineIcon className="w-3 h-3 shrink-0" />
                                             {company?.discipline || "Generic"}
                                        </span>

                                        <span className="text-slate-200">|</span>

                                        {company?.tags?.slice(0,2).map((tag: string) => (
                                            <span key={tag} className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 flex items-center gap-1.5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Action Section */}
                                <div className="w-full sm:w-auto min-w-[200px] shrink-0 sm:pr-2">
                                    <button 
                                        onClick={() => router.push(`/faculty/visit/${visit.company_id}`)}
                                        className="w-full h-12 flex items-center justify-center gap-2 px-6 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:shadow-md hover:bg-indigo-700 hover:-translate-y-[1px] transition-all group/btn"
                                    >
                                        Open Workspace
                                        <ArrowRight className="w-4 h-4 text-indigo-200 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center p-12 bg-white flex flex-col items-center justify-center rounded-3xl border border-slate-200 shadow-sm h-80">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner pointer-events-none">
                        <Route className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Active Visits</h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-sm leading-relaxed">You haven't initiated any industry visits yet. Head over to Discovery to select a company and dispatch a request.</p>
                    <button 
                        onClick={() => router.push('/faculty#discovery')}
                        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                    >
                        Browse Discovery
                    </button>
                </div>
            )}
        </div>
    )
}
