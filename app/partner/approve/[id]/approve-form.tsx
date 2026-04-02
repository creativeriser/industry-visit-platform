"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Clock, Loader2, Send, XCircle, RotateCcw, AlertCircle, Edit2, ChevronDown, Minus, MessageSquare, User, Building2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ApproveFormProps {
    visitId: string
    currentProposedDate: string
    facultyEmail: string
    initialStatus: string
    hrNotes?: string | null
    leftContent?: React.ReactNode
}

export function ApproveForm({ visitId, currentProposedDate, facultyEmail, initialStatus, hrNotes, leftContent }: ApproveFormProps) {
    const [status, setStatus] = useState(initialStatus)
    const [loadingAction, setLoadingAction] = useState<"idle" | "accept" | "reschedule" | "decline" | "chat">("idle")
    const [view, setView] = useState<"default" | "reschedule_mode">("default")
    
    // Reschedule form state
    const [overrideDate, setOverrideDate] = useState("")
    const [overrideStartTime, setOverrideStartTime] = useState("")
    const [overrideEndTime, setOverrideEndTime] = useState("")
    const [overrideHeadcount, setOverrideHeadcount] = useState("")
    const [note, setNote] = useState("")

    // Chat System State
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

    const [chatLog, setChatLog] = useState<ChatMessage[]>(parseChatLog(hrNotes))
    const [chatInput, setChatInput] = useState("")
    const [isChatMinimized, setIsChatMinimized] = useState(true)

    const formatTime12hr = (time24: string) => {
        if (!time24) return ""
        const [h, m] = time24.split(':')
        const hours = parseInt(h, 10)
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const hours12 = hours % 12 || 12
        return `${hours12.toString().padStart(2, '0')}:${m} ${ampm}`
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        // Ensures YYYY-MM-DD parses in local time safely
        const [y, m, d] = dateString.split('-')
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    const updateVisitStatus = async (newStatus: string, actionNote: string, date: string, actionKey: "accept" | "reschedule" | "decline" | "chat") => {
        setLoadingAction(actionKey)
        
        let updatedChatJSON = ""
        if (actionKey === "chat") {
            const newChat = [...chatLog, { id: Date.now().toString(), sender: 'hr', text: chatInput.trim(), timestamp: new Date().toISOString() } as ChatMessage]
            updatedChatJSON = JSON.stringify(newChat)
            setChatLog(newChat)
            setChatInput("")
            
            const { error: chatError } = await supabase.from('scheduled_visits').update({ hr_notes: updatedChatJSON }).eq('id', visitId)
            if (chatError) alert('Failed to send message.')
            setLoadingAction("idle")
            return
        }

        const newChat = [...chatLog, { id: Date.now().toString(), sender: 'system', text: actionNote, timestamp: new Date().toISOString() } as ChatMessage]
        if (note.trim() && actionKey === "reschedule") {
            newChat.push({ id: Date.now().toString() + "h", sender: 'system', text: `HR Note: ${note.trim()}`, timestamp: new Date().toISOString() } as ChatMessage)
        }
        updatedChatJSON = JSON.stringify(newChat)

        const { error } = await supabase
            .from('scheduled_visits')
            .update({ status: newStatus, hr_notes: updatedChatJSON, proposed_date: date })
            .eq('id', visitId)

        if (!error) {
            setStatus(newStatus)
            setView("default")
            setChatLog(newChat)
        } else {
            alert('Failed to update. Please try again.')
        }
        setLoadingAction("idle")
    }

    const handleAccept = () => updateVisitStatus('approved', 'HR Accepted the proposed date.', currentProposedDate, "accept")
    const handleDecline = () => {
        if (confirm("Are you sure you want to decline this request? The faculty will be notified.")) {
            updateVisitStatus('cancelled', 'HR declined the request natively.', currentProposedDate, "decline")
        }
    }
    const handleRescheduleSubmit = () => {
        const finalDate = overrideDate ? formatDate(overrideDate) : currentProposedDate.split(' • ')[0]
        let timeString = ""
        if (overrideStartTime && overrideEndTime) {
            timeString = ` • ${formatTime12hr(overrideStartTime)} to ${formatTime12hr(overrideEndTime)}`
        } else if (overrideStartTime) {
            timeString = ` • ${formatTime12hr(overrideStartTime)} onwards`
        } else if (currentProposedDate.split(' • ').length > 1) {
            timeString = ` • ${currentProposedDate.split(' • ')[1]}`
        }
        
        let headcountString = ""
        if (overrideHeadcount) {
            headcountString = ` • ${overrideHeadcount} Students`
        } else if (currentProposedDate.split(' • ').length > 2) {
            headcountString = ` • ${currentProposedDate.split(' • ')[2]}`
        }

        const finalString = `${finalDate}${timeString}${headcountString}`
        updateVisitStatus('rescheduled', `HR Rescheduled: ${finalString}`, finalString, "reschedule")
    }

    const renderActions = () => {
        // If cancelled / declined
        if (status === 'cancelled') {
            return (
                <div className="flex flex-col items-center justify-center text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mb-4">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Request Declined</h3>
                    <p className="text-slate-500 text-[13px] max-w-[280px] leading-relaxed">This visit request has been cancelled. Reach out to the faculty member via email if this was a mistake.</p>
                </div>
            )
        }

        // Reschedule form view
        if (view === "reschedule_mode") {
            return (
                <div className="space-y-6">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">Propose Alternate Time</h4>
                        <p className="text-slate-500 text-[13px] leading-relaxed mt-1">Suggest a new date and time that works better for your team.</p>
                    </div>
                    
                    <div className="space-y-5 bg-slate-50 border border-slate-100 rounded-2xl p-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">New Date <span className="opacity-50 text-[9px] lowercase tracking-normal">(Optional)</span></label>
                                <input 
                                    type="date" 
                                    value={overrideDate}
                                    onChange={(e) => setOverrideDate(e.target.value)}
                                    className="w-full text-sm font-bold text-slate-700 p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Headcount <span className="opacity-50 text-[9px] lowercase tracking-normal">(Optional)</span></label>
                                <input 
                                    type="number" 
                                    placeholder="Target"
                                    value={overrideHeadcount}
                                    onChange={(e) => setOverrideHeadcount(e.target.value)}
                                    className="w-full text-sm font-bold text-slate-700 p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400" 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Start Time</label>
                                <input 
                                    type="time" 
                                    value={overrideStartTime}
                                    onChange={(e) => setOverrideStartTime(e.target.value)}
                                    className="w-full text-sm font-bold text-slate-700 p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">End Time</label>
                                <input 
                                    type="time" 
                                    value={overrideEndTime}
                                    onChange={(e) => setOverrideEndTime(e.target.value)}
                                    className="w-full text-sm font-bold text-slate-700 p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Reason for change (Visible to Faculty)</label>
                            <textarea 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none" 
                                placeholder="Briefly explain the schedule adjustment to the faculty member..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button onClick={() => setView("default")} variant="ghost" className="w-[100px] rounded-xl h-12 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-[13px]">Cancel</Button>
                        <Button 
                            onClick={handleRescheduleSubmit} 
                            disabled={loadingAction !== "idle" || note.length < 5}
                            className="flex-1 rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 gap-2 text-[13px] transition-all"
                        >
                            {loadingAction === "reschedule" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Proposal <Send className="w-4 h-4" /></>}
                        </Button>
                    </div>
                </div>
            )
        }

        // Approved or Rescheduled view (Active Management Dashboard)
        if (status === 'approved' || status === 'rescheduled') {
            return (
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                            {status === 'approved' ? "Visit Successfully Locked" : "Reschedule Proposal Sent"}
                        </h3>
                        <p className="text-slate-500 text-[13px] max-w-[280px] mx-auto leading-relaxed">
                            {status === 'approved' 
                                ? "You have officially accepted this visit. We're looking forward to it!" 
                                : "You suggested a new time. The faculty will review it shortly."}
                        </p>
                    </div>

                    <div className="pt-6 mt-2">
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={() => setView("reschedule_mode")}
                                variant="outline"
                                className="w-full h-11 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl gap-2 text-[13px]"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Need to change the date?
                            </Button>
                            <button 
                                onClick={handleDecline}
                                disabled={loadingAction !== "idle"}
                                className="text-[13px] font-bold text-slate-400 hover:text-red-500 transition-colors mx-auto mt-2"
                            >
                                Cancel Visit
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        // Default Pending HR view (returned inside renderActions)
        return (
            <div className="flex flex-col place-content-between">
                <div className="space-y-6 flex-shrink-0">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Required Action</h3>

                    <div className="flex flex-col gap-3">
                        <Button 
                            onClick={handleAccept} 
                            disabled={loadingAction !== "idle"}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all gap-2 text-[14px]"
                        >
                            {loadingAction === "accept" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Confirm Proposed Time</>}
                        </Button>
                        
                        <Button 
                            onClick={() => setView("reschedule_mode")} 
                            disabled={loadingAction !== "idle"}
                            variant="outline"
                            className="w-full h-12 font-bold rounded-xl text-slate-700 border-slate-200 hover:bg-slate-50 transition-all gap-2 text-[14px]"
                        >
                            <Clock className="w-4 h-4" /> Propose Alternate Time
                        </Button>
                    </div>
                    
                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <button 
                            onClick={handleDecline}
                            disabled={loadingAction !== "idle"}
                            className="text-[12px] font-bold text-slate-400 hover:text-red-500 transition-colors inline-flex items-center gap-1.5"
                        >
                            <XCircle className="w-3.5 h-3.5" /> Decline Request
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Extract system logs from user chat to ensure chat remains strictly messaging
    const systemNotes = chatLog.filter(msg => msg.sender === 'system')
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
            <div className="bg-slate-50/40 border border-slate-200/60 rounded-[28px] p-8 shadow-sm">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Official Decision Timeline
                </h4>
                <div className="space-y-1 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                    {groupedEvents.map(event => {
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

    const renderChatThread = () => (
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
                            <p className="text-slate-500 text-[13px] font-medium mt-1">Chat directly with the faculty member for quick clarifications.</p>
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
                                const isHR = msg.sender === 'hr'

                                return (
                                    <div key={msg.id} className={`flex flex-col ${isHR ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 fade-in`}>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">{isHR ? 'You' : 'Faculty'}</span>
                                        <div className={`relative max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed font-medium shadow-sm ${
                                            isHR 
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

                    {status !== 'cancelled' && (
                        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white focus:border-indigo-200 border border-transparent text-[14px] font-medium rounded-2xl px-5 h-12 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                            />
                            <Button 
                                onClick={handleSendMessage}
                                disabled={loadingAction === "chat" || !chatInput.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-600/10 shrink-0 transition-transform hover:scale-105 active:scale-95 p-0"
                            >
                                {loadingAction === "chat" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )

    const handleSendMessage = () => updateVisitStatus(status, "", currentProposedDate, "chat")

    return (
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
            {/* Left Column: Data Payload & Chat Thread */}
            <div className="lg:col-span-7 space-y-6">
                {leftContent}
                
                {/* Official System Notes / Reschedule Context */}
                {renderOfficialNotes()}

                {/* Local Chat Thread */}
                {renderChatThread()}
            </div>

            {/* Right Column: Interaction Controller */}
            <div className="lg:col-span-5">
                <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-8 sticky top-28 w-full max-w-md mx-auto lg:max-w-none">
                    {renderActions()}
                </div>
            </div>
        </div>
    )
}
