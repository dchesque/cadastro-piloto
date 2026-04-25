import Image from 'next/image'

interface Props {
  nome: string
  colecao?: string | null
  fotoUrl?: string | null
}

const colecaoPalette: Record<string, { bg: string; accent: string }> = {
  'Verão 2024': { bg: '#FFF3E0', accent: '#FB8C00' },
  'Verão 2025': { bg: '#FFF3E0', accent: '#FB8C00' },
  'Cápsula Mar': { bg: '#E3F2FD', accent: '#1976D2' },
  'Inverno 2024': { bg: '#EDE7F6', accent: '#7B1FA2' },
  'Inverno 2025': { bg: '#EDE7F6', accent: '#7B1FA2' },
}

function paletteFor(colecao?: string | null) {
  if (!colecao) return { bg: '#F3E5F5', accent: '#8E24AA' }
  const direct = colecaoPalette[colecao]
  if (direct) return direct
  // Hash fallback so coleções desconhecidas tenham cores estáveis
  let hash = 0
  for (let i = 0; i < colecao.length; i++) hash = (hash * 31 + colecao.charCodeAt(i)) >>> 0
  const palettes = [
    { bg: '#FFF3E0', accent: '#FB8C00' },
    { bg: '#E3F2FD', accent: '#1976D2' },
    { bg: '#EDE7F6', accent: '#7B1FA2' },
    { bg: '#E8F5E9', accent: '#2E7D32' },
    { bg: '#FFF8E1', accent: '#C2410C' },
    { bg: '#FCE4EC', accent: '#C2185B' },
  ]
  return palettes[hash % palettes.length]
}

function GarmentSvg({ nome, color }: { nome: string; color: string }) {
  const n = nome.toLowerCase()
  const props = {
    width: 48,
    height: 48,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (n.includes('blusa') || n.includes('cropped') || n.includes('tricot') || n.includes('camisa'))
    return (
      <svg {...props}>
        <path d="M2 4l4 2 6-2 6 2 4-2v5l-3 1v9H5V10L2 9V4z" />
        <path d="M8 6c0 2 1 3 4 3s4-1 4-3" />
      </svg>
    )
  if (n.includes('calça') || n.includes('calca') || n.includes('shorts'))
    return (
      <svg {...props}>
        <path d="M4 3h16v5l-4 13H4L8 8V3z" />
        <path d="M20 3h-4v5l4 13" />
        <line x1="12" y1="8" x2="12" y2="21" />
      </svg>
    )
  if (n.includes('vestido') || n.includes('midi'))
    return (
      <svg {...props}>
        <path d="M8 3l-4 5 2 1-3 12h14l-3-12 2-1-4-5" />
        <path d="M9 3h6" />
      </svg>
    )
  if (n.includes('saia'))
    return (
      <svg {...props}>
        <path d="M7 5h10v2l4 14H3L7 7V5z" />
        <line x1="7" y1="5" x2="17" y2="5" />
      </svg>
    )
  return (
    <svg {...props}>
      <path d="M20 10V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <rect x="2" y="10" width="20" height="12" rx="2" />
      <path d="M12 10v12" />
    </svg>
  )
}

export function PecaAvatar({ nome, colecao, fotoUrl }: Props) {
  if (fotoUrl) {
    return (
      <div className="relative h-full w-full">
        <Image src={fotoUrl} alt={nome} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
    )
  }

  const c = paletteFor(colecao)
  const words = nome.trim().split(/\s+/)
  const initials = ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase()
  const patternId = `weave-${initials || 'gx'}-${(colecao ?? 'x').replace(/\W+/g, '')}`

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center"
      style={{ background: c.bg }}
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.12 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width={8}
            height={8}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={8} stroke={c.accent} strokeWidth={1.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <div className="relative z-10" style={{ opacity: 0.85 }}>
        <GarmentSvg nome={nome} color={c.accent} />
      </div>

      {initials && (
        <div
          className="absolute bottom-1.5 right-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-[6px] text-[9px] font-extrabold tracking-[-0.5px] text-white"
          style={{ background: c.accent, boxShadow: `0 1px 4px ${c.accent}55` }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}
