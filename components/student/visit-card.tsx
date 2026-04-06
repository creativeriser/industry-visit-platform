"use client"

import { motion } from "framer-motion"
import { Building2, Calendar, MapPin, Check, Clock, XCircle } from "lucide-react"
import { getDisciplineIcon } from "@/lib/utils"
import { ApplyButton } from "@/app/student/apply-button"

interface VisitCardProps {
    visit: any;
    studentId: string;
    profile: any;
    onApplySuccess: () => void;
    isCrossStream?: boolean;
}

export function VisitCard({ visit, studentId, profile, onApplySuccess, isCrossStream = false }: VisitCardProps) {
    const DisciplineIcon = getDisciplineIcon(visit.company.discipline)
    const myApplication = visit.applications?.find((app: any) => app.student_id === studentId)

    return (
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
            initial="hidden"
            animate="show"
            className="group relative bg-white rounded-3xl p-4 min-h-[140px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-900/5 hover:border-sky-100 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-6 overflow-hidden w-full"
        >
            {/* Enlarged Image Thumbnail (Landscape 4:3) - Exactly like Faculty */}
            <div className="h-32 w-48 shrink-0 relative rounded-2xl overflow-hidden shadow-sm hidden sm:block">
                <div className="absolute inset-0 z-10 bg-slate-900/5 group-hover:bg-transparent transition-colors" />
                {visit.company.image ? (
                    <img src={visit.company.image} alt={visit.company.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Building2 className="w-8 h-8 text-slate-300" /></div>
                )}
                {isCrossStream && (
                     <div className="absolute bottom-2 left-2 z-20 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border border-amber-400 shadow-sm">
                        Cross-Stream
                     </div>
                )}
            </div>

            {/* Mobile Image */}
            <div className="h-40 w-full sm:hidden relative rounded-2xl overflow-hidden shadow-sm shrink-0">
               {visit.company.image ? (
                    <img src={visit.company.image} alt={visit.company.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Building2 className="w-8 h-8 text-slate-300" /></div>
                )}
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-4 py-1 w-full">
                <div>
                     <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-sky-700 transition-colors">{visit.company.name}</h3>
                     </div>

                     <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-sm text-slate-500 font-medium w-full">
                          <div className="flex items-center gap-2 max-w-full">
                               <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                               <span className="truncate">{visit.company.location}</span>
                          </div>
                          <div className="hidden sm:block text-slate-200 shrink-0">|</div>
                          <div className="flex items-center gap-1.5 max-w-full min-w-0">
                               <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                               <span className="truncate relative top-[1px]">{visit.proposed_date}</span>
                          </div>
                     </div>
                </div>

                {/* Tags perfectly listed under title like Faculty */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${isCrossStream ? 'text-amber-700 bg-amber-50 border-amber-100/50' : 'text-sky-700 bg-sky-50 border-sky-100/50'}`}>
                         <DisciplineIcon className="w-3 h-3" />
                         {visit.company.discipline}
                    </span>

                    <span className="text-slate-200">|</span>

                    <span className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" />
                        {visit.company.type}
                    </span>
                </div>
            </div>

            {/* Apply Action (Right Side) */}
            <div className="w-full sm:w-auto min-w-[180px] shrink-0 sm:pr-2">
                {myApplication ? (
                    <div className={`flex items-center justify-center p-3 rounded-xl font-bold border text-xs uppercase tracking-wider gap-2 w-full h-12 shadow-sm ${
                        myApplication.status === 'applied' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        myApplication.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        'bg-red-50 text-red-600 border-red-200'
                    }`}>
                        {myApplication.status === 'applied' && <><Clock className="w-4 h-4 shrink-0" /> Pending</>}
                        {myApplication.status === 'accepted' && <><Check className="w-4 h-4 shrink-0" /> Accepted</>}
                        {myApplication.status === 'rejected' && <><XCircle className="w-4 h-4 shrink-0" /> Not Selected</>}
                    </div>
                ) : (
                     <div className="w-full h-12 relative flex items-center justify-center -mt-1">
                         <ApplyButton visitId={visit.id} studentId={studentId} profile={profile} onApplySuccess={onApplySuccess} />
                     </div>
                )}
            </div>
        </motion.div>
    )
}
