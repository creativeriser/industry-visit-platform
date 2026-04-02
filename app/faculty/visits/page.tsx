"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { COMPANIES } from "@/lib/companies"
import { Building2, Calendar, Clock, MapPin, ArrowRight, XCircle, CheckCircle, RotateCcw, AlertCircle, Loader2, Route } from "lucide-react"

export default function FacultyVisitsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    
    const [visits, setVisits] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/get-started")
            return
        }

        if (user) {
            loadActiveVisits()
        }
    }, [user, authLoading, router])

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
                    text: 'text-amber-700',
                    icon: <Clock className="w-4 h-4 text-amber-500" />,
                    label: 'Pending HR Review'
                }
            case 'approved':
                return {
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    text: 'text-emerald-700',
                    icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
                    label: 'HR Approved'
                }
            case 'rescheduled':
                return {
                    bg: 'bg-indigo-50',
                    border: 'border-indigo-200',
                    text: 'text-indigo-700',
                    icon: <RotateCcw className="w-4 h-4 text-indigo-500" />,
                    label: 'Alternate Proposed'
                }
            case 'cancelled':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-700',
                    icon: <XCircle className="w-4 h-4 text-red-500" />,
                    label: 'Cancelled'
                }
            default:
                return {
                    bg: 'bg-slate-50',
                    border: 'border-slate-200',
                    text: 'text-slate-700',
                    icon: <AlertCircle className="w-4 h-4 text-slate-500" />,
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
                        const company = COMPANIES.find(c => c.id === visit.company_id)
                        const theme = getStatusTheme(visit.status)
                        
                        return (
                            <div 
                                key={visit.id} 
                                className={`bg-white border text-slate-900 border-slate-200/80 rounded-[24px] shadow-sm hover:shadow-md hover:border-indigo-200/60 overflow-hidden transition-all duration-300 group flex flex-col md:flex-row h-auto ring-2 ring-transparent hover:ring-indigo-50 ${visit.status === 'cancelled' ? 'opacity-75 grayscale-[0.2]' : ''}`}
                            >
                                {/* Left Image Section */}
                                <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden bg-slate-900 shrink-0">
                                    <div 
                                        className="absolute inset-0 opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700 ease-out"
                                        style={{
                                            backgroundImage: `url(${company?.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600'})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />
                                    
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className={`w-fit px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold border backdrop-blur-md shadow-lg ${
                                            visit.status === 'approved' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
                                            visit.status === 'rescheduled' ? 'bg-indigo-500/90 border-indigo-400 text-white' :
                                            visit.status === 'cancelled' ? 'bg-red-500/90 border-red-400 text-white' :
                                            'bg-amber-500/90 border-amber-400 text-white'
                                        }`}>
                                            {theme.icon && <span className="text-white brightness-200">{theme.icon}</span>}
                                            {theme.label}
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Content Section */}
                                <div className="p-6 md:px-8 md:py-6 flex-1 flex flex-col justify-center min-w-0">
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-4 truncate">{company?.name || "Unknown Company"}</h2>
                                    
                                    <div className="flex flex-col gap-2.5 mb-5">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="truncate">{company?.location || "Unknown Location"}</span>
                                        </div>
                                        
                                        <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                            <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                            <span className="leading-snug pr-4">{visit.proposed_date}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {company?.tags?.slice(0,3).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-md text-xs font-semibold border border-slate-200/60">
                                                {tag}
                                            </span>
                                        ))}
                                        <span className="px-2.5 py-1 bg-indigo-50/50 text-indigo-600 rounded-md text-xs font-bold border border-indigo-100/50">
                                            {company?.discipline || "Generic"}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Action Section */}
                                <div className="p-6 md:p-8 flex flex-col justify-center shrink-0 w-full md:w-64 relative before:hidden md:before:block before:absolute before:left-0 before:top-8 before:bottom-8 before:w-px before:bg-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Manage Request</p>
                                    <button 
                                        onClick={() => router.push(`/faculty/visit/${visit.company_id}`)}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 rounded-full font-semibold text-white shadow-md hover:shadow-lg hover:bg-indigo-600 hover:ring-4 ring-indigo-600/20 transition-all group/btn"
                                    >
                                        Open Workspace
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
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
