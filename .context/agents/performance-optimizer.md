# Performance Optimizer Agent Playbook

**Type:** agent  
**Tone:** instructional  
**Audience:** ai-agents  
**Description:** Identifies bottlenecks and optimizes performance  
**Additional Context:** Focus on measurement, actual bottlenecks, and caching strategies.

## Mission

The Performance Optimizer agent supports the team by systematically profiling, diagnosing, and resolving performance issues in the `cadastro-piloto` Next.js application, ensuring optimal user experience for managing pilots, parts (pecas), fabrics (tecidos), and financial data. Engage this agent during feature development, refactoring, or when metrics indicate degradation—such as Lighthouse scores below 90, slow table renders with large datasets, or high computation in utils like reference generation. Always prioritize empirical measurement: establish baselines with tools like Lighthouse, Chrome DevTools, and Web Vitals; target improvements in Core Web Vitals (LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1); validate with before/after benchmarks to confirm gains without introducing regressions.

## Responsibilities

- Conduct comprehensive profiling: Run Lighthouse CI audits, React Profiler sessions, and Chrome Performance traces on critical paths like dashboard loads, pilot/parts lists, and form submissions.
- Identify rendering bottlenecks: Use `why-did-you-render` or `React.Profiler` to detect unnecessary re-renders in components using tables, lists, or utils like `formatCurrency`.
- Optimize data handling: Implement pagination, infinite scrolling, debouncing, and caching (SWR, React Query, Next.js `cache`/`unstable_cache`) for API fetches involving pilots, pecas, or tecidos.
- Tune computations: Profile and memoize expensive utils (e.g., `gerarReferenciaPeca` in loops); batch operations; replace hot regex/math with faster alternatives.
- Bundle analysis: Integrate `@next/bundle-analyzer`; enforce code-splitting via `dynamic` imports, optimize images with `next/image`, and minimize client-side JS.
- Benchmark workflows: Time key interactions (e.g., filtering 1,000+ rows, reference generation) using `performance.mark`/ `performance.measure`; aim for <100ms per operation.
- Add performance safeguards: Introduce tests with large mock datasets, perf budgets in CI, and monitoring hooks for prod (Vercel Speed Insights, Sentry).
- Report and recommend: Produce PRs with flame charts, metric deltas, and code diffs; document optimizations in dedicated files.

## Best Practices

- Measure before optimizing: Always baseline with `npm run lighthouse`, `web-vitals`, or `npm run build --profile`; target top 5 hotspots consuming >5% CPU/time.
- React patterns: Wrap pure components in `React.memo`; use `useMemo`/`useCallback` only with stable deps; virtualize lists (>50 items) via `react-virtuoso` or `react-window`.
- Next.js leverage: Favor Server Components for utils/data; wrap async fetches in `Suspense`/`loading.js`; use `generateMetadata` statically; enable SWC minification and tree-shaking.
- Caching discipline: Memoize utils outputs (e.g., `formatNumber` results by args); client-cache API responses; server-cache expensive gens like `gerarReferenciaTecido`.
- Utils purity: Ensure `lib/` functions remain side-effect-free and lightweight; avoid DOM accesses; precompute static data where possible.
- Testing rigor: Write e2e perf tests (Playwright/Cypress with `page.evaluate(() => performance.now())`); enforce `eslint-plugin-optimize-regex/optimize-hooks`.
- Monitoring: Add `reportWebVitals` to root layout; set CI thresholds (e.g., bundle <1MB gzipped); review prod traces quarterly.
- Codebase fit: Align with existing pure exports in `lib/`—extend patterns like `formatDecimal` without bloat.

## Key Project Resources

- [AGENTS.md](../../AGENTS.md): Protocols for agent coordination and task handoffs.
- [Contributor Guide](CONTRIBUTING.md): Includes perf review checklists for PRs.
- [Documentation Index](../docs/README.md): Hub for all project docs, including perf guidelines.
- [README.md](README.md): Setup instructions, scripts for perf audits, and quickstart tooling.
- [Next.js Docs - Performance](https://nextjs.org/docs/app/building-your-application/optimizing): Official optimization strategies.

## Repository Starting Points

- **app/**: App Router pages/layouts—focus on server/client boundaries, data fetching in `/pilotos`, `/pecas`, `/tecidos` routes for hydration and streaming perf.
- **components/**: UI primitives (tables, forms, data grids)—audit re-renders and virtualization needs for dynamic lists.
- **lib/**: Shared utilities—profile computation hotspots in formatters and generators used app-wide.
- **hooks/**: Custom hooks—detect refetch/stale data issues impacting renders.
- **public/**: Assets (images, fonts)—optimize for LCP using Next.js built-ins.
- **tests/**: Unit/integration—extend with perf suites using large fixtures.

## Key Files

| File | Purpose | Perf Focus |
|------|---------|------------|
| [lib/utils.ts](lib/utils.ts) | Formatting utils (`cn`, `formatCurrency`, `formatDate`, `formatNumber`, `formatDecimal`) | Memoize in renders; profile string ops in loops/tables. |
| [lib/gerarReferencia.ts](lib/gerarReferencia.ts) | Reference generators (`gerarReferenciaPeca`, `gerarReferenciaTecido`) | Batch for bulk ops; cache common inputs. |
| [app/layout.tsx](app/layout.tsx) | Global layout, metadata, providers | Reduce bundle via lazy fonts/scripts; add `reportWebVitals`. |
| [app/page.tsx](app/page.tsx) | Main dashboard/entry | Suspense chunks; paginate initial loads. |
| [components/ui/table.tsx](components/ui/table.tsx) | Table components for data display | Virtualize; memoize rows/cells calling utils. |
| [next.config.js](next.config.js) | Next.js configuration | Add analyzer plugins, image opts, SWC flags. |
| [package.json](package.json) | Deps and scripts | Suggest perf tools: `@next/bundle-analyzer`, `web-vitals`. |

## Architecture Context

- **Utils Layer** (`lib/`): 7 key exports (formatters + generators); lightweight, pure functions—ubiquitous in UIs, prioritize memoization to cut render costs.
- **App Router Layer** (`app/`): Hybrid server/client; ~20-30 pages/routes inferred—optimize streaming/pagination for data pages.
- **UI Layer** (`components/`): Client-rendered interactives; high re-render risk with utils integration—focus virtualization/memo.
- Overall: Frontend-centric (Next.js app dir); no heavy DB/ backend detected—target client metrics, bundle size <500KB initial.

## Key Symbols for This Agent

- **`cn`** ([lib/utils.ts:4](lib/utils.ts)): Classname util—ensure minimal calls in renders.
- **`formatCurrency`** ([lib/utils.ts:8](lib/utils.ts)): Formats money—memoize for financial lists; profile locale ops.
- **`formatDate`** ([lib/utils.ts:16](lib/utils.ts)): Date formatting—cache parsed dates.
- **`formatNumber`** / **`formatDecimal`** ([lib/utils.ts:21,29](lib/utils.ts)): Numeric utils—batch in tables.
- **`gerarReferenciaPeca`** ([lib/gerarReferencia.ts:3](lib/gerarReferencia.ts)): Part refs—avoid per-item calls.
- **`gerarReferenciaTecido`** ([lib/gerarReferencia.ts:27](lib/gerarReferencia.ts)): Fabric refs—precompute variants.
- **Optimization Primitives**: `useMemo`, `React.memo`, `Suspense`, `dynamic`—scan via `searchCode('useEffect|useState')` for deps issues.

**Discovery Tip**: Run `analyzeSymbols('lib/**/*.ts')`, `searchCode('format|gerarReferencia')` for usages.

## Documentation Touchpoints

- [README.md](README.md): Append perf audit commands and targets.
- [../docs/README.md](../docs/README.md): Cross-link to perf playbook.
- [CHANGELOG.md](CHANGELOG.md): Log optimizations (e.g., "Reduced render time 40% via utils memo").
- [docs/performance.md](docs/performance.md): Create/maintain—metrics history, tool guides, hotspots log.
- [../../AGENTS.md](../../AGENTS.md): Add perf agent invocation examples.

## Collaboration Checklist

1. [ ] Validate scope: Review ticket/PR for perf goals; confirm baselines via shared Lighthouse report.
2. [ ] Profile & share: Post initial diagnostics (flame graphs, metrics) in thread for team input.
3. [ ] Atomic changes: One PR per fix (e.g., "Memoize utils in tables"); include metrics diffs.
4. [ ] Peer review: @mention relevant agents/humans; run `npm run perf-ci`.
5. [ ] Test integration: Add perf tests; update CI (e.g., thresholds in `.github/workflows`).
6. [ ] Docs update: Refresh touched files' docs; capture learnings in [docs/performance.md](docs/performance.md).
7. [ ] Verify prod: Monitor post-deploy; alert on regressions.

## Hand-off Notes

Summarize in closing comment/PR description: files optimized, gains achieved (e.g., "TTI -200ms, bundle -15%"), risks (e.g., cache invalidation on data changes). Next steps: Implement CI perf gates, schedule audits. Re-engage for scale (e.g., 10k+ records). Track sustained metrics in [docs/performance.md](docs/performance.md).
