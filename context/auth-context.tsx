"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
    session: Session | null
    user: User | null
    profile: any | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Enterprise security constant: Session expires 24 hours after login
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000 

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    const handleSignOut = useCallback(async () => {
        try {
            await supabase.auth.signOut()
        } catch (error) {
            console.error('Error during sign out:', error)
        } finally {
            setSession(null)
            setUser(null)
            setProfile(null)
        }
    }, [])

    const isValidSession = useCallback((currentSession: Session | null) => {
        if (!currentSession?.user?.last_sign_in_at) return false

        const lastSignInDate = new Date(currentSession.user.last_sign_in_at).getTime()
        const timeElapsed = Date.now() - lastSignInDate

        return timeElapsed < SESSION_MAX_AGE_MS
    }, [])

    const validateAndSetSession = useCallback(async (currentSession: Session | null) => {
        if (currentSession && !isValidSession(currentSession)) {
            console.info('Session expired due to 24-hour security policy. Logging out...')
            await handleSignOut()
            return
        }

        // Enterprise Security Protocol: Zero-Trust Global Suspension Check
        if (currentSession?.user) {
            try {
                const { data } = await supabase.from('profiles').select('*').eq('id', currentSession.user.id).single()
                if (data?.status === 'suspended') {
                    console.error('CRITICAL: Suspended account attempting access. Executing forced global platform termination.');
                    await handleSignOut()
                    if (typeof window !== 'undefined') {
                        window.location.href = '/get-started?error=suspended'
                    }
                    return
                }
                setProfile(data)
            } catch (err) {
                console.error("Suspension check failed, proceeding cautiously.");
            }
        }

        setSession(currentSession)
        setUser(currentSession?.user ?? null)
    }, [isValidSession, handleSignOut])

    useEffect(() => {
        // Fetch initial session
        const fetchInitialSession = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession()
                await validateAndSetSession(currentSession)
            } catch (error) {
                console.error("Error fetching session:", error)
                setSession(null)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialSession()

        // Critical Fallback: Force unlock the UI state if the network stalls
        const timeoutId = setTimeout(() => {
            setLoading(false)
        }, 5000)

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
            if (_event === 'SIGNED_OUT') {
                setSession(null)
                setUser(null)
                setProfile(null)
                setLoading(false)
                return
            }
            await validateAndSetSession(currentSession)
            setLoading(false)
        })

        // Setup a periodic check to proactively log out users who exceed the 24h limit
        // without requiring a page refresh or interaction.
        const intervalId = setInterval(async () => {
            try {
                const { data: { session: activeSession } } = await supabase.auth.getSession()
                if (activeSession && !isValidSession(activeSession)) {
                    console.info('Proactive session check: Session expired due to 24-hour policy.')
                    await handleSignOut()
                }
            } catch (error) {
                // Ignore silent errors from background check
            }
        }, 5 * 60 * 1000) // Check every 5 minutes in the background

        return () => {
            subscription.unsubscribe()
            clearInterval(intervalId)
            clearTimeout(timeoutId)
        }
    }, [validateAndSetSession, isValidSession, handleSignOut])

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
