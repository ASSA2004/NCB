"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Trash2, Bell, Eye, Download, Wifi, WifiOff } from 'lucide-react'
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

export default function LeadManagementPage() {
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
        fetchLeads()
        const subscription = subscribeToLeads()
        return () => {
            subscription()
        }
    }, [])


    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            toast.error("This browser does not support desktop notifications")
            return
        }

        const p = await Notification.requestPermission()
        setPermission(p)

        if (p === 'granted') {
            await registerServiceWorker()
            await subscribeUserToPush()
            toast.success("Notifications enabled!")
        }
    }

    const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js')
                console.log('Service Worker registered with scope:', registration.scope)
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

            const { error } = await supabase
                .from('push_subscriptions')
                .insert([{ subscription: subscription }])

            if (error) console.error('Error saving subscription:', error)

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
                        toast.success("New Lead Received!", {
                            description: `${payload.new.name} - ${payload.new.phone}`,
                            action: {
                                label: "View",
                                onClick: () => {
                                    setSelectedLead(payload.new)
                                    setIsDialogOpen(true)
                                }
                            }
                        })
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
            toast.error("Failed to fetch leads")
        } else {
            setLeads(data || [])
        }
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
        const { error } = await supabase.from('leads').delete().eq('id', id)
        if (error) toast.error("Failed to delete")
        else {
            toast.success("Lead deleted")
            setLeads(prev => prev.filter(lead => lead.id !== id))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${connectionStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {connectionStatus === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {connectionStatus === 'connected' ? 'Live' : 'Offline'}
                    </div>
                    {permission === 'default' && (
                        <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                            <Bell className="mr-2 h-4 w-4" /> Enable Notifications
                        </Button>
                    )}
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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
                                            <TableCell className="capitalize">{lead.details?.projectType?.replace(/_/g, ' ') || 'N/A'}</TableCell>
                                            <TableCell className="font-bold">
                                                {lead.details?.totalCost ? `₹${Number(lead.details.totalCost).toLocaleString()}` : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openDetails(lead)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDownload(lead)}>
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(lead.id)}>
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
                        <DialogDescription>Full information submitted by {selectedLead?.name}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        {selectedLead && (
                            <div className="space-y-6">
                                {/* Formatted Details view (simplified for brevity, matching original) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Info</h4>
                                        <p className="text-sm">Email: {selectedLead.email}</p>
                                        <p className="text-sm">Phone: {selectedLead.phone}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Specs</h4>
                                        <p className="text-sm">Type: {selectedLead.details?.projectType}</p>
                                        <p className="text-sm">Area: {selectedLead.details?.builtUpArea}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-sm mb-2">Full JSON Data</h4>
                                    <pre className="bg-muted p-4 rounded text-xs overflow-auto">
                                        {JSON.stringify(selectedLead.details, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
