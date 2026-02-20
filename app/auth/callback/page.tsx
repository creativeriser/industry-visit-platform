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

            // 2. Update profile with Azure AD metadata and pending role
            const pendingRole = localStorage.getItem('pending_role')
            const { user } = session

            // Get existing profile to see if we need to update it
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id, role, full_name')
                .eq('id', user.id)
                .single()

            let metadataName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || ''

            // Fix Azure providing names like "VIKRANT SINGH 2301010028"
            // We strip out the trailing ID if it exists and formatting properly 
            if (metadataName && typeof metadataName === 'string') {
                // If the name ends with exactly the prefix of their email like '2301010028', remove it
                const emailPrefix = user.email?.split('@')[0]
                if (emailPrefix && metadataName.includes(emailPrefix) && metadataName !== emailPrefix) {
                    metadataName = metadataName.replace(emailPrefix, '').trim()
                }

                // If it still has trailing digits, remove them
                metadataName = metadataName.replace(/\s+\d+$/, '').trim()

                // Title case the name if it's ALL CAPS like "VIKRANT SINGH"
                if (metadataName === metadataName.toUpperCase() && metadataName.length > 0) {
                    metadataName = metadataName.split(' ')
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                }
            }

            const isPlaceholderName = !existingProfile?.full_name || existingProfile.full_name === user.email || existingProfile.full_name === user.email?.split('@')[0]

            if (!existingProfile) {
                // Insert new profile
                const { error: insertError } = await supabase.from('profiles').insert({
                    id: user.id,
                    email: user.email,
                    full_name: metadataName,
                    role: pendingRole || 'faculty'
                })
                if (insertError) console.error("Profile insert error:", insertError)
            } else if (!existingProfile.role || isPlaceholderName) {
                // Update existing profile safely
                const updates: any = {}
                if (!existingProfile.role) updates.role = pendingRole || 'faculty'
                if (isPlaceholderName) updates.full_name = metadataName

                const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', user.id)
                if (updateError) console.error("Profile update error:", updateError)
            }

            // Clear pending role
            if (pendingRole) {
                localStorage.removeItem('pending_role')
            }

            // 4. Redirect based on role and pending redirect
            const pendingRedirect = localStorage.getItem('pending_redirect')
            if (pendingRedirect) {
                localStorage.removeItem('pending_redirect')
            }

            // We fetch the profile again to be sure of the final role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            const role = profile?.role || 'faculty' // Default to faculty if undefined

            if (role === 'faculty') {
                router.push(pendingRedirect || '/faculty')
            } else if (role === 'student') {
                router.push(pendingRedirect || '/student')
            } else {
                router.push(pendingRedirect || '/faculty')
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
