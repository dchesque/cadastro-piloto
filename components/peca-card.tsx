'use client'

import Link from 'next/link'
import { Heart, Eye, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PecaAvatar } from '@/components/peca-avatar'
import { StatusPill, type PecaStatus } from '@/components/fm/status-pill'
import { FMIconBtn } from '@/components/fm/icon-btn'
import { FMMonoTag } from '@/components/fm/mono-tag'

export interface PecaCardData {
  id: string
  ref: string
  nome: string
  fornecedor?: string | null
  colecao?: string | null
  tamanhos?: string[]
  status?: PecaStatus
  fotoUrl?: string | null
}

interface Props {
  peca: PecaCardData
  onDelete?: (id: string) => void
}

export function PecaCard({ peca, onDelete }: Props) {
  const [hov, setHov] = useState(false)
  const status = peca.status ?? 'rascunho'

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex flex-col overflow-hidden rounded-[22px] border bg-white transition-all"
      style={{
        borderColor: hov ? '#B8C8F0' : 'var(--color-border-light)',
        boxShadow: hov
          ? '0 8px 24px rgba(29,78,216,0.07)'
          : '0 1px 3px rgba(26,25,23,0.06)',
      }}
    >
      <Link
        href={`/pecas/${peca.id}`}
        className="block"
        style={{
          background: hov ? '#EEF3FD' : '#F8F7F5',
          borderBottom: '1px solid #EBEAE6',
        }}
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          <PecaAvatar nome={peca.nome} colecao={peca.colecao} fotoUrl={peca.fotoUrl} />
        </div>
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <FMMonoTag>#{peca.ref}</FMMonoTag>
          <StatusPill status={status} />
        </div>
      </Link>

      <div className="px-3.5 pb-1 pt-0">
        <h3
          className="m-0 text-[14px] font-bold leading-[1.35] transition-colors"
          style={{ color: hov ? '#1D4ED8' : '#1A1917' }}
        >
          <Link href={`/pecas/${peca.id}`}>{peca.nome}</Link>
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 py-3.5">
        {peca.colecao && (
          <div className="flex items-center gap-1.5">
            <Heart size={12} strokeWidth={2} className="flex-shrink-0 text-[#85837D]" />
            <span className="text-[12px] font-medium text-[#52504C]">{peca.colecao}</span>
          </div>
        )}

        {peca.tamanhos && peca.tamanhos.length > 0 && (
          <div>
            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#85837D]">
              Grade
            </p>
            <div className="flex flex-wrap gap-1">
              {peca.tamanhos.map((t) => (
                <span
                  key={t}
                  className="rounded-[6px] bg-[--color-accent-peca-light] px-2 py-0.5 text-[10px] font-bold text-[--color-accent-peca]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-[#F2F1ED] pt-2.5">
          <div className="min-w-0">
            <p className="mb-px text-[9px] font-bold uppercase tracking-[0.1em] text-[#85837D]">
              Fornecedor
            </p>
            <p className="truncate text-[11px] font-semibold text-[#52504C]">
              {peca.fornecedor ?? '—'}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-1">
            <Link href={`/pecas/${peca.id}`}>
              <FMIconBtn variant="peca" size={32} title="Ver">
                <Eye size={13} strokeWidth={2} />
              </FMIconBtn>
            </Link>
            <Link href={`/pecas/${peca.id}/editar`}>
              <FMIconBtn variant="peca" size={32} title="Editar">
                <Pencil size={13} strokeWidth={2} />
              </FMIconBtn>
            </Link>
            {onDelete && (
              <FMIconBtn
                variant="danger"
                size={32}
                title="Excluir"
                onClick={() => onDelete(peca.id)}
              >
                <Trash2 size={13} strokeWidth={2} />
              </FMIconBtn>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
