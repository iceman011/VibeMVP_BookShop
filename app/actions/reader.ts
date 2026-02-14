'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient, getUser } from '@/lib/supabase'

export async function updateReadingProgress(
  bookId: string,
  chapterId: string,
  progressPercentage: number
) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: user.id,
      book_id: bookId,
      chapter_id: chapterId,
      progress_percentage: progressPercentage,
      last_read_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/reader')
}

export async function getBookProgress(bookId: string) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single()

  return data
}
