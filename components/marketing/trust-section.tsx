"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Globe2, Brain, CheckCircle2, ArrowRight, ScanFace, User } from "lucide-react"

import React, { useState, useEffect } from "react"

const companies = [
    { name: "Tesla", color: "text-red-600" },
    { name: "Google", color: "text-blue-600" },
    { name: "Microsoft", color: "text-sky-600" },
    { name: "Amazon", color: "text-orange-500" },
    { name: "Netflix", color: "text-red-700" },
    { name: "Meta", color: "text-blue-700" },
    { name: "Spotify", color: "text-green-600" },
    { name: "Airbnb", color: "text-rose-500" },
    { name: "Uber", color: "text-slate-900" },
    { name: "Adobe", color: "text-red-600" },
]

export function TrustSection() {
    return (
        <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-6 text-slate-500"
                    >
                        <Brain className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">Strategic Industry Access</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4"
                    >
                        From Campus to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Corporate Styles</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium"
                    >
                        Our platform connects students directly with faculty for approval, unlocking exclusive visits to top industry hubs like Google and Microsoft.
                    </motion.p>
                </div>

                {/* Animated Trust Infrastructure Visual */}
                <div className="mb-24 relative">
                    <TrustSimulation />
                </div>

                {/* Company Marquee - Infinite Scroll */}
                <div className="relative w-full">
                    {/* Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                    <div className="flex overflow-hidden select-none gap-16 py-8 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
                        <CompanyMarquee />
                        <CompanyMarquee />
                    </div>
                </div>
            </div>
        </section>
    )
}

function CompanyMarquee() {
    return (
        <motion.div
            className="flex items-center gap-16 shrink-0"
            animate={{ x: "-100%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
            {companies.map((company) => (
                <div key={company.name} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
                    <span className={`text-2xl font-bold tracking-tight ${company.color} grayscale group-hover:grayscale-0 transition-all duration-300`}>
                        {company.name}
                    </span>
                </div>
            ))}
        </motion.div>
    )
}

// ANIMATION SCENES
// 0: Profile Scan (Extracting Skills)
// 1: Gap Analysis (Matching vs Tesla)
// 2: Bridging (Learning New Skill)
// 3: Unlocked (Career Matches)

function TrustSimulation() {
    const [scene, setScene] = useState(0);
    const [profileIndex, setProfileIndex] = useState(0);

    const profiles = [
        {
            id: "ID-8942",
            name: "Vikrant Singh",
            course: "Computer Science • Class of 2023",
            skills: ["React Framework", "Node.js Env", "System Design", "Academic (7.9 CGPA)", "Attendance (65%)"],
            colors: { main: "bg-emerald-500", secondary: "bg-purple-500" }
        },
        {
            id: "ID-9021",
            name: "Shubham Sinha",
            course: "Computer Science • Class of 2024",
            skills: ["React Native", "AWS Cloud", "System Arch", "Academic (8.5 CGPA)", "Attendance (75%)"],
            colors: { main: "bg-blue-500", secondary: "bg-indigo-500" }
        }
    ];

    const currentProfile = profiles[profileIndex];

    useEffect(() => {
        const timer = setInterval(() => {
            setScene(prev => {
                if (prev === 3) {
                    setProfileIndex(pi => (pi + 1) % profiles.length);
                    return 0;
                }
                return prev + 1;
            });
        }, 6000); // 6s per scene
        return () => clearInterval(timer);
    }, []);

    // Manual control
    const goToScene = (i: number) => {
        setScene(i);
        // We'd ideally pause the timer here, but for simple demo continuous loop makes sense or we reset timer.
    };

    return (
        <div className="w-full max-w-5xl mx-auto h-[550px] relative bg-slate-50/50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 backdrop-blur-xl group select-none font-sans flex flex-col">

            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
            </div>



            {/* SCENE CONTAINER */}
            <div className="relative flex-1 w-full flex items-center justify-center p-8 overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* SCENE 0: PROFILE INPUT */}
                    {scene === 0 && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                            transition={{ duration: 0.5 }}
                            className="relative flex flex-col items-center"
                        >
                            <motion.div
                                className="w-[400px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative z-10"
                                initial={{ y: 20 }} animate={{ y: 0 }}
                            >
                                {/* Professional Header: Clean Enterprise Aesthetic */}
                                <div className="h-32 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                    {/* Subtle Grid Background */}
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-transparent to-blue-50/50"></div>

                                    {/* Advanced Motion Profile Core */}
                                    <div className="relative z-10 scale-[0.6]">
                                        <ProfileMotionCore active={true} />
                                    </div>

                                    {/* ID Pill */}
                                    <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm border border-slate-200 px-2 py-1 rounded text-[10px] font-mono font-medium text-slate-400">
                                        {currentProfile.id}
                                    </div>
                                </div>

                                <div className="p-8 relative bg-white">
                                    <div className="text-center mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{currentProfile.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{currentProfile.course}</p>
                                    </div>

                                    {/* Skills Extraction List - Clean Data Table */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Set</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validation</span>
                                        </div>

                                        {currentProfile.skills.map((skill, i) => (
                                            <motion.div
                                                key={skill}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 + (i * 0.25) }}
                                                className="flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${i === 2 ? "bg-slate-300" : (i > 2 ? currentProfile.colors.secondary : currentProfile.colors.main)}`}></div>
                                                    <span className="text-xs font-semibold text-slate-700">{skill}</span>
                                                </div>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1 + (i * 0.25) }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    {/* Simulated Loading Bars */}
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, barI) => (
                                                            <motion.div
                                                                key={barI}
                                                                initial={{ height: 4, opacity: 0.2 }}
                                                                animate={{ height: [4, 8, 4], opacity: 1, backgroundColor: i === 2 && barI > 2 ? "#cbd5e1" : (i > 2 ? "#a855f7" : "#3b82f6") }}
                                                                transition={{ delay: 1 + (i * 0.2) + (barI * 0.1), duration: 0.4 }}
                                                                className="w-1 rounded-full bg-blue-500"
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Premium Scanner Beam */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full z-50 pointer-events-none"
                                    animate={{ top: ["-10%", "110%"] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                                >
                                    {/* Main Beam */}
                                    <div className="h-16 w-full bg-gradient-to-b from-transparent via-blue-500/10 to-blue-500/5 backdrop-blur-[1px]"></div>
                                    {/* Leading Edge */}
                                    <div className="h-[2px] w-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}


                    {/* SCENE 1: FACULTY APPROVAL */}
                    {scene === 1 && (
                        <motion.div
                            key="approval"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                            className="w-full max-w-4xl flex items-center justify-between px-4"
                        >
                            {/* Student (Left) */}
                            <motion.div
                                className="w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-5 relative z-10"
                                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            >
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                        <ScanFace className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 leading-none">{currentProfile.name}</div>
                                        <div className="text-[10px] font-medium text-slate-400 mt-1">Status: Pending Review</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                        <span className="text-xs font-bold text-slate-700">Attendance</span>
                                        <span className="text-xs font-bold text-emerald-600">{currentProfile.skills[4].split('(')[1].replace(')', '')}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                        <span className="text-xs font-bold text-slate-700">CGPA</span>
                                        <span className="text-xs font-bold text-blue-600">{currentProfile.skills[3].split('(')[1].split(' ')[0]}</span>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                                        className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-50 border border-emerald-100"
                                    >
                                        <span className="text-xs font-bold text-emerald-800">Faculty Action</span>
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Approved</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Middle Connection: APPROVAL CORE */}
                            <div className="flex-1 px-4 relative flex flex-col items-center justify-center gap-2">
                                <div className="scale-75">
                                    {/* Using BridgeMotionCore as base but re-styled for Approval */}
                                    <div className="w-[140px] h-[140px] flex items-center justify-center relative pointer-events-none">
                                        <svg width="140" height="140" viewBox="-70 -70 140 140" className="overflow-visible">
                                            <circle r="55" stroke="#10b981" strokeWidth="1" strokeDasharray="2 4" fill="none" opacity="0.3" />
                                            <motion.path
                                                d="M-50,0 A50,50 0 0,1 50,0" stroke="#10b981" strokeWidth="2" fill="none"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                                            />
                                            <motion.path
                                                d="M50,0 A50,50 0 0,1 -50,0" stroke="#10b981" strokeWidth="2" fill="none"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                            />
                                            <motion.circle
                                                r="20" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1.5"
                                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring" }}
                                            />
                                            <motion.path
                                                d="M-8,0 L-2,6 L10,-6" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 0.4 }}
                                            />
                                        </svg>
                                        <div className="absolute -bottom-6 text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em] animate-pulse">Faculty Review</div>
                                    </div>
                                </div>
                            </div>

                            {/* Faculty (Right) */}
                            <motion.div
                                className="w-72 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-5 relative z-10 text-white"
                                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            >
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white leading-none">Dr. Yogita Yashveer Raghav</div>
                                        <div className="text-[10px] text-slate-400 mt-1">Faculty Coordinator</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-xs text-slate-300 leading-relaxed">
                                        Reviewing application for <strong>Industrial Visit 2026</strong>. Checking eligibility criteria.
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={{ backgroundColor: ["#1e293b", "#064e3b", "#10b981"] }}
                                        transition={{ duration: 2, delay: 2, times: [0, 0.8, 1] }}
                                        className="w-full py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Accept Applicant</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* SCENE 2: COMPANY SHOWCASE */}
                    {scene === 2 && (
                        <motion.div
                            key="companies"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                            className="w-full max-w-4xl px-4 grid grid-cols-2 gap-8 items-center justify-center"
                        >
                            {/* Google Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 relative group overflow-hidden h-[220px] flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 blur-[1px] group-hover:opacity-20 transition-opacity">
                                    <Globe2 className="w-24 h-24 text-blue-500" />
                                </div>
                                <div>
                                    <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm mb-4">
                                        {/* Official Google G Logo SVG */}
                                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Google India</h3>
                                    <p className="text-xs text-slate-500 mt-1">Gurugram, Haryana • Cyber City</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> 20 Slots Available
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="w-[65%] h-full bg-blue-500 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Microsoft Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 relative group overflow-hidden h-[220px] flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 blur-[1px] group-hover:opacity-20 transition-opacity">
                                    <div className="grid grid-cols-2 gap-1 w-24 h-24 opacity-50">
                                        <div className="bg-orange-500" /> <div className="bg-green-500" />
                                        <div className="bg-blue-500" /> <div className="bg-yellow-500" />
                                    </div>
                                </div>
                                <div>
                                    <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm mb-4">
                                        {/* Simple MS simulation */}
                                        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                            <div className="bg-orange-500 rounded-[1px]" /> <div className="bg-green-500 rounded-[1px]" />
                                            <div className="bg-blue-500 rounded-[1px]" /> <div className="bg-yellow-500 rounded-[1px]" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Microsoft India</h3>
                                    <p className="text-xs text-slate-500 mt-1">Noida, Uttar Pradesh • R&D</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Priority Access
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="w-[85%] h-full bg-blue-600 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>

                            <div className="absolute -bottom-10 inset-x-0 text-center">
                                <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 shadow-sm">
                                    Exploration Mode: Active
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 3: VISIT CONFIRMED */}
                    {scene === 3 && (
                        <motion.div
                            key="visit"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                            className="flex flex-col items-center justify-center relative z-10"
                        >
                            <motion.div
                                className="w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative"
                                initial={{ y: 20 }} animate={{ y: 0 }}
                            >
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                                <div className="p-8 text-center">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-0 bg-emerald-400 rounded-full"
                                        />
                                        <CheckCircle2 className="w-10 h-10 text-emerald-600 relative z-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Visit Confirmed!</h3>
                                    <p className="text-sm text-slate-500 mb-8 max-w-[260px] mx-auto">
                                        You are scheduled to visit <span className="text-slate-900 font-bold">Microsoft Noida</span> on <span className="text-slate-900 font-bold">Oct 24, 2026</span>.
                                    </p>

                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                                                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                                    <div className="bg-orange-500 rounded-[0.5px]" /> <div className="bg-green-500 rounded-[0.5px]" />
                                                    <div className="bg-blue-500 rounded-[0.5px]" /> <div className="bg-yellow-500 rounded-[0.5px]" />
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-xs font-bold text-slate-900">Microsoft Visit Pass</div>
                                                <div className="text-[10px] text-slate-500">View Itinerary</div>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Stage Indicator Overlay (Minimal Dots) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
                {["Scan", "Gap Analysis", "Bridge", "Match"].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToScene(i)}
                        className={`transition-all duration-300 rounded-full ${scene === i
                            ? "w-8 h-2 bg-slate-900 shadow-lg"
                            : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                        aria-label={`Go to scene ${i + 1}`}
                    />
                ))}
            </div>

        </div>
    )
}

function ProfileMotionCore({ active }: { active: boolean }) {
    // Adapted from IntelligentDiscoveryIcon for Profile Ident Context
    return (
        <div className="w-[140px] h-[140px] flex items-center justify-center relative pointer-events-none">
            <svg width="140" height="140" viewBox="-70 -70 140 140" className="overflow-visible">
                {/* 1. OUTER RING: 3 Thin, Segmented Arcs */}
                <motion.g
                    animate={active ? { rotate: -360 } : {}}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    opacity="0.5"
                >
                    <path d="M-60,0 A60,60 0 0,1 -30,-52" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                    <path d="M30,52 A60,60 0 0,1 60,0" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                    <path d="M-30,52 A60,60 0 0,1 30,52" stroke="#cbd5e1" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                </motion.g>

                {/* 2. THE IRIS BLADES */}
                <motion.g
                    animate={active ? {
                        rotate: [0, 10, 0, 50, 50, 0],
                        scale: [1, 1.05, 1, 0.95, 0.95, 1]
                    } : {}}
                    transition={{
                        duration: 5,
                        times: [0, 0.4, 0.5, 0.6, 0.8, 1],
                        repeat: Infinity,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                >
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.path
                            key={i}
                            d="M-20,-40 Q0,-35 20,-40 L15,-15 Q0,-10 -15,-15 Z" // Scaled down path
                            fill="none"
                            stroke="#64748b"
                            strokeWidth="1"
                            transform={`rotate(${i * 60}) translate(0, -20)`}
                        />
                    ))}
                    <circle r="35" stroke="#cbd5e1" strokeWidth="0.5" fill="none" opacity="0.5" />
                </motion.g>

                {/* 3. CENTER PROFILE ICON */}
                <foreignObject x="-20" y="-20" width="40" height="40">
                    <div className="w-full h-full flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                            className="bg-blue-600/10 p-2 rounded-full"
                        >
                            <User className="w-6 h-6 text-blue-600" strokeWidth={2} />
                        </motion.div>
                    </div>
                </foreignObject>
            </svg>

            {/* Label Overlay */}
            <motion.div
                className="absolute -bottom-6 left-0 right-0 text-center"
                animate={active ? { opacity: [0, 1, 1, 0] } : {}}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
            >
                <div className="inline-block">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verifying Profile...</span>
                </div>
            </motion.div>
        </div>
    )
}






