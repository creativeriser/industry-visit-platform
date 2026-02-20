"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Globe2,
    Bookmark,
    CalendarClock,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { UserProvider } from "@/context/user-context"

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeHash, setActiveHash] = useState("")
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/get-started")
        }
    }, [user, loading, router])

    useEffect(() => {
        // Set initial hash
        setActiveHash(window.location.hash)

        // Listen for hash changes
        const handleHashChange = () => setActiveHash(window.location.hash)
        window.addEventListener("hashchange", handleHashChange)

        // Also listen for click events on anchor links to update immediately
        const handleAnchorClick = () => setTimeout(() => setActiveHash(window.location.hash), 50)
        window.addEventListener("click", handleAnchorClick)

        return () => {
            window.removeEventListener("hashchange", handleHashChange)
            window.removeEventListener("click", handleAnchorClick)
        }
    }, [pathname])

    const navItems = [
        { name: "Dashboard", href: "/faculty", icon: LayoutDashboard },
        { name: "Discover", href: "/faculty#discovery", icon: Globe2 },
        { name: "My Shortlist", href: "/faculty/shortlist", icon: Bookmark },
    ]

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex">
            <UserProvider>
                {/* Floating Sidebar (Glass Rail) */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? 260 : 72
                    }}
                    className="fixed inset-y-4 left-4 z-40 hidden md:flex flex-col bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl transition-all duration-300 ease-[bezier(0.25,0.1,0.25,1)]"
                >
                    {/* Logo Area */}
                    <div className={cn("h-18 flex items-center px-5 mb-2 overflow-hidden", isSidebarOpen ? "justify-start" : "justify-center")}>
                        <AnimatePresence mode="wait">
                            {isSidebarOpen ? (
                                <motion.div
                                    key="logo-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, display: "none" }}
                                    transition={{ duration: 0.2 }}
                                    className="scale-90 origin-left flex-shrink-0"
                                >
                                    <BrandLogo id="faculty-sidebar-logo" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="logo-mini"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, display: "none" }}
                                    transition={{ duration: 0.2 }}
                                    className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0"
                                >
                                    <div className="scale-75">
                                        <BrandLogo id="faculty-sidebar-mini" showText={false} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Nav Items */}
                    <div className="flex-1 px-3 space-y-1.5 overflow-y-auto py-2">
                        {navItems.map((item) => {
                            // Logic: Match if full href (path + hash) matches current location OR if it's a sub-path without hash
                            const itemHash = item.href.includes("#") ? item.href.split("#")[1] : ""
                            const itemPath = item.href.split("#")[0]

                            let isActive = false

                            if (itemHash) {
                                // For hash links (Discover), require strict hash match
                                isActive = pathname === itemPath && activeHash === `#${itemHash}`
                            } else {
                                // For standard links (Dashboard), require path match AND no conflicting hash from our nav list
                                // If I am at /faculty#discovery, Dashboard (/faculty) should NOT be active
                                const isHashLinkActive = navItems.some(n => n.href.includes("#") && pathname === n.href.split("#")[0] && activeHash === `#${n.href.split("#")[1]}`)
                                isActive = pathname === itemPath && !isHashLinkActive
                            }

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        // INSTANT UI feedback: Set hash immediately
                                        const newHash = item.href.includes("#") ? `#${item.href.split("#")[1]}` : ""
                                        setActiveHash(newHash)

                                        // FORCE SCROLL TO TOP LOGIC:
                                        if (item.href === "/faculty") {
                                            // Method 1: Window Scroll (Instant)
                                            window.scrollTo({ top: 0, behavior: "instant" })

                                            // Method 2: Wrapper Scroll (in case overflow is internal)
                                            // We look for the main content wrapper by ID or fallback
                                            const wrapper = document.getElementById("faculty-content-wrapper") || document.querySelector("main > div")
                                            if (wrapper) wrapper.scrollTo({ top: 0, behavior: "instant" })

                                            // Method 3: Safety Check (Small delay)
                                            setTimeout(() => {
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                                if (wrapper) wrapper.scrollTo({ top: 0, behavior: "smooth" })
                                            }, 50)
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                        isSidebarOpen ? "justify-start" : "justify-center"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                                animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="font-medium text-sm whitespace-nowrap"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-3 mt-auto">
                        <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-100/50">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className={cn("w-full flex items-center px-2 py-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-white/50 overflow-hidden", isSidebarOpen ? "justify-start" : "justify-center")}
                            >
                                <Menu className="w-4 h-4 flex-shrink-0" />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                            animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                                        >
                                            Collapse
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            <div className="my-1 border-t border-slate-200/50" />

                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut()
                                    router.push("/get-started")
                                }}
                                className={cn(
                                    "flex items-center w-full px-2 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors overflow-hidden",
                                    isSidebarOpen ? "justify-start" : "justify-center"
                                )}
                            >
                                <LogOut className="w-4 h-4 flex-shrink-0" />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                            animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium whitespace-nowrap"
                                        >
                                            Sign Out
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </motion.aside>

                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4">
                    <div className="scale-90">
                        <BrandLogo id="faculty-mobile-logo" />
                    </div>
                    <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6 text-slate-600" />
                    </Button>
                </div>

                {/* Main Content Area */}
                <main className={cn(
                    "flex-1 w-full max-w-full min-h-screen transition-all duration-300 ease-[bezier(0.25,0.1,0.25,1)] md:pt-4 pt-20 pr-4 pb-4",
                    isSidebarOpen ? "md:pl-[292px]" : "md:pl-[104px]"
                )}>
                    <div id="faculty-content-wrapper" className="w-full h-full bg-white rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden">
                        {children}
                    </div>
                </main>
            </UserProvider>
        </div>
    )
}
