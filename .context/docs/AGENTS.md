# AGENTS.md

## Overview
This document guides AI agents and contributors in developing and maintaining the **Cadastro Piloto** application—a Next.js 14+ app with App Router for managing users, fabrics (`tecidos`), pilot pieces (`pecas`), and cuts (`corte`). It uses Prisma for database operations, NextAuth for authentication, and shadcn/ui for components.

Focus on:
- Adding features like new CRUD operations for entities.
- Enhancing UI/UX for production workflows (e.g., printing fichas, cortes).
- Ensuring type safety with TypeScript.
- Following conventions: API routes in `app/api/`, pages in `app/`, utils in `lib/`.

Cross-reference: [README.md](../README.md) for setup, [docs/API.md](API.md) for endpoints (if exists).

## Dev Environment Tips
- **Prerequisites**: Node.js 18+, PostgreSQL (via Docker or local), Prisma CLI (`npm i prisma -g`).
- **Install**: `npm install`.
- **Database Setup**:
  1. Copy `.env.example` to `.env.local`.
  2. Update `DATABASE_URL`.
  3. `npx prisma generate && npx prisma db push` (dev) or `npx prisma migrate dev` (prod-like).
  4. Seed: `node prisma/seed.js`.
- **Run Dev Server**: `npm run dev` (localhost:3000).
- **Build & Start**: `npm run build && npm run start`.
- **Lint & Format**: `npm run lint` and `npm run format`.
- **Iterate Safely**: Use `npm run dev` with hot reload; test DB changes in a dev branch.
- **VS Code Tips**: Install "Prisma" and "ES7+ React/Redux snippets" extensions.

## Testing Instructions
- **Unit/Integration Tests**: `npm run test` (Jest + React Testing Library).
- **Watch Mode**: `npm run test -- --watch`.
- **Coverage**: `npm run test -- --coverage`.
- **E2E (Playwright/Cypress)**: If added, `npm run test:e2e`.
- **Pre-PR Checklist**: `npm run build && npm run test && npm run lint`.
- **Key Areas to Test**:
  - API endpoints (e.g., `POST /api/tecidos`, auth guards).
  - UI interactions (forms, prints).
  - Edge cases: Invalid refs, permissions, empty states.
- Add tests in `__tests__/` or alongside files (e.g., `app/api/tecidos/route.test.ts`).

## PR Instructions
- **Commits**: Use Conventional Commits (e.g., `feat(tecidos): add bulk upload`, `fix(pecas): reference collision`, `docs(api): update endpoints`).
- **Branching**: `feat/[ticket]-description` or `fix/[bug]-description`.
- **Checklist**:
  - Update CHANGELOG.md (unreleased section).
  - Add/update tests (100% coverage for new code).
  - Verify build: `npm run build`.
  - Test locally + DB migrations.
  - Cross-link related docs (e.g., AGENTS.md, API.md).
- **Screenshots/Demos**: Include for UI changes (e.g., new ficha print).
- **Releases**: PR to `main`; CI auto-tags vX.Y.Z.

## Repository Map
| Path | Description | When to Edit |
|------|-------------|--------------|
| `app/` | Next.js App Router core: pages (dashboard, login, tecidos/[id], pecas/[id]/corte), layouts (`layout.tsx`, `loading.tsx`), errors (`error.tsx`). | Add new pages/routes (e.g., reports), update navigation, fix loading states. Avoid static exports. |
| `app/api/` | API routes for CRUD: users, upload, tecidos (list/create/update/[id]/ref), pecas (list/create/update/[id]/ref/[id]/corte), auth (`[...nextauth]`). Exports: GET/POST/PUT/DELETE handlers. | Extend endpoints (e.g., new entity like `aviamentos`), add validation/auth. Use `lib/utils.ts` for helpers. |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth.js handlers for sign-in/out, session. | Customize providers (e.g., add Google), callbacks. |
| `auth.ts` (likely `lib/auth.ts` or middleware) | Auth utils/middleware (imported in routes/layouts). | Update session logic, role-based access. |
| `CHANGELOG.md` | Release notes by version. | Add entries for every PR (feat/fix). |
| `components/` | Reusable UI: `app-shell.tsx`, `navbar.tsx`, `sidebar.tsx`, `print-button.tsx`, `auth-provider.tsx`, ui/ (shadcn: button, input, label, textarea, type-badge). Props: `ButtonProps`, `NavbarProps`, etc. | New components (e.g., DataTable for lists), style tweaks. Use `cn()` for Tailwind. |
| `lib/` | Utils: `utils.ts` (cn, formatCurrency/Date/Number/Decimal), `gerarReferencia.ts` (auto-gen refs for pecas/tecidos). | Add formatters, helpers (e.g., PDF gen). |
| `prisma/` | DB schema (`schema.prisma`: User, Tecido, Peca, Corte?), seed (`seed.js`). | New models/relations (e.g., Aviamento), migrations. Run `prisma studio` for inspection. |
| `middleware.ts` | Route guards (auth redirects). | Add protections (e.g., admin-only paths). |
| `public/` | Static assets (logos, prints?). | Add images/icons. |
| `DEPLOY.md` | Deployment guide for EasyPanel (see `.context/docs/DEPLOY.md` for full manual). | Update for new env vars/Docker changes. |
| `docker-compose.yml` | Local stack: Next.js + Postgres + Prisma. | Scale DB, add Redis (sessions). Volumes for persistence. |
| `Dockerfile` | Multi-stage build for prod (Node 18-alpine). | Optimize layers, add healthchecks. |
| `next.config.js` | Next.js config (images, env). | Enable SWC minify, new plugins. |
| `tailwind.config.js`/`components.json` | Shadcn/UI setup. | New themes/components: `npx shadcn-ui@latest add table`. |
| `tsconfig.json` | TypeScript paths/strict. | Rare; only for new libs. |

## Key Conventions & Patterns
- **API**: Zod validation, Prisma queries, auth via `getServerSession()`. Responses: `{ data, error }`.
- **UI**: Server Components by default; Client (`"use client"`) for forms/interactions. Use `useSession`, `useQuery`.
- **Data Types**: `PecaPiloto`, `CorteTecido`, `UserData` (in pages); `Tipo` enum.
- **Printing**: `PrintButton` for fichas/cortes; CSS `@media print`.
- **Utils**: Always import `cn`, formatters for BR locale (R$ dates).
- **Symbols**: See [Symbol Index](#symbol-index) for exports/interfaces.

## AI Context References
- **Docs Index**: [docs/README.md](README.md) (API, UI guides).
- **Contributor Guide**: [CONTRIBUTING.md](../CONTRIBUTING.md).
- **Playbooks**: `.context/agents/README.md` (agent-specific scaffolds).
- **Schema**: `prisma/schema.prisma`.
- **Env Vars**: `.env.example` (NEXTAUTH_*, DATABASE_URL).

## Troubleshooting
- **Auth Issues**: Check `getServerSession` calls, NextAuth secret.
- **Prisma Errors**: `npx prisma db push --force-reset` (dev only).
- **Build Fails**: Verify `export const dynamic = 'force-dynamic'` in APIs.
- **Print Styles**: Test `@media print { body { margin: 0; } }`.

## Symbol Index (Key Exports)
### Components/Layouts
- `AppShell`, `Navbar`, `AuthProvider` (`components/`).
- `RootLayout`, `DashboardPage`, `Loading`, `Error` (`app/`).

### UI Primitives
- `ButtonProps`, `InputProps`, `LabelProps`, `TextareaProps` (`components/ui/`).
- `TypeBadge` (`components/ui/type-badge.tsx`).

### Utils
- `cn`, `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal` (`lib/utils.ts`).
- `gerarReferenciaPeca/Tecido` (`lib/gerarReferencia.ts`).

### API Handlers
- GET/POST/PUT/DELETE for `/api/tecidos`, `/api/pecas`, `/api/users`, etc.

For full analysis: Run `analyzeSymbols` on files or check Codebase Context.
