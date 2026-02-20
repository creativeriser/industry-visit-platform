"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BrandLogo } from "@/components/brand-logo"
import { School, GraduationCap } from "lucide-react"
import { ActiveRole } from "@/app/get-started/page"

interface AppleApertureProps {
    activeRole: ActiveRole
}

export function AppleAperture({ activeRole }: AppleApertureProps) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white flex items-center justify-center font-sans">
            {/* 1. ATMOSPHERE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)]" />

            {/* 2. THE MONOLITH APERTURE */}
            <div className="relative z-10 w-[600px] h-[600px] flex items-center justify-center">

                {/* Ring 1 - Outer */}
                <motion.div
                    className="absolute inset-0 rounded-full border-[2px] border-slate-100 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
                />

                {/* Ring 2 - Mechanism */}
                <motion.div
                    className="absolute inset-[10%] rounded-full border-[40px] border-slate-50/50 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                    animate={{ scale: [1, 1.02, 1], rotate: -20 }}
                    transition={{
                        scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 180, repeat: Infinity, ease: "linear" }
                    }}
                >
                    <div className="absolute inset-0 rounded-full border border-white/80" />
                </motion.div>

                {/* Ring 3 - Aperture Blades */}
                <motion.div
                    className="absolute inset-[25%] flex items-center justify-center"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                >
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-[250px] h-[250px] bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100/50"
                            style={{
                                originX: 0.5, originY: 1.5,
                                rotate: i * 60,
                                clipPath: 'inset(0 0 50% 0)'
                            }}
                            animate={{ translateY: [0, -20, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        />
                    ))}
                </motion.div>

                {/* 3. DYNAMIC CORE */}
                <div className="relative z-20 scale-[3]">
                    <div className="absolute inset-0 bg-blue-50/30 blur-2xl rounded-full scale-150" />

                    <AnimatePresence mode="wait">
                        {activeRole === null ? (
                            <motion.div
                                key="default-logo"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                <BrandLogo showText={false} />
                            </motion.div>
                        ) : activeRole === "faculty" ? (
                            <motion.div
                                key="faculty-logo"
                                initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                                transition={{ duration: 0.4, type: "spring" }}
                                className="relative z-10 w-8 h-8 flex items-center justify-center bg-indigo-50 rounded-lg text-indigo-600 shadow-sm"
                            >
                                <School className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="student-logo"
                                initial={{ opacity: 0, scale: 0.8, rotate: 45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: -45 }}
                                transition={{ duration: 0.4, type: "spring" }}
                                className="relative z-10 w-8 h-8 flex items-center justify-center bg-sky-50 rounded-lg text-sky-600 shadow-sm"
                            >
                                <GraduationCap className="w-5 h-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        </div>
    )
}
