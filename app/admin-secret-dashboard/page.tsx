"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Trash2, LogOut, Loader2, Bell } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateQuotationPDF } from "@/lib/pdf-generator"
import { Download, Eye } from "lucide-react"

export default function AdminDashboard() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [leads, setLeads] = useState<any[]>([])
    const [selectedLead, setSelectedLead] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
    const supabase = createClientComponentClient()

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            fetchLeads()
            subscribeToLeads()
        }
    }, [isAuthenticated])

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            toast.error("This browser does not support desktop notifications")
            return
        }

        const p = await Notification.requestPermission()
        setPermission(p)

        if (p === 'granted') {
            // 1. Register Service Worker
            await registerServiceWorker()
            // 2. Subscribe to Push
            await subscribeUserToPush()

            toast.success("Notifications enabled!")
            new Notification("Notifications Enabled", {
                body: "You will now receive system-level updates for new leads.",
            })
        }
    }

    const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js')
                console.log('Service Worker registered with scope:', registration.scope)
                return registration
            } catch (error) {
                console.error('Service Worker registration failed:', error)
            }
        }
    }

    const subscribeUserToPush = async () => {
        const registration = await navigator.serviceWorker.ready
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

        if (!publicKey) {
            console.error('VAPID Public Key not found')
            return
        }

        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            })

            // Save subscription to database
            const { error } = await supabase
                .from('push_subscriptions')
                .insert([{ subscription: subscription }])

            if (error) console.error('Error saving subscription:', error)
            else console.log('Push Subscription saved!')

        } catch (error) {
            console.error('Failed to subscribe to push:', error)
        }
    }

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/')

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    const subscribeToLeads = () => {
        const channel = supabase
            .channel('leads_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'leads' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setLeads(prev => [payload.new, ...prev])

                        // Sonner Toast
                        toast.success("New Lead Received!", {
                            description: `${payload.new.name} - ${payload.new.phone}`,
                            duration: 10000,
                            action: {
                                label: "View",
                                onClick: () => {
                                    setSelectedLead(payload.new)
                                    setIsDialogOpen(true)
                                }
                            }
                        })

                        // Browser Notification
                        if (Notification.permission === 'granted') {
                            const n = new Notification("New Lead Received!", {
                                body: `${payload.new.name} has submitted a request.`,
                                icon: '/new-crescent-logo.png' // Make sure this path is valid, otherwise it might just default
                            })
                            n.onclick = () => {
                                window.focus()
                                setSelectedLead(payload.new)
                                setIsDialogOpen(true)
                            }
                        }

                    } else if (payload.eventType === 'DELETE') {
                        setLeads(prev => prev.filter(lead => lead.id !== payload.old.id))
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setConnectionStatus('connected')
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                    setConnectionStatus('error')
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }

    const fetchLeads = async () => {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Error fetching leads:', error)
            toast.error("Failed to fetch leads", {
                description: error.message,
            })
        } else {
            setLeads(data || [])
        }
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (username === "NCB@2024" && password === "newcrescentbuilders#24") {
            setIsAuthenticated(true)
            toast.success("Logged in successfully")
        } else {
            toast.error("Invalid Credentials")
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setUsername("")
        setPassword("")
        setLeads([])
    }

    const openDetails = (lead: any) => {
        setSelectedLead(lead)
        setIsDialogOpen(true)
    }

    const handleDownload = (lead: any) => {
        if (lead.details) {
            generateQuotationPDF(lead.details, lead.details.costBreakdown || {}, lead.details.totalCost || 0)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this lead?")) return

        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error("Failed to delete", { description: error.message })
        } else {
            toast.success("Lead deleted")
            setLeads(prev => prev.filter(lead => lead.id !== id))
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
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
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Lead Management</h1>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${connectionStatus === 'connected'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : connectionStatus === 'error'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                                }`} />
                            {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'error' ? 'Offline' : 'Connecting...'}
                        </div>
                        {permission === 'default' && (
                            <Button variant="outline" onClick={requestNotificationPermission}>
                                <Bell className="mr-2 h-4 w-4" />
                                Enable Notifications
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => window.location.href = "/"}>
                            Back to Webpage
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                toast.success("Test Notification", {
                                    description: "This is a test to verify your notification settings.",
                                    duration: 5000,
                                })
                                if (Notification.permission === 'granted') {
                                    new Notification("Test Notification", {
                                        body: "This is a test of the browser notification system.",
                                        icon: '/new-crescent-logo.png'
                                    })
                                } else {
                                    toast.error("Browser notifications are not allowed", {
                                        description: "Please click 'Enable Notifications' if you want them."
                                    })
                                }
                            }}
                        >
                            Test Notification
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Leads ({leads.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Project Type</TableHead>
                                        <TableHead>Total Cost</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leads.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                No leads found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        leads.map((lead) => (
                                            <TableRow key={lead.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(lead.created_at).toLocaleDateString()}
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(lead.created_at).toLocaleTimeString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{lead.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm">{lead.email}</span>
                                                        <span className="text-xs text-muted-foreground">{lead.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="capitalize">
                                                        {lead.details?.projectType?.replace(/_/g, ' ') || 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-primary">
                                                        {lead.details?.totalCost
                                                            ? `₹${Number(lead.details.totalCost).toLocaleString()}`
                                                            : 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px] text-sm truncate" title={JSON.stringify(lead.details, null, 2)}>
                                                        {lead.details ? (
                                                            <div className="grid grid-cols-1 gap-1 text-xs">
                                                                {Object.entries(lead.details)
                                                                    .filter(([k]) => !['projectType', 'totalCost', 'name', 'email', 'phone'].includes(k))
                                                                    .slice(0, 3)
                                                                    .map(([k, v]) => (
                                                                        <div key={k}><span className="font-semibold">{k}:</span> {String(v)}</div>
                                                                    ))}
                                                            </div>
                                                        ) : 'No details'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDetails(lead)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDownload(lead)}
                                                            title="Download PDF"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                            onClick={() => handleDelete(lead.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>Lead Details</DialogTitle>
                            <DialogDescription>
                                Full information submitted by {selectedLead?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] pr-4">
                            {selectedLead && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Contact Info</h4>
                                            <div className="space-y-1">
                                                <p><span className="font-medium">Name:</span> {selectedLead.name}</p>
                                                <p><span className="font-medium">Email:</span> {selectedLead.email}</p>
                                                <p><span className="font-medium">Phone:</span> {selectedLead.phone}</p>
                                                <p><span className="font-medium">Date:</span> {new Date(selectedLead.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Project Overview</h4>
                                            <div className="space-y-1">
                                                <p><span className="font-medium">Type:</span> {selectedLead.details?.projectType}</p>
                                                <p><span className="font-medium">Total Cost:</span> ₹{selectedLead.details?.totalCost?.toLocaleString()}</p>
                                                <p><span className="font-medium">Built-up Area:</span> {selectedLead.details?.builtUpArea} sq.ft</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-3">Technical Details</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                            {Object.entries(selectedLead.details || {})
                                                .filter(([key]) => !['name', 'email', 'phone', 'projectType', 'totalCost', 'costBreakdown', 'floorAreas'].includes(key))
                                                .map(([key, value]) => (
                                                    <div key={key} className="bg-muted/50 p-2 rounded">
                                                        <span className="font-medium capitalize block text-xs text-muted-foreground">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {selectedLead.details?.floorAreas && Object.keys(selectedLead.details.floorAreas).length > 0 && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Floor Areas</h4>
                                            <div className="flex gap-4">
                                                {Object.entries(selectedLead.details.floorAreas).map(([floor, area]) => (
                                                    <div key={floor} className="bg-muted/50 p-2 rounded">
                                                        <span className="font-medium block text-xs text-muted-foreground">Floor {floor}</span>
                                                        <span className="font-semibold">{String(area)} sq.ft</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedLead.details?.costBreakdown && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Cost Breakdown</h4>
                                            <div className="space-y-2">
                                                {Object.entries(selectedLead.details.costBreakdown).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-sm border-b border-border/50 pb-1 last:border-0">
                                                        <span className="capitalize">{key.replace(/Cost$/, '').replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        <span className="font-mono">₹{Number(value).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
