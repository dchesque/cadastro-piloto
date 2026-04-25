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
  Check,
  Download,
  MoreVertical,
  Type,
  Eye,
  Layers,
  Upload,
  Share2,
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
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import ShareDialog from '@/components/ShareDialog'

interface PecaModelagem {
  id?: string
  nome: string
  url: string
  createdAt?: string
}

interface PecaPiloto {
  id: string
  referencia: string
  nome: string
  colecao: string
  estilista: string | null
  modelista: string | null
  pilotista: string | null
  responsavelCorte: string | null
  oficina: string | null
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
  modelagens: PecaModelagem[]
}

export default function PecaViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [loading, setLoading] = useState(true)
  const [peca, setPeca] = useState<PecaPiloto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('ficha')
  const [uploadingModelagem, setUploadingModelagem] = useState(false)
  const [cortes, setCortes] = useState<any[]>([])
  const [loadingCortes, setLoadingCortes] = useState(false)

  // Estados para Gestão de Modelagem
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [editingModeling, setEditingModeling] = useState<PecaModelagem | null>(null)
  const [newName, setNewName] = useState('')
  
  const [doubleConfirmOpen, setDoubleConfirmOpen] = useState(false)
  const [modelingToDelete, setModelingToDelete] = useState<PecaModelagem | null>(null)
  const [confirmStep, setConfirmStep] = useState(1)
  const [corteToDelete, setCorteToDelete] = useState<any | null>(null)
  const [reuploadingUrl, setReuploadingUrl] = useState<string | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [historico, setHistorico] = useState<any[]>([])
  const [loadingHistorico, setLoadingHistorico] = useState(false)

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
    if (id) {
      fetchPeca()
      fetchCortes()
    }
  }, [id])

  const fetchCortes = async () => {
    setLoadingCortes(true)
    try {
      const response = await fetch(`/api/pecas/${id}/corte`)
      const result = await response.json()
      if (response.ok) {
        setCortes(result.data)
      }
    } catch (error) {
      console.error('Erro ao buscar cortes:', error)
    } finally {
      setLoadingCortes(false)
    }
  }

  const fetchHistorico = async () => {
    setLoadingHistorico(true)
    try {
      const res = await fetch(`/api/logs?entidade=PecaPiloto&entidadeId=${id}`)
      const result = await res.json()
      if (res.ok) setHistorico(result.data)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    } finally {
      setLoadingHistorico(false)
    }
  }

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

  const handleModelagemUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingModelagem(true)
    try {
      const newModelagens = [...(peca?.modelagens || [])]
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (response.ok) {
          newModelagens.push({
            nome: file.name,
            url: result.url,
            createdAt: new Date().toISOString()
          })
        }
      }

      const updateRes = await fetch(`/api/pecas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelagens: newModelagens }),
      })

      if (updateRes.ok) {
        fetchPeca()
        showToast({ title: 'Sucesso', description: `${files.length} arquivo(s) enviado(s) com sucesso!` })
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      showToast({ title: 'Erro', description: 'Falha ao enviar arquivo(s)', variant: 'destructive' })
    } finally {
      setUploadingModelagem(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleRenameModeling = async () => {
    if (!editingModeling || !newName.trim() || !peca) return
    
    const updatedModelagens = peca.modelagens.map(m => 
      m.url === editingModeling.url ? { ...m, nome: newName.trim() } : m
    )

    try {
      const res = await fetch(`/api/pecas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelagens: updatedModelagens }),
      })

      if (res.ok) {
        fetchPeca()
        setRenameDialogOpen(false)
        showToast({ title: 'Sucesso', description: 'Arquivo renomeado!' })
      }
    } catch (error) {
      showToast({ title: 'Erro', description: 'Erro ao renomear', variant: 'destructive' })
    }
  }

  const handleDeleteModeling = async () => {
    if (!modelingToDelete || !peca) return

    const updatedModelagens = peca.modelagens.filter(m => m.url !== modelingToDelete.url)

    try {
      const res = await fetch(`/api/pecas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelagens: updatedModelagens }),
      })

      if (res.ok) {
        fetchPeca()
        setDoubleConfirmOpen(false)
        setConfirmStep(1)
        showToast({ title: 'Removido', description: 'Modelagem excluída do histórico' })
      }
    } catch (error) {
      showToast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  const handleReuploadModeling = async (mod: PecaModelagem, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !peca) return

    setReuploadingUrl(mod.url)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadResult = await uploadRes.json()

      if (!uploadRes.ok) throw new Error(uploadResult.error)

      const updatedModelagens = peca.modelagens.map(m =>
        m.url === mod.url ? { ...m, url: uploadResult.url } : m
      )

      const updateRes = await fetch(`/api/pecas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelagens: updatedModelagens }),
      })

      if (updateRes.ok) {
        fetchPeca()
        showToast({ title: 'Sucesso', description: 'Arquivo substituído com sucesso!' })
      }
    } catch (error) {
      showToast({ title: 'Erro', description: 'Falha ao substituir arquivo', variant: 'destructive' })
    } finally {
      setReuploadingUrl(null)
      if (e.target) e.target.value = ''
    }
  }

  const handleDeleteCorte = async () => {
    if (!corteToDelete) return
    try {
      await fetch(`/api/pecas/${id}/corte/${corteToDelete.id}`, { method: 'DELETE' })
      fetchCortes()
      setDoubleConfirmOpen(false)
      setConfirmStep(1)
      setCorteToDelete(null)
      showToast({ title: 'Sucesso', description: 'Ficha de corte excluída' })
    } catch (err) {
      showToast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
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
    <div className="max-w-[210mm] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 print:pb-0 print:m-0 print:max-w-none print:w-full print:bg-white">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-break-avoid {
            break-inside: avoid !important;
          }
          .print-section {
            display: block;
            width: 100%;
            break-inside: auto;
          }
          .ficha-footer {
            break-inside: avoid !important;
          }
          /* Forçar quebra se necessário */
          .page-break {
            break-after: page;
          }
        }
      `}</style>
      {/* Ações e Navegação */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <button 
          onClick={() => router.push('/pecas')}
          className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent-peca] transition-all group px-4 py-2.5 rounded-full bg-white border border-[--color-border-light] w-full sm:w-auto justify-center sm:justify-start shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/pecas/${id}/ficha`} className="flex-1 sm:flex-none">
            <button className="btn-premium h-10 px-4 flex items-center justify-center gap-2 bg-black text-white text-[11px] sm:text-[12px] font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 w-full sm:w-auto">
              <Pencil size={15} />
              Editar Ficha
            </button>
          </Link>
          <div className="hidden sm:block w-[1px] h-4 bg-[--color-border-light] mx-1" />
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none btn-premium h-10 px-4 flex items-center justify-center gap-2 bg-white border border-[--color-border-light] text-[11px] sm:text-[12px] font-bold text-[--color-text-secondary] hover:bg-gray-50 transition-all w-full sm:w-auto"
          >
            <Printer size={15} />
            Imprimir Ficha
          </button>
          <Link href={`/pecas/${id}/imprimir`} className="flex-1 sm:flex-none">
            <button className="btn-premium h-10 px-4 flex items-center justify-center gap-2 bg-white border border-[--color-border-light] text-[11px] sm:text-[12px] font-bold text-[--color-text-secondary] hover:bg-gray-50 transition-all w-full sm:w-auto">
              <Tag size={15} />
              Etiqueta
            </button>
          </Link>
          <button
            onClick={() => setShareDialogOpen(true)}
            className="flex-1 sm:flex-none btn-premium h-10 px-4 flex items-center justify-center gap-2 bg-white border border-[--color-border-light] text-[11px] sm:text-[12px] font-bold text-[--color-text-secondary] hover:bg-gray-50 transition-all w-full sm:w-auto print:hidden"
          >
            <Mail size={15} />
            Enviar
          </button>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="w-10 h-10 flex flex-none items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
            title="Excluir peça"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {/* Navegação por Abas */}
      <nav className="flex gap-1.5 p-1 bg-gray-100/50 rounded-2xl border border-gray-100 mb-6 print:hidden overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('ficha')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 h-10 text-[11px] sm:text-[12px] font-bold rounded-xl transition-all ${activeTab === 'ficha' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FileText size={16} /> Ficha Técnica
        </button>
        <button 
          onClick={() => setActiveTab('corte')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 h-10 text-[11px] sm:text-[12px] font-bold rounded-xl transition-all ${activeTab === 'corte' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <CheckCircle2 size={16} /> Ficha de Corte
        </button>
        <button
          onClick={() => setActiveTab('modelagem')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 h-10 text-[11px] sm:text-[12px] font-bold rounded-xl transition-all ${activeTab === 'modelagem' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Scissors size={16} /> Modelagem
        </button>
        <button
          onClick={() => { setActiveTab('historico'); if (historico.length === 0) fetchHistorico() }}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 h-10 text-[11px] sm:text-[12px] font-bold rounded-xl transition-all ${activeTab === 'historico' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <History size={16} /> Histórico
        </button>
      </nav>

      {/* CONTEÚDO DAS ABAS */}
      <div className="relative">
        
        {/* ABA FICHA TÉCNICA */}
        <div className={`${activeTab === 'ficha' ? 'block' : 'hidden print:block'} overflow-x-auto sm:overflow-visible pb-4 sm:pb-0`}>
          <div className="bg-white overflow-hidden relative shadow-sm print:shadow-none min-w-[210mm] sm:min-w-0">
            
            {/* CONTAINER PÁGINA 1: CABEÇALHO ATÉ AVIAMENTOS */}
            <div className="print-section">
            
            {/* CABEÇALHO INDUSTRIAL PADRONIZADO */}
            <div className="grid grid-cols-4 border-2 border-black">
               <div className="col-span-1 p-2 border-r-2 border-black flex flex-col justify-center items-center bg-black text-white">
                  <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-lg mb-0.5">JC</div>
                  <p className="text-[8px] font-black uppercase tracking-widest leading-none">FlowModa</p>
               </div>
               <div className="col-span-2 p-2 px-3 flex flex-col justify-center">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Ficha Técnica de Vestuário</p>
                  <h1 className="text-xl font-black uppercase tracking-tight leading-none truncate">{peca.nome}</h1>
                  <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{peca.colecao}</p>
               </div>
               <div className="col-span-1 p-2 border-l-2 border-black flex flex-col justify-center items-center bg-gray-50">
                  <div className="text-center mb-1.5 border-b border-black/10 pb-1 w-full">
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5">Referência</p>
                    <p className="text-[14px] font-black text-black leading-none uppercase">{peca.referencia}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] font-black uppercase text-gray-300">Data Cadastro</p>
                    <p className="text-[9px] font-bold text-gray-400 leading-none">
                      {peca.createdAt ? new Date(peca.createdAt).toLocaleDateString('pt-BR') : '—'}
                    </p>
                  </div>
               </div>
            </div>

            {/* BLOCO DE EQUIPE E DADOS TÉCNICOS (ESTRUTURA EM 2 LINHAS) */}
            <div className="border-x-2 border-b-2 border-black bg-gray-50/30">
              {/* LINHA 1: EQUIPE */}
              <div className="grid grid-cols-5 border-b-2 border-black">
                <div className="p-1 border-r-2 border-black">
                  <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Estilista</p>
                  <p className="text-[11px] font-bold text-black uppercase truncate">{peca.estilista || '—'}</p>
                </div>
                <div className="p-1 border-r-2 border-black">
                  <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Modelista</p>
                  <p className="text-[11px] font-bold text-black uppercase truncate">{peca.modelista || '—'}</p>
                </div>
                <div className="p-1 border-r-2 border-black">
                  <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Pilotista</p>
                  <p className="text-[11px] font-bold text-black uppercase truncate">{peca.pilotista || '—'}</p>
                </div>
                <div className="p-1 border-r-2 border-black">
                  <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Oficina</p>
                  <p className="text-[11px] font-bold text-black uppercase truncate">{peca.oficina || '—'}</p>
                </div>
                <div className="p-1">
                  <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Resp. Corte</p>
                  <p className="text-[11px] font-bold text-black uppercase truncate">{peca.responsavelCorte || '—'}</p>
                </div>
              </div>

              {/* LINHA 2: GRADE E TAMANHO PILOTO (MAIS ESPAÇO) */}
              <div className="grid grid-cols-6 bg-white">
                <div className="col-span-5 p-1 px-3 border-r-2 border-black">
                  <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Grade de Tamanhos Disponíveis</p>
                  <p className="text-[12px] font-black text-black uppercase tracking-[0.2em]">{peca.gradeCorte || '—'}</p>
                </div>
                <div className="col-span-1 p-1 flex flex-col justify-center items-center bg-gray-50">
                  <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Tam. Piloto</p>
                  <p className="text-[16px] font-black text-black leading-none">{peca.tamanhoPiloto || '—'}</p>
                </div>
              </div>
            </div>

            {/* FOTOS PADRONIZADAS */}
            <div className="border-x-2 border-b-2 border-black p-1 bg-white">
              <div className="grid grid-cols-2 gap-2 h-[340px]">
                <PhotoContainerClean label="Vista Frente" src={peca.fotoFrente} />
                <PhotoContainerClean label="Vista Verso" src={peca.fotoVerso} />
              </div>
            </div>

            {/* MATERIAIS PADRONIZADOS */}
            <div className="p-3 border-x-2 border-b-2 border-black space-y-2 bg-white">
               <div className="flex items-center gap-2 mb-1 px-1">
                  <div className="h-[2px] w-6 bg-black"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                     <Package size={14} /> Matéria Prima (Tecidos)
                  </p>
               </div>
               <table className="w-full text-left border-collapse border-2 border-black">
                  <thead>
                     <tr className="bg-black text-white">
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20 w-16">REF</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20">Nome</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20">Composição</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20 w-16 text-center">Larg</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20">Cor</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase text-center w-20 bg-gray-800">Consumo</th>
                     </tr>
                  </thead>
                  <tbody className="text-[11px] font-bold">
                     {peca.materiais?.map((mat, i) => (
                        <tr key={i} className="border-b border-black last:border-0 hover:bg-gray-50 transition-colors">
                           <td className="p-1.5 px-2 border-r border-black font-black">{mat.referencia || '—'}</td>
                           <td className="p-1.5 px-2 border-r border-black font-black uppercase">{mat.nome || '—'}</td>
                           <td className="p-1.5 px-2 border-r border-black text-[10px] leading-tight font-medium uppercase">{mat.composicao || '—'}</td>
                           <td className="p-1.5 px-2 border-r border-black text-center font-black">{mat.largura || '—'}</td>
                           <td className="p-1.5 px-2 border-r border-black truncate uppercase">{mat.cor || '—'}</td>
                           <td className="p-1.5 px-2 font-black text-center bg-gray-50">{mat.consumo || '—'}</td>
                        </tr>
                     ))}
                     {(!peca.materiais || peca.materiais.length === 0) && (
                        <tr><td colSpan={6} className="p-4 text-center text-gray-400 font-bold uppercase text-[10px] italic">Nenhum tecido cadastrado conforme padrão JC.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* AVIAMENTOS PADRONIZADOS */}
            <div className="p-3 border-x-2 border-b-2 border-black space-y-2 bg-white">
               <div className="flex items-center gap-2 mb-1 px-1">
                  <div className="h-[2px] w-6 bg-black"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                     <Settings size={14} /> Aviamentos e Componentes
                  </p>
               </div>
               <table className="w-full text-left border-collapse border-2 border-black">
                  <thead>
                     <tr className="bg-black text-white">
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20 w-16">REF</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20">Nome / Marca</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20 w-24 text-center">Medida</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase border-r border-white/20">Cor</th>
                        <th className="p-1 px-2 text-[9px] font-black uppercase text-center w-24 bg-gray-800">Consumo</th>
                     </tr>
                  </thead>
                  <tbody className="text-[11px] font-bold">
                     {peca.aviamentos?.map((av, i) => (
                        <tr key={i} className="border-b border-black last:border-0 hover:bg-gray-50 transition-colors">
                           <td className="p-1.5 px-2 border-r border-black font-black">{av.referencia || '—'}</td>
                           <td className="p-1.5 px-2 border-r border-black font-black uppercase">{av.nome || '—'}</td>
                           <td className="p-1.5 px-2 border-r border-black text-center uppercase">{av.medida || '—'}</td>
                           <td className="p-1.5 px-2 border-r border-black truncate uppercase">{av.cor || '—'}</td>
                           <td className="p-1.5 px-2 font-black text-center bg-gray-50">{av.consumo || '—'}</td>
                        </tr>
                     ))}
                     {(!peca.aviamentos || peca.aviamentos.length === 0) && (
                        <tr><td colSpan={5} className="p-4 text-center text-gray-400 font-bold uppercase text-[10px] italic">Nenhum aviamento cadastrado conforme padrão JC.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>

            </div> {/* FIM PÁGINA 1 LÓGICA */}

            {/* CONTAINER PÁGINA 2: OBSERVAÇÕES ATÉ RODAPÉ */}
            <div className="print-section">

            {/* OBSERVAÇÕES E EQUIPAMENTOS PADRONIZADOS */}
            <div className="grid grid-cols-3 border-x-2 border-b-2 border-black bg-white">
               <div className="col-span-2 p-3 border-r-2 border-black space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="h-[2px] w-6 bg-black"></div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                        <AlertCircle size={14} /> Observações Técnicas de Produção
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1 p-2 bg-red-50/30 rounded border border-red-100">
                        <p className="text-[8px] font-black uppercase text-red-600 tracking-tighter">Pontos Críticos</p>
                        <p className="text-[10px] leading-tight text-gray-700 font-medium whitespace-pre-wrap">{peca.pontosCriticos || "Nenhuma criticidade reportada."}</p>
                     </div>
                     <div className="space-y-1 p-2 bg-blue-50/30 rounded border border-blue-100">
                        <p className="text-[8px] font-black uppercase text-blue-600 tracking-tighter">Instruções de Costura</p>
                        <p className="text-[10px] leading-tight text-gray-700 font-medium whitespace-pre-wrap">{peca.caracteristicasCostura || "Seguir padrão de costura industrial JC."}</p>
                     </div>
                  </div>
               </div>
               <div className="col-span-1 p-3 bg-gray-50/30 flex flex-col justify-start">
                  <p className="text-[8px] font-black text-gray-400 text-center uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Maquinário Requerido</p>
                  <div className="space-y-1.5 overflow-hidden">
                     {peca.equipamentos?.map((eq, i) => (
                        <div key={i} className="flex gap-2 items-center border-b border-black/10 pb-1.5 last:border-0">
                           <div className="flex-1">
                              <p className="text-[7px] font-black uppercase text-gray-400 leading-none mb-0.5">Máquina</p>
                              <p className="text-[10px] font-black text-black leading-tight uppercase">{eq.maquina}</p>
                           </div>
                           <div className="w-14 text-center border-l border-black/10 transition-colors group-hover:bg-white">
                              <p className="text-[7px] font-black uppercase text-gray-400 leading-none mb-0.5">Agulha</p>
                              <p className="text-[10px] font-black text-black leading-tight uppercase">{eq.agulha}</p>
                           </div>
                        </div>
                     ))}
                     {(!peca.equipamentos || peca.equipamentos.length === 0) && (
                        <div className="text-center py-6"><p className="text-[9px] text-gray-300 font-bold uppercase italic">Sem especificações de máquinas.</p></div>
                     )}
                  </div>
               </div>
            </div>

            {/* NOTAS GERAIS PADRONIZADAS */}
            {peca.observacoesGerais && (
               <div className="p-3 border-x-2 border-b-2 border-black bg-yellow-50/10">
                  <div className="flex items-start gap-3">
                     <div className="mt-0.5 p-1 bg-yellow-100 rounded text-yellow-700 print:hidden">
                        <ClipboardList size={12} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-yellow-800/40 mb-1 leading-none">Anotações Gerais Adicionais</p>
                        <p className="text-[10px] leading-relaxed text-gray-700 font-medium italic whitespace-pre-wrap">{peca.observacoesGerais}</p>
                     </div>
                  </div>
               </div>
            )}

            {/* RODAPÉ INDUSTRIAL PADRONIZADO */}
            <div className="p-3 px-8 flex justify-between items-center bg-white border-x-2 border-b-2 border-black print:mb-0">
               <div className="flex gap-6">
                  <div className="flex flex-col">
                    <p className="text-[7px] font-black text-gray-300 uppercase leading-none mb-0.5">Identificador de Documento</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase leading-none">DOC-JC-FT-{peca.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[7px] font-black text-gray-300 uppercase leading-none mb-0.5">Data de Emissão</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase leading-none">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
               </div>
               <div className="w-48 border-t-2 border-black text-center pt-1.5">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-black">Aprovação Técnica</p>
               </div>
            </div>

            </div> {/* FIM PÁGINA 2 LÓGICA */}

          </div>
        </div>

        {/* ABA MODELAGEM */}
        {activeTab === 'modelagem' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <input 
              type="file" 
              id="modeling-upload-internal" 
              className="hidden" 
              multiple
              onChange={handleModelagemUpload}
              disabled={uploadingModelagem}
            />
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">Arquivos de Modelagem</h2>
                  <p className="text-gray-400 text-sm">Centralize aqui os arquivos da modelagem desta peça.</p>
                </div>
                <button
                  onClick={() => document.getElementById('modeling-upload-internal')?.click()}
                  disabled={uploadingModelagem}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10 w-full sm:w-auto justify-center"
                >
                  {uploadingModelagem ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Settings size={18} />}
                  Novo Upload
                </button>
              </div>

              {peca.modelagens && peca.modelagens.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Nome do Arquivo</th>
                        <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest w-40 text-center">Data de Upload</th>
                        <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest w-48 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peca.modelagens.map((mod, i) => (
                        <tr key={i} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-all">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 text-gray-400 rounded-lg group-hover:text-black transition-colors">
                                <Scissors size={14} />
                              </div>
                              <span className="text-sm font-bold text-black break-all leading-tight">
                                {mod.nome}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span className="text-xs text-gray-500 font-medium">
                              {mod.createdAt ? new Date(mod.createdAt).toLocaleDateString('pt-BR') : '—'}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={mod.url}
                                target="_blank"
                                download={mod.nome}
                                className="p-2 text-gray-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                title="Baixar / Visualizar"
                              >
                                <Download size={16} />
                              </a>
                              <label
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                title="Substituir arquivo"
                              >
                                {reuploadingUrl === mod.url ? (
                                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Upload size={16} />
                                )}
                                <input
                                  type="file"
                                  className="hidden"
                                  disabled={reuploadingUrl === mod.url}
                                  onChange={(e) => handleReuploadModeling(mod, e)}
                                />
                              </label>
                              <button
                                onClick={() => {
                                  setEditingModeling(mod)
                                  setNewName(mod.nome)
                                  setRenameDialogOpen(true)
                                }}
                                className="p-2 text-gray-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                title="Renomear"
                              >
                                <Type size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setModelingToDelete(mod)
                                  setConfirmStep(1)
                                  setDoubleConfirmOpen(true)
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Remover"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div 
                  className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[32px] cursor-pointer hover:bg-gray-50/50 transition-all group" 
                  onClick={() => document.getElementById('modeling-upload-internal')?.click()}
                >
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Scissors size={32} />
                  </div>
                  <p className="text-gray-400 font-medium">Nenhum arquivo de modelagem vinculado.</p>
                  <p className="text-xs text-gray-300 mt-1 uppercase font-black tracking-tighter">Clique para fazer o primeiro upload</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA CORTE */}
        {activeTab === 'corte' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">Histórico de Cortes</h2>
                  <p className="text-gray-400 text-sm">Gerencie as fichas de corte emitidas para esta peça.</p>
                </div>
                <Link href={`/pecas/${id}/corte/novo`} className="w-full sm:w-auto">
                  <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10 w-full sm:w-auto justify-center">
                    <Scissors size={18} />
                    Nova Ficha de Corte
                  </button>
                </Link>
              </div>

              {loadingCortes ? (
                <div className="py-20 flex justify-center">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : cortes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Nº do Corte</th>
                        <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Data do Corte</th>
                        <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Itens / Cores</th>
                        <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cortes.map((corte, i) => (
                        <tr key={i} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-all">
                          <td className="py-4 px-2">
                            <span className="text-sm font-black text-black uppercase">{corte.numeroCorte}</span>
                          </td>
                          <td className="py-4 px-2 text-center text-sm font-medium text-gray-500">
                            {new Date(corte.dataCorte).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                              {corte.items?.length || 0} materiais
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center justify-end gap-2">
                              {/* Link para Impressão */}
                              <Link 
                                href={`/pecas/${id}/corte/${corte.id}/imprimir`}
                                className="p-2 text-gray-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                title="Visualizar Ficha de Corte"
                              >
                                <Eye size={16} />
                              </Link>
                              {/* Botão para Deletar */}
                              <button
                                onClick={() => {
                                  setCorteToDelete(corte)
                                  setModelingToDelete(null)
                                  setConfirmStep(1)
                                  setDoubleConfirmOpen(true)
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Remover"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[32px]">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-gray-400 font-medium">Nenhuma ficha de corte registrada.</p>
                  <p className="text-xs text-gray-300 mt-1 uppercase font-black tracking-tighter">Utilize o botão acima para criar o primeiro corte</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA HISTÓRICO */}
        {activeTab === 'historico' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-10 shadow-sm">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">Histórico de Alterações</h2>
                <p className="text-gray-400 text-sm">Registro de todas as ações realizadas nesta peça.</p>
              </div>

              {loadingHistorico ? (
                <div className="py-20 flex justify-center">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : historico.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Data / Hora</th>
                        <th className="py-3 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usuário</th>
                        <th className="py-3 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Ação</th>
                        <th className="py-3 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Detalhe</th>
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
                              log.acao === 'email_enviado' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {log.acao === 'criacao' ? 'Criação' :
                               log.acao === 'edicao' ? 'Edição' :
                               log.acao === 'exclusao' ? 'Exclusão' :
                               log.acao === 'email_enviado' ? 'E-mail' : log.acao}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-xs text-gray-500">
                            {log.descricao && <span>{log.descricao}</span>}
                            {log.destinatario && (
                              <span className="flex items-center gap-1 text-gray-500">
                                <Mail size={11} />
                                {log.destinatario}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[32px]">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History size={32} />
                  </div>
                  <p className="text-gray-400 font-medium">Nenhum registro no histórico.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL EDITAR FICHA (EXISTENTE) */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir esta peça?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL RENOMEAR MODELAGEM */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Type size={18} /> Renomear Arquivo
            </DialogTitle>
            <DialogDescription>
              Ajuste o nome para facilitar a identificação futura.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="modeling-name" className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Nome do Arquivo</Label>
            <Input 
              id="modeling-name"
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              className="h-11 rounded-xl"
              placeholder="Ex: Modelagem_V2_Ajustada.pdf"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleRenameModeling} className="bg-black text-white hover:bg-gray-800 rounded-xl px-8">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG ENVIAR POR E-MAIL */}
      <ShareDialog
        pecaId={id}
        pecaNome={peca.nome || peca.referencia}
        cortes={cortes.map(c => ({ id: c.id, numeroCorte: c.numeroCorte }))}
        modelagens={(peca.modelagens || []).filter(m => !!m.id) as { id: string; nome: string; url: string }[]}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />

      {/* MODAL EXCLUSÃO DUPLA (MODELAGEM E CORTE) */}
      <Dialog open={doubleConfirmOpen} onOpenChange={(open) => {
        setDoubleConfirmOpen(open)
        if (!open) { setModelingToDelete(null); setCorteToDelete(null); setConfirmStep(1) }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle size={20} /> Atenção!
            </DialogTitle>
            <DialogDescription className="font-bold text-gray-900">
              {corteToDelete
                ? confirmStep === 1
                  ? "Deseja realmente excluir esta ficha de corte?"
                  : "Esta ação é irreversível. A ficha de corte será removida permanentemente. Confirmar?"
                : confirmStep === 1
                  ? "Deseja realmente remover este arquivo de modelagem?"
                  : "Esta ação é irreversível. O arquivo será removido do histórico da peça. Confirmar?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
              <Scissors size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-gray-900 break-all leading-relaxed">
                {corteToDelete ? corteToDelete.numeroCorte : modelingToDelete?.nome}
              </span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDoubleConfirmOpen(false)} className="rounded-xl flex-1">Cancelar</Button>
            {confirmStep === 1 ? (
              <Button
                onClick={() => setConfirmStep(2)}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex-1"
              >
                Sim, Remover
              </Button>
            ) : (
              <Button
                onClick={corteToDelete ? handleDeleteCorte : handleDeleteModeling}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1 font-black uppercase tracking-widest text-[10px]"
              >
                APAGAR AGORA
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      <p className="text-[8px] font-black uppercase text-gray-500">{label}</p>
      <p className="text-[13px] font-bold text-black border-b border-black/10">{value || '—'}</p>
    </div>
  )
}

function PhotoContainerClean({ label, src }: { label: string, src: string | null }) {
  return (
    <div className="flex flex-col gap-1.5 h-full overflow-hidden">
       <div className="flex-1 rounded-2xl flex items-center justify-center overflow-hidden bg-white relative border border-gray-100">
          {src ? (
            <img src={src} className="absolute inset-0 w-full h-full object-contain p-2" alt={label} />
          ) : (
            <div className="text-center p-2 opacity-20">
              <ImageIcon size={32} className="mx-auto mb-1 text-gray-400" />
              <p className="text-[8px] font-black uppercase tracking-tighter">SEM FOTO {label}</p>
            </div>
          )}
       </div>
       <p className="text-[10px] font-black uppercase text-center tracking-widest text-gray-400">{label}</p>
    </div>
  )
}

// Helper components for UI
function Label({ children, className, ...props }: any) {
  return <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>{children}</label>
}
