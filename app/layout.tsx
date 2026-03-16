import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/app-shell'
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
  title: 'JC PLUS SIZE',
  description: 'Sistema de cadastro de peças piloto e cortes de tecido',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased text-[--color-text-primary] bg-[--color-bg-page]">
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  )
}
