# Feature Developer Playbook

This playbook guides the Feature Developer agent in implementing new features for the `cadastro-piloto` repository, a Next.js 14+ app using the app router, Tailwind CSS, shadcn/ui components, NextAuth for authentication, and Prisma-like DB interactions (inferred from API patterns). The app manages users, uploads, fabrics (`tecidos`), pieces (`pecas`), cuts (`corte`), references, setups, and printing workflows. Features span full-stack: API routes for CRUD, server-rendered pages for data fetching, client-side forms/modals for interactivity, and print-optimized views.

**Core Principle**: Deliver complete, production-ready features following existing patterns—modular API routes, server-first rendering, reusable UI primitives, responsive design, auth-guarded access, and print support for documents.

## Key Focus Areas

### 1. API Routes (Controllers)
   - **Directories**: `app/api/users`, `app/api/upload`, `app/api/tecidos`, `app/api/setup`, `app/api/pecas`, `app/api/users/password`, `app/api/tecidos/[id]`, `app/api/tecidos/referencia`, `app/api/pecas/[id]`, `app/api/pecas/referencia`, `app/api/auth/[...nextauth]`, `app/api/pecas/[id]/corte`, `app/api/pecas/[id]/corte/[corteId]`.
   - **Purpose**: Handle HTTP requests (GET list/fetch, POST create, PATCH update, DELETE). Async functions export methods, parse JSON/formdata, interact with DB, return `NextResponse.json()`. All routes include auth checks via `getServerSession`.
   - **Key Exports**:
     | Method | File | Line |
     |--------|------|------|
     | `POST` | `app/api/users/route.ts` | 6 |
     | `GET`  | `app/api/users/route.ts` | 47 |
     | `POST` | `app/api/upload/route.ts` | 6 |
     | `GET`  | `app/api/tecidos/route.ts` | 5 |
     | `POST` | `app/api/tecidos/route.ts` | 33 |
     | `POST` | `app/api/setup/route.ts` | 7 |
     | `GET`  | `app/api/pecas/route.ts` | 5 |
     | `POST` | `app/api/pecas/route.ts` | 33 |
     | `PATCH`| `app/api/users/password/route.ts` | 6 |
     | `GET`  | `app/api/tecidos/[id]/route.ts` | 4 |
   - **When to Focus**: New endpoints (e.g., `/api/fornecedores`), nested ops (e.g., `/pecas/[id]/nova-acao`), reference actions.

### 2. UI Pages and Components
   - **Directories**: `components`, `app`, `components/ui`, `app/tecidos`, `app/pecas`, `app/minha-conta`, `app/login`, `app/tecidos/[id]`, `app/tecidos/novo`, `app/pecas/[id]`, `app/pecas/nova`, `app/tecidos/[id]/imprimir`, `app/pecas/[id]/imprimir`, `app/pecas/[id]/ficha`, `app/pecas/[id]/corte/novo`, `app/pecas/[id]/corte/[corteId]/imprimir`.
   - **Purpose**: Server components fetch data via internal API calls or direct DB, render lists/tables/forms. Client components (`'use client'`) handle state, submissions, modals. Print-optimized pages hide UI elements.
   - **Key Exports**:
     | Component | File | Line |
     |-----------|------|------|
     | `PrintButton` | `components/print-button.tsx` | 3 |
     | `Navbar` | `components/navbar.tsx` | 10 |
     | `AuthProvider` | `components/auth-provider.tsx` | 5 |
     | `AppShell` | `components/app-shell.tsx` | 9 |
     | `DashboardPage` | `app/page.tsx` | 10 |
     | `TypeBadge` | `components/ui/type-badge.tsx` | 10 |
   - **When to Focus**: New list/create/edit/print pages, sub-routes, modals.

### 3. Shared UI Components (shadcn/ui + Custom)
   - **Directories**: `components/ui/` (primitives: button, input, textarea, label, field, type-badge), `components/` (app-specific: navbar, sidebar, print-button, auth-provider, app-shell).
   - **Purpose**: Reusable form elements, navigation, auth wrappers, print triggers. All extend HTML attrs with Tailwind props.
   - **Key Symbols/Props**:
     | Symbol/Props | File | Line | Exported |
     |--------------|------|------|----------|
     | `SidebarProps` | `components/sidebar.tsx` | 16 | No |
     | `NavbarProps` | `components/navbar.tsx` | 6 | No |
     | `TextareaProps` | `components/ui/textarea.tsx` | 4 | Yes |
     | `LabelProps` | `components/ui/label.tsx` | 4 | Yes |
     | `InputProps` | `components/ui/input.tsx` | 4 | Yes |
     | `FieldProps` | `components/ui/field.tsx` | 3 | No |
     | `ButtonProps` | `components/ui/button.tsx` | 31 | Yes |
     | `handleClickOutside` | `components/sidebar.tsx` | 29 | No |
   - **When to Focus**: Forms (use `Field` wrapper), nav updates, new badges/primitives.

### 4. Layouts and Utilities
   - Core: `components/sidebar.tsx` (responsive nav with click-outside), `components/app-shell.tsx` (wraps pages with auth/navbar/sidebar).
   - Auth: `AuthProvider` at root; `getServerSession` guards.
   - Print: `@media print { .no-print { display: none !important; } }`.

### 5. Other Areas
   - **Config**: `next.config.js`, `.env` (DB URLs, NextAuth secrets, `BASE_URL`).
   - **DB/Models**: Prisma inferred (e.g., `prisma.user.findMany()`, `prisma.tecidos.create()`).
   - **Tests**: No explicit tests; rely on manual verification via `npm run dev`.
   - **Documentation**: None; derive from code patterns.

## Key Files and Purposes

| Category | File | Purpose |
|----------|------|---------|
| **API** | `app/api/users/route.ts` | User CRUD (POST create:6, GET list:47). |
| **API** | `app/api/upload/route.ts` | File uploads (POST:6). |
| **API** | `app/api/tecidos/route.ts` | Fabrics CRUD (GET list:5, POST create:33). |
| **API** | `app/api/tecidos/[id]/route.ts` | Fabric details (GET:4). |
| **API** | `app/api/tecidos/referencia/route.ts` | Fabric references. |
| **API** | `app/api/pecas/route.ts` | Pieces CRUD (GET:5, POST:33). |
| **API** | `app/api/pecas/[id]/route.ts` | Piece details. |
| **API** | `app/api/pecas/[id]/corte/route.ts` | Piece cuts (nested). |
| **API** | `app/api/pecas/[id]/corte/[corteId]/route.ts` | Specific cut ops. |
| **API** | `app/api/setup/route.ts` | App setup (POST:7). |
| **Layout** | `components/app-shell.tsx` | Root layout (auth, navbar, sidebar:9). |
| **Nav** | `components/navbar.tsx` | Top nav (`NavbarProps`:6, export:10). |
| **Nav** | `components/sidebar.tsx` | Side nav (`SidebarProps`:16, `handleClickOutside`:29). |
| **UI** | `components/print-button.tsx` | Print trigger (export:3). |
| **UI** | `components/ui/button.tsx` | Button primitive (`ButtonProps`:31). |
| **UI** | `components/ui/input.tsx` | Input primitive (`InputProps`:4). |
| **UI** | `components/ui/textarea.tsx` | Textarea (`TextareaProps`:4). |
| **UI** | `components/ui/label.tsx` | Label (`LabelProps`:4). |
| **UI** | `components/ui/field.tsx` | Form field wrapper (`FieldProps`:3). |
| **UI** | `components/ui/type-badge.tsx` | Entity type badges (export:10). |
| **Pages** | `app/page.tsx` | Dashboard (`DashboardPage`:10). |

## Code Patterns and Conventions

- **API Routes**:
  ```ts
  import { NextRequest, NextResponse } from 'next/server';
  import { getServerSession } from 'next-auth/next';
  // import { prisma } from '@/lib/prisma'; // Inferred

  export async function GET(request: NextRequest) {
    try {
      const session = await getServerSession(authOptions); // Or similar
      if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const data = await prisma.tecidos.findMany({ /* where session.user.id */ });
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  export async function POST(request: NextRequest) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const formData = await request.formData(); // Or JSON
      const newItem = await prisma.tecidos.create({ data: { nome: formData.get('nome'), /* ... */ } });
      revalidatePath('/tecidos');
      return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
  }
  ```

- **Server Pages**:
  ```tsx
  import { AppShell } from '@/components/app-shell';
  import { getServerSession } from 'next-auth/next';

  export default async function TecidosPage() {
    const session = await getServerSession();
    if (!session) redirect('/login');
    const data = await fetch(`${process.env.BASE_URL}/api/tecidos`, { cache: 'no-store' }).then(r => r.json());
    return (
      <AppShell>
        <div className="flex flex-col gap-4 p-6">
          {/* Responsive table/grid with data.map(...) */}
        </div>
      </AppShell>
    );
  }
  ```

- **Client Forms**:
  ```tsx
  'use client';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Field } from '@/components/ui/field'; // Custom wrapper
  import { useRouter } from 'next/navigation';

  export function NovoTecidoForm() {
    const router = useRouter();
    async function handleSubmit(formData: FormData) {
      await fetch('/api/tecidos', { method: 'POST', body: formData });
      router.refresh(); // Or router.push('/tecidos')
    }
    return (
      <form action={handleSubmit} className="space-y-4 p-6">
        <Field label="Nome">
          <Input name="nome" required />
        </Field>
        <Button type="submit" className="w-full">Criar Tecido</Button>
      </form>
    );
  }
  ```

- **Print Pages** (e.g., `app/tecidos/[id]/imprimir/page.tsx`):
  ```tsx
  export default async function ImprimirPage({ params }: { params: { id: string } }) {
    const data = await fetch(`${process.env.BASE_URL}/api/tecidos/${params.id}`).then(r => r.json());
    return (
      <div className="p-8 print:p-0">
        <PrintButton className="no-print" />
        {/* Print-friendly content: tables, no nav */}
      </div>
    );
  }
  ```

- **General**:
  - **Styling**: Tailwind classes (`cn()` util), responsive (`grid md:grid-cols-2 gap-4`), print media queries.
  - **Types**: Export all props/interfaces (extend `React.ButtonHTMLAttributes` etc.).
  - **Auth**: Wrap in `AuthProvider`; guard APIs/pages.
  - **Nav**: Arrays in `Navbar`/`Sidebar` for dynamic links.
  - **Validation**: Server-side (Zod/Prisma); client `required`.
  - **Naming**: Portuguese (`pecas`, `tecidos`, "Salvar", "Novo"), PascalCase components, kebab-case routes.

## Best Practices from Codebase

- **Server-First**: Fetch in server components/APIs; pass as props; `cache: 'no-store'` for real-time.
- **Reusability**: Use/extend shadcn primitives; `Field` for labeled inputs; export props/types.
- **Accessibility**: `Label htmlFor={inputId}`, `aria-label`, `role="button"`.
- **Responsive**: Mobile-first (`flex flex-col md:flex-row`), sidebar collapse.
- **Error Handling**: Comprehensive try-catch; 4xx/5xx responses; UI loading/error states.
- **Performance**: `revalidatePath('/')` or `router.refresh()` post-mutation; no client-side DB.
- **Print-Optimized**: `/[id]/imprimir` routes; `PrintButton` + `.no-print`; A4-friendly CSS.
- **Security**: Session checks first-line; formData sanitization; no secrets client-side.
- **Modularity**: One export per route/page; small components.
- **Consistency**: Portuguese UI text; `TypeBadge` for entities; auth redirects.

## Workflows for Common Tasks

### 1. New Entity CRUD (e.g., "fornecedores")
   1. DB: Add Prisma model/schema if needed (`prisma migrate dev`).
   2. API: `app/api/fornecedores/route.ts` (GET/POST); `app/api/fornecedores/[id]/route.ts` (GET/PATCH/DELETE).
   3. Nav: Add to `components/sidebar.tsx`/`navbar.tsx` link arrays.
   4. List: `app/fornecedores/page.tsx` (server fetch, table w/ actions: edit/delete/print).
   5. Create: `app/fornecedores/novo/page.tsx` (`'use client'`, form w/ `Field`+`Input`+`Button`).
   6. Detail: `app/fornecedores/[id]/page.tsx` (fetch, edit form, `<PrintButton />`).
   7. Print: `app/fornecedores/[id]/imprimir/page.tsx` (print-optimized).
   8. Test: `npm run dev`; CRUD cycle, auth, print, mobile.

### 2. Nested Feature (e.g., "montagem" under "pecas")
   1. API: `app/api/pecas/[id]/montagem/route.ts` (GET/POST); `/[id]/montagem/[montagemId]/route.ts`.
   2. List/Add: Update `app/pecas/[id]/page.tsx` (add section/button).
   3. Form: `app/pecas/[id]/montagem/novo/page.tsx`.
   4. Print: `app/pecas/[id]/montagem/[id]/imprimir/page.tsx`.
   5. Nav: Conditional link in piece detail sidebar.

### 3. UI Enhancement (e.g., New Form Field or Modal)
   1. New Primitive: Duplicate `components/ui/[similar].tsx`, export props.
   2. Integrate: Use in forms (`<Field label="..."><NewInput name="..." /></Field>`).
   3. Modal: `'use client'`, state-driven, Tailwind dialogs.
   4. Print View: Duplicate `/imprimir`, fetch `searchParams.id`.

### 4. Form-Centric Feature
   1. Client: `'use client'`, `form action={async (fd) => { ... fetch ...; router.refresh(); }}`.
   2. Fields: Stack `Field` wrappers; `Textarea` for multi-line.
   3. Submit: `Button type="submit" disabled={loading}`.
   4. Validation: Client `required`; server full.

### 5. Integration & Polish Checklist
   | Step | Verify |
   |------|--------|
   | **Files** | New routes/pages match patterns; nav updated. |
   | **Auth** | Session in API/page; redirect unauth. |
   | **Data** | Server fetch → optimistic client update. |
   | **UI** | shadcn + responsive + a11y + Portuguese labels. |
   | **Print** | Dedicated route + `PrintButton` + media queries. |
   | **Errors** | Try-catch, empty states, toasts if pattern. |
   | **Perf** | No-store, revalidate, no leaks. |
   | **Test** | Manual: CRUD, print, mobile, auth fail. |

### Output Guidelines for Changes
- New files: Full code block with ```tsx/ts.
- Edits: ```diff blocks.
- Commit: `feat: add [entity/feature] (full CRUD + UI + print)`.
- Self-Review: Patterns matched? Reusable? Responsive? Secure? Tested?
