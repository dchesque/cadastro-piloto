# Guia de Deploy da Aplicação Cadastro Piloto no EasyPanel

Este documento fornece instruções detalhadas e passo a passo para implantar a aplicação **Cadastro Piloto** (JC Plus Size) no [EasyPanel](https://easypanel.io/). A aplicação é construída com **Next.js 14+ (App Router)**, **Prisma** (PostgreSQL), **NextAuth.js** para autenticação e componentes UI personalizados (shadcn/ui).

## Pré-requisitos

- Conta ativa no [EasyPanel](https://easypanel.io/).
- Repositório Git com o código-fonte (recomendado: GitHub, GitLab ou Bitbucket).
- Conhecimento básico de Docker e variáveis de ambiente.
- Arquivos essenciais no repositório:
  - `Dockerfile` (na raiz, configurado para produção).
  - `prisma/schema.prisma` (modelos de dados para Peças, Tecidos, Usuários, Cortes).
  - `prisma/seed.js` (opcional, para dados iniciais).

## Variáveis de Ambiente Obrigatórias

Configure as seguintes variáveis no serviço de aplicação no EasyPanel. Elas são usadas em rotas API (`/api/users`, `/api/tecidos`, `/api/pecas`, `/api/auth/[...nextauth]`, etc.) e utils (`lib/utils.ts`, `lib/gerarReferencia.ts`).

| Variável                | Descrição | Exemplo |
|-------------------------|-----------|---------|
| `DATABASE_URL`         | Conexão com PostgreSQL (obtida no Passo 1). | `postgresql://user:pass@host:5432/dbname` |
| `NEXTAUTH_SECRET`      | Segredo para NextAuth.js (gere com `openssl rand -base64 32`). Obrigatório em produção. | `sua-chave-secreta-super-segura` |
| `NEXTAUTH_URL`         | URL base da app para callbacks de auth. | `https://sua-app.easypanel.host` |
| `NEXT_PUBLIC_APP_URL`  | URL pública (usada em links, emails, etc.). | `https://sua-app.easypanel.host` |
| `NODE_ENV`             | Modo de execução (defina como `production`). | `production` |

**Opcionais (para features avançadas):**
- `NEXTAUTH_GOOGLE_ID` / `NEXTAUTH_GOOGLE_SECRET`: Para login Google.
- `SMTP_*`: Para reset de senha (`/api/users/password`).
- `UPLOAD_DIR`: Diretório para uploads locais (`/api/upload`).

**Dica**: Copie de um `.env.example` local e teste localmente com `pnpm dev`.

## Passo 1: Criar Serviço PostgreSQL

1. Acesse o painel do EasyPanel e clique em **"Add Service"**.
2. Selecione **"PostgreSQL"**.
3. Configure:
   - **Nome**: `cadastro-piloto-db`.
   - **Usuário/Senha**: Defina credenciais fortes.
   - **Versão**: 15+ (compatível com Prisma).
4. Copie a `DATABASE_URL` gerada (exibida no dashboard do serviço).

**Backup**: Ative backups automáticos nas configurações do serviço.

## Passo 2: Criar Serviço de Aplicação

1. Clique em **"Add Service"**.
2. Selecione **"App"** (Node.js/Next.js).
3. Configure:
   - **Nome**: `cadastro-piloto`.
   - **Repositório**: Conecte Git (branch `main`) ou faça upload ZIP.
   - **Porta**: 3000 (padrão Next.js).
   - **Dockerfile**: Use o da raiz (auto-detectado).
   - **Build Command**: `pnpm install && pnpm build` (ou `npm run build`).
   - **Start Command**: Ignorado (Dockerfile define).

O `Dockerfile` cuida de:
- Instalação de dependências (`pnpm install --frozen-lockfile`).
- Geração do Prisma Client (`prisma generate`).
- Migrations (`prisma migrate deploy`).
- Execução em produção (`node server.js` ou `next start`).

## Passo 3: Configurar Variáveis de Ambiente

No serviço de app:
1. Vá em **"Environment"**.
2. Adicione as variáveis listadas acima.
3. Salve e reinicie se necessário.

## Passo 4: Deploy Inicial

1. Clique **"Deploy"**.
2. Monitore os logs em tempo real:
   - Verifique `prisma migrate deploy` (cria tabelas: `User`, `Peca`, `Tecido`, `Corte`, etc.).
   - Confirme `Prisma Client` gerado.
   - App inicia em porta 3000.
3. Tempo estimado: 2-5 minutos.

**Executar Seed (Opcional)**:
- Adicione ao Dockerfile ou rode manualmente via console: `node prisma/seed.js`.

## Passo 5: Configuração Pós-Deploy

1. **Acesse a App**: Use a URL gerada (ex: `https://cadastro-piloto.seu-servidor.com`).
2. **Primeiro Login**:
   - Crie usuário via `/api/setup` (POST) ou registre via UI.
3. **Teste Rotas Principais**:
   | Rota | Método | Descrição |
   |------|--------|-----------|
   | `/api/tecidos` | GET/POST | Listar/criar tecidos. |
   | `/api/pecas` | GET/POST | Listar/criar peças piloto. |
   | `/api/pecas/[id]/corte` | GET/POST | Gerenciar cortes. |
   | `/api/auth/[...nextauth]` | POST | Autenticação. |

4. **Impressão**: Teste botões de impressão em `/pecas/[id]/imprimir` e `/tecidos/[id]/imprimir`.

## Atualizações e CI/CD

- **Git Push**: Push para `main` → Auto-deploy (ative webhook no EasyPanel).
- **Manual**: Clique **"Redeploy"**.
- **Rollback**: Use histórico de deploys.

## Solução de Problemas

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| **Migrations falham** | `DATABASE_URL` errada. | Verifique conexão; rode `npx prisma db push` localmente. |
| **Auth falha** | `NEXTAUTH_SECRET` ausente. | Gere e adicione; limpe cookies. |
| **Upload falha** (`/api/upload`) | Permissões de disco. | Verifique `UPLOAD_DIR` e logs. |
| **Build falha** | Dependências ausentes. | Logs: cheque `pnpm install`; atualize `package.json`. |
| **"PrismaClientInitializationError"** | Client não gerado. | Confirme `prisma generate` no Dockerfile. |
| **Logs não visíveis** | Serviço parado. | Reinicie e cheque **"Logs"** no dashboard. |

**Debug Local Antes**:
```bash
pnpm install
cp .env.example .env
npx prisma migrate dev
pnpm build
pnpm start
```

## Monitoramento e Escalabilidade

- **Logs**: Real-time no EasyPanel.
- **Métricas**: CPU/RAM no dashboard.
- **Escala**: Adicione workers para uploads pesados.
- **Domínio Custom**: Configure SSL via EasyPanel.

## Relacionados

- [Prisma Schema](./prisma/schema.prisma): Modelos de dados.
- [Utils](./lib/utils.ts): Formatação (moeda, datas).
- [API Routes](./app/api/): Endpoints listados no [Public API](#).
- [Auth](./app/api/auth/[...nextauth]/route.ts): NextAuth config.

Para suporte, verifique issues no repositório ou docs do EasyPanel. Deploy bem-sucedido! 🚀
