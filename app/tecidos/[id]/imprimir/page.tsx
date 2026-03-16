import { prisma } from '@/lib/prisma'
import { QRCodeSVG } from 'qrcode.react'
import { formatDate, formatNumber, formatCurrency } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PrintButton } from '@/components/print-button'

import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ImprimirTecidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tecido = await prisma.corteTecido.findUnique({
    where: { id },
  })

  if (!tecido) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seudominio.com'
  const qrUrl = `${baseUrl}/tecidos/${tecido.id}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[--color-bg-page] p-4 sm:p-8 print:min-h-0 print:p-0 print:bg-white">
      <div className="no-print mb-10 w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-700">
        <Link 
          href="/tecidos"
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
        className="flex h-[567px] w-[378px] flex-col overflow-hidden rounded-[4px] border border-[--color-border-light] bg-white shadow-2xl animate-in zoom-in-95 duration-500"
        style={{
          width: '100mm',
          height: '150mm',
          aspectRatio: '100/150',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-sm font-bold">Cadastro Piloto JC</span>
          <span className="rounded bg-accent-tecido-light px-2 py-0.5 text-xs font-semibold text-accent-tecido">
            CORTE TECIDO
          </span>
        </div>

        {/* Nome e Referência */}
        <div className="border-b px-4 py-3">
          <p className="text-base font-bold leading-tight">{tecido.nome || 'Sem nome'}</p>
          <p className="mt-1 font-mono text-xs text-gray-500">#{tecido.referencia}</p>
        </div>

        {/* Fornecedor e Composição */}
        <div className="grid grid-cols-2 border-b px-4 py-2 text-xs">
          <div>
            <p className="font-semibold text-gray-600">Fornecedor</p>
            <p>{tecido.fornecedor || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Composição</p>
            <p>{tecido.composicao || '-'}</p>
          </div>
        </div>

        {/* Metragem, Largura e Preço */}
        <div className="border-b px-4 py-2 text-xs">
          <div className="grid grid-cols-3">
            <div>
              <p className="font-semibold text-gray-600">Metragem</p>
              <p>{formatNumber(tecido.metragem)} m</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Largura</p>
              <p>{formatNumber(tecido.largura)} m</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Preço/m</p>
              <p>{formatCurrency(tecido.preco)}</p>
            </div>
          </div>
        </div>

        {/* Cor e Ref. Cor */}
        <div className="border-b px-4 py-2 text-xs">
          <div className="grid grid-cols-2">
            <div>
              <p className="font-semibold text-gray-600">Cor</p>
              <p>{tecido.cor || '-'}</p>
            </div>
            {tecido.refCor && (
              <div>
                <p className="font-semibold text-gray-600">Ref. cor</p>
                <p>{tecido.refCor}</p>
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        {tecido.observacoes && (
          <div className="flex-1 border-b px-4 py-2">
            <div className="rounded bg-gray-100 p-2 text-xs">
              <p className="font-semibold text-gray-600">Obs:</p>
              <p className="mt-0.5">{tecido.observacoes}</p>
            </div>
          </div>
        )}

        {/* Footer com Data e QR Code */}
        <div className="flex items-center justify-between border-t px-4 py-2">
          <span className="text-xs text-gray-500">{formatDate(tecido.createdAt)}</span>
          <QRCodeSVG value={qrUrl} size={48} />
        </div>
      </div>
    </div>
  )
}
