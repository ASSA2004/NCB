"use client"

import { useEffect } from "react"


export function VisitorTracker() {
    useEffect(() => {
        const trackVisitor = async () => {
            try {
                // Simple fingerprinting using local storage to avoid duplicate session counts
                const lastVisit = localStorage.getItem("ncb_last_visit")
                const now = Date.now()

                // Only track if last visit was more than 1 hour ago
                if (lastVisit && now - parseInt(lastVisit) < 3600000) {
                    return
                }

                const visitors = JSON.parse(localStorage.getItem('ncb_visitors') || '[]')
                visitors.unshift({
                    id: crypto.randomUUID(),
                    page_path: window.location.pathname,
                    user_agent: window.navigator.userAgent,
                    referrer: document.referrer || null,
                    created_at: new Date().toISOString()
                })

                // Keep only last 100 visitors
                if (visitors.length > 100) visitors.pop()

                localStorage.setItem('ncb_visitors', JSON.stringify(visitors))
                localStorage.setItem("ncb_last_visit", now.toString())

            } catch (error) {
                console.error("Error tracking visitor:", error)
            }
        }

        trackVisitor()
    }, [])

    return null
}
