"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, BrainCircuit, Target, BookOpen, ChevronUp } from "lucide-react"
import { CompanyCard } from "./company-card"
import { Company } from "@/lib/companies"
import { useUser } from "@/context/user-context"


export function RecommendationRail({ companies }: { companies: Company[] }) {
    const { user } = useUser()
    const [isExpanded, setIsExpanded] = useState(false)
    const discipline = user.discipline || "Computer Science"

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

            {/* Vertical Stack Layout (Professional List View) */}
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
                                    tags: item.tags
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
