import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif font-bold text-6xl mb-4">404</h1>
          <h2 className="text-2xl mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
