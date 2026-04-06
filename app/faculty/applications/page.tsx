"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, GraduationCap, Check, X, Loader2, Github, Linkedin, Code, Clock } from "lucide-react"
import { FacultyApproveButtons } from "./approve-buttons"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { getDisciplineIcon } from "@/lib/utils"

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
                        student:profiles(id, full_name, cgpa, attendance, discipline, institution, email, github_url, leetcode_url, linkedin_url, roll_number, section, degree)
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
                        <div key={visit.id} className="bg-white border text-slate-900 border-indigo-100 rounded-[24px] shadow-sm overflow-hidden ring-1 ring-indigo-50">
                            <div className="bg-indigo-900 p-6 flex items-center justify-between text-white border-b border-indigo-800">
                                <div>
                                    <h2 className="text-xl font-bold">{visit.company?.name || "Unknown Company"}</h2>
                                    <p className="text-indigo-200 text-sm mt-1">{visit.proposed_date} • {visit.status === 'published' ? 'Live to Students' : 'HR Confirmed'}</p>
                                </div>
                                <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-inner">
                                    <Users className="w-4 h-4 text-indigo-300" />
                                    {visit.applications.length} Applicants
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50">
                                <div className="flex flex-col gap-3">
                                    {visit.applications.sort((a: any, b: any) => (b.student?.cgpa || 0) - (a.student?.cgpa || 0)).map((app: any) => {
                                        const DisciplineIcon = getDisciplineIcon(app.student?.discipline)
                                        return (
                                        <div key={app.id} className="group relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            
                                            {/* Left/Middle: Info */}
                                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0 w-full">
                                                {/* Name / Role */}
                                                <div className="min-w-0 w-full sm:w-[240px] shrink-0">
                                                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">{app.student?.full_name || 'Anonymous Student'}</h3>
                                                    <span className="inline-flex mt-1 text-[11px] font-bold px-2.5 py-1 rounded-md items-center gap-1.5 text-sky-700 bg-sky-50 border border-sky-100/50 w-fit">
                                                        <DisciplineIcon className="w-3 h-3 shrink-0" />
                                                        {app.student?.discipline || 'Unknown Discipline'}
                                                    </span>
                                                </div>

                                                {/* CGPA & Status */}
                                                <div className="flex flex-wrap items-center gap-4 shrink-0">
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                                        <GraduationCap className={`w-4 h-4 ${app.student?.cgpa >= 8.0 ? 'text-emerald-500' : 'text-amber-500'}`} />
                                                        <span className={`text-sm font-bold ${app.student?.cgpa >= 8.0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                            {app.student?.cgpa ? app.student.cgpa.toFixed(2) : 'N/A'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center w-[120px]">
                                                        {app.status === 'applied' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> Pending</span>}
                                                        {app.status === 'accepted' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500"/> Accepted</span>}
                                                        {app.status === 'rejected' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md flex items-center gap-1"><X className="w-3 h-3 text-red-500"/> Rejected</span>}
                                                    </div>
                                                </div>

                                                {/* Roll No */}
                                                <div className="text-xs text-slate-400 font-mono hidden lg:block shrink-0">
                                                    {app.student?.roll_number || 'No Roll #'}
                                                </div>
                                            </div>

                                            {/* Right: Action */}
                                            <div className="w-full sm:w-auto shrink-0 flex items-center sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                                                <button onClick={() => router.push(`/faculty/applications/${app.id}`)} className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:shadow shadow-indigo-100/50 px-6 py-2.5 rounded-xl transition-all w-full sm:w-auto text-center border border-indigo-100/50 block">
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
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
