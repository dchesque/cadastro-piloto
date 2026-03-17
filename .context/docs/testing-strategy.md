# Testing Strategy

Quality in the Cadastro Piloto codebase is maintained through a layered testing approach that emphasizes reliability, maintainability, and developer productivity. We prioritize **unit tests** for isolated logic in utilities (e.g., [`lib/utils.ts`](lib/utils.ts) functions like `cn`, `formatCurrency`, `formatDate`) and UI primitives (e.g., [`components/ui/button.tsx`](components/ui/button.tsx)). **Integration tests** validate API routes (e.g., [`app/api/tecidos/route.ts`](app/api/tecidos/route.ts) `GET`/`POST` handlers) and Prisma interactions. **End-to-end (E2E) tests** ensure user workflows across key pages like [`app/pecas/page.tsx`](app/pecas/page.tsx), [`app/tecidos/[id]/page.tsx`](app/tecidos/[id]/page.tsx), and auth flows via [`components/auth-provider.tsx`](components/auth-provider.tsx).

Tests align with [test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development) principles where feasible. Coverage is enforced in CI/CD pipelines alongside linting (ESLint), formatting (Prettier), and TypeScript checks. See the [development workflow](./development-workflow.md) for integration details.

## Test Types

### Unit Tests
- **Purpose**: Test pure functions and React components in isolation.
- **Examples**:
  - Utilities: `formatCurrency(1234.56)` → `"R$ 1.234,56"`.
  - Components: Render `<Button variant="outline">Click</Button>` and assert accessibility.
  - Reference generation: `gerarReferenciaPeca({ ano: 2024, sequencia: 1 })`.
- **Tools**: Jest + `@testing-library/react` + `jest-environment-jsdom`.
- **File
