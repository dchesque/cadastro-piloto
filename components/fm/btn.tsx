'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'peca' | 'tecido' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[#1A1917] text-white border-transparent shadow-[0_10px_15px_-3px_rgba(26,25,23,0.10)] hover:opacity-90',
  outline: 'bg-white text-[#1A1917] border-[--color-border-medium] hover:bg-[--color-bg-subtle]',
  peca: 'bg-[--color-accent-peca] text-white border-transparent hover:opacity-90',
  tecido: 'bg-[--color-accent-tecido] text-white border-transparent hover:opacity-90',
  danger: 'bg-[--color-status-danger-text] text-white border-transparent hover:opacity-90',
  ghost: 'bg-transparent text-[--color-text-tertiary] border-transparent hover:bg-[--color-bg-subtle]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[12px]',
  md: 'h-11 px-5 text-[13px]',
  lg: 'h-[52px] px-7 text-[14px]',
}

export const FMBtn = forwardRef<HTMLButtonElement, Props>(function FMBtn(
  { variant = 'primary', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-[8px] border font-semibold transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </button>
  )
})
