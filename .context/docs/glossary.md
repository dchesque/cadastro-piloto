# Glossary

The **Cadastro Piloto** application is a Next.js 14 app (App Router) with Prisma ORM, Tailwind CSS, and Shadcn UI for managing prototype garments (*peças piloto*) in clothing production. It tracks fabrics (*tecidos*), pilot pieces (*peças piloto*), cuts (*cortes*), references (*referências*), production sheets (*fichas*), materials, trims (*aviamentos*), and equipment (*equipamentos*). This glossary defines key domain terms, types, acronyms, personas, rules, and developer references with code cross-links.

## Core Domain Concepts

- **Peça Piloto**  
  Prototype garment or pilot piece—the core entity representing a clothing item in development. Includes unique reference, description, associated cuts (*cortes*), materials, trims (*aviamentos*), equipment (*equipamentos*), measurements, and instructions.  
  **CRUD APIs**:  
  - `POST /api/pecas` (create with auto-generated reference via `gerarReferenciaPeca()`)  
  - `GET /api/pecas` (list), `GET /api/pecas/[id]` (detail), `GET /api/pecas/referencia?query=...` (search)  
  - `PUT /api/pecas/[id]` (update)  
  - `DELETE /api/pecas/[id]` (delete)  
  **UI Paths**: List at [`app/pecas/page.tsx`](../../../app/pecas/page.tsx), detail at [`app/pecas/[id]/page.tsx`](../../../app/pecas/%5Bid%5D/page.tsx), ficha at [`app/pecas/[id]/ficha/page.tsx`](../../../app/pecas/%5Bid%5D/ficha/page.tsx), cuts at [`app/pecas/[id]/corte`](../../../app/pecas/%5Bid%5D/corte), print at [`app/pecas/[id]/imprimir`](../../../app/pecas/%5Bid%5D/imprimir/page.tsx).  
  **Type**: `PecaPiloto` (defined in [`app/pecas/page.tsx:18`](../../../app/pecas/page.tsx#L18), reused in [`app/pecas/[id]/corte/novo/page.tsx:22`](../../../app/pecas/%5Bid%5D/corte/novo/page.tsx#L22)).  
  **Example**:  
  ```ts
  // From app/api/pecas/route.ts POST handler
  const peca: PecaPiloto = {
    referencia: await gerarReferenciaPeca(),
    descricao: 'Vestido modelo A',
    // ...cortes, materiais, etc.
  };
  ```

- **Tecido**  
  Fabric roll or material stock item, tracked by reference, supplier, width, total meters, and usage across cuts. Supports printing labels.  
  **CRUD APIs**:  
  - `POST /api/tecidos` (create)  
  - `GET /api/tecidos` (list), `GET /api/tecidos/[id]` (detail), `GET /api/tecidos/referencia?query=...` (search)  
  - `PUT /api/tecidos/[id]` (update)  
  - `DELETE /api/tecidos/[id]` (delete)  
  **UI Paths**: List at [`app/tecidos/page.tsx`](../../../app/tecidos/page.tsx), detail at [`app/tecidos/[id]/page.tsx`](../../../app/tecidos/%5Bid%5D/page.tsx), create at [`app/tecidos/novo`](../../../app/tecidos/novo/page.tsx), print at [`app/tecidos/[id]/imprimir`](../../../app/tecidos/%5Bid%5D/imprimir/page.tsx).  
  **Type**: `CorteTecido` (defined in [`app/tecidos/page.tsx:18`](../../../app/tecidos/page.tsx#L18), reused in [`app/tecidos/[id]/page.tsx:31`](../../../app/tecidos/%5Bid%5D/page.tsx#L31)).  
  **Reference**: `gerarReferenciaTecido()` from [`lib/gerarReferencia.ts:27`](../../../lib/gerarReferencia.ts#L27).

- **Corte**  
  Cut record allocating fabric (*tecido*) to a *peça piloto*, specifying quantities (meters, units), notes, and print sheets for production.  
  **CRUD APIs** (scoped to peça):  
  - `POST /api/pecas/[id]/corte` (create)  
  - `GET /api/pecas/[id]/corte` (list), `GET /api/pecas/[id]/corte/[corteId]` (detail)  
  - `PUT /api/pecas/[id]/corte/[corteId]` (update)  
  - `DELETE /api/pecas/[id]/corte/[corteId]` (delete)  
  **UI Paths**: List/add at [`app/pecas/[id]/corte`](../../../app/pecas/%5Bid%5D/corte), new at [`app/pecas/[id]/corte/novo/page.tsx`](../../../app/pecas/%5Bid%5D/corte/novo/page.tsx), print at [`app/pecas/[id]/corte/[corteId]/imprimir`](../../../app/pecas/%5Bid%5D/corte/%5BcorteId%5D/imprimir/page.tsx).

- **Referência**  
  Unique alphanumeric identifier (SKU) for entities: `PC-YYYY-NNN` (peças), `TC-YYYY-NNN` (tecidos). Sequentially generated yearly to ensure uniqueness.  
  **Generation Utils**:  
  - `gerarReferenciaPeca()` ([lib/gerarReferencia.ts:3](../../../lib/gerarReferencia.ts#L3))  
  - `gerarReferenciaTecido()` ([lib/gerarReferencia.ts:27](../../../lib/gerarReferencia.ts#L27))  
  **Search APIs**: `GET /api/pecas/referencia`, `GET /api/tecidos/referencia`.  
  **Invariant**: Uniqueness enforced in POST/PUT handlers via Prisma queries.

- **Ficha**  
  Comprehensive printable spec sheet for a *peça piloto*, compiling description, measurements, materials, *aviamentos*, *equipamentos*, and instructions.  
  **UI**: [`app/pecas/[id]/ficha/page.tsx`](../../../app/pecas/%5Bid%5D/ficha/page.tsx) using `PrintButton` ([components/print-button.tsx](../../../components/print-button.tsx)).  
  **Types**: `Material` (line 21), `Aviamento` (line 33), `Equipamento` (line 45).

- **Aviamento**  
  Production trims or notions (e.g., zippers, buttons, threads) listed on *fichas*.  
  **Type**: `Aviamento` ([app/pecas/[id]/ficha/page.tsx:33](../../../app/pecas/%5Bid%5D/ficha/page.tsx#L33)).

- **Equipamento**  
  Required machinery/tools (e.g., overlock machine, pattern cutter) for assembling the *peça piloto*, documented on *fichas*.  
  **Type**: `Equipamento` ([app/pecas/[id]/ficha/page.tsx:45](../../../app/pecas/%5Bid%5D/ficha/page.tsx#L45)).

- **Material**  
  Raw materials (fabrics, linings) beyond primary *tecidos*, specified on *fichas*.  
  **Type**: `Material` ([app/pecas/[id]/ficha/page.tsx:21](../../../app/pecas/%5Bid%5D/ficha/page.tsx#L21)).

- **Tipo**  
  Entity category label (e.g., 'Peça', 'Tecido') for UI badges.  
  **Type**: `Tipo` union ([components/ui/type-badge.tsx:3](../../../components/ui/type-badge.tsx#L3)).  
  **Component**: `TypeBadge` (exported from [components/ui/type-badge.tsx:10](../../../components/ui/type-badge.tsx#L10)).

## Key Types & Interfaces

Inferred from page/API usage (Prisma schema types not directly exported):

| Type/Interface | Location(s) | Description | Exported |
|---------------|-------------|-------------|----------|
| `PecaPiloto` | [`app/pecas/page.tsx:18`](../../../app/pecas/page.tsx#L18), [`app/pecas/[id]/corte/novo/page.tsx:22`](../../../app/pecas/%5Bid%5D/corte/novo/page.tsx#L22) | `{ referencia: string, descricao: string, cortes?: Corte[], ... }` | No |
| `CorteTecido` | [`app/tecidos/page.tsx:18`](../../../app/tecidos/page.tsx#L18), [`app/tecidos/[id]/page.tsx:31`](../../../app/tecidos/%5Bid%5D/page.tsx#L31) | `{ id: string, referencia: string, metros: number, unidades?: number, ... }` | No |
| `UserData` | [`app/minha-conta/page.tsx:19`](../../../app/minha-conta/page.tsx#L19) | Session profile: `{ name: string, email: string, ... }` | No |
| `Material` | [`app/pecas/[id]/ficha/page.tsx:21`](../../../app/pecas/%5Bid%5D/ficha/page.tsx#L21) | Ficha material entry | No |
| `Aviamento` | [`app/pecas/[id]/ficha/page.tsx:33`](../../../app/pecas/%5Bid%5D/ficha/page.tsx#L33) | Trim/notion entry | No |
| `Equipamento` | [`app/pecas/[id]/ficha/page.tsx:45`](../../../app/pecas/%5Bid%5D/ficha/page.tsx#L45) | Equipment entry | No |
| `ButtonProps` | [`components/ui/button.tsx:31`](../../../components/ui/button.tsx#L31) | Shadcn button props: `{ variant?: 'default' \| 'destructive' \| ..., size?: ..., ... }` | Yes |
| `InputProps` | [`components/ui/input.tsx:4`](../../../components/ui/input.tsx#L4) | Form input props | Yes |
| `TextareaProps` | [`components/ui/textarea.tsx:4`](../../../components/ui/textarea.tsx#L4) | Multi-line input props | Yes |
| `LabelProps` | [`components/ui/label.tsx:4`](../../../components/ui/label.tsx#L4) | Form label props | Yes |
| `FieldProps` | [`components/ui/field.tsx:3`](../../../components/ui/field.tsx#L3) | Form field wrapper | No |
| `SidebarProps` | [`components/sidebar.tsx:16`](../../../components/sidebar.tsx#L16) | `{ isOpen: boolean, onClose: () => void }` | No |
| `NavbarProps` | [`components/navbar.tsx:6`](../../../components/navbar.tsx#L6) | Navigation props | No |

## Utilities & Formatting

- **`cn`** (exported from [`lib/utils.ts:4`](../../../lib/utils.ts#L4)): ClassName merger for Tailwind.  
  ```ts
  cn('btn-primary', isLoading && 'opacity-50'); // "btn-primary opacity-50"
  ```

- **Formatting** (exported from [`lib/utils.ts`](../../../lib/utils.ts)): Brazil-localized.  
  | Function | Line | Example |
  |----------|------|---------|
  | `formatCurrency` | 8 | `formatCurrency(100.5)` → `"R$ 100,50"` |
  | `formatDate` | 16 | `formatDate(new Date())` → `"25/10/2024"` |
  | `formatNumber` | 21 | `formatNumber(1234)` → `"1.234"` |
  | `formatDecimal` | 29 | `formatDecimal(1.25, 2)` → `"1,25"` |

## User Management & Auth

- **User**: Account with profile (`app/minha-conta/page.tsx`), password update (`PATCH /api/users/password`).  
  **APIs**: `POST /api/users` (create), `GET /api/users` (list/me).  
- **Auth**: NextAuth.js via `app/api/auth/[...nextauth]/route.ts`, `AuthProvider` ([components/auth-provider.tsx:5](../../../components/auth-provider.tsx)), protected by `middleware.ts`.  
- **Setup**: `POST /api/setup` (idempotent initial DB seed).  
- **Upload**: `POST /api/upload` for images/docs.

## Acronyms & Abbreviations

| Term | Full Form | Context |
|------|-----------|---------|
| CRUD | Create, Read, Update, Delete | All domain APIs |
| UI | User Interface | Shadcn in `components/ui/` |
| ORM | Object-Relational Mapping | Prisma (`prisma/schema.prisma`) |
| SKU | Stock Keeping Unit | *Referência* |
| API | Application Programming Interface | `app/api/` routes |

## User Personas

- **Gerente de Produção** (Production Manager): Manages *peças*, *tecidos*, references; uses dashboard (`app/page.tsx` → `DashboardPage`), search, setup.
- **Costureira/Operador** (Seamstress/Operator): Views *fichas*, adds *cortes*, prints via `PrintButton`.
- **Admin**: Full CRUD, user management.

## Domain Rules & Invariants

- **References**: Yearly sequential (`PC-2024-001`), auto-generated, unique-checked via Prisma `count()`.
- **Quantities**: Positive decimals (meters formatted to 2 places); zero/negative rejected.
- **Printing**: Client-side via `@media print` + `PrintButton`.
- **Sessions**: `getServerSession()` in APIs; `useSession()` in components.
- **File Handling**: Images via `POST /api/upload`.
- **Seed**: `prisma/seed.js` (`main()` function).

## Layout & Components

- **RootLayout** ([app/layout.tsx:26](../../../app/layout.tsx)): Wraps `AppShell`, `Navbar`, `AuthProvider`.
- **AppShell** ([components/app-shell.tsx:9](../../../components/app-shell.tsx)): Main shell with `Sidebar`.
- **Navbar** ([components/navbar.tsx:10](../../../components/navbar.tsx)): Top nav.
- **Loading/Error**: Global [`app/loading.tsx`](../../../app/loading.tsx), [`app/error.tsx`](../../../app/error.tsx).

## Related Files

- **Utils**: [`lib/utils.ts`](../../../lib/utils.ts), [`lib/gerarReferencia.ts`](../../../lib/gerarReferencia.ts).
- **Prisma**: [`prisma/seed.js`](../../../prisma/seed.js).
- **Auth**: [`middleware.ts`](../../../middleware.ts), [`lib/auth.ts`](../../../lib/auth.ts).
- **UI**: [`components/ui/*`](../../../components/ui/), [`components/print-button.tsx`](../../../components/print-button.tsx).
- **Full API**: See [project-overview.md](./project-overview.md).

See codebase architecture for controllers/components structure.
