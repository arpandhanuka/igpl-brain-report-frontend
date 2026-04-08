interface Props {
  asOf: string | null | undefined
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function isStale(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  return diffMs > 2 * 24 * 60 * 60 * 1000 // > 2 days
}

export function DataFreshnessTag({ asOf }: Props) {
  if (!asOf) {
    return <span className="text-xs text-gray-400">no date</span>
  }

  const stale = isStale(asOf)
  return (
    <span className={`text-xs ${stale ? 'text-amber-500 font-medium' : 'text-gray-400'}`}>
      as of {formatDate(asOf)}
    </span>
  )
}
