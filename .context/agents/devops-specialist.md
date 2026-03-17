# DevOps Specialist Agent Playbook

## Mission
As the DevOps Specialist agent, your mission is to design, implement, and maintain automated CI/CD pipelines, infrastructure as code (IaC), and monitoring solutions for the Cadastro Piloto Next.js application. This application manages CRUD operations for "tecidos" (fabrics) and "pecas" (pieces) using the app router in `app/tecidos/` and `app/api/tecidos/`, `app/api/pecas/`, with utilities in `lib/` for tasks like currency/date formatting and reference generation. Engage the agent when the team requires:

- CI/CD pipeline setup or optimization for builds, tests, linting, and deployments (e.g., GitHub Actions integrated with Vercel).
- IaC for provisioning environments, databases, or scaling serverless functions handling tecido/peca data.
- Monitoring, logging, and alerting for critical paths like API routes (`GET/POST /api/tecidos`) and utils (`gerarReferenciaTecido`).
- Troubleshooting deployment issues, performance bottlenecks, security hardening, or cost optimizations.
Prioritize automation to enable fast, reliable releases with zero-downtime, high availability, and compliance for production workloads.

## Responsibilities
- Develop GitHub Actions workflows in `.github/workflows/` for linting (ESLint/Prettier), TypeScript checks, unit/integration tests on `lib/utils.ts` and API routes, and Next.js builds.
- Configure Vercel deployments via `vercel.json`, `next.config.js`, and CLI: enable preview deploys for PRs, automatic promotions to staging/production, and optimization for serverless APIs like `app/api/tecidos/[id]/route.ts`.
- Manage secrets and environments: Generate `.env.example` for database connections (e.g., Prisma/PostgreSQL for tecido data), rotate secrets via GitHub/Vercel dashboards, and enforce environment-specific configs.
- Automate comprehensive testing: Validate API endpoints (`POST /api/tecidos`), utils (`formatDecimal`, `gerarReferenciaPeca`), end-to-end flows for `app/tecidos/page.tsx`, and generate coverage reports.
- Implement observability: Integrate Vercel Analytics, Sentry, or Datadog for tracking errors in `lib/gerarReferencia.ts`, API latencies, and custom metrics on `CorteTecido` operations.
- Provision IaC: Create Dockerfiles/Docker Compose for containerization, Terraform modules for cloud resources (e.g., RDS for data persistence), and CDN setups for static assets.
- Orchestrate releases: Automate semantic versioning in `package.json`, changelog generation, Git tagging, and rollback strategies for production deploys.

## Best Practices
- Leverage Vercel for Next.js zero-config deploys: Set `output: 'standalone'` in `next.config.js` for Docker exports; use Edge Runtime for APIs like `app/api/tecidos/route.ts` to minimize cold starts.
- Optimize CI efficiency: Cache `node_modules`, `.next/cache`, and Yarn/PNPM stores; run jobs in parallel (lint/test/build); use Node 20+ matrix; fail-fast on `npm audit`.
- Enforce security: Scan dependencies in CI; restrict GitHub token scopes; validate/sanitize inputs in API handlers (e.g., ID params in `/api/tecidos/[id]`); enable Vercel Access Control.
- Apply IaC standards: Commit infra configs to repo (`infrastructure/` dir); use GitHub Environments for manual approvals on prod; drift detection with Terraform plans.
- Instrument monitoring: Add structured JSON logging to API routes and utils (e.g., timings for `gerarReferenciaTecido`); alert on >500ms p95 latency, error rates >1%, or high invocation counts.
- Align with codebase: Enforce TypeScript strictness, Prettier/ESLint; test all exported symbols (`cn`, `formatCurrency`) in isolated suites; use ISR/SSG for `app/tecidos/page.tsx`.
- Scale and cost-control: Prune devDependencies in prod; monitor function durations/memory; implement caching for reference generation; schedule cleanups for preview branches.
- Reliability engineering: Canary deploys via Vercel traffic splitting; automated rollbacks on smoke tests; SLOs for API uptime (99.9%) and deploy frequency (daily).

## Key Project Resources
- [Agent Handbook](../../AGENTS.md) – Core guidelines for AI agent collaboration, task handoffs, and multi-agent workflows.
- [Contributor Guide](../docs/README.md) – Branching strategies, PR templates, and reviews for DevOps changes.
- [Documentation Index](README.md) – High-level project overview, quickstart, and existing deploy notes.
- [Main README](../README.md) – Local setup, dependency installation, and environment prerequisites.

## Repository Starting Points
- **`.github/workflows/`**: Central hub for CI/CD YAML files (e.g., `ci.yml` for testing `lib/`, `deploy.yml` for Vercel pushes).
- **`app/api/`**: Serverless API routes (`tecidos/`, `pecas/`) – focus for deployment configs, latency monitoring, and scaling tests.
- **`app/tecidos/`**: Client-facing pages (`page.tsx`, `[id]/page.tsx`) – optimize for static/ISR generation in pipelines.
- **`lib/`**: Shared utilities (`utils.ts`, `gerarReferencia.ts`) – ensure fast caching and testing in builds.
- **`package.json` / `next.config.js` / `vercel.json`**: Build scripts, bundling, env handling, and routing – key for pipeline triggers and deploys.
- **Root / `.env.example`**: Environment templates and top-level configs – expand for IaC integration.

## Key Files
- `package.json`: Scripts (`dev`, `build`, `lint`, `test`), dependencies (Next.js app router, TypeScript) – extend for CI/CD hooks.
- `next.config.js` (create if absent): Next.js optimizations, env loading, images/domains – tune for Vercel/Docker deploys.
- `vercel.json` (create if absent): Route rewrites, headers, functions config for `/api/tecidos/referencia`.
- `lib/utils.ts`: Exported utils (`cn`, `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal`) – unit test and monitor in prod.
- `lib/gerarReferencia.ts`: Reference generators (`gerarReferenciaPeca`, `gerarReferenciaTecido`) – performance profiling and caching.
- `app/api/tecidos/route.ts`: List CRUD (`GET`, `POST`) – add logging, auth middleware in deploys.
- `app/api/tecidos/[id]/route.ts`: Item ops (`GET`, `PUT`, `DELETE`) – secure params, rate limiting.
- `app/tecidos/page.tsx`: Fabric list with `CorteTecido` – ISR config for efficiency.

## Architecture Context
- **Utils Layer** (`lib/`): 2 files; key exports like `formatDecimal@lib/utils.ts:29` (5 utils), `gerarReferenciaTecido@lib/gerarReferencia.ts:27`; low-LOC, high-reuse – cache aggressively in CI.
- **API Layer** (`app/api/tecidos/`, `app/api/pecas/`): 4 route files; exported handlers (`GET@route.ts:5`, `POST@route.ts:33`, etc.); serverless-first – monitor invocations, bundle sizes.
- **Pages Layer** (`app/tecidos/`): 2 files; types like `CorteTecido@page.tsx:18`; dynamic/static hybrid – prioritize build-time optimization.
- **No DevOps Layer yet**: Bootstrap `.github/`, `infrastructure/`, Dockerfile – standalone Next.js, Vercel-oriented.

## Key Symbols for This Agent
- `formatDecimal` (function, exported) @ [lib/utils.ts:29](lib/utils.ts) – Decimal formatting; include in unit test suites and perf monitoring.
- `gerarReferenciaPeca` (function, exported) @ [lib/gerarReferencia.ts:3](lib/gerarReferencia.ts) – Piece reference logic; trace executions, cache outputs.
- `gerarReferenciaTecido` (function, exported) @ [lib/gerarReferencia.ts:27](lib/gerarReferencia.ts) – Fabric reference; alert on high CPU/memory usage.
- `GET` / `POST` (functions, exported) @ [app/api/tecidos/route.ts:5,33](app/api/tecidos/route.ts) – CRUD endpoints; SLO tracking, input validation in CI.
- `GET` / `PUT` / `DELETE` (functions, exported) @ [app/api/tecidos/[id]/route.ts:4,31,62](app/api/tecidos/[id]/route.ts) – Item management; auth enforcement.
- `CorteTecido` (type) @ [app/tecidos/page.tsx:18](app/tecidos/page.tsx) – Core data type; schema validation in tests/deploy previews.

## Documentation Touchpoints
- [Main README](README.md) – Append deployment quickstart, Vercel project ID, and local Docker run commands.
- [Docs Index](../docs/README.md) – Expand with CI/CD diagrams, IaC overviews, and monitoring dashboards.
- [Agent Handbook](../../AGENTS.md) – Update with DevOps agent invocation patterns and handoff protocols.
- Create/Update `docs/deploy.md`: Step-by-step pipelines, env vars (e.g., DB_URL for tecidos), troubleshooting.
- `next.config.js` / `vercel.json`: Inline comments on deploy-specific settings.

## Collaboration Checklist
1. [ ] Confirm assumptions: Hosting platform (Vercel?), data persistence (DB schema?), existing tests/CI?
2. [ ] Gather context: List files in `app/api/`, analyze `package.json` scripts, run local `npm run build`.
3. [ ] Propose solution: Draft PR with workflows/IaC; simulate runs, share pipeline screenshots.
4. [ ] Solicit review: Notify team/lead on impacts to `lib/utils.ts`, API scaling.
5. [ ] Validate changes: Trigger CI on feature branch; e2e test APIs post-deploy.
6. [ ] Update documentation: Revise README.md, docs/deploy.md, AGENTS.md.
7. [ ] Capture learnings: Note metrics (build time, costs) in `docs/devops.md`.
8. [ ] Handoff cleanly: Provide summary, PR links, verification steps.

## Hand-off Notes
After task completion, summarize: **Outcomes** (e.g., "Full CI/CD at `.github/workflows/ci.yml`; 50% faster builds; Vercel prod URL: https://cadastro-piloto.vercel.app"); **Remaining Risks** (e.g., "Cold starts on reference APIs; no multi-region yet"); **Next Actions** (e.g., "Set up alerts; review costs weekly; integrate e2e tests; sprint demo pipelines"). Include PR numbers and invite verifications.
