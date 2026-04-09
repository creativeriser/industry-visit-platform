"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Loader2, CalendarClock, Building2, MapPin, User, CalendarDays, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function ScheduledVisitsSupervision() {
    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSchedules = async () => {
        setLoading(true)
        // Perform a nested join to grab Company Data and Associated Faculty Data natively.
        const { data, error } = await supabase
            .from('scheduled_visits')
            .select(`
                *,
                companies (name, location, type, discipline, logo),
                profiles (full_name, email, institution, department)
            `)
            .order('created_at', { ascending: false })
            
        if (!error && data) {
            setSchedules(data)
        } else if (error) {
            console.error("Schedule retrieval failed:", error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSchedules()
    }, [])

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved': return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Approved by HR' }
            case 'published': return { color: 'bg-blue-100 text-blue-700', icon: CalendarClock, label: 'Published (Accepting Students)' }
            case 'completed': return { color: 'bg-slate-200 text-slate-700', icon: CalendarDays, label: 'Successfully Concluded' }
            case 'cancelled': return { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Cancelled / Rejected' }
            default: return { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Pending HR Response' }
        }
    }

    return (
        <div className="p-6 md:p-10 w-full h-full overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <CalendarClock className="w-8 h-8 text-indigo-600" /> Global Operations Tower
                </h1>
                <p className="text-slate-500 mt-2">Enterprise supervision over all active logistics and industry visits across the platform.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                </div>
            ) : schedules.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100">
                    <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Logistics Found</h3>
                    <p className="text-slate-500 mt-1">There are no active scheduled visits in the system.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {schedules.map(visit => {
                        const org = visit.companies || {}
                        const faculty = visit.profiles || {}
                        const statusConfig = getStatusConfig(visit.status)
                        const StatusIcon = statusConfig.icon

                        return (
                            <div key={visit.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                {/* Decorator Stripe */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full \${statusConfig.color.split(' ')[0]}`} />
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-2xl overflow-hidden shrink-0">
                                            {org.logo ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={org.logo} alt="logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                org.name?.charAt(0) || "U"
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">{org.name || "Unknown Org"}</h3>
                                            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                                                <MapPin className="w-4 h-4" /> {org.location || "Remote / Global HQ"}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className={`\${statusConfig.color} border-0 flex items-center gap-1.5 px-3 py-1 font-semibold`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {statusConfig.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <CalendarDays className="w-3.5 h-3.5" /> Proposed Timeline
                                        </p>
                                        <p className="text-slate-900 font-semibold">{visit.proposed_date || "Awaiting Setup"}</p>
                                        {visit.hr_notes && (
                                            <p className="text-xs text-slate-500 mt-2 italic border-l-2 border-slate-300 pl-2">
                                                "{visit.hr_notes}"
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" /> Directing Faculty
                                        </p>
                                        <p className="text-slate-900 font-bold">{faculty.full_name || "Unknown Faculty"}</p>
                                        <p className="text-xs text-slate-600 mt-1 font-medium">{faculty.institution || "No Institution"}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
