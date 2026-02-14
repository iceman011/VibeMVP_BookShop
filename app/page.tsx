import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Sparkles, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <BookOpen className="w-8 h-8 text-purple-600" />
            BookShop
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/books">
              <Button variant="ghost">Browse Books</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Welcome to your digital library
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Read Premium Books
            <br />
            Anytime, Anywhere
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Access our curated library of premium books. Track your progress, 
            read across devices, and enjoy a beautiful reading experience.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Reading Free
              </Button>
            </Link>
            <Link href="/books">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Browse Library
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Library</h3>
            <p className="text-gray-600">
              Access our carefully curated collection of premium books across all genres.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Never lose your place. We automatically save your reading progress.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Beautiful Reader</h3>
            <p className="text-gray-600">
              Enjoy a distraction-free reading experience with our elegant reader.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Reading?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of readers and get access to our premium library today.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 BookShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
