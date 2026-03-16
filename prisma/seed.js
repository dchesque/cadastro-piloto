const { PrismaClient } = require('@prisma/client');

// Tenta encontrar bcryptjs em vários caminhos (standalone build)
let bcrypt;
const possiblePaths = [
  'bcryptjs',
  '/app/.next/standalone/node_modules/bcryptjs',
  '/app/node_modules/bcryptjs',
];
for (const p of possiblePaths) {
  try { bcrypt = require(p); break; } catch (_) {}
}
if (!bcrypt) throw new Error('bcryptjs não encontrado. Verifique a instalação.');

const prisma = new PrismaClient();

async function main() {
  const username = process.env.INITIAL_USER_USERNAME || 'admin';
  const password = process.env.INITIAL_USER_PASSWORD;

  if (!password) {
    console.log('⚠️ INITIAL_USER_PASSWORD não configurada. Pulando criação de usuário.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: { password: hashedPassword },
    create: {
      username,
      password: hashedPassword,
      name: 'Administrador',
    },
  });

  console.log(`✅ Usuário "${username}" pronto para uso.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
