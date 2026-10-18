"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { Marquee } from "@/components/ui/marquee"
import { Instagram, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  const { language } = useLanguage()

  const brandPartners = [
    { name: "Birla White", logo: "/brands/birla-white.png" },
    { name: "Dulux", logo: "/brands/dulux.png" },
    { name: "Dalmia Cement", logo: "/brands/dalmia-cement.png" },
    { name: "Avonplast", logo: "/brands/avonplast.png" },
    { name: "Kajaria", logo: "/brands/kajaria.png" },
    { name: "Jaguar", logo: "/brands/jaguar.png" },
    { name: "Asian Paints", logo: "/brands/asian-paints.png" },
    { name: "Parryware", logo: "/brands/parryware.png" },
    { name: "Legrand", logo: "/brands/legrand.png" },
    { name: "UltraTech Cement", logo: "/brands/ultratech.png" },
  ]

  const content = {
    en: {
      description:
        "Building dreams into reality with quality craftsmanship and innovative design solutions across Adirampattinam for over 10 years.",
      ourPartners: "Our Trusted Partners",
    },
    ta: {
      description:
        "10 ஆண்டுகளுக்கும் மேலாக அடிராம்பட்டினம் முழுவதும் தரமான கைவினைத்திறன் மற்றும் புதுமையான வடிவமைப்பு தீர்வுகளுடன் கனவுகளை நிஜமாக்குகிறோம்.",
      ourPartners: "எங்கள் நம்பகமான பங்குதாரர்கள்",
    },
  }

  const t = content[language]

  return (
    <footer id="footer" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <Link href="#home" className="inline-flex items-center justify-center mb-5 sm:mb-6">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                <Image
                  src="/new-crescent-logo.png"
                  alt="New Crescent Builders"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4 sm:px-0">
              {t.description}
            </p>

            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 flex-wrap">
              {/* WhatsApp - Green */}
              <a
                href="https://wa.me/919363659997"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366]/10 text-[#25D366] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#25D366] hover:text-white"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* Instagram - Pink/Gradient */}
              <a
                href="https://www.instagram.com/newcrescentbuilders"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E1306C]/10 text-[#E1306C] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#E1306C] hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>

              {/* Threads - Black/White */}
              <a
                href="https://www.threads.com/@newcrescentbuilders"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/5 text-black dark:bg-white/10 dark:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Threads"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.186 0C5.474 0 .001 5.426.001 12.122c0 6.696 5.473 12.122 12.185 12.122 6.711 0 12.185-5.426 12.185-12.122C24.371 5.426 18.897 0 12.186 0zm-1.848 18.257c-1.396 0-2.822-.249-3.92-1.353-.984-1.042-1.37-2.529-1.37-4.542 0-3.327 1.838-6.037 5.125-6.037 2.14 0 3.398 1.144 3.754 2.895l-4.532 1.137c-.114-1.002-.591-1.616-1.36-1.616-.763 0-1.52.793-1.52 3.392 0 2.508.823 3.387 1.625 3.387.712 0 1.258-.567 1.487-1.442l.063-.263 2.155.65-.084.341c-.43 1.776-1.503 3.45-3.418 3.45zm8.261-3.664c-.394 2.227-1.745 4.39-4.8 4.39-2.923 0-5.186-2.032-5.186-5.454 0-3.693 2.827-6.9 6.702-6.9 2.592 0 4.226 1.346 4.606 3.655.432 2.684-1.125 5.275-3.923 5.275-1.284 0-2.05-.59-2.313-1.433-.031.579-.068 1.14-.14 1.688l-2.001-.476c.265-2.067.84-6.324.84-6.324.238-1.516.27-2.223.064-2.846l2.164-.537c.057.245.068.736-.037 1.517.848-1.082 1.942-1.613 3.094-1.613 2.226 0 3.52 1.69 3.23 4.234-.412 3.593-2.618 5.437-4.945 5.437-.887 0-1.343-.443-1.196-1.564l1.192-5.717c.224-1.066.866-1.554 1.586-1.554.675 0 1.05.474.887 1.458-.291 1.751-.433 2.559-.433 2.559-.047.378.077.587.35.587 1.168 0 2.072-2.18 2.203-4.214z" />
                </svg>
              </a>

              {/* Twitter/X - Black/White */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/5 text-black dark:bg-white/10 dark:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Twitter"
              >
                {/* Twitter/X Icon (using Lucide Twitter is bird, maybe prefer X logic? User said Twitter. Using Lucide default) */}
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>

              {/* Facebook - Blue */}
              <a
                href="https://www.facebook.com/newcrescentbuilders01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#1877F2] hover:text-white"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn - Blue */}
              {/* <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#0A66C2] hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a> */}
            </div>
          </div>

          <div className="border-t border-border pt-6 sm:pt-8">
            <h3 className="font-semibold text-center mb-5 sm:mb-6 text-sm sm:text-base text-foreground">
              {t.ourPartners}
            </h3>
            <div className="relative w-full overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent z-10" />

              <Marquee pauseOnHover className="[--duration:40s]">
                {brandPartners.map((brand, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center mx-6 sm:mx-8 opacity-70 hover:opacity-100 transition-opacity duration-300"
                    title={brand.name}
                  >
                    <div className="relative w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 lg:w-20 lg:h-16 flex items-center justify-center bg-muted/50 rounded-lg px-2 py-1">
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        fill
                        className="object-contain filter brightness-90 dark:brightness-100 dark:invert"
                      />
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
