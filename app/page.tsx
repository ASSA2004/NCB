import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"

import { PricingSection } from "@/components/pricing-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { PRICING_PACKAGES } from "@/lib/data"
import { QuotationCalculatorNew } from "@/components/quotation-calculator-new"



export default async function HomePage() {


  return (
    <>
      <main className="min-h-screen scroll-smooth snap-y snap-mandatory overflow-y-scroll">
        <Navigation />

        <section className="snap-start min-h-screen relative">
          <Hero />
        </section>

        <section className="snap-start min-h-screen relative bg-background shadow-[0_-8px_16px_rgba(0,0,0,0.08)]">
          <PricingSection packages={PRICING_PACKAGES} />
        </section>

        <section className="snap-start min-h-screen relative bg-card shadow-[0_-8px_16px_rgba(0,0,0,0.08)] py-20">
          <div className="container mx-auto px-4">
            <QuotationCalculatorNew />
          </div>
        </section>

        <section className="snap-start min-h-screen relative bg-background shadow-[0_-8px_16px_rgba(0,0,0,0.08)]">
          <AboutSection />
        </section>

        <section className="snap-start min-h-screen relative bg-muted shadow-[0_-8px_16px_rgba(0,0,0,0.08)]">
          <ContactSection />
        </section>



        <Footer />
      </main>
      <Toaster />
    </>
  )
}
