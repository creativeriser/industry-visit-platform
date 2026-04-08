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
            // Fetch related context for the email payload
            const { data: detailData } = await supabase
                .from('visit_applications')
                .select(`
                    student:profiles!student_id(email, full_name),
                    visit:scheduled_visits!visit_id(
                        proposed_date,
                        company:companies!company_id(name)
                    )
                `)
                .eq('id', applicationId)
                .single()

            if (detailData && (detailData.student as any)?.email) {
                const student = detailData.student as any;
                const visit = detailData.visit as any;
                const company = visit.company as any;

                fetch('/api/dispatch-student', { // Fire and forget async
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: newStatus,
                        companyName: company.name,
                        visitDate: visit.proposed_date?.split('•')[0]?.trim() || "TBD",
                        magicLink: `${window.location.origin}/student`,
                        recipients: [{ email: student.email, name: student.full_name }]
                    })
                }).catch(e => console.error("Student approval mail dispatch failed:", e))
            }

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
