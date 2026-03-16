import React from 'react'

interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[--color-text-tertiary] flex items-center gap-1">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] font-medium text-[--color-destructive] animate-in slide-in-from-top-1 duration-200">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-[--color-text-tertiary]">{hint}</p>
      ) : null}
    </div>
  )
}
