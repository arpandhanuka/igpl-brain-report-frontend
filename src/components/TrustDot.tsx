interface Props {
  status: 'ready' | 'partial' | 'blocked' | 'unknown'
  size?: 'sm' | 'md'
}

const colors: Record<string, string> = {
  ready: 'bg-emerald-500',
  partial: 'bg-amber-400',
  blocked: 'bg-gray-300',
  unknown: 'bg-gray-300',
}

const labels: Record<string, string> = {
  ready: 'Data current',
  partial: 'Partial data',
  blocked: 'Data not available',
  unknown: 'Status unknown',
}

export function TrustDot({ status, size = 'sm' }: Props) {
  const dim = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'
  return (
    <span className="relative group inline-flex items-center">
      <span className={`${dim} rounded-full ${colors[status] ?? colors.unknown}`} />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {labels[status] ?? labels.unknown}
      </span>
    </span>
  )
}
