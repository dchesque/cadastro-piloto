import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AppShellServer } from '@/components/app-shell-server'
import { Toaster } from '@/components/ui/toast'

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

const jetMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'FlowModa · Gestão de Produção',
  description: 'O desenvolvimento da sua coleção — do croqui à produção — em um fluxo único.',
}

import { AuthProvider } from '@/components/auth-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased text-[--color-text-primary] bg-[--color-bg-page]">
        <AuthProvider>
          <AppShellServer>
            {children}
          </AppShellServer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
