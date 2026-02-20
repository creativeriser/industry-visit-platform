"use client"

import { useId } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function BrandLogo({ className, showText = true, id }: { className?: string, showText?: boolean, id?: string }) {
    const generatedId = useId()
    const finalId = id || generatedId
    const gradientId = `aperture-gradient-${finalId}`
    const filterId = `glow-${finalId}`

    return (
        <div className={cn("flex items-center gap-3 group cursor-pointer select-none", className)}>
            {/* The Kinetic Aperture Icon */}
            <motion.div
                className="relative w-9 h-9 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" className="text-primary" />
                            <stop offset="100%" stopColor="currentColor" className="text-secondary" />
                        </linearGradient>
                        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Rotating Container */}
                    <motion.g
                        className="origin-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        {/* 6 Iris Blades - Stroke Based (Iteration 3) */}
                        {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
                            <motion.path
                                key={i}
                                d="M 16 6 C 18 6, 22 10, 22 16 C 22 22, 16 26, 16 26"
                                stroke={`url(#${gradientId})`}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                                className="opacity-90"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                style={{ transformOrigin: "16px 16px", rotate: rotation }}
                                whileHover={{
                                    y: -3, // Slide outward "Opening the Iris"
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                            />
                        ))}
                    </motion.g>

                    {/* Central Core Glow */}
                    <motion.circle
                        cx="16"
                        cy="16"
                        r="3"
                        fill="currentColor"
                        className="text-primary/20 blur-sm"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>

                {/* Ambient Backdrop Glow */}
                <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Typography Wordmark - Unified Editorial Look & Stable Animation */}
            {showText && (
                <div className="flex flex-col leading-none overflow-hidden">
                    <motion.div
                        className="flex items-baseline"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        {/* "Uni" - Black Italic Serif */}
                        <span className="font-serif font-black italic text-[22px] text-primary tracking-tight">
                            Uni
                        </span>

                        {/* "Visit" - Bold Serif (Unified) */}
                        <span className="font-serif font-bold text-[22px] text-secondary tracking-tight ml-0.5">
                            Visit
                        </span>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
