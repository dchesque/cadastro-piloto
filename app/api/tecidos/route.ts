import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { gerarReferenciaTecido } from '@/lib/gerarReferencia'
import { auth } from '@/auth'
import { registrarLog } from '@/lib/log'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    const tecidos = await prisma.corteTecido.findMany({
      where: search
        ? {
            OR: [
              { nome: { contains: search, mode: 'insensitive' } },
              { referencia: { contains: search, mode: 'insensitive' } },
              { fornecedor: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: tecidos })
  } catch (error) {
    console.error('Erro ao buscar tecidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tecidos', message: 'Não foi possível buscar os tecidos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  try {
    const body = await request.json()
    const { referencia: manualReferencia, ...otherData } = body;
    const referencia = manualReferencia || await gerarReferenciaTecido()

    const tecido = await prisma.corteTecido.create({
      data: {
        ...otherData,
        referencia,
      },
    })

    await registrarLog({
      entidade: 'CorteTecido',
      entidadeId: tecido.id,
      entidadeRef: tecido.referencia,
      acao: 'criacao',
      usuario: session?.user?.name ?? (session?.user as any)?.username ?? 'Sistema',
    })

    return NextResponse.json({ data: tecido }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar tecido:', error)
    return NextResponse.json(
      { error: 'Erro ao criar tecido', message: 'Não foi possível criar o tecido' },
      { status: 500 }
    )
  }
}
