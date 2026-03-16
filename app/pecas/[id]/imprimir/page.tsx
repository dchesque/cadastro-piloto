import { prisma } from '@/lib/prisma'
import { QRCodeSVG } from 'qrcode.react'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PrintButton } from '@/components/print-button'

import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ImprimirPecaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const peca = await prisma.pecaPiloto.findUnique({
    where: { id },
  })

  if (!peca) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seudominio.com'
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
      <div className="no-print mb-10 w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-700">
        <Link 
          href="/pecas"
          className="inline-flex items-center gap-2 text-sm font-medium text-[--color-text-tertiary] hover:text-[--color-text-primary] transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para listagem
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
        className="flex h-[567px] w-[378px] flex-col overflow-hidden rounded-[4px] border border-[--color-border-light] bg-white shadow-2xl animate-in zoom-in-95 duration-500 print:border-none print:shadow-none print:rounded-none"
        style={{
          width: '100mm',
          height: '150mm',
          aspectRatio: '100/150',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-4">
          <span className="text-2xl font-black tracking-tighter text-black uppercase">JC PLUS SIZE</span>
          <div className="flex flex-col items-end text-black">
            <span className="rounded-sm border-2 border-black px-2 py-1 text-xs font-black uppercase tracking-tight">
              PEÇA PILOTO
            </span>
          </div>
        </div>

        {/* Nome e Referência */}
        <div className="border-b border-black px-4 py-4">
          <p className="text-xl font-bold leading-tight text-black">{peca.nome || 'Sem nome'}</p>
          <p className="mt-1 font-mono text-sm text-black">#{peca.referencia}</p>
        </div>

        {/* Coleção e Modelista */}
        <div className="grid grid-cols-2 border-b border-black px-4 py-2 text-[13px]">
          <div>
            <p className="font-bold text-black">Coleção</p>
            <p className="text-[14px] text-black">{peca.colecao || '-'}</p>
          </div>
          <div className="border-l border-black pl-4">
            <p className="font-bold text-black">Modelista</p>
            <p className="text-[14px] text-black">{peca.modelista || '-'}</p>
          </div>
        </div>

        {/* Fornecedor e Tecido */}
        <div className="border-b border-black px-4 py-2 text-[13px]">
          <div className="grid grid-cols-2">
            <div>
              <p className="font-bold text-black">Fornecedor</p>
              <p className="text-[14px] text-black">{peca.fornecedor || '-'}</p>
            </div>
            <div className="border-l border-black pl-4">
              <p className="font-bold text-black">Tecido</p>
              <p className="text-[14px] text-black">{peca.tecido || '-'}</p>
            </div>
          </div>
        </div>

        {/* Composição e Preço */}
        <div className="border-b border-black px-4 py-2 text-[13px]">
          <div className="grid grid-cols-2">
            <div>
              <p className="font-bold text-black">Composição</p>
              <p className="text-[14px] text-black">{peca.composicao || '-'}</p>
            </div>
            <div className="border-l border-black pl-4">
              <p className="font-bold text-black">Preço tecido</p>
              <p className="text-[14px] font-bold text-black">{formatPrice(peca.precoTecido)}</p>
            </div>
          </div>
        </div>

        {/* Tamanhos */}
        <div className="border-b border-black px-4 py-2 text-[13px]">
          <p className="font-bold text-black">Tamanhos</p>
          <p className="mt-0.5 text-[14px] font-bold text-black">{peca.tamanhos ? peca.tamanhos.split(',').join(' · ') : '-'}</p>
        </div>

        {/* Observações */}
        {peca.observacoes && (
          <div className="flex-1 border-b border-black px-4 py-2">
            <div className="pt-1">
              <p className="text-[12px] font-bold text-black uppercase tracking-wider">Obs:</p>
              <p className="mt-0.5 text-[12px] leading-tight text-black">{peca.observacoes}</p>
            </div>
          </div>
        )}

        {/* Footer com Data e QR Code */}
        <div className="flex items-center justify-between border-t-2 border-black px-4 py-2">
          <span className="text-[13px] font-bold text-black">{formatDate(peca.createdAt)}</span>
          <QRCodeSVG value={qrUrl} size={60} />
        </div>
      </div>
    </div>
  )
}
