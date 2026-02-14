import './globals.css'
import type { Metadata } from 'next'
import { Poppins, Crimson_Text } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson',
})

export const metadata: Metadata = {
  title: 'BookShop - Your Digital Library',
  description: 'Access premium books and start your reading journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${crimson.variable}`}>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  )
}
