import { prisma } from '@/lib/prisma'
import { AppShell } from '@/components/app-shell'

export async function AppShellServer({ children }: { children: React.ReactNode }) {
  let counts: { pecas?: number; tecidos?: number } = {}
  try {
    const [pecas, tecidos] = await Promise.all([
      prisma.pecaPiloto.count(),
      prisma.corteTecido.count(),
    ])
    counts = { pecas, tecidos }
  } catch {
    // Em ambientes sem DB acessível (build, prerender), seguir sem counts.
  }
  return <AppShell counts={counts}>{children}</AppShell>
}
