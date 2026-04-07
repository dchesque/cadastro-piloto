import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { registrarLog } from '@/lib/log'
import { buildFichaTecnicaHtml, buildFichaCorteHtml } from '@/lib/email-templates'
import nodemailer from 'nodemailer'
import { readFileSync } from 'fs'
import path from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params

  const body = await request.json()
  const { type, corteId, recipient, modelagemIds } = body as {
    type: 'ficha' | 'corte'
    corteId?: string
    recipient: string
    modelagemIds?: string[]
  }

  if (!recipient) {
    return NextResponse.json({ error: 'E-mail destinatário obrigatório' }, { status: 400 })
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ error: 'SMTP não configurado no servidor' }, { status: 500 })
  }

  const peca = await prisma.pecaPiloto.findUnique({
    where: { id },
    include: {
      materiais: { orderBy: { createdAt: 'asc' } },
      aviamentos: { orderBy: { createdAt: 'asc' } },
      equipamentos: { orderBy: { createdAt: 'asc' } },
      modelagens: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!peca) return NextResponse.json({ error: 'Peça não encontrada' }, { status: 404 })

  let corte = null
  if (type === 'corte') {
    if (!corteId) return NextResponse.json({ error: 'corteId obrigatório para ficha de corte' }, { status: 400 })
    corte = await prisma.pecaCorte.findUnique({
      where: { id: corteId },
      include: { items: true },
    })
    if (!corte) return NextResponse.json({ error: 'Corte não encontrado' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const html = type === 'corte'
    ? buildFichaCorteHtml(peca as any, corte as any, appUrl)
    : buildFichaTecnicaHtml(peca as any, appUrl)

  const subject = type === 'corte'
    ? `Ficha de Corte – ${peca.nome || peca.referencia} (Nº ${corte!.numeroCorte})`
    : `Ficha Técnica – ${peca.nome || peca.referencia} (Ref: ${peca.referencia})`

  // Montar anexos de modelagem selecionados
  const attachments: { filename: string; content: Buffer }[] = []
  if (modelagemIds && modelagemIds.length > 0) {
    const modelagensSelecionadas = peca.modelagens.filter(m => modelagemIds.includes(m.id))
    for (const mod of modelagensSelecionadas) {
      const filePath = path.join(process.cwd(), 'public', mod.url)
      try {
        const content = readFileSync(filePath)
        attachments.push({ filename: mod.nome, content })
      } catch {
        console.warn(`Arquivo de modelagem não encontrado, ignorando: ${filePath}`)
      }
    }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      subject,
      html,
      attachments,
    })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return NextResponse.json({ error: 'Erro ao enviar e-mail. Verifique as configurações SMTP.' }, { status: 500 })
  }

  const usuario = session.user?.name ?? (session.user as any)?.username ?? 'Sistema'
  await registrarLog({
    entidade: 'PecaPiloto',
    entidadeId: id,
    entidadeRef: peca.referencia,
    acao: 'email_enviado',
    usuario,
    descricao: type === 'corte' ? `Ficha de Corte Nº ${corte!.numeroCorte}` : 'Ficha Técnica',
    destinatario: recipient,
  })

  return NextResponse.json({ success: true })
}
