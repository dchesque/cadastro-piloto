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
  CheckCircle2,
  Tag,
  ClipboardList,
  Scissors,
  Settings,
  AlertCircle,
  Image as ImageIcon
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
  estilista: string | null
  modelista: string | null
  pilotista: string | null
  responsavelCorte: string | null
  tamanhoPiloto: string | null
  gradeCorte: string | null
  fotoFrente: string | null
  fotoVerso: string | null
  caracteristicasCostura: string | null
  pontosCriticos: string | null
  maquina: string | null
  agulha: string | null
  createdAt: string
  updatedAt: string
  materiais: any[]
  aviamentos: any[]
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
          <Link href={`/pecas/${id}/ficha`}>
            <button className="btn-premium h-9 px-4 flex items-center gap-2 bg-black text-white text-[12px] font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
              <ClipboardList size={15} />
              Editar Ficha Profissional
            </button>
          </Link>
          <div className="w-[1px] h-4 bg-[--color-border-light] mx-1" />
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

      {/* Ficha Técnica Profissional (Layout A4) */}
      <div className="bg-white border border-gray-200 shadow-sm print:border-none print:shadow-none min-h-[297mm]">
        
        {/* CABEÇALHO INDUSTRIAL */}
        <div className="grid grid-cols-4 border-b-2 border-black">
          <div className="col-span-1 p-6 border-r-2 border-black flex flex-col justify-center items-center gap-2">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">JC</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-center">JC PLUS SIZE</p>
          </div>
          <div className="col-span-2 p-6 flex flex-col justify-center">
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">Ficha Técnica de Vestuário</h1>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">{peca.nome}</p>
          </div>
          <div className="col-span-1 p-6 border-l-2 border-black space-y-2 bg-gray-50">
             <InfoBox label="Referência" value={peca.referencia} highlight />
             <InfoBox label="Coleção" value={peca.colecao} />
          </div>
        </div>

        {/* SEÇÃO 1: FOTOS E EQUIPE */}
        <div className="grid grid-cols-2 border-b-2 border-black min-h-[400px]">
          {/* FOTOS */}
          <div className="p-6 border-r-2 border-black space-y-6">
             <SectionLabel icon={<FileText size={14} />} label="Registro Fotográfico" />
             <div className="grid grid-cols-2 gap-4 h-[350px]">
                <PhotoContainer label="Frente" src={peca.fotoFrente} />
                <PhotoContainer label="Verso" src={peca.fotoVerso} />
             </div>
          </div>
          
          {/* EQUIPE E MODELAGEM */}
          <div className="p-0 flex flex-col">
             <div className="p-6 border-b-2 border-black flex-1">
                <SectionLabel icon={<User size={14} />} label="Equipe e Desenvolvimento" />
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-4">
                   <TechnicalItem label="Estilista" value={peca.estilista} />
                   <TechnicalItem label="Modelista" value={peca.modelista} />
                   <TechnicalItem label="Pilotista" value={peca.pilotista} />
                   <TechnicalItem label="Responsável Corte" value={peca.responsavelCorte} />
                </div>
             </div>
             <div className="p-6 bg-gray-50/50">
                <SectionLabel icon={<Scissors size={14} />} label="Modelagem e Grade" />
                <div className="grid grid-cols-2 gap-6 mt-4">
                   <TechnicalItem label="Grade de Tamanhos" value={peca.gradeCorte} />
                   <TechnicalItem label="Tamanho Piloto" value={peca.tamanhoPiloto} />
                </div>
             </div>
          </div>
        </div>

        {/* SEÇÃO 2: MATÉRIA PRIMA (TECIDOS) */}
        <div className="p-6 border-b-2 border-black space-y-4">
          <SectionLabel icon={<Package size={14} />} label="Matéria Prima Principal (Tecidos)" />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/80 border-b-2 border-black">
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Descrição / Finalidade</th>
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Material</th>
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Cor</th>
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Fornecedor / Ref</th>
                <th className="p-3 text-[10px] font-black uppercase">Consumo/Peça</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {peca.materiais && peca.materiais.length > 0 ? (
                peca.materiais.map((mat, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="p-3 border-r border-gray-200 font-medium">{mat.descricao}</td>
                    <td className="p-3 border-r border-gray-200">{mat.nome} / {mat.composicao}</td>
                    <td className="p-3 border-r border-gray-200">{mat.cor}</td>
                    <td className="p-3 border-r border-gray-200">{mat.codFornecedor}</td>
                    <td className="p-3 font-bold">{mat.consumo}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">Nenhum tecido cadastrado nesta ficha.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SEÇÃO 3: AVIAMENTOS */}
        <div className="p-6 border-b-2 border-black space-y-4">
          <SectionLabel icon={<Settings size={14} />} label="Aviamentos e Componentes" />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/80 border-b-2 border-black">
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Descrição / Nome</th>
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Medida</th>
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Cor</th>
                <th className="p-3 text-[10px] font-black uppercase border-r border-gray-300">Ref / Fornecedor</th>
                <th className="p-3 text-[10px] font-black uppercase">Consumo/Peça</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {peca.aviamentos && peca.aviamentos.length > 0 ? (
                peca.aviamentos.map((av, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="p-3 border-r border-gray-200 font-medium">{av.descricao} / {av.nome}</td>
                    <td className="p-3 border-r border-gray-200">{av.medida}</td>
                    <td className="p-3 border-r border-gray-200">{av.cor}</td>
                    <td className="p-3 border-r border-gray-200">{av.codFornecedor}</td>
                    <td className="p-3 font-bold">{av.consumo}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic">Nenhum aviamento cadastrado nesta ficha.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SEÇÃO 4: OBSERVAÇÕES DE COSTURA */}
        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-6 border-r-2 border-black space-y-4">
            <SectionLabel icon={<AlertCircle size={14} />} label="Pontos Críticos de Execução" />
            <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl text-[13px] text-red-900 leading-relaxed min-h-[100px] whitespace-pre-wrap italic">
               {peca.pontosCriticos || "Nenhuma observação crítica registrada."}
            </div>
          </div>
          <div className="p-0 flex flex-col">
             <div className="p-6 border-b border-black bg-gray-50/30">
                <div className="flex justify-between items-center mb-4">
                   <SectionLabel icon={<User size={14} />} label="Especificações Técnicas" />
                   <div className="flex gap-4">
                      <div className="text-center">
                         <p className="text-[8px] font-bold uppercase mb-1">Máquina</p>
                         <p className="text-[11px] font-bold px-3 py-1 bg-white border border-black rounded">{peca.maquina || '—'}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-bold uppercase mb-1">Agulha</p>
                         <p className="text-[11px] font-bold px-3 py-1 bg-white border border-black rounded">{peca.agulha || '—'}</p>
                      </div>
                   </div>
                </div>
                <div className="text-[12px] leading-relaxed whitespace-pre-wrap min-h-[60px]">
                   <span className="font-bold uppercase text-[9px] block mb-1">Características de Costura e Acabamento:</span>
                   {peca.caracteristicasCostura || 'Não informado.'}
                </div>
             </div>
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="p-10 flex justify-between items-end bg-gray-50/50">
           <div className="space-y-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Documento Técnico Emitido em</p>
              <p className="text-[11px] font-bold text-black">{new Date().toLocaleString('pt-BR')}</p>
           </div>
           <div className="text-center space-y-6">
              <div className="w-64 h-[2px] bg-black/10" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">Assinatura Responsável / JC STUDIO</p>
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
          body { background: white !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          @page {
            size: A4;
            margin: 0cm;
          }
        }
      `}</style>
    </div>
  )
}

function SectionLabel({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black">
      {icon} {label}
    </h2>
  )
}

function TechnicalItem({ label, value }: { label: string, value: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-[13px] font-bold text-black border-b border-gray-100 pb-1">{value || '—'}</p>
    </div>
  )
}

function InfoBox({ label, value, highlight = false }: { label: string, value: string | null, highlight?: boolean }) {
  return (
    <div className="space-y-0.5">
       <p className="text-[8px] font-black uppercase text-gray-400">{label}</p>
       <p className={`text-[14px] font-black leading-none ${highlight ? 'text-black' : 'text-gray-600'}`}>
         {value || '—'}
       </p>
    </div>
  )
}

function PhotoContainer({ label, src }: { label: string, src: string | null }) {
  return (
    <div className="flex flex-col gap-2 h-full">
       <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50 group hover:border-black/20 transition-all">
          {src ? (
            <img src={src} className="w-full h-full object-contain" />
          ) : (
            <div className="text-center p-4">
              <ImageIcon size={32} className="mx-auto text-gray-200 mb-2" />
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Sem Foto {label}</p>
            </div>
          )}
       </div>
       <p className="text-[9px] font-black uppercase text-center tracking-widest text-gray-400">{label}</p>
    </div>
  )
}
