import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createServerSupabaseClient, getUser, getProfile } from '@/lib/supabase'
import { signOut } from '@/app/actions/auth'
import { BookOpen, LogOut, Clock } from 'lucide-react'

export default async function ReaderPage() {
  const user = await getUser()
  const profile = await getProfile()

  if (!user) {
    redirect('/auth/signin')
  }

  if (!profile?.has_access) {
    redirect('/pricing')
  }

  const supabase = await createServerSupabaseClient()

  // Get all published books
  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  // Get user's reading progress
  const { data: progress } = await supabase
    .from('reading_progress')
    .select('*, books(*)')
    .eq('user_id', user.id)
    .order('last_read_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/reader" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <BookOpen className="w-8 h-8 text-purple-600" />
            BookShop
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile.full_name || profile.email}
            </span>
            <form action={signOut}>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.full_name || 'Reader'}!</h1>
            <p className="text-gray-600">Continue your reading journey</p>
          </div>

          {/* Continue Reading Section */}
          {progress && progress.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Continue Reading</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progress.slice(0, 3).map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-purple-400" />
                      </div>
                      <CardTitle>{item.books?.title}</CardTitle>
                      <CardDescription>by {item.books?.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{item.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${item.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                      <Link href={`/reader/book/${item.book_id}`}>
                        <Button className="w-full">Continue Reading</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* All Books Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Library</h2>
            {books && books.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-purple-400" />
                      </div>
                      <CardTitle>{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {book.description}
                      </p>
                      <Link href={`/reader/book/${book.id}`}>
                        <Button className="w-full" variant="outline">
                          Start Reading
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No books available yet. Check back soon!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
