import { prisma } from '@/lib/prisma'

interface LogData {
  entidade: string
  entidadeId: string
  entidadeRef?: string
  acao: string
  usuario: string
  descricao?: string
  destinatario?: string
}

export async function registrarLog(data: LogData) {
  try {
    await prisma.logAlteracao.create({ data })
  } catch (error) {
    console.error('Erro ao registrar log:', error)
  }
}
