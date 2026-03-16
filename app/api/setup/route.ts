import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Endpoint protegido por token para criação do usuário inicial
// Só funciona se SETUP_SECRET estiver configurado nas variaveis de ambiente
export async function POST(req: Request) {
  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret) {
    return NextResponse.json({ error: 'SETUP_SECRET não configurado' }, { status: 403 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${setupSecret}`) {
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
      update: { password: hashedPassword },
      create: {
        username,
        password: hashedPassword,
        name: 'Administrador',
      },
      select: { id: true, username: true, name: true },
    });

    return NextResponse.json({ message: `✅ Usuário "${user.username}" pronto para uso.`, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno ao criar usuário' }, { status: 500 });
  }
}
