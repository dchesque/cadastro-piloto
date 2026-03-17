'use client'

import { useState, useEffect, use } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { PrintButton } from '@/components/print-button'
import { ArrowLeft } from 'lucide-react'

export default function ImprimirPecaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [peca, setPeca] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPeca = async () => {
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
    fetchPeca()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-bg-page]">
        <div className="w-8 h-8 border-2 border-[--color-accent-peca] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!peca) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[--color-bg-page]">
        <p className="text-[15px] font-medium text-[--color-text-secondary]">Peça não encontrada</p>
        <Link href="/pecas">
          <button className="text-[14px] text-[--color-accent] hover:underline">Voltar para lista</button>
        </Link>
      </div>
    )
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seudominio.com'
  const qrUrl = `${baseUrl}/pecas/${peca.id}`

  const formatPrice = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value) + '/m'
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[--color-bg-page] p-4 sm:p-8 print:min-h-0 print:p-0 print:bg-white">
      <div className="no-print mb-10 w-full max-w-md">
        <Link 
          href={`/pecas/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[--color-text-tertiary] hover:text-[--color-text-primary] transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Peça
        </Link>
        
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-light text-[--color-text-primary] tracking-tight">Visualização da Etiqueta</h1>
          <p className="text-sm text-[--color-text-secondary] font-medium">Pronta para impressão no tamanho 100mm x 150mm</p>
        </div>
        
        <div className="flex justify-center">
          <PrintButton className="btn-premium btn-primary h-12 px-8 shadow-premium" />
        </div>
      </div>

      {/* Etiqueta - Tamanho real 100mm x 150mm */}
      <div
        id="print-area"
        className="flex h-[567px] w-[378px] flex-col overflow-hidden rounded-[4px] border border-[--color-border-light] bg-white shadow-2xl print:border-none print:shadow-none print:rounded-none"
        style={{
          width: '100mm',
          height: '150mm',
          aspectRatio: '100/150',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-4">
          <span className="text-2xl font-black tracking-tighter text-black uppercase">JC STUDIO</span>
          <div className="flex flex-col items-end text-black">
            <span className="rounded-sm border-2 border-black px-2 py-1 text-xs font-black uppercase tracking-tight">
              PEÇA PILOTO
            </span>
          </div>
        </div>

        {/* Nome e Referência */}
        <div className="border-b border-black px-4 py-4">
          <p className="text-xl font-bold leading-tight text-black break-all">{peca.nome || 'Sem nome'}</p>
          <p className="mt-1 font-mono text-sm text-black">#{peca.referencia}</p>
        </div>

        {/* Coleção e Modelista */}
        <div className="grid grid-cols-2 border-b border-black px-4 py-2 text-[13px]">
          <div>
            <p className="font-bold text-black uppercase text-[10px] text-gray-400">Coleção</p>
            <p className="text-[14px] text-black font-bold">{peca.colecao || '-'}</p>
          </div>
          <div className="border-l border-black pl-4">
            <p className="font-bold text-black uppercase text-[10px] text-gray-400">Modelista</p>
            <p className="text-[14px] text-black font-bold">{peca.modelista || '-'}</p>
          </div>
        </div>

        {/* Estilista e Pilotista */}
        <div className="grid grid-cols-2 border-b border-black px-4 py-2 text-[13px]">
          <div>
            <p className="font-bold text-black uppercase text-[10px] text-gray-400">Estilista</p>
            <p className="text-[14px] text-black font-bold">{peca.estilista || '-'}</p>
          </div>
          <div className="border-l border-black pl-4">
            <p className="font-bold text-black uppercase text-[10px] text-gray-400">Pilotista</p>
            <p className="text-[14px] text-black font-bold">{peca.pilotista || '-'}</p>
          </div>
        </div>

        {/* Tamanhos / Grade */}
        <div className="border-b border-black px-4 py-2 text-[13px]">
          <p className="font-bold text-black uppercase text-[10px] text-gray-400">Tam. Piloto</p>
          <p className="mt-0.5 text-[20px] font-black text-black leading-none italic uppercase">
            {peca.tamanhoPiloto || '-'}
          </p>
        </div>

        {/* Tecidos */}
        <div className="px-4 py-2 bg-gray-50/50 border-b border-black/5">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Tecidos</p>
          <div className="space-y-1">
            {peca.materiais?.slice(0, 3).map((mat: any, i: number) => (
               <div key={i} className="flex justify-between items-end">
                 <span className="text-[10px] font-bold text-black uppercase truncate max-w-[150px]">{mat.nome}</span>
                 <span className="text-[10px] font-black text-black">{mat.consumo}</span>
               </div>
            ))}
            {(!peca.materiais || peca.materiais.length === 0) && (
              <p className="text-[10px] text-gray-300 italic">Nenhum tecido</p>
            )}
          </div>
        </div>

        {/* Aviamentos */}
        <div className="flex-1 px-4 py-2 bg-white">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Aviamentos</p>
          <div className="space-y-1">
            {peca.aviamentos?.slice(0, 4).map((av: any, i: number) => (
               <div key={i} className="flex justify-between items-end border-b border-black/5 pb-0.5 last:border-0">
                 <span className="text-[10px] font-bold text-black uppercase truncate max-w-[150px]">{av.nome}</span>
                 <span className="text-[10px] font-black text-black">{av.consumo}</span>
               </div>
            ))}
            {(!peca.aviamentos || peca.aviamentos.length === 0) && (
              <p className="text-[10px] text-gray-300 italic">Nenhum aviamento</p>
            )}
          </div>
        </div>

        {/* Footer com Data e QR Code */}
        <div className="flex items-center justify-between border-t-2 border-black px-4 py-3 bg-white">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">DATA DE EMISSÃO</span>
            <span className="text-[14px] font-black text-black">{formatDate(peca.createdAt)}</span>
          </div>
          <div className="p-1 bg-white border-2 border-black rounded-lg">
            <QRCodeSVG value={qrUrl} size={50} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: 100mm 150mm;
            margin: 0;
          }
          html, body {
            width: 100mm !important;
            height: 150mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
          }
          .no-print { display: none !important; }
          #print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100mm !important;
            height: 150mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
