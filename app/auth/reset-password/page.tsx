import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { resetPassword } from '@/app/actions/auth'
import { BookOpen } from 'lucide-react'

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <BookOpen className="w-8 h-8 text-purple-600" />
            BookShop
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {searchParams.success && (
              <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700 text-sm">
                {searchParams.success}
              </div>
              )}
              {searchParams.error && (
                <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700 text-sm">
                  {searchParams.error}
                </div>
              )}
            <form action={resetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Remember your password?{' '}
              <Link href="/auth/signin" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
