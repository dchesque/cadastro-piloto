import { NextResponse } from 'next/server'

// TODO: validar OTP armazenado no backend e iniciar sessão via next-auth.
// Hoje retorna 501 para que a UI mostre mensagem de "configurar".
export async function POST() {
  return NextResponse.json(
    { ok: false, message: 'Login por código ainda não está configurado.' },
    { status: 501 },
  )
}
