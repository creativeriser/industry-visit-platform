"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Calendar, Clock, CheckCircle, XCircle, Loader2, ClipboardList } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { VisitCard } from "@/components/student/visit-card"

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
                    created_at,
                    visit_id,
                    visit:scheduled_visits(
                        id,
                        proposed_date,
                        company:companies(name, location, type, image, discipline)
                    )
                `)
                .eq('student_id', user!.id)
                .order('created_at', { ascending: false })
            
            setApplications(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading || authLoading) return <div className="p-8 flex justify-center h-full items-center"><div className="w-8 h-8 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" /></div>

    return (
        <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
            {/* Header section with Framer Motion entry */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3 tracking-tight">
                    <div className="p-2.5 bg-sky-50 rounded-2xl text-sky-600 ring-4 ring-sky-50/50">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    My Applications
                </h1>
                <p className="text-slate-500 font-medium text-lg leading-relaxed ml-[52px]">Track the status of your submitted industry visit applications.</p>
            </motion.div>

            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((app: any, idx: number) => {
                        if (!app.visit) return null;
                        
                        // Reconstruct the visit object to perfectly match what VisitCard expects
                        const mappedVisit = {
                            ...app.visit,
                            id: app.visit.id || app.visit_id,
                            applications: [
                                { student_id: user!.id, status: app.status }
                            ]
                        };

                        return (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                                key={app.id}
                            >
                                <VisitCard 
                                    visit={mappedVisit}
                                    studentId={user!.id}
                                    profile={null}
                                    onApplySuccess={() => {}} 
                                />
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center p-12 bg-white flex flex-col items-center justify-center rounded-3xl border border-slate-200 shadow-sm h-80">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner pointer-events-none">
                        <ClipboardList className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Applications Yet</h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-sm leading-relaxed">You haven't applied to any industry visits. Browse the Discovery Hub to find opportunities.</p>
                    <button 
                        onClick={() => router.push('/student')}
                        className="mt-8 px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-sky-700 transition-all hover:-translate-y-[1px]"
                    >
                        Browse Discovery
                    </button>
                </div>
            )}
        </div>
    )
}
