export interface ActivityItem {
  tipo: 'peca' | 'tecido' | 'corte' | 'sistema'
  acao: string
  nome: string
  hora: string
}

const palette: Record<ActivityItem['tipo'], { color: string; bg: string }> = {
  peca: { color: '#1D4ED8', bg: '#E6F1FB' },
  tecido: { color: '#059669', bg: '#EAF3DE' },
  corte: { color: '#7C3AED', bg: '#EDE9FE' },
  sistema: { color: '#52504C', bg: '#EBEAE6' },
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="flex flex-col rounded-[20px] border border-[--color-border-light] bg-white p-5 shadow-[0_1px_3px_rgba(26,25,23,0.06)]">
      <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[--color-text-tertiary]">
        Atividade recente
      </h3>
      {items.length === 0 ? (
        <p className="text-[12px] text-[--color-text-tertiary]">Sem atividade recente.</p>
      ) : (
        <div className="flex flex-col">
          {items.map((a, i) => {
            const c = palette[a.tipo]
            const isLast = i === items.length - 1
            return (
              <div
                key={i}
                className="flex gap-3"
                style={{
                  paddingBottom: isLast ? 0 : 14,
                  marginBottom: isLast ? 0 : 14,
                  borderBottom: isLast ? 'none' : '1px solid #EBEAE6',
                }}
              >
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px]"
                  style={{ background: c.bg, color: c.color }}
                >
                  <div
                    className="h-2 w-2 rounded-[2px]"
                    style={{ background: c.color, opacity: 0.7 }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[--color-text-tertiary]">
                    {a.acao}
                  </p>
                  <p className="mb-0.5 truncate text-[12px] font-medium text-[--color-text-primary]">
                    {a.nome}
                  </p>
                  <p className="text-[10px] text-[--color-text-tertiary]">{a.hora}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
