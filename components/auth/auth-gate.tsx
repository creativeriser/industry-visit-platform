"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, School, GraduationCap, Building2, ChevronRight, Fingerprint, LayoutDashboard, AlertCircle } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { BrandLogo } from "@/components/layout/brand-logo"
import { cn } from "@/lib/utils"
import { ActiveRole } from "@/app/get-started/page"
import { supabase } from "@/lib/supabase"
import { resolveInstitutionFromEmail, extractRollNumberFromEmail } from "@/lib/domain-mapping"

interface AuthGateProps {
    activeRole: ActiveRole
    onRoleSelect: (role: ActiveRole) => void
}

export function AuthGate({ activeRole, onRoleSelect }: AuthGateProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const errorParam = searchParams?.get("error")
    const [localError, setLocalError] = useState<string | null>(null)

    // Clear errors and form data when switching roles
    useEffect(() => {
        setLocalError(null)
        setEmail("")
        setPassword("")
    }, [activeRole])

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setLocalError(null)

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setLocalError(error.message)
            setLoading(false)
            return
        }

        // Extremely strict role-check:
        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, role, email, full_name, institution, roll_number')
                .eq('id', data.user.id)
                .single()
                
            if (!profile) {
                await supabase.auth.signOut()
                setLocalError(`Account configuration incomplete. Please contact IT Support for assistance.`)
                setLoading(false)
                return
            }
                
            if (profile.role !== activeRole) {
                // Instantly bounce them out if the role doesn't match
                await supabase.auth.signOut()
                setLocalError(`Access Denied: Your credentials belong to a ${profile.role}. Please select the ${profile.role} portal.`)
                setLoading(false)
                return
            }

            // Database Self-Healing: Auto-populate ALL missing baseline data (email, name, institution, roll_number)
            // if they were left NULL by an admin doing a manual setup in the database dashboard
            const isMissingData = !profile.email || !profile.full_name || !profile.institution || (profile.role === 'student' && !profile.roll_number)
            
            if (isMissingData) {
                const derivedName = data.user.email ? data.user.email.split('@')[0] : 'User'
                const derivedInstitution = data.user.email ? resolveInstitutionFromEmail(data.user.email) : null
                const derivedRoll = data.user.email ? extractRollNumberFromEmail(data.user.email) : null
                
                await supabase.from('profiles').update({
                    email: data.user.email,
                    full_name: profile.full_name || derivedName,
                    institution: profile.institution || derivedInstitution,
                    ...(profile.role === 'student' && !profile.roll_number && derivedRoll ? { roll_number: derivedRoll } : {})
                }).eq('id', data.user.id)
            }
        }

        if (activeRole === 'admin') router.push("/admin")
        else if (activeRole === 'faculty') router.push("/faculty")
        else router.push("/student")
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
        if (error) setLocalError(error.message)
        setLoading(false)
    }

    return (
        <div className="w-full max-w-[350px] mx-auto flex flex-col justify-center py-6">
            <AnimatePresence mode="wait">

                {/* LOGIN FORM (Dynamic) */}
                {activeRole !== null && (
                    <motion.div
                        key={activeRole}
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
                                {activeRole === "admin" ? "Use your master administrator credentials" : "Use your university credentials or Microsoft Account"}
                            </p>
                        </div>



                        {activeRole === "admin" ? (
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                                
                                <button type="submit" disabled={loading} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center transition-all hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]">
                                    {loading ? "Authenticating..." : "Access Dashboard"}
                                </button>

                                {(errorParam || localError) && (
                                    <div className="flex items-start gap-2 px-2 pt-3 pb-1 mx-auto w-full">
                                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-[1px]" />
                                        <p className="text-[12px] text-red-500 font-medium leading-[1.3] text-left">
                                            {localError ? localError : (
                                                errorParam === 'suspended'
                                                ? "This account is completely suspended. Contact Admin immediately."
                                                : errorParam === 'invalid_role' 
                                                ? `Your Microsoft account is registered for a different role. Please select the correct portal.` 
                                                : errorParam === 'unauthorized_domain' 
                                                ? "Email domain is not authorized. Please use your official university email." 
                                                : "Authentication failed. Please try again."
                                            )}
                                        </p>
                                    </div>
                                )}
                            </form>
                        ) : (
                            <div className="space-y-5">
                                <form onSubmit={handleEmailLogin} className="space-y-4">
                                    <input type="email" placeholder={`${activeRole === 'faculty' ? 'Faculty' : 'Student'} Email`} value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                                    
                                    <button type="submit" disabled={loading} className={cn("w-full h-12 text-white rounded-xl text-sm font-bold flex items-center justify-center transition-all hover:shadow-lg active:scale-[0.98]", activeRole === 'faculty' ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20' : 'bg-sky-600 hover:bg-sky-700 hover:shadow-sky-500/20')}>
                                        {loading ? "Authenticating..." : "Sign in"}
                                    </button>

                                    {(errorParam || localError) && (
                                        <div className="flex items-start gap-2 px-2 pt-3 pb-1 mx-auto w-full">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-[1px]" />
                                            <p className="text-[12px] text-red-500 font-medium leading-[1.3] text-left">
                                                {localError ? localError : (
                                                    errorParam === 'suspended'
                                                    ? "This account is suspended. Contact Admin."
                                                    : errorParam === 'invalid_role' 
                                                    ? `Your Microsoft account is registered for a different role. Please select the correct portal.` 
                                                    : errorParam === 'unauthorized_domain' 
                                                    ? "Email domain is not authorized. Please use your official university email." 
                                                    : "Authentication failed. Please try again."
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </form>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-slate-200/80"></div>
                                    <span className="shrink-0 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or continue with</span>
                                    <div className="flex-grow border-t border-slate-200/80"></div>
                                </div>

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
                                    Microsoft Account
                                </button>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-400">
                                Having trouble? <a href="mailto:noreply.univist@gmail.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Contact IT Support</a>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}
