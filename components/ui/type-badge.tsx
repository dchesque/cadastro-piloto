import React from 'react'

type Tipo = 'peca' | 'tecido'

const config = {
  peca: { label: 'Peça Piloto', bg: 'bg-[#E6F1FB]', text: 'text-[#0C447C]' },
  tecido: { label: 'Corte de Tecido', bg: 'bg-[#EAF3DE]', text: 'text-[#27500A]' },
}

export function TypeBadge({ tipo }: { tipo: Tipo }) {
  const c = config[tipo]
  return (
    <span className={`
      ${c.bg} ${c.text}
      text-[9px] font-semibold uppercase tracking-[0.06em]
      px-2 py-0.5 rounded-[4px] inline-flex items-center
    `}>
      {c.label}
    </span>
  )
}
