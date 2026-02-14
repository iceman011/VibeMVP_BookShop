'use server'

import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/stripe'

export async function createCheckout() {
  const user = await getUser()
  const profile = await getProfile()

  if (!user || !profile) {
    redirect('/auth/signin')
  }

  if (profile.has_access) {
    redirect('/reader')
  }

  const session = await createCheckoutSession(user.id, profile.email)
  
  redirect(session.url!)
}
