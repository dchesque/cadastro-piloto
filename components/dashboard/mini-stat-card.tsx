'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

interface Props {
  n: number | string
  label: string
  delta?: string
  color: string
  bg: string
  icon: React.ReactNode
  href?: string
}

export function MiniStatCard({ n, label, delta, color, bg, icon, href }: Props) {
  const [hov, setHov] = useState(false)
  const Wrapper: React.ElementType = href ? Link : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...wrapperProps}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="group relative block overflow-hidden rounded-[20px] border bg-white px-5 py-5 transition-all"
      style={{
        borderColor: hov ? `${color}40` : 'var(--color-border-light)',
        boxShadow: hov ? `0 6px 20px ${color}14` : '0 1px 3px rgba(26,25,23,0.06)',
        cursor: href ? 'pointer' : 'default',
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: bg, color }}
        >
          {icon}
        </div>
        <ArrowUpRight
          size={14}
          strokeWidth={2.5}
          style={{ color: hov ? color : '#DDDCD8' }}
          className="transition-colors"
        />
      </div>
      <div className="text-[32px] font-bold leading-none tracking-[-1px] text-[#1A1917]">{n}</div>
      <div className="mt-1 text-[11px] font-semibold tracking-[-0.1px] text-[#52504C]">{label}</div>
      {delta && (
        <div className="mt-1 text-[10px] font-semibold" style={{ color }}>
          {delta}
        </div>
      )}
    </Wrapper>
  )
}
