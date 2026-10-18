"use client"

import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"
import { TeamSection } from "@/components/team-section"

export function ContactSection() {
  const { language } = useLanguage()

  const content = {
    en: {
      subtitle: "Contact Us",
      title: "Let's Build",
      titleHighlight: "Together",
      description: "Have questions or ready to start your project? Get in touch with us today.",
      getInTouch: "Get in Touch",
      phone: "Phone",
      email: "Email",
      office: "Office",
      businessHours: "Business Hours",
      mondayToSaturday: "Monday - Saturday: 10:00 AM - 7:30 PM",
      friday: "Friday: After Jumma",
      sunday: "Sunday: Closed",
    },
    ta: {
      subtitle: "எங்களை தொடர்பு கொள்ளுங்கள்",
      title: "ஒன்றாக",
      titleHighlight: "கட்டுவோம்",
      description: "கேள்விகள் உள்ளதா அல்லது உங்கள் திட்டத்தைத் தொடங்க தயாரா? இன்றே எங்களை தொடர்பு கொள்ளுங்கள்.",
      getInTouch: "தொடர்பு கொள்ளுங்கள்",
      phone: "தொலைபேசி",
      email: "மின்னஞ்சல்",
      office: "அலுவலகம்",
      businessHours: "வணிக நேரம்",
      mondayToSaturday: "திங்கள் - சனி: காலை 10:00 - மாலை 7:30",
      friday: "வெள்ளி: ஜும்மாவுக்கு பிறகு",
      sunday: "ஞாயிறு: மூடப்பட்டது",
    },
  }

  const t = content[language]

  return (
    <section id="contact" className="py-16 md:py-24 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-full overflow-x-hidden">
        <div className="max-w-[90rem] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">{t.subtitle}</span>
            <h2
              className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl mb-4 text-balance break-words"
              lang={language === "ta" ? "ta" : "en"}
            >
              {t.title} <span className="text-primary">{t.titleHighlight}</span>
            </h2>
            <p
              className="text-base sm:text-lg md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words px-4"
              lang={language === "ta" ? "ta" : "en"}
            >
              {t.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-8 items-start mb-12">
            {/* Column 1: Contact Information */}
            <div className="space-y-6 md:space-y-8 h-full">
              <h3 className="font-serif font-bold text-2xl md:text-3xl mb-6 md:mb-8">{t.getInTouch}</h3>

              <div className="flex items-start gap-4 group transition-all">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-base md:text-lg mb-2 group-hover:text-primary transition-colors">
                    {t.phone}
                  </h4>
                  <a
                    href="tel:+918124579997"
                    className="block text-muted-foreground hover:text-primary text-sm md:text-base transition-colors"
                  >
                    +91 8124579997
                  </a>
                  <a
                    href="tel:+917402654336"
                    className="block text-muted-foreground hover:text-primary text-sm md:text-base transition-colors"
                  >
                    +91 7402654336
                  </a>
                </div>
              </div>

              <a href="mailto:newcrescentbuilders@gmail.com" className="flex items-start gap-4 group transition-all">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <Mail className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-base md:text-lg mb-2 group-hover:text-accent transition-colors">
                    {t.email}
                  </h4>
                  <p className="text-muted-foreground text-sm md:text-base break-all sm:break-normal">
                    newcrescentbuilders@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://maps.app.goo.gl/WRxapBZAr3RQbX5n7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group transition-all"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 group-hover:scale-110 transition-all">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-base md:text-lg mb-2 group-hover:text-secondary transition-colors">
                    {t.office}
                  </h4>
                  <p className="text-muted-foreground text-sm md:text-base">No.2, Chairmanwaddy St</p>
                  <p className="text-muted-foreground text-sm md:text-base">Adirampattinam - 614701</p>
                  <p className="text-muted-foreground text-sm md:text-base">Thanjavur Dist.</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-base md:text-lg mb-2">{t.businessHours}</h4>
                  <p className="text-muted-foreground text-sm md:text-base">{t.mondayToSaturday}</p>
                  <p className="text-muted-foreground text-sm md:text-base">{t.friday}</p>
                  <p className="text-muted-foreground text-sm md:text-base">{t.sunday}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Expert Team */}
            <div className="h-full">
              <TeamSection />
            </div>

            {/* Column 3: Map */}
            <div className="w-full h-[500px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg border border-border relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.566160163351!2d79.3780517800049!3d10.339255018659105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5567c699999999%3A0x6739999999999999!2sAdirampattinam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716300000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="New Crescent Builders Location"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
