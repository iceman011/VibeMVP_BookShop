'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function signUp(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/auth/signin')
  redirect('/auth/signin?message=Check your email to confirm your account')
}

export async function signIn(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/reader')
  redirect('/reader')
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  
  revalidatePath('/')
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
  })

  if (error) {
    redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/reset-password?success=Check your email for the password reset link')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    redirect(`/auth/update-password?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/reader')
  redirect('/reader')
}
