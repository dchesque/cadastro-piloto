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
        },
        modelagens: {
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
    
    // Extrair relações e campos que não devem ser passados no "data" do update
    const { 
      materiais, 
      aviamentos, 
      equipamentos, 
      modelagens, 
      id: bodyId, 
      createdAt, 
      updatedAt, 
      ...pecaData 
    } = body

    // Usar transação para garantir integridade
    const result = await prisma.$transaction(async (tx) => {
      // 1. Atualizar dados principais da peça
      const updatedPeca = await tx.pecaPiloto.update({
        where: { id },
        data: pecaData,
      })

      // 2. Se houver materiais, sincronizar
      if (materiais) {
        await tx.pecaTecido.deleteMany({ where: { pecaId: id } })
        if (materiais.length > 0) {
          await tx.pecaTecido.createMany({
            data: materiais.map((m: any) => ({
              referencia: m.referencia,
              nome: m.nome,
              descricao: m.descricao,
              cor: m.cor,
              codFornecedor: m.codFornecedor,
              composicao: m.composicao,
              largura: m.largura,
              consumo: m.consumo,
              pecaId: id
            }))
          })
        }
      }

      // 3. Se houver aviamentos, sincronizar
      if (aviamentos) {
        await tx.pecaAviamento.deleteMany({ where: { pecaId: id } })
        if (aviamentos.length > 0) {
          await tx.pecaAviamento.createMany({
            data: aviamentos.map((a: any) => ({
              referencia: a.referencia,
              nome: a.nome,
              descricao: a.descricao,
              medida: a.medida,
              cor: a.cor,
              codFornecedor: a.codFornecedor,
              composicao: a.composicao,
              consumo: a.consumo,
              pecaId: id
            }))
          })
        }
      }

      // 4. Se houver equipamentos, sincronizar
      if (equipamentos) {
        await tx.pecaEquipamento.deleteMany({ where: { pecaId: id } })
        if (equipamentos.length > 0) {
          await tx.pecaEquipamento.createMany({
            data: equipamentos.map((e: any) => ({
              maquina: e.maquina,
              agulha: e.agulha,
              pecaId: id
            }))
          })
        }
      }

      // 5. Se houver modelagens, sincronizar
      if (modelagens) {
        await tx.pecaModelagem.deleteMany({ where: { pecaId: id } })
        if (modelagens.length > 0) {
          await tx.pecaModelagem.createMany({
            data: modelagens.map((m: any) => ({
              pecaId: id,
              nome: m.nome,
              url: m.url,
              createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
              updatedAt: new Date()
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
