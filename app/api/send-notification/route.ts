import { createClient } from '@supabase/supabase-js'
// @ts-ignore
import webpush from 'web-push'
import { NextResponse } from 'next/server'

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: Request) {
    try {
        const { title, body, icon, url } = await request.json()

        // Create Admin Supabase Client to bypass RLS for fetching subscriptions
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback if service key missing, but RLS might block
        )

        // Fetch all subscriptions
        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select('*')

        if (error) {
            console.error('Error fetching subscriptions:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ message: 'No subscriptions found' })
        }

        const payload = JSON.stringify({
            title,
            body,
            icon,
            url
        })

        // Send notifications to all subscribers
        const results = await Promise.allSettled(
            subscriptions.map(async (sub) => {
                try {
                    // Parse the subscription stored as JSONB
                    const pushSubscription = typeof sub.subscription === 'string'
                        ? JSON.parse(sub.subscription)
                        : sub.subscription

                    await webpush.sendNotification(pushSubscription, payload)
                    return { success: true, id: sub.id }
                } catch (error: any) {
                    // If 410 Gone, remove subscription
                    if (error.statusCode === 410) {
                        await supabase.from('push_subscriptions').delete().eq('id', sub.id)
                    }
                    throw error
                }
            })
        )

        const successCount = results.filter(r => r.status === 'fulfilled').length

        return NextResponse.json({
            success: true,
            sent: successCount,
            total: subscriptions.length
        })

    } catch (error: any) {
        console.error('Error sending push:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
