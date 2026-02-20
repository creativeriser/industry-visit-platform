"use client"

import { motion } from "framer-motion"


export function IntelligentDiscoveryIcon({ active }: { active: boolean }) {
    // CONCEPT: THE INTELLIGENT APERTURE (STRICT SPEC)
    // Style: Apple Park Architecture / Clean Geometry

    // Animation Loop (6s) (Refined for Smaller, Crisper Elements)

    return (
        <div className="w-full h-full flex items-center justify-center relative pointer-events-none">

            {/* CANVAS: 280x280 Frameless */}
            <svg width="280" height="280" viewBox="-140 -140 280 280" className="overflow-visible">

                {/* 1. OUTER RING: 3 Thin, Segmented Arcs */}
                <motion.g
                    animate={active ? { rotate: -360 } : {}}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    opacity="0.4"
                >
                    <path d="M-120,0 A120,120 0 0,1 -60,-104" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                    <path d="M60,104 A120,120 0 0,1 120,0" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                    <path d="M-60,104 A120,120 0 0,1 60,104" stroke="#cbd5e1" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                </motion.g>

                {/* 2. THE IRIS BLADES (Aperture) */}
                <motion.g
                    animate={active ? {
                        rotate: [0, 10, 0, 50, 50, 50, 0],
                        scale: [1, 1.05, 1, 0.95, 0.95, 0.95, 1]
                    } : {}}
                    transition={{
                        duration: 6,
                        times: [0, 0.33, 0.4, 0.5, 0.6, 0.85, 1],
                        repeat: Infinity,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                >
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.path
                            key={i}
                            d="M-40,-80 Q0,-70 40,-80 L30,-30 Q0,-20 -30,-30 Z"
                            fill="none"
                            stroke="#64748b"
                            strokeWidth="1.5"
                            transform={`rotate(${i * 60}) translate(0, -40)`}
                        />
                    ))}
                    <circle r="70" stroke="#cbd5e1" strokeWidth="1" fill="none" opacity="0.3" />
                </motion.g>

                {/* 3. THE IMPACT RIPPLE (Secondary Ring) - Adjusted for r=20 */}
                <motion.circle
                    r="20" // Compact
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={active ? {
                        scale: [1, 1, 1, 1.6, 1.6], // Larger expansion relative to small base
                        opacity: [0, 0, 0, 0.4, 0]
                    } : {}}
                    transition={{
                        duration: 6,
                        times: [0, 0.69, 0.7, 0.85, 1],
                        repeat: Infinity
                    }}
                />

                {/* 4. THE MORPHING CORE (Eye -> Success Badge) */}
                {/* Refined: Reduced Max Radius to 20 for Sleekness */}
                <motion.circle
                    initial={{ scale: 0, r: 8, fill: "#3b82f6" }}
                    animate={active ? {
                        scale: [0, 0, 1.5, 1, 1, 1, 0],
                        r: [8, 8, 8, 8, 20, 20, 8], // Morph: 8 -> 20 (Sleek)
                        fill: ["#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6", "#10b981", "#10b981", "#3b82f6"],
                        opacity: [0, 0, 1, 1, 1, 1, 0]
                    } : {}}
                    transition={{
                        duration: 6,
                        times: [0, 0.48, 0.5, 0.65, 0.7, 0.9, 1],
                        repeat: Infinity,
                        ease: "anticipate"
                    }}
                    style={{ filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.2))" }}
                />

                {/* 5. THE WHITE TICK (Refined to fit r=20) */}
                <motion.path
                    d="M-10,2 L-3,9 L9,-9"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3" // Reduced from 3.5 for elegance
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0, scale: 0.5 }}
                    animate={active ? {
                        pathLength: [0, 0, 0, 1, 1],
                        opacity: [0, 0, 0, 1, 0],
                        scale: [0.5, 0.5, 0.5, 0.9, 0.5] // Scale to 0.9 to fit perfectly inside r=20
                    } : {}}
                    transition={{
                        duration: 6,
                        times: [0, 0.72, 0.75, 0.85, 1],
                        repeat: Infinity,
                        ease: "backOut"
                    }}
                />

                {/* 6. TARGET RETICLE */}
                <motion.g
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={active ? {
                        opacity: [0, 0, 1, 1, 0],
                        rotate: [0, 0, 90, 90, 0],
                        scale: [1.2, 1.2, 1, 1, 1.2]
                    } : {}}
                    transition={{
                        duration: 6,
                        times: [0, 0.48, 0.5, 0.9, 1],
                        repeat: Infinity
                    }}
                >
                    <path d="M-40,-40 L-20,-40 M-40,-40 L-40,-20" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    <path d="M40,-40 L20,-40 M40,-40 L40,-20" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    <path d="M-40,40 L-20,40 M-40,40 L-40,20" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    <path d="M40,40 L20,40 M40,40 L40,20" stroke="#3b82f6" strokeWidth="2" fill="none" />
                </motion.g>

            </svg>

            {/* LABEL - Clean */}
            <motion.div
                className="absolute -bottom-12 left-0 right-0 text-center"
                animate={active ? { opacity: [0, 0, 1, 1, 0] } : {}}
                transition={{ duration: 6, times: [0, 0.48, 0.5, 0.9, 1], repeat: Infinity }}
            >
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                        SYSTEM ACTIVE
                    </span>
                    <div className="w-12 h-0.5 bg-slate-200 overflow-hidden relative">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-blue-500"
                            animate={active ? { width: ["0%", "100%"] } : {}}
                            transition={{ duration: 2.5, delay: 3, repeat: Infinity, repeatDelay: 3.5 }}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
