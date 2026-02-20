"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

interface DisciplineCardProps {
    name: string
    href: string
    index: number
}

export function DisciplineCard({ name, href, index }: DisciplineCardProps) {
    return (
        <Link href={href} className="block h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover="hover"
                className="group relative h-32 flex flex-col items-center justify-center rounded-xl border bg-card p-6 shadow-sm transition-colors cursor-pointer overflow-hidden"
            >
                {/* Hover Background Gradient */}
                <motion.div
                    variants={{
                        hover: { opacity: 1 }
                    }}
                    initial={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-300"
                />

                {/* Animated Border (using box-shadow for performance/simplicity) */}
                <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-transparent"
                    variants={{
                        hover: { borderColor: "var(--color-secondary)" }
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center w-full">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 text-center text-lg">
                        {name}
                    </span>
                </div>

                {/* Floating Arrow Icon */}
                <motion.div
                    variants={{
                        hover: { opacity: 1, x: 0, y: 0 }
                    }}
                    initial={{ opacity: 0, x: -10, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-3 right-3 text-secondary"
                >
                    <ArrowUpRight className="h-5 w-5" />
                </motion.div>

            </motion.div>
        </Link>
    )
}
