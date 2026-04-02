"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Calendar, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

export default function StudentApplicationsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    
    const [applications, setApplications] = useState<any[]>([])
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
            const { data } = await supabase
                .from('visit_applications')
                .select(`
                    id,
                    status,
                    visit:scheduled_visits(
                        proposed_date,
                        company:companies(name, location, type)
                    )
                `)
                .eq('student_id', user!.id)
            
            setApplications(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading || authLoading) return <div className="p-8"><Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" /></div>

    return (
        <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
            <p className="text-slate-500 mb-10">Track the status of your industry visit applications.</p>

            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((app: any) => (
                        <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">{app.visit?.company?.name || "Unknown Company"}</h3>
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> {app.visit?.proposed_date}</span>
                                    <span className="flex items-center"><Building2 className="w-4 h-4 mr-2 text-slate-400" /> {app.visit?.company?.type}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center p-3 rounded-xl min-w-[200px] border">
                                {app.status === 'applied' && <div className="text-amber-600 bg-amber-50 border-amber-200 w-full text-center font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2"><Clock className="w-4 h-4" /> Pending Review</div>}
                                {app.status === 'accepted' && <div className="text-emerald-600 bg-emerald-50 border-emerald-200 w-full text-center font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Approved</div>}
                                {app.status === 'rejected' && <div className="text-red-600 bg-red-50 border-red-200 w-full text-center font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2"><XCircle className="w-4 h-4" /> Not Selected</div>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-lg">You haven't applied to any industry visits yet.</p>
                </div>
            )}
        </div>
    )
}
