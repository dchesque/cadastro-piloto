import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { gerarReferenciaPeca } from '@/lib/gerarReferencia'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    const pecas = await prisma.pecaPiloto.findMany({
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

    return NextResponse.json({ data: pecas })
  } catch (error) {
    console.error('Erro ao buscar peças:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar peças', message: 'Não foi possível buscar as peças' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referencia: manualReferencia, ...otherData } = body;
    const referencia = manualReferencia || await gerarReferenciaPeca()

    const peca = await prisma.pecaPiloto.create({
      data: {
        ...otherData,
        referencia,
      },
    })

    return NextResponse.json({ data: peca }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar peça:', error)
    return NextResponse.json(
      { error: 'Erro ao criar peça', message: 'Não foi possível criar a peça' },
      { status: 500 }
    )
  }
}
