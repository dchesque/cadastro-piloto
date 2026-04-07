import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

function isAdmin(session: any) {
  return session?.user?.role === 'admin'
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })

  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, name: true, role: true, ativo: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })

  const { username, password, name, email, role } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Usuário e senha são obrigatórios' }, { status: 400 })
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } })
  if (existingUsername) {
    return NextResponse.json({ error: 'Este nome de usuário já está em uso' }, { status: 400 })
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: 'Este e-mail já está em uso' }, { status: 400 })
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      email: email || null,
      role: role === 'admin' ? 'admin' : 'user',
    },
    select: { id: true, username: true, email: true, name: true, role: true, ativo: true, createdAt: true },
  })

  return NextResponse.json(user)
}
