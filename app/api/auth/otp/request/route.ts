import { NextResponse } from 'next/server'

// TODO: integrar com nodemailer e armazenar OTP (Redis/DB) com TTL.
// Hoje retorna sucesso simulado para que o fluxo de UI funcione.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    if (!body?.email) {
      return NextResponse.json({ ok: false, message: 'E-mail obrigatório' }, { status: 400 })
    }
    return NextResponse.json({ ok: true, simulated: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
