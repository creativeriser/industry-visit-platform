"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, Clock, CalendarClock, MessageSquare, AlertCircle, XCircle, RotateCcw } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"

interface LiveTrackingProps {
    companyId: number
    companyName: string
    contactName: string
}

export function LiveTracking({ companyId, companyName, contactName }: LiveTrackingProps) {
    const [visitRecords, setVisitRecords] = useState<any[]>([])
    const [isLoadingRecord, setIsLoadingRecord] = useState(true)
    const [isScheduling, setIsScheduling] = useState(false)
    
    const { user } = useAuth()

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

    const handleAcceptReschedule = async (visitId: string) => {
        setIsScheduling(true)
        try {
            const { data, error } = await supabase
                .from('scheduled_visits')
                .update({ status: 'approved' })
                .eq('id', visitId)
                .select()
                .single()
            
            if (!error && data) {
                setVisitRecords(prev => prev.map(v => v.id === visitId ? data : v))
                window.dispatchEvent(new Event('visit-updated'))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsScheduling(false)
        }
    }

    const handleCancelVisit = async (visitId: string) => {
        if (!confirm("Are you sure you want to cancel this visit request?")) return;
        
        setIsScheduling(true)
        try {
            const { data, error } = await supabase
                .from('scheduled_visits')
                .update({ status: 'cancelled', hr_notes: 'Cancelled by Faculty.' })
                .eq('id', visitId)
                .select()
                .single()
            
            if (!error && data) {
                setVisitRecords(prev => prev.map(v => v.id === visitId ? data : v))
                window.dispatchEvent(new Event('visit-updated'))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsScheduling(false)
        }
    }

    if (isLoadingRecord) {
        return <div className="p-8 mt-10 border border-slate-100 rounded-3xl flex justify-center w-full"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
    }

    if (visitRecords.length === 0) {
        return null; // Will just hide if no visits exist
    }

    const activeVisit = visitRecords.length > 0 && visitRecords[0].status !== 'cancelled' ? visitRecords[0] : null;
    const historyVisits = activeVisit ? visitRecords.slice(1) : visitRecords;

    return (
        <div className="w-full mt-12 pt-10 border-t border-slate-100">
            {/* LIVE TRACKING TIMELINE */}
            {activeVisit && (
                <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50 text-slate-900 border border-slate-100 flex flex-col relative overflow-hidden group mb-10">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                        <CalendarClock className="w-48 h-48 transform translate-x-8 -translate-y-8" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100 relative z-10">
                        <div>
                            <h4 className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-2 mb-1">
                                <CalendarClock className="w-6 h-6 text-indigo-600" /> Executive Tracking Dashboard
                            </h4>
                            <p className="text-slate-500 text-sm font-medium">Real-time coordination status with {companyName}</p>
                        </div>
                        {['pending_hr', 'approved', 'rescheduled'].includes(activeVisit.status) && (
                            <button onClick={() => handleCancelVisit(activeVisit.id)} className="text-sm font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 px-4 py-2 rounded-xl transition-all shadow-sm shrink-0">
                                Cancel Request
                            </button>
                        )}
                    </div>

                    {/* HORIZONTAL STEPPER */}
                    <div className="relative z-10 w-full max-w-3xl mx-auto mb-12">
                        <div className="flex justify-between items-center relative">
                            {/* Connecting Line background */}
                            <div className="absolute left-[10%] right-[10%] top-6 h-[3px] bg-slate-100 -z-10" />
                            
                            {/* Connecting Line active fill */}
                            <div className={`absolute left-[10%] top-6 h-[3px] bg-indigo-500 -z-10 transition-all duration-1000 ${
                                activeVisit.status === 'approved' ? 'w-[80%]' 
                                : activeVisit.status === 'rescheduled' ? 'w-[40%]' 
                                : 'w-[20%]'
                            }`} />

                            {/* Node 1: Prepared & Sent */}
                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-white z-10">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-900 text-[15px]">Dispatched</p>
                                    <p className="text-slate-500 text-xs mt-0.5">Invite out</p>
                                </div>
                            </div>

                            {/* Node 2: Coordination */}
                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white z-10 transition-colors duration-500 ${
                                    activeVisit.status === 'approved' ? 'bg-indigo-600 text-white shadow-indigo-200' 
                                    : ['pending_hr', 'rescheduled'].includes(activeVisit.status) ? 'bg-amber-400 text-amber-950 shadow-amber-200 animate-pulse'
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {activeVisit.status === 'approved' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div className="text-center">
                                    <p className={`font-bold text-[15px] ${['pending_hr', 'rescheduled', 'approved'].includes(activeVisit.status) ? 'text-slate-900' : 'text-slate-400'}`}>Review</p>
                                    <p className="text-slate-500 text-xs mt-0.5">HR feedback</p>
                                </div>
                            </div>

                            {/* Node 3: Locked */}
                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white z-10 transition-colors duration-500 ${
                                    activeVisit.status === 'approved' ? 'bg-emerald-500 text-white shadow-emerald-200' 
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <p className={`font-bold text-[15px] ${activeVisit.status === 'approved' ? 'text-slate-900' : 'text-slate-400'}`}>Locked In</p>
                                    <p className="text-slate-500 text-xs mt-0.5">Confirmed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC ACTIVE STATE DETAILS */}
                    <div className="relative z-10 w-full max-w-4xl mx-auto">
                        
                        {activeVisit.status === 'pending_hr' && (
                            <div className="bg-amber-50/80 border border-amber-200/60 p-8 rounded-3xl text-center shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <h4 className="font-black text-2xl text-amber-950 mb-3 tracking-tight">Awaiting HR Response</h4>
                                <p className="text-amber-800 text-lg max-w-2xl mx-auto leading-relaxed">
                                    Your proposal for <span className="font-bold bg-amber-100/50 px-2 py-0.5 rounded border border-amber-200/50">{activeVisit.proposed_date}</span> has been securely delivered. We are waiting for {contactName} to review and either approve or propose an alternate timeframe.
                                </p>
                            </div>
                        )}

                        {activeVisit.status === 'rescheduled' && (
                            <div className="bg-sky-50 border border-sky-200/60 p-8 rounded-3xl shadow-sm text-center">
                                <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <h4 className="font-black text-2xl text-sky-950 mb-3 tracking-tight">Action Required: New Time Proposed</h4>
                                <p className="text-sky-800 text-lg mb-6">
                                    The HR team has proposed a new date: <span className="font-bold bg-sky-100/50 px-2 py-0.5 rounded border border-sky-200/50">{activeVisit.proposed_date}</span>.
                                </p>
                                
                                {activeVisit.hr_notes && (
                                    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-sky-100 shadow-sm text-sky-900 mb-8 relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-100 text-sky-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Note from HR</div>
                                        <p className="italic font-medium leading-relaxed">"{activeVisit.hr_notes}"</p>
                                    </div>
                                )}
                                
                                <Button 
                                    onClick={() => handleAcceptReschedule(activeVisit.id)}
                                    disabled={isScheduling}
                                    className="h-14 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl px-12 text-lg shadow-xl shadow-sky-600/20 w-full sm:w-auto"
                                >
                                    {isScheduling ? <Loader2 className="w-6 h-6 animate-spin" /> : "Accept New Date & Lock In"}
                                </Button>
                            </div>
                        )}

                        {activeVisit.status === 'approved' && (
                            <div className="bg-emerald-50/80 border border-emerald-200/60 p-8 rounded-3xl shadow-sm text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-sm">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h4 className="font-black text-2xl text-emerald-950 mb-3 tracking-tight">Visit Schedule is Locked</h4>
                                <p className="text-emerald-800 text-lg mb-6 max-w-2xl mx-auto">
                                    Excellent! The schedule is officially locked in for <span className="font-bold bg-emerald-100/50 px-2 py-0.5 rounded border border-emerald-200/50">{activeVisit.proposed_date}</span>. Both parties have confirmed.
                                </p>
                                
                                {activeVisit.hr_notes && (
                                    <div className="max-w-xl mx-auto bg-white p-5 rounded-xl border border-emerald-100 text-emerald-800 flex flex-col sm:flex-row items-center gap-3 text-sm text-left shadow-sm">
                                        <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <p><strong>Note:</strong> {activeVisit.hr_notes}</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* HISTORY SECTION (IF ANY CANCELLED OR COMPLETED) */}
            {historyVisits.length > 0 && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <RotateCcw className="w-4 h-4"/> Historical Requests
                    </h5>
                    <div className="space-y-4">
                        {historyVisits.map((visit) => (
                            <div key={visit.id} className="bg-slate-50 border border-slate-200/60 hover:border-slate-300 hover:shadow-md transition-all rounded-3xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${visit.status === 'cancelled' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                        {visit.status === 'cancelled' ? <XCircle className="w-6 h-6"/> : <CheckCircle className="w-6 h-6"/>}
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 tracking-tight">
                                            {visit.proposed_date}
                                        </p>
                                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{visit.status.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                {visit.hr_notes && (
                                    <p className="text-sm text-slate-500 italic flex-1 max-w-md sm:text-right bg-white p-3 rounded-xl border border-slate-100">
                                        "{visit.hr_notes}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
