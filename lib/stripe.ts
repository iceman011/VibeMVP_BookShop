import Stripe from 'stripe'
import { headers } from 'next/headers'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

async function getAppUrl() {
  // First try environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // Try to get from request headers
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const proto = headersList.get('x-forwarded-proto') || 'https'
    
    if (host) {
      return `${proto}://${host}`
    }
  } catch (e) {
    // Headers not available
  }
  
  // Fallback
  return 'http://localhost:3000'
}

export async function createCheckoutSession(userId: string, email: string) {
  const appUrl = await getAppUrl()
  
  console.log('Creating checkout session with appUrl:', appUrl) // For debugging
  
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/reader?success=true`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  })

  return session
}