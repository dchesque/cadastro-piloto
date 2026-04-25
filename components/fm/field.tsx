interface Props {
  label: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
}

export function FMField({ label, hint, htmlFor, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-bold uppercase tracking-[0.06em] text-[--color-text-secondary]"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[--color-text-tertiary] m-0">{hint}</p>}
    </div>
  )
}
