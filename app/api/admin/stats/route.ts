import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  if ((session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })
  }

  const [totalUsuarios, ativosUsuarios, adminsUsuarios, totalLogs, recentes] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { ativo: true } }),
    prisma.user.count({ where: { role: 'admin' } }),
    prisma.logAlteracao.count(),
    prisma.logAlteracao.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ])

  return NextResponse.json({
    usuarios: { total: totalUsuarios, ativos: ativosUsuarios, admins: adminsUsuarios },
    logs: { total: totalLogs, recentes },
    sistema: {
      smtpConfigurado: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      emailRestrito: process.env.EMAIL_RESTRICT_TO_REGISTERED === 'true',
    },
  })
}
