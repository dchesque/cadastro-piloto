import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Shirt, Scissors, Plus, Package, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { TypeBadge } from '@/components/ui/type-badge'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [totalPecas, totalTecidos, pecasRecentes, tecidosRecentes] = await Promise.all([
    prisma.pecaPiloto.count(),
    prisma.corteTecido.count(),
    prisma.pecaPiloto.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.corteTecido.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-light text-[--color-text-primary] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[--color-text-secondary] font-medium">
            Gestão e acompanhamento da produção <span className="text-accent-tecido">JC Studio</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/pecas/nova" className="flex-1 sm:flex-none">
            <button className="btn-premium btn-primary w-full sm:w-auto h-11 px-6 shadow-premium">
              <Plus size={18} />
              Nova Peça
            </button>
          </Link>
          <Link href="/tecidos/novo" className="flex-1 sm:flex-none">
            <button className="btn-premium btn-outline w-full sm:w-auto h-11 px-6 bg-white">
              <Plus size={18} />
              Novo Tecido
            </button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-card border border-[--color-border-light] hover:shadow-hover transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[--color-accent-peca-light]/30 rounded-bl-[80px] sm:rounded-bl-[100px] -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 transition-transform group-hover:scale-110 duration-500" />
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[18px] bg-[--color-accent-peca-light] text-[--color-accent-peca] flex items-center justify-center shadow-sm">
              <Shirt size={24} className="sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-[--color-text-tertiary] mb-0.5 sm:mb-1">Peças Piloto</p>
              <h3 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] tracking-tight">{totalPecas}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-card border border-[--color-border-light] hover:shadow-hover transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[--color-accent-tecido-light]/30 rounded-bl-[80px] sm:rounded-bl-[100px] -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 transition-transform group-hover:scale-110 duration-500" />
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[18px] bg-[--color-accent-tecido-light] text-[--color-accent-tecido] flex items-center justify-center shadow-sm">
              <Scissors size={24} className="sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-[--color-text-tertiary] mb-0.5 sm:mb-1">Cortes de Tecido</p>
              <h3 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] tracking-tight">{totalTecidos}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* Recent Pecas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-[--color-text-primary] flex items-center gap-2">
              <Shirt size={20} className="text-[--color-accent-peca]" />
              Peças Recentes
            </h2>
            <Link href="/pecas" className="text-xs font-bold uppercase tracking-wider text-[--color-text-tertiary] hover:text-[--color-accent-peca] transition-colors bg-[--color-bg-subtle] px-3 py-1 rounded-full">
              Ver tudo
            </Link>
          </div>
          <div className="bg-white rounded-[24px] shadow-card border border-[--color-border-light] divide-y divide-[--color-border-light] overflow-hidden">
            {pecasRecentes.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 bg-[--color-bg-page]/10">
                <Package size={40} strokeWidth={1} className="text-[--color-text-tertiary]" />
                <p className="text-sm text-[--color-text-tertiary] font-medium">Nenhuma peça cadastrada</p>
              </div>
            ) : (
              pecasRecentes.map((peca) => (
                <Link 
                  key={peca.id} 
                  href={`/pecas/${peca.id}`}
                  className="p-5 hover:bg-[--color-bg-page] transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[--color-bg-subtle] flex items-center justify-center text-[--color-text-secondary] group-hover:scale-105 transition-transform">
                      <Shirt size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] text-[--color-text-tertiary] bg-[--color-bg-subtle] px-1.5 py-0.5 rounded">#{peca.referencia}</span>
                        <span className="text-[10px] text-[--color-text-tertiary] font-medium uppercase tracking-[0.05em]">{formatDate(peca.createdAt)}</span>
                      </div>
                      <p className="text-[15px] font-semibold text-[--color-text-primary]">{peca.nome}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[--color-text-tertiary] group-hover:bg-[--color-accent] group-hover:text-white transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Recent Tecidos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-[--color-text-primary] flex items-center gap-2">
              <Scissors size={20} className="text-[--color-accent-tecido]" />
              Cortes Recentes
            </h2>
            <Link href="/tecidos" className="text-xs font-bold uppercase tracking-wider text-[--color-text-tertiary] hover:text-[--color-accent-tecido] transition-colors bg-[--color-bg-subtle] px-3 py-1 rounded-full">
              Ver tudo
            </Link>
          </div>
          <div className="bg-white rounded-[24px] shadow-card border border-[--color-border-light] divide-y divide-[--color-border-light] overflow-hidden">
            {tecidosRecentes.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 bg-[--color-bg-page]/10">
                <Scissors size={40} strokeWidth={1} className="text-[--color-text-tertiary]" />
                <p className="text-sm text-[--color-text-tertiary] font-medium">Nenhum tecido cadastrado</p>
              </div>
            ) : (
              tecidosRecentes.map((tecido) => (
                <Link 
                  key={tecido.id} 
                  href={`/tecidos/${tecido.id}`}
                  className="p-4 sm:p-5 hover:bg-[--color-bg-page] transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[--color-bg-subtle] flex items-center justify-center text-[--color-text-secondary] group-hover:scale-105 transition-transform">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] text-[--color-text-tertiary] bg-[--color-bg-subtle] px-1.5 py-0.5 rounded">#{tecido.referencia}</span>
                        <span className="text-[10px] text-[--color-text-tertiary] font-medium uppercase tracking-[0.05em]">{formatDate(tecido.createdAt)}</span>
                      </div>
                      <p className="text-[15px] font-semibold text-[--color-text-primary]">{tecido.nome}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[--color-text-tertiary] group-hover:bg-[--color-accent] group-hover:text-white transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
