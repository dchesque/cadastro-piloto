import { prisma } from './prisma'

export async function gerarReferenciaPeca(): Promise<string> {
  const year = new Date().getFullYear()

  const ultimoRegistro = await prisma.pecaPiloto.findFirst({
    where: {
      referencia: {
        startsWith: `PP-${year}`,
      },
    },
    orderBy: {
      referencia: 'desc',
    },
  })

  let sequencial = 1
  if (ultimoRegistro) {
    const match = ultimoRegistro.referencia.match(/-(\d+)$/)
    const ultimoSequencial = match ? parseInt(match[1], 10) : 0
    sequencial = isNaN(ultimoSequencial) ? 1 : ultimoSequencial + 1
  }

  return `PP-${year}-${sequencial.toString().padStart(4, '0')}`
}

export async function gerarReferenciaTecido(): Promise<string> {
  const year = new Date().getFullYear()

  const ultimoRegistro = await prisma.corteTecido.findFirst({
    where: {
      referencia: {
        startsWith: `TEC-${year}`,
      },
    },
    orderBy: {
      referencia: 'desc',
    },
  })

  let sequencial = 1
  if (ultimoRegistro) {
    const match = ultimoRegistro.referencia.match(/-(\d+)$/)
    const ultimoSequencial = match ? parseInt(match[1], 10) : 0
    sequencial = isNaN(ultimoSequencial) ? 1 : ultimoSequencial + 1
  }

  return `TEC-${year}-${sequencial.toString().padStart(4, '0')}`
}
