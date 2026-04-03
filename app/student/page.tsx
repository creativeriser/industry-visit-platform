"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Route, ArrowRight, Compass } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { StudentHeader } from "@/components/student/student-header"
import { VisitCard } from "@/components/student/visit-card"

export default function StudentDashboardPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    
    const [profile, setProfile] = useState<any>(null)
    const [visits, setVisits] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

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

            if (!prof) {
                router.push("/student/profile")
                return
            }
            setProfile(prof)

            // Get ALL Approved Visits
            const { data: vts } = await supabase
                .from('scheduled_visits')
                .select(`
                    id,
                    proposed_date,
                    status,
                    company:companies!inner(name, location, discipline, type, image),
                    applications:visit_applications(id, status, student_id)
                `)
                .eq('status', 'published')
            
            if (vts) {
                setVisits(vts)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading || authLoading) return <div className="p-8 flex justify-center h-screen items-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>

    // Filter Logic
    const filteredVisits = visits.filter(v =>
        v.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.company.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.company.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const recommendedVisits = filteredVisits.filter(v => v.company.discipline === profile.discipline)
    const otherVisits = filteredVisits.filter(v => v.company.discipline !== profile.discipline)

    let missingFields: string[] = [];
    if (profile) {
        if (!profile.cgpa) missingFields.push("CGPA");
        if (!profile.institution) missingFields.push("Institution");
        if (!profile.department) missingFields.push("Department");
        if (!profile.phone) missingFields.push("Phone");
        if (!profile.discipline) missingFields.push("Discipline");
        if (!profile.github_url) missingFields.push("GitHub Link");
        if (!profile.linkedin_url) missingFields.push("LinkedIn Link");
        if (!profile.resume_url) missingFields.push("Resume");
        if (!profile.roll_number) missingFields.push("Roll Number");
        if (!profile.section) missingFields.push("Section");
        if (!profile.degree) missingFields.push("Degree");
        if (!profile.attendance) missingFields.push("Attendance");
    }
    const isProfileIncomplete = missingFields.length > 0;

    return (
        <div id="dashboard-scroll-container" className="h-full overflow-y-auto bg-slate-50">
            {/* Faculty-style sticky top header */}
            <StudentHeader onSearch={setSearchQuery} profile={profile} />

            <div className="max-w-[1600px] mx-auto p-8 space-y-12">
                
                {/* Profile Incomplete Warning */}
                {isProfileIncomplete && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 md:p-5 bg-red-50/80 border border-red-200/60 rounded-2xl text-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                        <div className="flex items-start sm:items-center gap-3.5">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shrink-0 mt-1 sm:mt-0" />
                            <div>
                                <strong className="font-bold text-red-800 text-[15px]">Profile Incomplete</strong> 
                                <span className="block sm:inline sm:ml-2 text-red-700/90 text-sm font-medium mt-0.5 sm:mt-0">
                                    Please provide your <span className="font-bold">{missingFields.join(", ")}</span> to apply for enterprise visits.
                                </span>
                            </div>
                        </div>
                        <button onClick={() => router.push('/student/profile')} className="text-sm font-bold bg-white text-red-700 px-5 py-2 rounded-xl border border-red-200 hover:bg-red-100 transition-colors shrink-0 shadow-sm hover:shadow active:scale-95">
                            Fix Now
                        </button>
                    </motion.div>
                )}

                {!searchQuery && recommendedVisits.length > 0 && (
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                            Curated for {profile?.discipline}
                        </h2>
                        <span className="text-sm font-bold text-sky-600 flex items-center gap-1 cursor-pointer hover:text-sky-700 transition-colors group">
                            Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </div>
                )}
                
                {searchQuery && (
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                        Search Results for <span className="text-sky-600">"{searchQuery}"</span>
                    </h2>
                )}

                {/* Recommended Section / Search Results */}
                {recommendedVisits.length > 0 ? (
                    <div className="flex flex-col gap-5 w-full">
                        {recommendedVisits.map((visit: any, idx: number) => (
                             <motion.div key={visit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                 <VisitCard 
                                     visit={visit} 
                                     studentId={user!.id} 
                                     hasCGPA={!!profile?.cgpa} 
                                     onApplySuccess={loadData} 
                                 />
                             </motion.div>
                        ))}
                    </div>
                ) : (
                    !searchQuery && (
                        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white shadow-sm flex flex-col items-center">
                             <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner pointer-events-none">
                                <Route className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Exact Matches</h3>
                            <p className="text-slate-500 mt-2 font-medium max-w-sm leading-relaxed text-sm">
                                There are currently no approved visits specifically targeting {profile?.discipline}.
                            </p>
                        </div>
                    )
                )}

                {/* Other Streams Section */}
                {otherVisits.length > 0 && (
                    <div className="pt-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 tracking-tight">Broad Discovery</h2>
                        <p className="text-slate-500 font-medium mb-6">Explore industry visits mapped to other faculties.</p>
                        
                        <div className="flex flex-col gap-5 w-full">
                            {otherVisits.map((visit: any, idx: number) => (
                                <motion.div key={visit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                    <VisitCard 
                                        visit={visit} 
                                        studentId={user!.id} 
                                        hasCGPA={!!profile?.cgpa} 
                                        onApplySuccess={loadData} 
                                        isCrossStream={true}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {searchQuery && filteredVisits.length === 0 && (
                     <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                         <p className="text-slate-500 font-medium">No matches found for "{searchQuery}"</p>
                         <p className="text-slate-400 text-sm mt-1">Try searching for a different company, city, or discipline.</p>
                     </div>
                )}
            </div>
        </div>
    )
}
