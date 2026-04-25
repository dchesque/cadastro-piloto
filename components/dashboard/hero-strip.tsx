import Link from 'next/link'
import { Plus } from 'lucide-react'

interface Props {
  greeting: string
  userName: string
}

export function HeroStrip({ greeting, userName }: Props) {
  return (
    <div className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[24px] bg-[#111110] px-7 py-7 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse at 80% 50%, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 80% 50%, black 10%, transparent 70%)',
        }}
      />
      <div className="relative">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#52504C]">
          {greeting}, {userName}
        </p>
        <h1 className="text-[28px] sm:text-[32px] font-extralight leading-[1.1] tracking-[-1px] text-white">
          Aqui está o resumo
          <br />
          <span className="font-semibold">de hoje</span>
          <span className="text-[#059669]">.</span>
        </h1>
      </div>
      <div className="relative flex flex-wrap gap-2.5">
        <Link
          href="/pecas/nova"
          className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-white px-5 text-[13px] font-semibold text-[#1A1917] transition-opacity hover:opacity-90"
        >
          <Plus size={14} strokeWidth={2.5} />
          Nova Peça
        </Link>
        <Link
          href="/tecidos/novo"
          className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.08] px-5 text-[13px] font-semibold text-[#EBEAE6] transition-colors hover:bg-white/[0.14]"
        >
          <Plus size={14} strokeWidth={2.5} />
          Novo Tecido
        </Link>
      </div>
    </div>
  )
}
