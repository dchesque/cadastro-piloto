import { NextResponse } from 'next/server'

// TODO: gerar token de recuperação, gravar com TTL, enviar e-mail via nodemailer.
// Sempre retornamos sucesso para não revelar existência do usuário.
export async function POST() {
  return NextResponse.json({ ok: true, simulated: true })
}
