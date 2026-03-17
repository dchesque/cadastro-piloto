# Development Workflow

The development process for the **Cadastro Piloto** repository follows a streamlined, iterative approach optimized for a Next.js 14+ app with App Router, Prisma ORM (PostgreSQL), NextAuth.js for authentication, Tailwind CSS, and shadcn/ui components. The core entities are **users**, **tecidos** (fabrics), **peças** (pilot pieces), and **cortes** (cuts on pieces).

Key architecture:
- **Utils**: `lib/` (e.g., `cn`, `formatCurrency`, `gerarReferenciaPeca`, `gerarReferenciaTecido`)
- **API Routes** (controllers): `app/api/` (CRUD for users, upload, tecidos, peças, cortes; auth via `app/api/auth/[...nextauth]`)
- **Pages/Components**: `app/` and `components/` (dashboard, lists, forms, UI like `AppShell`, `Navbar`, `PrintButton`)

Start each session by syncing with `main`:
```bash
git pull origin main
npm install  # If dependencies changed
```

1. Set up environment ([Local Development](#local-development)).
2. Branch for features ([Branching & Releases](#branching--releases)).
3. Implement, test, lint.
4. Commit conventionally (e.g., `feat(pecas): add corte print endpoint`).
5. Push and create GitHub PR.

Collaboration via PRs; use the [DashboardPage](app/page.tsx) for previews.

## Branching & Releases

**Trunk-based development** with short-lived branches (<2 days):

| Branch Type | Prefix | Example | Purpose |
|-------------|--------|---------|---------|
| Main | `main` | - | Always deployable production candidate |
| Feature | `feat/<name>` | `feat/tecidos-upload` | New features (e.g., new API routes like POST `/api/tecidos`) |
| Bugfix | `fix/<issue>` | `fix/PEC-45-referencia-gen` | Fixes (e.g., `gerarReferenciaTecido` edge cases) |
| Release | `release/vX.Y.Z` | `release/v1.2.0` | Hotfixes only; tag after merge |

**Workflow**:
```bash
git checkout main && git pull
git checkout -b feat/your-feature
# Develop, commit, push
gh pr create --fill  # Or GitHub UI
```
- Merges to `main` trigger GitHub Actions CI/CD ([tooling.md](./tooling.md)).
- Semantic tags: `git tag v1.2.3 && git push --tags`.
- Deployment: Continuous to preview/staging; prod via tags (Vercel/Netlify).

No Git Flow; squash/merge PRs.

## Local Development

Requires Node.js 18+, PostgreSQL 15+, Prisma CLI, Docker (optional for DB).

```bash
# Clone & Setup
git clone <repo> && cd cadastro-piloto
npm install

# Database (Prisma)
npx prisma generate
npx prisma db push  # Sync schema (dev/prod-like)
# Or: npx prisma migrate dev --name init  # For migrations

# Seed (populates users, tecidos, peças)
node prisma/seed.js

# Dev Server (hot reload)
npm run dev  # http://localhost:3000

# Quality Checks
npm run lint     # ESLint + Prettier
npm run type-check  # TypeScript
npm run test     # Jest (API routes, components)

# Build & Preview
npm run build
npm run start    # http://localhost:3000 (prod mode)
```

**Tips**:
- **Hot reload**: Edits to `app/api/tecidos/route.ts` or `lib/utils.ts` (`formatDate`, `cn`) reload instantly.
- **Database Tools**: `npx prisma studio` (browse models); Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=pass postgres`.
- **Test Key Flows**:
  - Auth: Visit `/login`, check `AuthProvider` (`components/auth-provider.tsx`).
  - CRUD: Dashboard → Tecidos (GET `/api/tecidos`), Peças (POST `/api/pecas`).
  - Upload: `/api/upload` (images for tecidos).
  - Utils: `gerarReferenciaPeca()` in console for refs.
- **UI**: shadcn components (`ButtonProps`, `InputProps`); Tailwind via `cn`.
- Env: Copy `.env.example` → `.env`; set `DATABASE_URL`, `NEXTAUTH_SECRET`.

## Code Review Expectations

PRs need 1+ approval. Checklist:

- **Quality**: Lint/TypeScript pass; no `console.log`; consistent styling (`cn` from `lib/utils.ts`).
  ```tsx
  // Good: import { cn } from '@/lib/utils'
  <div className={cn("btn", isActive && "active")}>Save</div>
  ```
- **Functionality**: Test APIs (e.g., PUT `/api/pecas/[id]`, DELETE `/api/tecidos/[id]`); handle errors, validate refs.
- **Security**: Session checks (`getServerSession`); sanitize uploads/DB inputs (Zod/Prisma).
- **Performance**: Server Components default; no heavy client fetches.
- **Tests/Docs**: Cover new exports (e.g., `TypeBadge`); update this doc for public changes.
- **CI**: Must pass (lint, build, tests).

Self-merge <50 LOC. For AI assistance, see [AGENTS.md](../AGENTS.md).

## Onboarding Tasks

1. Run `npm run dev`; verify login (`app/login/page.tsx`), dashboard (`app/page.tsx`), CRUD (tecidos/peças).
2. Seed DB (`node prisma/seed.js`); explore via `npx prisma studio`.
3. Good first issues: UI in `app/pecas/[id]/ficha/page.tsx`, utils (`formatCurrency`).
4. Add test: e.g., GET `/api/pecas` ([testing-strategy.md](./testing-strategy.md)).
5. VS Code: Install Prisma, Tailwind IntelliSense ([tooling.md](./tooling.md)).

Use GitHub Projects for triage; PR previews auto-deploy.

## Related Resources

- [testing-strategy.md](./testing-strategy.md) – Jest/Vitest setup
- [tooling.md](./tooling.md) – Editors, CI, shadcn
- [AGENTS.md](../AGENTS.md) – AI collaboration
- Schema: `prisma/schema.prisma`
- Auth: `app/api/auth/[...nextauth]/route.ts`
