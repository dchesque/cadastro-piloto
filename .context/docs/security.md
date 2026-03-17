# Security

This document outlines the security posture of the Cadastro Piloto application, a Next.js app with Prisma ORM for managing users, tecidos (fabrics), peças (pilot pieces), and cortes (cuts). It emphasizes authentication, authorization, input validation, and data protection. All practices align with OWASP guidelines for modern web apps.

Refer to [architecture.md](./architecture.md) for deployment and infrastructure details.

## Authentication & Authorization

Authentication uses **NextAuth.js** (`app/api/auth/[...nextauth]/route.ts`) with a credentials provider backed by the Prisma `User` model. Sessions are database-based (configurable to JWT) and include `user.id` and `user.role` (`admin` or `user`).

### Key Flows
- **Sign-Up/Setup**: `POST /api/setup` creates the initial admin user (one-time). `POST /api/users` handles subsequent user creation (`POST` exported from `app/api/users/route.ts`).
- **Sign-In**: Custom form in `app/login/page.tsx` calls `signIn('credentials', { email, password })`. Passwords are bcrypt-hashed.
- **Session Management**: Client-side via `AuthProvider` (`components/auth-provider.tsx`) and `useSession()`. Server-side via `getServerSession(authOptions)` from `lib/auth.ts`.
- **Password Updates**: `PATCH /api/users/password` (`app/api/users/password/route.ts`) with old/new password validation and re-hashing.

### Route Protection
- **Middleware** (`middleware.ts`): Protects all `/app/*` routes (e.g., dashboard at `app/page.tsx`, tecidos at `app/tecidos/page.tsx`, peças). Redirects unauthenticated users to `/login`.
  ```ts
  // middleware.ts excerpt
  import { authOptions } from '@/lib/auth';
  import { getServerSession } from 'next-auth/next';

  export async function middleware(req) {
    const session = await getServerSession(authOptions);
    if (!session && req.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  ```
- **API Handlers**: All CRUD routes check sessions explicitly:
  | Route | Methods | Protection Example |
  |-------|---------|--------------------|
  | `/api/tecidos` | `GET`/`POST` (`app/api/tecidos/route.ts`) | `getServerSession(authOptions)` before Prisma queries |
  | `/api/tecidos/[id]` | `GET`/`PUT`/`DELETE` (`app/api/tecidos/[id]/route.ts`) | Session check + ID validation |
  | `/api/pecas` | `GET`/`POST` (`app/api/pecas/route.ts`) | Session required |
  | `/api/pecas/[id]` | `GET`/`PUT`/`DELETE` (`app/api/pecas/[id]/route.ts`) | Ownership check via `user.id` |
  | `/api/pecas/[id]/corte` | `GET`/`POST` (`app/api/pecas/[id]/corte/route.ts`) | Nested session validation |
  | `/api/pecas/[id]/corte/[corteId]` | `GET`/`PUT`/`DELETE` (`app/api/pecas/[id]/corte/[corteId]/route.ts`) | Full path authorization |
- **Role Checks**: Admin-only for `/api/setup` and user management; standard `user` role for tecidos/pecas CRUD.

### Client-Side Guards
- `Navbar` (`components/navbar.tsx`, exported with `NavbarProps`) shows/hides links based on `session?.user.role`.
- Protected pages (e.g., `app/pecas/page.tsx`, `app/tecidos/page.tsx`) use `useSession` with loading (`app/loading.tsx`) and redirect states.
- `AppShell` (`components/app-shell.tsx`) wraps protected layouts.

## Input Validation & Sanitization

- **Zod Schemas**: Used in all mutating API routes (POST/PUT/PATCH/DELETE) for tecidos, peças, cortes, users. Prevents injection attacks and ensures type safety.
  ```ts
  // Example: app/api/tecidos/route.ts (POST)
  import { z } from 'zod';
  const tecidoSchema = z.object({
    referencia: z.string().min(1).max(50),
    descricao: z.string().optional(),
    estoque: z.number().min(0),
    // ... other fields with `gerarReferenciaTecido` integration
  });
  const data = tecidoSchema.parse(req.json());
  await prisma.tecido.create({ data });
  ```
- **File Uploads** (`POST /api/upload/route.ts`): MIME type (`image/*`), size (<5MB), and virus scanning validation. Uses secure storage (e.g., Vercel Blob).
- **Prisma Queries**: Fully parameterized; no raw SQL. References auto-managed via `lib/gerarReferencia.ts` (`gerarReferenciaPeca`, `gerarReferenciaTecido`).
- **Client-Side**: React components like `InputProps` (`components/ui/input.tsx`), `TextareaProps` use controlled inputs with `cn` utility for styling.

## Secrets & Sensitive Data

Loaded via `.env.local` (gitignored). Accessed through Prisma and NextAuth.

| Secret              | Purpose                      | Rotation | Storage Recommendation |
|---------------------|------------------------------|----------|------------------------|
| `DATABASE_URL`     | Prisma PostgreSQL connection | 90 days | Vercel Env Vars / AWS Secrets Manager |
| `NEXTAUTH_SECRET`  | Session encryption/signing   | 30 days | Vault / 1Password |
| `NEXTAUTH_URL`     | Auth callback base URL       | N/A     | .env only |

- **Hashing**: `bcryptjs` for user passwords (`User` model).
- **Encryption**: DB at-rest (PostgreSQL pgcrypto); in-transit via HTTPS.
- **Uploads**: Private URLs with signed tokens.
- **Logging**: No PII; redact sensitive fields.

**Audit Command**:
```bash
npm audit
npx prisma generate
npx prisma db push
```

## Deployment & Infrastructure Security

- **HTTPS**: Automatic on Vercel/Netlify; configure HSTS/CSP in `next.config.js`.
- **CORS**: Restricted to app domain in API headers.
- **Rate Limiting**: Recommended integration:
  ```ts
  // app/api/tecidos/route.ts
  import { ratelimit } from 'upstash/ratelimit';
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  ```
- **Headers**: Add via `headers()` in layouts or `next.config.js`:
  | Header | Value Example |
  |--------|---------------|
  | Strict-Transport-Security | max-age=31536000 |
  | Content-Security-Policy | default-src 'self' |

## Compliance & Auditing

- **LGPD/GDPR**: Minimal PII (email, name); explicit consent; 30-day inactive user purge via cron.
- **Audit Logs**: Prisma timestamps (`createdAt`/`updatedAt`); extend with `middleware.ts` for actions.
- **Scanning**: `npm audit`, `next lint`, Snyk CI integration.
- **Backups**: `prisma db dump` daily, encrypted.

## Common Vulnerabilities & Mitigations

| Risk                | Mitigation                              | Relevant Files |
|---------------------|-----------------------------------------|----------------|
| XSS                 | Zod parsing + React auto-escaping       | All API routes |
| CSRF                | NextAuth built-in tokens                | `lib/auth.ts` |
| SQL Injection       | Prisma ORM parameterization             | All `prisma.*` calls |
| Brute Force         | Rate limit `/api/auth` & `/api/users`   | Add to handlers |
| IDOR                | Session `user.id` ownership checks      | `[id]` routes |
| Supply Chain        | Pinned `package-lock.json`; `npm audit` | `package.json` |

## Incident Response

1. **Detect**: Vercel Logs, Sentry integration.
2. **Contain**: Revoke `NEXTAUTH_SECRET`, rollback deploy.
3. **Notify**: security@company.com.
4. **Remediate**: Patch, GitHub issue with [security] label.
5. **Review**: `npx prisma studio`; `next build`.

**On-Call**: PagerDuty rotation.

## Developer Guidelines

- **New API Routes**: Always `getServerSession` + Zod schema.
- **Protected Components**: Use `AuthProvider` wrapper.
- **Testing**:
  - Unit: Jest + MSW for session mocks.
  - E2E: Playwright on `/login` → `/app/tecidos`.
- **Local Setup**:
  ```bash
  cp .env.example .env.local
  NEXTAUTH_URL=http://localhost:3000
  npm run dev
  ```
- **Prod Checklist**:
  ```bash
  npm run build
  npm audit --audit-level=moderate
  npx prisma migrate deploy
  npx prisma generate
  ```

Cross-references: `lib/auth.ts` (auth config), `middleware.ts` (global guards), `lib/utils.ts` (formatting helpers), UI components (`components/ui/*`). Report vulns via GitHub issues.
