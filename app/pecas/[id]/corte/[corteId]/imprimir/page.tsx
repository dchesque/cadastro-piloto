'use client'

import { useState, useEffect, use } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Printer, ArrowLeft, Scissors, Package, Users, AlertCircle } from 'lucide-react'

export default function ImprimirCortePage({ params }: { params: Promise<{ id: string, corteId: string }> }) {
  const { id, corteId } = use(params)
  const [peca, setPeca] = useState<any>(null)
  const [corte, setCorte] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pecaRes, corteRes] = await Promise.all([
          fetch(`/api/pecas/${id}`),
          fetch(`/api/pecas/${id}/corte/${corteId}`)
        ])
        
        const pecaData = await pecaRes.json()
        const corteData = await corteRes.json()
        
        if (pecaRes.ok && corteRes.ok) {
          setPeca(pecaData.data)
          setCorte(corteData.data)
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, corteId])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[--color-bg-page]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!peca || !corte) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[--color-bg-page]">
        <p className="text-[15px] font-medium text-[--color-text-secondary]">Ficha de corte não encontrada</p>
        <Link href={`/pecas/${id}`}>
          <button className="text-[14px] text-[--color-accent] hover:underline">Voltar para a Peça</button>
        </Link>
      </div>
    )
  }

  const sizes = peca.gradeCorte?.split(/[,/\s]+/).filter((s: string) => s.trim() !== '') || []
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const qrUrl = `${baseUrl}/pecas/${peca.id}/corte/${corte.id}`

  return (
    <div className="flex min-h-dvh flex-col items-center bg-gray-100 p-8 print:p-0 print:bg-white print:min-h-0">
      
      {/* Botões de Ações */}
      <div className="no-print mb-8 w-full max-w-[210mm] flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm">
        <Link href={`/pecas/${id}`} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={18} /> Voltar para a Peça
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg"
        >
          <Printer size={18} /> Imprimir Ficha de Corte
        </button>
      </div>

      {/* FICHA A4 */}
      <div className="w-full overflow-x-auto no-scrollbar pb-8 flex justify-center print:p-0 print:overflow-visible">
        <div 
          id="print-area"
          className="w-[210mm] min-h-[297mm] bg-white text-black overflow-hidden relative border border-gray-200 print:border-none print:shadow-none print:w-full print:m-0 shrink-0"
          style={{ padding: '1cm' }}
        >
        {/* Cabeçalho */}
        <div className="grid grid-cols-4 border-2 border-black mb-3">
           <div className="col-span-1 p-2 border-r-2 border-black flex flex-col justify-center items-center bg-black text-white">
              <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-lg mb-0.5">JC</div>
              <p className="text-[8px] font-black uppercase tracking-widest leading-none">FlowModa</p>
           </div>
           <div className="col-span-2 p-2 px-3 flex flex-col justify-center">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Ficha de Corte Gerencial</p>
              <h1 className="text-lg font-black uppercase tracking-tight leading-none truncate">{peca.nome}</h1>
              <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Ref: {peca.referencia} | Coleção: {peca.colecao}</p>
           </div>
           <div className="col-span-1 p-2 border-l-2 border-black flex flex-col justify-center items-center bg-gray-50">
              <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5">Nº DO CORTE</p>
              <p className="text-sm font-black text-black leading-none">{corte.numeroCorte}</p>
           </div>
        </div>

        {/* Equipe Responsável */}
        <div className="grid grid-cols-5 border-2 border-black mb-4 bg-gray-50/30">
          <div className="p-2 border-r-2 border-black">
             <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Estilista</p>
             <p className="text-[11px] font-bold text-black uppercase truncate">{peca.estilista || '—'}</p>
          </div>
          <div className="p-2 border-r-2 border-black">
             <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Modelista</p>
             <p className="text-[11px] font-bold text-black uppercase truncate">{peca.modelista || '—'}</p>
          </div>
          <div className="p-2 border-r-2 border-black">
             <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Resp. Corte</p>
             <p className="text-[11px] font-bold text-black uppercase truncate">{peca.responsavelCorte || '—'}</p>
          </div>
          <div className="p-2 border-r-2 border-black">
             <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none">Emissão</p>
             <p className="text-[11px] font-bold text-black uppercase">{formatDate(corte.dataCorte)}</p>
          </div>
          <div className="p-2 bg-white">
             <p className="text-[8px] font-black uppercase text-gray-400 mb-0.5 leading-none italic">Data do Corte</p>
             <div className="h-4 border-b border-dashed border-black/20"></div>
          </div>
        </div>

        {/* GRADE TOTAL DO CORTE */}
        <div className="mb-6 text-center">
          <div className="flex items-center gap-2 mb-2 px-1">
             <div className="h-[2px] w-10 bg-black"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                <Scissors size={14} /> Total Geral do Corte (Conferência Final)
             </p>
          </div>
          <table className="w-full border-collapse border-2 border-black text-center shadow-lg shadow-black/5">
             <thead>
                <tr className="bg-black text-white">
                   {sizes.map((s: string, i: number) => (
                      <th key={i} className="border border-white/20 p-1 text-xs font-black uppercase">{s}</th>
                   ))}
                   <th className="border border-white/20 p-1 text-xs font-black uppercase bg-gray-800">TOTAL</th>
                </tr>
             </thead>
             <tbody>
                <tr className="h-10 font-black text-xl bg-white">
                   {sizes.map((_: string, i: number) => (
                      <td key={i} className="border-2 border-black"></td>
                   ))}
                   <td className="border-2 border-black bg-gray-50"></td>
                </tr>
             </tbody>
          </table>
          <p className="mt-1 text-[7px] font-black uppercase text-gray-400 italic">Preencher ao final do corte para fechamento da quantidade real</p>
        </div>

        {/* DETALHES POR TECIDO / COR */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 mb-2">
              <div className="h-[2px] w-10 bg-black"></div>
              <p className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                 <Package size={14} /> Detalhamento por Tecido e Cor
              </p>
           </div>

           {corte.items?.map((item: any, idx: number) => (
              <div key={idx} className="border-2 border-black p-0 break-inside-avoid">
                 <div className="flex">
                    {/* Espaço para Amostra */}
                    <div className="w-32 border-r-2 border-black flex flex-col items-center justify-center p-2 bg-gray-50/50">
                       <p className="text-[7px] font-black uppercase text-gray-300 mb-1">Amostra Física</p>
                       <div className="w-20 h-16 border-2 border-dashed border-black/10 rounded flex items-center justify-center bg-white">
                          <p className="text-[7px] text-gray-200 text-center uppercase px-2 font-black leading-none">Grampear Amostra</p>
                       </div>
                    </div>
                    {/* Informações e Grade de Cor */}
                    <div className="flex-1 flex flex-col">
                       {/* Top Info */}
                       <div className="grid grid-cols-12 border-b border-black">
                          <div className="col-span-5 p-1.5 px-3 border-r border-black">
                             <p className="text-[7px] font-black uppercase text-gray-400">Tecido</p>
                             <p className={`font-black text-black leading-tight uppercase ${item.nome?.length > 20 ? 'text-[9px]' : 'text-[11px]'}`}>
                                {item.nome}
                             </p>
                          </div>
                          <div className="col-span-3 p-1.5 px-3 border-r border-black">
                             <p className="text-[7px] font-black uppercase text-black/40">Cor do Tecido</p>
                             <p className="text-[11px] font-black text-black leading-none uppercase truncate">{item.cor || '—'}</p>
                          </div>
                          <div className="col-span-2 p-1.5 px-3 border-r border-black">
                             <p className="text-[7px] font-black uppercase text-gray-400">Largura</p>
                             <p className="text-[11px] font-bold text-black leading-none uppercase">{item.largura || '—'}</p>
                          </div>
                          <div className="col-span-2 p-1.5 px-3 bg-gray-50/50">
                             <p className="text-[7px] font-black uppercase text-gray-400 italic">Consumo Final</p>
                             <div className="h-4 border-b border-dashed border-black/20"></div>
                          </div>
                       </div>
                       {/* Grade da Cor */}
                       <div className="flex flex-col">
                          <table className="w-full text-center border-collapse">
                             <thead>
                                <tr className="bg-gray-100/30 border-t border-black text-[8px] font-black uppercase text-gray-500">
                                   <td className="w-14 border-r border-black border-b py-1">GRADE</td>
                                   {sizes.map((s: string, si: number) => (
                                      <td key={si} className="border-r border-black border-b py-1">{s}</td>
                                   ))}
                                   <td className="border-b border-black bg-gray-200 text-black py-1">TOTAL</td>
                                </tr>
                             </thead>
                             <tbody className="text-[11px] font-bold">
                                <tr className="h-7">
                                   <td className="border-r border-black border-b bg-gray-50 text-[7px] font-black uppercase text-gray-400">Previsto</td>
                                   {sizes.map((s: string, si: number) => (
                                      <td key={si} className="border-r border-black border-b px-1">{item.grade[s]?.previsto || '—'}</td>
                                   ))}
                                   <td className="border-b border-black bg-gray-100 font-black">
                                      {sizes.reduce((acc: number, s: string) => acc + (item.grade[s]?.previsto || 0), 0)}
                                   </td>
                                </tr>
                                <tr className="h-8 text-black bg-white italic">
                                   <td className="border-r border-black bg-gray-50 text-[7px] font-black uppercase text-gray-400">Real</td>
                                   {sizes.map((s: string, si: number) => (
                                      <td key={si} className="border-r border-black"></td>
                                   ))}
                                   <td className="bg-gray-100"></td>
                                </tr>
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>
                 {/* Observações do Item */}
                 {idx === (corte.items.length - 1) && corte.observacoes && (
                    <div className="p-3 border-t-2 border-black bg-yellow-50/30 flex gap-3">
                       <AlertCircle size={16} className="text-gray-400 shrink-0" />
                       <p className="text-[11px] leading-tight text-gray-700 italic">{corte.observacoes}</p>
                    </div>
                 )}
              </div>
           ))}
        </div>

        {/* Assinatura Final */}
        <div className="mt-16 flex justify-end gap-12 text-center no-print-section print:mt-12">
           <div className="w-48 border-t border-black pt-1">
              <p className="text-[10px] font-black uppercase tracking-tighter">Assinatura Cortador</p>
           </div>
           <div className="w-48 border-t border-black pt-1">
              <p className="text-[10px] font-black uppercase tracking-tighter">Conferência PCP</p>
           </div>
        </div>

        {/* Rodapé Interno */}
        <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center text-[8px] font-black text-gray-300 uppercase print:relative print:bottom-0 print:mt-10">
           <span>FlowModa - Ficha de Corte Gerencial Estrita</span>
           <span>Emissão: {new Date().toLocaleString('pt-BR')}</span>
        </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print { display: none !important; }
          #print-area {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 1cm !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
