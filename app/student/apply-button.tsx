"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function ApplyButton({ visitId, studentId, hasCGPA, onApplySuccess }: { visitId: string, studentId: string, hasCGPA: boolean, onApplySuccess?: () => void }) {
    const [isApplying, setIsApplying] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    const handleApply = async () => {
        if (!hasCGPA) {
            router.push('/student/profile')
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
                // we don't necessarily need to reset isApplying/isSuccess because the component will unmount/refresh, 
                // but for stability we leave it in the true state so it doesn't flicker back
            }, 1000)
        }
    }

    if (isSuccess) {
        return (
            <Button 
                disabled
                className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-sm shadow-emerald-200"
            >
                <CheckCircle className="w-5 h-5 animate-bounce mr-2" /> Applied Successfully
            </Button>
        )
    }

    return (
        <Button 
            onClick={handleApply}
            disabled={isApplying}
            className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all shadow-sm shadow-sky-200"
        >
            {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Apply for Visit <ArrowRight className="w-4 h-4 ml-2" /></>}
        </Button>
    )
}
