'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
    const router = useRouter()
    const [status, setStatus] = useState('Authenticating...')

    useEffect(() => {
        const handleCallback = async () => {
            // 1. Get the session (Supabase handles the URL hash/code automatically)
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error("Auth error:", error)
                setStatus("Authentication failed. " + error.message)
                return
            }

            if (!session) {
                // If no session, it might be because the hash hasn't been processed yet
                // But supabase.auth.getSession() usually handles it. 
                // Alternatively, we can listen to onAuthStateChange
                // Giving it a moment or relying on the listener below
                return
            }

            setStatus('Finalizing profile...')

            // 2. Get pending role from local storage (set in auth-gate)
            const pendingRole = localStorage.getItem('pending_role')
            if (pendingRole) {
                // 3. Upsert profile with the role
                const { user } = session

                // Get existing profile to see if we need to update role (or keep existing)
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (!existingProfile || !existingProfile.role) {
                    // New user or missing role -> Set it
                    const { error: profileError } = await supabase.from('profiles').upsert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0],
                        role: pendingRole || 'faculty',
                        // Initialize other fields if needed
                    }, { onConflict: 'id' }) // Just update if exists, but we want to ensure Role is set

                    if (profileError) {
                        console.error("Profile creation error:", profileError)
                    }
                }

                // Clear pending role
                localStorage.removeItem('pending_role')
            }

            // 4. Redirect based on role
            // We fetch the profile again to be sure of the final role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            const role = profile?.role || 'faculty' // Default to faculty if undefined

            if (role === 'faculty') {
                router.push('/faculty')
            } else if (role === 'student') {
                // If a student tries to login, we can still redirect them or show error.
                // For now, let's redirect to faculty as requested (or just default behavior)
                router.push('/student')
            } else {
                router.push('/faculty')
            }
        }

        // Supabase listener to catch the initial session event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                handleCallback()
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">{status}</p>
        </div>
    )
}
