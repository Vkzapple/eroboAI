// src/app/layout.tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lora, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'KIR EROBO AI — STEM Research Intelligence',
  description: 'Platform Web 4.0 berbasis Agentic AI untuk membantu anggota KIR menemukan tren dan gap penelitian STEM terkini.',
  keywords: ['KIR', 'penelitian', 'STEM', 'AI', 'siswa', 'Indonesia'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${lora.variable} ${jetbrains.variable}`}>
      <body className="bg-surface text-ink font-sans antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
