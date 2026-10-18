"use client"

import { useLanguage } from "@/contexts/language-context"

export function TeamSection() {
  const { language } = useLanguage()
  const t = (en: string, ta: string) => (language === "ta" ? ta : en)

  const teamMembers = [
    {
      name: "Mr. Deenul Huq M.",
      qualifications: "BBA, MCA",
      role: t("Director", "இயக்குநர்"),
    },
    {
      name: "Mr. Ahamed Ibrahim MA",
      qualifications: "BSC",
      role: t("General Manager", "பொது மேலாளர்"),
    },
    {
      name: "Mr. KannalRaji",
      qualifications: "BE Civil Engineer",
      role: t("Engineer", "பொறியாளர்"),
    },
    {
      name: "Mr. Basheer Ahamed",
      qualifications: "ME, PUC",
      role: t("Accountant", "கணக்காளர்"),
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="font-serif font-bold text-xl md:text-2xl text-foreground">
        {t("Our Expert Team", "எங்கள் நிபுணர் குழு")}
      </h3>

      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="border-l-2 border-primary pl-4 py-2">
            <h4 className="font-semibold text-base md:text-lg text-foreground mb-1">{member.name}</h4>
            <p className="text-sm text-foreground/80 mb-1">{member.qualifications}</p>
            <p className="text-sm font-medium text-primary">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
