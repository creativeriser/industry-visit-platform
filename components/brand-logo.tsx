"use client"

import { useId } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Leaf = ({ rotate, x, y }: { rotate: number, x: number, y: number }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotate})`}>
        <path d="M 0 0 C -3 -5 -5 -12 0 -16 C 5 -12 3 -5 0 0" fill="#1e4d7a" />
    </g>
);

const WreathBranch = ({ flip = false }: { flip?: boolean }) => (
    <g transform={flip ? "translate(100, 0) scale(-1, 1)" : ""}>
        <path d="M 53 88 C 25 85, 8 60, 15 25" stroke="#1e4d7a" strokeWidth="2" fill="none" strokeLinecap="round" />

        <Leaf x={45} y={86} rotate={-35} />
        <Leaf x={33} y={77} rotate={-50} />
        <Leaf x={21} y={64} rotate={-65} />
        <Leaf x={14} y={48} rotate={-80} />
        <Leaf x={11} y={32} rotate={-95} />
        <Leaf x={14} y={18} rotate={-110} />

        <Leaf x={40} y={82} rotate={10} />
        <Leaf x={29} y={70} rotate={-5} />
        <Leaf x={20} y={55} rotate={-20} />
        <Leaf x={16} y={38} rotate={-35} />
        <Leaf x={16} y={22} rotate={-50} />

        <Leaf x={17} y={10} rotate={-75} />
    </g>
);

const Bus = () => (
    <g stroke="#357dbf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 38 35 H 65 C 74 35, 77 40, 78 48 V 53 C 78 56, 76 58, 73 58 H 68" />
        <path d="M 60 58 H 48" />

        <path d="M 68 58 A 4 4 0 0 0 60 58" />
        <circle cx="64" cy="58" r="1.5" fill="#357dbf" stroke="none" />

        <rect x="40" y="39" width="6" height="9" rx="0.5" />
        <rect x="50" y="39" width="7" height="9" rx="0.5" />
        <path d="M 61 39 H 68 C 71 39, 74 42, 75 48 H 61 V 39 Z" />
    </g>
);

const Gear = ({ id }: { id: string }) => (
    <g fill="#f18931">
        <mask id={`gear-hole-${id}`}>
            <rect x="-15" y="-15" width="30" height="30" fill="white" />
            <circle cx="0" cy="0" r="3.5" fill="black" />
        </mask>
        <g mask={`url(#gear-hole-${id})`}>
            <circle cx="0" cy="0" r="7.5" />
            {[0, 45, 90, 135].map(deg => (
                <rect key={deg} x="-2.25" y="-10" width="4.5" height="20" rx="0.5" transform={`rotate(${deg})`} />
            ))}
        </g>
    </g>
);

export function BrandLogo({ className, showText = true, id }: { className?: string, showText?: boolean, id?: string }) {
    const generatedId = useId()
    const finalId = id || generatedId

    return (
        <div className={cn("flex items-center gap-3 group cursor-pointer select-none", className)}>
            <motion.div
                className="relative flex items-center justify-center shrink-0"
                style={{ width: 44, height: 44 }}
            >
                <motion.svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full overflow-visible drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <WreathBranch />
                    <WreathBranch flip />

                    <motion.g
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    >
                        <Bus />
                    </motion.g>

                    <motion.g
                        initial={{ opacity: 0, scale: 0, rotate: -90, x: 43, y: 53 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0, x: 43, y: 53 }}
                        transition={{ delay: 0.4, duration: 0.6, type: "spring", bounce: 0.4 }}
                    >
                        <Gear id={finalId} />
                    </motion.g>
                </motion.svg>
            </motion.div>

            {showText && (
                <div className="flex flex-col leading-none overflow-hidden">
                    <motion.div
                        className="flex items-baseline"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <span className="font-serif font-black italic text-[22px] text-[#1e4d7a] tracking-tight">
                            Uni
                        </span>
                        <span className="font-serif font-bold text-[22px] text-[#357dbf] tracking-tight ml-0.5">
                            Visit
                        </span>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
