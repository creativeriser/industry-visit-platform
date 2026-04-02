"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Calendar, MapPin, CheckCircle, Clock, Loader2 } from "lucide-react"
import { getDisciplineIcon } from "@/lib/utils"
import { ApplyButton } from "./apply-button"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

export default function StudentDashboardPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    
    const [profile, setProfile] = useState<any>(null)
    const [visits, setVisits] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/get-started")
            return
        }

        if (user) {
            loadData()
        }
    }, [user, authLoading, router])

    const loadData = async () => {
        try {
            // Get Student Profile
            const { data: prof } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user!.id)
                .single()

            if (!prof || !prof.discipline) {
                router.push("/student/profile")
                return
            }
            setProfile(prof)

            // Get Approved Visits matching Discipline
            const { data: vts } = await supabase
                .from('scheduled_visits')
                .select(`
                    id,
                    proposed_date,
                    status,
                    company:companies!inner(name, location, discipline, type, image),
                    applications:visit_applications(id, status, student_id)
                `)
                .eq('status', 'approved')
                .eq('company.discipline', prof.discipline)
            
            setVisits(vts || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading || authLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>

    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Visits</h1>
                <p className="text-slate-500">Industry visits curated for your discipline: <span className="font-semibold text-sky-600">{profile?.discipline}</span></p>
                {(!profile?.cgpa) && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 flex items-start gap-3">
                        ⚠️ <div><strong>Profile Incomplete:</strong> Please <a href="/student/profile" className="underline font-bold">update your CGPA</a> to apply for visits.</div>
                    </div>
                )}
            </div>

            {visits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visits.map((visit: any) => {
                        const Icon = getDisciplineIcon(visit.company.discipline)
                        const myApplication = visit.applications?.find((app: any) => app.student_id === user?.id)

                        return (
                            <div key={visit.id} className="bg-white border text-slate-900 border-slate-200 rounded-[20px] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                <div className="h-32 bg-slate-100 relative overflow-hidden">
                                    {visit.company.image && <img src={visit.company.image} alt="Company" className="w-full h-full object-cover" />}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                                        <Icon className="w-3.5 h-3.5 text-sky-500" />
                                        {visit.company.discipline}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold line-clamp-1">{visit.company.name}</h3>
                                            <p className="text-sm font-medium text-slate-500 flex items-center mt-1">
                                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                                {visit.company.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center text-sm font-medium text-slate-700">
                                            <Calendar className="w-4 h-4 mr-2.5 text-sky-500" />
                                            {visit.proposed_date}
                                        </div>
                                        <div className="flex items-center text-sm font-medium text-slate-700">
                                            <Building2 className="w-4 h-4 mr-2.5 text-sky-500" />
                                            {visit.company.type}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        {myApplication ? (
                                            <div className="flex items-center justify-center p-3 rounded-xl bg-slate-50 text-slate-600 font-bold border border-slate-200 text-sm gap-2">
                                                {myApplication.status === 'applied' && <><Clock className="w-4 h-4 text-amber-500" /> Application Pending</>}
                                                {myApplication.status === 'accepted' && <><CheckCircle className="w-4 h-4 text-emerald-500" /> Application Accepted</>}
                                                {myApplication.status === 'rejected' && <span className="text-red-500">Application Not Selected</span>}
                                            </div>
                                        ) : (
                                            <ApplyButton visitId={visit.id} studentId={user!.id} hasCGPA={!!profile?.cgpa} onApplySuccess={loadData} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-lg">No upcoming visits found for your discipline yet.</p>
                </div>
            )}
        </div>
    )
}
