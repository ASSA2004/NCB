"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Facebook, Instagram, Building2, ArrowUpRight } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { DBProject } from "@/app/actions/projects"

interface ProjectsGalleryProps {
  projects: DBProject[]
}

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [language, setLanguage] = useState<'en' | 'ta'>('en')

  return (
    <section className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary mb-4 tracking-tight"
            >
              {language === 'en' ? "Project Portfolio" : "திட்ட போர்ட்ஃபோலியோ"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-muted-foreground max-w-lg"
            >
              {language === 'en'
                ? "Discover our collection of architectural excellence, where every structure tells a story of precision and passion."
                : "எங்களின் கட்டிடக்கலை சிறப்பின் தொகுப்பைக் கண்டறியவும், அங்கு ஒவ்வொரு கட்டமைப்பும் துல்லியம் மற்றும் ஆர்வத்தின் கதையைச் சொல்கிறது."}
            </motion.p>
          </div>

          {/* Language Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-secondary/50 p-1 rounded-full border border-border"
          >
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${language === 'en'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${language === 'ta'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              தமிழ்
            </button>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="group block h-full"
              >
                <article className="h-full bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden bg-secondary">
                    {project.thumbnail && project.thumbnail !== "/placeholder.svg" ? (
                      <>
                        <Image
                          src={project.thumbnail}
                          alt={language === 'en' ? project.title : (project.title_ta || project.title)}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-muted-foreground">
                        <Building2 className="w-12 h-12 opacity-20" />
                        <span className="text-xs font-medium uppercase tracking-widest opacity-50">Image Coming Soon</span>
                      </div>
                    )}

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-background/90 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                        {project.completion_date || "2024"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col gap-6">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {language === 'en' ? project.title : project.title_ta}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{language === 'en' ? project.location : project.location_ta}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/50">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {language === 'en' ? "Total Area" : "மொத்த பரப்பளவு"}
                        </p>
                        <p className="font-medium text-foreground">
                          {language === 'en' ? project.total_area : project.total_area_ta}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {language === 'en' ? "Status" : "நிலை"}
                        </p>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {language === 'en' ? project.status : (project.status === 'Completed' ? 'முடிந்தது' : 'செயல்பாட்டில்')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                        {language === 'en' ? "View Details" : "விவரங்களைப் பார்க்க"}
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Card */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-primary text-primary-foreground p-8 md:p-16">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-black/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">New Crescent Builders</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-md leading-relaxed">
                {language === 'en'
                  ? "Excellence in Construction at Budget-Friendly Prices. Building dreams with precision and care."
                  : "பட்ஜெட்டுக்கு ஏற்ற விலையில் கட்டுமானத்தில் சிறந்து விளங்குகிறது. துல்லியம் மற்றும் கவனிப்புடன் கனவுகளை உருவாக்குதல்."}
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-70">Director</p>
                    <p className="font-semibold text-lg">Mr. Deenul Haq</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-70">Address</p>
                    <p className="font-semibold text-lg">Chairmanwaddy, Adirampattinam.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-3xl p-8 border border-white/10 backdrop-blur-md">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Phone className="w-6 h-6" />
                Contact Us
              </h3>

              <div className="space-y-4 mb-8">
                <a href="tel:+918124579997" className="block text-xl font-medium hover:opacity-80 transition-opacity">+91 8124579997</a>
                <a href="tel:+917402654336" className="block text-xl font-medium hover:opacity-80 transition-opacity">+91 7402654336</a>
                <a href="tel:+919363659997" className="block text-xl font-medium hover:opacity-80 transition-opacity">+91 9363659997</a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center justify-center gap-2 bg-white text-primary py-4 rounded-xl font-bold hover:bg-white/90 transition-colors">
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
                <a href="#" className="flex items-center justify-center gap-2 bg-white/20 text-white py-4 rounded-xl font-bold hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
