"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/brand-logo"

export function Navbar() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

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
                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="hover:bg-transparent hover:text-primary transition-colors duration-300 font-medium text-muted-foreground" asChild>
                        <Link href="/get-started?mode=signin">Sign In</Link>
                    </Button>
                    <Button size="sm" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] bg-primary text-primary-foreground font-semibold rounded-full px-6" asChild>
                        <Link href="/get-started">Get Started</Link>
                    </Button>
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
                            <div className="flex flex-col gap-2 pt-2 border-t">
                                <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                                    <Link href="/get-started?mode=signin">Sign In</Link>
                                </Button>
                                <Button className="w-full bg-primary text-primary-foreground" asChild onClick={() => setIsMobileMenuOpen(false)}>
                                    <Link href="/get-started">Get Started</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}
