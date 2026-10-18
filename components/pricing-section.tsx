"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

interface PricingPackage {
  id: string
  name: string
  name_ta: string | null
  description: string
  description_ta: string | null
  price_per_sqft: number
  features: Array<{ en: string; ta: string }>
  popular: boolean
  display_order: number
}

interface PricingSectionProps {
  packages: PricingPackage[]
}

export function PricingSection({ packages }: PricingSectionProps) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const MATERIAL_CATEGORIES = [
    {
      category: t("Cements", "சிமெண்ட்"),
      premium: "VALIMAI | RAMCO",
      elite: "DALMIA | ULTRA TECH"
    },
    {
      category: t("Steel", "கம்பி"),
      premium: "THIRUMALA | KAAVERI",
      elite: "AISHWARYAM | TATA"
    },
    {
      category: t("Sand", "மணல்"),
      premium: t("M-SAND | RIVER SAND", "M-மணல் | ஆற்று மணல்"),
      elite: t("M-SAND | RIVER SAND", "M-மணல் | ஆற்று மணல்")
    },
    {
      category: t("Switches", "சுவிட்சுகள்"),
      premium: "LISHA | INDOASIA",
      elite: "GM | LEGRAND"
    },
    {
      category: t("Wires", "வயர்கள்"),
      premium: "FYBRES | FINOLEX",
      elite: "FINOLEX GOLD | RR"
    },
    {
      category: t("Fittings", "பொருத்துதல்கள்"),
      premium: "PRAYAG | PARRYWARE",
      elite: "PARRYWARE | JAGUAR"
    },
    {
      category: t("Tiles", "டைல்ஸ்"),
      premium: "KAG | SOMANY",
      elite: "VARMORA | KAZARIYA"
    },
    {
      category: t("Wood", "மரம்"),
      premium: "MAHAKANI | UPVC",
      elite: "UPVC FQ | TEAK WOOD"
    },
    {
      category: t("Doors", "கதவுகள்"),
      premium: t("FLUSH DOORS | PVC (TOILETS)", "ஃப்ளஷ் கதவுகள் | PVC (கழிவறைகள்)"),
      elite: t("IMPORTED | WPVC (TOILETS)", "இறக்குமதி செய்யப்பட்டது | WPVC (கழிவறைகள்)")
    },
    {
      category: t("Paints", "பெயிண்ட்ஸ்"),
      premium: "NATIONAL | ASIAN",
      elite: "ASIAN PAINTS | DULUX PAINTS"
    },
    {
      category: t("Kitchen & Steps", "சமையலறை & படிகள்"),
      premium: t("TILES | GRANITE", "டைல்ஸ் | கிரானைட்"),
      elite: t("QUARTZ | GRANITE", "குவார்ட்ஸ் | கிரானைட்")
    },
    {
      category: t("Putty", "பட்டி"),
      premium: "ASIAN | DULUX",
      elite: "DULUX | BIRLA"
    }
  ]

  return (
    <section id="pricing" ref={sectionRef} className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                {t("Pricing Plans", "விலை திட்டங்கள்")}
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl mb-6 text-balance">
              {t("Transparent", "வெளிப்படையான")} <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("Pricing", "விலை நிர்ணயம்")}</span> {t("for Every Budget", "ஒவ்வொரு பட்ஜெட்டிற்கும்")}
            </h2>
            <p className="text-lg md:text-xl 2xl:text-2xl text-muted-foreground max-w-3xl 2xl:max-w-4xl mx-auto leading-relaxed">
              {t(
                "Choose the package that fits your needs. All packages include quality materials, expert craftsmanship, and our commitment to excellence.",
                "உங்கள் தேவைகளுக்கு ஏற்ற தொகுப்பைத் தேர்வு செய்யவும். அனைத்து தொகுப்புகளிலும் தரமான பொருட்கள், நிபுணத்துவ வேலைப்பாடு மற்றும் சிறப்பான சேவை ஆகியவை அடங்கும்."
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="mb-16 md:mb-20"
          >
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
              {/* Premium Package Card */}
              <Card className="overflow-hidden border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group">
                <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">{t("Premium Package", "பிரீமியம் தொகுப்பு")}</h3>
                  <div className="flex items-baseline gap-2 mb-4 relative z-10">
                    <span className="text-5xl md:text-6xl font-black">₹2450</span>
                    <span className="text-xl opacity-90">{t("/sqft", "/சதுர அடி")}</span>
                  </div>
                  <p className="text-primary-foreground/90 text-sm md:text-base relative z-10">
                    {t(
                      "Quality materials from trusted brands for your dream home",
                      "உங்கள் கனவு இல்லத்திற்கான நம்பகமான பிராண்டுகளின் தரமான பொருட்கள்"
                    )}
                  </p>
                </div>

                <div className="p-6 md:p-8 bg-card space-y-3">
                  {MATERIAL_CATEGORIES.map((material, index) => (
                    <motion.div
                      key={material.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm uppercase tracking-wide text-foreground mb-1">
                          {material.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-primary font-bold">{material.premium.split('|')[0].trim()}</span>
                          {material.premium.includes('|') && (
                            <>
                              <span className="mx-1.5 text-muted-foreground/60">|</span>
                              <span className="text-secondary font-bold">{material.premium.split('|')[1].trim()}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Elite Package Card */}
              <Card className="overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group relative">
                <div className="absolute -top-4 right-6 z-20">
                  <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    {t("Popular", "பிரபலமானது")}
                  </div>
                </div>
                <div className="relative bg-gradient-to-br from-primary/95 via-primary to-primary/90 text-primary-foreground p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">{t("Elite Package", "எலைட் தொகுப்பு")}</h3>
                  <div className="flex items-baseline gap-2 mb-4 relative z-10">
                    <span className="text-5xl md:text-6xl font-black">₹2600</span>
                    <span className="text-xl opacity-90">{t("/sqft", "/சதுர அடி")}</span>
                  </div>
                  <p className="text-primary-foreground/90 text-sm md:text-base relative z-10">
                    {t(
                      "Premium materials and luxury finishes for discerning homeowners",
                      "விவேகமான வீட்டு உரிமையாளர்களுக்கான பிரீமியம் பொருட்கள் மற்றும் ஆடம்பர பூச்சுகள்"
                    )}
                  </p>
                </div>

                <div className="p-6 md:p-8 bg-card space-y-3">
                  {MATERIAL_CATEGORIES.map((material, index) => (
                    <motion.div
                      key={material.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm uppercase tracking-wide text-foreground mb-1">
                          {material.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-primary font-bold">{material.elite.split('|')[0].trim()}</span>
                          {material.elite.includes('|') && (
                            <>
                              <span className="mx-1.5 text-muted-foreground/60">|</span>
                              <span className="text-secondary font-bold">{material.elite.split('|')[1].trim()}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>


          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-8 md:p-12 text-center mb-16 md:mb-20 shadow-lg"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
              <div className="relative z-10">
                <h3 className="font-display font-bold text-2xl md:text-3xl mb-3">{t("Need a Custom Package?", "தனிப்பயன் தொகுப்பு வேண்டுமா?")}</h3>
                <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                  {t(
                    "Every project is unique. Contact us for a personalized quote tailored to your specific requirements and budget.",
                    "ஒவ்வொரு திட்டமும் தனித்துவமானது. உங்கள் குறிப்பிட்ட தேவைகள் மற்றும் பட்ஜெட்டுக்கு ஏற்ற தனிப்பயனாக்கப்பட்ட மேற்கோளுக்கு எங்களை தொடர்பு கொள்ளவும்."
                  )}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="text-base font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/calculator">{t("Request Custom Quote", "தனிப்பயன் மேற்கோளைக் கோருங்கள்")}</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: t("No Hidden Costs", "மறைமுக கட்டணங்கள் இல்லை"),
                description: t(
                  "All prices include materials, labor, and basic fixtures. What you see is what you pay.",
                  "அனைத்து விலைகளிலும் பொருட்கள், தொழிலாளர் மற்றும் அடிப்படை சாதனங்கள் அடங்கும். நீங்கள் பார்ப்பதையே நீங்கள் செலுத்துகிறீர்கள்."
                ),
                delay: 0.6
              },
              {
                title: t("Flexible Payment", "நெகிழ்வான கட்டணம்"),
                description: t(
                  "We offer flexible payment plans to make your dream home affordable and stress-free.",
                  "உங்கள் கனவு இல்லத்தை மலிவு மற்றும் மன அழுத்தம் இல்லாததாக மாற்ற நாங்கள் நெகிழ்வான கட்டணத் திட்டங்களை வழங்குகிறோம்."
                ),
                delay: 0.7
              },
              {
                title: t("Quality Guarantee", "தர உத்தரவாதம்"),
                description: t(
                  "All packages come with warranty coverage and post-construction support.",
                  "அனைத்து தொகுப்புகளும் உத்தரவாத பாதுகாப்பு மற்றும் கட்டுமானத்திற்குப் பிந்தைய ஆதரவுடன் வருகின்றன."
                ),
                delay: 0.8
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: benefit.delay }}
                className="group"
              >
                <Card className="p-6 md:p-8 text-center h-full border-2 hover:border-primary/30 transition-all duration-500 hover:shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold mb-3 text-lg md:text-xl">{benefit.title}</h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section >
  )
}
