"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    className?: string
    title?: string
    description?: string
}

export function Modal({ isOpen, onClose, children, className, title, description }: ModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) return null

    // Mount to body using portal
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className={cn(
                                "relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto",
                                "border border-slate-100 dark:border-slate-800",
                                className
                            )}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {(title || description) && (
                                <div className="px-6 pt-6 pb-2">
                                    {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
                                    {description && <p className="text-sm text-slate-500 mt-1.5">{description}</p>}
                                </div>
                            )}

                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
