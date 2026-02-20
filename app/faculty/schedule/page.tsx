"use client"

import { motion } from "framer-motion"
import { CalendarClock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScheduleVisitPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto p-6 md:p-8 space-y-8"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                    <CalendarClock className="w-6 h-6 text-indigo-600" />
                    Schedule Industry Visit
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    Select a shortlisted industry and plan a visit for your students.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center py-24 flex flex-col items-center"
            >
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <CalendarClock className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">No visits scheduled yet</h2>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                    Start by contacting an industry representative from your shortlist. Once confirmed, you can formalize the schedule here.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform duration-100">
                    Create New Schedule <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </motion.div>
    )
}
