"use client"

import { useEffect, useState, type RefObject } from "react"

interface ScrollFadeOptions {
  threshold?: number
  fadeOutStart?: number
  fadeOutEnd?: number
}

export function useScrollFade(ref: RefObject<HTMLElement>, options: ScrollFadeOptions = {}) {
  const { threshold = 0.2, fadeOutStart = 0.3, fadeOutEnd = 0.7 } = options
  const [opacity, setOpacity] = useState(0)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold },
    )

    const handleScroll = () => {
      if (!element) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate fade in from bottom
      const fadeInProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.3)))

      // Calculate fade out when scrolling up
      const fadeOutProgress = Math.max(
        0,
        Math.min(1, (rect.bottom / windowHeight - fadeOutStart) / (fadeOutEnd - fadeOutStart)),
      )

      const newOpacity = Math.min(fadeInProgress, fadeOutProgress)
      setOpacity(newOpacity)
    }

    observer.observe(element)
    handleScroll() // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [ref, threshold, fadeOutStart, fadeOutEnd])

  return { opacity, isInView }
}
