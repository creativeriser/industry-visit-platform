"use client"

import { motion } from "framer-motion"
import { Scan, Fingerprint, Activity, Server, Shield } from "lucide-react"

export function KineticHub() {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0B1121] flex items-center justify-center font-sans">
            {/* 1. ATMOSPHERE: Blueprint / Clean Room */}
            {/* Subtle Gradient Spotlights */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.08),transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.08),transparent_50%)]" />

            {/* Isometric Grid Floor */}
            <div
                className="absolute inset-x-0 bottom-0 h-[60%] opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, #e2e8f0 25%, #e2e8f0 26%, transparent 27%, transparent 74%, #e2e8f0 75%, #e2e8f0 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #e2e8f0 25%, #e2e8f0 26%, transparent 27%, transparent 74%, #e2e8f0 75%, #e2e8f0 76%, transparent 77%, transparent)',
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to top, black, transparent)'
                }}
            />

            {/* 2. CORE: MACRO KINETIC APERTURE */}
            <div className="relative z-10 w-[500px] h-[500px] flex items-center justify-center">

                {/* Ring 1: The Stabilizer (Slow, Heavy) */}
                <motion.div
                    className="absolute inset-[10%] rounded-full border border-slate-700/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                >
                    {/* Ticks */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-0 left-1/2 w-px h-3 bg-slate-600/50 origin-bottom"
                            style={{ transform: `rotate(${i * 45}deg) translateY(-50%)` }}
                        />
                    ))}
                </motion.div>

                {/* Ring 2: The Scanner (Active, Springy) */}
                <motion.div
                    className="absolute inset-[25%] rounded-full border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-blue-400"
                        style={{ transform: 'translate(-50%, -50%)' }}
                        animate={{ boxShadow: ['0 0 0 0px rgba(96, 165, 250, 0.4)', '0 0 0 10px rgba(96, 165, 250, 0)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                {/* Ring 3: The Aperture Blades (Breathing) */}
                <motion.div
                    className="absolute inset-[38%] flex items-center justify-center"
                    animate={{ rotate: 90 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-[140px] h-[140px] border-t border-r border-slate-400/20 rounded-tr-[40px]"
                            style={{ rotate: i * 60, originX: 0.5, originY: 0.5 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                        />
                    ))}
                </motion.div>

                {/* Central Kernel */}
                <div className="relative w-28 h-28 bg-[#1e293b]/50 backdrop-blur-xl rounded-full border border-slate-700/50 flex items-center justify-center z-20 shadow-2xl">
                    <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-ping-slow" />
                    <Shield className="w-8 h-8 text-blue-400/80" strokeWidth={1.5} />
                </div>
            </div>

            {/* 3. MICRO-INTERACTION PANES (Glass UI) */}
            {/* Top Left: System Status */}
            <motion.div
                className="absolute top-16 left-16 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-3 rounded-lg flex items-center gap-3 w-48 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">System Status</span>
                    <span className="text-xs text-slate-300 font-semibold font-mono">OPERATIONAL</span>
                </div>
            </motion.div>

            {/* Bottom Right: Active Nodes */}
            <motion.div
                className="absolute bottom-24 right-16 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-3 rounded-lg flex items-center gap-3 w-auto shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
            >
                <Server className="w-4 h-4 text-indigo-400" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Verified Nodes</span>
                    <div className="flex items-end gap-1">
                        <span className="text-sm text-slate-200 font-bold font-mono">542</span>
                        <span className="text-[10px] text-emerald-500 mb-0.5">+12%</span>
                    </div>
                </div>
            </motion.div>

            {/* Center Bottom Text */}
            <div className="absolute bottom-10 inset-x-0 text-center pointer-events-none">
                <p className="text-[10px] text-slate-600 font-mono tracking-[0.2em] uppercase">
                    Secure Infrastructure v2.4.0
                </p>
            </div>

        </div>
    )
}
