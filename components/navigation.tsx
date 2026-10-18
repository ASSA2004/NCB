"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Languages, Moon, Sun } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from 'next/navigation'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
      const heroHeight = window.innerHeight
      setIsPastHero(scrollPosition > heroHeight - 80)
    }

    handleScroll() // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = {
    en: [
      { href: "/", label: "Home" },
      { href: "/#about", label: "About" },
      { href: "/#services", label: "Services" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#contact", label: "Contact" },
    ],
    ta: [
      { href: "/", label: "முகப்பு" },
      { href: "/#about", label: "எங்களை பற்றி" },
      { href: "/#services", label: "சேவைகள்" },
      { href: "/portfolio", label: "போர்ட்ஃபோலியோ" },
      { href: "/#pricing", label: "விலை" },
      { href: "/#contact", label: "தொடர்பு" },
    ],
  }

  // Premium Glassmorphism Background
  const navbarBg =
    isHomePage && !isPastHero
      ? "bg-transparent border-b border-white/5"
      : "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"

  // Text colors - Always use foreground color (Black in Light, White in Dark)
  // The user explicitly requested text color: black in light theme throughout
  const textColor = "text-foreground"
  const logoText = "text-foreground"

  const [logoClickCount, setLogoClickCount] = useState(0)

  useEffect(() => {
    if (logoClickCount === 0) return
    const timer = setTimeout(() => setLogoClickCount(0), 2000) // 2 seconds window
    return () => clearTimeout(timer)
  }, [logoClickCount])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (logoClickCount + 1 === 3) {
      e.preventDefault()
      window.location.href = "/admin"
      return
    }
    setLogoClickCount((prev) => prev + 1)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${navbarBg}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
          <div className="flex items-center justify-between h-20 md:h-24 gap-4">
            <Link href="/" className="flex items-center gap-4 group flex-shrink-0" onClick={handleLogoClick}>
              <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-180">
                <Image
                  src="/new-crescent-logo.png"
                  alt="New Crescent Builders"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1
                  className={`font-display font-bold text-lg md:text-xl tracking-tight transition-colors duration-500 ${logoText}`}
                >
                  New Crescent Builders
                </h1>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-wrap justify-end flex-shrink-0">
              {navLinks[language].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium ${textColor} rounded-full hover:bg-foreground/5 transition-all duration-300 whitespace-nowrap group overflow-hidden`}
                  lang={language === "ta" ? "ta" : "en"}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 bg-foreground/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className={`hidden md:flex rounded-full hover:bg-foreground/10 transition-colors ${textColor}`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>

              <Button
                onClick={() => setLanguage(language === "en" ? "ta" : "en")}
                variant="ghost"
                size="sm"
                className={`hidden md:flex items-center gap-2 rounded-full hover:bg-foreground/10 transition-colors ${textColor}`}
              >
                <Languages className="h-4 w-4" />
                <span className="font-medium">{language === "en" ? "தமிழ்" : "English"}</span>
              </Button>

              <Button
                asChild
                size="sm"
                className="h-10 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25 font-medium"
              >
                <Link href="/portfolio">
                  {language === "en" ? "Portfolio" : "போர்ட்ஃபோலியோ"}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden rounded-full hover:bg-foreground/10 ${textColor}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border"
              >
                <div className="flex flex-col p-4 gap-2">
                  {navLinks[language].map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="block px-4 py-3 text-lg font-medium text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                        lang={language === "ta" ? "ta" : "en"}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      onClick={toggleTheme}
                      variant="outline"
                      className="flex-1 justify-center gap-2 rounded-xl"
                    >
                      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <span>{theme === "light" ? "Dark" : "Light"}</span>
                    </Button>
                    <Button
                      onClick={() => {
                        setLanguage(language === "en" ? "ta" : "en")
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="flex-1 justify-center gap-2 rounded-xl"
                    >
                      <Languages className="h-4 w-4" />
                      <span>{language === "en" ? "தமிழ்" : "English"}</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  )
}
