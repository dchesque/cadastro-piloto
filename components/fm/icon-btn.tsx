'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'neutral' | 'peca' | 'tecido' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: number
}

const hoverStyles: Record<Variant, string> = {
  neutral: 'hover:bg-[#DDDCD8] hover:text-[#52504C]',
  peca: 'hover:bg-[--color-accent-peca-light] hover:text-[--color-accent-peca]',
  tecido: 'hover:bg-[--color-accent-tecido-light] hover:text-[--color-accent-tecido]',
  danger: 'hover:bg-[--color-status-danger-bg] hover:text-[--color-status-danger-text]',
}

export const FMIconBtn = forwardRef<HTMLButtonElement, Props>(function FMIconBtn(
  { variant = 'neutral', size = 44, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      style={{ width: size, height: size }}
      {...rest}
      className={cn(
        'inline-flex items-center justify-center rounded-[10px] border-0 bg-[--color-bg-subtle] text-[--color-text-secondary] transition-all',
        hoverStyles[variant],
        className,
      )}
    >
      {children}
    </button>
  )
})
