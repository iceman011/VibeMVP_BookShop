import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Check } from 'lucide-react'
import { getUser, getProfile } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { createCheckout } from '@/app/actions/stripe'

export default async function PricingPage() {
  const user = await getUser()
  const profile = user ? await getProfile() : null

  if (profile?.has_access) {
    redirect('/reader')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
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
            {user ? (
              <Link href="/reader">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            One plan, unlimited access to our entire library
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-2 border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Premium Access</CardTitle>
              <CardDescription>
                <div className="text-4xl font-bold text-purple-600 my-4">
                  $9.99<span className="text-lg text-gray-500">/month</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Access to entire book library</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Read on any device</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Automatic progress tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>New books added regularly</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Cancel anytime</span>
                </li>
              </ul>

              {user ? (
                <form action={createCheckout}>
                  <Button type="submit" className="w-full" size="lg">
                    Subscribe Now
                  </Button>
                </form>
              ) : (
                <Link href="/auth/signup">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
