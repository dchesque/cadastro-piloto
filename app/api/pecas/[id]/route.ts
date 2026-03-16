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

    const peca = await prisma.pecaPiloto.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ data: peca })
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
