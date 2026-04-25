'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Props = InputHTMLAttributes<HTMLInputElement>

export const FMInput = forwardRef<HTMLInputElement, Props>(function FMInput(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      {...rest}
      className={cn(
        'h-11 w-full rounded-[12px] border border-[--color-border-medium] bg-[--color-bg-subtle] px-3.5 text-[14px] text-[--color-text-primary] outline-none transition-all',
        'placeholder:text-[--color-text-tertiary]',
        'focus:border-[--color-text-primary] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,25,23,0.05)]',
        'disabled:opacity-50',
        className,
      )}
    />
  )
})
