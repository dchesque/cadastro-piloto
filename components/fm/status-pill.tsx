export type PecaStatus = 'aprovada' | 'revisao' | 'rascunho'

const cfg: Record<PecaStatus, { label: string; bg: string; color: string; dot: string }> = {
  aprovada: { label: 'Aprovada', bg: '#EAF3DE', color: '#27500A', dot: '#059669' },
  revisao: { label: 'Em revisão', bg: '#FAEEDA', color: '#723B10', dot: '#D97706' },
  rascunho: { label: 'Rascunho', bg: '#EBEAE6', color: '#52504C', dot: '#85837D' },
}

export function StatusPill({ status }: { status: PecaStatus }) {
  const c = cfg[status] ?? cfg.rascunho
  return (
    <span
      style={{ background: c.bg, color: c.color }}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10px] font-bold"
    >
      <span style={{ background: c.dot }} className="h-[5px] w-[5px] rounded-full" />
      {c.label}
    </span>
  )
}

export const statusCfg = cfg
