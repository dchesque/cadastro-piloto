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
  Building2, 
  FileText, 
  Palette, 
  Ruler, 
  CheckCircle2
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
  updatedAt: string
}

export default function TecidoViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [loading, setLoading] = useState(true)
  const [tecido, setTecido] = useState<CorteTecido | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchTecido = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tecidos/${id}`)
      const result = await response.json()
      if (response.ok) {
        setTecido(result.data)
      }
    } catch (error) {
      console.error('Erro ao buscar tecido:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchTecido()
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/tecidos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        showToast({ title: 'Sucesso', description: 'Tecido excluído com sucesso' })
        router.push('/tecidos')
      }
    } catch (error) {
      console.error('Erro ao excluir tecido:', error)
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
        <div className="w-8 h-8 border-2 border-[--color-accent-tecido] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-[--color-text-secondary]">Carregando ficha técnica...</p>
      </div>
    )
  }

  if (!tecido) {
    return (
      <div className="max-w-[800px] mx-auto py-20 text-center">
        <p className="text-[15px] font-medium text-[--color-text-secondary]">Tecido não encontrado</p>
        <Link href="/tecidos">
          <button className="mt-4 text-[14px] text-[--color-accent-tecido] hover:underline transition-all">Voltar para lista</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Ações e Navegação */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button 
          onClick={() => router.push('/tecidos')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent-tecido] transition-all group px-4 py-2 rounded-full bg-white border border-[--color-border-light] w-fit shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Lista
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="btn-premium btn-outline h-10 px-5 flex items-center gap-2 bg-white text-[13px] font-bold"
          >
            <Printer size={16} />
            Imprimir
          </button>
          <Link href={`/tecidos/${id}/editar`}>
            <button className="btn-premium btn-outline h-10 px-5 flex items-center gap-2 bg-white text-[13px] font-bold border-blue-100 text-blue-700 hover:bg-blue-50">
              <Pencil size={16} />
              Editar
            </button>
          </Link>
          <button 
            onClick={() => setDeleteDialogOpen(true)}
            className="btn-premium btn-outline h-10 px-5 flex items-center gap-2 bg-white text-[13px] font-bold border-red-100 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      </header>

      {/* Ficha Técnica */}
      <div className="bg-white border border-[--color-border-light] rounded-[32px] overflow-hidden shadow-card print:border-none print:shadow-none print:rounded-none">
        {/* Cabeçalho da Ficha */}
        <div className="bg-[--color-bg-subtle]/30 p-8 sm:p-12 border-b border-[--color-border-light] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[--color-accent-tecido] flex items-center justify-center text-white shadow-lg shadow-[--color-accent-tecido]/20">
                  <Palette size={20} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[--color-text-tertiary]">Ficha de Material #Tecido</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-light text-[--color-text-primary] tracking-tight">{tecido.nome}</h1>
              <div className="flex items-center gap-4 text-[13px] text-[--color-text-secondary] font-medium">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="opacity-50" /> {formatDate(tecido.createdAt)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-border-medium]" />
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-[--color-border-light] text-[11px] text-[--color-accent-tecido] font-bold tracking-tighter uppercase">{tecido.referencia}</span>
              </div>
            </div>
            <div className="px-6 py-3 bg-white border border-[--color-border-light] rounded-2xl shadow-sm text-center min-w-[140px]">
              <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-widest mb-1">Status de Estoque</p>
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[14px]">
                <CheckCircle2 size={16} />
                Disponível
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[--color-accent-tecido]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Conteúdo da Ficha */}
        <div className="p-8 sm:p-12 space-y-12">
          {/* Sessão: Informações Gerais */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[--color-text-secondary]">
                <Building2 size={16} />
              </div>
              <h2 className="text-[14px] font-bold uppercase tracking-widest text-[--color-text-primary]">Origem e Fornecimento</h2>
              <div className="flex-1 h-[1px] bg-[--color-border-light]/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={<Building2 size={16} />} label="Fornecedor" value={tecido.fornecedor} />
              <InfoItem icon={<Palette size={16} />} label="Características de Cor" value={`${tecido.cor} ${tecido.refCor ? `(${tecido.refCor})` : ''}`} />
            </div>
          </section>

          {/* Sessão: Dados Técnicos */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[--color-text-secondary]">
                <Ruler size={16} />
              </div>
              <h2 className="text-[14px] font-bold uppercase tracking-widest text-[--color-text-primary]">Especificações Técnicas</h2>
              <div className="flex-1 h-[1px] bg-[--color-border-light]/50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-[--color-bg-subtle]/20 rounded-2xl border border-[--color-border-light]/50">
              <InfoItem label="Metragem" value={`${tecido.metragem.toLocaleString('pt-BR')} m`} />
              <InfoItem label="Largura" value={`${tecido.largura.toLocaleString('pt-BR')} m`} />
              <InfoItem label="Preço Unitário" value={`R$ ${tecido.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
            </div>

            <div className="p-6 bg-white border border-[--color-border-light] rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[--color-accent-tecido]/10 flex items-center justify-center text-[--color-accent-tecido]">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[--color-text-tertiary] uppercase tracking-widest mb-1">Composição Têxtil</p>
                <p className="text-[16px] font-medium text-[--color-text-primary]">{tecido.composicao}</p>
              </div>
            </div>
          </section>

          {/* Sessão: Observações */}
          {tecido.observacoes && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[14px] font-bold uppercase tracking-widest text-[--color-text-tertiary]">Notas de Armazenamento</h2>
                <div className="flex-1 h-[1px] bg-[--color-border-light]/50" />
              </div>
              <div className="p-8 bg-white border border-[--color-border-light] rounded-[24px] shadow-sm italic text-[15px] text-[--color-text-secondary] leading-relaxed relative">
                <div className="absolute top-4 left-4 text-4xl text-gray-100 font-serif leading-none">"</div>
                <p className="relative z-10">{tecido.observacoes}</p>
              </div>
            </section>
          )}

          <div className="pt-8 border-t border-[--color-border-light] flex justify-between items-center text-[11px] text-[--color-text-tertiary] font-medium uppercase tracking-[0.2em]">
            <span>JC PLUS SIZE - Controle de Estoque</span>
            <span className="print:block hidden">Emitido em {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

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
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1.5 flex flex-col group">
      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-[--color-text-tertiary] uppercase tracking-widest">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </div>
      <div className="text-[16px] sm:text-[17px] font-medium text-[--color-text-primary] tracking-tight group-hover:text-[--color-accent-tecido] transition-all">
        {value || '—'}
      </div>
    </div>
  )
}
