"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, GraduationCap, Check, X, Loader2 } from "lucide-react"
import { FacultyApproveButtons } from "./approve-buttons"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

export default function FacultyApplicationsPage() {
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
            loadApplications()
        }
    }, [user, authLoading, router])

    const loadApplications = async () => {
        try {
            // Fetch faculty's own scheduled visits that have applications
            const { data } = await supabase
                .from('scheduled_visits')
                .select(`
                    id,
                    proposed_date,
                    status,
                    company:companies(name),
                    applications:visit_applications(
                        id,
                        status,
                        student:profiles(id, full_name, cgpa, discipline, school, email)
                    )
                `)
                .eq('faculty_id', user!.id)
            
            // Filter to only visits that actually have applications
            const activeVisits = data?.filter(v => v.applications && v.applications.length > 0) || []
            setVisits(activeVisits)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading || authLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>

    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Applications</h1>
                <p className="text-slate-500">Review and select students for your upcoming industry visits.</p>
            </div>

            {visits.length > 0 ? (
                <div className="space-y-12">
                    {visits.map((visit: any) => (
                        <div key={visit.id} className="bg-white border text-slate-900 border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                                <div>
                                    <h2 className="text-xl font-bold">{visit.company?.name || "Unknown Company"}</h2>
                                    <p className="text-indigo-200 text-sm mt-1">{visit.proposed_date} • {visit.status === 'approved' ? 'HR Confirmed' : 'Pending HR'}</p>
                                </div>
                                <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {visit.applications.length} Applicants
                                </div>
                            </div>

                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Student Name</th>
                                            <th className="px-6 py-4">Discipline</th>
                                            <th className="px-6 py-4">Current CGPA</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {visit.applications.sort((a: any, b: any) => (b.student?.cgpa || 0) - (a.student?.cgpa || 0)).map((app: any) => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">{app.student?.full_name || 'Anonymous Student'}</div>
                                                    <div className="text-xs text-slate-500">{app.student?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-600">
                                                    {app.student?.discipline}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className={`w-4 h-4 ${app.student?.cgpa >= 8.0 ? 'text-emerald-500' : 'text-amber-500'}`} />
                                                        <span className={`font-bold ${app.student?.cgpa >= 8.0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                            {app.student?.cgpa ? app.student.cgpa.toFixed(2) : 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {app.status === 'applied' && <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full">Pending</span>}
                                                    {app.status === 'accepted' && <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center gap-1 w-max"><Check className="w-3 h-3"/> Accepted</span>}
                                                    {app.status === 'rejected' && <span className="text-xs font-bold px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full flex items-center gap-1 w-max"><X className="w-3 h-3"/> Rejected</span>}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <FacultyApproveButtons applicationId={app.id} currentStatus={app.status} onUpdate={loadApplications} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-12 bg-white flex flex-col items-center justify-center rounded-2xl border border-slate-200 shadow-sm h-64">
                    <Users className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No Applications Yet</h3>
                    <p className="text-slate-500 mt-2">When students apply for your highly anticipated visits, they will appear here organized by CGPA.</p>
                </div>
            )}
        </div>
    )
}
