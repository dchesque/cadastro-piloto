import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

function isAdmin(session: any) {
  return session?.user?.role === 'admin'
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })

  const { id } = await params
  const { name, email, role, ativo } = await req.json()

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  // Impede remoção do próprio role de admin
  if (existing.id === session.user?.id && role !== 'admin') {
    return NextResponse.json({ error: 'Você não pode remover seu próprio acesso de admin' }, { status: 400 })
  }

  if (email && email !== existing.email) {
    const emailInUse = await prisma.user.findUnique({ where: { email } })
    if (emailInUse) return NextResponse.json({ error: 'Este e-mail já está em uso' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      email: email !== undefined ? (email || null) : existing.email,
      role: role === 'admin' ? 'admin' : 'user',
      ativo: typeof ativo === 'boolean' ? ativo : existing.ativo,
    },
    select: { id: true, username: true, email: true, name: true, role: true, ativo: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })

  const { id } = await params

  if (id === session.user?.id) {
    return NextResponse.json({ error: 'Você não pode excluir sua própria conta' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

// Admin pode redefinir senha de qualquer usuário
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const { newPassword, currentPassword } = await req.json()

  // Admin pode redefinir qualquer senha sem currentPassword
  if (isAdmin(session) && id !== session.user?.id) {
    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: 'Nova senha deve ter no mínimo 4 caracteres' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id }, data: { password: hashed } })
    return NextResponse.json({ success: true })
  }

  // Usuário alterando a própria senha: exige currentPassword
  if (id !== session.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Senha atual e nova senha são obrigatórias' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const match = await bcrypt.compare(currentPassword, user.password)
  if (!match) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id }, data: { password: hashed } })
  return NextResponse.json({ success: true })
}
