type Variant = 'full' | 'mark' | 'inline' | 'inverse'

interface Props {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: { mark: 24, gap: 8, text: 13, dot: 4 },
  md: { mark: 32, gap: 10, text: 15, dot: 5 },
  lg: { mark: 40, gap: 12, text: 20, dot: 6 },
  xl: { mark: 56, gap: 16, text: 32, dot: 9 },
}

export function FlowModaMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const s = sizeMap[size]
  const inner = Math.round(s.mark * 0.5)
  return (
    <div
      style={{
        width: s.mark,
        height: s.mark,
        borderRadius: Math.round(s.mark * 0.28),
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        boxShadow: '0 2px 8px rgba(5,150,105,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={inner}
        height={inner}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3 Q12 1 17 3 L19 8 Q12 6 5 8 Z" />
        <line x1="5" y1="8" x2="5" y2="20" />
        <line x1="19" y1="8" x2="19" y2="20" />
        <path d="M5 14 Q12 12 19 14" />
      </svg>
    </div>
  )
}

export function FlowModaWordmark({ variant = 'full', size = 'md', className }: Props) {
  const s = sizeMap[size]
  const inverse = variant === 'inverse'
  const flowColor = inverse ? '#fff' : '#1A1917'
  const modaColor = inverse ? '#fff' : '#1A1917'

  if (variant === 'mark') {
    return <FlowModaMark size={size} />
  }

  if (variant === 'inline') {
    return (
      <span
        className={className}
        style={{
          fontSize: s.text,
          fontWeight: 600,
          color: flowColor,
          letterSpacing: '-0.2px',
          lineHeight: 1.1,
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span style={{ fontWeight: 300 }}>flow</span>
        <span style={{ fontWeight: 700 }}>moda</span>
        <span style={{ color: '#059669' }}>.</span>
      </span>
    )
  }

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
      }}
    >
      <FlowModaMark size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span
          style={{
            fontSize: s.text,
            fontWeight: 600,
            color: flowColor,
            letterSpacing: '-0.3px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span style={{ fontWeight: 300 }}>flow</span>
          <span style={{ fontWeight: 700, color: modaColor }}>moda</span>
          <span style={{ color: '#059669' }}>.</span>
        </span>
      </div>
    </div>
  )
}
