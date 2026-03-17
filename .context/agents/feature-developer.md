# Feature Developer Agent Playbook

**Type:** agent  
**Tone:** instructional  
**Audience:** ai-agents  
**Description:** Implements new features according to specifications  
**Additional Context:** Focus on clean architecture, integration with existing code, and comprehensive testing.

## Mission

The Feature Developer agent delivers end-to-end feature implementations in this Next.js (App Router) application for a pilot registration system managing users, fabric uploads (tecidos), pieces (pecas), and cuts (cortes). It transforms detailed specifications into deployable code by creating API routes, UI pages, components, and integrations while maintaining codebase consistency. Engage this agent for:

- New or extended CRUD operations on core entities (e.g., adding aviamentos alongside tecidos/pecas).
- UI pages for lists, creation (novo), details ([id]), printing (imprimir), or fichas.
- Feature integrations like auth-protected uploads, password resets, or setup flows.
- Enhancements requiring responsive forms, print views, or dynamic sub-routes (e.g., pecas/[id]/corte/[corteId]).

This agent ensures features align with clean architecture: thin controllers, reusable UI primitives, server-side rendering where possible, and TypeScript safety.

## Responsibilities

- Parse feature specifications to map requirements across layers: API routes, pages/layouts, components, utils.
- Implement API handlers in `app/api/[domain]/route.ts` or dynamic segments (e.g., `POST` for create, `GET` for list/fetch).
- Develop pages in `app/[domain]/page.tsx`, `app/[domain]/novo/page.tsx`, `app/[domain]/[id]/page.tsx`, including nested routes like `imprimir` or `ficha`.
- Compose UIs using `AppShell`, `Navbar`, `Sidebar`, shadcn primitives (`Button`, `Input`, etc.), and custom components (`PrintButton`, `TypeBadge`).
- Integrate authentication with `AuthProvider` and `getServerSession`; handle uploads via `app/api/upload`.
- Add form handling with consistent props (`InputProps`, `FieldProps`) and client-side interactivity (`'use client'`).
- Implement print features with `PrintButton` and `@media print` CSS.
- Ensure error responses (`NextResponse.json({ error }, { status })`), validation, and TypeScript interfaces.
- Scan for and extend tests if present (e.g., via `listFiles('**/*.test.ts')`); add unit/integration tests for new APIs/pages.
- Refactor repeated logic into `lib/` or `utils/` (e.g., DB queries, Zod schemas).

## Best Practices

- **API Patterns**: Export HTTP methods directly (`export const POST = async (req) => { ... }`). Use `getServerSession` for auth. Return `NextResponse.json(data)` or errors with status. Mirror `app/api/tecidos/route.ts` for lists/creates.
- **Page Structure**: Server Components default; `'use client'` for hooks (e.g., `useSession`, `handleClickOutside`). Wrap in `AppShell({ children })`. Fetch data server-side with `revalidatePath`.
- **UI Consistency**: Import shadcn from `components/ui/` (e.g., `<Button {...ButtonProps}>`). Use `Field` wrappers for forms. Apply `TypeBadge` for entity variants.
- **Dynamic Routes**: Use `[id]` folders; nest for sub-resources (e.g., `pecas/[id]/corte/novo`).
- **Print Handling**: Position `PrintButton` prominently; hide nav/UI in `@media print { body { margin: 0; } }`.
- **Type Safety**: Define/export interfaces for all props/components (e.g., `interface TecidoFormProps { ... }`). Use `zod` if schemas exist.
- **Performance/Security**: Await `req.formData()` for uploads. Protect routes. Use `cache: 'no-store'` for user data.
- **Testing**: Add `__tests__` if patterns found; test APIs with `supertest`-like (scan codebase).
- **Commits**: `feat: [domain] - add create endpoint and form page`.
- **Avoid**: Global state beyond auth; heavy client bundles; unprotected endpoints.

Workflow: 1. Gather context (`getFileStructure`, `analyzeSymbols('app/api/pecas/route.ts')`). 2. Scaffold from copies. 3. Local test (`npm run dev`). 4. Lint/Type-check.

## Key Project Resources

- [AGENTS.md](../../AGENTS.md) - All agent roles, handoff protocols.
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution standards, if available.
- [README.md](README.md) - Project setup, stack overview.
- [../docs/README.md](../docs/README.md) - Central docs index, schemas.
- Next.js App Router: [Official Docs](https://nextjs.org/docs/app).

## Repository Starting Points

| Directory | Purpose |
|-----------|---------|
| `app/api/` | Domain-grouped API routes (users, tecidos, pecas, upload, setup, auth/[...nextauth]). Dynamic: `[id]`, `referencia`, `corte/[corteId]`. |
| `app/` | App Router pages/layouts: domains (tecidos, pecas, minha-conta, login), actions (novo, [id], imprimir, ficha). |
| `components/` | Reusable UI: layout (`app-shell.tsx`, `navbar.tsx`, `sidebar.tsx`), utils (`print-button.tsx`, `auth-provider.tsx`), primitives (`ui/`). |
| `components/ui/` | shadcn/ui primitives: `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `field.tsx`, `type-badge.tsx`. |
| `lib/` / `utils/` | Helpers, DB (Prisma?), validators (scan via `searchCode('prisma')`). |

## Key Files

| File | Purpose |
|------|---------|
| `app/api/tecidos/route.ts` | GET list, POST create (template for new domains). |
| `app/api/pecas/route.ts` | Pieces CRUD (GET/POST patterns). |
| `app/api/pecas/[id]/route.ts` | Detail fetch/update (dynamic example). |
| `app/api/pecas/[id]/corte/route.ts` | Nested cuts (POST new corte). |
| `components/app-shell.tsx` | Main layout wrapper (`AppShell`). |
| `components/navbar.tsx` | Top navigation (`Navbar`). |
| `components/sidebar.tsx` | Collapsible sidebar (`SidebarProps`, `handleClickOutside`). |
| `components/auth-provider.tsx` | Auth session provider (`AuthProvider`). |
| `components/print-button.tsx` | Print trigger (`PrintButton`). |
| `components/ui/button.tsx` | Action button (`ButtonProps`). |
| `components/ui/input.tsx` | Form input (`InputProps`). |
| `components/ui/textarea.tsx` | Multi-line (`TextareaProps`). |
| `components/ui/field.tsx` | Form field wrapper (`FieldProps`). |
| `components/ui/type-badge.tsx` | Type indicators (`TypeBadge`). |

## Architecture Context

### Controllers (API Layer)
**Directories**: `app/api/upload`, `app/api/users`, `app/api/tecidos`, `app/api/setup`, `app/api/pecas`, `app/api/users/password`, `app/api/tecidos/[id]`, `app/api/tecidos/referencia`, `app/api/pecas/[id]`, `app/api/pecas/referencia`, `app/api/auth/[...nextauth]`, `app/api/pecas/[id]/corte`, `app/api/pecas/[id]/corte/[corteId]`.

**Symbol Count**: ~15 exported handlers (GET, POST, PATCH).
**Key Exports**:
- `POST` @ `app/api/upload/route.ts:6`
- `POST/GET` @ `app/api/users/route.ts:6,47`
- `GET/POST` @ `app/api/tecidos/route.ts:5,33`
- `POST` @ `app/api/setup/route.ts:7`
- `GET/POST` @ `app/api/pecas/route.ts:5,33`
- `PATCH` @ `app/api/users/password/route.ts:6`
- `GET` @ `app/api/tecidos/[id]/route.ts:4`

Thin handlers: auth → DB → JSON.

### Components (UI Layer)
**Directories**: `components`, `app`, `components/ui`, `app/tecidos`, `app/pecas`, `app/minha-conta`, `app/login`, `app/tecidos/novo`, `app/tecidos/[id]`, `app/pecas/[id]`, `app/pecas/nova`, `app/tecidos/[id]/imprimir`, `app/pecas/[id]/imprimir`, `app/pecas/[id]/ficha`, `app/pecas/[id]/corte/novo`, `app/pecas/[id]/corte/[corteId]/imprimir`.

**Symbol Count**: ~15 components/primitives/interfaces.
**Key Exports**:
- `PrintButton` @ `components/print-button.tsx:3`
- `Navbar` @ `components/navbar.tsx:10`
- `AuthProvider` @ `components/auth-provider.tsx:5`
- `AppShell` @ `components/app-shell.tsx:9`
- `TypeBadge` @ `components/ui/type-badge.tsx:10`
- `ButtonProps`, `InputProps`, `TextareaProps`, `LabelProps` from `components/ui/`.

Composable, responsive (Tailwind).

## Key Symbols for This Agent

| Symbol | Type | Location | Usage |
|--------|------|----------|-------|
| `SidebarProps` | Interface | `components/sidebar.tsx:16` | Sidebar configuration (open, onToggle). |
| `NavbarProps` | Interface | `components/navbar.tsx:6` | Navbar slots/content. |
| `InputProps` | Interface (exported) | `components/ui/input.tsx:4` | Form inputs (value, onChange, etc.). |
| `TextareaProps` | Interface (exported) | `components/ui/textarea.tsx:4` | Textareas. |
| `LabelProps` | Interface (exported) | `components/ui/label.tsx:4` | Labels. |
| `FieldProps` | Interface | `components/ui/field.tsx:3` | Form field wrappers. |
| `ButtonProps` | Interface (exported) | `components/ui/button.tsx:31` | Buttons (variant, size). |
| `handleClickOutside` | Function | `components/sidebar.tsx:29` | Close sidebar on outside click. |
| `PrintButton` | Component (exported) | `components/print-button.tsx:3` | Triggers window.print(). |
| `Navbar` | Component (exported) | `components/navbar.tsx:10` | Top bar with links. |
| `AuthProvider` | Component (exported) | `components/auth-provider.tsx:5` | Provides session context. |
| `AppShell` | Component (exported) | `components/app-shell.tsx:9` | Full layout (header, sidebar, main). |
| `TypeBadge` | Component (exported) | `components/ui/type-badge.tsx:10` | Renders entity type badges. |

## Documentation Touchpoints

- [README.md](README.md) - Setup, tech stack, quickstart.
- [../docs/README.md](../docs/README.md) - Docs hub, entity schemas, API refs.
- [AGENTS.md](../../AGENTS.md) - Agent collaboration rules.
- Inline JSDoc in new files (e.g., `/** Creates new tecido */ export const POST = ...`).
- Page-level comments (e.g., data fetching patterns in `app/pecas/page.tsx`).
- Scan `searchCode('TODO|FIXME')` for gaps; update post-feature.

## Collaboration Checklist

1. **Confirm Assumptions**: Review spec with Architect; use `readFile('spec.md')`, `listFiles('app/[domain]/**')` to list impacts.
2. **Gather Context**: Run `analyzeSymbols('similar-file.ts')`, `getFileStructure()` for layers.
3. **Implement Incrementally**: Commit per layer (API → UI → Tests); self-lint.
4. **Mid-Review**: If >150 LOC, ping Reviewer: "Draft PR for feedback."
5. **Pre-Merge**: Verify responsive (mobile), auth, errors; update docs/comments.
6. **Post-Merge**: Tag Tester ("E2E needed?"), note learnings in `LEARNINGS.md`.

## Hand-off Notes

Feature delivered: New APIs/pages integrated, tests added, docs updated. Risks: Unhandled edge cases (e.g., large uploads); schema changes (propose Prisma migration). Follow-ups: Tester for coverage; Deployer for staging; Monitor perf on print-heavy pages. Tag if refactoring needed (e.g., shared corte utils).
