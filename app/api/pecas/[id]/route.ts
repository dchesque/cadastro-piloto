import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const peca = await prisma.pecaPiloto.findUnique({
      where: { id },
      include: {
        materiais: {
          orderBy: { createdAt: 'asc' }
        },
        aviamentos: {
          orderBy: { createdAt: 'asc' }
        },
        equipamentos: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!peca) {
      return NextResponse.json(
        { error: 'Peça não encontrada', message: 'Peça não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: peca })
  } catch (error) {
    console.error('Erro ao buscar peça:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar peça', message: 'Não foi possível buscar a peça' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Extrair materiais, aviamentos e equipamentos do corpo, se existirem
    const { materiais, aviamentos, equipamentos, ...pecaData } = body

    // Usar transação para garantir integridade ao atualizar ficha completa
    const result = await prisma.$transaction(async (tx) => {
      // 1. Atualizar dados principais da peça
      const updatedPeca = await tx.pecaPiloto.update({
        where: { id },
        data: pecaData,
      })

      // 2. Se houver materiais (ficha completa), sincronizar
      if (materiais) {
        // Deletar existentes e criar novos (abordagem de sincronização simples)
        await tx.pecaTecido.deleteMany({ where: { pecaId: id } })
        if (materiais.length > 0) {
          await tx.pecaTecido.createMany({
            data: materiais.map((m: any) => ({
              ...m,
              pecaId: id,
              id: undefined // Deixar prisma gerar IDs
            }))
          })
        }
      }

      // 3. Se houver aviamentos (ficha completa), sincronizar
      if (aviamentos) {
        await tx.pecaAviamento.deleteMany({ where: { pecaId: id } })
        if (aviamentos.length > 0) {
          await tx.pecaAviamento.createMany({
            data: aviamentos.map((a: any) => ({
              ...a,
              pecaId: id,
              id: undefined
            }))
          })
        }
      }

      // 4. Se houver equipamentos (ficha completa), sincronizar
      if (equipamentos) {
        await tx.pecaEquipamento.deleteMany({ where: { pecaId: id } })
        if (equipamentos.length > 0) {
          await tx.pecaEquipamento.createMany({
            data: equipamentos.map((e: any) => ({
              ...e,
              pecaId: id,
              id: undefined
            }))
          })
        }
      }

      return updatedPeca
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Erro ao atualizar peça:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar peça', message: 'Não foi possível atualizar a peça' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.pecaPiloto.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Peça excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir peça:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir peça', message: 'Não foi possível excluir a peça' },
      { status: 500 }
    )
  }
}
