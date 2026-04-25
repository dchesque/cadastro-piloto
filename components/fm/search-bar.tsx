'use client'

import { Search } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  accent?: 'peca' | 'tecido' | 'neutral'
  className?: string
}

const accentStyles = {
  peca: 'focus:border-[--color-accent-peca] focus:shadow-[0_0_0_4px_rgba(29,78,216,0.08)]',
  tecido: 'focus:border-[--color-accent-tecido] focus:shadow-[0_0_0_4px_rgba(5,150,105,0.08)]',
  neutral: 'focus:border-[--color-text-primary] focus:shadow-[0_0_0_4px_rgba(26,25,23,0.08)]',
}

export function FMSearchBar({ value, onChange, placeholder, accent = 'neutral', className }: Props) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] pointer-events-none"
        strokeWidth={1.8}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 w-full rounded-[16px] border border-[--color-border-light] bg-white pl-12 pr-4 text-[15px] text-[--color-text-primary] outline-none shadow-[0_1px_3px_rgba(26,25,23,0.06)] transition-all placeholder:text-[--color-text-tertiary] ${accentStyles[accent]}`}
      />
    </div>
  )
}
