"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PartnerForm } from "./partner-form"
import { Building2, Users, TrendingUp, Minimize2, Maximize2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { TypewriterRotator } from "@/components/ui/typewriter-rotator"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PartnerPage() {
  const [isMinimized, setIsMinimized] = useState(false)

  // Hold the full homepage-like hero briefly for 0.6 seconds to establish continuity, then transform it
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimized(true)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-blue-100">
      <Navbar />

      {/* Animated Hero Section (Purely Architectural Scroll) */}
      <section 
        className={`bg-primary relative overflow-hidden z-10 w-full transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isMinimized ? 'h-[16rem] md:h-[18rem]' : 'h-[110vh]'}`}
      >
        {/* Abstract Background Element (Matches Home Page) */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 blur-3xl transform -skew-x-12 translate-x-1/2 pointer-events-none transition-opacity duration-1000" />
      </section>

      {/* Main Form Section - Attached to Document Flow natively tracking the border */}
      <section 
        className="relative z-20 px-4 flex justify-center w-full mt-[-6rem] md:mt-[-8rem] mb-20 pointer-events-auto"
      >
        <div className="w-full max-w-4xl bg-white p-6 md:p-10 lg:p-14 rounded-3xl shadow-2xl shadow-blue-900/5 border border-slate-200/60 backdrop-blur-xl shrink-0">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight mb-2 md:mb-3">Submit an Organization</h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
              Submit an organization profile to our platform. We will review the details and add it to our system upon approval.
            </p>
          </div>
          
          <PartnerForm />
        </div>
      </section>



      <Footer />
    </div>
  )
}
