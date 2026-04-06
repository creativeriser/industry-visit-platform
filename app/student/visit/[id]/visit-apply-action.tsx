"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { ApplyButton } from "@/app/student/apply-button"
import { Loader2 } from "lucide-react"

export function VisitApplyAction({ visitId }: { visitId: string }) {
    const { user } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const fetchProfile = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            setProfile(data)
            setLoading(false)
        }

        fetchProfile()
    }, [user])

    if (!user || loading) {
        return (
            <div className="w-full h-12 flex items-center justify-center bg-white/50 text-white font-bold rounded-xl mt-2">
                <Loader2 className="w-5 h-5 animate-spin" />
            </div>
        )
    }

    return (
        <div className="mt-2 text-slate-800">
            <ApplyButton 
                visitId={visitId} 
                studentId={user.id} 
                profile={profile} 
            />
        </div>
    )
}
