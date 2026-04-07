import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

function checkSecret(req: Request | NextRequest): boolean {
  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) return false;
  return req.headers.get('authorization') === `Bearer ${setupSecret}`;
}

// Endpoint protegido por token para criação do usuário inicial
// Só funciona se SETUP_SECRET estiver configurado nas variaveis de ambiente
export async function POST(req: Request) {
  if (!process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'SETUP_SECRET não configurado' }, { status: 403 });
  }
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const username = process.env.INITIAL_USER_USERNAME || 'admin';
  const password = process.env.INITIAL_USER_PASSWORD;

  if (!password) {
    return NextResponse.json({ error: 'INITIAL_USER_PASSWORD não configurada' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { username },
      update: { password: hashedPassword, role: 'admin' },
      create: {
        username,
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin',
      },
      select: { id: true, username: true, name: true, role: true },
    });

    return NextResponse.json({ message: `✅ Usuário "${user.username}" (${user.role}) pronto para uso.`, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno ao criar usuário' }, { status: 500 });
  }
}

// PATCH /api/setup — promove um usuário existente para admin
// Body: { "username": "nome_do_usuario" }
export async function PATCH(req: NextRequest) {
  if (!process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'SETUP_SECRET não configurado' }, { status: 403 });
  }
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: 'username obrigatório' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { username },
      data: { role: 'admin', ativo: true },
      select: { id: true, username: true, name: true, role: true },
    });

    return NextResponse.json({ message: `✅ Usuário "${user.username}" promovido para admin.`, user });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
