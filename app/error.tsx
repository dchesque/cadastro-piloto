'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold text-text-primary">Algo deu errado!</h2>
      <p className="text-text-secondary">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-accent-peca px-4 py-2 font-semibold text-white hover:bg-accent-peca/90"
      >
        Tentar novamente
      </button>
    </div>
  )
}
