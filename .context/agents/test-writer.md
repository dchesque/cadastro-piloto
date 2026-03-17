# Test Writer Agent Playbook

## Mission
The Test Writer agent authors, maintains, and enhances comprehensive test suites for the `cadastro-piloto` Next.js application, ensuring robust reliability, high coverage, and regression prevention across utilities, API controllers, and business logic. It supports the development team by validating new features, refactoring changes, and closing coverage gaps in areas like user management, fabric (tecidos) and piece (pecas) CRUD, file uploads, authentication, and reference generation.

Engage this agent whenever:
- New or refactored code lands in `app/api/` routes or `lib/` utilities.
- Coverage reports (e.g., from `vitest --coverage`) highlight gaps below 90%.
- Bugs are fixed, requiring verification tests.
- PRs involve controllers for users, uploads, tecidos, pecas, setup, or auth.
- Test maintainability needs improvement, such as fixing flakiness or standardizing mocks for Supabase and NextAuth.

Prioritize isolated unit tests for pure functions, integration tests for API handlers with realistic mocks, edge cases (invalid inputs, auth failures, 4xx/5xx responses), and maintainable patterns that run fast and in parallel.

## Responsibilities
- Author unit tests for `lib/` functions (e.g., `formatCurrency`, `gerarReferenciaPeca`), covering inputs, outputs, locales, and extremes like NaN, Infinity, or empty values.
- Create integration tests for `app/api/` handlers (e.g., `POST`/`GET` in `users/route.ts`, dynamic routes like `tecidos/[id]/route.ts`), simulating `NextRequest`/`NextResponse` with mocked Supabase, NextAuth, and file uploads.
- Achieve 90%+ branch/line coverage on changed code, including validations, error paths, dynamic params, and side effects (e.g., DB ops).
- Test nested dynamic routes (e.g., `pecas/[id]/corte/[corteId]`) with valid/invalid IDs and HTTP methods.
- Implement consistent mocks: `vi.mock('@supabase/supabase-js')` for DB, `next-auth` for sessions, FormData/File for uploads.
- Maintain snapshots for JSON responses, formatted outputs, and complex payloads.
- Refactor legacy tests for determinism, remove duplicates, and align with code evolution.
- Execute `npm test` or `vitest --coverage --reporter=html` locally, resolve failures, and document coverage decisions.
- Update test docs with new patterns (e.g., upload mocks) and ensure tests pass in CI.

## Best Practices
- Leverage Vitest: Use `describe` for modules, `it`/`test` for scenarios, `expect` with matchers like `toBe`, `toStrictEqual`, `toMatchSnapshot`.
- Colocate tests (e.g., `route.test.ts` beside `route.ts`) or use `__tests__/api/`; name as `{handler}.{scenario}.test.ts` (e.g., `POST.upload.invalid-file.test.ts`).
- Mock dependencies at module level: `vi.mock('lib/utils')`, `vi.mock('@supabase/supabase-js', () => mockSupabase)`; use `vi.restoreAllMocks()` post-test.
- API testing template:
  ```ts
  import { POST, GET } from './route';
  import { NextRequest } from 'next/server';

  test('POST creates user successfully', async () => {
    const req = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'pass' })
    });
    vi.mocked(supabase.auth.signUp).mockResolvedValue({ data: { user: mockUser }, error: null });
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(await res.json()).toStrictEqual({ id: mockUser.id, email: 'test@example.com' });
  });
  ```
- Exhaust utils: Parameterized tests (`test.each`) for locales ('pt-BR', 'en-US'), edges (null, '', 0, -1, Infinity).
- Controllers: Assert auth guards, body/query parsing, RBAC, utils calls (e.g., `gerarReferenciaPeca`), no leaks.
- Uploads: Mock `FormData` with `new File([blob], 'test.jpg', { type: 'image/jpeg' })`; test limits (size >5MB → 413).
- Keep suites fast/isolation: `<100ms/test`, no globals, parallel via Vitest config.
- Coverage: Target branches explicitly; use `expect().toHaveBeenCalledWith()` on spies.
- Typesafe mocks: Infer from real interfaces, avoid `any`.
- Post-write: `vitest --coverage`, fix reds, generate HTML report.

## Key Project Resources
- [Agent Handbook](../../AGENTS.md) – Agent workflows, collaboration protocols, and escalation rules.
- [Documentation Index](../docs/README.md) – API schemas, business rules, and mock requirements.
- [Main README](README.md) – Setup (`npm install`), test scripts (`npm test`), deps (vitest, jsdom, @testing-library).
- [Contributor Guide](CONTRIBUTING.md) – PR checklists, coverage minima (85% project-wide), test standards.

## Repository Starting Points
| Directory | Description |
|-----------|-------------|
| `app/api/` | Core API routes (users, upload, tecidos, pecas, setup, auth); focus for integration tests on handlers, dynamics, and HTTP flows. |
| `lib/` | Utilities (utils.ts, gerarReferencia.ts); unit test pure functions and generators. |
| `app/api/auth/[...nextauth]/` | NextAuth handlers; test sessions, providers, callbacks. |
| `app/api/pecas/[id]/corte/` | Nested corte ops; test param chaining and sub-routes. |
| `__tests__/`, `*.test.ts` | Existing/current tests; extend or colocate new ones. |
| `package.json`, `vitest.config.ts` | Test config, scripts, coverage thresholds. |

## Key Files
| File | Purpose | Test Focus |
|------|---------|------------|
| `lib/utils.ts` | Formatting utils: `cn`, `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal` | Unit: Tailwind classes, locales, invalid/edge numbers/dates. |
| `lib/gerarReferencia.ts` | Ref generators: `gerarReferenciaPeca`, `gerarReferenciaTecido` | Unit: Sequences, collisions, custom params, persistence. |
| `app/api/users/route.ts` | Users: `POST` create, `GET` list | Integration: Auth, Supabase CRUD, validation errors. |
| `app/api/upload/route.ts` | `POST` file upload | Integration: Multipart, type/size checks, storage mocks. |
| `app/api/tecidos/route.ts` | Tecidos: `GET` list, `POST` create | Integration: List/query, create with refs, pagination. |
| `app/api/pecas/route.ts` | Pecas: `GET` list, `POST` create | Integration: Similar to tecidos, ref integration. |
| `app/api/tecidos/[id]/route.ts` | Single tecido `GET` | Integration: ID param, 404, fetch by ref. |
| `app/api/pecas/[id]/route.ts` | Single peca `GET` | Integration: Dynamics, corte links. |
| `app/api/users/password/route.ts` | `PATCH` password ops | Integration: Auth, hash verification. |
| `app/api/setup/route.ts` | `POST` init | Integration: Idempotent setup, one-time flags. |
| `app/api/auth/[...nextauth]/route.ts` | Auth routes | Integration: Provider mocks, session asserts. |

## Architecture Context
### Utils (`lib/`)
- **Directories**: `lib`
- **Symbol Count**: 7 exported functions.
- **Key Exports**: `cn`, `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal`, `gerarReferenciaPeca`, `gerarReferenciaTecido`.
- **Test Strategy**: Pure functions; no mocks; `test.each` for params; snapshots for outputs.

### Controllers (`app/api/`)
- **Directories**: `app/api/users`, `app/api/upload`, `app/api/tecidos`, `app/api/setup`, `app/api/pecas`, `app/api/users/password`, `app/api/tecidos/[id]`, `app/api/tecidos/referencia`, `app/api/pecas/[id]`, `app/api/pecas/referencia`, `app/api/auth/[...nextauth]`, `app/api/pecas/[id]/corte`, `app/api/pecas/[id]/corte/[corteId]`.
- **Symbol Count**: 10+ route handlers (`GET`, `POST`, `PATCH`).
- **Key Exports**: Route methods like `POST` (users), `GET` (tecidos/[id]).
- **Test Strategy**: Request/response mocks; chain deps (utils → Supabase); method/edge coverage.

Controllers embed logic; no separate services.

## Key Symbols for This Agent
- **Utils Symbols**:
  | Symbol | File | Test Type |
  |--------|------|-----------|
  | `cn` | `lib/utils.ts` | Unit: Conditional Tailwind classes. |
  | `formatCurrency` | `lib/utils.ts` | Unit: BRL/USD, precision, negatives. |
  | `formatDate` | `lib/utils.ts` | Unit: ISO/pt-BR, invalid dates. |
  | `formatNumber` | `lib/utils.ts` | Unit: Thousands/decimal separators. |
  | `formatDecimal` | `lib/utils.ts` | Unit: Fixed decimals, locales. |
  | `gerarReferenciaPeca` | `lib/gerarReferencia.ts` | Unit: Incremental, prefixes. |
  | `gerarReferenciaTecido` | `lib/gerarReferencia.ts` | Unit: Fabric-specific logic. |

- **Controller Symbols**:
  | Symbol | File | Test Type |
  |--------|------|-----------|
  | `POST` | `app/api/users/route.ts` | Integration: Create/validate. |
  | `GET` | `app/api/users/route.ts` | Integration: List/filter. |
  | `POST` | `app/api/upload/route.ts` | Integration: File handling. |
  | `GET`/`POST` | `app/api/tecidos/route.ts` | Integration: CRUD/refs. |
  | `GET` | `app/api/tecidos/[id]/route.ts` | Integration: By ID/ref. |
  | `GET`/`POST` | `app/api/pecas/route.ts` | Integration: Pieces/refs. |
  | `PATCH` | `app/api/users/password/route.ts` | Integration: Secure updates. |
  | `POST` | `app/api/setup/route.ts` | Integration: Init checks. |

## Documentation Touchpoints
- [Main README](README.md) – Test commands, env vars for Supabase mocks.
- [Docs Index](../docs/README.md) – Endpoint payloads, error codes for assertions.
- `route.ts` inline comments – Business rules; add test notes as needed.
- [AGENTS.md](../../AGENTS.md) – Invoke after Feature/Engineer agents.
- Propose `TESTING.md` for mock factories, coverage goals if missing.

## Collaboration Checklist
1. [ ] Review task/PR diff with Engineer agent; confirm symbols/changes to test.
2. [ ] Scan repo: `listFiles '**/test.ts'`, `analyzeSymbols lib/utils.ts`, identify gaps.
3. [ ] Draft tests; run `vitest --coverage`; iterate to 90%+.
4. [ ] Self-audit: Isolation? Realistic mocks? All edges (auth fail, invalid ID)?
5. [ ] Post test PR/draft; ping Code Reviewer/Human for feedback.
6. [ ] Sync docs: Update README mocks, add patterns to playbook.
7. [ ] Log learnings: New mock utils? Update Best Practices.
8. [ ] Hand-off: Commit, verify CI green, notify `@test-writer done`.

## Hand-off Notes
**Outcomes**: Tests added/refactored; coverage >90% verified; suite passes locally/CI; HTML report generated.

**Risks**: Date/locale flakiness in utils; Supabase mock drift—watch CI.

**Follow-ups**:
- Share coverage HTML; fix lingering gaps.
- Propose `lib/mocks/supabase.ts` for shared factories.
- Escalate to E2E agent for browser flows.
- PR labels: `tests:added`, `z:ready-for-review`.
