"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    Globe2,
    LogOut,
    Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { UserProvider } from "@/context/user-context"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeHash, setActiveHash] = useState("")
    const pathname = usePathname()

    useEffect(() => {
        setActiveHash(window.location.hash)
        const handleHashChange = () => setActiveHash(window.location.hash)
        window.addEventListener("hashchange", handleHashChange)
        const handleAnchorClick = () => setTimeout(() => setActiveHash(window.location.hash), 50)
        window.addEventListener("click", handleAnchorClick)
        return () => {
            window.removeEventListener("hashchange", handleHashChange)
            window.removeEventListener("click", handleAnchorClick)
        }
    }, [pathname])

    const navItems = [
        { name: "Dashboard", href: "/student", icon: LayoutDashboard },
        { name: "Discover", href: "/student#discovery", icon: Globe2 },
    ]

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex">
            <UserProvider>
                <motion.aside
                    initial={false}
                    animate={{ width: isSidebarOpen ? 260 : 72 }}
                    className="fixed inset-y-4 left-4 z-40 hidden md:flex flex-col bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl transition-all duration-300 ease-[bezier(0.25,0.1,0.25,1)]"
                >
                    <div className={cn("h-18 flex items-center px-5 mb-2", isSidebarOpen ? "justify-start" : "justify-center")}>
                        {isSidebarOpen ? (
                            <div className="scale-90 origin-left">
                                <BrandLogo id="student-sidebar-logo" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                                <div className="scale-50">
                                    <BrandLogo id="student-sidebar-mini" showText={false} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 px-3 space-y-1.5 overflow-y-auto py-2">
                        {navItems.map((item) => {
                            const itemHash = item.href.includes("#") ? item.href.split("#")[1] : ""
                            const itemPath = item.href.split("#")[0]
                            let isActive = false

                            if (itemHash) {
                                isActive = pathname === itemPath && activeHash === `#${itemHash}`
                            } else {
                                const isHashLinkActive = navItems.some(n => n.href.includes("#") && pathname === n.href.split("#")[0] && activeHash === `#${n.href.split("#")[1]}`)
                                isActive = pathname === itemPath && !isHashLinkActive
                            }

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        const newHash = item.href.includes("#") ? `#${item.href.split("#")[1]}` : ""
                                        setActiveHash(newHash)
                                        if (item.href === "/student") {
                                            window.scrollTo({ top: 0, behavior: "instant" })
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-sky-50 text-sky-700 shadow-sm"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-medium text-sm whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="p-3 mt-auto">
                        <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-100/50">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="w-full flex items-center gap-3 px-2 py-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-white/50"
                            >
                                {isSidebarOpen ? <Menu className="w-4 h-4" /> : <Menu className="w-4 h-4 mx-auto" />}
                                {isSidebarOpen && <span className="text-xs font-semibold uppercase tracking-wider">Collapse</span>}
                            </button>
                            <div className="my-1 border-t border-slate-200/50" />
                            <Link
                                href="/get-started?mode=signin"
                                className={cn(
                                    "flex items-center gap-3 px-2 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors",
                                    !isSidebarOpen && "justify-center"
                                )}
                            >
                                <LogOut className="w-4 h-4" />
                                {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
                            </Link>
                        </div>
                    </div>
                </motion.aside>

                <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4">
                    <div className="scale-90">
                        <BrandLogo id="student-mobile-logo" />
                    </div>
                    <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6 text-slate-600" />
                    </Button>
                </div>

                <main className={cn(
                    "flex-1 w-full max-w-full min-h-screen transition-all duration-300 ease-[bezier(0.25,0.1,0.25,1)] md:pt-4 pt-20 pr-4 pb-4",
                    isSidebarOpen ? "md:pl-[292px]" : "md:pl-[104px]"
                )}>
                    <div id="student-content-wrapper" className="w-full h-full bg-white rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden">
                        {children}
                    </div>
                </main>
            </UserProvider>
        </div>
    )
}
