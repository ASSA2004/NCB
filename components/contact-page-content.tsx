"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Send, Building2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function ContactPageContent() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: language === "en" ? "Message Sent Successfully!" : "செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!",
        description:
          language === "en"
            ? "Thank you for contacting us. We'll respond within 24 hours."
            : "எங்களை தொடர்பு கொண்டதற்கு நன்றி. 24 மணி நேரத்திற்குள் நாங்கள் பதிலளிப்போம்.",
      })
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setIsSubmitting(false)
    }, 1000)
  }

  const content = {
    en: {
      pageTitle: "Contact Us",
      pageSubtitle: "We'd Love to Hear From You",
      pageDescription:
        "Have a project in mind or questions about our services? Reach out to us and let's discuss how we can bring your vision to life.",
      formTitle: "Send Us a Message",
      formName: "Full Name",
      formEmail: "Email Address",
      formPhone: "Phone Number",
      formSubject: "Subject",
      formMessage: "Your Message",
      formPlaceholderName: "John Doe",
      formPlaceholderEmail: "john@example.com",
      formPlaceholderPhone: "+91 98765 43210",
      formPlaceholderSubject: "Project Inquiry",
      formPlaceholderMessage: "Tell us about your project requirements...",
      sendButton: "Send Message",
      sending: "Sending...",
      contactInfoTitle: "Contact Information",
      phone: "Phone Numbers",
      email: "Email Address",
      office: "Office Location",
      businessHours: "Business Hours",
      mondayToSaturday: "Monday - Saturday",
      hours: "9:00 AM - 6:00 PM",
      sunday: "Sunday: Closed",
      whyChooseTitle: "Why Choose Us?",
      whyChoose1: "10+ Years of Experience",
      whyChoose2: "Quality Craftsmanship",
      whyChoose3: "Transparent Pricing",
      whyChoose4: "On-Time Delivery",
    },
    ta: {
      pageTitle: "எங்களை தொடர்பு கொள்ளுங்கள்",
      pageSubtitle: "உங்களிடமிருந்து கேட்க விரும்புகிறோம்",
      pageDescription:
        "ஒரு திட்டம் மனதில் உள்ளதா அல்லது எங்கள் சேவைகள் பற்றி கேள்விகள் உள்ளதா? எங்களை தொடர்பு கொண்டு உங்கள் பார்வையை எவ்வாறு உயிர்ப்பிக்க முடியும் என்பதை விவாதிப்போம்.",
      formTitle: "எங்களுக்கு ஒரு செய்தி அனுப்புங்கள்",
      formName: "முழு பெயர்",
      formEmail: "மின்னஞ்சல் முகவரி",
      formPhone: "தொலைபேசி எண்",
      formSubject: "பொருள்",
      formMessage: "உங்கள் செய்தி",
      formPlaceholderName: "உங்கள் பெயர்",
      formPlaceholderEmail: "john@example.com",
      formPlaceholderPhone: "+91 98765 43210",
      formPlaceholderSubject: "திட்ட விசாரணை",
      formPlaceholderMessage: "உங்கள் திட்ட தேவைகளைப் பற்றி எங்களிடம் கூறுங்கள்...",
      sendButton: "செய்தி அனுப்பு",
      sending: "அனுப்புகிறது...",
      contactInfoTitle: "தொடர்பு தகவல்",
      phone: "தொலைபேசி எண்கள்",
      email: "மின்னஞ்சல் முகவரி",
      office: "அலுவலக இடம்",
      businessHours: "வணிக நேரம்",
      mondayToSaturday: "திங்கள் - சனி",
      hours: "காலை 9:00 - மாலை 6:00",
      sunday: "ஞாயிறு: மூடப்பட்டது",
      whyChooseTitle: "ஏன் எங்களை தேர்வு செய்ய வேண்டும்?",
      whyChoose1: "10+ வருட அனுபவம்",
      whyChoose2: "தரமான கைவினை",
      whyChoose3: "வெளிப்படையான விலை",
      whyChoose4: "சரியான நேரத்தில் டெலிவரி",
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-balance">{t.pageTitle}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 text-balance">{t.pageSubtitle}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t.pageDescription}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Contact Form - Takes 2 columns */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Send className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="font-serif font-bold text-2xl md:text-3xl">{t.formTitle}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t.formName} *</Label>
                          <Input
                            id="name"
                            placeholder={t.formPlaceholderName}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t.formEmail} *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t.formPlaceholderEmail}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t.formPhone} *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t.formPlaceholderPhone}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">{t.formSubject} *</Label>
                          <Input
                            id="subject"
                            placeholder={t.formPlaceholderSubject}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t.formMessage} *</Label>
                        <Textarea
                          id="message"
                          placeholder={t.formPlaceholderMessage}
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full md:w-auto px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? t.sending : t.sendButton}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-xl mb-6">{t.contactInfoTitle}</h3>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">{t.phone}</h4>
                          <a
                            href="tel:+918124579997"
                            className="text-muted-foreground hover:text-foreground transition-colors block mb-1"
                          >
                            +91 8124579997
                          </a>
                          <a
                            href="tel:+917402654336"
                            className="text-muted-foreground hover:text-foreground transition-colors block"
                          >
                            +91 7402654336
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">{t.email}</h4>
                          <a
                            href="mailto:newcrescentbuilders@gmail.com"
                            className="text-muted-foreground hover:text-foreground transition-colors break-all"
                          >
                            newcrescentbuilders@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">{t.office}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            No.2, Chairmanwaddy St
                            <br />
                            Adirampattinam - 614701
                            <br />
                            Thanjavur Dist.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">{t.businessHours}</h4>
                          <p className="text-muted-foreground text-sm">
                            {t.mondayToSaturday}
                            <br />
                            {t.hours}
                          </p>
                          <p className="text-muted-foreground text-sm mt-1">{t.sunday}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Why Choose Us Card */}
                <Card className="shadow-lg bg-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="h-6 w-6" />
                      <h3 className="font-serif font-bold text-lg">{t.whyChooseTitle}</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        {t.whyChoose1}
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        {t.whyChoose2}
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        {t.whyChoose3}
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        {t.whyChoose4}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
