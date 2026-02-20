"use client"

import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/context/user-context"
import { getDisciplineIcon } from "@/lib/utils"

interface CompanyCardProps {
    item: {
        id: number
        name: string
        location: string
        discipline: string
        image: string
        tags: string[]
    }
    basePath?: string
}

export function CompanyCard({ item, basePath = "/faculty" }: CompanyCardProps) {
    const { user, toggleShortlist, loading } = useUser()
    const isShortlisted = user.shortlist?.includes(item.id) || false
    const DisciplineIcon = getDisciplineIcon(item.discipline)

    return (
        <Link href={`${basePath}/visit/${item.id}`} className="block w-full">
            <motion.div
                variants={{
                    hidden: { opacity: 0, scale: 0.98, y: 5 },
                    show: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                            duration: 0.25,
                            ease: "easeOut"
                        }
                    }
                }}
                className="group relative bg-white rounded-3xl p-4 min-h-[140px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-100 transition-all duration-300 cursor-pointer flex items-start sm:items-center gap-6"
            >
                {/* Enlarged Image Thumbnail (Landscape 4:3) */}
                <div className="h-32 w-48 shrink-0 relative rounded-2xl overflow-hidden shadow-sm hidden sm:block">
                    <div className="absolute inset-0 z-10 bg-slate-900/5 group-hover:bg-transparent transition-colors" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-5 py-1">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{item.name}</h3>
                        </div>

                        <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {item.location}
                        </p>
                    </div>

                    {/* Discipline Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Primary Discipline Tag */}
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50 flex items-center gap-1.5">
                            <DisciplineIcon className="w-3 h-3" />
                            {item.discipline}
                        </span>

                        {/* Divider */}
                        <span className="text-slate-200">|</span>

                        {/* Specific Domain Tags */}
                        {item.tags.map((tag, i) => (
                            <span key={i} className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Action - Large Arrow Circle */}
                <div className="pr-12 mr-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all shadow-sm group-hover:shadow-indigo-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                </div>

                {/* Shortlist Button (Top Right Absolute) */}
                <div className="absolute top-3 right-3 z-20">
                    <button
                        disabled={loading}
                        onClick={(e) => {
                            e.preventDefault() // Prevent navigation when clicking bookmark
                            e.stopPropagation()
                            if (!loading) toggleShortlist(item.id)
                        }}
                        className={`
                            p-2.5 rounded-full backdrop-blur-md border shadow-sm transition-all duration-300
                            ${loading ? "opacity-50 cursor-not-allowed" : ""}
                            ${isShortlisted
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                : "bg-white/80 border-slate-200/50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100"}
                        `}
                    >
                        <Bookmark className={`w-4 h-4 ${isShortlisted ? "fill-indigo-600" : ""}`} />
                    </button>
                </div>
            </motion.div>
        </Link>
    )
}
