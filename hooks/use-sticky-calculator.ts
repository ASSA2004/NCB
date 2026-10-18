"use client"

import { useEffect, useState, type RefObject } from "react"

interface UseStickyCalculatorProps {
  containerRef: RefObject<HTMLElement>
  offsetTop?: number
  offsetBottom?: number
}

export function useStickyCalculator({ containerRef, offsetTop = 112, offsetBottom = 32 }: UseStickyCalculatorProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [position, setPosition] = useState<"static" | "fixed" | "absolute">("static")
  const [top, setTop] = useState(offsetTop)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top + window.scrollY
      const containerBottom = containerTop + container.offsetHeight
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Check if we're within the container bounds
      const startSticky = containerTop - offsetTop
      const endSticky = containerBottom - windowHeight + offsetBottom

      if (scrollY < startSticky) {
        // Before reaching the sticky zone
        setPosition("static")
        setIsSticky(false)
      } else if (scrollY >= startSticky && scrollY < endSticky) {
        // In the sticky zone - float with scroll
        setPosition("fixed")
        setTop(offsetTop)
        setIsSticky(true)
      } else {
        // Past the container - anchor to bottom
        setPosition("absolute")
        setIsSticky(false)
      }
    }

    handleScroll() // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [containerRef, offsetTop, offsetBottom])

  return { isSticky, position, top }
}
