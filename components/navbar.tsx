'use client'

import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-white/5 bg-[#111110] px-4 lg:hidden shadow-lg print:hidden">
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/5 border border-white/10 text-white/70 hover:text-white active:scale-95 transition-all"
        aria-label="Toggle Menu"
      >
        <Menu size={20} />
      </button>

      <div className="ml-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[--color-accent-tecido]" />
        <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-white/90">
          JC PLUS SIZE
        </span>
      </div>
    </header>
  )
}
