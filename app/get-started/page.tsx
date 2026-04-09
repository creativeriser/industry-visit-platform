"use client"

import { Suspense, useEffect, useState } from "react"
import { AuthGate } from "@/components/auth/auth-gate"
import { BrandLogo } from "@/components/layout/brand-logo"
import { AppleAperture } from "@/components/auth/apple-aperture"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

export type ActiveRole = "admin" | "faculty" | "student" | null

function GetStartedContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [activeRole, setActiveRole] = useState<ActiveRole>("faculty")
    const { user, loading: authLoading } = useAuth()

    // Smart Redirect for Already Authenticated Users
    useEffect(() => {
        if (!authLoading && user) {
            // User is already logged in. Fetch their role to redirect them.
            supabase.from('profiles').select('role').eq('id', user.id).single()
                .then(({ data }) => {
                    if (data?.role) {
                        router.replace(`/${data.role}`);
                    }
                })
        }
    }, [user, authLoading, router])

    useEffect(() => {
        const roleParam = searchParams.get("role")
        if (roleParam === "faculty" || roleParam === "student" || roleParam === "admin") {
            setActiveRole(roleParam)
        }
    }, [searchParams])

    const handleRoleChange = (role: ActiveRole) => {
        setActiveRole(role)
        if (role) {
            router.replace(`/get-started?role=${role}`, { scroll: false })
        }
    }

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
                <div className="flex-1 flex flex-col items-center justify-center p-4 pt-20 md:p-12 md:pt-0">
                    
                    {/* Role Selector Tabs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-full border border-slate-200/60 mb-2 backdrop-blur-sm z-10"
                    >
                        <button
                            onClick={() => handleRoleChange("faculty")}
                            className={cn("px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300", activeRole === "faculty" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
                        >
                            Faculty
                        </button>
                        <button
                            onClick={() => handleRoleChange("student")}
                            className={cn("px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300", activeRole === "student" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => handleRoleChange("admin")}
                            className={cn("px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300", activeRole === "admin" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
                        >
                            Admin
                        </button>
                    </motion.div>

                    <div className="w-full max-w-md">
                        <AuthGate activeRole={activeRole} onRoleSelect={handleRoleChange} />
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
