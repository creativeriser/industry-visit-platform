"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function FacultyApproveButtons({ applicationId, currentStatus, onUpdate }: { applicationId: string, currentStatus: string, onUpdate?: () => void }) {
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    const handleUpdate = async (newStatus: 'accepted' | 'rejected') => {
        setIsUpdating(true)
        const { error } = await supabase
            .from('visit_applications')
            .update({ status: newStatus })
            .eq('id', applicationId)

        if (!error) {
            if (onUpdate) onUpdate()
            else router.refresh()
        } else {
            console.error(error)
            alert('Failed to update status.')
        }
        setIsUpdating(false)
    }

    if (currentStatus !== 'applied') {
        return <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Processed</div>
    }

    return (
        <div className="flex items-center justify-end gap-3">
            <Button 
                onClick={() => handleUpdate('accepted')}
                disabled={isUpdating}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm shadow-emerald-100/50 text-emerald-700 px-6 py-2.5 h-[42px] rounded-xl font-bold transition-all duration-300 hover:-translate-y-[1px] active:scale-95"
            >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1.5" /> Accept</>}
            </Button>
            <Button 
                onClick={() => handleUpdate('rejected')}
                disabled={isUpdating}
                className="bg-red-50 hover:bg-red-100 border border-red-200 shadow-sm shadow-red-100/50 text-red-700 px-6 py-2.5 h-[42px] rounded-xl font-bold transition-all duration-300 hover:-translate-y-[1px] active:scale-95"
            >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4 mr-1.5" /> Reject</>}
            </Button>
        </div>
    )
}
