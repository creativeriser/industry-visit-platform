"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface UserProfileProps {
    name: string
    avatarFallback: string
    basePath?: string
}

export function UserProfileMenu({ name, avatarFallback, basePath = "/faculty" }: UserProfileProps) {
    const router = useRouter()

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`${basePath}/profile`)}
            className="relative h-11 w-11 rounded-full p-0.5 transition-all duration-300 bg-gradient-to-br from-slate-200 to-slate-300 hover:from-indigo-400 hover:to-violet-500 group"
        >
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden relative z-10">
                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {avatarFallback}
                </span>
            </div>

        </motion.button>
    )
}
