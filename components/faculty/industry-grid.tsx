"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompanyCard } from "./company-card"
import { Company } from "@/lib/companies"

const PRIMARY_DISCIPLINES = [
    "All",
    "Computer Science",
    "Mechanical Engineering",
    "Biotechnology",
    "Business Administration"
]

const SECONDARY_DISCIPLINES = [
    "Civil Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Architecture",
    "Psychology",
    "Law",
    "Medicine",
    "Physics",
    "Mathematics"
]

interface IndustryGridProps {
    companies: Company[]
    basePath?: string
    title?: string
    subtitle?: string
}

export function IndustryGrid({
    companies,
    basePath = "/faculty",
    title = "Broad Discovery",
    subtitle = "Explore sites mapped to other faculties"
}: IndustryGridProps) {
    const searchParams = useSearchParams()
    const initialDiscipline = searchParams?.get("discipline") || "All"
    const [activeTab, setActiveTab] = useState(initialDiscipline)
    const [isExpanded, setIsExpanded] = useState(false)

    // Sync tab if URL changes
    useEffect(() => {
        const discipline = searchParams?.get("discipline")
        if (discipline) {
            setActiveTab(discipline)
            if (SECONDARY_DISCIPLINES.includes(discipline)) {
                setIsExpanded(true)
            }
        }
    }, [searchParams])

    const filtered = activeTab === "All"
        ? companies
        : companies.filter(o => o.discipline === activeTab)

    return (
        <div className="py-2">

            <div id="discovery" className="flex flex-col gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
                    <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
                </div>

                <div className="relative">
                    {/* Primary Row - Horizontal Scroll */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full pb-1 pr-1">
                        {PRIMARY_DISCIPLINES.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border
                                    ${activeTab === tab
                                        ? "text-indigo-900 bg-indigo-50 border-indigo-200 shadow-sm"
                                        : "text-slate-500 bg-white border-slate-200 hover:border-indigo-200 hover:text-indigo-600"}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`ml-1 rounded-full w-9 h-9 p-0 border shrink-0 transition-all duration-300 
                                ${isExpanded
                                    ? 'bg-indigo-600 text-white border-indigo-600 rotate-90 hover:bg-indigo-700 hover:text-white'
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Secondary Row - Expandable Area */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2 flex flex-wrap gap-2">
                                    {SECONDARY_DISCIPLINES.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`
                                                relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border
                                                ${activeTab === tab
                                                    ? "text-indigo-900 bg-indigo-50 border-indigo-200 shadow-sm"
                                                    : "text-slate-500 bg-white border-slate-200 hover:border-indigo-200 hover:text-indigo-600"}
                                            `}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex flex-col gap-5 w-full min-h-[400px]">
                <AnimatePresence mode="wait">
                    {filtered.length > 0 ? (
                        <motion.div
                            key={activeTab} // Key changes trigger re-animation of the container
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.02 // Very fast stagger
                                    }
                                }
                            }}
                            className="flex flex-col gap-5 w-full"
                        >
                            {filtered.map((item) => (
                                <CompanyCard key={item.id} item={item} basePath={basePath} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                            className="w-full py-16 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center p-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <Building2 className="w-6 h-6 text-slate-300" />
                            </div>
                            <h3 className="text-slate-900 font-medium mb-1">No opportunities found</h3>
                            <p className="text-sm text-slate-500">We couldn't find any visits for <span className="font-semibold text-indigo-600">{activeTab}</span> yet.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
