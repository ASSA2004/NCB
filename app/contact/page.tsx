import { Navigation } from "@/components/navigation"
import { ContactPageContent } from "@/components/contact-page-content"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - New Crescent Builders",
  description:
    "Get in touch with New Crescent Builders for your construction, architectural design, and interior elevation needs in Adirai.",
}

export default function ContactPage() {
  return (
    <>
      <main className="min-h-screen">
        <Navigation />
        <ContactPageContent />
        <Footer />
      </main>
      <Toaster />
    </>
  )
}
