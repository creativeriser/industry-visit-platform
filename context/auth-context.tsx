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

// Removed aggressive custom validation; trusting Supabase Auth token lifecycle.

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

    const validateAndSetSession = useCallback(async (currentSession: Session | null) => {

        if (currentSession?.user) {
            try {
                const { data, error } = await supabase.from('profiles').select('*').eq('id', currentSession.user.id).single()
                
                if (data?.status === 'suspended') {
                    console.error('CRITICAL: Suspended account attempting access.');
                    await handleSignOut()
                    if (typeof window !== 'undefined') {
                        window.location.href = '/get-started?error=suspended'
                    }
                    return
                }
                
                if (data) {
                    setProfile(data)
                }
            } catch (err) {
                console.error("Profile fetch error, proceeding cautiously.", err);
            }
        }

        setSession(currentSession)
        setUser(currentSession?.user ?? null)
    }, [handleSignOut])

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

        return () => {
            subscription.unsubscribe()
            clearTimeout(timeoutId)
        }
    }, [validateAndSetSession, handleSignOut])

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
