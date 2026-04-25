type BadgeType = 'peca' | 'tecido' | 'neutral'

interface Props {
  type?: BadgeType
  children?: React.ReactNode
}

const cfg: Record<BadgeType, { bg: string; color: string; label: string }> = {
  peca: { bg: 'var(--color-accent-peca-light)', color: 'var(--color-accent-peca)', label: 'Peça Piloto' },
  tecido: { bg: 'var(--color-accent-tecido-light)', color: 'var(--color-accent-tecido)', label: 'Corte de Tecido' },
  neutral: { bg: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)', label: '' },
}

export function FMBadge({ type = 'neutral', children }: Props) {
  const c = cfg[type]
  return (
    <span
      style={{ background: c.bg, color: c.color }}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em]"
    >
      {children ?? c.label}
    </span>
  )
}
