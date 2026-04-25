import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Shirt, Scissors, FileText, Heart } from 'lucide-react'
import { auth } from '@/auth'
import { HeroStrip } from '@/components/dashboard/hero-strip'
import { MiniStatCard } from '@/components/dashboard/mini-stat-card'
import { RecentList, type RecentItem } from '@/components/dashboard/recent-list'
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/activity-feed'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function greetingByHour(d: Date): string {
  const h = d.getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function relTime(date: Date): string {
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (sameDay) return `Hoje, ${time}`
  if (isYesterday) return `Ontem, ${time}`
  return formatDate(date)
}

export default async function DashboardPage() {
  const session = await auth()
  const userName = session?.user?.name?.split(' ')[0] ?? 'visitante'
  const greeting = greetingByHour(new Date())

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    totalPecas,
    totalTecidos,
    totalProtocolos,
    pecasMonth,
    tecidosMonth,
    pecasRecentes,
    tecidosRecentes,
    colecoesRaw,
    activityRaw,
  ] = await Promise.all([
    prisma.pecaPiloto.count(),
    prisma.corteTecido.count(),
    prisma.pecaCorte.count(),
    prisma.pecaPiloto.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.corteTecido.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.pecaPiloto.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.corteTecido.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.pecaPiloto.findMany({ select: { colecao: true } }),
    prisma.logAlteracao.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
  ])

  const colecoes = new Set(
    colecoesRaw.map((c) => c.colecao?.trim()).filter((c): c is string => !!c),
  )

  const pecasRecItems: RecentItem[] = pecasRecentes.map((p) => ({
    href: `/pecas/${p.id}`,
    ref: p.referencia,
    title: p.nome ?? p.referencia,
    meta: formatDate(p.createdAt),
  }))
  const tecidosRecItems: RecentItem[] = tecidosRecentes.map((t) => ({
    href: `/tecidos/${t.id}`,
    ref: t.referencia,
    title: t.nome ?? t.referencia,
    meta: `${t.metragem ? `${t.metragem}m · ` : ''}${formatDate(t.createdAt)}`,
  }))

  const activity: ActivityItem[] = activityRaw.map((l) => {
    const tipo: ActivityItem['tipo'] =
      l.entidade === 'PecaPiloto' ? 'peca' : l.entidade === 'CorteTecido' ? 'tecido' : 'sistema'
    const acaoMap: Record<string, string> = {
      criacao: 'Cadastro',
      edicao: 'Edição',
      exclusao: 'Exclusão',
      email_enviado: 'E-mail enviado',
    }
    return {
      tipo,
      acao: acaoMap[l.acao] ?? l.acao,
      nome: l.entidadeRef ?? l.descricao ?? '—',
      hora: relTime(l.createdAt),
    }
  })

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-8 animate-in fade-in duration-500">
      <HeroStrip greeting={greeting} userName={userName} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStatCard
          n={totalPecas}
          label="Peças Piloto"
          delta={pecasMonth ? `+${pecasMonth} este mês` : 'este mês'}
          color="#1D4ED8"
          bg="#E6F1FB"
          icon={<Shirt size={20} strokeWidth={1.8} />}
          href="/pecas"
        />
        <MiniStatCard
          n={totalTecidos}
          label="Cortes de Tecido"
          delta={tecidosMonth ? `+${tecidosMonth} este mês` : 'este mês'}
          color="#059669"
          bg="#EAF3DE"
          icon={<Scissors size={20} strokeWidth={1.8} />}
          href="/tecidos"
        />
        <MiniStatCard
          n={totalProtocolos}
          label="Protocolos de Corte"
          delta="acumulado"
          color="#7C3AED"
          bg="#EDE9FE"
          icon={<FileText size={20} strokeWidth={1.8} />}
        />
        <MiniStatCard
          n={colecoes.size}
          label="Coleções ativas"
          delta={
            colecoes.size > 0
              ? Array.from(colecoes).slice(0, 2).join(' · ')
              : 'Cadastre uma coleção'
          }
          color="#C2410C"
          bg="#FEF3E8"
          icon={<Heart size={20} strokeWidth={1.8} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr_320px]">
        <RecentList
          title="Peças Recentes"
          items={pecasRecItems}
          accentColor="#1D4ED8"
          accentBg="#E6F1FB"
          icon={<Shirt size={16} strokeWidth={2} />}
          viewAllHref="/pecas"
          emptyLabel="Nenhuma peça cadastrada"
        />
        <RecentList
          title="Tecidos Recentes"
          items={tecidosRecItems}
          accentColor="#059669"
          accentBg="#EAF3DE"
          icon={<Scissors size={16} strokeWidth={2} />}
          viewAllHref="/tecidos"
          emptyLabel="Nenhum tecido cadastrado"
        />
        <ActivityFeed items={activity} />
      </div>

      <div className="hidden md:flex">
        <Link
          href="/pecas/nova"
          className="sr-only"
          aria-label="Atalho criar peça (oculto)"
        />
      </div>
    </div>
  )
}
