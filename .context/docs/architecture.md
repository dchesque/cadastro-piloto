# Architecture

The Cadastro Piloto system is a full-stack web application built as a Next.js monolith using the App Router (Next.js 14+). It manages inventory and production workflows for fabrics (`tecidos`), pilot pieces (`pecas`), and cuts (`cortes`), including CRUD operations, user authentication, file uploads, reference generation, and printable fichas (technical sheets). The design prioritizes colocation of UI and data logic for performance, leveraging Server Components for data fetching and API routes for mutations to minimize client-side JavaScript. Prisma serves as the ORM for PostgreSQL, with NextAuth.js handling authentication. This structure enables rapid iteration, SSR/SSG for dashboard pages, and easy deployment via Docker or Vercel.

## System Architecture Overview

This is a **monolith** application deployed as a single Next.js service, containerized via Docker (`Dockerfile`, `docker-compose.yml`) for local development or cloud platforms like Vercel. It follows a layered full-stack topology:

- **Client requests** enter via the Next.js router (`middleware.ts` → `app/layout.tsx`).
- **Read-heavy paths** (dashboards, lists) use Server Components in `app/` pages, fetching data server-side via Prisma.
- **Mutations** route to `app/api/` handlers (e.g., `POST /api/tecidos`), which validate, interact with Prisma, and return JSON.
- **Control pivots** at the API layer: business rules (e.g., reference generation in `lib/gerarReferencia.ts`) before DB commits.
- **Static assets** (prints, uploads) handled via server actions or direct API responses.

No microservices; all layers colocate in one repo for simplicity. Deployment model supports SSR for dynamic UIs and static exports where possible.

## Architectural Layers

| Layer | Description | Key Files/Directories |
|-------|-------------|-----------------------|
| **Presentation** | UI components and pages using React Server Components and Shadcn/UI primitives. | `app/`, `components/`, `components/ui/` |
| **API** | Route handlers for CRUD operations. | `app/api/users/`, `app/api/tecidos/`, `app/api/pecas/`, `app/api/upload/` |
| **Business Logic** | Utilities and generators. | `lib/utils.ts`, `lib/gerarReferencia.ts` |
| **Data Access** | Prisma ORM for PostgreSQL. | `prisma/schema.prisma`, `prisma/seed.js` |
| **Auth** | NextAuth configuration. | `auth.ts`, `app/api/auth/[...nextauth]/route.ts` |

## Detected Design Patterns

| Pattern | Confidence | Locations | Description |
|---------|------------|-----------|-------------|
| RESTful API | 95% | `app/api/tecidos/route.ts`, `app/api/pecas/route.ts` | Standardized CRUD endpoints with HTTP methods (GET/POST/PUT/DELETE) for resources like `tecidos` and `pecas`. Example: `GET /api/tecidos` lists fabrics with pagination. |
| Repository (via ORM) | 80% | All `app/api/*` routes | Prisma Client abstracts DB operations. See [prisma/schema.prisma](prisma/schema.prisma) for models. |
| Factory | 70% | `lib/gerarReferencia.ts` | Generates unique references:<br>```ts<br>const ref = gerarReferenciaPeca({ ano: 2024, sequencial: 1 }); // "PC-2024-001"<br>``` |
| Provider | 85% | `components/auth-provider.tsx` | Wraps app with auth context. Used in [app/layout.tsx](app/layout.tsx). |
| Decorator (Utility) | 60% | `lib/utils.ts` | Helpers like `cn` for Tailwind merging:<br>```ts<br>cn("btn", isActive && "btn-active")<br>``` |

## Entry Points

- [`app/layout.tsx`](app/layout.tsx) — Root layout exports `RootLayout` with `AppShell`, `AuthProvider`, and `Navbar`.
- [`middleware.ts`](middleware.ts) — Auth middleware protecting routes.
- [`app/page.tsx`](app/page.tsx) — Dashboard (`DashboardPage`).
- [`app/api/auth/[...nextauth]/route.ts`](app/api/auth/%5B...nextauth%5D/route.ts) — NextAuth dynamic route.
- [`prisma/seed.js`](prisma/seed.js) — DB seeding via `main()`.

## Key APIs

RESTful endpoints for core resources:

| Resource | List | Create | Get | Update | Delete | Nested |
|----------|------|--------|-----|--------|--------|--------|
| **Users** | `GET /api/users` | `POST /api/users` | - | `PATCH /api/users/password` | - | - |
| **Upload** | - | `POST /api/upload` | - | - | - | - |
| **Tecidos** | `GET /api/tecidos` | `POST /api/tecidos` | `GET /api/tecidos/[id]`<br>`GET /api/tecidos/referencia` | `PUT /api/tecidos/[id]` | `DELETE /api/tecidos/[id]` | - |
| **Pecas** | `GET /api/pecas` | `POST /api/pecas` | `GET /api/pecas/[id]`<br>`GET /api/pecas/referencia` | `PUT /api/pecas/[id]` | `DELETE /api/pecas/[id]` | Cortes: `GET/POST /api/pecas/[id]/corte`<br>`GET/PUT/DELETE /api/pecas/[id]/corte/[corteId]` |
| **Setup** | - | `POST /api/setup` | - | - | - | - |

Responses use JSON with Prisma models (e.g., `{ id, referencia, nome, ... }`).

**Public API Exports** (key handlers and utils):
- `cn`, `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal` from `lib/utils.ts`
- `gerarReferenciaPeca`, `gerarReferenciaTecido` from `lib/gerarReferencia.ts`
- CRUD handlers: `GET/POST/PUT/DELETE` from `app/api/*` routes
- UI: `AppShell`, `AuthProvider`, `Navbar`, `PrintButton`, `TypeBadge`

## Internal System Boundaries

Bounded contexts:

- **User/Auth**: Sessions, passwords; uses NextAuth.
- **Tecidos**: Fabric inventory; unique refs via `gerarReferenciaTecido`.
- **Pecas + Cortes**: Hierarchical (peca → cortes); FKs in Prisma.

Seams: JSON API contracts; DB transactions in handlers.

## External Dependencies

- **PostgreSQL**: Via Prisma; connection in `.env`.
- **NextAuth**: Credentials provider in `auth.ts`.
- **File Storage**: Local FS in `app/api/upload/route.ts`.

## Architecture Diagram

```mermaid
graph TD
    Client[Browser Client] -->|HTTP/WS| NextJS[Next.js App Router]
    NextJS -->|SSR/RSC| Pages[app/ Pages<br/>(Dashboard, Lists)]
    NextJS -->|API Calls| API[app/api/ Routes<br/>(CRUD: tecidos, pecas)]
    Pages -->|fetch| Prisma[Prisma Client]
    API -->|tx| Prisma
    Prisma -->|SQL| DB[PostgreSQL]
    NextJS -->|Sessions| Auth[NextAuth]
    API -->|Upload| Storage[File Storage]
    Auth -.->|Providers| ExternalAuth[External IdP]
```

## Key Decisions & Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| App Router | Server Components for perf/SEO. | Learning curve vs. Pages Router. |
| API Routes | Explicit HTTP for mutations. | Vs. Server Actions (less mature for uploads). |
| Monolith | Simplicity for small team/low traffic. | Vertical scaling; split later with Prisma Accelerate. |
| Prisma | Type-safety, migrations. | Overhead vs. Drizzle/raw SQL. |

## Risks & Constraints

- **Scaling**: DB hotspots on prints; monitor `pecas/[id]/ficha`.
- **Vendor Lock**: Next.js/Prisma heavy.
- **Prints**: Client-side (`PrintButton`); test browsers.
- **Uploads**: No CDN; limit file sizes.

## Directory Structure

```
.
├── app/                 # Pages & API (50+ files)
│   ├── api/             # Controllers: users, upload, tecidos, setup, pecas, auth
│   └── [pages: login, tecidos, pecas, minha-conta, etc.]
├── components/          # UI: app-shell, auth-provider, navbar, ui/, print-button
├── lib/                 # Utils: utils.ts, gerarReferencia.ts
├── prisma/              # Schema & seed
├── docs/                # This docs
├── public/              # Assets
├── auth.ts
├── middleware.ts
└── [others: Dockerfile, next.config.js]
```

**Key Symbols**:
- **Interfaces**: `SidebarProps`, `NavbarProps`, `ButtonProps`, `InputProps`, `PecaPiloto`, `CorteTecido`, etc.
- **Functions**: `handleClickOutside` (`components/sidebar.tsx`), `main` (`prisma/seed.js`).
- **Types**: `Tipo` (`components/ui/type-badge.tsx`).

See [codebase-map.json](codebase-map.json) for full symbols/dependencies.

## Related Resources

- [project-overview.md](project-overview.md)
- [data-flow.md](data-flow.md)
- [API Reference](api-reference.md)
