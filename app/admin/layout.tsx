"use client"

import { useState, useEffect } from "react"
import { SidebarNav } from "@/components/admin/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check local storage for session (simple persistence)
        const auth = localStorage.getItem("admin_auth")
        if (auth === "true") {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (username === "NCB@2024" && password === "newcrescentbuilders#24") {
            setIsAuthenticated(true)
            localStorage.setItem("admin_auth", "true")
            toast.success("Logged in successfully")
        } else {
            toast.error("Invalid Credentials")
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem("admin_auth")
        setUsername("")
        setPassword("")
        toast.info("Logged out")
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            {/* Placeholder for logo - using text for now or existing global logo if available */}
                            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold">NCB</div>
                        </div>
                        <CardTitle className="text-2xl text-center font-bold">Admin Portal</CardTitle>
                        <p className="text-center text-muted-foreground text-sm">Enter your credentials to access the dashboard</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <Button type="submit" className="w-full h-11 text-base">
                                Login to Dashboard
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-zinc-950">
            <header className="bg-white dark:bg-zinc-900 border-b h-16 flex items-center px-6 sticky top-0 z-10 shadow-sm">
                <div className="font-bold text-xl flex items-center gap-2 text-primary">
                    <a href="/" className="hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white text-xs">NCB</div>
                    </a>
                    Admin Dashboard
                </div>
            </header>
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
                <aside className="lg:w-64 bg-white dark:bg-zinc-900 border-r p-6 lg:block hidden">
                    <div className="mb-6">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</h2>
                        <SidebarNav onLogout={handleLogout} />
                    </div>
                </aside>
                <main className="flex-1 p-6 lg:p-10 overflow-auto">
                    {/* Mobile Nav Placeholder could go here for better UX on small screens */}
                    <div className="lg:hidden mb-6">
                        <SidebarNav onLogout={handleLogout} />
                    </div>
                    {children}
                </main>
            </div>
        </div>
    )
}
