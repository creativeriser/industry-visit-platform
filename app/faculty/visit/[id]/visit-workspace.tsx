"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Loader2, Mail, Send, CalendarClock, Calendar as CalendarIcon, User, ShieldCheck, 
    CheckCircle, Clock, AlertCircle, MessageSquare, RotateCcw, XCircle, X,
    MapPin, Building2, Phone, ArrowRight, Edit3, Check, ChevronDown, Minus
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/modal"
import { getDisciplineIcon } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface VisitWorkspaceProps {
    company: any // Using any for brevity, matches getCompanyById return type
}

export function VisitWorkspace({ company }: VisitWorkspaceProps) {
    const [visitRecords, setVisitRecords] = useState<any[]>([])
    const [isLoadingRecord, setIsLoadingRecord] = useState(true)
    const [isScheduling, setIsScheduling] = useState(false)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    
    // Configuration Fields
    const [facultyDateObj, setFacultyDateObj] = useState<Date | undefined>(undefined)
    const facultyDate = facultyDateObj ? format(facultyDateObj, "MMMM d, yyyy") : company.date
    const [headcount, setHeadcount] = useState("")
    const [facultyMessage, setFacultyMessage] = useState("")
    const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([])
    const [startTime, setStartTime] = useState("10:00")
    const [endTime, setEndTime] = useState("14:00")
    const [isEditingMessage, setIsEditingMessage] = useState(false)
    
    // Negotiation State
    const [isCounterProposing, setIsCounterProposing] = useState(false)
    const [counterDate, setCounterDate] = useState("")
    const [counterStartTime, setCounterStartTime] = useState("")
    const [counterEndTime, setCounterEndTime] = useState("")
    const [counterHeadcount, setCounterHeadcount] = useState("")
    const [counterNote, setCounterNote] = useState("")
    const [chatInput, setChatInput] = useState("")
    const [isChatMinimized, setIsChatMinimized] = useState(true)
    const [showAllActivity, setShowAllActivity] = useState(false)

    const { user } = useAuth()
    const { user: profileUser } = useUser()
    const router = useRouter()

    type ChatMessage = {
        id: string
        sender: 'faculty' | 'hr' | 'system'
        text: string
        timestamp: string
    }
    
    const parseChatLog = (raw: string | null | undefined): ChatMessage[] => {
        if (!raw) return []
        try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) return parsed
        } catch {
            return [{ id: 'legacy', sender: 'system', text: raw, timestamp: new Date().toISOString() }]
        }
        return []
    }
    const DisciplineIcon = getDisciplineIcon(company.discipline)

    const formatTime12hr = (timeStr: string) => {
        if (!timeStr) return "";
        const [h, m] = timeStr.split(':');
        let hours = parseInt(h);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
    }

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
    }, [user, company.id])

    const fetchVisits = async () => {
        try {
            const { data, error } = await supabase
                .from('scheduled_visits')
                .select('*')
                .eq('company_id', company.id)
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
        try {
            // Include message inside hr_notes or just send it directly via email
            const fullProposedString = `${facultyDate} • ${formatTime12hr(startTime)} to ${formatTime12hr(endTime)} • ${headcount ? headcount + " Students" : "TBD Students"}`
            
            const { data, error } = await supabase
                .from('scheduled_visits')
                .insert([{
                    company_id: company.id,
                    faculty_id: user!.id,
                    proposed_date: fullProposedString,
                    status: 'pending_hr',
                    hr_notes: facultyMessage ? `Additional Context: ${facultyMessage}` : null
                }])
                .select()
                .single()

            if (data) {
                const magicLink = `${window.location.origin}/partner/approve/${data.id}`
                
                // Dispatch Automated HTML Email
                const emailRes = await fetch('/api/dispatch-visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        companyName: company.name,
                        hrEmail: company.representative.email,
                        hrName: company.representative.name,
                        facultyName: user?.user_metadata?.full_name || "Faculty Member",
                        facultyEmail: user?.email,
                        facultyDesignation: profileUser?.designation || "Faculty Member",
                        facultyInstitution: profileUser?.institution,
                        facultyDepartment: profileUser?.department,
                        facultyDate,
                        startTime: formatTime12hr(startTime),
                        endTime: formatTime12hr(endTime),
                        facultyMessage,
                        magicLink
                    })
                });

                if (!emailRes.ok) {
                    // Absolute confirmation: Ensure we revert the database if network dispatch fails
                    await supabase.from('scheduled_visits').delete().eq('id', data.id);
                    throw new Error("Failed to dispatch official secure email. Workflow reverted.");
                }

                // Everything succeeded! Now we commit to UI tracking
                setVisitRecords([data, ...visitRecords])
                setIsEmailModalOpen(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (err) {
            console.error(err)
            alert("Error: Could not dispatch secure email. Please ensure your provider API Key is configured.");
        } finally {
            setIsScheduling(false)
        }
    }

    const handleAcceptReschedule = async (visitId: string) => {
        setIsScheduling(true)
        try {
            const activeV = visitRecords.find(v => v.id === visitId)
            const chatLog = parseChatLog(activeV?.hr_notes)
            const newChat = [...chatLog, { id: Date.now().toString(), sender: 'system', text: 'Faculty Accepted Reschedule', timestamp: new Date().toISOString() } as ChatMessage]

            const { data, error } = await supabase
                .from('scheduled_visits')
                .update({ status: 'approved', hr_notes: JSON.stringify(newChat) })
                .eq('id', visitId)
                .select()
                .single()
            if (!error && data) setVisitRecords(prev => prev.map(v => v.id === visitId ? data : v))
        } catch (err) {
            console.error(err)
        } finally {
            setIsScheduling(false)
        }
    }

    const handleCancelVisit = async (visitId: string) => {
        if (!confirm("Are you sure you want to cancel this request?")) return;
        setIsScheduling(true)
        try {
            const activeV = visitRecords.find(v => v.id === visitId)
            const chatLog = parseChatLog(activeV?.hr_notes)
            const newChat = [...chatLog, { id: Date.now().toString(), sender: 'system', text: 'Cancelled by Faculty.', timestamp: new Date().toISOString() } as ChatMessage]

            const { data, error } = await supabase
                .from('scheduled_visits')
                .update({ status: 'cancelled', hr_notes: JSON.stringify(newChat) })
                .eq('id', visitId)
                .select()
                .single()
            if (!error && data) setVisitRecords(prev => prev.map(v => v.id === visitId ? data : v))
        } catch (err) {
            console.error(err)
        } finally {
            setIsScheduling(false)
        }
    }

    const handlePublishVisit = async (visitId: string) => {
        setIsScheduling(true)
        try {
            const activeV = visitRecords.find(v => v.id === visitId)
            const chatLog = parseChatLog(activeV?.hr_notes)
            const newChat = [...chatLog, { id: Date.now().toString(), sender: 'system', text: 'Faculty Published Visit to Students.', timestamp: new Date().toISOString() } as ChatMessage]

            const { data, error } = await supabase
                .from('scheduled_visits')
                .update({ status: 'published', hr_notes: JSON.stringify(newChat) })
                .eq('id', visitId)
                .select()
                .single()
            if (!error && data) setVisitRecords(prev => prev.map(v => v.id === visitId ? data : v))
        } catch (err) {
            console.error(err)
        } finally {
            setIsScheduling(false)
        }
    }

    const handleCounterPropose = async (visitId: string) => {
        if (!counterDate) return;
        setIsScheduling(true)
        try {
            // Build the golden rule structured string
            const finalDate = counterDate ? format(new Date(counterDate), "MMMM d, yyyy") : "TBD"
            let timeString = ""
            if (counterStartTime && counterEndTime) {
                timeString = ` • ${formatTime12hr(counterStartTime)} to ${formatTime12hr(counterEndTime)}`
            } else if (counterStartTime) {
                timeString = ` • ${formatTime12hr(counterStartTime)} onwards`
            }
            const headcountString = counterHeadcount ? ` • ${counterHeadcount} Students` : ""
            const fullCounterString = `${finalDate}${timeString}${headcountString}`

            const activeV = visitRecords.find(v => v.id === visitId)
            const chatLog = parseChatLog(activeV?.hr_notes)
            const newChat = [...chatLog, { id: Date.now().toString(), sender: 'system', text: `Faculty Counter-Proposed: ${fullCounterString}`, timestamp: new Date().toISOString() } as ChatMessage]
            
            if (counterNote.trim()) {
                newChat.push({ id: Date.now().toString() + "f", sender: 'system', text: `Additional Context: ${counterNote.trim()}`, timestamp: new Date().toISOString() } as ChatMessage)
            }

            const { data, error } = await supabase
                .from('scheduled_visits')
                .update({ status: 'pending_hr', proposed_date: fullCounterString, hr_notes: JSON.stringify(newChat) })
                .eq('id', visitId)
                .select()
                .single()
            
            if (!error && data) {
                setVisitRecords(prev => prev.map(v => v.id === visitId ? data : v))
                setIsCounterProposing(false)
                
                // Natively dispatch automated HTML Counter-Proposal notification to HR
                const magicLink = `${window.location.origin}/partner/approve/${data.id}`
                await fetch('/api/dispatch-visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        companyName: company.name,
                        hrEmail: company.representative.email,
                        hrName: company.representative.name,
                        facultyName: user?.user_metadata?.full_name || "Faculty Member",
                        facultyEmail: user?.email,
                        facultyDesignation: profileUser?.designation || "Faculty Member",
                        facultyInstitution: profileUser?.institution,
                        facultyDepartment: profileUser?.department,
                        facultyDate: finalDate,
                        startTime: counterStartTime ? formatTime12hr(counterStartTime) : "TBD",
                        endTime: counterEndTime ? formatTime12hr(counterEndTime) : "TBD",
                        facultyMessage: "The previous timing unfortunately conflicted with our academic schedule. Please review our counter-proposed timeframe.",
                        magicLink,
                        isCounterProposal: true
                    })
                });

                setCounterDate("")
                setCounterStartTime("")
                setCounterEndTime("")
                setCounterHeadcount("")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsScheduling(false)
        }
    }

    const handleSendFacultyMessage = async (visitId: string) => {
        if (!chatInput.trim()) return
        setIsScheduling(true)
        try {
            const activeV = visitRecords.find(v => v.id === visitId)
            const chatLog = parseChatLog(activeV?.hr_notes)
            const newChat = [...chatLog, { id: Date.now().toString(), sender: 'faculty', text: chatInput.trim(), timestamp: new Date().toISOString() } as ChatMessage]

            const { data, error } = await supabase
                .from('scheduled_visits')
                .update({ hr_notes: JSON.stringify(newChat) })
                .eq('id', visitId)
                .select()
                .single()
            
            if (!error && data) {
                setVisitRecords(prev => prev.map(v => v.id === visitId ? data : v))
                setChatInput("")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsScheduling(false)
        }
    }

    if (isLoadingRecord) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
    }

    const lastVisit = visitRecords.length > 0 ? visitRecords[0] : null;
    const activeVisit = lastVisit && !['cancelled', 'declined'].includes(lastVisit.status) ? lastVisit : null;
    const justCancelledVisit = lastVisit && ['cancelled', 'declined'].includes(lastVisit.status) ? lastVisit : null;
    const historyVisits = activeVisit ? visitRecords.slice(1) : visitRecords;
    const activeChatLog = activeVisit ? parseChatLog(activeVisit.hr_notes) : [];
    const systemNotes = activeChatLog.filter((msg: ChatMessage) => msg.sender === 'system');

    const renderFacultyChatThread = (visitId: string, chatLog: ChatMessage[]) => {
        const displayChat = chatLog.filter(msg => msg.sender !== 'system')

        const renderOfficialNotes = () => {
            if (systemNotes.length === 0) return null

            const groupedEvents = []
            let i = 0
            while (i < systemNotes.length) {
                const currentMsg = systemNotes[i]
                // Deduce Owner
                let owner = "system"
                const rawText = currentMsg.text
                if (rawText.includes("Cancel") || rawText.includes("Decline") || rawText.includes("Cancelled")) {
                    owner = "cancel"
                } else if (rawText.includes("Faculty") || rawText.includes("Context")) {
                    owner = "faculty"
                } else if (rawText.includes("HR") || rawText.includes("Accept")) {
                    owner = "hr"
                }

                const eventBlock = {
                    id: currentMsg.id,
                    actionText: rawText.replace("Faculty Counter-Proposed:", "Faculty Rescheduled:"),
                    noteText: null as string | null,
                    owner: owner
                }
                
                // Check if next message is a connected note
                if (i + 1 < systemNotes.length) {
                    const nextMsg = systemNotes[i + 1]
                    const isAction = nextMsg.text.includes('Rescheduled') || nextMsg.text.includes('Proposed') || nextMsg.text.includes('Accept') || nextMsg.text.includes('Cancel') || nextMsg.text.includes('Decline')
                    
                    if (nextMsg.text.startsWith('HR Note:') || nextMsg.text.startsWith('Additional Context:') || !isAction) {
                        eventBlock.noteText = nextMsg.text
                        // Backwards compatibility deduction:
                        if (eventBlock.owner === "system") {
                            if (nextMsg.text.startsWith('HR Note:')) eventBlock.owner = "hr"
                            else if (nextMsg.text.startsWith('Additional Context:')) eventBlock.owner = "faculty"
                            else eventBlock.owner = "hr" // Default bare schedules typically come from HR in older logs
                        }
                        i++ 
                    }
                } else if (eventBlock.owner === "system" && !rawText.includes("Cancel")) {
                    eventBlock.owner = "hr"
                }

                // Patch raw date strings for HR legacy actions
                if (eventBlock.owner === "hr" && !eventBlock.actionText.includes("HR") && !eventBlock.actionText.includes("Accept")) {
                    eventBlock.actionText = `HR Rescheduled: ${eventBlock.actionText}`
                }

                groupedEvents.push(eventBlock)
                i++
            }

            return (
                <div className="bg-slate-50/40 border border-slate-200/60 rounded-[28px] p-8 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 m-0">
                            <Clock className="w-4 h-4" /> Official Decision Timeline
                        </h4>
                        {groupedEvents.length > 1 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowAllActivity(!showAllActivity)} 
                                className="h-7 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-slate-100 px-3 rounded-full border border-indigo-100"
                            >
                                {showAllActivity ? "Show Latest Only" : "Show Full Timeline"}
                            </Button>
                        )}
                    </div>
                    <div className="space-y-1 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                        {(showAllActivity ? groupedEvents : groupedEvents.slice(-1)).map(event => {
                            let Icon = Clock;
                            // Parse Prefix
                            let splitIndex = event.actionText.indexOf(':');
                            let actionPrefix = splitIndex > -1 ? event.actionText.substring(0, splitIndex).trim() : event.actionText;
                            let actionPayload = splitIndex > -1 ? event.actionText.substring(splitIndex + 1).trim() : null;

                            if (!actionPayload && !event.noteText) {
                                actionPayload = event.actionText;
                            }

                            let personaName = "System";
                            let actionVerb = "recorded an event";
                            
                            let tagColor = "text-slate-500";
                            let colorTheme = 'text-slate-400 bg-white ring-slate-50';
                            let actionBorder = 'border-slate-200/60';
                            let noteBg = 'bg-slate-50/70';
                            let noteText = 'text-slate-600';
                            let cardBg = 'bg-white';
                            let payloadText = 'text-slate-800';

                            if (event.owner === "cancel") {
                                Icon = XCircle;
                                personaName = "System";
                                actionVerb = "cancelled the request";
                                tagColor = "text-red-600";
                                colorTheme = 'text-red-500 bg-white ring-slate-50';
                            } else if (event.owner === "faculty") {
                                Icon = User;
                                personaName = "Faculty";
                                actionVerb = actionPrefix.toLowerCase().includes("accept") ? "approved the visit" : 
                                            actionPrefix.toLowerCase().includes("reschedule") || actionPrefix.toLowerCase().includes("propos") ? "proposed a generic time" : "updated the request";
                                if (actionPayload?.includes("•")) actionVerb = "rescheduled the visit";

                                tagColor = "text-indigo-600";
                                colorTheme = 'text-indigo-600 bg-white ring-slate-50';
                            } else if (event.owner === "hr") {
                                Icon = Building2;
                                personaName = "HR";
                                actionVerb = actionPrefix.toLowerCase().includes("accept") ? "approved the visit" : 
                                            actionPrefix.toLowerCase().includes("reschedule") || actionPrefix.toLowerCase().includes("propos") ? "proposed an alternative" : 
                                            "left a note";
                                            
                                tagColor = "text-emerald-600";
                                colorTheme = 'text-emerald-600 bg-white ring-slate-50';
                            }

                            if (actionVerb.includes("approved")) {
                                Icon = CheckCircle;
                                colorTheme = 'text-white bg-emerald-500 ring-emerald-50';
                                actionBorder = 'border-emerald-400 bg-emerald-500 shadow-emerald-500/20';
                                cardBg = 'bg-emerald-500';
                                payloadText = 'text-white';
                                noteBg = 'bg-emerald-600/50';
                                noteText = 'text-emerald-50';
                            }

                            return (
                                <div key={event.id} className="relative flex items-start gap-4 pb-6">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ${colorTheme} z-10 border border-slate-100 shadow-sm mt-0.5 transition-colors`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <div className="flex items-center gap-1.5 mb-2 pl-0.5">
                                            <span className={`text-[12px] font-bold ${tagColor} tracking-tight`}>{personaName}</span>
                                            <span className="text-[12px] font-medium text-slate-400">{actionVerb}</span>
                                        </div>
                                        
                                        <div className={`${cardBg} rounded-[16px] border ${actionBorder} shadow-sm overflow-hidden ${payloadText} transition-colors`}>
                                            {actionPayload && (
                                                <div className="px-5 py-3.5 text-[13px] font-bold leading-relaxed">
                                                    {actionPayload}
                                                </div>
                                            )}
                                            {event.noteText && (
                                                <div className={`px-5 py-3 text-[12.5px] font-medium italic ${noteBg} ${noteText} ${actionPayload ? 'border-t border-slate-100' : ''}`}>
                                                    {event.noteText.replace('HR Note:', '').replace('Additional Context:', '').trim()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }

        return (
            <div className="mt-8 pt-8 border-t border-slate-200/60 flex flex-col w-full">
                {/* Official Timeline Restored */}
                {renderOfficialNotes()}

                {/* Local Chat Thread */}
                <div 
                    className={`flex flex-col animate-in fade-in duration-500 bg-white border border-slate-200/50 shadow-sm transition-all ${isChatMinimized ? 'rounded-2xl cursor-pointer hover:bg-slate-50 p-5' : 'rounded-3xl p-8'}`}
                    onClick={() => isChatMinimized && setIsChatMinimized(false)}
                >
                    {isChatMinimized ? (
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-indigo-500" /> 
                                Direct Message <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] ml-1">{displayChat.length} messages</span>
                            </h4>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setIsChatMinimized(false); }}>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                        Direct Message
                                    </h4>
                                    <p className="text-slate-500 text-[13px] font-medium mt-1">Chat directly with the HR team for quick clarifications.</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setIsChatMinimized(true)} className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full shrink-0">
                                    <Minus className="w-4 h-4 text-slate-400" />
                                </Button>
                            </div>
                            
                            <div className="flex flex-col gap-6 mb-2 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                                {displayChat.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">No messages yet.<br/>Type below to start a quick chat.</p>
                                    </div>
                                ) : (
                                    displayChat.map((msg) => {
                                        const isFaculty = msg.sender === 'faculty'

                                        return (
                                            <div key={msg.id} className={`flex flex-col ${isFaculty ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 fade-in`}>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">{isFaculty ? 'You' : 'HR Team'}</span>
                                                <div className={`relative max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed font-medium shadow-sm ${
                                                    isFaculty 
                                                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-600/10' 
                                                        : 'bg-slate-50 border border-slate-200/60 text-slate-700 rounded-tl-sm'
                                                }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendFacultyMessage(visitId)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white focus:border-indigo-200 border border-transparent text-[14px] font-medium rounded-2xl px-5 h-12 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                                />
                                <Button 
                                    onClick={() => handleSendFacultyMessage(visitId)}
                                    disabled={isScheduling || !chatInput.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-600/10 shrink-0 transition-transform hover:scale-105 active:scale-95 p-0"
                                >
                                    {isScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            {/* UNIFIED HERO HEADER */}
            <div className="bg-white border-b border-slate-200/60 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
                    <div className="flex flex-col">
                        <div className="space-y-4 max-w-3xl">
                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {company.name}
                            </h1>

                            {/* Meta Metrics Bar */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                {/* Location */}
                                <div className="inline-flex items-center text-slate-600 font-bold text-sm bg-slate-100/80 px-3.5 py-2 rounded-xl">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                    {company.location}
                                </div>

                                {/* Discipline Tag */}
                                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100 shadow-sm">
                                    <DisciplineIcon className="w-4 h-4" />
                                    {company.discipline}
                                </div>
                                
                                {/* Status Badge */}
                                {activeVisit ? (
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl text-emerald-700 font-bold shadow-sm">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm">Coordination Active</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* SCENARIO B: ACTIVE TRACKING CARD (If Active) */}
                {activeVisit && (
                    <div className="mb-12 bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-8 md:p-10 flex flex-col xl:flex-row gap-10 items-start justify-between">
                        
                        {/* Left Side: Dynamic Status Message & Actions */}
                        <div className="flex-1 w-full max-w-4xl pr-0 xl:pr-6">
                            {activeVisit.status === 'pending_hr' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Awaiting HR Response</h2>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed text-base mb-6">
                                        Your proposal for <strong className="text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{activeVisit.proposed_date}</strong> has been delivered. We are waiting for {company.representative.name} to review and lock it in.
                                    </p>
                                    <Button onClick={() => handleCancelVisit(activeVisit.id)} variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold -ml-3 h-10">
                                        Cancel Request
                                    </Button>
                                </div>
                            )}

                            {activeVisit.status === 'rescheduled' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 shrink-0">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Time Proposed</h2>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed text-base mb-4">
                                        HR proposed <strong className="text-sky-600 bg-sky-50 px-2 py-1 rounded-md border border-sky-100/50">{activeVisit.proposed_date}</strong>. 
                                    </p>
                                    
                                    {!isCounterProposing ? (
                                        <div className="flex flex-wrap items-center gap-3 mt-6">
                                            <Button onClick={() => handleAcceptReschedule(activeVisit.id)} disabled={isScheduling} className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl px-6 h-11 shadow-sm transition-transform hover:scale-105">
                                                {isScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept New Date"}
                                            </Button>
                                            <Button onClick={() => setIsCounterProposing(true)} variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900 font-bold rounded-xl px-5 h-11">
                                                Counter-Propose
                                            </Button>
                                            <Button onClick={() => handleCancelVisit(activeVisit.id)} variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold px-4 h-11">
                                                Decline
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-6 animate-in zoom-in-95 duration-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Counter-Propose Terms</p>
                                                <Button onClick={() => setIsCounterProposing(false)} variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-lg"><X className="w-4 h-4" /></Button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 pl-1">New Date</label>
                                                    <input 
                                                        type="date" 
                                                        value={counterDate}
                                                        onChange={(e) => setCounterDate(e.target.value)}
                                                        className="w-full bg-white text-sm font-bold rounded-xl h-11 px-3 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 pl-1">Target Headcount <span className="opacity-50 lowercase tracking-normal text-[9px]">(Optional)</span></label>
                                                    <input 
                                                        type="number" 
                                                        value={counterHeadcount}
                                                        onChange={(e) => setCounterHeadcount(e.target.value)}
                                                        placeholder="e.g. 40"
                                                        className="w-full bg-white text-sm font-bold rounded-xl h-11 px-3 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 pl-1">Start Time</label>
                                                    <input 
                                                        type="time" 
                                                        value={counterStartTime}
                                                        onChange={(e) => setCounterStartTime(e.target.value)}
                                                        className="w-full bg-white text-sm font-bold rounded-xl h-11 px-3 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 pl-1">End Time</label>
                                                    <input 
                                                        type="time" 
                                                        value={counterEndTime}
                                                        onChange={(e) => setCounterEndTime(e.target.value)}
                                                        className="w-full bg-white text-sm font-bold rounded-xl h-11 px-3 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 pl-1">Attach a Note <span className="opacity-50 lowercase tracking-normal text-[9px]">(Optional)</span></label>
                                                <textarea 
                                                    value={counterNote}
                                                    onChange={(e) => setCounterNote(e.target.value)}
                                                    placeholder="E.g. We had a conflict with standard curriculum hours. Does this work?"
                                                    className="w-full bg-white text-sm font-medium rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none shadow-sm"
                                                    rows={2}
                                                />
                                            </div>
                                            
                                            <div className="flex justify-end pt-1">
                                                <Button onClick={() => handleCounterPropose(activeVisit.id)} disabled={isScheduling || !counterDate || !counterStartTime || !counterEndTime} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl px-8 shadow-sm">
                                                    {isScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Dispatch Counter-Offer"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeVisit.status === 'approved' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Visit Confirmed by HR</h2>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed text-base mb-6">
                                        HR has officially approved <strong className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50">{activeVisit.proposed_date}</strong>. You can now securely publish this to students when you're ready.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <Button onClick={() => handlePublishVisit(activeVisit.id)} disabled={isScheduling} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all">
                                            {isScheduling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                                            Publish Visit to Students
                                        </Button>
                                        <Button onClick={() => handleCancelVisit(activeVisit.id)} variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold h-10">
                                            Cancel Visit
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeVisit.status === 'published' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-black text-indigo-600 tracking-tight">Visit Published!</h2>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed text-base mb-6">
                                        This visit is mapped to <strong className="text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100/50">{activeVisit.proposed_date}</strong> and is officially live on the student dashboard. Students can now directly apply.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Button onClick={() => router.push('/faculty/applications')} className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold h-11 px-8 rounded-xl shadow-sm transition-all hover:-translate-y-0.5">
                                            View Live Applications
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Conversation Thread */}
                            {renderFacultyChatThread(activeVisit.id, parseChatLog(activeVisit.hr_notes))}
                        </div>

                        {/* Right Side: Compact Vertical Stepper */}
                        <div className="w-full xl:w-64 xl:border-l xl:border-slate-100 xl:pl-10 space-y-6 pt-8 xl:pt-0 border-t border-slate-100 xl:border-t-0">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Progress</p>
                            <div className="relative space-y-6">
                                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10" />
                                
                                {/* Step 1 */}
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-4 ring-white shrink-0 mt-0.5">
                                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Dispatched</p>
                                        <p className="text-slate-500 text-xs mt-0.5 font-medium">Invite sent out</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-start gap-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 mt-0.5 ${
                                        ['approved', 'published'].includes(activeVisit.status) ? 'bg-indigo-600 text-white' 
                                        : ['pending_hr', 'rescheduled'].includes(activeVisit.status) ? 'bg-amber-400 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {['approved', 'published'].includes(activeVisit.status) ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <Clock className="w-3.5 h-3.5 flex-shrink-0" />}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${['pending_hr', 'rescheduled', 'approved', 'published'].includes(activeVisit.status) ? 'text-slate-900' : 'text-slate-400'}`}>Review</p>
                                        <p className="text-slate-500 text-xs mt-0.5 font-medium">HR feedback</p>
                                    </div>
                                </div>

                                {/* Step 3: Approved */}
                                <div className="flex items-start gap-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 mt-0.5 ${
                                        activeVisit.status === 'published' ? 'bg-indigo-600 text-white' 
                                        : activeVisit.status === 'approved' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {['approved', 'published'].includes(activeVisit.status) ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <Clock className="w-3.5 h-3.5 flex-shrink-0" />}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${['approved', 'published'].includes(activeVisit.status) ? 'text-slate-900' : 'text-slate-400'}`}>Approved</p>
                                        <p className="text-slate-500 text-xs mt-0.5 font-medium">Dates Locked</p>
                                    </div>
                                </div>

                                {/* Step 4: Published */}
                                <div className="flex items-start gap-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 mt-0.5 ${
                                        activeVisit.status === 'published' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${activeVisit.status === 'published' ? 'text-slate-900' : 'text-slate-400'}`}>Published</p>
                                        <p className="text-slate-500 text-xs mt-0.5 font-medium">Open to Students</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* JUST CANCELLED ALERT */}
                {justCancelledVisit && !activeVisit && (() => {
                    const logs = parseChatLog(justCancelledVisit.hr_notes);
                    const cancelLog = logs.find(l => l.text.includes('HR Cancelled:'));
                    const cancelReason = cancelLog ? cancelLog.text.replace('HR Cancelled:', '').trim() : null;

                    return (
                        <div className="mb-12 bg-white rounded-[24px] border border-red-200 shadow-sm p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-center justify-between animate-in fade-in duration-500">
                            <div className="flex-1 max-w-2xl text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-inner">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-red-600 tracking-tight">Visit Cancelled by HR</h2>
                                </div>
                                <div className="text-slate-600 font-medium leading-relaxed text-base">
                                    <p>
                                        The immediate preceding proposal for <strong className="text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{justCancelledVisit.proposed_date ? justCancelledVisit.proposed_date.split(' • ')[0] : "TBD"}</strong> has been formally cancelled.
                                    </p>
                                    
                                    {cancelReason ? (
                                        <div className="my-4 p-4 bg-red-50 text-red-700/90 rounded-xl border border-red-100/50 font-medium md:text-[15px] shadow-sm">
                                            <strong className="block text-[11px] font-bold uppercase tracking-widest text-red-500 mb-1">Reason Provided</strong>
                                            {cancelReason}
                                        </div>
                                    ) : (
                                        <p className="mt-2">The historical log reflects the finalized termination, and the visit is officially closed.</p>
                                    )}
                                    
                                    <p className={cancelReason ? "" : "mt-2"}>
                                        If you still wish to coordinate with {company.name}, you may draft a brand new proposal below.
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => document.getElementById('configuration-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold h-12 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
                            >
                                Draft New Proposal
                            </Button>
                        </div>
                    );
                })()}

                {/* SCENARIO A: INITIAL PLANNING BODY CONTENT (Hidden when active) */}
                {!activeVisit && (
                    <div className="grid gap-10 md:grid-cols-3 md:gap-16 pt-4 border-b border-slate-200/60 pb-16">
                        
                        {/* Main Information Column */}
                        <div className="md:col-span-2 space-y-12">
                            {/* About Section */}
                            <section className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-indigo-500" />
                                    About the Visit
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-base font-medium">
                                    {company.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {company.tags.map((tag: string) => (
                                        <span key={tag} className="text-sm font-bold text-slate-400 bg-white border border-slate-200/60 px-4 py-1.5 rounded-full shadow-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right/Sidebar Column - Formal Configurator */}
                        <div className="md:col-span-1 space-y-8">
                            <div className="bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-sm sticky top-8 mb-8 flex flex-col">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Ready to Plan?</h3>
                                <p className="text-slate-500 text-[15px] font-medium mb-8 leading-relaxed">
                                    Coordinate dates, timings, and logistics with the HR team to formally schedule your visit.
                                </p>
                                <Button 
                                    onClick={() => document.getElementById('configuration-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-bold h-14 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                                >
                                    <CalendarClock className="w-5 h-5 mr-2" />
                                    Schedule Visit
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                    {/* FULL WIDTH: History Log */}
                    {historyVisits.length > 0 && (
                        <div className="md:col-span-3 space-y-6 pt-12 mt-4 border-t border-slate-200/60 w-full">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    Activity Log
                                </h3>
                                <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all" title="Refresh Log">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {historyVisits.map((visit) => {
                                    const parsedProposal = visit.proposed_date ? visit.proposed_date.split(' • ') : ["Unknown Date"];
                                    const dateOnly = parsedProposal[0] || visit.proposed_date;
                                    const timeOnly = parsedProposal.length > 1 ? parsedProposal[1] : null;
                                    const headcountOnly = parsedProposal.length > 2 ? parsedProposal[2] : null;
                                    const isCancelled = visit.status === 'cancelled' || visit.status === 'declined';

                                    return (
                                        <div key={visit.id} className="bg-white border border-slate-200/60 rounded-[24px] p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:shadow-md transition-all group">
                                            
                                            {/* LEFT: Meta Details */}
                                            <div className="lg:col-span-7 flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 border-4 border-slate-50 ${isCancelled ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                    {isCancelled ? <XCircle className="w-5 h-5"/> : <CheckCircle className="w-5 h-5"/>}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-slate-900 tracking-tight">
                                                        {dateOnly}
                                                    </p>
                                                    <div className="flex items-center flex-wrap gap-2.5 mt-1.5">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${isCancelled ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                            {visit.status.replace('_', ' ')}
                                                        </span>
                                                        {timeOnly && (
                                                            <>
                                                                <span className="text-slate-300">•</span>
                                                                <p className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5">
                                                                    <Clock className="w-3.5 h-3.5" /> 
                                                                    {timeOnly}
                                                                </p>
                                                            </>
                                                        )}
                                                        {(headcountOnly || !timeOnly) && (
                                                            <>
                                                                <span className="text-slate-300">•</span>
                                                                <p className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5">
                                                                    <User className="w-3.5 h-3.5" /> 
                                                                    {headcountOnly || `${company.capacity || 50} Students`}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        {/* RIGHT: Chat Summary */}
                                        {parseChatLog(visit.hr_notes).filter((msg: ChatMessage) => msg.sender !== 'system').length > 0 ? (
                                            <div className="lg:col-span-5 flex justify-end">
                                                <div className="text-sm text-slate-600 bg-slate-50/50 rounded-2xl p-4 lg:text-right border border-slate-100 w-full max-w-lg">
                                                    <p className="font-medium italic leading-relaxed text-slate-500">
                                                        "{parseChatLog(visit.hr_notes).filter((msg: ChatMessage) => msg.sender !== 'system').slice(-1)[0].text}"
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="lg:col-span-5" />
                                        )}
                                    </div>
                                )})}
                            </div>
                        </div>
                    )}
                </div>

            
            <div className="w-full bg-slate-50 border-t border-slate-200/60 pt-20 pb-24">
                {/* SCENARIO A: INTEGRATED SCHEDULING FORM (Only if not active) */}
                        {!activeVisit && (
                            <div id="configuration-section" className="max-w-6xl mx-auto px-6">
                                <div className="mb-14 text-center">
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Ready to Plan?</h3>
                                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Lock in a date, define timings, and configure the perfect immersive visit experience for your students.</p>
                                </div>
                                <div className="bg-white rounded-[32px] p-8 md:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 relative z-10 w-full">
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        
                                        {/* Left Column: Date & Time */}
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">Target Date</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={`w-full justify-start text-left font-bold rounded-2xl h-14 pl-12 pr-4 border-slate-200 transition-all relative ${
                                                                !facultyDateObj ? "text-slate-500 bg-slate-50 hover:bg-white" : "text-slate-900 bg-white shadow-sm"
                                                            }`}
                                                        >
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                                <CalendarIcon className="w-5 h-5" />
                                                            </div>
                                                            {facultyDateObj ? format(facultyDateObj, "MMMM d, yyyy") : company.date}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 shadow-xl" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={facultyDateObj}
                                                            onSelect={setFacultyDateObj}
                                                            initialFocus
                                                            className="p-4"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">Start Time</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                            <Clock className="w-4 h-4" />
                                                        </div>
                                                        <input 
                                                            type="time" 
                                                            value={startTime}
                                                            onChange={(e) => setStartTime(e.target.value)}
                                                            className="w-full bg-slate-50 text-slate-900 font-bold rounded-2xl h-14 pl-11 pr-3 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 border border-slate-200 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">End Time</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                            <Clock className="w-4 h-4" />
                                                        </div>
                                                        <input 
                                                            type="time" 
                                                            value={endTime}
                                                            onChange={(e) => setEndTime(e.target.value)}
                                                            className="w-full bg-slate-50 text-slate-900 font-bold rounded-2xl h-14 pl-11 pr-3 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 border border-slate-200 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Headcount & Focus */}
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">Expected Headcount</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <input 
                                                        type="number" 
                                                        value={headcount}
                                                        onChange={(e) => setHeadcount(e.target.value)}
                                                        className="w-full bg-slate-50 text-slate-900 font-bold rounded-2xl h-14 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 border border-slate-200 transition-all placeholder:text-slate-400"
                                                        placeholder={`Max: ${company.capacity || 'N/A'}`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1 flex items-center justify-between">
                                                    <span>Focus Areas</span>
                                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Optional</span>
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Plant Tour', 'Technical Seminar', 'Exec Q&A', 'HR Session'].map(outcome => {
                                                        const isSelected = selectedOutcomes.includes(outcome);
                                                        return (
                                                            <button
                                                                key={outcome}
                                                                onClick={() => setSelectedOutcomes(prev => isSelected ? prev.filter(o => o !== outcome) : [...prev, outcome])}
                                                                className={`h-11 px-4 rounded-xl text-sm font-bold border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                                            >
                                                                {outcome}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Width Row: Context */}
                                    <div className="mt-10 space-y-4 border-t border-slate-100 pt-8">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1 flex items-center justify-between">
                                            <span>Faculty Context</span>
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Optional</span>
                                        </label>
                                        <textarea 
                                            value={facultyMessage}
                                            onChange={(e) => setFacultyMessage(e.target.value)}
                                            className="w-full bg-slate-50 text-slate-900 font-medium rounded-2xl p-5 h-28 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 border border-slate-200 transition-all placeholder:text-slate-400 resize-none text-sm"
                                            placeholder="Provide any context for the HR team regarding your students, specific areas of interest, or past prerequisites..."
                                        />
                                    </div>
                                    
                                    <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-6 rounded-[24px] border border-slate-200/60">
                                        <p className="text-sm font-medium text-slate-500 max-w-sm">Generating an official Secure Email draft for your review. No emails are sent without your approval.</p>
                                        <Button 
                                            onClick={openEmailSimulation}
                                            disabled={isScheduling || !facultyDate.trim() || !headcount.trim()}
                                            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-indigo-600/30 text-[15px] transition-all group shrink-0"
                                        >
                                            <Mail className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> 
                                            Draft Proposal
                                        </Button>
                                    </div>
                                    
                                </div>
                            </div>
                        )}
            </div>
            
            {/* EMAIL MODAL SIMULATOR */}
            <Modal 
                isOpen={isEmailModalOpen} 
                onClose={() => setIsEmailModalOpen(false)}
                className="max-w-2xl bg-white p-0 overflow-hidden flex flex-col max-h-[90vh]"
                contentClassName="p-0 flex flex-col flex-1 min-h-0"
            >
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center text-slate-500 text-sm font-bold gap-3 uppercase tracking-widest shrink-0">
                    <Mail className="w-4 h-4 text-indigo-500" /> Email Draft Preview
                </div>
                
                <div className="p-6 md:p-10 bg-white overflow-y-auto">
                    <div className="max-w-xl space-y-8 text-slate-700">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</p>
                            <p className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Company Visit Request: {company.name}</p>
                        </div>

                        <div className="space-y-4 text-lg leading-relaxed font-medium">
                            <p>Dear {company.representative.name},</p>
                            <p>
                                I am writing to you on behalf of the <strong>{profileUser?.institution || 'UniVisit Institution'}</strong>. We are reaching out to explore the possibility of organizing a formal industry visit for our students at <strong>{company.name}</strong>.
                            </p>
                            <p>
                                We have tentatively proposed <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{facultyDate}</strong> during the timeframe of <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{formatTime12hr(startTime)} to {formatTime12hr(endTime)}</strong> for this engagement. Our goal is to provide our students with practical industry exposure that directly aligns with their academic curriculum.
                            </p>
                            
                            <div className="py-2">
                                {!isEditingMessage ? (
                                    <div className="group relative bg-slate-50 border border-slate-200/60 rounded-xl p-4 transition-all hover:border-indigo-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faculty Context</span>
                                            <button 
                                                onClick={() => setIsEditingMessage(true)}
                                                className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 opacity-100 transition-opacity"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                        </div>
                                        {facultyMessage.trim() ? (
                                            <p className="text-slate-600 font-medium italic text-base">"{facultyMessage}"</p>
                                        ) : (
                                            <p className="text-slate-400 font-medium italic text-sm">No additional context provided.</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Editing Context</label>
                                            <button 
                                                onClick={() => setIsEditingMessage(false)}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border border-indigo-100 transition-all"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Done
                                            </button>
                                        </div>
                                        <textarea 
                                            value={facultyMessage}
                                            onChange={(e) => setFacultyMessage(e.target.value)}
                                            className="w-full bg-white text-slate-700 font-medium rounded-lg p-3 h-24 outline-none focus:ring-2 focus:ring-indigo-500/50 border border-slate-200 transition-all placeholder:text-slate-400 resize-none text-base"
                                            placeholder="Add any additional context for the HR team here..."
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="py-8 my-8 flex justify-center">
                                <div className="text-center w-full max-w-sm mx-auto flex flex-col items-center">
                                    <h4 className="font-bold text-slate-900 text-base mb-1">Automated Action Link</h4>
                                    <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">The HR Representative will click the button below to securely Accept or Counter the proposal.</p>
                                    <div className="h-12 w-[80%] max-w-[240px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-indigo-600/20 text-sm transition-colors cursor-pointer">
                                        Open Secure Portal
                                    </div>
                                </div>
                            </div>

                            <p>We look forward to collaborating with you.</p>
                            <div className="pt-6 mt-6 border-t border-slate-100">
                                <p className="text-slate-400 text-sm font-bold">Best regards,</p>
                                <p className="text-slate-900 font-bold">{(user?.user_metadata?.full_name || "Faculty Member").replace(/[0-9]/g, '').trim()}</p>
                                <p className="text-slate-500 font-medium text-sm">{profileUser?.designation || "Faculty Member"}{profileUser?.department ? `, ${profileUser?.department}` : ''}</p>
                                <p className="text-slate-500 font-bold text-sm">{profileUser?.institution || 'University / Educational Institution'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-6 py-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
                    <p className="text-xs text-slate-400 font-bold hidden sm:block">Internal routing natively secured.</p>
                    <div className="flex gap-3 w-full justify-end sm:w-auto">
                        <Button variant="ghost" onClick={() => setIsEmailModalOpen(false)} className="h-12 px-8 rounded-xl font-bold text-slate-500 hover:text-slate-800 bg-slate-200/50 hover:bg-slate-200">
                            Close
                        </Button>
                        <Button 
                            onClick={handleActualSchedule} 
                            disabled={isScheduling} 
                            className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-[240px] h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center"
                        >
                            {isScheduling ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Dispatching...</> : <><Send className="w-4 h-4 mr-2" /> Send Official Request</>}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
