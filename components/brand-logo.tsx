"use client"

import { useId } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Leaf = ({ rotate, x, y, scale = 1 }: { rotate: number, x: number, y: number, scale?: number }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
        <path d="M 0 0 C -4.5 -6 -4.5 -14 0 -18 C 4.5 -14 4.5 -6 0 0 Z" fill="#1e4d7a" />
    </g>
);

const WreathBranch = ({ flip = false }: { flip?: boolean }) => {
    const leaves = Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const p0 = { x: 50.5, y: 92 }, p1 = { x: 18, y: 88 }, p2 = { x: 2, y: 55 }, p3 = { x: 20, y: 15 };
        const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

        const dx = 3 * Math.pow(1 - t, 2) * (p1.x - p0.x) + 6 * (1 - t) * t * (p2.x - p1.x) + 3 * Math.pow(t, 2) * (p3.x - p2.x);
        const dy = 3 * Math.pow(1 - t, 2) * (p1.y - p0.y) + 6 * (1 - t) * t * (p2.y - p1.y) + 3 * Math.pow(t, 2) * (p3.y - p2.y);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;

        return { x, y, angle, scale: 1 - t * 0.4 };
    });

    return (
        <g transform={flip ? "translate(100, 0) scale(-1, 1)" : ""}>
            <path d="M 50.5 92 C 18 88, 2 55, 20 15" stroke="#1e4d7a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {leaves.map((leaf, i) => (
                <g key={`pair-${i}`}>
                    <Leaf x={leaf.x} y={leaf.y} rotate={leaf.angle - 45} scale={leaf.scale} />
                    {i < 8 && <Leaf x={leaf.x} y={leaf.y} rotate={leaf.angle + 45} scale={leaf.scale} />}
                </g>
            ))}
        </g>
    );
};

const Bus = () => (
    <g transform="translate(8.5, 8.5) scale(0.82)" stroke="#357dbf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 27 35 H 66 C 75 35, 78 40, 79 48 V 53 C 79 56, 77 58, 74 58 H 68 A 4 4 0 0 0 60 58 H 36 A 4 4 0 0 0 28 58 V 35 Z" />
        <circle cx="64" cy="58" r="1.5" fill="#357dbf" stroke="none" />

        <rect x="30" y="39" width="8" height="9" rx="0.5" />
        <rect x="43" y="39" width="10" height="9" rx="0.5" />
        <path d="M 58 39 H 68 C 72 39, 75 42, 76 48 H 58 V 39 Z" />
    </g>
);

const Gear = ({ id }: { id: string }) => (
    <g fill="#f18931" transform="scale(0.82)">
        <mask id={`gear-hole-${id}`}>
            <rect x="-15" y="-15" width="30" height="30" fill="white" />
            <circle cx="0" cy="0" r="3.5" fill="black" />
        </mask>
        <g mask={`url(#gear-hole-${id})`}>
            <circle cx="0" cy="0" r="7.8" />
            {[0, 45, 90, 135].map(deg => (
                <rect key={deg} x="-2.5" y="-11" width="5" height="22" rx="0.5" transform={`rotate(${deg})`} />
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
                    <defs>
                        <mask id={`scene-mask-${finalId}`}>
                            <rect x="0" y="0" width="100" height="100" fill="white" />
                            <circle cx="34.7" cy="56.1" r="10.5" fill="black" />
                        </mask>
                    </defs>

                    <g mask={`url(#scene-mask-${finalId})`}>
                        <WreathBranch />
                        <WreathBranch flip />

                        <motion.g
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                        >
                            <Bus />
                        </motion.g>
                    </g>

                    <motion.g
                        initial={{ opacity: 0, scale: 0, rotate: -90, x: 34.7, y: 56.1 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0, x: 34.7, y: 56.1 }}
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
