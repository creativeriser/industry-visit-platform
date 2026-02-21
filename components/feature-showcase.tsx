"use client"

import { motion, useScroll, useTransform, MotionValue, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { JourneyRope } from "@/components/ui/journey-rope"
import { IntelligentDiscoveryIcon } from "@/components/intelligent-discovery-icon"
import {
    Search, Building2, Calendar, Mail, Phone, Factory, Landmark, CheckCircle,
    Send, Inbox, FileCheck, User, X, Minimize, Maximize2, MapPin,
    Clock, Bus, Utensils, QrCode, Ticket, ArrowRight, UserCheck, Users, ShieldCheck,
    Cpu, Code2, Terminal, Briefcase, GraduationCap, Zap, Sparkles
} from "lucide-react"

// --- SIMULATIONS ---

function FacultyWorkflowSimulation({ active }: { active: boolean }) {
    const DURATION = 18750;
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const requestRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const animate = (time: number) => {
            if (startTimeRef.current === null) startTimeRef.current = time;
            const elapsed = time - startTimeRef.current;
            const p = (elapsed % DURATION) / DURATION * 100;
            if (!isDragging.current) setProgress(p);
            requestRef.current = requestAnimationFrame(animate);
        };

        if (active) {
            // Re-initialize start time to reset animation on view
            if (startTimeRef.current === null) {
                setProgress(0);
            }
            requestRef.current = requestAnimationFrame(animate);
        } else {
            // Clear state completely when out of view
            startTimeRef.current = null;
            setProgress(0);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }

        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [active]);

    const handleSeek = (cx: number) => {
        if (!containerRef.current) return;
        const r = containerRef.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(cx - r.left, r.width)) / r.width;
        startTimeRef.current = performance.now() - (p * DURATION);
        setProgress(p * 100);
    };

    const p = progress;
    const s1 = p < 28;
    const s2 = p >= 28 && p < 48;
    const s3 = p >= 48 && p < 80;
    const s4 = p >= 80;

    const isSimulatedHover = p > 34.2 && p < 38;
    const isSimulatedClick = p > 35.4 && p < 35.8;

    return (
        <div className="w-full h-full bg-slate-50 relative font-sans select-none overflow-hidden text-slate-900 border-none group">
            <div className="absolute top-4 left-4 flex gap-2 z-50">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <div className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                    {s1 ? "Faculty Portal" : s2 ? "Company Profile" : s3 ? "Outlook Mail" : "Request Sent"}
                </div>
            </div>

            <div ref={containerRef} className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-200 cursor-pointer z-[100] transition-all rounded-b-xl"
                onPointerDown={(e) => { isDragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); handleSeek(e.clientX); }}
                onPointerMove={(e) => { if (isDragging.current) handleSeek(e.clientX); }}
                onPointerUp={(e) => { isDragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
            >
                <div className="h-full bg-blue-600 w-full origin-left relative rounded-bl-xl" style={{ transform: `scaleX(${p / 100})` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-blue-700/50 rounded-full blur-[1px]" />
                </div>
            </div>

            <AnimatePresence>
                {(s1) && (
                    <motion.div key="scene1" className="absolute inset-0 flex flex-col items-center justify-center p-12" exit={{ opacity: 0 }}>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: p > 4 ? -160 : 0,
                                opacity: 1,
                                boxShadow: p > 3 && p <= 4 ? "0 0 0 4px rgba(59, 130, 246, 0.4)" : p > 4 ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "0 20px 25px -5px rgb(0 0 0 / 0.1)"
                            }}
                            exit={{ y: -20, opacity: 0 }}
                            className="w-[280px] bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-slate-200/60 flex items-center px-4 py-3 mb-8 relative z-50 cursor-pointer"
                        >
                            <motion.div animate={{ scale: p > 3 && p <= 4 ? 1.2 : 1, color: p > 3 ? "#3b82f6" : "#94a3b8" }} className="mr-3">
                                <Search className="w-4 h-4" />
                            </motion.div>
                            <div className="text-sm font-medium text-slate-800 flex items-center relative">
                                <span className="mr-1">Find:</span>
                                <div className="relative flex items-center">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "auto" }} transition={{ delay: 0.5, duration: 1.5 }} className="overflow-hidden whitespace-nowrap">
                                        <span className="text-blue-600 font-bold whitespace-nowrap min-w-[10px]">Civil Engineering</span>
                                    </motion.div>
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-0.5 h-4 bg-blue-600 ml-0.5 absolute right-[-2px] top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </motion.div>

                        <div className="absolute inset-0 w-full h-full z-0">
                            {[
                                { y: 35, icon: Factory, label: "Tata Steel", delay: 2.2 },
                                { y: 50, icon: Landmark, label: "Govt. PWD", delay: 2.5 },
                                { y: 65, icon: Building2, label: "L&T Infra", delay: 2.8, target: true },
                                { y: 80, icon: Factory, label: "Reliance", delay: 3.1 },
                            ].map((node, i) => (
                                <motion.div key={i} className="absolute inset-x-0 mx-auto w-[240px]" style={{ top: `${node.y}%`, transform: 'translateY(-50%)' }}>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: p > 4 ? 1 : 0, y: p > 4 ? 0 : 20 }} transition={{ delay: node.delay, duration: 0.5 }}>
                                        <div className={cn("flex items-center gap-3 p-3 rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-500", node.target && p > 20 ? "bg-blue-50/80 border-blue-200 shadow-blue-500/10 scale-105" : "bg-white/80 border-slate-100 hover:scale-102")}>
                                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", node.target && p > 20 ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400")}>
                                                <node.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <div className={cn("text-xs font-semibold", node.target && p > 20 ? "text-blue-700" : "text-slate-700")}>{node.label}</div>
                                                <div className="text-[10px] text-slate-400">Match: 9{5 - i}%</div>
                                            </div>
                                            {node.target && p > 20 && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-blue-500" />)}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {s2 && (
                    <motion.div key="scene2" className="absolute inset-0 flex items-center justify-center z-20" initial={{ opacity: 0, y: 100, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }} transition={{ duration: 0.5, ease: "backOut" }}>
                        <div className="w-[400px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative font-sans">
                            <div className="h-36 bg-slate-900 relative">
                                <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 text-white">
                                    <h3 className="font-bold text-lg leading-none">L&T Infra</h3>
                                    <p className="text-[10px] opacity-80 mt-1">Infrastructure • Mumbai</p>
                                </div>
                            </div>
                            <div className="p-5 border-b border-slate-100">
                                <p className="text-[11px] text-slate-500 leading-relaxed">Leading technology, engineering, construction, manufacturing and financial services conglomerate.</p>
                            </div>
                            <div className="p-5 bg-slate-50/50">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Representative</div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm"><User className="w-5 h-5 text-slate-400" /></div>
                                    <div className="flex-1"><div className="text-xs font-bold text-slate-900">Rahul Kumar</div><div className="text-[10px] text-slate-500">Sr. Project Manager</div></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 relative">
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200"><Phone className="w-3 h-3" /> Call</motion.button>
                                    <motion.button whileHover={{ scale: 1.05, backgroundColor: "#1e40af" }} whileTap={{ scale: 0.95 }} animate={{ scale: isSimulatedClick ? 0.95 : (isSimulatedHover ? 1.05 : 1), backgroundColor: isSimulatedHover ? "#1e40af" : "#2563eb", boxShadow: isSimulatedHover ? "0 10px 15px -3px rgb(59 130 246 / 0.4)" : "0 4px 6px -1px rgb(59 130 246 / 0.2)" }} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-md shadow-blue-500/20 transition-colors duration-300"> <Mail className="w-3 h-3" /> Email </motion.button>
                                    <motion.div initial={{ opacity: 0, x: 50, y: 50 }} animate={{ opacity: [0, 1, 1, 0], x: [50, 100, 100, 100], y: [50, 20, 20, 20], scale: [1, 1, 0.8, 1] }} transition={{ duration: 1.5, times: [0, 0.4, 0.8, 1], delay: 2.5 }} className="absolute -bottom-8 -right-8 pointer-events-none z-50 drop-shadow-xl" style={{ translateX: '-50%', translateY: '-50%' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19138L11.4841 12.3673H5.65376Z" fill="black" stroke="white" strokeWidth="1" /></svg>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(s3) && (
                    <motion.div key="scene3" className="absolute inset-0 flex items-center justify-center z-30" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <div className="w-[400px] bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden font-sans">
                            <div className="bg-[#0078d4] h-8 flex items-center justify-between px-3">
                                <div className="flex items-center gap-2">
                                    <div className="grid grid-cols-3 gap-[1px] w-3 h-3 opacity-80">{[...Array(9)].map((_, i) => <div key={i} className="bg-white rounded-[0.5px]" />)}</div>
                                    <span className="text-xs font-bold text-white">Outlook</span></div>
                                <div className="flex gap-2"><Minimize className="w-3 h-3 text-white opacity-50" /><Maximize2 className="w-3 h-3 text-white opacity-50" /><X className="w-3 h-3 text-white opacity-50" /></div>
                            </div>
                            <div className="p-5 bg-white">
                                <div className="flex items-center gap-2 mb-2"><button className="bg-[#0078d4] text-white px-3 py-1 rounded-sm text-[10px] font-bold flex items-center gap-1"><Send className="w-2.5 h-2.5" /> Send</button><div className="text-[10px] text-slate-400 ml-auto">Draft saved</div></div>
                                <div className="space-y-2 mb-4 border-b border-slate-100 pb-2">
                                    <div className="flex items-center gap-2"><div className="w-8 text-[10px] text-slate-500 text-right">To</div><div className="flex-1 bg-slate-50 px-2 py-1 rounded text-[10px] text-slate-800 font-medium border border-transparent border-b-slate-200">rahul.kumar@lnt.com</div></div>
                                    <div className="flex items-center gap-2"><div className="w-8 text-[10px] text-slate-500 text-right">Cc</div><div className="flex-1 px-2 py-1 rounded text-[10px] text-slate-400 border border-transparent border-b-slate-200">dept_head@university.edu</div></div>
                                    <div className="flex items-center gap-2"><div className="w-8 text-[10px] text-slate-500 text-right">Data</div><div className="flex-1 px-2 py-1 rounded text-[10px] text-slate-800 font-bold border border-transparent border-b-slate-200">Request for Industrial Visit - Batch 2026</div></div>
                                </div>
                                <div className="h-32 text-[10px] text-slate-700 leading-relaxed font-sans relative">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 6 }}>Dear Mr. Kumar, <br /><br />I am writing to formally request an industrial visit for our Civil Engineering students...</motion.div>
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-0.5 h-3 bg-slate-900 ml-0.5 align-middle" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {s4 && (
                    <motion.div key="scene4" className="absolute inset-0 flex items-center justify-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div initial={{ x: 0, y: 0, scale: 0.5, opacity: 0 }} animate={{ x: [0, 0, 200], y: [20, 0, -200], scale: [0.5, 1.2, 0.5], opacity: [0, 1, 0] }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute z-20"> <Send className="w-16 h-16 text-blue-600 text-drop-shadow-xl" /> </motion.div>
                        <motion.div initial={{ scale: 0, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }} className="w-[280px] bg-white rounded-xl shadow-xl border border-slate-200 p-6 flex flex-col items-center text-center relative z-10">
                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-emerald-400/30 rounded-full" />
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 relative z-10"> <CheckCircle className="w-6 h-6 text-emerald-600" /> </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Request Sent</h3>
                            <p className="text-xs text-slate-500 mb-4">Email delivered to company representative.</p>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100"> <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Awaiting Acceptance </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}



function ExecutionWorkflowSimulation({ active }: { active: boolean }) {
    const DURATION = 22500; // 22.5s Cycle
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const requestRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const animate = (time: number) => {
            if (startTimeRef.current === null) startTimeRef.current = time;
            const elapsed = time - startTimeRef.current;
            const p = (elapsed % DURATION) / DURATION * 100;
            if (!isDragging.current) setProgress(p);
            requestRef.current = requestAnimationFrame(animate);
        };

        if (!active) { setTimeout(() => setProgress(0), 0); startTimeRef.current = null; if (requestRef.current) cancelAnimationFrame(requestRef.current); return; }
        requestRef.current = requestAnimationFrame(animate);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [active]);

    const handleSeek = (cx: number) => {
        if (!containerRef.current) return;
        const r = containerRef.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(cx - r.left, r.width)) / r.width;
        startTimeRef.current = performance.now() - (p * DURATION);
        setProgress(p * 100);
    };

    const p = progress;
    // 4 Scenes: Logistics (0-25), Roster (25-50), Gate Pass (50-75), Itinerary (75-100)
    const s1 = p < 25;
    const s2 = p >= 25 && p < 50;
    const s3 = p >= 50 && p < 75;
    const s4 = p >= 75;

    return (
        <div className="w-full h-full bg-slate-50 relative font-sans select-none overflow-hidden text-slate-900 border-none group">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div ref={containerRef} className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-200 cursor-pointer z-[100] transition-all rounded-b-xl"
                onPointerDown={(e) => { isDragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); handleSeek(e.clientX); }}
                onPointerMove={(e) => { if (isDragging.current) handleSeek(e.clientX); }}
                onPointerUp={(e) => { isDragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
            >
                <div className="h-full bg-emerald-500 w-full origin-left relative rounded-bl-xl" style={{ transform: `scaleX(${p / 100})` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-emerald-600/50 rounded-full blur-[1px]" />
                </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <div className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                    {s1 ? "Logistics Hub" : s2 ? "Batch Roster" : s3 ? "Gate Pass" : "Live Tracking"}
                </div>
            </div>

            {/* SCENE 1: FACULTY FINALIZES LOGISTICS */}
            <AnimatePresence>
                {s1 && (
                    <motion.div key="s1" className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <div className="w-[380px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="relative h-24 bg-slate-100">
                                <div className="absolute bottom-3 left-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 mb-2">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-xs font-bold text-slate-800">L&T Infrastructure</div>
                                    <div className="text-[10px] text-slate-500">Scheduled: Oct 24, 2026</div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">Status: Confirmed</div>
                                    <div className="text-[10px] text-slate-400 ml-auto">Batch: Computer Science 23-27 (50 Students)</div>
                                </div>
                                <motion.button
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20"
                                    animate={p > 12 ? { backgroundColor: "#10b981", scale: 0.95 } : {}}
                                >
                                    {p > 12 ? "Passes Generated" : "Generate Gate Passes"}
                                </motion.button>
                            </div>
                            {/* Simulated Cursor */}
                            <motion.div
                                className="absolute pointer-events-none drop-shadow-xl z-50"
                                initial={{ x: 300, y: 300, opacity: 0 }}
                                animate={{ x: [300, 190, 190, 400], y: [300, 170, 170, 400], opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 4, times: [0, 0.4, 0.6, 1], delay: 1 }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19138L11.4841 12.3673H5.65376Z" fill="black" stroke="white" strokeWidth="1" /></svg>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SCENE 2: BATCH ROSTER */}
            <AnimatePresence>
                {s2 && (
                    <motion.div key="s2" className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <div className="w-[380px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-700">Digital Roster</span>
                                <span className="text-[10px] font-mono text-slate-400">CS 23-27</span>
                            </div>
                            <div className="p-2 space-y-2">
                                {[
                                    { name: "Shubham Sinha", id: "Computer Science 23-013", status: "Verified" },
                                    { name: "Vikrant Singh", id: "Computer Science 23-028", status: "Scanning..." }
                                ].map((student, i) => (
                                    <motion.div
                                        key={i}
                                        className={cn("flex items-center gap-3 p-2 rounded-lg border", i === 1 && p > 37 ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100")}
                                        animate={i === 1 && p > 37 ? { scale: 1.02 } : {}}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{student.name[0]}</div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-800">{student.name}</div>
                                            <div className="text-[10px] text-slate-400">{student.id}</div>
                                        </div>
                                        {(student.status === "Verified" || (i === 1 && p > 37)) ?
                                            <CheckCircle className="w-4 h-4 text-emerald-500" /> :
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-blue-500" />
                                        }
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SCENE 3: MASTER GATE PASS */}
            <AnimatePresence>
                {s3 && (
                    <motion.div key="s3" className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }}>
                        <div className="w-[320px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden relative text-white">
                            <div className="absolute top-0 right-0 p-3 opacity-20"><QrCode className="w-24 h-24" /></div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center"><Ticket className="w-4 h-4" /></div>
                                    <span className="text-xs font-bold tracking-widest uppercase opacity-70">Master Gate Pass</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1">L&T Infrastructure</h3>
                                <p className="text-xs opacity-60 mb-6">Industrial Visit • Oct 24</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div><div className="text-[10px] opacity-50 uppercase">Faculty Lead</div><div className="text-xs font-bold">Dr. Yogita Yashveer Raghav</div></div>
                                    <div><div className="text-[10px] opacity-50 uppercase">Batch Size</div><div className="text-xs font-bold">50 Students</div></div>
                                </div>
                                <div className="w-full py-2 bg-emerald-500 rounded text-center text-xs font-bold text-slate-900">
                                    Approved Entry
                                </div>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SCENE 4: ITINERARY */}
            <AnimatePresence>
                {s4 && (
                    <motion.div key="s4" className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="w-[380px] bg-white rounded-xl shadow-lg border border-slate-200 p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100"><motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 10 }} /></div>
                            <div className="mb-6"><h3 className="font-bold text-slate-900">Live Itinerary</h3><p className="text-xs text-slate-500">Track your day in real-time</p></div>

                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
                                {[
                                    { time: "09:00 AM", title: "Assembly", icon: Users },
                                    { time: "10:30 AM", title: "Plant Tour", icon: Factory },
                                    { time: "01:00 PM", title: "Lunch Break", icon: Utensils },
                                    { time: "02:30 PM", title: "Q&A Session", icon: ShieldCheck }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="relative flex items-center gap-4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.8 }}
                                    >
                                        <div className={cn("relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white", p > (75 + i * 5) ? "border-blue-500 text-blue-500" : "border-slate-200 text-slate-300")}>
                                            <item.icon className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400">{item.time}</div>
                                            <div className="text-xs font-bold text-slate-800">{item.title}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function VisualBlock({ Simulation, compact, frameless }: { Simulation: React.ComponentType<{ active: boolean }>, align: 'left' | 'right' | 'center', compact: boolean, frameless?: boolean }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { amount: 0.6, once: false })
    return (
        <div ref={ref} className={cn("w-full relative transition-all duration-500", frameless ? "bg-transparent overflow-visible" : "bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden", compact ? "max-w-md aspect-[4/3]" : "max-w-[900px] h-[450px]")}>
            {isInView ? <Simulation active={true} /> : null}
        </div>
    )
}

interface TextBlockData {
    step: string;
    label: string;
    headline: string;
    sub: string;
}

function TextBlock({ data, align, compact }: { data: TextBlockData, align: 'left' | 'right' | 'center', compact: boolean }) {
    return (
        <div className={cn("w-full transition-all", compact ? "max-w-md" : "max-w-xl", align === 'right' ? "text-right" : (align === 'left' ? "text-left" : "text-center"))}>
            <div className={cn("flex items-center gap-3 mb-4", align === 'right' ? "justify-end" : (align === 'left' ? "justify-start" : "justify-center"))}>
                <span className="text-xs font-bold text-slate-300 tracking-widest font-mono">{data.label}</span>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">{data.step}</span>
            </div>
            <h3 className={cn("font-bold text-slate-900 leading-tight mb-3 tracking-tight", compact ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl")}>{data.headline}</h3>
            <p className={cn("text-slate-500 font-medium leading-relaxed", compact ? "text-sm md:text-base" : "text-base md:text-lg")}>{data.sub}</p>
        </div>
    )
}

interface StageConfig {
    range: number[];
    top: string;
    data: TextBlockData;
    Simulation: React.ComponentType<{ active: boolean }>;
    frameless?: boolean;
}

function ScrollLinkedStage({ stage, index, globalScroll }: { stage: StageConfig, index: number, globalScroll: MotionValue<number> }) {
    const isEven = index % 2 === 0;
    const r = stage.range;
    const opacity = useTransform(globalScroll, r, [0, 1, 1, 0]);
    const y = useTransform(globalScroll, r, [24, 0, 0, -24]);
    const pointerEvents = useTransform(globalScroll, (v) => (v > r[0] && v < r[3]) ? "auto" : "none");

    return (
        <motion.div className="absolute left-0 right-0 w-full flex items-center justify-center px-4" style={{ top: stage.top, y: useTransform(y, (latest) => `calc(-50% + ${latest}px)`), opacity, pointerEvents }}>
            <div className="relative w-full max-w-full grid grid-cols-1 md:grid-cols-[35%_65%] items-center">
                <div className={cn("hidden md:flex items-center relative", isEven ? "justify-end text-right pr-16" : "justify-end pr-16")}>
                    {isEven ? <TextBlock data={stage.data} align="right" compact={true} /> : <VisualBlock Simulation={stage.Simulation} align="left" compact={true} frameless={stage.frameless} />}
                </div>
                <div className={cn("hidden md:flex items-center relative", isEven ? "justify-start pl-16" : "justify-start pl-16")}>
                    {isEven ? <VisualBlock Simulation={stage.Simulation} align="right" compact={false} frameless={stage.frameless} /> : <TextBlock data={stage.data} align="left" compact={true} />}
                </div>
                <div className="md:hidden col-span-1 flex flex-col gap-8 items-center text-center">
                    <TextBlock data={stage.data} align="center" compact={false} />
                    <VisualBlock Simulation={stage.Simulation} align="center" compact={false} frameless={stage.frameless} />
                </div>
            </div>
        </motion.div>
    )
}



const STAGE_CONFIG = [
    {
        range: [0, 0, 0.25, 0.4], top: "18%",
        data: { step: "01", label: "FACULTY CONTROL", headline: "Streamlined Outreach.", sub: "Faculty initiate requests directly using integrated communication tools, ensuring professional representation." },
        Simulation: FacultyWorkflowSimulation,
    },
    {
        range: [0.3, 0.45, 0.55, 0.7], top: "53%",
        data: { step: "02", label: "VISIT COORDINATION", headline: "Seamless Scheduling.", sub: "After establishing contact, faculty use the integrated scheduler to propose dates, finalize logistics, and lock in the visit itinerary instantly." },
        Simulation: IntelligentDiscoveryIcon, frameless: true,
    },
    {
        range: [0.6, 0.75, 1, 1], top: "88%",
        data: { step: "03", label: "FULL LIFECYCLE", headline: "End-to-End Management.", sub: "From initial industry outreach and logistics coordination to live itinerary tracking. The platform empowers faculty to manage the entire journey in one cohesive workflow." },
        Simulation: ExecutionWorkflowSimulation
    }
]

export function FeatureShowcase() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] })

    return (
        <section className="bg-white relative overflow-visible py-24 md:py-32">
            <div className="container mx-auto px-4 relative">
                <div ref={containerRef} className="relative h-[1750px] w-full max-w-[1400px] mx-auto mt-16">
                    <div className="absolute -top-0 left-[35%] -translate-x-1/2 h-[22%] w-px border-l-2 border-dashed border-slate-200" />
                    <div className="absolute flex flex-col items-center top-0 left-[35%] -translate-x-1/2 -mt-32 relative z-10 w-40 text-center"><span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400 bg-white px-2">System Pipeline</span></div>
                    <div className="absolute inset-y-0 left-[35%] -translate-x-[50%] z-0 flex justify-center pointer-events-none w-[100px] pt-32"><div className="w-[100px] h-full relative"><JourneyRope /></div></div>
                    {STAGE_CONFIG.map((stage, index) => (<ScrollLinkedStage key={index} stage={stage} index={index} globalScroll={scrollYProgress} />))}
                </div>
            </div>
        </section>
    )
}
