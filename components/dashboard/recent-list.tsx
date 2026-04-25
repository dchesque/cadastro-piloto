import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface RecentItem {
  href: string
  ref: string
  title: string
  meta: string
}

interface Props {
  title: string
  items: RecentItem[]
  accentColor: string
  accentBg: string
  icon: React.ReactNode
  viewAllHref: string
  emptyLabel?: string
}

export function RecentList({
  title,
  items,
  accentColor,
  accentBg,
  icon,
  viewAllHref,
  emptyLabel = 'Nenhum item ainda',
}: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-[--color-border-light] bg-white shadow-[0_1px_3px_rgba(26,25,23,0.06)]">
      <div className="flex items-center justify-between border-b border-[#EBEAE6] px-5 py-3.5">
        <h3 className="m-0 flex items-center gap-2 text-[13px] font-bold text-[--color-text-primary]">
          <span style={{ color: accentColor }}>{icon}</span>
          {title}
        </h3>
        <Link
          href={viewAllHref}
          className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-opacity hover:opacity-80"
          style={{ color: accentColor, background: accentBg }}
        >
          Ver tudo
        </Link>
      </div>
      <div className="flex-1">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center text-[13px] text-[--color-text-tertiary]">
            {emptyLabel}
          </div>
        ) : (
          items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3.5 border-b border-[#F2F1ED] px-5 py-3.5 transition-colors last:border-0 hover:bg-[#F8F7F5]"
            >
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] font-mono text-[10px] font-bold"
                style={{ background: accentBg, color: accentColor }}
              >
                {item.ref.slice(-3)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[13px] font-semibold text-[--color-text-primary]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[--color-text-tertiary]">
                  {item.meta}
                </p>
              </div>
              <ArrowRight size={13} strokeWidth={2.5} className="flex-shrink-0 text-[#C0BEB8]" />
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
