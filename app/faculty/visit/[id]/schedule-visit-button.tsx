"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, Send, CalendarClock, Calendar, User, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/modal"

interface ScheduleVisitButtonProps {
    companyId: number
    companyName: string
    contactEmail: string
    contactName: string
    proposedDate: string
    capacity?: string
}

export function ScheduleVisitButton({ companyId, companyName, contactEmail, contactName, proposedDate, capacity }: ScheduleVisitButtonProps) {
    const [isScheduling, setIsScheduling] = useState(false)
    const [visitRecords, setVisitRecords] = useState<any[]>([])
    const [isLoadingRecord, setIsLoadingRecord] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [facultyDate, setFacultyDate] = useState(proposedDate)
    
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            fetchVisits()
        } else {
            setIsLoadingRecord(false)
        }

        const handleUpdate = () => {
            if (user) fetchVisits()
        }

        window.addEventListener('visit-updated', handleUpdate)
        return () => window.removeEventListener('visit-updated', handleUpdate)
    }, [user, companyId])

    const fetchVisits = async () => {
        try {
            const { data, error } = await supabase
                .from('scheduled_visits')
                .select('*')
                .eq('company_id', companyId)
                .eq('faculty_id', user!.id)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            if (data) setVisitRecords(data)
        } catch (err) {
            console.error("No record found or error:", err)
        } finally {
            setIsLoadingRecord(false)
        }
    }

    const openEmailSimulation = () => {
        if (!user) {
            router.push('/get-started')
            return
        }
        setIsEmailModalOpen(true)
    }

    const handleActualSchedule = async () => {
        setIsScheduling(true)
        setError(null)

        try {
            // 1. Create the pending visit record
            const { data, error } = await supabase
                .from('scheduled_visits')
                .insert([
                    {
                        company_id: companyId,
                        faculty_id: user!.id,
                        proposed_date: facultyDate,
                        status: 'pending_hr'
                    }
                ])
                .select()
                .single()

            if (error) throw error
            if (!data) throw new Error("No data returned")

            setVisitRecords([data, ...visitRecords])
            const visitId = data.id

            // Tell the LiveTracking component to update
            window.dispatchEvent(new Event('visit-updated'))

            // 2. Generate the Magic Link
            const baseUrl = window.location.origin
            const magicLink = `${baseUrl}/partner/approve/${visitId}`

            // 3. Open Outlook Web Mail Compose
            const subject = `Company Visit Request: ${encodeURIComponent(companyName)}`
            const body = `Dear ${encodeURIComponent(contactName)},%0D%0A%0D%0AI would like to formally request an industry visit for our students at ${encodeURIComponent(companyName)} on ${encodeURIComponent(facultyDate)}.%0D%0A%0D%0APlease click the secure link below to review our request and easily Accept the date or Propose an Alternate Time:%0D%0A${encodeURIComponent(magicLink)}%0D%0A%0D%0AWe look forward to collaborating with you.%0D%0A%0D%0AThank you.`
            
            const mailtoUrl = `https://outlook.office.com/mail/deeplink/compose?to=${contactEmail}&subject=${subject}&body=${body}`
            
            // Open tracking in background without full redirect
            window.open(mailtoUrl, '_blank')
            
            setIsEmailModalOpen(false)

        } catch (err: any) {
            console.error(err)
            setError(err.message || "Something went wrong")
        } finally {
            setIsScheduling(false)
        }
    }

    if (isLoadingRecord) {
        return <div className="p-10 flex justify-center w-full h-full items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
    }

    const activeVisit = visitRecords.length > 0 && visitRecords[0].status !== 'cancelled' ? visitRecords[0] : null;

    if (activeVisit) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-900/20 ring-4 ring-indigo-400/20">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Coordination Active</h3>
                <p className="text-indigo-100/80 text-sm font-medium leading-relaxed max-w-[200px]">
                    This request is currently locked and being managed. See the dashboard below.
                </p>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 flex flex-col h-full">
            
            {/* Header formerly in page.tsx */}
            <div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Ready to Plan?</h3>
                <p className="text-indigo-100 text-[15px] opacity-90 leading-relaxed">
                    Coordinate with {contactName} and finalize your visit details.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center text-[15px] text-indigo-100 bg-indigo-500/30 p-3 rounded-xl border border-indigo-400/30">
                    <User className="w-5 h-5 mr-3 text-indigo-300" />
                    Capacity: <strong className="ml-1 text-white">{capacity || 'Not Specified'} Students</strong>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest pl-1 block">Preferred Schedule</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 z-10">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            value={facultyDate}
                            onChange={(e) => setFacultyDate(e.target.value)}
                            className="w-full bg-white text-indigo-900 font-bold placeholder-indigo-300 rounded-xl h-14 pl-12 pr-4 outline-none focus:ring-2 focus:ring-amber-400 border-0 transition-all shadow-inner"
                            placeholder="e.g. May 15, 2026 - Morning"
                        />
                    </div>
                    <p className="text-[11px] text-indigo-200/60 font-medium pl-1 text-center mt-2">You can propose a different date here.</p>
                </div>
            </div>

            {/* INITIAL CTA BUTTON */}
            <div className="space-y-4 mt-auto">
                <Button 
                    onClick={openEmailSimulation}
                    disabled={isScheduling || !facultyDate.trim()}
                    className="w-full bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold h-14 rounded-xl shadow-lg shadow-amber-900/20 border-0 transition-all text-base"
                >
                    {isScheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Mail className="w-5 h-5 mr-2" /> Schedule Visit</>}
                </Button>
                {error && <p className="text-red-300 text-xs text-center font-medium mt-1">{error}</p>}
            </div>

            {/* FOCUSED EMAIL MODAL SIMULATOR */}
            <Modal 
                isOpen={isEmailModalOpen} 
                onClose={() => setIsEmailModalOpen(false)}
                className="max-w-2xl bg-white p-0 overflow-hidden"
            >
                {/* Header pretending to be email client */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center text-slate-500 text-sm font-medium gap-3">
                    <Mail className="w-5 h-5 text-indigo-600" /> Draft Request to {contactName}
                </div>
                
                {/* Email Content Simulator */}
                <div className="p-8 bg-white">
                    <div className="max-w-xl space-y-6 text-slate-700">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</p>
                            <p className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Company Visit Request: {companyName}</p>
                        </div>

                        <div className="space-y-4 pt-2 text-[15px] leading-relaxed">
                            <p>Dear {contactName},</p>
                            <p>
                                I would like to formally request an industry visit for our students at <strong>{companyName}</strong> on <strong>{facultyDate}</strong>.
                            </p>
                            
                            {/* Visual representation of what the magic link button looks like to HR */}
                            <div className="py-6 my-6 border-y border-slate-100 flex justify-center">
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center w-full max-w-sm hover:shadow-md transition-all cursor-pointer">
                                    <CalendarClock className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                                    <h4 className="font-bold text-indigo-900 mb-1">Review Visit Proposal</h4>
                                    <p className="text-indigo-600 text-xs mb-4">Click the secure link attached in this email to natively Accept the date or Propose an Alternate Time without logging in.</p>
                                    <div className="h-10 w-full bg-indigo-600 text-white rounded-lg font-bold flex items-center justify-center shadow">
                                        Open Secure Portal
                                    </div>
                                </div>
                            </div>

                            <p>We look forward to collaborating with you.</p>
                            <p className="text-sm text-slate-500 mt-6 pt-6 border-t border-slate-50">
                                Best regards,<br/>
                                <strong>{user?.user_metadata?.full_name || "Faculty Member"}</strong><br/>
                                <span className="opacity-80 text-sm font-medium">{user?.user_metadata?.headline || user?.user_metadata?.designation || "Faculty Member"}</span><br/>
                                <span className="font-bold text-sm">K.R. Mangalam University</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <p className="text-xs text-slate-400 font-medium hidden sm:block">This will trigger your default email client.</p>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="ghost" onClick={() => setIsEmailModalOpen(false)}>Cancel Edit</Button>
                        <Button onClick={handleActualSchedule} disabled={isScheduling} className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 font-bold gap-2">
                            {isScheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : "Open in Outlook & Send"} <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
