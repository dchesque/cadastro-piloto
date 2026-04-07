import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const entidade = searchParams.get('entidade')
  const entidadeId = searchParams.get('entidadeId')

  if (!entidade || !entidadeId) {
    return NextResponse.json({ error: 'entidade e entidadeId são obrigatórios' }, { status: 400 })
  }

  try {
    const logs = await prisma.logAlteracao.findMany({
      where: { entidade, entidadeId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: logs })
  } catch (error) {
    console.error('Erro ao buscar logs:', error)
    return NextResponse.json({ error: 'Erro ao buscar logs' }, { status: 500 })
  }
}
