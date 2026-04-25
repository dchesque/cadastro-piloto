'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Scissors } from 'lucide-react'
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
import { TecidoCard, type TecidoCardData } from '@/components/tecido-card'

interface CorteTecido {
  id: string
  referencia: string
  nome: string | null
  fornecedor: string | null
  composicao: string | null
  metragem: number | null
  largura: number | null
  preco: number | null
  cor: string | null
  refCor: string | null
  observacoes: string | null
  createdAt: string
}

function toCardData(t: CorteTecido): TecidoCardData {
  return {
    id: t.id,
    ref: t.referencia,
    nome: t.nome ?? t.referencia,
    fornecedor: t.fornecedor,
    cor: t.cor,
    composicao: t.composicao,
    metragem: t.metragem,
    largura: t.largura,
    preco: t.preco,
  }
}

export default function TecidosPage() {
  const [tecidos, setTecidos] = useState<CorteTecido[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tecidoToDelete, setTecidoToDelete] = useState<{ id: string; nome: string } | null>(null)
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    const ac = new AbortController()
    fetchTecidos(ac.signal)
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const fetchTecidos = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const url = search ? `/api/tecidos?search=${encodeURIComponent(search)}` : '/api/tecidos'
      const r = await fetch(url, { signal })
      const result = await r.json()
      setTecidos(result.data || [])
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      showToast({
        title: 'Erro',
        description: 'Não foi possível carregar os tecidos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!tecidoToDelete) return
    try {
      const r = await fetch(`/api/tecidos/${tecidoToDelete.id}`, { method: 'DELETE' })
      if (r.ok) {
        setTecidos((prev) => prev.filter((t) => t.id !== tecidoToDelete.id))
        closeDeleteDialog()
        showToast({ title: 'Excluído', description: 'Tecido removido com sucesso.' })
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
    const t = tecidos.find((x) => x.id === id)
    if (!t) return
    setTecidoToDelete({ id: t.id, nome: t.nome ?? t.referencia })
    setDeleteStep(1)
    setDeleteConfirmText('')
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setTecidoToDelete(null)
    setDeleteStep(1)
    setDeleteConfirmText('')
  }

  // Calcula maxMetragem dinâmico (maior estoque atual ou 80, o que for maior)
  const maxMetragem = Math.max(80, ...tecidos.map((t) => t.metragem ?? 0))

  return (
    <div className="mx-auto max-w-[1100px] animate-in fade-in duration-500">
      <FMPageHeader
        title="Cortes de Tecido"
        subtitle="Estoque e especificações técnicas de tecidos"
      >
        <Link href="/tecidos/novo">
          <FMBtn variant="primary">
            <Plus size={14} strokeWidth={2.5} />
            Novo Tecido
          </FMBtn>
        </Link>
      </FMPageHeader>

      <div className="mb-6">
        <FMSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, referência ou fornecedor..."
          accent="tecido"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[260px] animate-pulse rounded-[22px] border border-[--color-border-light] bg-white"
            />
          ))}
        </div>
      ) : tecidos.length === 0 ? (
        <FMEmptyState
          icon={<Scissors size={32} strokeWidth={1.2} />}
          title={search ? 'Nenhum tecido encontrado' : 'Nenhum tecido cadastrado'}
          subtitle={
            search
              ? 'Tente ajustar os termos da sua busca.'
              : 'Comece adicionando seu primeiro corte de tecido.'
          }
          action={
            !search ? (
              <Link href="/tecidos/novo">
                <FMBtn variant="primary" size="sm">
                  <Plus size={14} />
                  Adicionar Tecido
                </FMBtn>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tecidos.map((t) => (
            <TecidoCard
              key={t.id}
              tecido={toCardData(t)}
              maxMetragem={maxMetragem}
              onDelete={askDelete}
            />
          ))}
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
                  Excluir corte de tecido?
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-3 pt-1">
                    <p className="text-sm text-[--color-text-secondary]">
                      Você está prestes a excluir permanentemente:
                    </p>
                    <div className="rounded-xl border border-[--color-border-light] bg-[--color-bg-subtle] px-4 py-3">
                      <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-[--color-text-tertiary]">
                        Corte de Tecido
                      </p>
                      <p className="text-[15px] font-bold leading-tight text-[--color-text-primary]">
                        {tecidoToDelete?.nome}
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
                      Para confirmar, digite o nome do tecido exatamente como aparece abaixo:
                    </p>
                    <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                      <p className="select-all text-[13px] font-black tracking-tight text-red-700">
                        {tecidoToDelete?.nome}
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
                            tecidoToDelete?.nome.trim().toLowerCase()
                        ) {
                          handleDelete()
                        }
                      }}
                      placeholder="Digite o nome do tecido..."
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
                    tecidoToDelete?.nome.trim().toLowerCase()
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
