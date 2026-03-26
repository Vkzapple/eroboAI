// src/components/layout/Navbar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/research', label: 'Research Today' },
  { href: '/gaps', label: 'Gap Finder' },
  { href: '/about', label: 'Tentang' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-ink text-white text-center py-2 text-xs font-mono tracking-wide">
        <span className="text-[#7AE5B0] mr-1">● Agen Aktif</span>
        — Diperbarui setiap hari · 4 Sumber Data · arXiv · ScienceDaily · Nature · IEEE
      </div>

      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mr-10 shrink-0 group">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center text-[#7AE5B0] font-mono text-xs font-medium group-hover:bg-accent transition-colors">
              EAI
            </div>
            <span className="font-extrabold text-base tracking-tight text-ink">
              <span className="text-accent">EROBO</span> AI
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex flex-1">
            {LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'flex items-center px-4 h-14 text-[13px] font-semibold border-b-2 -mb-px transition-colors',
                    active
                      ? 'text-accent border-accent'
                      : 'text-ink-2 border-transparent hover:text-ink',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-1.5 bg-accent-light border border-accent-border rounded-full px-3 py-1.5 text-[11px] font-mono font-semibold text-accent ml-auto shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
            Live · 4 sumber
          </div>
        </div>
      </nav>
    </>
  )
}
