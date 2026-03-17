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
  const [tecidoToDelete, setTecidoToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchTecidos()
  }, [search])

  const fetchTecidos = async () => {
    setLoading(true)
    try {
      const url = search ? `/api/tecidos?search=${encodeURIComponent(search)}` : '/api/tecidos'
      const response = await fetch(url)
      const result = await response.json()
      setTecidos(result.data || [])
    } catch (error) {
      console.error('Erro ao buscar tecidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!tecidoToDelete) return

    try {
      const response = await fetch(`/api/tecidos/${tecidoToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTecidos(tecidos.filter((t) => t.id !== tecidoToDelete))
        setDeleteDialogOpen(false)
        setTecidoToDelete(null)
      }
    } catch (error) {
      console.error('Erro ao excluir tecido:', error)
    }
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[--color-border-light] rounded-[24px] p-6 animate-pulse h-[180px] shadow-sm" />
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
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/tecidos/${tecido.id}`}>
                    <button title="Visualizar Ficha" className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={`/tecidos/${tecido.id}/imprimir`}>
                    <button title="Imprimir Etiqueta" className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      <Printer size={16} />
                    </button>
                  </Link>
                  <Link href={`/tecidos/${tecido.id}/editar`}>
                    <button title="Editar" className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button 
                    title="Excluir"
                    onClick={() => {
                      setTecidoToDelete(tecido.id)
                      setDeleteDialogOpen(true)
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-[10px] text-[--color-text-secondary] bg-[--color-bg-subtle] hover:bg-red-50 hover:text-red-600 transition-all duration-200"
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este tecido? Esta ação não pode ser desfeita.
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
