import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { registrarLog } from '@/lib/log'
import { buildFichaTecnicaPdf, buildFichaCorteePdf } from '@/lib/pdf-templates'
import { generatePdf } from '@/lib/pdf-generator'
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
  const { type, corteId, recipient, modelagemIds, mensagem } = body as {
    type: 'ficha' | 'corte'
    corteId?: string
    recipient: string
    modelagemIds?: string[]
    mensagem?: string
  }

  if (!recipient) {
    return NextResponse.json({ error: 'E-mail destinatário obrigatório' }, { status: 400 })
  }

  // Restrição: se EMAIL_RESTRICT_TO_REGISTERED=true, só permite enviar para usuários cadastrados
  if (process.env.EMAIL_RESTRICT_TO_REGISTERED === 'true') {
    const registeredUser = await prisma.user.findFirst({
      where: { email: recipient, ativo: true },
    })
    if (!registeredUser) {
      return NextResponse.json(
        { error: 'Este e-mail não está cadastrado no sistema. Solicite ao administrador que cadastre o usuário.' },
        { status: 403 }
      )
    }
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

  const subject = type === 'corte'
    ? `Ficha de Corte – ${peca.nome || peca.referencia} (Nº ${corte!.numeroCorte})`
    : `Ficha Técnica – ${peca.nome || peca.referencia} (Ref: ${peca.referencia})`

  const pdfNome = type === 'corte'
    ? `ficha-corte-${peca.referencia}-n${corte!.numeroCorte}.pdf`
    : `ficha-tecnica-${peca.referencia}.pdf`

  // Gerar PDF da ficha
  const fichaHtml = type === 'corte'
    ? buildFichaCorteePdf(peca as any, corte as any, appUrl)
    : buildFichaTecnicaPdf(peca as any, appUrl)

  const pdfBuffer = await generatePdf(fichaHtml)

  // Montar anexos: PDF da ficha + arquivos de modelagem selecionados
  const attachments: { filename: string; content: Buffer; contentType?: string }[] = [
    { filename: pdfNome, content: pdfBuffer, contentType: 'application/pdf' },
  ]

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

  const bodyText = mensagem?.trim() || `Olá,\n\nSegue em anexo a ${type === 'corte' ? 'ficha de corte' : 'ficha técnica'} da peça ${peca.nome || peca.referencia}.\n\nAtenciosamente,\nJC Studio`

  const bodyHtml = bodyText
    .split('\n')
    .map(line => `<p style="margin:0 0 8px">${line || '&nbsp;'}</p>`)
    .join('')

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
      text: bodyText,
      html: `<div style="font-family:sans-serif;font-size:14px;color:#333">${bodyHtml}</div>`,
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
