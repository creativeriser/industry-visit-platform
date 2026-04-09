"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/layout/brand-logo"
import { useAuth } from "@/context/auth-context"

export function Navbar() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const { user, profile, loading } = useAuth()

    const getDashboardRoute = () => {
        if (profile?.role === 'admin') return '/admin';
        if (profile?.role === 'student') return '/student';
        return '/faculty'; // Fallback
    }

    const navLinks: { name: string; href: string }[] = []

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group cursor-pointer" aria-label="UniVisit Home">
                    <BrandLogo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-1">
                    {navLinks.map((link, index) => {
                        const isActive = pathname === link.href

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm transition-all duration-200 rounded-full",
                                    isActive
                                        ? "text-primary font-bold bg-primary/5"
                                        : "text-muted-foreground font-medium hover:text-foreground"
                                )}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {link.name}

                                {hoveredIndex === index && !isActive && (
                                    <motion.div
                                        layoutId="navbar-hover"
                                        className="absolute inset-0 bg-secondary/10 rounded-full -z-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Action Buttons (Desktop) */}
                <div className="hidden md:flex items-center gap-5">
                    <Link href="/partner" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                        Partner with Us
                    </Link>
                    
                    {loading ? (
                        <div className="w-[124px] h-[36px] bg-slate-100 animate-pulse rounded-full"></div>
                    ) : user ? (
                        <Link href={getDashboardRoute()}>
                            <Button
                                variant="default"
                                size="sm"
                                className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm rounded-full px-5 font-semibold transition-all"
                            >
                                Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/get-started">
                            <Button
                                variant="default"
                                size="sm"
                                className="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white shadow-sm rounded-full px-5 font-semibold transition-all hover:shadow-md"
                            >
                                Log In
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b shadow-lg p-4 flex flex-col gap-4 md:hidden"
                        >
                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "px-4 py-3 rounded-md transition-colors text-sm font-medium",
                                            pathname === link.href
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="flex flex-col gap-2 pt-2 border-t text-center text-sm text-slate-500">
                                UniVisit Portal
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}
