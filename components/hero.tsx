"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { language, t } = useLanguage()

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 1.1])
  const y = useTransform(scrollY, [0, 400], [0, 100])

  const services = [
    { en: "Construction", ta: "கட்டுமானம்" },
    { en: "Architectural Design", ta: "கட்டடக்கலை வடிவமைப்பு" },
    { en: "Interior Design", ta: "உள்துறை வடிவமைப்பு" },
    { en: "Renovation", ta: "புதுப்பித்தல்" },
    { en: "Project Management", ta: "திட்ட மேலாண்மை" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [services.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden bg-background">
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale, opacity, y }}
      >
        {/* Gradient optimized for left-aligned text */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent z-10" />
        <img
          src="/office-exterior.jpg"
          alt="New Crescent Builders Office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay z-10" />
      </motion.div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 relative z-20">
        <motion.div
          className="max-w-5xl mr-auto text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative z-10 text-foreground">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-display font-bold mb-6 tracking-tight text-foreground drop-shadow-2xl leading-[1.1]"
              style={{ fontSize: "var(--text-fluid-6xl)" }}
            >
              {t("New Crescent Builders is", "புதிய கிரசண்ட் கட்டுபவர் என்பது")}
            </motion.h1>

            <div className="h-20 md:h-32 overflow-hidden relative flex justify-start items-center mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="font-light text-primary tracking-widest uppercase font-sans"
                  style={{ fontSize: "var(--text-fluid-2xl)" }}
                >
                  {t(services[currentIndex].en, services[currentIndex].ta)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="text-lg px-10 py-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] transition-all duration-500 hover:scale-105"
              onClick={() => {
                const calculatorSection = document.getElementById("quotation")
                if (calculatorSection) {
                  calculatorSection.scrollIntoView({ behavior: "smooth", block: "start" })
                } else {
                  window.location.href = "/calculator#quotation"
                }
              }}
            >
              {t("Calculate Cost", "செலவைக் கணக்கிடுங்கள்")}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-8 rounded-full border-primary/20 bg-background/5 backdrop-blur-sm text-foreground hover:bg-background/10 hover:border-primary/40 transition-all duration-300"
              onClick={() => {
                const projectsSection = document.getElementById("projects")
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: "smooth", block: "start" })
                } else {
                  window.location.href = "/portfolio"
                }
              }}
            >
              {t("View Projects", "திட்டங்களைப் பாருங்கள்")}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-10 z-20 hidden md:flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-16 h-[1px] bg-foreground/30" />
        <span className="text-foreground/50 text-sm uppercase tracking-widest">Scroll down</span>
      </motion.div>
    </section>
  )
}
