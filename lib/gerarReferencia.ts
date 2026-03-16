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
    const partes = ultimoRegistro.referencia.split('-')
    const ultimoSequencial = parseInt(partes[partes.length - 1], 10)
    sequencial = ultimoSequencial + 1
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
    const partes = ultimoRegistro.referencia.split('-')
    const ultimoSequencial = parseInt(partes[partes.length - 1], 10)
    sequencial = ultimoSequencial + 1
  }

  return `TEC-${year}-${sequencial.toString().padStart(4, '0')}`
}
