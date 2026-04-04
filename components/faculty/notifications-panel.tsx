"use client"

import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, Clock, Building2, MessageSquare, AlertCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

interface NotificationEvent {
    id: string;
    visitId: string;
    companyId: string;
    companyName: string;
    actionText: string;
    timestamp: Date;
    owner: "hr" | "system";
    type: "approved" | "rescheduled" | "cancelled" | "message" | "info";
    isNew: boolean;
}

export function NotificationsPanel() {
    const { user: authUser } = useAuth()
    const router = useRouter()
    const [events, setEvents] = useState<NotificationEvent[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authUser?.id) return;
        
        loadNotifications();

        // Optional: Set up real-time subscription for ultra-live updates
        const channel = supabase
            .channel('visit_updates')
            .on('postgres_changes', { 
                event: 'UPDATE', 
                schema: 'public', 
                table: 'scheduled_visits',
                filter: `faculty_id=eq.${authUser.id}` 
            }, () => {
                loadNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [authUser?.id]);

    const loadNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('scheduled_visits')
                .select(`
                    id, 
                    company_id,
                    status, 
                    hr_notes,
                    company:companies(id, name)
                `)
                .eq('faculty_id', authUser?.id)

            if (error) throw error;

            const latestEventsMap = new Map<string, NotificationEvent>();
            const lastViewedTimestampStr = localStorage.getItem('last_viewed_notifications');
            const lastViewedDate = lastViewedTimestampStr ? new Date(lastViewedTimestampStr) : new Date(0);

            data?.forEach(visit => {
                if (!visit.hr_notes) return;
                
                try {
                    const notes = JSON.parse(visit.hr_notes);
                    if (!Array.isArray(notes)) return;

                    notes.forEach((note: any) => {
                        if (note.sender === 'faculty' || note.text.includes("Faculty")) return; // Skip own actions

                        const noteDate = note.timestamp ? new Date(note.timestamp) : new Date(0);
                        const rawText = note.text;
                        
                        let type: NotificationEvent["type"] = "info";
                        let actionText = rawText;
                        
                        if (note.sender === 'hr') {
                            type = "message";
                            actionText = `HR sent a message: "${rawText.substring(0, 40)}${rawText.length > 40 ? '...' : ''}"`;
                        } else if (rawText.includes("Accept")) {
                            type = "approved";
                            actionText = "Approved the visit schedule.";
                        } else if (rawText.includes("Reschedule") || rawText.includes("Propos")) {
                            type = "rescheduled";
                            actionText = "Proposed a new schedule/rescheduled.";
                        } else if (rawText.includes("Cancel") || rawText.includes("Decline")) {
                            type = "cancelled";
                            actionText = "Declined or cancelled the visit request.";
                        } else if (rawText.startsWith("HR Note:")) {
                            type = "message";
                            actionText = `HR left a note: "${rawText.replace("HR Note:", "").substring(0, 40)}..."`;
                        }

                        const companyObj = Array.isArray(visit.company) ? visit.company[0] : visit.company;
                        const companyName = companyObj?.name || "Unknown Company";
                        const companyId = visit.company_id || companyObj?.id || "";
                        
                        const newEvent: NotificationEvent = {
                            id: note.id || Math.random().toString(),
                            visitId: visit.id,
                            companyName,
                            companyId,
                            actionText,
                            timestamp: noteDate,
                            owner: note.sender,
                            type,
                            isNew: noteDate > lastViewedDate
                        };

                        const existingEvent = latestEventsMap.get(companyName);
                        if (!existingEvent || newEvent.timestamp > existingEvent.timestamp) {
                            latestEventsMap.set(companyName, newEvent);
                        }
                    });
                } catch(e) {
                    // Ignore parsing errors for legacy notes
                }
            });

            // Convert map to array and sort globally by newest first
            const extractedEvents = Array.from(latestEventsMap.values());
            extractedEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            
            // Unread count (number of companies with unseen updates)
            const unreads = extractedEvents.filter(e => e.isNew).length;
            
            setEvents(extractedEvents);
            setUnreadCount(unreads);
            setLoading(false);

        } catch (err) {
            console.error("Failed to load notifications", err);
            setLoading(false);
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            // When opening, mark everything as read explicitly by setting last viewed to now
            localStorage.setItem('last_viewed_notifications', new Date().toISOString());
            setUnreadCount(0);
            
            // Optimistically update local state to not show 'New' badge immediately inside
            setEvents(prev => prev.map(e => ({ ...e, isNew: false })));
        }
    }

    const formatRelativeTime = (date: Date) => {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
        const minDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60));

        if (Math.abs(minDifference) < 1) return "Just now";
        if (Math.abs(minDifference) < 60) return rtf.format(minDifference, 'minute');
        if (Math.abs(hoursDifference) < 24) return rtf.format(hoursDifference, 'hour');
        return rtf.format(daysDifference, 'day');
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white rounded-full animate-pulse"></span>
                    )}
                </Button>
            </PopoverTrigger>
            
            <PopoverContent align="end" className="w-[380px] p-0 rounded-2xl overflow-hidden shadow-xl border-slate-200/60 bg-white mr-4 mt-2">
                <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between backdrop-blur-sm">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Activity Timeline
                            {unreadCount > 0 && (
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </h4>
                        <p className="text-[12px] text-slate-500 font-medium">Recent updates from industry partners</p>
                    </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto custom-scrollbar bg-white">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <Clock className="w-6 h-6 text-slate-300 animate-spin mb-2" />
                            <span className="text-[13px] text-slate-400 font-medium">Loading timeline...</span>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                <Bell className="w-5 h-5 text-slate-300" />
                            </div>
                            <h4 className="text-[14px] font-bold text-slate-700 mb-1">All caught up!</h4>
                            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">There are no new HR updates for your active schedules.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100/80">
                            {events.slice(0, 15).map((event) => {
                                let Icon = Building2;
                                let iconColor = "text-slate-500";
                                let bgTheme = "bg-slate-50";

                                if (event.type === "approved") {
                                    Icon = CheckCircle;
                                    iconColor = "text-emerald-600";
                                    bgTheme = "bg-emerald-50";
                                } else if (event.type === "rescheduled") {
                                    Icon = Clock;
                                    iconColor = "text-indigo-600";
                                    bgTheme = "bg-indigo-50";
                                } else if (event.type === "cancelled") {
                                    Icon = XCircle;
                                    iconColor = "text-red-600";
                                    bgTheme = "bg-red-50";
                                } else if (event.type === "message") {
                                    Icon = MessageSquare;
                                    iconColor = "text-sky-600";
                                    bgTheme = "bg-sky-50";
                                }
                                
                                return (
                                    <div 
                                        key={event.id}
                                        onClick={() => {
                                            router.push(`/faculty/visit/${event.companyId}`)
                                            setIsOpen(false)
                                        }}
                                        className="relative p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                    >
                                        {event.isNew && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-md"></div>}
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-full ${bgTheme} flex items-center justify-center shrink-0 border border-slate-100/50 mt-1`}>
                                                <Icon className={`w-4 h-4 ${iconColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="text-[13px] font-bold text-slate-900 truncate pr-2">
                                                        {event.companyName}
                                                    </h5>
                                                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0 pt-0.5">
                                                        {formatRelativeTime(event.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed font-medium pr-1">
                                                    {event.actionText}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
                
                {events.length > 0 && (
                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center backdrop-blur-sm">
                        <Button 
                            variant="link" 
                            className="text-[12px] h-8 font-bold text-indigo-600 hover:text-indigo-700"
                            onClick={() => {
                                router.push('/faculty/visits')
                                setIsOpen(false)
                            }}
                        >
                            View Active Visits Dashboard
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
