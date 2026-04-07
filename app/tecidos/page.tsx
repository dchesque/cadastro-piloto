'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Plus, Pencil, Printer, Trash2, Scissors, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { TypeBadge } from '@/components/ui/type-badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { showToast } from '@/components/ui/toast'

interface CorteTecido {
  id: string
  referencia: string
  nome: string
  fornecedor: string
  composicao: string
  metragem: number
  largura: number
  preco: number
  cor: string
  refCor: string | null
  observacoes: string | null
  createdAt: string
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
    const abortController = new AbortController()
    fetchTecidos(abortController.signal)
    return () => abortController.abort()
  }, [search])

  const fetchTecidos = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const url = search ? `/api/tecidos?search=${encodeURIComponent(search)}` : '/api/tecidos'
      const response = await fetch(url, { signal })
      const result = await response.json()
      setTecidos(result.data || [])
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Erro ao buscar tecidos:', error)
      showToast({ title: 'Erro', description: 'Não foi possível carregar os tecidos. Tente novamente.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!tecidoToDelete) return

    try {
      const response = await fetch(`/api/tecidos/${tecidoToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTecidos(tecidos.filter((t) => t.id !== tecidoToDelete.id))
        closeDeleteDialog()
        showToast({ title: 'Excluído', description: 'Tecido removido com sucesso.' })
      }
    } catch (error) {
      console.error('Erro ao excluir tecido:', error)
    }
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setTecidoToDelete(null)
    setDeleteStep(1)
    setDeleteConfirmText('')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-light text-[--color-text-primary] tracking-tight">
            Cortes de Tecido
          </h1>
          <p className="text-sm sm:text-base text-[--color-text-secondary] font-medium">
            Estoque e especificações técnicas de tecidos
          </p>
        </div>
        <Link href="/tecidos/novo" className="w-full sm:w-auto">
          <button className="btn-premium btn-primary w-full sm:w-auto h-11 px-6 shadow-premium">
            <Plus size={18} />
            Novo Tecido
          </button>
        </Link>
      </header>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] group-focus-within:text-[--color-accent-tecido] transition-colors" size={18} />
        <input
          type="search"
          placeholder="Buscar por nome, referência ou fornecedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          enterKeyHint="search"
          autoComplete="off"
          className="
            w-full h-12 pl-12 pr-4
            bg-white border border-[--color-border-light]
            rounded-[16px] shadow-sm
            text-[15px] text-[--color-text-primary]
            placeholder:text-[--color-text-tertiary]
            focus:outline-none focus:border-[--color-accent-tecido] focus:ring-4 focus:ring-[--color-accent-tecido]/5
            transition-all duration-200
          "
        />
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Carregando tecidos...">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[--color-border-light] rounded-[24px] p-6 animate-pulse h-[180px] shadow-sm" aria-hidden="true" />
          ))}
        </div>
      ) : tecidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[32px] border border-dashed border-[--color-border-medium]">
          <div className="w-16 h-16 rounded-full bg-[--color-bg-subtle] flex items-center justify-center text-[--color-text-tertiary]">
            <Scissors size={32} strokeWidth={1} />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[--color-text-primary]">
              {search ? 'Nenhum resultado encontrado' : 'Nenhum tecido cadastrado'}
            </p>
            <p className="text-sm text-[--color-text-secondary] mt-1">
              {search ? 'Tente ajustar os termos da sua busca.' : 'Comece adicionando seu primeiro corte de tecido.'}
            </p>
          </div>
          {!search && (
            <Link href="/tecidos/novo">
              <button className="btn-premium btn-outline mt-2 bg-white">
                <Plus size={18} className="mr-2" />
                Adicionar Tecido
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tecidos.map((tecido) => (
            <div key={tecido.id} className="
              bg-white border border-[--color-border-light]
              rounded-[20px] sm:rounded-[24px] p-5 sm:p-6
              hover:shadow-hover hover:border-[--color-border-medium]
              transition-all duration-300
              flex flex-col group relative overflow-hidden
            ">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <TypeBadge tipo="tecido" />
                <div className="flex gap-1.5">
                  <Link href={`/tecidos/${tecido.id}`}>
                    <button title="Visualizar Ficha" className="w-11 h-11 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={`/tecidos/${tecido.id}/imprimir`}>
                    <button title="Imprimir Etiqueta" className="w-11 h-11 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      <Printer size={16} />
                    </button>
                  </Link>
                  <Link href={`/tecidos/${tecido.id}`}>
                    <button title="Editar" className="w-11 h-11 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button
                    title="Excluir"
                    onClick={() => {
                      setTecidoToDelete({ id: tecido.id, nome: tecido.nome })
                      setDeleteStep(1)
                      setDeleteConfirmText('')
                      setDeleteDialogOpen(true)
                    }}
                    className="w-11 h-11 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-[10px] text-[--color-text-tertiary] uppercase tracking-wider">Ref: {tecido.referencia}</p>
                  <span className="w-1 h-1 rounded-full bg-[--color-border-medium]" />
                  <p className="text-[10px] font-medium text-[--color-accent-tecido]">{tecido.cor} {tecido.refCor && `(${tecido.refCor})`}</p>
                </div>
                <h3 className="text-[16px] sm:text-[17px] font-bold text-[--color-text-primary] leading-tight group-hover:text-[--color-accent-tecido] transition-colors line-clamp-2">{tecido.nome}</h3>
              </div>
              
              <div className="mt-auto pt-4 border-t border-[--color-border-light] grid grid-cols-2 gap-2 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-tighter mb-0.5">Fornecedor</p>
                  <p className="text-[12px] font-medium text-[--color-text-secondary] truncate">{tecido.fornecedor}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-tighter mb-0.5">Metragem</p>
                  <p className="text-[13px] font-bold text-[--color-text-primary]">{tecido.metragem}m</p>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-1 h-0 bg-[--color-accent-tecido] group-hover:h-full transition-all duration-500" />
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) closeDeleteDialog() }}>
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
                    <div className="rounded-xl bg-[--color-bg-subtle] border border-[--color-border-light] px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[--color-text-tertiary] mb-0.5">Corte de Tecido</p>
                      <p className="text-[15px] font-bold text-[--color-text-primary] leading-tight">{tecidoToDelete?.nome}</p>
                    </div>
                    <p className="text-xs text-[--color-text-tertiary]">
                      Todos os dados vinculados serão removidos. Essa ação não pode ser desfeita.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0 mt-2">
                <Button variant="outline" onClick={closeDeleteDialog} className="flex-1 rounded-xl">
                  Cancelar
                </Button>
                <Button
                  onClick={() => setDeleteStep(2)}
                  className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
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
                    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                      <p className="text-[13px] font-black text-red-700 tracking-tight select-all">{tecidoToDelete?.nome}</p>
                    </div>
                    <input
                      autoFocus
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && deleteConfirmText.trim().toLowerCase() === tecidoToDelete?.nome.trim().toLowerCase()) {
                          handleDelete()
                        }
                      }}
                      placeholder="Digite o nome do tecido..."
                      className="w-full h-11 px-4 rounded-xl bg-white border border-[--color-border-medium] text-[14px] text-[--color-text-primary] placeholder:text-[--color-text-tertiary] focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0 mt-2">
                <Button variant="outline" onClick={closeDeleteDialog} className="flex-1 rounded-xl">
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteConfirmText.trim().toLowerCase() !== tecidoToDelete?.nome.trim().toLowerCase()}
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
