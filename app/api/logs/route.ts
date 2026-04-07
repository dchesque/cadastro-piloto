import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const entidade = searchParams.get('entidade')
  const entidadeId = searchParams.get('entidadeId')
  const acao = searchParams.get('acao')
  const usuario = searchParams.get('usuario')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const take = 50

  // Modo global: admin sem entidadeId → retorna todos os logs com filtros e paginação
  const isAdmin = (session.user as any)?.role === 'admin'
  if (!entidadeId) {
    if (!isAdmin) {
      return NextResponse.json({ error: 'entidade e entidadeId são obrigatórios' }, { status: 400 })
    }

    const where: any = {}
    if (entidade) where.entidade = entidade
    if (acao) where.acao = acao
    if (usuario) where.usuario = { contains: usuario, mode: 'insensitive' }

    const [logs, total] = await Promise.all([
      prisma.logAlteracao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * take,
        take,
      }),
      prisma.logAlteracao.count({ where }),
    ])

    return NextResponse.json({ data: logs, total, page, pages: Math.ceil(total / take) })
  }

  // Modo por entidade (comportamento original)
  if (!entidade) {
    return NextResponse.json({ error: 'entidade e entidadeId são obrigatórios' }, { status: 400 })
  }

  const logs = await prisma.logAlteracao.findMany({
    where: { entidade, entidadeId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data: logs })
}
