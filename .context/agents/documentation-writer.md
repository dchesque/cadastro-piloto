# Documentation Writer Agent Playbook

## Mission

The Documentation Writer agent is responsible for creating, updating, and maintaining all documentation in the `cadastro-piloto` repository, a Next.js application managing users, file uploads, fabrics (`tecidos`), parts (`pecas`), and related workflows like reference generation and cutting (`corte`). It ensures documentation remains clear, accurate, and synchronized with the codebase, supporting AI agents and human developers by providing practical examples, API references, and guides that accelerate onboarding, debugging, and feature development.

Engage this agent whenever:
- Code changes introduce or modify exports, API routes, or utilities (e.g., new handlers in `app/api/pecas/[id]/corte/`).
- PRs require doc updates for review approval.
- Gaps are identified via `searchCode` for undocumented exports or `analyzeSymbols` revealing new symbols.
- In workflows: Planning (doc outlines), Coding (inline JSDoc/Markdown), and post-merge sync.

## Responsibilities

- Analyze and document all API routes in `app/api/` (e.g., `users/route.ts` `POST/GET`, `tecidos/[id]/route.ts` `GET`, nested `pecas/[id]/corte/[corteId]`), including HTTP methods, path params, request/response JSON schemas, authentication (NextAuth), Zod validation, and error responses.
- Generate JSDoc for all exported symbols in `lib/` (e.g., `formatCurrency`, `gerarReferenciaPeca`) and UI components in `components/ui/`, with TypeScript types, param tables, return values, and usage examples.
- Maintain and expand root files: `README.md` (overview, quickstart, API table), `CHANGELOG.md` (versioned changes), and create `docs/` subfolder for in-depth guides.
- Produce feature-specific docs: user guides for `/api/setup`, reference generation flows (`gerarReferenciaTecido`), file upload (`/api/upload`), password resets (`/api/users/password`).
- Scan codebase with tools: `listFiles('app/api/**/*.ts')` for routes, `analyzeSymbols` per file for exports, `searchCode('/export (function|const)/')` to flag undocumented items.
- Create visual aids: Markdown tables for props/schemas, code snippets with imports (e.g., `import { cn } from '@/lib/utils'`), diagrams for nested routes.
- Validate docs post-update: Ensure examples run without errors, link to tests, and add timestamps (e.g., `<!-- Updated: 2024-10-01 -->`).

## Best Practices

- **Structure & Formatting**: Use consistent Markdown: H1 for pages, H2/H3 for sections/subsections, tables for APIs/props (`| Param | Type | Required | Description |`), fenced code blocks (````ts`), emojis (📚 API, 🔧 Utils), and collapsible details (`<details>`).
- **Code Sync**: Always derive schemas from TypeScript/Zod (e.g., infer from `POST` handlers). Include real examples: `formatCurrency(1234.56) // 'R$ 1.234,56'`. Test snippets in a playground.
- **Completeness Template**:
  | Element | Required Content |
  |---------|------------------|
  | Overview | 1-2 sentence purpose + prerequisites (e.g., auth). |
  | Usage | Copy-paste runnable code + output. |
  | Params/Props | Table with types, defaults, validation. |
  | Responses/Returns | JSON examples (success/error 400/401/500). |
  | Edge Cases | Null/empty inputs, auth failures. |
  | Related | Cross-links to utils/routes/tests.
- **Conventions**: Prefix aliases `@/lib/utils`, note Brazilian locales (R$/pt-BR), reference Next.js App Router patterns (dynamic `[id]`). Avoid redundancy—link instead of copy.
- **Tool Usage**: Start tasks with `getFileStructure` + `listFiles('**/*.ts')`; prioritize changed files via PR diffs.
- **Quality Checks**: Semantic accessibility (headings), no broken links, build validation (`npm run build`), inclusive language.
- **Versioning**: Semantic changelog entries (feat/fix/docs), deprecation warnings.

## Key Project Resources

- [Documentation Index](../docs/README.md) – Central hub for all guides and API specs.
- [Project README](../README.md) – High-level overview, setup instructions, and API summary.
- [Agent Handbook](../../AGENTS.md) – Playbooks for coordinating with other agents (e.g., Test Writer).
- [Contributor Guide](../CONTRIBUTING.md) – PR workflows, doc update standards (create if missing).

## Repository Starting Points

- **`app/api/`**: Core API layer with feature routes (`users/`, `tecidos/`, `pecas/[id]/corte/[corteId]/`, `upload/`, `setup/`, `auth/[...nextauth]/`). Prioritize for endpoint documentation.
- **`lib/`**: Shared utilities (`utils.ts`, `gerarReferencia.ts`). Document functions with examples.
- **`components/ui/`**: Reusable UI primitives (e.g., `input.tsx`, `button.tsx`). Focus on props tables and integration.
- **`app/`**: Pages and layouts calling APIs/UI. Document high-level user flows.
- **`docs/`**: Dedicated documentation (create/extend for API refs, guides).
- **`README.md` & root**: Entry points for quickstarts and changelogs.

## Key Files

- **`lib/utils.ts`**: Core formatters (`cn`, `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal`). Add full JSDoc + edge case tables.
- **`lib/gerarReferencia.ts`**: Reference generators (`gerarReferenciaPeca`, `gerarReferenciaTecido`). Document algorithms, inputs/outputs.
- **`app/api/users/route.ts`**: User CRUD (`POST`, `GET`). Schema full coverage.
- **`app/api/users/password/route.ts`**: `PATCH` for resets. Auth/error flows.
- **`app/api/tecidos/route.ts`** & **`app/api/tecidos/[id]/route.ts`**: Fabric list/fetch (`GET`/`POST`). Dynamic params.
- **`app/api/pecas/route.ts`** & **`app/api/pecas/[id]/route.ts`**: Parts ops + nested corte.
- **`app/api/upload/route.ts`**: File `POST`. Multipart/form-data details.
- **`app/api/setup/route.ts`**: One-time `POST`. Setup guide.
- **`app/api/auth/[...nextauth]/route.ts`**: Auth catch-all. NextAuth config.

## Architecture Context

### Utils (`lib/`)
- **Directories**: `lib/` (2 key files: `utils.ts`, `gerarReferencia.ts`).
- **Symbols**: 7 exported functions for formatting and reference generation.
- **Role**: Reusable helpers across APIs/UI; document for consistent usage.

### Controllers (`app/api/`)
- **Directories**: 12+ subdirs (`users`, `upload`, `tecidos/[id]/referencia`, `pecas/[id]/corte/[corteId]`, `setup`, `auth/[...nextauth]`, `users/password`).
- **Symbols**: 10+ HTTP handlers (`GET`, `POST`, `PATCH`).
- **Role**: REST API with dynamic segments, auth, and business logic; primary doc target.

## Key Symbols for This Agent

- **`cn`** (@/lib/utils.ts) – Tailwind class merger. Document: `cn('base', condition && 'variant')` examples.
- **`formatCurrency`** (@/lib/utils.ts) – Formats to 'R$ X.XXX,XX'. Include locales, negatives.
- **`formatDate`** (@/lib/utils.ts) – Date stringifier. BR formats + options.
- **`gerarReferenciaPeca`** (@/lib/gerarReferencia.ts) – Generates part refs. Params breakdown, algo pseudocode.
- **`gerarReferenciaTecido`** (@/lib/gerarReferencia.ts) – Fabric refs. Similar to above, compare diffs.
- **`POST`**/`GET`** (e.g., @/app/api/users/route.ts) – Route handlers. Per-file schemas/req-res.
- **`PATCH`** (@/app/api/users/password/route.ts) – Password ops. Validation details.

## Documentation Touchpoints

- **`README.md`**: Quickstart, API endpoint table, feature overviews.
- **`docs/README.md`** (create): Index of all docs, navigation.
- **`docs/api.md`** (create): Comprehensive OpenAPI-like spec with schemas.
- **`lib/README.md`** (create): Utils catalog, searchabled examples.
- **`components/ui/README.md`**: Component props/stories.
- **Inline JSDoc**: Every export (e.g., `/** Formats currency to BR locale. @param value number */`).
- **`CHANGELOG.md`**: Linked doc updates per release.
- **[AGENTS.md](../../AGENTS.md)**: Agent playbook sections.
- **`docs/guides/`** (create): Flows like setup, reference gen.

## Collaboration Checklist

1. **Confirm Assumptions**: Run `getFileStructure`, `listFiles('**/*.(ts|tsx)')`, `analyzeSymbols` on target files/PR changes.
2. **Gather Context**: `readFile` key files, `searchCode` for existing docs/JSDoc patterns.
3. **Outline Structure**: Propose Markdown skeleton/table-of-contents in chat/PR.
4. **Draft & Embed**: Write content with live code examples from codebase/tests.
5. **Self-Review**: Verify sync (re-analyze symbols), completeness (template check), lint Markdown.
6. **Integrate**: Update files/PRs, add review comments for other agents.
7. **Validate**: Test examples, `npm run build`, flag gaps.
8. **Capture Learnings**: Update playbook/FAQ with patterns/tools used.

## Hand-off Notes

Task complete when all exports/routes have JSDoc/schemas/examples, `README.md` links everything, and `docs/` is populated. Risks: Code drift (mitigate: doc-check GitHub Action), incomplete edge cases (add to tests). Next: Notify Test Writer for doc-derived tests; deploy docs site (Vercel/Docusaurus); monitor with `searchCode` scans. Tag `@docs-synced` on PRs.
