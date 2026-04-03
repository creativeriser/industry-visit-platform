"use client"

import { useState, useEffect } from "react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface StudentHeaderProps {
    onSearch?: (query: string) => void;
    basePath?: string;
    profile: any;
}

export function StudentHeader({ onSearch, basePath = "/student", profile }: StudentHeaderProps) {
    const userName = profile?.full_name || "Student";
    const avatarFallback = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

    const [dateTime, setDateTime] = useState<{
        academicYear: string;
        dateStr: string;
        greeting: string;
    } | null>(null);

    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours();

        let greetingText = "Good Evening";
        if (currentHour >= 5 && currentHour < 12) greetingText = "Good Morning";
        else if (currentHour >= 12 && currentHour < 17) greetingText = "Good Afternoon";

        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const startYear = currentMonth >= 6 ? currentYear : currentYear - 1;
        const academicYearText = `Academic Year ${startYear}-${(startYear + 1).toString().slice(-2)}`;

        const dateText = now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });

        setDateTime({
            academicYear: academicYearText,
            dateStr: dateText,
            greeting: greetingText
        });
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4 transition-all duration-200">
            <div className="flex items-end justify-between">
                {/* Greeting Section */}
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                        <span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-[4px] border border-sky-100/50">
                            {dateTime ? dateTime.academicYear : "Loading..."}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                            {dateTime ? dateTime.dateStr : "..."}
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                        {dateTime ? dateTime.greeting : "Welcome"}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-500">{userName.split(' ')[0]}</span>
                    </h1>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:block w-80 group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-sky-600 transition-colors duration-300" />
                        </div>
                        <Input
                            placeholder="Search companies, locations, disciplines..."
                            onChange={(e) => onSearch?.(e.target.value)}
                            className="pl-11 bg-slate-100/50 border-transparent hover:bg-slate-100 hover:border-slate-200 focus:bg-white focus:border-sky-200 focus-visible:ring-4 focus-visible:ring-sky-600/10 focus-visible:ring-offset-0 rounded-full h-11 text-sm transition-all duration-300 placeholder:text-slate-400 font-medium shadow-none focus:shadow-lg focus:shadow-sky-900/5"
                        />
                    </div>

                    <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60">
                        <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all relative">
                            <Bell className="w-5 h-5" />
                        </Button>

                        <div className="scale-90 origin-right">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = `${basePath}/profile`}
                                className="relative h-11 w-11 rounded-full p-0.5 transition-all duration-300 bg-gradient-to-br from-slate-200 to-slate-300 hover:from-sky-400 hover:to-cyan-500 group"
                            >
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden relative z-10 shadow-sm group-hover:shadow-sky-500/20">
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-sky-600 transition-colors">
                                        {avatarFallback}
                                    </span>
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
