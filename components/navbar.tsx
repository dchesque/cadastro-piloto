'use client'

import { Menu } from 'lucide-react'
import { FlowModaMark } from '@/components/flowmoda-wordmark'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-white/5 bg-[#111110] px-4 md:hidden shadow-lg print:hidden">
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/10 bg-white/5 text-white/70 transition-all hover:text-white active:scale-95"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      <div className="ml-3 flex items-center gap-2">
        <FlowModaMark size="sm" />
        <span
          className="text-[14px] tracking-[-0.2px]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <span className="font-light text-white">flow</span>
          <span className="font-bold text-white">moda</span>
          <span className="text-[#059669]">.</span>
        </span>
      </div>
    </header>
  )
}
