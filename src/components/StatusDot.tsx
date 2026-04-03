import type { SignalClass } from '../types/report'

const DOT_STYLE: Record<NonNullable<SignalClass>, { bg: string; label: string }> = {
  act:    { bg: '#DC2626', label: 'ACT' },
  watch:  { bg: '#D97706', label: 'WATCH' },
  normal: { bg: '#059669', label: 'OK' },
}

interface Props {
  signal: SignalClass
  size?: number
}

export function StatusDot({ signal, size = 10 }: Props) {
  const style = signal ? DOT_STYLE[signal] : null
  return (
    <span
      title={style?.label ?? 'unknown'}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: style?.bg ?? '#9CA3AF',
        flexShrink: 0,
      }}
    />
  )
}
