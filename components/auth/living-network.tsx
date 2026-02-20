"use client"

import { motion } from "framer-motion"
import { Building2, GraduationCap, Network, ShieldCheck, Globe } from "lucide-react"

export function LivingNetwork() {
    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
            {/* 1. DEEP ATMOSPHERE */}
            {/* Animated Gradient Mesh */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-slow-spin bg-[conic-gradient(from_0deg_at_50%_50%,#0f172a_0deg,#1e293b_120deg,#0f172a_240deg,#020617_360deg)] opacity-50 blur-3xl" />
            </div>
            {/* Grid Floor */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
                }}
            />

            {/* 2. CORE: GYROSCOPIC SPHERE */}
            <div className="relative z-10 w-[400px] h-[400px] flex items-center justify-center preserve-3d">
                {/* Ring 1: Outer Orbit (Slow) */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-blue-500/20 border-dashed"
                    animate={{ rotateX: 360, rotateY: 180, rotateZ: 45 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />

                {/* Ring 2: Middle Data Stream (Medium) */}
                <motion.div
                    className="absolute inset-12 rounded-full border border-emerald-500/30"
                    style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
                    animate={{ rotateX: -360, rotateZ: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Ring 3: Inner Core (Fast) */}
                <motion.div
                    className="absolute inset-24 rounded-full border-2 border-indigo-400/40"
                    style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }}
                    animate={{ rotateY: 360, rotateX: 45 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Central Nucleus (Pulse) */}
                <motion.div
                    className="relative w-24 h-24 bg-blue-500/10 rounded-full backdrop-blur-sm border border-blue-400/50 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.4)]"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Globe className="w-10 h-10 text-blue-400" />
                </motion.div>
            </div>

            {/* 3. FLOATING DATA NODES (Orbiting) */}
            <FloatingNode delay={0} x={-120} y={-80} icon={GraduationCap} label="500+ Universities" color="text-blue-400" border="border-blue-500/30" />
            <FloatingNode delay={2} x={140} y={-40} icon={Building2} label="Industry Partners" color="text-indigo-400" border="border-indigo-500/30" />
            <FloatingNode delay={4} x={-80} y={120} icon={ShieldCheck} label="Verified Access" color="text-emerald-400" border="border-emerald-500/30" />
            <FloatingNode delay={1.5} x={100} y={90} icon={Network} label="Live Connections" color="text-purple-400" border="border-purple-500/30" />

            {/* Overlay Gradient for Text Readability */}
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

            {/* TEXT CONTENT */}
            <div className="absolute bottom-12 inset-x-0 text-center z-20 px-8">
                <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 tracking-tight">
                    The Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Knowledge Grid</span>
                </h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                    Connecting academic potential with industrial capability in real-time. Secure, verified, and engineered for the future.
                </p>
            </div>
        </div>
    )
}

function FloatingNode({ delay, x, y, icon: Icon, label, color, border }: any) {
    return (
        <motion.div
            className={`absolute flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border ${border} shadow-lg`}
            initial={{ opacity: 0, y: y + 20, x }}
            animate={{
                opacity: 1,
                y: [y, y - 10, y],
                x: x // Keep x constant for now, could orbit later
            }}
            transition={{
                opacity: { delay, duration: 1 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
            }}
        >
            <Icon className={`w-3 h-3 ${color}`} />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">{label}</span>
        </motion.div>
    )
}
