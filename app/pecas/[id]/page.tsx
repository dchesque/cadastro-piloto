'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/toast'
import { 
  ArrowLeft, 
  Printer, 
  Pencil, 
  Trash2, 
  Calendar, 
  User, 
  Building2, 
  FileText, 
  Package, 
  Search,
  CheckCircle2,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

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
  updatedAt: string
}

export default function PecaViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [loading, setLoading] = useState(true)
  const [peca, setPeca] = useState<PecaPiloto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchPeca = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pecas/${id}`)
      const result = await response.json()
      if (response.ok) {
        setPeca(result.data)
      }
    } catch (error) {
      console.error('Erro ao buscar peça:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchPeca()
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/pecas/${id}`, { method: 'DELETE' })
      if (response.ok) {
        showToast({ title: 'Sucesso', description: 'Peça excluída com sucesso' })
        router.push('/pecas')
      }
    } catch (error) {
      console.error('Erro ao excluir peça:', error)
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[--color-accent-peca] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-[--color-text-secondary]">Carregando ficha técnica...</p>
      </div>
    )
  }

  if (!peca) {
    return (
      <div className="max-w-[800px] mx-auto py-20 text-center">
        <p className="text-[15px] font-medium text-[--color-text-secondary]">Peça não encontrada</p>
        <Link href="/pecas">
          <button className="mt-4 text-[14px] text-[--color-accent] hover:underline transition-all">Voltar para lista</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[210mm] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 print:pb-0 print:m-0">
      {/* Ações e Navegação */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <button 
          onClick={() => router.push('/pecas')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent-peca] transition-all group px-4 py-2 rounded-full bg-white border border-[--color-border-light] w-fit shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="flex items-center gap-2">
          <Link href={`/pecas/${id}/imprimir`}>
            <button className="btn-premium btn-outline h-9 px-4 flex items-center gap-2 bg-white text-[12px] font-bold">
              <Tag size={15} />
              Etiqueta
            </button>
          </Link>
          <button 
            onClick={handlePrint}
            className="btn-premium btn-primary h-9 px-4 flex items-center gap-2 text-[12px] font-bold"
          >
            <Printer size={15} />
            Imprimir Ficha (A4)
          </button>
          <div className="w-[1px] h-4 bg-[--color-border-light] mx-1" />
          <Link href={`/pecas/${id}/editar`}>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all">
              <Pencil size={16} />
            </button>
          </Link>
          <button 
            onClick={() => setDeleteDialogOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {/* Ficha Técnica (Layout A4) */}
      <div className="bg-white border border-[--color-border-light] rounded-[24px] overflow-hidden shadow-card print:border-none print:shadow-none print:rounded-none">
        {/* Cabeçalho */}
        <div className="p-8 sm:p-12 border-b border-[--color-border-light] flex justify-between items-start print:p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[--color-accent-peca] flex items-center justify-center text-white shadow-lg">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[--color-text-tertiary] leading-none mb-1">Ficha Técnica</p>
                <h1 className="text-3xl font-light text-[--color-text-primary] tracking-tight leading-none uppercase">Peça Piloto</h1>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[18px] font-bold text-[--color-text-primary] uppercase">{peca.nome}</p>
              <div className="flex items-center gap-3">
                <code className="text-[14px] bg-[--color-bg-subtle] px-3 py-1 rounded-lg border border-[--color-border-light] font-mono font-bold text-[--color-accent-peca] tracking-tight">
                  REF: {peca.referencia}
                </code>
                <span className="text-[12px] text-[--color-text-tertiary] flex items-center gap-1.5 font-medium">
                  <Calendar size={13} /> {formatDate(peca.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-2">
             <div className="text-[14px] font-bold text-[--color-text-primary] tracking-tight">JC PLUS SIZE</div>
             <div className="text-[10px] font-medium text-[--color-text-tertiary] uppercase tracking-widest leading-relaxed">
               Gestão de Pilotos e Peças<br />
               Sistema Interno
             </div>
             <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full border border-green-100 text-green-700 text-[11px] font-bold uppercase tracking-wider mt-4">
                <CheckCircle2 size={13} />
                Confirmado
             </div>
          </div>
        </div>

        {/* Grid de Informações Técnicas */}
        <div className="p-8 sm:p-12 print:p-8 space-y-10">
          
          {/* Seção 1: Detalhes de Produção */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[--color-text-tertiary] print:text-black">
              <User size={14} /> Detalhes de Produção
            </h2>
            <div className="grid grid-cols-2 gap-y-10 border border-[--color-border-light] rounded-3xl p-8 print:border-gray-200">
              <DataRow label="Modelista" value={peca.modelista} />
              <DataRow label="Coleção" value={peca.colecao} />
              <DataRow label="Fornecedor" value={peca.fornecedor} />
              <DataRow label="Grade de Tamanhos" value={peca.tamanhos} />
            </div>
          </div>

          {/* Seção 2: Material Principal */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[--color-text-tertiary] print:text-black">
              <Package size={14} /> Material Principal
            </h2>
            <div className="grid grid-cols-2 gap-y-10 border border-[--color-border-light] rounded-3xl p-8 bg-[--color-bg-subtle]/10 print:bg-white print:border-gray-200">
              <DataRow label="Tecido" value={peca.tecido} />
              <DataRow label="Composição" value={peca.composicao} />
              <DataRow label="Preço Unitário" value={`R$ ${peca.precoTecido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /metro`} />
            </div>
          </div>

          {/* Seção 3: Observações */}
          {peca.observacoes && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[--color-text-tertiary] print:text-black">
                <Search size={14} /> Observações Técnicas
              </h2>
              <div className="border border-[--color-border-light] rounded-3xl p-8 min-h-[120px] print:border-gray-200">
                <p className="text-[15px] text-[--color-text-primary] leading-relaxed whitespace-pre-wrap">
                  {peca.observacoes}
                </p>
              </div>
            </div>
          )}

          {/* Footer Ficha */}
          <div className="pt-10 flex justify-between items-end border-t border-dashed border-[--color-border-light] print:border-gray-100">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-widest">Documento Gerado em</p>
              <p className="text-[12px] font-medium text-[--color-text-secondary]">{new Date().toLocaleString('pt-BR')}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-bold text-[--color-text-primary] uppercase tracking-tighter">JC STUDIO 2026</p>
              <p className="text-[10px] text-[--color-text-tertiary]">Assinatura Responsável</p>
              <div className="mt-4 w-48 h-[1px] bg-gray-300 ml-auto" />
            </div>
          </div>
        </div>
      </div>

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
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}

function DataRow({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-widest">{label}</p>
      <p className="text-[16px] font-medium text-[--color-text-primary] leading-tight">{value || '—'}</p>
    </div>
  )
}
