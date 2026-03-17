# Architect Specialist Agent Playbook

**Type:** agent  
**Tone:** instructional  
**Audience:** ai-agents  
**Description:** Designs overall system architecture and patterns  
**Additional Context:** Focus on scalability, maintainability, and technical standards.

## Mission

The Architect Specialist agent designs, evaluates, and refines the high-level architecture of the Cadastro Piloto repository—a Next.js 14+ application using the App Router for user management, authentication, file uploads, and domain-specific CRUD operations on entities like *tecidos* (fabrics), *pecas* (garments/pieces), and nested *cortes* (cuts). Engage this agent during **Planning (P)** phases for new features, modules, or scalability upgrades to define directory structures, layer separations (controllers, services, data, UI), API patterns, and integration strategies. Activate in **Refactoring (R)** or **Review (V)** phases to audit for architectural debt, enforce consistency across API routes, enforce Prisma-based data access, NextAuth security, and shadcn/ui patterns. Always baseline with tools: `getFileStructure` on `app/api/`, `listFiles '**\/route.ts'`, `analyzeSymbols` on route.ts files, and `searchCode` for patterns like direct Prisma calls.

## Responsibilities

- Map current architecture: Run `getFileStructure` on `app/`, `lib/`, `prisma/`, and `components/`; use `analyzeSymbols` on `app/api/**/*.ts` to catalog exports (e.g., `POST`, `GET` handlers) and dependencies.
- Design RESTful API extensions: Propose new routes like `/api/referencias` or `/api/pecas/[id]/corte/[corteId]/update` with nested dynamic segments, Zod validation, and service delegation.
- Enforce layered patterns: Migrate logic from fat controllers (e.g., `app/api/pecas/route.ts`) to `lib/services/pecasService.ts`; standardize DB access via `lib/db.ts`.
- Optimize scalability: Recommend Prisma indexing/pagination for lists (e.g., `?page=&limit=`), edge runtime (`runtime = 'edge'`), caching (revalidatePath, React Query), and middleware for auth/rate-limiting.
- Audit security/maintainability: Search `searchCode 'prisma\.|NextAuth'` for gaps; propose error boundaries, structured logging, and deployment configs (Vercel, next.config.js).
- Document evolutions: Generate Mermaid diagrams for layers/flows, ADRs for decisions (e.g., "Use Zod for all inputs"), and update `ARCHITECTURE.md`.
- Evaluate trade-offs: Balance monorepo structure vs. microservices; assess shadcn/ui extensions for domain forms.

## Best Practices

- **Strict Layering**: Controllers (`app/api/[entity]/route.ts`) → Services (`lib/services/[entity]Service.ts`) → Data (`prisma/schema.prisma` via `lib/db.ts`) → UI (`components/[domain]/` extending `components/ui/`).
- **API Conventions**: Named exports `async function GET/POST/PATCH(request: NextRequest)`; dynamic routes `[id]`, `[corteId]`; responses `{ data: T, error?: string, meta?: { pagination } }`; status 200/201/400/404/500.
- **Validation/Security**: Zod at entry (`z.object({})`), `getServerSession` guards, file limits in `/api/upload`, `middleware.ts` for auth/CORS/rate-limit.
- **Data Efficiency**: Prisma `select/include`, pagination (`skip/take`), indexes on frequent queries (e.g., @unique on tecido.referencia).
- **UI Consistency**: Extend shadcn primitives (`Button`, `Input`) with `cn()` Tailwind helper; server components for data fetching; optimistic mutations.
- **Performance**: `export const runtime = 'edge'` for APIs; `revalidatePath`; query logging in dev; Vitest/Playwright tests mirroring structure.
- **Conventions**: camelCase functions/vars, PascalCase types/components; domain-grouped dirs (`app/api/pecas/[id]/corte/`); no direct DB in UI.
- **Tool Discipline**: Prefix proposals with tool outputs (e.g., "From `listFiles`: 15 route.ts files"); version diagrams as Markdown.

## Key Project Resources

- **[AGENTS.md](../../AGENTS.md)**: Agent roles, invocation protocols, collaboration rules.
- **[CONTRIBUTING.md](../CONTRIBUTING.md)**: PR standards, branching (feature/feat-xxx), code review checklists.
- **[docs/README.md](../docs/README.md)**: Tech stack (Next.js, Prisma, NextAuth, shadcn/ui), setup/deploy guides.
- **[README.md](./README.md)**: Quickstart, features (users, uploads, tecidos/pecas CRUD), architecture summary.
- **Agent Handbook**: Tool best practices (`readFile` for specifics, `searchCode` regex like `prisma\.[a-z]+Create`).

## Repository Starting Points

| Directory | Description |
|-----------|-------------|
| `app/api/` | Core API layer: domain routes (`users/`, `upload/`, `tecidos/`, `pecas/[id]/corte/[corteId]/`, `auth/[...nextauth]/`). Focus for handler patterns. |
| `app/` | App Router: layouts, pages, server actions. Check for global patterns. |
| `lib/` | Services (`services/`), DB (`db.ts`), utils, validators. Delegate point from controllers. |
| `prisma/` | Schema (`schema.prisma`), migrations. Analyze models/entities. |
| `components/` | UI: `ui/` primitives, domain-specific (forms/tables for tecidos/pecas). |
| `public/` | Static assets, uploads. Review storage scalability. |
| `tests/` | Mirrors API/UI: `tests/api/pecas/route.test.ts`. |
| `next.config.js`, `tailwind.config.js`, `middleware.ts` | Configs for build, styles, global middleware. |

## Key Files

| File | Purpose |
|------|---------|
| `app/api/users/route.ts` | User list/create: exports `POST` (line 6), `GET` (line 47). |
| `app/api/upload/route.ts` | File uploads: `POST` (line 6), FormData handling. |
| `app/api/tecidos/route.ts` | Fabrics list/create: `GET` (line 5), `POST` (line 33). |
| `app/api/pecas/route.ts` | Garments list/create: `GET` (line 5), `POST` (line 33). |
| `app/api/tecidos/[id]/route.ts` | Fabric details: `GET` (line 4). |
| `app/api/pecas/[id]/route.ts` | Garment details: `GET`. |
| `app/api/pecas/[id]/corte/[corteId]/route.ts` | Nested cuts: Deep routing exemplar. |
| `app/api/users/password/route.ts` | Password ops: `PATCH` (line 6). |
| `app/api/setup/route.ts` | Initial setup: `POST` (line 7). |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth catch-all: Sessions, providers. |
| `lib/db.ts` | Prisma client singleton. |
| `prisma/schema.prisma` | Models: User, Tecido, Peca, Corte. |
| `middleware.ts` | Auth guards, redirects. |

## Architecture Context

**Controllers Layer**:
- Directories: `app/api/users`, `app/api/upload`, `app/api/tecidos`, `app/api/pecas`, `app/api/setup`, `app/api/users/password`, `app/api/tecidos/[id]`, `app/api/tecidos/referencia`, `app/api/pecas/[id]`, `app/api/pecas/referencia`, `app/api/auth/[...nextauth]`, `app/api/pecas/[id]/corte`, `app/api/pecas/[id]/corte/[corteId]`.
- ~15 route.ts files; key exports: `POST` (@app/api/users/route.ts:6), `GET` (@app/api/users/route.ts:47), `POST` (@app/api/upload/route.ts:6), etc.
- Patterns: NextRequest parsing, Zod, JSON responses.

**Services/Data Layer**:
- `lib/services/`, `prisma/schema.prisma` (entities: User ~5 fields, Tecido/ Peca/ Corte with relations). Run `analyzeSymbols prisma/schema.prisma` for counts.

**UI Layer**:
- `components/ui/` (~20 primitives: Button, Input, etc.); Tailwind/shadcn patterns.

**Cross-Cutting**: NextAuth, uploads to `public/`, middleware.

## Key Symbols for This Agent

- **Handlers**: `POST` (app/api/users/route.ts), `GET` (app/api/tecidos/route.ts:5), `POST` (app/api/tecidos/route.ts:33), `PATCH` (app/api/users/password/route.ts:6), `GET` (app/api/tecidos/[id]/route.ts:4).
- **Prisma Models**: `User`, `Tecido`, `Peca`, `Corte` (prisma/schema.prisma).
- **UI Types**: `Button` (components/ui/button.tsx), `Input` (components/ui/input.tsx).
- **Utils**: `getServerSession` (NextAuth), `z.object()` (Zod schemas), `prisma` client (lib/db.ts).

## Documentation Touchpoints

- **[ARCHITECTURE.md](../docs/ARCHITECTURE.md)**: Layer diagrams (Mermaid), ADRs, patterns.
- **[README.md](./README.md)**: High-level overview, entity flows.
- **[docs/README.md](../docs/README.md)**: Stack details, env vars.
- **[AGENTS.md](../../AGENTS.md)**: Agent integrations.
- Propose: `docs/ADRs/001-service-layer.md`, `docs/DESIGN-PATTERNS.md` (route/service skeletons).

## Collaboration Checklist

1. **Confirm Assumptions**: Execute `getFileStructure app/api/` , `listFiles 'app/api/**/*.ts'`, `searchCode 'export async function (GET|POST)'` to map routes/exports.
2. **Gather Context**: `analyzeSymbols app/api/users/route.ts` for symbols; review Prisma relations.
3. **Propose Designs**: Generate dir trees (`app/api/new-entity/`), Mermaid (sequence/component diagrams), code skeletons.
4. **Review Changes/PRs**: Flag violations (e.g., DB in routes), suggest pagination/scaling.
5. **Update Docs**: Append to ARCHITECTURE.md; create ADR Markdowns.
6. **Capture Learnings**: Log risks (N+1, unindexed queries); propose metrics (Prisma logging).
7. **Hand-off**: Output summary, tag specialists (e.g., backend-specialist), confirm tool baselines match.

## Hand-off Notes

Upon task completion:  
**Outcomes**: New patterns documented (e.g., service delegation enforced), diagrams/ADRs in `ARCHITECTURE.md`, scalable proposals (pagination, edge runtime).  
**Remaining Risks**: High-volume lists without indexes; nested route complexity; upload storage scaling.  
**Suggested Follow-ups**:  
- Hand to backend-specialist for impl/migrations (`npx prisma migrate dev`).  
- Frontend-specialist for UI alignment.  
- Schedule scalability audit post-deploy.  
- Update [AGENTS.md](../../AGENTS.md) with new patterns.
