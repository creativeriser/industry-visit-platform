"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { supabase } from "@/lib/supabase"

interface UserProfile {
    fullName: string
    email: string
    phone: string
    school: string
    department: string
    discipline: string
    designation: string
    specialization: string
    avatar?: string
    shortlist: number[] // IDs of shortlisted companies
}

interface UserContextType {
    user: UserProfile
    updateUser: (updates: Partial<UserProfile>) => Promise<void>
    toggleShortlist: (id: number) => Promise<void>
    loading: boolean
}

const defaultUser: UserProfile = {
    fullName: "Guest User",
    email: "",
    phone: "",
    school: "",
    department: "",
    discipline: "",
    designation: "",
    specialization: "",
    shortlist: []
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user: authUser } = useAuth()
    const [user, setUser] = useState<UserProfile>(defaultUser)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authUser) {
            setUser(defaultUser)
            setLoading(false)
            return
        }

        const fetchProfile = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (data) {
                setUser({
                    fullName: data.full_name || "",
                    email: data.email || authUser.email || "",
                    phone: data.phone || "",
                    school: data.school || "",
                    department: data.department || "",
                    discipline: data.discipline || "",
                    designation: data.designation || "",
                    specialization: data.specialization || "",
                    shortlist: data.shortlist || [],
                })
            } else if (error) {
                console.error("Error fetching profile:", error)
                // Optionally create profile if it doesn't exist? 
                // For now, adhere to schema which expects profile might be created on triggers or manually
            }
            setLoading(false)
        }

        fetchProfile()
    }, [authUser])

    const updateUser = async (updates: Partial<UserProfile>) => {
        if (!authUser || loading) return

        // Optimistic update
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)

        // 1. Update public.profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: authUser.id,
                full_name: updatedUser.fullName,
                phone: updatedUser.phone,
                school: updatedUser.school,
                department: updatedUser.department,
                discipline: updatedUser.discipline,
                designation: updatedUser.designation,
                specialization: updatedUser.specialization,
                shortlist: updatedUser.shortlist,
            })

        if (profileError) {
            console.error("Error updating profile:", profileError)
            return
        }

        // 2. Sync with Supabase Auth Metadata (so it shows in Auth Dashboard)
        const authUpdates: { data?: { full_name?: string }, phone?: string } = {}

        if (updates.fullName) {
            authUpdates.data = { full_name: updates.fullName }
        }

        if (updates.phone) {
            authUpdates.phone = updates.phone
        }

        if (Object.keys(authUpdates).length > 0) {
            const { error: authError } = await supabase.auth.updateUser(authUpdates)

            if (authError) {
                // Ignore "Unable to get SMS provider" error as it just means phone verification failed
                // to send, but we still want the profile update to "succeed" from user perspective.
                if (authError.message.includes("Unable to get SMS provider")) {
                    console.warn("Phone sync skipped: SMS provider not configured in Supabase.")
                } else {
                    console.error("Error syncing auth metadata:", authError)
                }
            }
        }
    }

    const toggleShortlist = async (id: number) => {
        if (!authUser) return

        let newList = user.shortlist || []
        if (newList.includes(id)) {
            newList = newList.filter(itemId => itemId !== id)
        } else {
            newList = [...newList, id]
        }

        await updateUser({ shortlist: newList })
    }

    return (
        <UserContext.Provider value={{ user, updateUser, toggleShortlist, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
