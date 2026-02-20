"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TypewriterRotatorProps {
    texts: string[]
    className?: string
    waitDuration?: number
}

export function TypewriterRotator({
    texts,
    className,
    waitDuration = 2500,
}: TypewriterRotatorProps) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length)
        }, waitDuration)

        return () => clearInterval(timer)
    }, [texts, waitDuration])

    return (
        <div className={cn("inline-grid grid-cols-1 items-center justify-items-center relative overflow-hidden h-[1.2em] w-full", className)}>
            {/* Invisible spacer to set width based on longest word */}
            <span className="invisible col-start-1 row-start-1 pointer-events-none opacity-0 px-2">
                {texts.reduce((a, b) => (a.length > b.length ? a : b))}
            </span>

            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={texts[index]}
                    className="col-start-1 row-start-1 text-center"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-110%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                >
                    {texts[index]}
                </motion.span>
            </AnimatePresence>
        </div>
    )
}
