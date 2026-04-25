interface Props {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function FMEmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border border-dashed border-[--color-border-medium] bg-white px-6 py-16">
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[--color-bg-subtle] text-[--color-text-tertiary]">
          {icon}
        </div>
      )}
      <div className="text-center">
        <p className="text-[16px] font-semibold text-[--color-text-primary]">{title}</p>
        {subtitle && <p className="mt-1 text-[13px] text-[--color-text-secondary]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
