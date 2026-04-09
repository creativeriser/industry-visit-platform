"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { ArrowRight } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { TypewriterRotator } from "@/components/ui/typewriter-rotator"
import { FeatureShowcase } from "@/components/marketing/feature-showcase"
import { ProcessTimeline } from "@/components/marketing/process-timeline"
import { DisciplineCard } from "@/components/marketing/discipline-card"
import { TrustSection } from "@/components/marketing/trust-section"
import { Footer } from "@/components/layout/footer"
import { useState, useEffect } from "react"
import { getCompanies } from "@/lib/companies"

export default function Home() {
  const router = useRouter()
  const [disciplines, setDisciplines] = useState<string[]>(["Computer Science", "Biotechnology"])

  useEffect(() => {
     getCompanies().then(companies => {
         const unique = Array.from(new Set(companies.map(c => c.discipline).filter(Boolean)))
         if (unique.length > 0) {
             setDisciplines(unique.sort())
         }
     })
  }, [])

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 }
    },
  }

  const rotatingWords = ["Future", "Career", "Potential", "Industry", "Success"]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary py-24 md:py-36 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 blur-3xl transform -skew-x-12 translate-x-1/2 pointer-events-none" />

        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              <br className="md:hidden" />
              <span className="text-secondary inline-flex justify-center md:justify-start min-w-[220px]">
                <TypewriterRotator texts={rotatingWords} waitDuration={2500} className="text-left md:text-center" />
              </span><br />
              Today.
            </h1>
          </motion.div>

          <motion.p
            variants={item}
            className="mx-auto max-w-2xl text-lg md:text-xl text-blue-100 mb-10 leading-relaxed"
          >
            The essential bridge between academia and industry. Enabling faculty to discover premier industrial partners, connect with representatives, and organize immersive student visits effortlessly.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-4"
          >
            <Link href="/get-started">
                <Button
                size="lg"
                className="bg-secondary text-white hover:bg-secondary/90 h-14 px-10 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                Access Portal <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
            <Button
              onClick={() => {
                const target = document.getElementById('streamlined-outreach') || document.getElementById('how-it-works');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              variant="outline"
              className="bg-white/5 text-white hover:bg-white/10 border-white/20 hover:text-white h-14 px-10 text-lg shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02]"
            >
              Explore Features
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase */}
      <section id="streamlined-outreach">
        <FeatureShowcase />
      </section>

      {/* How It Works */}
      <section id="how-it-works">
        <ProcessTimeline />
      </section>

      {/* Disciplines Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl font-bold text-primary tracking-tight cursor-default hover:text-blue-900 transition-colors duration-500"
            >
              Explore by Discipline
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplines.map((discipline, index) => (
              <DisciplineCard
                key={discipline}
                name={discipline}
                href={`/get-started?role=faculty&discipline=${encodeURIComponent(discipline)}#discovery`}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <TrustSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
