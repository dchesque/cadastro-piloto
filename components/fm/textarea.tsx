'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

export const FMTextarea = forwardRef<HTMLTextAreaElement, Props>(function FMTextarea(
  { className, rows = 3, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      {...rest}
      className={cn(
        'w-full rounded-[12px] border border-[--color-border-medium] bg-[--color-bg-subtle] px-3.5 py-2.5 text-[14px] leading-relaxed text-[--color-text-primary] outline-none transition-all resize-y',
        'placeholder:text-[--color-text-tertiary]',
        'focus:border-[--color-text-primary] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,25,23,0.05)]',
        className,
      )}
    />
  )
})
