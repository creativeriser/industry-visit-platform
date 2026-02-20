"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/faculty/dashboard-header"
import { RecommendationRail } from "@/components/faculty/recommendation-rail"
import { IndustryGrid } from "@/components/faculty/industry-grid"
import { motion, AnimatePresence } from "framer-motion"
import { Company } from "@/lib/companies"
import { CompanyCard } from "@/components/faculty/company-card"
import { Search } from "lucide-react"

interface DashboardClientProps {
    companies: Company[]
}

export function DashboardClient({ companies }: DashboardClientProps) {
    const [searchQuery, setSearchQuery] = useState("")

    // Filter logic
    const filteredResults = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div id="dashboard-scroll-container" className="min-h-screen">
            <DashboardHeader onSearch={setSearchQuery} />

            <div className="max-w-[1600px] mx-auto p-8 space-y-12">

                {searchQuery ? (
                    // SEARCH RESULTS VIEW
                    <motion.div
                        key="search-results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-full">
                                <Search className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Search Results for <span className="text-indigo-600">"{searchQuery}"</span>
                            </h2>
                            <span className="text-sm font-medium text-slate-400 ml-2">
                                ({filteredResults.length} found)
                            </span>
                        </div>

                        {filteredResults.length > 0 ? (
                            <div className="flex flex-col gap-5 w-full">
                                {filteredResults.map((item) => (
                                    <CompanyCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                                <p className="text-slate-500 font-medium">No matches found for "{searchQuery}"</p>
                                <p className="text-slate-400 text-sm mt-1">Try searching for a different company, city, or technology.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    // DEFAULT DASHBOARD VIEW
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key="dashboard-content"
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.section
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <RecommendationRail companies={companies} />
                            </motion.section>

                            <div className="h-px bg-slate-200 my-12" />

                            <motion.section
                                id="discovery"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <IndustryGrid companies={companies} />
                            </motion.section>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
