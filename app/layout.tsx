import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/toast'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'JC Studio',
  description: 'Sistema de cadastro de peças piloto e cortes de tecido',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-sans antialiased text-[--color-text-primary] bg-[--color-bg-page]">
        <div className="flex min-h-screen">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="lg:ml-[240px] flex-1 w-full max-w-[1440px] px-4 py-8 sm:px-6 md:px-8 lg:px-10">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
