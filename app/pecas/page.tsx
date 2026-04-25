'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Eye, Pencil, Trash2, LayoutGrid, List, Shirt } from 'lucide-react'
import { showToast } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FMPageHeader } from '@/components/fm/page-header'
import { FMSearchBar } from '@/components/fm/search-bar'
import { FMBtn } from '@/components/fm/btn'
import { FMEmptyState } from '@/components/fm/empty-state'
import { FMIconBtn } from '@/components/fm/icon-btn'
import { FMMonoTag } from '@/components/fm/mono-tag'
import { PecaCard, type PecaCardData } from '@/components/peca-card'
import { StatusPill, type PecaStatus } from '@/components/fm/status-pill'
import { cn } from '@/lib/utils'

interface PecaPiloto {
  id: string
  referencia: string
  nome: string
  colecao: string | null
  modelista: string | null
  fornecedor: string | null
  tecido: string | null
  composicao: string | null
  precoTecido: number | null
  tamanhos: string | null
  fotoFrente: string | null
  observacoes: string | null
  createdAt: string
}

function parseTamanhos(t: string | null | undefined): string[] {
  if (!t) return []
  return t
    .split(/[,/]/)
    .map((x) => x.trim())
    .filter(Boolean)
}

function deriveStatus(p: PecaPiloto): PecaStatus {
  // Heurística simples — sem campo dedicado no schema.
  if (p.fotoFrente && p.fornecedor && p.tecido) return 'aprovada'
  if (p.nome && p.fornecedor) return 'revisao'
  return 'rascunho'
}

function toCardData(p: PecaPiloto): PecaCardData {
  return {
    id: p.id,
    ref: p.referencia,
    nome: p.nome ?? p.referencia,
    fornecedor: p.fornecedor,
    colecao: p.colecao,
    tamanhos: parseTamanhos(p.tamanhos),
    status: deriveStatus(p),
    fotoUrl: p.fotoFrente,
  }
}

export default function PecasPage() {
  const [pecas, setPecas] = useState<PecaPiloto[]>([])
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pecaToDelete, setPecaToDelete] = useState<{ id: string; nome: string } | null>(null)
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    const ac = new AbortController()
    fetchPecas(ac.signal)
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const fetchPecas = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const url = search ? `/api/pecas?search=${encodeURIComponent(search)}` : '/api/pecas'
      const r = await fetch(url, { signal })
      const result = await r.json()
      setPecas(result.data || [])
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      showToast({
        title: 'Erro',
        description: 'Não foi possível carregar as peças.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!pecaToDelete) return
    try {
      const r = await fetch(`/api/pecas/${pecaToDelete.id}`, { method: 'DELETE' })
      if (r.ok) {
        setPecas((prev) => prev.filter((p) => p.id !== pecaToDelete.id))
        closeDeleteDialog()
        showToast({ title: 'Excluído', description: 'Peça removida com sucesso.' })
      }
    } catch {
      showToast({
        title: 'Erro',
        description: 'Falha ao excluir.',
        variant: 'destructive',
      })
    }
  }

  const askDelete = (id: string) => {
    const p = pecas.find((x) => x.id === id)
    if (!p) return
    setPecaToDelete({ id: p.id, nome: p.nome ?? p.referencia })
    setDeleteStep(1)
    setDeleteConfirmText('')
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setPecaToDelete(null)
    setDeleteStep(1)
    setDeleteConfirmText('')
  }

  return (
    <div className="mx-auto max-w-[1100px] animate-in fade-in duration-500">
      <FMPageHeader
        title="Peças Piloto"
        subtitle="Gerenciamento e controle de modelos e protótipos"
      >
        <div className="flex items-center rounded-[10px] border border-[--color-border-light] bg-[--color-bg-subtle] p-[3px]">
          {(
            [
              ['grid', LayoutGrid],
              ['list', List],
            ] as const
          ).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'flex h-[34px] w-[34px] items-center justify-center rounded-[8px] transition-all',
                view === v
                  ? 'bg-white text-[--color-text-primary] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[--color-text-tertiary] hover:text-[--color-text-secondary]',
              )}
              aria-label={v === 'grid' ? 'Grade' : 'Lista'}
            >
              <Icon size={14} strokeWidth={2} />
            </button>
          ))}
        </div>
        <Link href="/pecas/nova">
          <FMBtn variant="primary">
            <Plus size={14} strokeWidth={2.5} />
            Nova Peça
          </FMBtn>
        </Link>
      </FMPageHeader>

      <div className="mb-6">
        <FMSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, referência, coleção..."
          accent="peca"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[340px] animate-pulse rounded-[22px] border border-[--color-border-light] bg-white"
            />
          ))}
        </div>
      ) : pecas.length === 0 ? (
        <FMEmptyState
          icon={<Shirt size={32} strokeWidth={1.2} />}
          title={search ? 'Nenhuma peça encontrada' : 'Nenhuma peça cadastrada'}
          subtitle={
            search
              ? 'Tente ajustar os termos da sua busca.'
              : 'Comece adicionando sua primeira peça piloto.'
          }
          action={
            !search ? (
              <Link href="/pecas/nova">
                <FMBtn variant="primary" size="sm">
                  <Plus size={14} />
                  Adicionar Peça
                </FMBtn>
              </Link>
            ) : null
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pecas.map((p) => (
            <PecaCard key={p.id} peca={toCardData(p)} onDelete={askDelete} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-[--color-border-light] bg-white shadow-[0_1px_3px_rgba(26,25,23,0.06)]">
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 border-b border-[--color-border-light] bg-[#F8F7F5] px-5 py-2.5">
            {['Peça', 'Coleção', 'Status', ''].map((h) => (
              <span
                key={h}
                className="text-[9px] font-bold uppercase tracking-[0.12em] text-[--color-text-tertiary]"
              >
                {h}
              </span>
            ))}
          </div>
          {pecas.map((p, i) => {
            const status = deriveStatus(p)
            return (
              <div
                key={p.id}
                className={cn(
                  'grid grid-cols-[2fr_1fr_1fr_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-[#F8F7F5]',
                  i < pecas.length - 1 && 'border-b border-[#F2F1ED]',
                )}
              >
                <Link href={`/pecas/${p.id}`} className="min-w-0">
                  <FMMonoTag>#{p.referencia}</FMMonoTag>
                  <p className="m-0 mt-1 truncate text-[13px] font-semibold text-[--color-text-primary]">
                    {p.nome ?? p.referencia}
                  </p>
                </Link>
                <span className="truncate text-[12px] font-medium text-[--color-text-secondary]">
                  {p.colecao ?? '—'}
                </span>
                <StatusPill status={status} />
                <div className="flex gap-1">
                  <Link href={`/pecas/${p.id}`}>
                    <FMIconBtn variant="peca" size={36} title="Ver">
                      <Eye size={13} strokeWidth={2} />
                    </FMIconBtn>
                  </Link>
                  <Link href={`/pecas/${p.id}/ficha`}>
                    <FMIconBtn variant="peca" size={36} title="Editar">
                      <Pencil size={13} strokeWidth={2} />
                    </FMIconBtn>
                  </Link>
                  <FMIconBtn
                    variant="danger"
                    size={36}
                    title="Excluir"
                    onClick={() => askDelete(p.id)}
                  >
                    <Trash2 size={13} strokeWidth={2} />
                  </FMIconBtn>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog()
        }}
      >
        <DialogContent className="sm:max-w-md">
          {deleteStep === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[--color-text-primary]">
                  <Trash2 size={18} className="text-red-500" />
                  Excluir peça piloto?
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-3 pt-1">
                    <p className="text-sm text-[--color-text-secondary]">
                      Você está prestes a excluir permanentemente:
                    </p>
                    <div className="rounded-xl border border-[--color-border-light] bg-[--color-bg-subtle] px-4 py-3">
                      <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-[--color-text-tertiary]">
                        Peça Piloto
                      </p>
                      <p className="text-[15px] font-bold leading-tight text-[--color-text-primary]">
                        {pecaToDelete?.nome}
                      </p>
                    </div>
                    <p className="text-xs text-[--color-text-tertiary]">
                      Todos os dados vinculados serão removidos. Essa ação não pode ser desfeita.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-2 gap-2 sm:gap-0">
                <Button variant="outline" onClick={closeDeleteDialog} className="flex-1 rounded-xl">
                  Cancelar
                </Button>
                <Button
                  onClick={() => setDeleteStep(2)}
                  className="flex-1 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                >
                  Continuar →
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 size={18} />
                  Confirmação final
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-3 pt-1">
                    <p className="text-sm text-[--color-text-secondary]">
                      Para confirmar, digite o nome da peça exatamente como aparece abaixo:
                    </p>
                    <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                      <p className="select-all text-[13px] font-black tracking-tight text-red-700">
                        {pecaToDelete?.nome}
                      </p>
                    </div>
                    <input
                      autoFocus
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' &&
                          deleteConfirmText.trim().toLowerCase() ===
                            pecaToDelete?.nome.trim().toLowerCase()
                        ) {
                          handleDelete()
                        }
                      }}
                      placeholder="Digite o nome da peça..."
                      className="h-11 w-full rounded-xl border border-[--color-border-medium] bg-white px-4 text-[14px] text-[--color-text-primary] outline-none placeholder:text-[--color-text-tertiary] focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-2 gap-2 sm:gap-0">
                <Button variant="outline" onClick={closeDeleteDialog} className="flex-1 rounded-xl">
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={
                    deleteConfirmText.trim().toLowerCase() !==
                    pecaToDelete?.nome.trim().toLowerCase()
                  }
                  className="flex-1 rounded-xl"
                >
                  Excluir definitivamente
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
