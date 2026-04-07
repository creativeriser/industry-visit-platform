"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronUp, BookOpen } from "lucide-react"
import { CompanyCard } from "./company-card"
import { Company } from "@/lib/companies"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"

export function RecommendationRail({ companies }: { companies: Company[] }) {
    const { user } = useUser()
    const [isExpanded, setIsExpanded] = useState(false)
    const router = useRouter()
    const discipline = user.discipline

    // If discipline is not set, show a prompt rather than fake curated results
    if (!discipline) {
        return (
            <div className="py-2">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50"
                >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Set Your Academic Discipline</h2>
                        <p className="text-slate-500 text-sm max-w-sm">
                            Complete your profile to see industry visits curated for your specific discipline and department.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/faculty/profile')}
                        className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                    >
                        Complete Profile <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>
        )
    }

    // Filter companies based on the faculty's discipline
    const matches = companies.filter(c => c.discipline === discipline)
    const visibleItems = isExpanded ? matches : matches.slice(0, 2)

    return (
        <div className="py-2">
            <div className="flex items-end justify-between mb-8 px-1">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Curated for {discipline}
                    </h2>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
                >
                    {isExpanded ? "Show Less" : "View All Matches"}
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        ) : (
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        )}
                    </div>
                </button>
            </div>

            {matches.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center bg-slate-50/50">
                    <p className="text-slate-500 font-medium">No companies found for <span className="font-bold text-slate-700">{discipline}</span> yet.</p>
                    <p className="text-slate-400 text-sm mt-1">Check back soon or explore the full discovery section below.</p>
                </div>
            ) : (
                <motion.div layout className="flex flex-col gap-5 w-full">
                    <AnimatePresence mode="popLayout">
                        {visibleItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                key={item.id}
                            >
                                <CompanyCard
                                    item={{
                                        id: item.id,
                                        name: item.name,
                                        location: item.location,
                                        discipline: discipline,
                                        image: item.image,
                                        logo: item.logo,
                                        tags: item.tags
                                    }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}
