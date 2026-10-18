"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Building2, Award, Users, TrendingUp } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"

const heroImages = ["/office-exterior.jpg", "/office-facade.jpg", "/office-interior.jpg"]

export function ArchitecturalProfile() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const content = {
    en: {
      badge: "Architectural Excellence",
      title: "Building Dreams Into Reality",
      subtitle: "New Crescent Builders",
      description:
        "We are a premier construction company specializing in residential and commercial projects across Adirampattinam. With over a decade of experience, we transform architectural visions into stunning realities through quality craftsmanship and innovative design.",
      stats: [
        { icon: Building2, value: "20+", label: "Projects Completed" },
        { icon: Award, value: "10+", label: "Years Experience" },
        { icon: Users, value: "100+", label: "Happy Clients" },
        { icon: TrendingUp, value: "100%", label: "Quality Assured" },
      ],
    },
    ta: {
      badge: "கட்டிடக்கலை சிறப்பு",
      title: "கனவுகளை யதார்த்தமாக கட்டுதல்",
      subtitle: "நியூ கிரசண்ட் பில்டர்ஸ்",
      description:
        "அடிராம்பட்டினம் முழுவதும் குடியிருப்பு மற்றும் வணிக திட்டங்களில் நிபுணத்துவம் பெற்ற ஒரு முதன்மை கட்டுமான நிறுவனம். ஒரு தசாப்தத்திற்கும் மேலான அனுபவத்துடன், தரமான கைவினை மற்றும் புதுமையான வடிவமைப்பு மூலம் கட்டிடக்கலை பார்வைகளை அதிர்ச்சியூட்டும் யதார்த்தங்களாக மாற்றுகிறோம்.",
      stats: [
        { icon: Building2, value: "20+", label: "முடிக்கப்பட்ட திட்டங்கள்" },
        { icon: Award, value: "10+", label: "வருட அனுபவம்" },
        { icon: Users, value: "100+", label: "மகிழ்ச்சியான வாடிக்கையாளர்கள்" },
        { icon: TrendingUp, value: "100%", label: "தர உத்தரவாதம்" },
      ],
    },
  }

  const t = content[language]

  return (
    <section id="architectural-profile" className="relative py-20 md:py-32 bg-background overflow-hidden scroll-mt-20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary font-semibold text-sm uppercase tracking-widest mb-6">
              {t.badge}
            </span>
            <h1 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl mb-4 text-balance">
              <span className="text-foreground">{t.title}</span>
            </h1>
            <p className="text-2xl md:text-3xl text-primary font-semibold mb-6">{t.subtitle}</p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">{t.description}</p>
          </div>

          {/* Stats Marquee */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

            <Marquee pauseOnHover className="[--duration:30s]">
              {t.stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center mx-8 sm:mx-12 md:mx-16 group cursor-default"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-muted/50 border border-border rounded-full mb-4 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium whitespace-nowrap">{stat.label}</div>
                  </div>
                )
              })}
            </Marquee>
          </div>

          {/* Decorative Line */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="h-2 w-2 rounded-full bg-primary" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>
      </div>
    </section>
  )
}
