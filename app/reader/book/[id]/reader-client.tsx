'use client'

import { useEffect } from 'react'
import { updateReadingProgress } from '@/app/actions/reader'

export function ReaderClient({
  bookId,
  chapterId,
  chapterNumber,
  totalChapters,
}: {
  bookId: string
  chapterId: string
  chapterNumber: number
  totalChapters: number
}) {
  useEffect(() => {
    // Calculate progress percentage
    const progressPercentage = Math.round((chapterNumber / totalChapters) * 100)

    // Update progress after a short delay (user has started reading)
    const timer = setTimeout(() => {
      updateReadingProgress(bookId, chapterId, progressPercentage)
    }, 3000)

    return () => clearTimeout(timer)
  }, [bookId, chapterId, chapterNumber, totalChapters])

  return null
}
