"use client"

import { motion } from "framer-motion"
import { Bookmark, LayoutDashboard } from "lucide-react"
import { useUser } from "@/context/user-context"
import { Company } from "@/lib/companies"
import { CompanyCard } from "@/components/faculty/company-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ShortlistClientProps {
    companies: Company[]
}

export function ShortlistClient({ companies }: ShortlistClientProps) {
    const { user } = useUser()
    const savedIds = user.shortlist || []

    // Filter companies that are in the user's shortlist
    const shortlistedCompanies = companies.filter(c => savedIds.includes(c.id))

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto p-6 space-y-8"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                    <Bookmark className="w-6 h-6 text-indigo-600 fill-indigo-600" />
                    My Shortlist
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    Manage and review your selected industries for potential visits.
                </p>
            </div>

            {shortlistedCompanies.length > 0 ? (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                    className="grid grid-cols-1 gap-5"
                >
                    {shortlistedCompanies.map((item) => (
                        <CompanyCard key={item.id} item={item} />
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center py-24 flex flex-col items-center"
                >
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <Bookmark className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Your shortlist is empty</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Browse the discovery section to find and save industries relevant to your students.
                    </p>
                    <Link href="/faculty#discovery">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Browse Industries
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    )
}
