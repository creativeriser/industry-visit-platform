"use client"

import { motion } from "framer-motion"
import { UserCircle2, BrainCircuit, CalendarCheck2, Award } from "lucide-react"


const steps = [
    {
        id: "profile",
        icon: UserCircle2,
        title: "Industry Discovery",
        description: "Browse a curated network of top-tier facilities matched to your discipline."
    },
    {
        id: "match",
        icon: BrainCircuit,
        title: "Direct Connection",
        description: "Contact company representatives directly to schedule and customize visits."
    },
    {
        id: "book",
        icon: CalendarCheck2,
        title: "Visit Management",
        description: "Organize logistics, student batches, and schedules in one dashboard."
    },
    {
        id: "execution",
        icon: Award,
        title: "Live Verification",
        description: "Generate digital gate passes and track real-time student attendance on the day."
    }
]

export function ProcessTimeline() {
    return (
        <section className="py-16 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <span className="h-px w-8 bg-slate-300"></span>
                        <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Seamless Integration</span>
                        <span className="h-px w-8 bg-slate-300"></span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4"
                    >
                        How It Works
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 leading-relaxed font-medium"
                    >
                        From theory to floor in <span className="text-slate-900">four steps</span>.
                    </motion.p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Connecting Line (Desktop) - Lowered to center vertically with icons */}
                    <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-blue-50 -z-10 px-12">
                        <motion.div
                            className="h-full bg-blue-200 origin-left"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Steps Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                variants={{
                                    hidden: { opacity: 0, y: 15 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                                }}
                                whileHover="hover"
                                className="relative flex flex-col items-center text-center group px-4 cursor-default"
                            >
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[100px] leading-none font-bold text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 select-none pointer-events-none font-sans z-0">
                                    0{index + 1}
                                </div>
                                <motion.div
                                    className="relative mb-4"
                                    variants={{
                                        hover: { y: -5 }
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <motion.div
                                        className="h-16 w-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center z-10"
                                        variants={{
                                            hover: {
                                                borderColor: "#BFDBFE", // blue-200
                                                boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.2)",
                                                backgroundColor: "#EFF6FF" // blue-50
                                            }
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.div
                                            variants={{
                                                hover: {
                                                    scale: 1.1,
                                                    rotate: step.id === 'profile' ? [0, -10, 10, 0] : 0,
                                                    y: step.id === 'book' ? [0, -2, 0] : 0,
                                                }
                                            }}
                                            transition={{
                                                rotate: { repeat: Infinity, duration: 1.5, repeatType: "reverse", ease: "easeInOut" },
                                                y: { repeat: Infinity, duration: 1, repeatType: "reverse", ease: "easeInOut" },
                                                scale: { duration: 0.2 }
                                            }}
                                        >
                                            <step.icon className="h-8 w-8 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" />
                                        </motion.div>
                                    </motion.div>
                                    {/* Mobile Vertical Line Connection */}
                                    {index !== steps.length - 1 && (
                                        <div className="md:hidden absolute top-16 left-1/2 w-0.5 h-12 bg-slate-100 -translate-x-1/2" />
                                    )}
                                </motion.div>

                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors tracking-tight">{step.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px] font-medium">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </div >
        </section >
    )
}
