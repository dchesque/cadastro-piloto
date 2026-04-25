export function FMMonoTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] text-[--color-text-tertiary] bg-[--color-bg-subtle] px-1.5 py-0.5 rounded-[4px]">
      {children}
    </span>
  )
}
