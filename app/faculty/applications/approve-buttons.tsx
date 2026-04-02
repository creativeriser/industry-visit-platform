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
        <div className="flex items-center justify-end gap-2">
            <Button 
                size="sm"
                variant="outline"
                onClick={() => handleUpdate('accepted')}
                disabled={isUpdating}
                className="bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 h-8 px-3 rounded-lg"
            >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Accept</>}
            </Button>
            <Button 
                size="sm"
                variant="outline"
                onClick={() => handleUpdate('rejected')}
                disabled={isUpdating}
                className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-3 rounded-lg"
            >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4 mr-1" /> Reject</>}
            </Button>
        </div>
    )
}
