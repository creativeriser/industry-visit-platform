"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, ArrowLeft, School, GraduationCap, Building2, ChevronRight, Fingerprint, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { BrandLogo } from "@/components/brand-logo"
import { cn } from "@/lib/utils"
import { ActiveRole } from "@/app/get-started/page"
import { supabase } from "@/lib/supabase"

interface AuthGateProps {
    activeRole: ActiveRole
    onRoleSelect: (role: ActiveRole) => void
}

export function AuthGate({ activeRole, onRoleSelect }: AuthGateProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email) return
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: { role: activeRole }
            }
        })
        if (error) {
            alert(error.message)
        } else {
            alert("Check your email for the login link!")
        }
        setLoading(false)
    }

    const handleOAuthLogin = async (provider: 'azure') => {
        setLoading(true)
        if (activeRole) localStorage.setItem('pending_role', activeRole)
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        })
        if (error) alert(error.message)
        setLoading(false)
    }

    return (
        <div className="w-full max-w-[350px] mx-auto min-h-[500px] flex flex-col justify-center py-12">
            <AnimatePresence mode="wait">

                {/* STEP 1: ROLE SELECTION */}
                {activeRole === null && (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to <span className="text-indigo-600">UniVisit</span></h1>
                            <p className="text-slate-500 font-medium text-sm">Select your portal to continue</p>
                        </div>

                        <div className="grid gap-3">
                            {/* Faculty Card */}
                            <button
                                onClick={() => onRoleSelect("faculty")}
                                className="w-full group relative bg-white hover:bg-indigo-50/30 border-2 border-slate-100 hover:border-indigo-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 flex items-center gap-4 text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                    {/* Professional Custom School Icon */}
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 22h20" />
                                        <path d="M4 22V7l8-5 8 5v15" />
                                        <circle cx="12" cy="9" r="2" />
                                        <path d="M9 22v-5a2.5 2.5 0 0 1 5 0v5" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mb-0.5">Faculty Portal</h3>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wide">Manage industry visits</p>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </button>

                            {/* Student Card */}
                            {/* Student Card - HIDDEN AS PER REQUEST */}
                            {/* <button
                                onClick={() => onRoleSelect("student")}
                                className="w-full group relative bg-white hover:bg-sky-50/30 border-2 border-slate-100 hover:border-sky-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-sky-100/40 flex items-center gap-4 text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-0.5">Student Portal</h3>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wide">Discover & Track</p>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </button> */}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: LOGIN FORM (Dynamic) */}
                {activeRole !== null && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Back Button */}
                        {/* Small Back Arrow */}
                        <div className="absolute top-0 right-0 w-full flex justify-start mb-4">
                            <button
                                onClick={() => onRoleSelect(null)}
                                className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50"
                                title="Back to selection"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <div
                                className="flex justify-center mb-6"
                                style={{
                                    // Force branding colors for the logo regardless of theme
                                    '--primary': activeRole === 'faculty' ? '#4f46e5' : '#0ea5e9', // indigo-600 : sky-500
                                    '--secondary': activeRole === 'faculty' ? '#4338ca' : '#0284c7', // indigo-700 : sky-600
                                } as React.CSSProperties}
                            >
                                {/* Override text-primary classes using CSS variables */}
                                <div className="text-indigo-600 dark:text-indigo-600">
                                    <BrandLogo showText={false} className="scale-125" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {activeRole === "faculty" ? "Faculty Sign In" : "Student Sign In"}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                {activeRole === "faculty" ? "Use your university credentials or Microsoft Account" : "Enter your student ID to continue"}
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">
                                    {activeRole === "faculty" ? "Official Email" : "University Email"}
                                </label>
                                <Input
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={activeRole === "faculty" ? "prof.name@university.edu.in" : "230101118@university.edu.in"}
                                    className={cn(
                                        "h-10 bg-slate-50 border-slate-200 rounded-lg transition-all text-sm",
                                        "hover:bg-white hover:border-slate-300", // Hover effect
                                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-white", // Remove ring expansion
                                        activeRole === "faculty"
                                            ? "focus-visible:border-indigo-500"
                                            : "focus-visible:border-sky-500"
                                    )}
                                />
                            </div>

                            <Button
                                onClick={handleLogin}
                                disabled={loading}
                                className={cn(
                                    "w-full h-10 text-sm font-bold text-white rounded-lg shadow-lg shadow-blue-900/5 transition-all hover:scale-[1.01] active:scale-[0.98]",
                                    activeRole === "faculty"
                                        ? "bg-indigo-600 hover:bg-indigo-700"
                                        : "bg-sky-500 hover:bg-sky-600"
                                )}
                            >
                                {loading ? "Send Magic Link..." : "Continue"} <ArrowRight className="w-3.5 h-3.5 ml-2 opacity-80" />
                            </Button>

                            <div className="relative py-3">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-[9px] uppercase">
                                    <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleOAuthLogin('azure')}
                                disabled={loading}
                                className="w-full h-10 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md hover:bg-slate-50 active:scale-[0.98]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 23 23">
                                    <path fill="#f35325" d="M1 1h10v10H1z" />
                                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                                </svg>
                                Sign in with Microsoft
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-400">
                                Having trouble? <a href="#" className="underline hover:text-slate-600">Contact IT Support</a>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
