"use client"

import { Card } from "@/components/ui/card"
import { Handshake } from 'lucide-react'

const PARTNERS = [
    { name: "Ramco Cements", logo: "Ramco" },
    { name: "UltraTech", logo: "UltraTech" },
    { name: "Asian Paints", logo: "Asian Paints" },
    { name: "Tata Steel", logo: "Tata Steel" },
    { name: "Saint-Gobain", logo: "Saint-Gobain" },
    { name: "Finolex", logo: "Finolex" },
]

export function TrustedPartners() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Handshake className="w-4 h-4 text-primary" />
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                            Our Network
                        </span>
                    </div>
                    <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
                        Trusted Partners
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We collaborate with industry leaders to ensure the highest quality materials for your project.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {PARTNERS.map((partner, index) => (
                        <Card key={index} className="p-6 flex items-center justify-center h-32 hover:border-primary/50 transition-all duration-300 group cursor-default">
                            <span className="font-bold text-xl text-muted-foreground group-hover:text-primary transition-colors dark:text-zinc-400 dark:group-hover:text-primary">
                                {partner.logo}
                            </span>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
