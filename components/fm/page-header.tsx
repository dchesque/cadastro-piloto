interface Props {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function FMPageHeader({ title, subtitle, children }: Props) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[32px] font-light leading-[1.1] tracking-[-0.8px] text-[--color-text-primary]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-[14px] font-medium text-[--color-text-secondary]">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </header>
  )
}
