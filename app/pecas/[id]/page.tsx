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
  Image as ImageIcon,
  Check
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
  oficina: string | null // Added 'oficina' field
  tamanhoPiloto: string | null
  gradeCorte: string | null
  fotoFrente: string | null
  fotoVerso: string | null
  caracteristicasCostura: string | null
  pontosCriticos: string | null
  maquina: string | null
  agulha: string | null
  observacoesGerais: string | null
  createdAt: string
  updatedAt: string
  materiais: any[]
  aviamentos: any[]
  equipamentos: any[]
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
    <div className="max-w-[210mm] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 print:pb-0 print:m-0 print:max-w-none print:w-full">
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

      {/* Ficha Técnica Clean (Layout A4) */}
      <div className="bg-white border border-gray-200 shadow-sm print:border-none print:shadow-none min-h-[297mm]">
        
        {/* CABEÇALHO COMPACTO */}
        <div className="grid grid-cols-4 border-b-2 border-black">
          <div className="col-span-1 p-4 border-r-2 border-black flex flex-col justify-center items-center">
            <div className="w-10 h-10 bg-black text-white rounded-md flex items-center justify-center font-bold text-lg mb-1">JC</div>
            <p className="text-[8px] font-black uppercase tracking-widest">JC STUDIO</p>
          </div>
          <div className="col-span-2 p-4 flex flex-col justify-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Ficha Técnica de Vestuário</p>
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none text-black">{peca.nome}</h1>
          </div>
          <div className="col-span-1 p-4 border-l-2 border-black space-y-2 bg-gray-50">
             <div className="flex flex-col gap-1">
               <p className="text-[8px] font-black uppercase text-gray-400">Referência</p>
               <p className="text-[14px] font-black text-black leading-none">{peca.referencia}</p>
             </div>
             <div className="flex flex-col gap-1">
               <p className="text-[8px] font-black uppercase text-gray-400">Coleção</p>
               <p className="text-[12px] font-bold text-gray-600">{peca.colecao}</p>
             </div>
          </div>
        </div>

        {/* BLOCO DE EQUIPE E MODELAGEM (TABELA INDUSTRIAL PARA ESTABILIDADE TOTAL NO PRINT) */}
        <div className="border-b-2 border-black bg-gray-50/50 print:bg-gray-50/50">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                {/* COLUNA 1: DADOS (70%) */}
                <td className="w-[70%] p-2 align-top">
                  <table className="w-full border-separate border-spacing-y-2 border-spacing-x-8">
                    <tbody>
                      <tr>
                        <td className="w-1/3 align-top"><TechnicalItemSmall label="Estilista" value={peca.estilista} /></td>
                        <td className="w-1/3 align-top"><TechnicalItemSmall label="Modelista" value={peca.modelista} /></td>
                        <td className="w-1/3 align-top"><TechnicalItemSmall label="Pilotista" value={peca.pilotista} /></td>
                      </tr>
                      <tr>
                        <td className="w-1/3 align-top"><TechnicalItemSmall label="Resp. Corte" value={peca.responsavelCorte} /></td>
                        <td className="w-1/3 align-top"><TechnicalItemSmall label="Oficina" value={peca.oficina} /></td>
                        <td className="w-1/3 align-top"><TechnicalItemSmall label="Tam. Piloto" value={peca.tamanhoPiloto} /></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                {/* COLUNA 2: GRADE (30%) */}
                <td className="w-[30%] p-2 align-top border-l-2 border-dashed border-gray-300 min-w-[180px]">
                  <p className="text-[9px] font-black uppercase text-gray-500 mb-2">Grade / Qtd. (Corte)</p>
                  <table className="border-collapse border-2 border-black w-full text-center bg-white">
                    <thead>
                      <tr className="bg-gray-50 uppercase text-[10px] font-black">
                        {peca.gradeCorte?.split(/[,/\s]+/).filter(s => s.trim() !== '').map((size, i) => (
                          <th key={i} className="border-2 border-black px-1 py-1 min-w-[35px] leading-none">{size.trim()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="h-8">
                      <tr>
                        {peca.gradeCorte?.split(/[,/\s]+/).filter(s => s.trim() !== '').map((_, i) => (
                          <td key={i} className="border-2 border-black"></td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* REGISTRO FOTOGRÁFICO (LARGURA TOTAL) */}
        <div className="border-b-2 border-black min-h-[350px] p-2 space-y-2">
          <SectionLabel icon={<ImageIcon size={14} />} label="Frente / Verso" />
          <div className="grid grid-cols-2 gap-4 h-[300px]">
             <PhotoContainerClean label="Frente" src={peca.fotoFrente} />
             <PhotoContainerClean label="Verso" src={peca.fotoVerso} />
          </div>
        </div>

        {/* MATÉRIA PRIMA (TECIDOS) - COMPACTA */}
        <div className="p-3 border-b-2 border-black space-y-2">
          <SectionLabel icon={<Package size={14} />} label="Matéria Prima" />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/80 border-b-2 border-black">
                <th className="p-1 text-[9px] font-black uppercase border-r border-gray-300 w-16">REF</th>
                <th className="p-1 text-[9px] font-black uppercase border-r border-gray-300">Nome</th>
                <th className="p-1 text-[9px] font-black uppercase border-r border-gray-300">Composição</th>
                <th className="p-1 text-[9px] font-black uppercase border-r border-gray-300 w-16 text-center">Larg</th>
                <th className="p-1 text-[9px] font-black uppercase border-r border-gray-300">Cor</th>
                <th className="p-1 text-[9px] font-black uppercase text-center w-20">Consumo</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {peca.materiais && peca.materiais.length > 0 ? (
                peca.materiais.map((mat, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="p-1 border-r border-gray-200 font-bold">{mat.referencia || '—'}</td>
                    <td className="p-1 border-r border-gray-200 font-bold uppercase">{mat.nome || '—'}</td>
                    <td className="p-1 border-r border-gray-200 text-[10px] leading-tight">{mat.composicao || '—'}</td>
                    <td className="p-1 border-r border-gray-200 text-center font-bold">{mat.largura || '—'}</td>
                    <td className="p-1 border-r border-gray-200 truncate">{mat.cor || '—'}</td>
                    <td className="p-1 font-black text-center bg-gray-50">{mat.consumo || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="p-3 text-center text-gray-400 italic">Nenhum tecido cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AVIAMENTOS - COMPACTA */}
        <div className="p-3 border-b-2 border-black space-y-2">
          <SectionLabel icon={<Settings size={14} />} label="Aviamentos" />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/80 border-b-2 border-black">
                <th className="p-1.5 text-[9px] font-black uppercase border-r border-gray-300 w-16">REF</th>
                <th className="p-1.5 text-[9px] font-black uppercase border-r border-gray-300">Nome / Marca</th>
                <th className="p-1.5 text-[9px] font-black uppercase border-r border-gray-300 w-24 text-center">Medida</th>
                <th className="p-1.5 text-[9px] font-black uppercase border-r border-gray-300">Cor</th>
                <th className="p-1.5 text-[9px] font-black uppercase text-center w-24">Consumo</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {peca.aviamentos && peca.aviamentos.length > 0 ? (
                peca.aviamentos.map((av, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="p-1 border-r border-gray-200 font-bold">{av.referencia || '—'}</td>
                    <td className="p-1 border-r border-gray-200 font-bold uppercase">{av.nome || '—'}</td>
                    <td className="p-1 border-r border-gray-200 text-center">{av.medida || '—'}</td>
                    <td className="p-1 border-r border-gray-200 truncate">{av.cor || '—'}</td>
                    <td className="p-1 font-black text-center bg-gray-50">{av.consumo || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-3 text-center text-gray-400 italic">Nenhum aviamento cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* OBSERVAÇÕES E COSTURA (HÍBRIDO) */}
        <div className="grid grid-cols-3 border-b-2 border-black">
          <div className="col-span-2 p-2 border-r-2 border-black space-y-1">
             <SectionLabel icon={<AlertCircle size={14} />} label="Observações Técnicas" />
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase text-red-500">Pontos Críticos</p>
                   <p className="text-[10px] leading-tight text-gray-600 italic whitespace-pre-wrap">{peca.pontosCriticos || "—"}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase text-blue-500">Acabamento</p>
                   <p className="text-[10px] leading-tight text-gray-600 whitespace-pre-wrap">{peca.caracteristicasCostura || "—"}</p>
                </div>
             </div>
          </div>
          <div className="col-span-1 p-2 bg-gray-50/50 flex flex-col justify-start overflow-hidden">
             <p className="text-[9px] font-black text-gray-400 text-center uppercase tracking-widest mb-1 border-b border-black/5 pb-0.5">Equipamentos</p>
             <div className="space-y-1.5 overflow-y-auto max-h-[100px] pr-1 scrollbar-thin">
                {peca.equipamentos && peca.equipamentos.length > 0 ? (
                  peca.equipamentos.map((eq, i) => (
                    <div key={i} className="flex gap-2 items-center border-b border-black/5 pb-2 last:border-0">
                       <div className="flex-1">
                          <p className="text-[7px] font-black uppercase text-gray-400">Máquina</p>
                          <p className="text-[10px] font-black text-black leading-tight">{eq.maquina}</p>
                       </div>
                       <div className="w-12 text-center border-l border-black/5">
                          <p className="text-[7px] font-black uppercase text-gray-400">Agulha</p>
                          <p className="text-[10px] font-black text-black leading-tight">{eq.agulha}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[9px] text-gray-300 italic">Nenhum equipamento listado.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* OBSERVAÇÕES GERAIS (ESTILO NOTAS) */}
        {peca.observacoesGerais && (
          <div className="p-2 bg-yellow-50/20 border-b-2 border-black min-h-[50px]">
             <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-yellow-100 rounded-lg text-yellow-700 print:hidden">
                   <ClipboardList size={12} />
                </div>
                <div className="flex-1">
                   <p className="text-[9px] font-black uppercase tracking-widest text-yellow-800/50 mb-0.5">Notas e Observações Gerais</p>
                   <p className="text-[10px] leading-tight text-gray-700 whitespace-pre-wrap">{peca.observacoesGerais}</p>
                </div>
             </div>
          </div>
        )}

        {/* RODAPÉ MINIMALISTA */}
        <div className="p-6 flex justify-between items-center bg-white">
           <div className="flex gap-4">
              <p className="text-[8px] font-black text-gray-300 uppercase underline">DOC-JC-PECA-{peca.id.slice(-6)}</p>
              <p className="text-[8px] font-black text-gray-300 uppercase">{new Date().toLocaleDateString('pt-BR')}</p>
           </div>
           <div className="w-1/3 border-t border-black pb-1">
              <p className="text-[8px] font-black text-center uppercase tracking-widest mt-1">Assinatura Responsável</p>
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
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body { 
            background: white !important; 
            padding: 0 !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden { display: none !important; }
          /* Forçar a Ficha a ocupar toda a largura da folha */
          .max-w-\\[210mm\\] { 
            width: 100% !important; 
            max-width: none !important; 
            margin: 0 !important; 
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}

function SectionLabel({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-black">
      {icon} {label}
    </h2>
  )
}

function TechnicalItemSmall({ label, value }: { label: string, value: string | null }) {
  return (
    <div className="flex flex-col">
      <p className="text-[9px] font-black uppercase text-gray-500 mb-0.5">{label}</p>
      <p className="text-[14px] font-bold text-black border-b border-black/10 pb-1">{value || '—'}</p>
    </div>
  )
}

function PhotoContainerClean({ label, src }: { label: string, src: string | null }) {
  return (
    <div className="flex flex-col gap-1.5 h-full overflow-hidden">
       <div className="flex-1 rounded-2xl flex items-center justify-center overflow-hidden bg-white transition-all relative">
          {src ? (
            <img 
              src={src} 
              className="absolute inset-0 w-full h-full object-contain p-2" 
              alt={label}
            />
          ) : (
            <div className="text-center p-2 opacity-20">
              <ImageIcon size={32} className="mx-auto mb-1 text-gray-400" />
              <p className="text-[8px] font-black uppercase tracking-tighter">SEM FOTO {label}</p>
            </div>
          )}
       </div>
       <p className="text-[10px] font-black uppercase text-center tracking-widest text-gray-400 mt-1">{label}</p>
    </div>
  )
}
