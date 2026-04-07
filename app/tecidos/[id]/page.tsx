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
  CheckCircle2,
  Tag,
  History,
  Mail
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
  const [historico, setHistorico] = useState<any[]>([])
  const [loadingHistorico, setLoadingHistorico] = useState(false)
  const [historicoCarregado, setHistoricoCarregado] = useState(false)

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

  const fetchHistorico = async () => {
    if (historicoCarregado) return
    setLoadingHistorico(true)
    try {
      const res = await fetch(`/api/logs?entidade=CorteTecido&entidadeId=${id}`)
      const result = await res.json()
      if (res.ok) { setHistorico(result.data); setHistoricoCarregado(true) }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    } finally {
      setLoadingHistorico(false)
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
    <div className="max-w-[210mm] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 print:pb-0 print:m-0">
      {/* Ações e Navegação */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <button 
          onClick={() => router.push('/tecidos')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent-tecido] transition-all group px-4 py-2 rounded-full bg-white border border-[--color-border-light] w-fit shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="flex items-center gap-2">
          <button className="btn-premium btn-outline h-9 px-4 flex items-center gap-2 bg-white text-[12px] font-bold">
            <Tag size={15} />
            Etiqueta
          </button>
          <button 
            onClick={handlePrint}
            className="btn-premium btn-primary h-9 px-4 flex items-center gap-2 text-[12px] font-bold"
          >
            <Printer size={15} />
            Imprimir
          </button>
          <div className="w-[1px] h-4 bg-[--color-border-light] mx-1" />
          <Link href={`/tecidos/${id}/editar`}>
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

      {/* Ficha Técnica */}
      <div className="bg-white border border-[--color-border-light] rounded-[24px] overflow-hidden shadow-card print:border-none print:shadow-none print:rounded-none">
        <div className="p-10 text-center text-gray-400 italic">
          Visualização de Tecido v1.11.0 🚀
        </div>
      </div>

      {/* Histórico de Alterações */}
      <div className="mt-6 bg-white border border-gray-100 rounded-[24px] p-6 sm:p-8 shadow-sm">
        <button
          onClick={fetchHistorico}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-xl">
              <History size={16} className="text-gray-500" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black uppercase tracking-tight text-black">Histórico de Alterações</h3>
              <p className="text-xs text-gray-400">Registro de ações realizadas neste tecido</p>
            </div>
          </div>
          {!historicoCarregado && (
            <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors">Carregar</span>
          )}
        </button>

        {loadingHistorico && (
          <div className="mt-4 flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {historicoCarregado && !loadingHistorico && (
          <div className="mt-4">
            {historico.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Data / Hora</th>
                      <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usuário</th>
                      <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Ação</th>
                      <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Detalhe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((log) => (
                      <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                        <td className="py-3 px-2 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-2 text-xs font-semibold text-black">{log.usuario}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            log.acao === 'criacao' ? 'bg-green-100 text-green-700' :
                            log.acao === 'edicao' ? 'bg-blue-100 text-blue-700' :
                            log.acao === 'exclusao' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {log.acao === 'criacao' ? 'Criação' :
                             log.acao === 'edicao' ? 'Edição' :
                             log.acao === 'exclusao' ? 'Exclusão' : log.acao}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-xs text-gray-500">
                          {log.descricao || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400 py-8">Nenhum registro encontrado.</p>
            )}
          </div>
        )}
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
