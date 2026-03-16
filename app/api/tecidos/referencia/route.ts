import { NextResponse } from 'next/server'
import { gerarReferenciaTecido } from '@/lib/gerarReferencia'

export async function GET() {
  try {
    const referencia = await gerarReferenciaTecido()
    return NextResponse.json({ data: { referencia } })
  } catch (error) {
    console.error('Erro ao gerar referência:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar referência', message: 'Não foi possível gerar a referência' },
      { status: 500 }
    )
  }
}
