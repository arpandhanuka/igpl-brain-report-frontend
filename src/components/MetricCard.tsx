import type { MetricSnapshot } from '../types/api'
import { TrustDot } from './TrustDot'
import { DataFreshnessTag } from './DataFreshnessTag'

interface Props {
  label: string
  metric?: MetricSnapshot | null
  /** Override the displayed value (e.g. for pre-formatted numbers) */
  value?: string | number | null
  unit?: string
  asOf?: string | null
  /** Trust status override — if not provided, derived from metric */
  trust?: 'ready' | 'partial' | 'blocked' | 'unknown'
  /** Optional comparison text like "+2.1% vs yesterday" */
  comparison?: string | null
  trend?: 'up' | 'down' | 'flat' | null
  className?: string
}

function formatValue(v: number | string | null | undefined, unit: string): string {
  if (v == null) return '--'
  if (typeof v === 'string') return v

  // Currency formatting
  if (unit.includes('Cr') || unit.includes('Lakh') || unit.includes('Rs')) {
    if (Math.abs(v) >= 1e7) return `${(v / 1e7).toFixed(1)} Cr`
    if (Math.abs(v) >= 1e5) return `${(v / 1e5).toFixed(1)} L`
    return v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  }
  // Percentage
  if (unit === '%' || unit === 'pct') {
    return `${v.toFixed(1)}%`
  }
  // Generic number
  if (Number.isInteger(v)) return v.toLocaleString('en-IN')
  return v.toLocaleString('en-IN', { maximumFractionDigits: 1 })
}

function deriveTrust(metric?: MetricSnapshot | null): 'ready' | 'partial' | 'blocked' | 'unknown' {
  if (!metric) return 'unknown'
  if (metric.value == null) return 'blocked'
  if (metric.is_stale || metric.confidence < 0.5) return 'partial'
  return 'ready'
}

const trendArrow: Record<string, string> = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  flat: 'text-gray-400',
}

export function MetricCard({
  label,
  metric,
  value: overrideValue,
  unit: overrideUnit,
  asOf: overrideAsOf,
  trust: overrideTrust,
  comparison,
  trend,
  className = '',
}: Props) {
  const displayValue = overrideValue ?? metric?.value
  const displayUnit = overrideUnit ?? metric?.unit ?? ''
  const displayAsOf = overrideAsOf ?? metric?.last_updated
  const trustStatus = overrideTrust ?? deriveTrust(metric)
  const displayComparison = comparison ?? metric?.vs_yesterday
  const displayTrend = trend ?? metric?.trend

  // If truly no data, show grey card
  if (displayValue == null && trustStatus === 'blocked') {
    return (
      <div className={`rounded-xl border border-gray-100 bg-gray-50 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
          <TrustDot status="blocked" />
        </div>
        <div className="text-lg font-semibold text-gray-300 mt-2">Data not available</div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <TrustDot status={trustStatus} />
      </div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">
          {formatValue(displayValue, displayUnit)}
        </span>
        {displayUnit && !displayUnit.includes('Cr') && !displayUnit.includes('Lakh') && displayUnit !== '%' && displayUnit !== 'pct' && (
          <span className="text-sm text-gray-400 font-medium">{displayUnit}</span>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          {displayTrend && displayTrend !== 'unknown' && (
            <span className={`text-xs font-medium ${trendArrow[displayTrend] ?? ''}`}>
              {displayTrend === 'up' ? '\u2191' : displayTrend === 'down' ? '\u2193' : '\u2192'}
            </span>
          )}
          {displayComparison && (
            <span className="text-xs text-gray-500">{displayComparison}</span>
          )}
        </div>
        <DataFreshnessTag asOf={displayAsOf} />
      </div>
    </div>
  )
}

export function MetricCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-4 ${className}`}>
      <div className="h-3 w-24 bg-gray-100 rounded animate-pulse-subtle mb-3" />
      <div className="h-7 w-32 bg-gray-100 rounded animate-pulse-subtle mb-2" />
      <div className="h-3 w-20 bg-gray-50 rounded animate-pulse-subtle" />
    </div>
  )
}
