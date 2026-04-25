import { NextResponse } from 'next/server'

// TODO: enviar e-mail real via nodemailer (configurar SMTP em env).
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    if (!body?.nome || !body?.email) {
      return NextResponse.json({ ok: false, message: 'Dados inválidos' }, { status: 400 })
    }
    return NextResponse.json({ ok: true, simulated: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
