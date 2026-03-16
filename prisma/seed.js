const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Pega das variáveis de ambiente ou usa o padrão (Seguro para deploy)
  const username = process.env.INITIAL_USER_USERNAME || 'admin';
  const password = process.env.INITIAL_USER_PASSWORD;

  if (!password) {
    console.log('⚠️ INITIAL_USER_PASSWORD não configurada. Pulando criação de usuário.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: {
      password: hashedPassword,
    },
    create: {
      username,
      password: hashedPassword,
      name: 'Administrador',
    },
  });

  console.log(`✅ Usuário "${username}" pronto para uso.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
