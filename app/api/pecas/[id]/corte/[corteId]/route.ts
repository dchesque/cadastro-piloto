import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, corteId: string }> }
) {
  try {
    const { corteId } = await params
    const corte = await prisma.pecaCorte.findUnique({
      where: { id: corteId },
      include: {
        items: true
      }
    })

    if (!corte) {
      return NextResponse.json(
        { error: 'Ficha de Corte não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: corte })
  } catch (error) {
    console.error('Erro ao buscar corte:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar corte' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, corteId: string }> }
) {
  try {
    const { corteId } = await params
    const body = await request.json()
    const { numeroCorte, dataCorte, observacoes, items } = body

    // Atualiza cabeçalho e deleta itens antigos para recriar (abordagem simples para sincronização)
    const result = await prisma.$transaction(async (tx) => {
      await tx.pecaCorteItem.deleteMany({
        where: { corteId }
      })

      return await tx.pecaCorte.update({
        where: { id: corteId },
        data: {
          numeroCorte,
          dataCorte: dataCorte ? new Date(dataCorte) : undefined,
          observacoes,
          items: {
            create: items.map((item: any) => ({
              tecidoOriginalId: item.tecidoOriginalId,
              nome: item.nome,
              fornecedor: item.fornecedor,
              cor: item.cor,
              largura: item.largura,
              grade: item.grade
            }))
          }
        },
        include: {
          items: true
        }
      })
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Erro ao atualizar corte:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar corte' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, corteId: string }> }
) {
  try {
    const { corteId } = await params
    await prisma.pecaCorte.delete({
      where: { id: corteId }
    })

    return NextResponse.json({ message: 'Ficha de Corte excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir corte:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir corte' },
      { status: 500 }
    )
  }
}
