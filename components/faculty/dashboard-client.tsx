"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/faculty/dashboard-header"
import { RecommendationRail } from "@/components/faculty/recommendation-rail"
import { IndustryGrid } from "@/components/faculty/industry-grid"
import { motion, AnimatePresence } from "framer-motion"
import { Company } from "@/lib/companies"
import { CompanyCard } from "@/components/faculty/company-card"
import { Search } from "lucide-react"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"

interface DashboardClientProps {
    companies: Company[]
}

export function DashboardClient({ companies }: DashboardClientProps) {
    const { user, loading } = useUser()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    // Filter logic
    const filteredResults = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    let missingFields: string[] = [];
    if (!loading && user) {
        if (!user.fullName) missingFields.push("Full Name");
        if (!user.institution) missingFields.push("Institution");
        if (!user.department) missingFields.push("Department");
        if (!user.designation) missingFields.push("Designation");
        if (!user.phone) missingFields.push("Phone Number");
        if (!user.discipline) missingFields.push("Discipline");
    }
    const isProfileIncomplete = missingFields.length > 0;

    return (
        <div id="dashboard-scroll-container" className="min-h-screen">
            <DashboardHeader onSearch={setSearchQuery} />

            <div className="max-w-[1600px] mx-auto p-8 space-y-12">
            
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
                                    Please provide your <span className="font-bold">{missingFields.join(", ")}</span> to officially dispatch visits.
                                </span>
                            </div>
                        </div>
                        <button onClick={() => router.push('/faculty/profile')} className="text-sm font-bold bg-white text-red-700 px-5 py-2 rounded-xl border border-red-200 hover:bg-red-100 transition-colors shrink-0 shadow-sm hover:shadow active:scale-95">
                            Fix Now
                        </button>
                    </motion.div>
                )}

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
