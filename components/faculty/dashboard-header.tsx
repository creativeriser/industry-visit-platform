"use client"

import { useState, useEffect } from "react"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserProfileMenu } from "./user-profile-menu"

import { useUser } from "@/context/user-context"

interface DashboardHeaderProps {
    onSearch?: (query: string) => void;
    basePath?: string;
}

export function DashboardHeader({ onSearch, basePath = "/faculty" }: DashboardHeaderProps) {
    const { user } = useUser()
    const userName = user.fullName;

    // State for client-side only values to prevent hydration mismatch
    const [dateTime, setDateTime] = useState<{
        academicYear: string;
        dateStr: string;
        greeting: string;
    } | null>(null);

    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours();

        // 1. Determine Greeting
        let greetingText = "Good Evening";
        if (currentHour >= 5 && currentHour < 12) greetingText = "Good Morning";
        else if (currentHour >= 12 && currentHour < 17) greetingText = "Good Afternoon";

        // 2. Determine Academic Year (Assuming July 1st cutoff for new session)
        // Month is 0-indexed (0=Jan, 6=July)
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const startYear = currentMonth >= 6 ? currentYear : currentYear - 1;
        const academicYearText = `Academic Year ${startYear}-${(startYear + 1).toString().slice(-2)}`;

        // 3. Format Date
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
                        <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-[4px] border border-indigo-100/50">
                            {dateTime ? dateTime.academicYear : "Loading..."}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                            {dateTime ? dateTime.dateStr : "..."}
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                        {dateTime ? dateTime.greeting : "Welcome"}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500">{userName.split(' ')[0]}</span>
                    </h1>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative hidden lg:block w-80 group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                        </div>
                        <Input
                            placeholder="Search companies, locations, or technologies..."
                            onChange={(e) => onSearch?.(e.target.value)}
                            className="pl-11 bg-slate-100/50 border-transparent hover:bg-slate-100 hover:border-slate-200 focus:bg-white focus:border-indigo-200 focus-visible:ring-4 focus-visible:ring-indigo-600/10 focus-visible:ring-offset-0 rounded-full h-11 text-sm transition-all duration-300 placeholder:text-slate-400 font-medium shadow-none focus:shadow-lg focus:shadow-indigo-900/5"
                        />
                    </div>

                    <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60">
                        <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 border border-white rounded-full"></span>
                        </Button>

                        <div className="scale-90 origin-right">
                            <UserProfileMenu
                                name={userName}
                                avatarFallback={userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                basePath={basePath}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
