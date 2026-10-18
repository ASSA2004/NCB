"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    MapPin,
    Calendar,
    ArrowLeft,
    Building2,
    Phone,
    Download,
    Maximize2,
    X,
    ChevronLeft,
    ChevronRight,
    Ruler,
    User,
    FileText,
    Clock
} from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { DBProject } from "@/app/actions/projects"

interface ExtendedProject extends DBProject {
    client?: string
    client_ta?: string
    projectType?: string
    projectType_ta?: string
    // stages?: { image: string }[] // If needed, but DB doesn't have it. We rely on gallery.
}

interface ProjectDetailClientProps {
    project: ExtendedProject
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
    const { language } = useLanguage()
    const { toast } = useToast()
    const [activeImage, setActiveImage] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [_isScrolled, setIsScrolled] = useState(false)

    // Consolidate images: Thumbnail -> Gallery
    const allImages = [
        project.thumbnail,
        ...(project.gallery || []),
    ].filter(Boolean).filter((img, index, self) => self.indexOf(img) === index)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 100)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ConstructionBusiness",
        "name": "New Crescent Builders",
        "image": project.thumbnail,
        "description": language === 'en' ? project.title : project.title_ta,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": language === 'en' ? project.location : project.location_ta,
            "addressLocality": "Adirampattinam",
            "addressRegion": "TN",
            "addressCountry": "IN"
        }
    }

    const t = (en: string | null | undefined, ta: string | null | undefined) => (language === "ta" ? (ta || en || "") : (en || ""))

    const nextImage = () => setActiveImage((prev) => (prev + 1) % allImages.length)
    const prevImage = () => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navigation />

            <main className="min-h-screen bg-background pt-20">

                {/* --- Hero Section --- */}
                <section className="relative bg-card pb-12">
                    <div className="container mx-auto px-4 pt-6">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            {t("Back to Portfolio", "போர்ட்ஃபோலியோவுக்குத் திரும்பு")}
                        </Link>

                        <div className="grid lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
                            {/* Main Image Area */}
                            <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-lg group bg-muted h-[300px] lg:h-full">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={allImages[activeImage] || "/placeholder.svg"}
                                            alt={t(project.title, project.title_ta)}
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 75vw"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                {/* Mobile Controls */}
                                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 lg:hidden z-10">
                                    {allImages.slice(0, 5).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === activeImage ? "bg-primary w-6" : "bg-white/50"
                                                }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-4 right-4 text-white hover:bg-white/20 hidden lg:flex"
                                    onClick={() => setLightboxOpen(true)}
                                >
                                    <Maximize2 className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Desktop Thumbnails / Info Side */}
                            <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                                <div className="flex-1 bg-primary/10 rounded-2xl p-6 text-foreground flex flex-col justify-center relative overflow-hidden border border-primary/20">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10" />

                                    <Badge className="self-start mb-4 bg-primary text-primary-foreground border-none hover:bg-primary/90">
                                        {project.featured ? t("Featured Project", "சிறப்புத் திட்டம்") : t("Completed", "நிறைவுற்றது")}
                                    </Badge>

                                    <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                                        {t(project.title, project.title_ta)}
                                    </h1>

                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {t(project.location, project.location_ta)}
                                    </div>

                                    <div className="flex flex-col gap-3 mt-auto">
                                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" asChild>
                                            <a href="tel:+918148489121">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {t("Contact Us", "தொடர்பு கொள்ள")}
                                            </a>
                                        </Button>

                                    </div>
                                </div>

                                <div className="hidden lg:grid grid-cols-2 gap-2 h-1/3">
                                    {allImages.slice(1, 3).map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx + 1)}
                                            className="relative rounded-xl overflow-hidden h-full w-full group"
                                        >
                                            <Image
                                                src={img}
                                                alt="Thumbnail"
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors ${activeImage === idx + 1 ? 'ring-2 ring-primary ring-inset' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Meta Row --- */}
                <section className="bg-card border-b border-border sticky top-20 z-30 shadow-sm/50 backdrop-blur-md bg-card/90">
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Ruler className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("Total Area", "மொத்த பரப்பளவு")}</p>
                                    <p className="font-bold text-foreground">{t(project.total_area, project.total_area_ta)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("Completion", "நிறைவு")}</p>
                                    <p className="font-bold text-foreground">{project.completion_date || "2024"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("Type", "வகை")}</p>
                                    <p className="font-bold text-foreground">{t(project.projectType || "Residential", project.projectType_ta || "குடியிருப்பு")}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("Client", "வாடிக்கையாளர்")}</p>
                                    <p className="font-bold text-foreground truncate max-w-[120px]" title={t(project.title, project.title_ta)}>
                                        {t(project.client || "Private Client", project.client_ta || "தனியார் வாடிக்கையாளர்")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Main Content --- */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Overview */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="prose prose-slate max-w-none"
                            >
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
                                    <FileText className="w-6 h-6 text-primary" />
                                    {t("Project Overview", "திட்ட மேலோட்டம்")}
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {t(
                                        project.highlights || "A premium construction project by New Crescent Builders, featuring modern amenities and high-quality finishings.",
                                        project.highlights_ta || "நியூ கிரசண்ட் பில்டர்ஸின் பிரீமியம் கட்டுமானத் திட்டம், நவீன வசதிகள் மற்றும் உயர்தர பூச்சுகளைக் கொண்டுள்ளது."
                                    )}
                                </p>
                            </motion.section>

                            {/* Floor Details Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-primary rounded-full" />
                                        {t("Ground Floor", "தரைத் தளம்")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {t(project.ground_floor, project.ground_floor_ta)}
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-primary/70 rounded-full" />
                                        {t("First Floor", "முதல் தளம்")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {t(project.first_floor, project.first_floor_ta)}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Gallery Grid */}
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-6">{t("Gallery", "காட்சியகம்")}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {allImages.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                                            onClick={() => {
                                                setActiveImage(idx)
                                                setLightboxOpen(true)
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Gallery ${idx}`}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <Maximize2 className="text-white w-6 h-6 drop-shadow-md" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Sidebar */}
                        <div className="lg:col-span-1 space-y-8">

                            <Card className="border-border shadow-lg bg-card sticky top-40">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-xl text-foreground mb-6">{t("Interested?", "ஆர்வமாக உள்ளீர்களா?")}</h3>

                                    <div className="space-y-4 mb-6">
                                        <a href="tel:+918148489121" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                                            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase">{t("Call Us", "எங்களை அழைக்கவும்")}</p>
                                                <p className="font-bold text-foreground">+91 8148489121</p>
                                            </div>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map Placeholder */}
                            <div className="rounded-2xl overflow-hidden h-64 bg-muted relative border border-border">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight={0}
                                    marginWidth={0}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(project.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="opacity-80 hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute bottom-2 left-2 bg-card/90 px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm pointer-events-none">
                                    {t("Project Location", "திட்ட இடம்")}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    {t("Timeline", "காலவரிசை")}
                                </h3>
                                <div className="relative pl-4 border-l-2 border-border space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-card" />
                                        <p className="text-sm font-bold text-foreground">{t("Completion", "நிறைவு")}</p>
                                        <p className="text-xs text-muted-foreground">{project.completion_date || "2024"}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-muted ring-4 ring-card" />
                                        <p className="text-sm font-bold text-foreground">{t("Construction Start", "கட்டுமானம் தொடக்கம்")}</p>
                                        <p className="text-xs text-muted-foreground">2023</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 hidden md:block"
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 hidden md:block"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        <div
                            className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={allImages[activeImage] || "/placeholder.svg"}
                                alt="Full screen view"
                                fill
                                className="object-contain" // Changed to contain for lightbox
                                quality={100}
                            />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-1 rounded-full">
                                {activeImage + 1} / {allImages.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
