"use client"

import { Suspense, useEffect, useState } from "react"
import { AuthGate } from "@/components/auth/auth-gate"
import { BrandLogo } from "@/components/brand-logo"
import { AppleAperture } from "@/components/auth/apple-aperture"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"

export type ActiveRole = "faculty" | "student" | null

function GetStartedContent() {
    const searchParams = useSearchParams()
    const [activeRole, setActiveRole] = useState<ActiveRole>("faculty")

    useEffect(() => {
        const roleParam = searchParams.get("role")
        if (roleParam === "faculty" || roleParam === "student") {
            setActiveRole(roleParam)
        }
    }, [searchParams])

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* LEFT: Visual / Concept - The Apple Aperture */}
            <div className="hidden md:block w-[45%] relative overflow-hidden bg-white border-r border-slate-50">
                <AppleAperture activeRole={activeRole} />


            </div>

            {/* RIGHT: Action / Form */}
            <div className="flex-1 relative bg-white flex flex-col">
                {/* Mobile Header / Nav (Only visible on mobile) */}
                <div className="md:hidden absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                    <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <BrandLogo className="scale-75 origin-right" showText={false} />
                </div>

                {/* Main Content Centered */}
                <div className="flex-1 flex items-center justify-center p-4 pt-20 md:p-12 md:pt-0">
                    <div className="w-full max-w-md">
                        <AuthGate activeRole={activeRole} onRoleSelect={setActiveRole} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function GetStartedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <GetStartedContent />
        </Suspense>
    )
}
