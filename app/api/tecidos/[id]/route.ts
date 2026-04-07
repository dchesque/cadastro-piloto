import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { registrarLog } from '@/lib/log'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tecido = await prisma.corteTecido.findUnique({
      where: { id },
    })

    if (!tecido) {
      return NextResponse.json(
        { error: 'Tecido não encontrado', message: 'Tecido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: tecido })
  } catch (error) {
    console.error('Erro ao buscar tecido:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tecido', message: 'Não foi possível buscar o tecido' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  try {
    const { id } = await params
    const body = await request.json()

    // Extrair campos que não devem ser passados no "data" do update
    const {
      id: bodyId,
      createdAt,
      updatedAt,
      ...tecidoData
    } = body

    const result = await prisma.corteTecido.update({
      where: { id },
      data: tecidoData,
    })

    await registrarLog({
      entidade: 'CorteTecido',
      entidadeId: id,
      entidadeRef: result.referencia,
      acao: 'edicao',
      usuario: session?.user?.name ?? (session?.user as any)?.username ?? 'Sistema',
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Erro ao atualizar tecido:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar tecido', message: 'Não foi possível atualizar o tecido' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  try {
    const { id } = await params
    const tecido = await prisma.corteTecido.findUnique({ where: { id }, select: { referencia: true } })
    await prisma.corteTecido.delete({ where: { id } })

    await registrarLog({
      entidade: 'CorteTecido',
      entidadeId: id,
      entidadeRef: tecido?.referencia ?? undefined,
      acao: 'exclusao',
      usuario: session?.user?.name ?? (session?.user as any)?.username ?? 'Sistema',
    })

    return NextResponse.json({ message: 'Tecido excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir tecido:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir tecido', message: 'Não foi possível excluir o tecido' },
      { status: 500 }
    )
  }
}
