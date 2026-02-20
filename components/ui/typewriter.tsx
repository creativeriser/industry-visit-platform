"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TypewriterProps {
    text: string
    className?: string
    cursorClassName?: string
    speed?: number
    delay?: number
}

export function Typewriter({
    text,
    className,
    cursorClassName,
    speed = 0.1,
    delay = 0
}: TypewriterProps) {
    const characters = Array.from(text)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: speed,
                delayChildren: delay,
            },
        },
    }

    const charVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <motion.span
            className={cn("inline-flex items-center", className)}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {characters.map((char, index) => (
                <motion.span key={index} variants={charVariants}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
            <motion.span
                className={cn("ml-1 w-[3px] h-[1em] bg-secondary inline-block", cursorClassName)}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "linear",
                    delay: delay + (characters.length * speed)
                }}
            />
        </motion.span>
    )
}
