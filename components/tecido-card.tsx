'use client'

import Link from 'next/link'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { FMIconBtn } from '@/components/fm/icon-btn'
import { FMMonoTag } from '@/components/fm/mono-tag'
import { formatCurrency } from '@/lib/utils'

export interface TecidoCardData {
  id: string
  ref: string
  nome: string
  fornecedor?: string | null
  cor?: string | null
  composicao?: string | null
  metragem?: number | null
  largura?: number | null
  preco?: number | null
}

interface Props {
  tecido: TecidoCardData
  maxMetragem?: number
  onDelete?: (id: string) => void
}

const corSwatches: Record<string, string> = {
  Preto: '#1A1917',
  'Branco/Rosa': '#F9C8D0',
  Branco: '#F5F5F0',
  Bege: '#D4B896',
  Dourado: '#C9A84C',
  'Verde/Bege': '#A8C5A0',
  Verde: '#5C8C5A',
  'Off-White': '#F0EDE6',
  Vermelho: '#B23030',
  Rosa: '#E8AAB6',
  Azul: '#3A5A92',
  Marrom: '#7A553B',
  Cinza: '#9B9A95',
}

function swatchFor(cor?: string | null): string {
  if (!cor) return '#DDDCD8'
  const direct = corSwatches[cor]
  if (direct) return direct
  // Match parcial: "Azul Royal" → "Azul"
  for (const key of Object.keys(corSwatches)) {
    if (cor.toLowerCase().includes(key.toLowerCase())) return corSwatches[key]
  }
  return '#DDDCD8'
}

export function TecidoCard({ tecido, maxMetragem = 80, onDelete }: Props) {
  const [hov, setHov] = useState(false)
  const metragem = tecido.metragem ?? 0
  const pct = Math.min(100, Math.round((metragem / Math.max(1, maxMetragem)) * 100))
  const stockColor = pct > 50 ? '#059669' : pct > 25 ? '#D97706' : '#9B1C1C'
  const stockBg = pct > 50 ? '#EAF3DE' : pct > 25 ? '#FAEEDA' : '#FCEBEB'
  const stockLabel = pct > 50 ? 'Estoque ok' : pct > 25 ? 'Estoque baixo' : 'Crítico'
  const swatch = swatchFor(tecido.cor)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex flex-col overflow-hidden rounded-[22px] border bg-white transition-all"
      style={{
        borderColor: hov ? '#A7D7C0' : 'var(--color-border-light)',
        boxShadow: hov
          ? '0 8px 24px rgba(5,150,105,0.08)'
          : '0 1px 3px rgba(26,25,23,0.06)',
      }}
    >
      {/* Faixa de cor */}
      <div className="h-[7px]" style={{ background: swatch, opacity: 0.85 }} />

      <div className="flex flex-1 flex-col gap-2.5 px-4 py-3.5">
        <div className="flex items-start justify-between">
          <Link href={`/tecidos/${tecido.id}`}>
            <FMMonoTag>#{tecido.ref}</FMMonoTag>
          </Link>
          <div className="flex gap-1">
            <Link href={`/tecidos/${tecido.id}`}>
              <FMIconBtn variant="tecido" size={32} title="Ver">
                <Eye size={13} strokeWidth={2} />
              </FMIconBtn>
            </Link>
            <Link href={`/tecidos/${tecido.id}/editar`}>
              <FMIconBtn variant="tecido" size={32} title="Editar">
                <Pencil size={13} strokeWidth={2} />
              </FMIconBtn>
            </Link>
            {onDelete && (
              <FMIconBtn
                variant="danger"
                size={32}
                title="Excluir"
                onClick={() => onDelete(tecido.id)}
              >
                <Trash2 size={13} strokeWidth={2} />
              </FMIconBtn>
            )}
          </div>
        </div>

        <Link href={`/tecidos/${tecido.id}`} className="block">
          <div className="mb-1 flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-[3px]"
              style={{ background: swatch, border: '1px solid rgba(0,0,0,0.08)' }}
            />
            <span
              className="text-[11px] font-semibold transition-colors"
              style={{ color: hov ? '#059669' : '#52504C' }}
            >
              {tecido.cor ?? '—'}
            </span>
          </div>
          <h3 className="m-0 text-[15px] font-bold leading-[1.3] text-[--color-text-primary]">
            {tecido.nome}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1">
          {tecido.composicao && (
            <span className="rounded-[6px] bg-[--color-bg-subtle] px-2 py-[3px] text-[10px] font-semibold text-[--color-text-secondary]">
              {tecido.composicao}
            </span>
          )}
          {tecido.largura != null && (
            <span className="rounded-[6px] bg-[--color-bg-subtle] px-2 py-[3px] text-[10px] font-semibold text-[--color-text-secondary]">
              {tecido.largura}m larg.
            </span>
          )}
          {tecido.preco != null && (
            <span className="rounded-[6px] bg-[--color-bg-subtle] px-2 py-[3px] text-[10px] font-semibold text-[--color-text-secondary]">
              {formatCurrency(tecido.preco)}/m
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#85837D]">
              Estoque
            </span>
            <span className="text-[13px] font-bold" style={{ color: stockColor }}>
              {metragem}m
            </span>
          </div>
          <div className="h-[5px] overflow-hidden rounded-[3px] bg-[--color-bg-subtle]">
            <div
              className="h-full rounded-[3px] transition-all"
              style={{ width: `${pct}%`, background: stockColor }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span
              className="rounded-[4px] px-1.5 py-px text-[9px] font-semibold"
              style={{ color: stockColor, background: stockBg }}
            >
              {stockLabel}
            </span>
            <span className="text-[9px] font-medium text-[#85837D]">
              {tecido.fornecedor ?? '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
