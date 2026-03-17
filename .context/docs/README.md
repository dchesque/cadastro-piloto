# Cadastro Piloto

Bem-vindo ao **Cadastro Piloto**, uma aplicação web full-stack construída com **Next.js 14 (App Router)**, **Tailwind CSS**, **Prisma (PostgreSQL)** e **NextAuth.js**. Projetada para gerenciamento de peças piloto, tecidos, cortes e fichas técnicas em fluxos de produção têxtil.

## 🚀 Visão Geral

Gerencie protótipos de roupas (**peças piloto**), estoques de tecidos, registros de cortes e impressão de etiquetas/fichas técnicas. Recursos principais:

- Autenticação segura com NextAuth.js (`/api/auth/[...nextauth]`).
- Upload de imagens (`/api/upload`).
- Geração automática de referências únicas (`gerarReferenciaPeca`, `gerarReferenciaTecido`).
- CRUD completo para **usuários**, **tecidos**, **peças** e **cortes**.
- Páginas imprimíveis com `PrintButton` (ex: fichas técnicas, etiquetas).

| Categoria     | Tecnologias                          |
|---------------|--------------------------------------|
| **Framework** | Next.js 14 (App Router)             |
| **Banco**     | PostgreSQL + Prisma                 |
| **UI**        | Tailwind CSS + shadcn/ui            |
| **Auth**      | NextAuth.js (config em `auth.ts`)   |
| **Validação** | Zod                                 |
| **Utils**     | clsx, twMerge, date-fns             |
| **Deploy**    | Docker (`docker-compose.yml`), Vercel |

## 🏗️ Arquitetura

```
.
├── app/                      # Páginas + API routes (App Router)
│   ├── api/                  # REST API (CRUD + auth)
│   │   ├── users/            # POST/GET users, PATCH password
│   │   ├── upload/           # POST imagens
│   │   ├── setup/            # POST inicial DB
│   │   ├── tecidos/          # GET/POST list, [id] CRUD, referencia GET
│   │   ├── pecas/            # GET/POST list, [id] CRUD, referencia GET, [id]/corte CRUD
│   │   └── auth/[...nextauth] # NextAuth
│   ├── (dashboard)/          # Rotas protegidas: dashboard, tecidos/*, pecas/*, minha-conta
│   ├── layout.tsx            # RootLayout (com AppShell, AuthProvider)
│   ├── page.tsx              # DashboardPage
│   ├── loading.tsx           # Loading
│   └── error.tsx             # Error
├── components/               # UI reutilizáveis
│   ├── app-shell.tsx         # AppShell (Navbar + Sidebar)
│   ├── auth-provider.tsx     # AuthProvider
│   ├── navbar.tsx            # Navbar (NavbarProps)
│   ├── sidebar.tsx           # SidebarNav (SidebarProps)
│   ├── print-button.tsx      # PrintButton
│   └── ui/                   # shadcn/ui (Button, Input, Label, Textarea, TypeBadge)
├── lib/                      # Utilitários
│   ├── utils.ts              # cn, formatCurrency/Date/Number/Decimal
│   └── gerarReferencia.ts    # gerarReferenciaPeca/Tecido
├── prisma/                   # schema.prisma + seed.js
├── public/                   # Assets estáticos
├── docs/                     # Documentação adicional
├── auth.ts                   # NextAuth config
├── middleware.ts             # Proteção de rotas (/dashboard/*)
├── next.config.ts
├── tailwind.config.ts
└── ... (package.json, tsconfig.json, docker-compose.yml)
```

**Páginas Principais** (protegidas por `middleware.ts`):
- `/` → DashboardPage
- `/login`
- `/minha-conta` → UserData
- `/tecidos` → Lista tecidos (CorteTecido)
- `/tecidos/novo`, `/tecidos/[id]`, `/tecidos/[id]/imprimir`
- `/pecas` → Lista peças (PecaPiloto)
- `/pecas/nova`, `/pecas/[id]`, `/pecas/[id]/ficha` (Material, Aviamento, Equipamento), `/pecas/[id]/imprimir`, `/pecas/[id]/corte`, `/pecas/[id]/corte/novo`, `/pecas/[id]/corte/[corteId]/imprimir`

## 📊 API REST (`app/api/`)

Endpoints com validação Zod, autenticação Bearer (exceto `/setup`, `/upload`, `/auth/*`).

| Endpoint                          | Métodos          | Descrição |
|-----------------------------------|------------------|-----------|
| `/api/users`                      | POST, GET        | Criar/listar usuários |
| `/api/users/password`             | PATCH            | Atualizar senha |
| `/api/upload`                     | POST             | Upload imagens (multipart/form-data) |
| `/api/setup`                      | POST             | Setup inicial DB (admin) |
| `/api/tecidos`                    | GET, POST        | Listar/criar tecidos |
| `/api/tecidos/[id]`               | GET, PUT, DELETE | Tecido específico |
| `/api/tecidos/referencia`         | GET              | Busca por referência |
| `/api/pecas`                      | GET, POST        | Listar/criar peças |
| `/api/pecas/[id]`                 | GET, PUT, DELETE | Peça específica |
| `/api/pecas/referencia`           | GET              | Busca por referência |
| `/api/pecas/[id]/corte`           | GET, POST        | Cortes da peça |
| `/api/pecas/[id]/corte/[corteId]` | GET, PUT, DELETE | Corte específico |

**Exemplo (Client-side fetch)**:
```ts
const token = await getSessionToken(); // Via AuthProvider
const res = await fetch('/api/pecas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    referencia: gerarReferenciaPeca(),
    descricao: 'Camisa Polo',
    // ... outros campos
  }),
});
const data = await res.json();
```

## 🔧 Utilitários (`lib/`)

| Função                    | Descrição                          | Exemplo |
|---------------------------|------------------------------------|---------|
| `cn(...classes: string[])`| ClassNames condicionais (clsx + twMerge) | `cn("btn", isActive && "bg-primary")` |
| `formatCurrency(num: number)` | R$ 1.234,56                  | `formatCurrency(1234.56)` |
| `formatDate(date: Date \| string)` | 01/01/2024                | `formatDate(new Date())` |
| `formatNumber(num: number)`| 1.234                        | `formatNumber(1234)` |
| `formatDecimal(num: number)`| 1,23                       | `formatDecimal(1.234)` |
| `gerarReferenciaPeca()`   | PEC-YYYY-NNN (único via DB) | `gerarReferenciaPeca()` |
| `gerarReferenciaTecido()` | TEC-YYYY-NNN (único via DB) | `gerarReferenciaTecido()` |

```ts
import { cn, formatCurrency, gerarReferenciaPeca } from '@/lib/utils';
import { gerarReferenciaTecido } from '@/lib/gerarReferencia';
```

## 🎨 Componentes UI (Principais Exportados)

| Componente      | Arquivo                       | Props/Usage |
|-----------------|-------------------------------|-------------|
| `AppShell`      | `components/app-shell.tsx`    | `<AppShell>{children}</AppShell>` |
| `AuthProvider`  | `components/auth-provider.tsx`| Wrapper auth (SessionProvider) |
| `Navbar`        | `components/navbar.tsx`       | `NavbarProps { user, onOpen }` |
| `PrintButton`   | `components/print-button.tsx` | `<PrintButton>Imprimir</PrintButton>` |
| `TypeBadge`     | `components/ui/type-badge.tsx`| `<TypeBadge type="Peca" />` (`Tipo` enum) |
| shadcn/ui       | `components/ui/*`             | `ButtonProps`, `InputProps`, `LabelProps`, `TextareaProps` |

**Exemplo PrintButton + TypeBadge**:
```tsx
import { PrintButton, TypeBadge } from '@/components';

<div>
  <TypeBadge type="Peca" />
  <PrintButton>Imprimir Ficha</PrintButton>
</div>
```

## 📈 Modelos de Domínio (Interfaces/Types)

Definidos em páginas (ex: `app/pecas/page.tsx`):
- `PecaPiloto`: Peça com detalhes (referencia, descricao, materiais, etc.).
- `CorteTecido`: Cortes (quantidade, data, tecido).
- `UserData`: Perfil (nome, email).
- `Material`, `Aviamento`, `Equipamento`: Itens ficha técnica.
- UI: `SidebarProps`, `NavbarProps`, `ButtonProps`, etc.
- `Tipo`: Enum para badges (Peca, Tecido, Corte).

Veja código fonte para defs completas (ex: `app/pecas/[id]/ficha/page.tsx`).

## 🚀 Iniciando o Projeto

1. **Clone e Instale**:
   ```bash
   git clone <repo> cadastro-piloto
   cd cadastro-piloto
   npm install
   ```

2. **Configuração (.env)**:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/cadastro_piloto"
   NEXTAUTH_SECRET="super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Banco de Dados**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed  # Executa prisma/seed.js
   ```

4. **Rodar**:
   ```bash
   npm run dev  # http://localhost:3000
   ```

5. **Build/Produção**:
   ```bash
   npm run build
   npm run start
   docker-compose up  # PostgreSQL + app
   ```

## 🤝 Contribuições

- **Branches**: `feat/adicinar-pdf`, `fix/api-corte`, `docs/atualizar-api`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`).
- **Lint/Testes**: `npm run lint`, `npm run build`. (Futuro: `__tests__/`, Playwright).
- **Dependências Chave**: `middleware.ts` (proteção), `auth.ts` (NextAuth), `lib/*` (utils).

## 📚 Documentação Adicional (docs/)

- [Visão Geral & Roadmap](project-overview.md)
- [Arquitetura Detalhada](architecture.md)
- [API Reference](api-reference.md)
- [Guia Dev](development-workflow.md)
- [Glossário](glossary.md)
- [Segurança](security.md)

## 📈 Roadmap

- ✅ CRUD completo + Auth + Impressão
- 🔄 Testes E2E (Playwright)
- 🔄 Export PDF/Relatórios
- 🔄 Mobile responsivo
- 🔄 Integração ERP/Estoque

**Gerado via análise automatizada. Última atualização: 2024.**
