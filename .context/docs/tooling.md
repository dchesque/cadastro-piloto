# Tooling & Productivity Guide

This guide covers setup, development, maintenance, and productivity tools for the **Cadastro Piloto** project—a Next.js 14+ (App Router) application with Prisma (PostgreSQL), Tailwind CSS + [shadcn/ui](https://ui.shadcn.com), NextAuth, and Docker. Focuses on fast iteration, code quality, and reproducibility.

Key principles:
- **One-command spins**: Docker Compose for full stack.
- **Zero-config DX**: Husky hooks, Prettier, ESLint, TypeScript.
- **Schema-driven**: Prisma for DB + migrations.
- **Efficient deps**: pnpm for installs/scripts.

Cross-reference: [development-workflow.md](./development-workflow.md) for workflows (e.g., CI/CD).

## Prerequisites

| Tool | Version | Install | Verify |
|------|---------|---------|--------|
| [Node.js](https://nodejs.org) | ≥18.17 (LTS 20+) | `nvm install 20` | `node -v` |
| [pnpm](https://pnpm.io) | ≥8.0 | `npm i -g pnpm` | `pnpm -v` |
| [Docker Compose](https://docker.com) | ≥20 & ≥2.20 | Docker Desktop | `docker --version`<br>`docker compose version` |
| [Git](https://git-scm.com) | ≥2.30 | OS package | `git --version` |
| [Prisma CLI](https://prisma.io) | ≥5.0 | `pnpm add -D prisma` | `npx prisma --version` |

**Post-clone**:
```bash
pnpm install  # Installs deps + Husky hooks
```

## Core Scripts

From [package.json](../package.json):

```bash
# Dev & Build
pnpm dev          # Dev server: http://localhost:3000 (HMR + fast refresh)
pnpm build        # Prod build (checks types/lint)
pnpm start        # Prod server (after build)
pnpm type-check   # tsc --noEmit (strict TS)

# Quality Gates
pnpm lint         # ESLint (TSX, Next.js rules)
pnpm lint:fix     # Auto-fix lint
pnpm format       # Prettier all files
pnpm format:check # Validate formatting

# Docker (via compose)
docker compose up -d          # DB + app (background)
docker compose up --build     # Rebuild images
docker compose down --volumes # Full cleanup
```

**Recommended dev flow**: `docker compose up -d postgres && pnpm dev`

## Docker Compose Workflow

[docker-compose.yml](../docker-compose.yml) defines:
- **postgres**: Persistent PostgreSQL (prod-like).
- **app**: Next.js container (dev volumes for HMR).

```bash
docker compose up -d              # Start stack
docker compose logs -f app        # Follow app logs
docker compose exec app sh        # Shell in app container
docker compose exec postgres psql # DB shell
```

**Volumes**: `./prisma/migrations` & app src auto-sync. No local DB needed.

## Database (Prisma)

Models in [prisma/schema.prisma](../prisma/schema.prisma): `User`, `Tecido`, `Peca`, `Corte`, etc. API routes ([app/api/tecidos](../app/api/tecidos), [app/api/pecas](../app/api/pecas)) use Prisma Client for CRUD.

Commands:
```bash
npx prisma generate      # Regenerate client
npx prisma db push       # Dev schema sync (no migration)
npx prisma migrate dev   # Migration + apply
npx prisma db seed       # Run [prisma/seed.js](../prisma/seed.js) (`main()` function)
npx prisma studio        # GUI: http://localhost:5555
npx prisma validate      # Schema check
```

**Quickstart**:
1. `cp .env.example .env` (set `DATABASE_URL="postgresql://..."`).
2. `docker compose up -d postgres`.
3. `npx prisma db push && npx prisma generate && npx prisma db seed`.

## Git Hooks (Husky + lint-staged)

Auto-enforced on commit:
- `lint:fix` + `format` + `type-check` (staged files only).

Setup: `pnpm install` (runs `husky install`).
Test: `git commit -m "test" --no-verify` (bypass if needed).

**Config**: [.husky/pre-commit](../.husky/pre-commit), [lintstagedrc.json](../lintstagedrc.json).

## Key Utilities (`lib/`)

Exported helpers for consistent code:

| Utility | File | Usage Example |
|---------|------|---------------|
| `cn` | [lib/utils.ts](../lib/utils.ts) | `cn("base", variant && "variant")` – Tailwind class merger |
| `formatCurrency` | [lib/utils.ts](../lib/utils.ts) | `formatCurrency(1234.56)` → `"R$ 1.234,56"` |
| `formatDate` / `formatNumber` / `formatDecimal` | [lib/utils.ts](../lib/utils.ts) | Date/number BR formatting |
| `gerarReferenciaPeca` / `gerarReferenciaTecido` | [lib/gerarReferencia.ts](../lib/gerarReferencia.ts) | Auto-generate refs for Peca/Tecido |

```tsx
// Example in component
import { cn, formatCurrency } from '@/lib/utils';

<Button className={cn("w-full", isLoading && "opacity-50")}>
  {formatCurrency(total)}
</Button>
```

## shadcn/ui & Components

Primitives in [components/ui](../components/ui/):
- Exported: `ButtonProps`, `InputProps`, `LabelProps`, `TextareaProps`.

Add new:
```bash
npx shadcn@latest add dialog table
```

Key app components (exported):
- `AppShell` ([components/app-shell.tsx](../components/app-shell.tsx))
- `AuthProvider` ([components/auth-provider.tsx](../components/auth-provider.tsx))
- `Navbar` ([components/navbar.tsx](../components/navbar.tsx))
- `PrintButton` ([components/print-button.tsx](../components/print-button.tsx))
- `TypeBadge` ([components/ui/type-badge.tsx](../components/ui/type-badge.tsx))

## API Endpoints Quick Ref

App Router handlers ([app/api](../app/api/)) – Test with Thunder Client/cURL:

| Method | Path | File | Purpose |
|--------|------|------|---------|
| GET/POST | /api/users | [users/route.ts](../app/api/users/route.ts) | List/create users |
| POST | /api/upload | [upload/route.ts](../app/api/upload/route.ts) | File uploads |
| GET/POST | /api/tecidos | [tecidos/route.ts](../app/api/tecidos/route.ts) | Fabrics list/create |
| GET/PUT/DELETE | /api/tecidos/[id] | [tecidos/[id]/route.ts](../app/api/tecidos/[id]/route.ts) | Fabric CRUD |
| GET | /api/tecidos/referencia | [referencia/route.ts](../app/api/tecidos/referencia/route.ts) | Ref lookup |
| GET/POST | /api/pecas | [pecas/route.ts](../app/api/pecas/route.ts) | Pieces list/create |
| GET/PUT/DELETE | /api/pecas/[id] | [pecas/[id]/route.ts](../app/api/pecas/[id]/route.ts) | Piece CRUD |
| GET | /api/pecas/referencia | [referencia/route.ts](../app/api/pecas/referencia/route.ts) | Piece ref lookup |
| GET/POST | /api/pecas/[id]/corte | [corte/route.ts](../app/api/pecas/[id]/corte/route.ts) | Cuts list/create |
| GET/PUT/DELETE | /api/pecas/[id]/corte/[corteId] | [corte/[corteId]/route.ts](../app/api/pecas/[id]/corte/[corteId]/route.ts) | Cut CRUD |
| PATCH | /api/users/password | [password/route.ts](../app/api/users/password/route.ts) | Password update |
| POST | /api/setup | [setup/route.ts](../app/api/setup/route.ts) | Initial setup |
| [...] | /api/auth/[...nextauth] | [auth/[...nextauth]/route.ts](../app/api/auth/[...nextauth]/route.ts) | NextAuth |

Example: `curl http://localhost:3000/api/tecidos` → JSON list.

## IDE Setup (VS Code)

**.vscode/settings.json](../.vscode/settings.json)** enables:
- Format on save (Prettier).
- ESLint fix.
- Tailwind regex for `cn()`.

Extensions:
| Extension | ID | Benefit |
|-----------|----|---------|
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` | Class previews in `cn()` |
| ESLint | `dbaeumer.vscode-eslint` | Live errors/fix |
| Prettier | `esbenp.prettier-vscode` | Format on save |
| Prisma | `prisma.prisma` | Schema IntelliSense |
| Next.js Snippets | `ms-vscode.nextjs-snippets` | App Router templates |
| GitLens | `eamodio.gitlens` | Inline git history |
| Thunder Client | `rangav.vscode-thunder-client` | API testing |

## Productivity Tips

**Shell Aliases** (`~/.zshrc`/`~/.bashrc`):
```bash
alias dp='docker compose up -d'
alias dlog='docker compose logs -f'
alias pr='npx prisma'
alias dev='pnpm dev'
alias rebuild='pnpm build && pnpm start'
```

**Daily Sequence**:
1. `docker compose up -d`
2. `pnpm dev`
3. Edit → Auto-reload + hooks.

**Debug**:
- Types: `pnpm type-check`
- APIs: Thunder Client + AuthProvider sessions.
- Prints: `PrintButton` for ficha/imprimir pages.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| DB connect fail | `docker compose logs postgres`; check `DATABASE_URL` |
| Prisma err | `npx prisma validate`; `db push` |
| Build/lint fail | `pnpm lint:fix && pnpm format && pnpm type-check` |
| Hooks skip | `pnpm husky install` |
| Tailwind missing | Restart TS server; check `tailwind.config.js` |
| Auth issues | Check NextAuth in `AuthProvider` + `.env` secrets |

## Related Resources

- [package.json](../package.json) – Deps/scripts.
- [prisma/schema.prisma](../prisma/schema.prisma) – Models (Tecido, Peca, etc.).
- [docker-compose.yml](../docker-compose.yml) – Services.
- [lib/utils.ts](../lib/utils.ts) – `cn`, formatters.
- [middleware.ts](../middleware.ts) – Auth guards.
- Docs: [Next.js App Router](https://nextjs.org/docs/app), [Prisma](https://prisma.io/docs).
