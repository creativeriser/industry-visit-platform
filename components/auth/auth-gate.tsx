"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, School, GraduationCap, Building2, ChevronRight, Fingerprint, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { BrandLogo } from "@/components/layout/brand-logo"
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
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            alert(error.message)
            setLoading(false)
        } else {
            router.push("/admin")
        }
    }

    const handleOAuthLogin = async (provider: 'azure') => {
        setLoading(true)
        if (activeRole) localStorage.setItem('pending_role', activeRole)

        // Capture any search params like ?discipline=Computer Science
        // and the current window hash #discovery to return the user there
        const currentParams = new URLSearchParams(window.location.search)
        const discipline = currentParams.get('discipline')
        if (discipline) {
            localStorage.setItem('pending_redirect', `/faculty?discipline=${encodeURIComponent(discipline)}#discovery`)
        } else {
            localStorage.removeItem('pending_redirect')
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                scopes: 'email profile openid User.Read',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'select_account',
                }
            }
        })
        if (error) alert(error.message)
        setLoading(false)
    }

    return (
        <div className="w-full max-w-[350px] mx-auto min-h-[500px] flex flex-col justify-center py-12">
            <AnimatePresence mode="wait">

                {/* LOGIN FORM (Dynamic) */}
                {activeRole !== null && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >

                        <div className="text-center mb-8">
                            <div
                                className="flex justify-center mb-6"
                                style={{
                                    '--primary': activeRole === 'admin' ? '#0f172a' : (activeRole === 'faculty' ? '#4f46e5' : '#0ea5e9'),
                                    '--secondary': activeRole === 'admin' ? '#334155' : (activeRole === 'faculty' ? '#4338ca' : '#0284c7'),
                                } as React.CSSProperties}
                            >
                                {/* Override text-primary classes using CSS variables */}
                                <div className="text-indigo-600 dark:text-indigo-600">
                                    <BrandLogo showText={false} className="scale-125" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {activeRole === "admin" ? "Admin Sign In" : (activeRole === "faculty" ? "Faculty Sign In" : "Student Sign In")}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                {activeRole === "admin" ? "Use your master administrator credentials" : (activeRole === "faculty" ? "Use your university credentials or Microsoft Account" : "Enter your student ID to continue")}
                            </p>
                        </div>
                        {activeRole === "admin" ? (
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                                <button type="submit" disabled={loading} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center transition-all hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]">
                                    {loading ? "Authenticating..." : "Access Dashboard"}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-5">
                                <button
                                    onClick={() => handleOAuthLogin('azure')}
                                    disabled={loading}
                                    className="w-full h-12 bg-[#000000] hover:bg-[#1a1a1a] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-black/20 active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 23 23">
                                        <path fill="#f35325" d="M1 1h10v10H1z" />
                                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                                    </svg>
                                    {loading ? "Redirecting..." : "Sign in with Microsoft"}
                                </button>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-400">
                                Having trouble? <a href="#" className="underline hover:text-slate-600">Contact IT Support</a>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}
