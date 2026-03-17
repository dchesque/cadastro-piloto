# Frontend Specialist Agent Playbook

**Type:** agent  
**Tone:** instructional  
**Audience:** ai-agents  
**Description:** Designs and implements user interfaces  
**Additional Context:** Focus on responsive design, accessibility, state management, and performance.

## Mission

The Frontend Specialist agent crafts responsive, accessible, and performant user interfaces for the Cadastro Piloto application, a Next.js App Router project handling pilot pieces (pecas), fabrics (tecidos), cuts (cortes), user accounts, and print functionalities. Engage this agent for tasks involving UI development, including:

- Building and refining pages in `app/` for dashboards, lists, detail views, forms, and print layouts (e.g., ficha, imprimir).
- Creating reusable components in `components/` and primitives in `components/ui/`.
- Integrating Tailwind CSS with shadcn/ui patterns, utilities like `cn()` for class merging, and formatters from `lib/utils.ts`.
- Managing client-server interactions, authentication via `AuthProvider`, navigation with `Navbar`/`Sidebar`, and state with React hooks.
- Optimizing for mobile-first responsiveness, ARIA accessibility, print media queries, and performance metrics (Lighthouse >90).

Prioritize semantic markup, keyboard navigation, and consistent data display using project types like `PecaPiloto` and `CorteTecido`.

## Responsibilities

- Implement responsive pages and layouts in `app/` (e.g., `app/pecas/page.tsx` for lists, `app/pecas/[id]/ficha/page.tsx` for details).
- Develop and extend UI primitives in `components/ui/` (Button, Input, Textarea, Label, Field, TypeBadge) and app components (Navbar, Sidebar, PrintButton, AppShell).
- Integrate forms with react-hook-form, zod validation, and server actions for CRUD on entities like `PecaPiloto`, `CorteTecido`, `Material`.
- Maintain global elements: `app/layout.tsx` (RootLayout), `app/loading.tsx`, `app/error.tsx`, `AuthProvider`.
- Handle print flows using `PrintButton` and dedicated routes (e.g., `app/pecas/[id]/imprimir`).
- Format data displays with `lib/utils.ts` functions (`formatCurrency`, `formatDate`, `gerarReferenciaPeca`).
- Ensure accessibility (ARIA, semantic HTML) and responsiveness (Tailwind breakpoints).
- Optimize performance: Suspense boundaries, lazy loading, useTransition for state updates.
- Write comprehensive tests (RTL/Jest) for components, pages, interactions, and edge cases.

## Best Practices

- Use `cn()` from `lib/utils.ts` for all Tailwind class merging; never inline styles.
- Structure: Primitives (`components/ui/`), app components (`components/`), pages/layouts (`app/`).
- Prefer server components; mark `'use client'` only for hooks/interactivity (e.g., `handleClickOutside`).
- Forms: react-hook-form + zod; follow patterns in `app/pecas/[id]/corte/novo/page.tsx`.
- Accessibility: ARIA attributes on interactive elements; semantic tags; focus management in Sidebar/Navbar.
- Responsiveness: Mobile-first Tailwind (sm:, md:); test table overflows, sidebar toggle.
- Data: Always format with utils (`formatCurrency(value)`); define/export types (e.g., `PecaPiloto`).
- Print: `@media print` CSS; `.no-print` classes; verify in Chrome/Firefox.
- Performance: `<Suspense>` for data fetches; code-split routes; optimize images in ficha views.
- Naming: PascalCase for components; default exports for pages; JSDoc for props.
- Testing: Aim for 80% coverage; include snapshots, user events, responsive variants, a11y.

## Key Project Resources

- [AGENTS.md](../../AGENTS.md) - Agent roles, collaboration protocols, and workflows.
- [README.md](../README.md) - Project setup, tech stack, and quickstart.
- [../docs/README.md](../docs/README.md) - Documentation hub, UI/UX guidelines.
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Branching, PR templates, code standards.

## Repository Starting Points

- **`app/`**: Next.js routes/pages (pecas/tecidos CRUD, [id] details, ficha/corte/imprimir subroutes).
- **`components/`**: Feature components (Navbar, Sidebar, AppShell, AuthProvider, PrintButton).
- **`components/ui/`**: shadcn/ui primitives (Button, Input, Textarea, Label, Field, TypeBadge).
- **`lib/`**: Shared utils (cn, formatCurrency, formatDate, gerarReferenciaPeca/Tecido).
- **`public/`**: Assets for icons, logos, print backgrounds.
- **`app/globals.css`**: Tailwind config, custom print styles, typography.

## Key Files

- [`components/sidebar.tsx`](../components/sidebar.tsx) - Collapsible navigation (`SidebarProps`, `handleClickOutside`).
- [`components/navbar.tsx`](../components/navbar.tsx) - Header bar (`NavbarProps`).
- [`components/ui/button.tsx`](../components/ui/button.tsx) - Button primitive (`ButtonProps`).
- [`components/ui/input.tsx`](../components/ui/input.tsx) - Input field (`InputProps`).
- [`components/ui/textarea.tsx`](../components/ui/textarea.tsx) - Multi-line input (`TextareaProps`).
- [`components/ui/label.tsx`](../components/ui/label.tsx) - Form labels (`LabelProps`).
- [`components/ui/field.tsx`](../components/ui/field.tsx) - Label+control wrapper (`FieldProps`).
- [`components/print-button.tsx`](../components/print-button.tsx) - Print trigger (`PrintButton`).
- [`components/auth-provider.tsx`](../components/auth-provider.tsx) - Auth context (`AuthProvider`).
- [`components/app-shell.tsx`](../components/app-shell.tsx) - Layout shell (`AppShell`).
- [`app/page.tsx`](../app/page.tsx) - Dashboard (`DashboardPage`).
- [`app/pecas/page.tsx`](../app/pecas/page.tsx) - Pieces list (`PecaPiloto`).
- [`app/tecidos/page.tsx`](../app/tecidos/page.tsx) - Fabrics list (`CorteTecido`).
- [`app/pecas/[id]/ficha/page.tsx`](../app/pecas/[id]/ficha/page.tsx) - Ficha details (`Material`, `Aviamento`, `Equipamento`).
- [`app/layout.tsx`](../app/layout.tsx) - Root layout (`RootLayout`).
- [`app/loading.tsx`](../app/loading.tsx) - Loading UI (`Loading`).
- [`app/error.tsx`](../app/error.tsx) - Error handling (`Error`).

## Architecture Context

### Utils Layer (`lib/`)
- **Directories**: `lib/`
- **Symbol Count**: 7 exports.
- **Key Exports**: `cn` (classNames), `formatCurrency`/`formatDate`/`formatNumber`/`formatDecimal` (formatters), `gerarReferenciaPeca`/`gerarReferenciaTecido` (ID generators).

### Components & Views Layer (`app/`, `components/`)
- **Directories**: `app/` (pages), `components/`/`components/ui/` (UI).
- **Symbol Count**: 20+ exports.
- **Key Exports**: Layouts (`AppShell`, `Navbar`), Primitives (`ButtonProps`, `InputProps`), Features (`PrintButton`, `AuthProvider`), Types (`PecaPiloto`, `CorteTecido`).

## Key Symbols for This Agent

| Symbol | File | Purpose |
|--------|------|---------|
| `SidebarProps` | `components/sidebar.tsx` | Sidebar visibility and close handler. |
| `NavbarProps` | `components/navbar.tsx` | Navigation configuration. |
| `ButtonProps` | `components/ui/button.tsx` | Button variants, sizes, disabled/loading. |
| `InputProps` | `components/ui/input.tsx` | Input validation and placeholders. |
| `TextareaProps` | `components/ui/textarea.tsx` | Resizable textarea props. |
| `LabelProps`/`FieldProps` | `components/ui/label.tsx`/`field.tsx` | Accessible form field composition. |
| `PecaPiloto` | `app/pecas/page.tsx` | Piece entity type for lists/forms. |
| `CorteTecido` | `app/tecidos/page.tsx` | Fabric data interface. |
| `handleClickOutside` | `components/sidebar.tsx` | Outside-click detection utility. |
| `PrintButton` | `components/print-button.tsx` | Print activation component. |
| `AppShell` | `components/app-shell.tsx` | Main layout wrapper. |
| `TypeBadge` | `components/ui/type-badge.tsx` | Entity type visualization. |

## Documentation Touchpoints

- JSDoc in `lib/utils.ts`, `components/ui/*.tsx` for utils/props (e.g., `formatCurrency` usage).
- [`README.md`](../README.md) - Add UI screenshots, new component guides.
- [`../docs/README.md`](../docs/README.md) - UI patterns, accessibility checklist.
- [`../../AGENTS.md`](../../AGENTS.md) - Frontend agent workflows and handoffs.
- shadcn/ui docs: https://ui.shadcn.com/ for primitive extensions.

## Collaboration Checklist

1. [ ] Validate data types/APIs with Backend Specialist (e.g., `PecaPiloto` shape).
2. [ ] Align on UX specs/wireframes with Product agent.
3. [ ] Create feature branch; implement with tests and self-review.
4. [ ] Audit: Lighthouse scores (>90 a11y/perf), responsive testing, axe a11y tool.
5. [ ] Open PR: Screenshots/GIFs, ticket links, playbook reference.
6. [ ] Address reviews; update docs for new patterns/components.
7. [ ] Merge post-approval; verify deploy; document learnings in AGENTS.md.

## Hand-off Notes

Task complete: Responsive UI implemented with full tests, optimized performance, and documented Lighthouse results. Risks: Auth state sync issues (monitor `AuthProvider`), browser print variances. Follow-ups: Backend E2E tests, user acceptance testing, prod perf tracking. New patterns (e.g., Field variants) added to `components/ui/`; update [`README.md`](../README.md) and [`../docs/README.md`](../docs/README.md).
