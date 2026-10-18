import { Navigation } from "@/components/navigation"
import { QuotationCalculatorNew } from "@/components/quotation-calculator-new"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function CalculatorPage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="py-16 md:py-20 lg:py-24">
          <QuotationCalculatorNew />
        </div>
        <Footer />
      </main>
      <Toaster />
    </>
  )
}
