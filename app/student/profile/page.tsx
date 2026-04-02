"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

export default function StudentProfilePage() {
    const { user } = useAuth()
    const router = useRouter()
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState({
        full_name: "",
        discipline: "",
        school: "",
        cgpa: ""
    })

    useEffect(() => {
        if (user) {
            supabase.from('profiles').select('*').eq('id', user.id).single()
                .then(({ data }) => {
                    if (data) {
                        setProfile({
                            full_name: data.full_name || "",
                            discipline: data.discipline || "",
                            school: data.school || "",
                            cgpa: data.cgpa ? String(data.cgpa) : ""
                        })
                    }
                    setLoading(false)
                })
        }
    }, [user])

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        
        await supabase.from('profiles').update({
            full_name: profile.full_name,
            discipline: profile.discipline,
            school: profile.school,
            cgpa: profile.cgpa ? parseFloat(profile.cgpa) : null
        }).eq('id', user.id)

        setSaving(false)
        router.refresh()
        router.push('/student')
    }

    if (loading) return <div className="p-8"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>

    return (
        <div className="p-8 max-w-2xl mx-auto h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-500 mb-8">Keep your academic details updated to discover relevant industry visits.</p>

            <div className="space-y-6 bg-slate-50 p-8 rounded-[24px] border border-slate-100">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <input 
                        type="text" 
                        value={profile.full_name}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="w-full text-base p-3.5 bg-white rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Discipline / Major</label>
                    <select 
                        value={profile.discipline}
                        onChange={(e) => setProfile({...profile, discipline: e.target.value})}
                        className="w-full text-base p-3.5 bg-white rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                    >
                        <option value="">Select your discipline</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil & Structural Engineering">Civil & Structural Engineering</option>
                        <option value="Automotive Engineering">Automotive Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Medical">Medical</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">University / School</label>
                    <input 
                        type="text" 
                        value={profile.school}
                        onChange={(e) => setProfile({...profile, school: e.target.value})}
                        className="w-full text-base p-3.5 bg-white rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Current CGPA</label>
                    <input 
                        type="number" 
                        step="0.01"
                        max="10.0"
                        min="0.0"
                        value={profile.cgpa}
                        onChange={(e) => setProfile({...profile, cgpa: e.target.value})}
                        placeholder="e.g. 8.5"
                        className="w-full text-base p-3.5 bg-white rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all" 
                    />
                    <p className="text-xs text-slate-500 mt-1">Required to apply for competitive visits.</p>
                </div>

                <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-4"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Save Profile</>}
                </Button>
            </div>
        </div>
    )
}
