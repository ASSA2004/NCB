"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Award, Users, TrendingUp } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence, useInView, Variants } from "framer-motion"

const storyImages = ["/office-logo-sign.jpg", "/office-exterior.jpg", "/office-facade.jpg", "/office-interior.jpg"]

export function AboutSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { language, t } = useLanguage()
  const sectionRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const contentRef = useRef(null)

  const isInView = useInView(sectionRef, { once: false, amount: 0.15 })
  const cardsInView = useInView(cardsContainerRef, { once: false, amount: 0.2 })
  const contentInView = useInView(contentRef, { once: false, amount: 0.2 })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % storyImages.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Award,
      title: "Quality Craftsmanship",
      titleTa: "தரமான கைவினை",
      description: "10+ years of excellence in construction and design",
      descriptionTa: "கட்டுமானம் மற்றும் வடிவமைப்பில் 10+ வருட சிறப்பு",
    },
    {
      icon: Users,
      title: "Expert Team",
      titleTa: "நிபுணர் குழு",
      description: "Skilled professionals dedicated to your vision",
      descriptionTa: "உங்கள் பார்வைக்கு அர்ப்பணிக்கப்பட்ட திறமையான நிபுணர்கள்",
    },
    {
      icon: TrendingUp,
      title: "Transparent Pricing",
      titleTa: "வெளிப்படையான விலை",
      description: "Clear cost breakdowns with no hidden charges",
      descriptionTa: "மறைக்கப்பட்ட கட்டணங்கள் இல்லாமல் தெளிவான செலவு விவரங்கள்",
    },
    {
      icon: CheckCircle2,
      title: "On-Time Delivery",
      titleTa: "சரியான நேரத்தில் வழங்கல்",
      description: "Committed to meeting project deadlines",
      descriptionTa: "திட்ட காலக்கெடுவை சந்திக்க உறுதிபூண்டுள்ளோம்",
    },
  ]

  const values = [
    { en: "Quality materials and construction", ta: "தரமான பொருட்கள் மற்றும் கட்டுமானம்" },
    { en: "Customer satisfaction guaranteed", ta: "வாடிக்கையாளர் திருப்தி உத்தரவாதம்" },
    { en: "Innovative design solutions", ta: "புதுமையான வடிவமைப்பு தீர்வுகள்" },
    { en: "Sustainable building practices", ta: "நிலையான கட்டிட நடைமுறைகள்" },
    { en: "Local expertise in Adirampattinam", ta: "அடிராம்பட்டினத்தில் உள்ளூர் நிபுணத்துவம்" },
  ]

  const unfoldVariants: Variants = {
    hidden: { opacity: 0, rotateX: -15, y: 50, scale: 0.95 },
    visible: { opacity: 1, rotateX: 0, y: 0, scale: 1, transition: { duration: 1, ease: "easeInOut" } },
  }

  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeInOut" } },
  }

  return (
    <section
      id="about"
      className="py-24 sm:py-28 md:py-32 lg:py-40"
      ref={sectionRef}
      style={{ backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)" }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <motion.div
            className="text-center mb-16 sm:mb-20 md:mb-24 lg:mb-28 space-y-4 sm:space-y-5"
            variants={unfoldVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <span
              className="font-semibold text-sm sm:text-base uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              {t("About Us", "எங்களை பற்றி")}
            </span>

            <h2
              className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ color: "var(--foreground)" }}
            >
              {t("Building Trust Through", "நம்பிக்கையை உருவாக்குதல்")}{" "}
              <span style={{ color: "var(--primary)" }}>{t("Excellence", "சிறப்பு")}</span>
            </h2>

            <p
              className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed px-4 sm:px-0"
              style={{ color: "var(--muted-foreground)" }}
            >
              {language === "en"
                ? "New Crescent Builders is a newly established construction company..."
                : "நியூ க்ரெஸன்ட் பில்டர்ஸ் என்பது புதிதாக நிறுவப்பட்ட கட்டுமான நிறுவனம்..."}
            </p>
          </motion.div>

          {/* FEATURE CARDS */}
          <motion.div
            ref={cardsContainerRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 mb-20 sm:mb-24 md:mb-28"
            variants={cardContainerVariants}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card
                  className="p-6 sm:p-7 h-full transition-all duration-500"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <feature.icon
                    className="h-10 w-10 sm:h-12 sm:w-12 mb-4 sm:mb-5"
                    style={{ color: "var(--primary)" }}
                  />

                  <h3 className="font-semibold text-lg sm:text-xl mb-3" style={{ color: "var(--foreground)" }}>
                    {language === "ta" ? feature.titleTa : feature.title}
                  </h3>

                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {language === "ta" ? feature.descriptionTa : feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* MAIN CONTENT */}
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-start" ref={contentRef}>

            {/* LEFT CONTENT */}
            <motion.div
              className="space-y-6 sm:space-y-7"
              initial={{ opacity: 0, x: -40 }}
              animate={contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.8 }}
            >
              <h3
                className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl"
                style={{ color: "var(--foreground)" }}
              >
                {t("Our Story", "எங்கள் கதை")}
              </h3>

              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {language === "en"
                  ? "Though our company name is new..."
                  : "எங்கள் நிறுவனத்தின் பெயர் புதியதாக இருந்தாலும்..."}
              </p>

              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {language === "en"
                  ? "We've worked on numerous houses..."
                  : "பல வீடுகள் மற்றும் வணிக கட்டிடங்களில் நாங்கள் பணியாற்றியுள்ளோம்..."}
              </p>

              <motion.div
                className="rounded-xl p-6 sm:p-7"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <h4
                  className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4"
                  style={{ color: "var(--foreground)" }}
                >
                  {t("About New Crescent Builders", "நியூ க்ரெஸன்ட் பில்டர்ஸ் பற்றி")}
                </h4>

                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {language === "en"
                    ? "At New Crescent Builders, we blend modern design..."
                    : "நியூ க்ரெஸன்ட் பில்டர்ஸ்-ல், நவீன வடிவமைப்பு..."}
                </p>
              </motion.div>

              {/* TAMIL ONLY HIGHLIGHT BOX */}
              {language === "ta" && (
                <motion.div
                  className="rounded-xl p-7 text-center"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
                    border: "1px solid var(--primary)",
                    color: "var(--primary)",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={contentInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  உங்கள் கனவு இல்லத்தை எங்களுடன் இணைந்து கட்டி எழுப்பத் தயாரா?
                </motion.div>
              )}

              {/* VALUE LIST */}
              <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-7">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={contentInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                  >
                    <CheckCircle2
                      className="h-5 w-5 sm:h-6 sm:w-6 mt-0.5 flex-shrink-0"
                      style={{ color: "var(--primary)" }}
                    />
                    <span className="text-sm sm:text-base" style={{ color: "var(--foreground)" }}>
                      {language === "ta" ? value.ta : value.en}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* IMAGE WITH BADGE */}
            <motion.div
              className="relative lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 40 }}
              animate={contentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] sm:h-[500px] md:h-[550px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={storyImages[currentImageIndex]}
                    alt="New Crescent Builders Office"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>

                {/* Badge with theme colors */}
                <div
                  className="absolute bottom-8 sm:bottom-10 left-8 sm:left-10 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <div className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">
                    20+
                  </div>
                  <div className="text-sm sm:text-base md:text-lg font-medium">
                    {t("Happy Clients", "மகிழ்ச்சியான வாடிக்கையாளர்கள்")}
                  </div>
                </div>

                {/* Pagination dots */}
                <div className="absolute bottom-5 right-5 flex gap-2">
                  {storyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        backgroundColor:
                          index === currentImageIndex
                            ? "var(--background)"
                            : "color-mix(in srgb, var(--background) 50%, transparent)",
                        width: index === currentImageIndex ? "24px" : "8px",
                        height: "8px",
                        borderRadius: "9999px",
                        transition: "all 0.3s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
