import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { LoadingScreen } from "@/components/loading-screen"
import { VisitorTracker } from "@/components/visitor-tracker"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "New Crescent Builders - Quality Construction in Adirai",
  description:
    "Professional construction, architectural design, and interior elevation services in Adirai. Building dreams with quality craftsmanship.",
  generator: "v0.app",
  icons: {
    icon: "/logo-icon-dark.png",
    shortcut: "/logo-icon-dark.png",
    apple: "/logo-icon-dark.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${poppins.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <LoadingScreen />
              <VisitorTracker />
              {children}
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
