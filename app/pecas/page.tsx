'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Plus, Pencil, Printer, Trash2, Package } from 'lucide-react'
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

interface PecaPiloto {
  id: string
  referencia: string
  nome: string
  colecao: string
  modelista: string
  fornecedor: string
  tecido: string
  composicao: string
  precoTecido: number
  tamanhos: string
  observacoes: string | null
  createdAt: string
}

export default function PecasPage() {
  const [pecas, setPecas] = useState<PecaPiloto[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pecaToDelete, setPecaToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchPecas()
  }, [search])

  const fetchPecas = async () => {
    setLoading(true)
    try {
      const url = search ? `/api/pecas?search=${encodeURIComponent(search)}` : '/api/pecas'
      const response = await fetch(url)
      const result = await response.json()
      setPecas(result.data || [])
    } catch (error) {
      console.error('Erro ao buscar peças:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!pecaToDelete) return

    try {
      const response = await fetch(`/api/pecas/${pecaToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPecas(pecas.filter((p) => p.id !== pecaToDelete))
        setDeleteDialogOpen(false)
        setPecaToDelete(null)
      }
    } catch (error) {
      console.error('Erro ao excluir peça:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-light text-[--color-text-primary] tracking-tight">
            Peças Piloto
          </h1>
          <p className="text-sm sm:text-base text-[--color-text-secondary] font-medium">
            Gerenciamento e controle de modelos e protótipos
          </p>
        </div>
        <Link href="/pecas/nova" className="w-full sm:w-auto">
          <button className="btn-premium btn-primary w-full sm:w-auto h-11 px-6 shadow-premium">
            <Plus size={18} />
            Nova Peça
          </button>
        </Link>
      </header>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] group-focus-within:text-[--color-accent] transition-colors" size={18} />
        <input
          type="search"
          placeholder="Buscar por nome, referência ou fornecedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full h-12 pl-12 pr-4
            bg-white border border-[--color-border-light]
            rounded-[16px] shadow-sm
            text-[15px] text-[--color-text-primary]
            placeholder:text-[--color-text-tertiary]
            focus:outline-none focus:border-[--color-accent] focus:ring-4 focus:ring-[--color-accent]/5
            transition-all duration-200
          "
        />
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[--color-border-light] rounded-[24px] p-6 animate-pulse h-[180px] shadow-sm" />
          ))}
        </div>
      ) : pecas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[32px] border border-dashed border-[--color-border-medium]">
          <div className="w-16 h-16 rounded-full bg-[--color-bg-subtle] flex items-center justify-center text-[--color-text-tertiary]">
            <Package size={32} strokeWidth={1} />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[--color-text-primary]">
              {search ? 'Nenhum resultado encontrado' : 'Nenhuma peça cadastrada'}
            </p>
            <p className="text-sm text-[--color-text-secondary] mt-1">
              {search ? 'Tente ajustar os termos da sua busca.' : 'Comece adicionando sua primeira peça piloto.'}
            </p>
          </div>
          {!search && (
            <Link href="/pecas/nova">
              <button className="btn-premium btn-outline mt-2 bg-white">
                <Plus size={18} className="mr-2" />
                Adicionar Peça
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pecas.map((peca) => (
            <div key={peca.id} className="
              bg-white border border-[--color-border-light]
              rounded-[24px] p-6
              hover:shadow-hover hover:border-[--color-border-medium]
              transition-all duration-300
              flex flex-col group relative overflow-hidden
            ">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <TypeBadge tipo="peca" />
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/pecas/${peca.id}/imprimir`}>
                    <button title="Imprimir" className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-[--color-accent-peca] hover:text-white transition-all">
                      <Printer size={16} />
                    </button>
                  </Link>
                  <Link href={`/pecas/${peca.id}`}>
                    <button title="Editar" className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-[--color-accent] hover:text-white transition-all">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button 
                    title="Excluir"
                    onClick={() => {
                      setPecaToDelete(peca.id)
                      setDeleteDialogOpen(true)
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-[--color-destructive] hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4 relative z-10">
                <p className="font-mono text-[11px] text-[--color-text-tertiary] uppercase tracking-wider mb-1">Ref: {peca.referencia}</p>
                <h3 className="text-[17px] font-bold text-[--color-text-primary] leading-tight group-hover:text-[--color-accent-peca] transition-colors">{peca.nome}</h3>
              </div>
              
              <div className="mt-auto pt-4 border-t border-[--color-border-light] grid grid-cols-2 gap-2 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-tighter mb-0.5">Fornecedor</p>
                  <p className="text-[12px] font-medium text-[--color-text-secondary] truncate">{peca.fornecedor}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-tighter mb-0.5">Cadastrado em</p>
                  <p className="text-[12px] font-medium text-[--color-text-secondary]">{formatDate(peca.createdAt)}</p>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-1 h-0 bg-[--color-accent-peca] group-hover:h-full transition-all duration-500" />
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
