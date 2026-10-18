"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from 'lucide-react'

export function MapSection() {
    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                            Visit Us
                        </span>
                    </div>
                    <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
                        Our Location
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Come visit our office in Adirampattinam. We're always ready to discuss your dream project.
                    </p>
                </div>

                <Card className="overflow-hidden border-2 shadow-xl h-[400px] md:h-[500px] relative">
                    <iframe
                        src="https://maps.app.goo.gl/XCzKYVrhC8Aqwjqj7"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                </Card>
            </div>
        </section>
    )
}
