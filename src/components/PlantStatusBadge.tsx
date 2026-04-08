interface Props {
  status: string
  size?: 'sm' | 'md'
}

const config: Record<string, { bg: string; text: string; label: string }> = {
  running: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Running' },
  down: { bg: 'bg-red-50', text: 'text-red-700', label: 'Shutdown' },
  startup: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Starting Up' },
  maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Maintenance' },
  standby: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Standby' },
  unknown: { bg: 'bg-gray-50', text: 'text-gray-500', label: 'Unknown' },
}

export function PlantStatusBadge({ status, size = 'sm' }: Props) {
  const c = config[status] ?? config.unknown
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${padding} ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}
