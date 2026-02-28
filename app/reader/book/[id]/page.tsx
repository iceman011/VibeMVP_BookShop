import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createServerSupabaseClient, getUser, getProfile } from '@/lib/supabase'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { ReaderClient } from './reader-client'

export default async function BookReaderPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { chapter?: string }
}) {
  const user = await getUser()
  const profile = await getProfile()
/*
  if (!user || !profile?.has_access) {
    redirect('/pricing')
  }
*/

  const supabase = await createServerSupabaseClient()

  // Get book
  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', params.id)
    .eq('published', true)
    .single()

  if (!book) {
    notFound()
  }

  // Get all chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', params.id)
    .order('chapter_number')

  if (!chapters || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No chapters available for this book yet.</p>
          <Link href="/reader">
            <Button>Back to Library</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get reading progress
  const { data: progress } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('book_id', params.id)
    .single()

  // Determine current chapter
  const chapterParam = searchParams.chapter
  let currentChapter = chapters[0]
  
  if (chapterParam) {
    const found = chapters.find((c) => c.id === chapterParam)
    if (found) currentChapter = found
  } else if (progress?.chapter_id) {
    const found = chapters.find((c) => c.id === progress.chapter_id)
    if (found) currentChapter = found
  }

  const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id)
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/reader">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            </Link>
            <div className="text-center flex-1 mx-8">
              <h1 className="font-semibold text-lg truncate">{book.title}</h1>
              <p className="text-sm text-gray-600">Chapter {currentChapter.chapter_number}: {currentChapter.title}</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="container mx-auto px-4 py-12">
        <article className="reader-content mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            {currentChapter.title}
          </h2>
          
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: currentChapter.content }}
          />
        </article>

        {/* Navigation */}
        <div className="max-w-[65ch] mx-auto mt-12 pt-8 border-t flex items-center justify-between">
          {prevChapter ? (
            <Link href={`/reader/book/${params.id}?chapter=${prevChapter.id}`}>
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Chapter
              </Button>
            </Link>
          ) : (
            <div></div>
          )}

          {nextChapter ? (
            <Link href={`/reader/book/${params.id}?chapter=${nextChapter.id}`}>
              <Button>
                Next Chapter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* Client-side progress tracker */}
      <ReaderClient
        bookId={params.id}
        chapterId={currentChapter.id}
        chapterNumber={currentChapter.chapter_number}
        totalChapters={chapters.length}
      />
    </div>
  )
}
