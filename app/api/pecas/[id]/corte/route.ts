import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cortes = await prisma.pecaCorte.findMany({
      where: { pecaId: id },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: cortes })
  } catch (error) {
    console.error('Erro ao buscar cortes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cortes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { numeroCorte, dataCorte, observacoes, items } = body

    const corte = await prisma.pecaCorte.create({
      data: {
        pecaId: id,
        numeroCorte,
        dataCorte: dataCorte ? new Date(dataCorte) : new Date(),
        observacoes,
        items: {
          create: items.map((item: any) => ({
            tecidoOriginalId: item.tecidoOriginalId,
            nome: item.nome,
            fornecedor: item.fornecedor,
            cor: item.cor,
            largura: item.largura,
            grade: item.grade // JSON: { "M": { previsto: 10, real: 0 }, ... }
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json({ data: corte }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar corte:', error)
    return NextResponse.json(
      { error: 'Erro ao criar corte' },
      { status: 500 }
    )
  }
}
