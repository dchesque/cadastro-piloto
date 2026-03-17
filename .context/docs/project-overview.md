# Cadastro Piloto - Project Overview

Cadastro Piloto is a web application designed for tailors, small garment manufacturers, and production teams to streamline pilot production workflows. It enables registration of fabrics (**tecidos**), creation of custom pieces (**peças**) with materials, trims (**aviamentos**), and equipment details, automatic generation of unique references, management of cuts (**cortes**), and on-demand printing of fichas (spec sheets) and labels. The app reduces errors, saves time on inventory tracking, and provides a clean, protected dashboard for CRUD operations.

## Quick Facts

- **Repository Root**: `C:\Workspace\cadastro-piloto`
- **Languages**: TypeScript (~50 files, primary), JavaScript (~6 files)
- **Framework**: Next.js 14+ (App Router)
- **Entry Points**:
  - `app/layout.tsx` → [`RootLayout`](app/layout.tsx#L26) (app shell with auth, navbar, sidebar)
  - `app/page.tsx` → [`DashboardPage`](app/page.tsx#L10) (protected home)
  - `middleware.ts` → Route protection
  - `app/api/auth/[...nextauth]/route.ts` → NextAuth handlers
- **Database**: Prisma ORM (models: users, tecidos, peças, cortes)
- **Dev Server**: `npm run dev` → `http://localhost:3000`
- **Full Analysis**: [codebase-map.json](./codebase-map.json)

## Architecture Overview

The project follows Next.js App Router patterns with clear separation of concerns:

```
Utils (lib/)
├── utils.ts (cn, formatCurrency, formatDate, formatNumber, formatDecimal)
└── gerarReferencia.ts (gerarReferenciaPeca, gerarReferenciaTecido)

Controllers (app/api/)
├── users/ (GET/POST users, PATCH password)
├── upload/ (POST)
├── setup/ (POST)
├── tecidos/ (GET/POST list, GET/PUT/DELETE [id], GET referencia)
└── pecas/ (GET/POST list, GET/PUT/DELETE [id], GET referencia, [id]/corte (GET/POST), [id]/corte/[corteId] (GET/PUT/DELETE))

Components (components/)
├── ui/ (shadcn: Button, Input, Label, Textarea, TypeBadge)
├── AppShell, AuthProvider, Navbar, Sidebar, PrintButton

Pages (app/)
├── layout.tsx (RootLayout)
├── page.tsx (DashboardPage)
├── login/, minha-conta/
├── tecidos/ (list, [id], novo, [id]/imprimir)
└── pecas/ (list, [id], nova, [id]/ficha, [id]/imprimir, [id]/corte/novo, [id]/corte/[corteId]/imprimir)
```

- **Pages & UI** (`app/`): Dashboard, login, minha-conta, tecidos/peças management (list, detail, novo, imprimir, ficha, corte novo/imprimir).
- **API Routes** (`app/api/`): CRUD for users, uploads, setup, tecidos (list, [id], referencia), peças (list, [id], referencia, [id]/corte, [id]/corte/[corteId]).
- **Components** (`components/`): Reusable UI (shadcn primitives: Button, Input, Label, Textarea, TypeBadge), AppShell, Navbar, Sidebar, AuthProvider, PrintButton.
- **Utils** (`lib/`): `cn` (className helper), formatting (`formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal`), reference generators (`gerarReferenciaPeca`, `gerarReferenciaTecido`).
- **Data & Auth**: Prisma (`prisma/schema.prisma`, `seed.js`), NextAuth (`auth.ts`).
- **Static**: `public/` (print templates, assets).

**Key Dependencies**:
- `middleware.ts` → Auth guard
- `auth.ts` → NextAuth config
- `lib/gerarReferencia.ts` → Reference utils
- `app/layout.tsx` → Core layout

See [architecture.md](./architecture.md) for diagrams and layers.

## Key Exports & Public API

### Components
| Symbol | File | Description |
|--------|------|-------------|
| `AppShell` | [components/app-shell.tsx:9](components/app-shell.tsx#L9) | Main app wrapper with sidebar/navbar. |
| `AuthProvider` | [components/auth-provider.tsx:5](components/auth-provider.tsx#L5) | Session context provider. |
| `Navbar` | [components/navbar.tsx:10](components/navbar.tsx#L10) | Top navigation bar. |
| `PrintButton` | [components/print-button.tsx:3](components/print-button.tsx#L3) | Client-side print trigger for fichas/labels. |
| `TypeBadge` | [components/ui/type-badge.tsx:10](components/ui/type-badge.tsx#L10) | Badge for tipos (e.g., tecido/peca). |
| `ButtonProps`, `InputProps`, `LabelProps`, `TextareaProps` | `components/ui/*` | shadcn UI primitives. |

### Utilities
| Symbol | File | Description |
|--------|------|-------------|
| `cn` | [lib/utils.ts:4](lib/utils.ts#L4) | Tailwind className merger. |
| `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal` | [lib/utils.ts](lib/utils.ts) | Formatting helpers. |
| `gerarReferenciaPeca`, `gerarReferenciaTecido` | [lib/gerarReferencia.ts](lib/gerarReferencia.ts) | Auto-generate unique refs (e.g., "PC-2024-001"). |

### Pages & Handlers
- Pages: `DashboardPage`, `RootLayout`, `Loading`, `Error`.
- API Handlers: GET/POST/PUT/DELETE for `/api/users`, `/api/upload`, `/api/tecidos`, `/api/pecas`, `/api/setup`, cortes sub-routes.

**Symbol Index**:
- **Interfaces**: `SidebarProps`, `NavbarProps`, `PecaPiloto`, `CorteTecido`, `UserData`, `Material`, `Aviamento`, `Equipamento`.
- **Types**: `Tipo`, `FieldProps`.
- Full list: [codebase-map.json](./codebase-map.json).

**Usage Examples**:
```tsx
// Tailwind class merging
import { cn } from '@/lib/utils';
cn("btn-primary", "hover:bg-blue-600"); // Merges classes safely
```

```ts
// Reference generation (used in tecidos/pecas forms)
import { gerarReferenciaPeca } from '@/lib/gerarReferencia';
const pecaRef = gerarReferenciaPeca(); // e.g., "PC-2024-001"
```

## Technology Stack

| Category | Tools |
|----------|-------|
| **Core** | Next.js 14+ (App Router, RSC, Server Actions), React 18+ |
| **Auth** | NextAuth.js (email/password) |
| **Database** | Prisma ORM + PostgreSQL/SQLite |
| **UI/Styling** | Tailwind CSS, shadcn/ui, lucide-react (icons), class-variance-authority (CVA) |
| **DevOps** | ESLint, Prettier, TypeScript, Docker Compose |
| **Build** | Turbopack, npm/yarn |

Portuguese UI; responsive with collapsible sidebar.

## Getting Started

1. **Clone & Install**:
   ```
   git clone <repo> && cd cadastro-piloto
   npm install
   ```

2. **Environment** (`.env.local` from `.env.example`):
   ```
   DATABASE_URL="file:./dev.db"  # or postgresql://...
   NEXTAUTH_SECRET="somerandomsecret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Database**:
   ```
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed  # Creates admin user
   ```

4. **Run**:
   ```
   npm run dev  # http://localhost:3000
   ```

5. **Test Flow**:
   - Login as admin (seeded).
   - Criar tecido → peça → adicionar corte → imprimir ficha/label.

**Commands**:
- `npm run build && npm start` (prod).
- `npm run lint` / `npm run format`.
- Docker: `docker compose up`.

See [tooling.md](./tooling.md), [development-workflow.md](./development-workflow.md).

## Workflows & Features

- **Tecidos**: CRUD, ref search (`/api/tecidos/referencia`), print labels.
- **Peças**: CRUD with materials/aviamentos/equipamentos, ref search, cortes (sub-resource CRUD), ficha/imprimir.
- **Users**: Profile, password update.
- **Uploads**: File handling (`/api/upload`).
- **Prints**: `PrintButton` for client-side printing.
- **Auth/Protected**: Middleware + `AuthProvider`.

Cross-references:
- [API Routes](architecture.md#controllers)
- [Print Flows](app/pecas/[id]/ficha/page.tsx), [app/pecas/[id]/corte/[corteId]/imprimir/page.tsx)

## Next Steps & Roadmap

- MVP: Production tracking for ateliê.
- Future: PWA, reports/CSV export, multi-user roles, supplier integrations.
- Contribute: [development-workflow.md](./development-workflow.md).

**Resources**:
- [architecture.md](./architecture.md)
- [codebase-map.json](./codebase-map.json)
- [Prisma](https://prisma.io), [NextAuth](https://authjs.dev)
