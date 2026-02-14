import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId || session.client_reference_id

        if (!userId) {
          console.error('No userId in session')
          return NextResponse.json({ error: 'No userId' }, { status: 400 })
        }

        // Update user profile with subscription info
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .update({
            has_access: true,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId)
          .select()
          .single()

        if (profileError) {
          console.error('Error updating profile:', profileError)
          return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
        }

        // Send welcome email
        if (profile) {
          await sendWelcomeEmail(profile.email, profile.full_name || '')
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Revoke access
        await supabase
          .from('profiles')
          .update({ has_access: false })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const isActive = subscription.status === 'active'

        // Update access based on subscription status
        await supabase
          .from('profiles')
          .update({ has_access: isActive })
          .eq('stripe_subscription_id', subscription.id)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
