"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, AlertCircle, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

function getMissingRequirements(profile: any) {
    if (!profile) return ["Complete Profile Setup"]
    
    let missing: string[] = []
    
    // Core requirements
    if (!profile.full_name) missing.push("Full Name")
    if (!profile.phone) missing.push("Phone")
    if (!profile.institution) missing.push("Institution")
    if (!profile.degree) missing.push("Degree")
    if (!profile.department) missing.push("Department")
    if (!profile.roll_number) missing.push("Roll Number")
    
    // Academic metrics
    if (profile.cgpa === null || profile.cgpa === undefined || profile.cgpa === '') missing.push("CGPA")
    if (profile.attendance === null || profile.attendance === undefined || profile.attendance === '') missing.push("Attendance")
    if (!profile.discipline) missing.push("Target Discipline")
    
    // Professional Portfolio
    if (!profile.resume_url) missing.push("Resume")
    
    // CS Specific Requirements
    const disciplineLower = (profile.discipline || "").toLowerCase()
    const isCS = disciplineLower.includes("computer") || disciplineLower.includes("cs") || disciplineLower.includes("it") || disciplineLower.includes("information")
    
    if (isCS) {
        if (!profile.github_url) missing.push("GitHub Profile (CS Requisite)")
        if (!profile.linkedin_url) missing.push("LinkedIn Profile (CS Requisite)")
    }

    return missing
}

export function ApplyButton({ visitId, studentId, profile, onApplySuccess }: { visitId: string, studentId: string, profile: any, onApplySuccess?: () => void }) {
    const [isApplying, setIsApplying] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [shakeCount, setShakeCount] = useState(0)
    const [missingFields, setMissingFields] = useState<string[]>([])
    const [showError, setShowError] = useState(false)
    const router = useRouter()
    
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowError(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleApply = async () => {
        const missing = getMissingRequirements(profile)
        
        if (missing.length > 0) {
            setShakeCount(c => c + 1) // Trigger animation key
            
            // Dispatch event to shake the global banner
            window.dispatchEvent(new Event('trigger-profile-warning-shake'))
            
            // Scroll to the top if we are not there (where the banner usually is)
            const wrapper = document.getElementById("dashboard-scroll-container")
            if (wrapper) wrapper.scrollTo({ top: 0, behavior: "smooth" })
            else window.scrollTo({ top: 0, behavior: "smooth" })

            return
        }

        setIsApplying(true)
        const { error } = await supabase
            .from('visit_applications')
            .insert({
                visit_id: visitId,
                student_id: studentId,
                status: 'applied'
            })
        
        if (error) {
            alert('Failed to apply. You may have already applied.')
            setIsApplying(false)
        } else {
            setIsSuccess(true)
            setTimeout(() => {
                if (onApplySuccess) {
                    onApplySuccess()
                } else {
                    router.refresh()
                }
            }, 1000)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center p-3 rounded-xl font-bold border text-xs uppercase tracking-wider gap-2 w-full h-12 shadow-sm bg-amber-50 text-amber-600 border-amber-200">
                <Clock className="w-4 h-4 shrink-0" /> PENDING
            </div>
        )
    }

    return (
        <div ref={wrapperRef} className="w-full relative">
            <motion.div
                key={shakeCount}
                initial={{ x: 0 }}
                animate={shakeCount > 0 ? {
                    x: [0, -8, 8, -6, 6, -3, 3, 0]
                } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
            >
                <Button 
                    onClick={handleApply}
                    disabled={isApplying}
                    className={`w-full h-12 rounded-xl text-white font-bold transition-all shadow-sm ${
                        shakeCount > 0 
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                            : 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'
                    }`}
                >
                    {isApplying ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : shakeCount > 0 ? (
                        <>Incomplete Profile <AlertCircle className="w-4 h-4 ml-2" /></>
                    ) : (
                        <>Apply for Visit <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                </Button>
            </motion.div>
        </div>
    )
}
