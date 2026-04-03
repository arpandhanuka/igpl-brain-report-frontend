import { StatusDot } from '../components/StatusDot'
import type { PageData } from '../types/report'

interface Props {
  data: PageData
}

// Returns a formatted string for numbers, '—' for null/undefined
function fmtNum(value: unknown, decimals = 2): string {
  if (value == null) return '—'
  const num = parseFloat(String(value))
  if (isNaN(num)) return '—'
  return num.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
}

interface MetricCardProps {
  label: string
  value: unknown
  unit?: string
  negative?: boolean  // force red color
}

function MetricCard({ label, value, unit = '', negative }: MetricCardProps) {
  const raw = value == null ? null : parseFloat(String(value))
  const isNeg = negative || (raw != null && !isNaN(raw) && raw < 0)
  const display = raw != null && !isNaN(raw)
    ? `${fmtNum(value)}${unit}`
    : (typeof value === 'string' && value !== '' ? `${value}${unit}` : '—')

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '1rem',
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: isNeg ? '#DC2626' : '#111827' }}>{display}</div>
    </div>
  )
}

export function CommandView({ data }: Props) {
  const page = (data.sections?.['_page'] ?? {}) as Record<string, any>
  const prod = (page.production ?? {}) as Record<string, any>
  const fin  = (page.finance  ?? {}) as Record<string, any>
  const econ = (page.economics ?? {}) as Record<string, any>
  const sc   = (page.supply_chain ?? {}) as Record<string, any>
  const sal  = (page.sales ?? {}) as Record<string, any>

  const dispatchAge = sal.dispatch_data_age_days ?? 0
  const isDispatchStale = typeof dispatchAge === 'number' && dispatchAge > 1
  // plant_status is keyed by uppercase plant ID (PA1, PA2 …)
  const pa1Loading = prod?.plant_status?.PA1?.loading_pct ?? null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <StatusDot signal={data.signal_class} size={14} />
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Command View</h1>
        <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 'auto' }}>{data.date}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <MetricCard label="Cash"           value={fin.cash_cr}              unit=" Cr" />
        <MetricCard label="MTD EBITDA"     value={fin.mtd_ebitda_cr}        unit=" Cr" />
        <MetricCard label="AR Total"         value={fin.ar_total_outstanding_cr}  unit=" Cr" />
        <MetricCard label="AR 61-90d"        value={fin.ar_61_90d_cr}             unit=" Cr" />
        <MetricCard label="Bank Util"      value={fin.bank_utilization_pct != null ? `${Math.round(fin.bank_utilization_pct)}%` : null} />
        <MetricCard label="PA Spread"      value={econ.pa_spread_rs_mt}     unit=" ₹/MT" />
        <MetricCard label="OX Cover"       value={sc.ox_days_cover}         unit="d" />
        <MetricCard label="PA1 Load"       value={pa1Loading}               unit=" g/Nm³" />
        <MetricCard label="Dispatch Today" value={sal.dispatch_today_mt}    unit=" MT" />
      </div>

      {isDispatchStale && (
        <div style={{ fontSize: 11, color: '#D97706', marginBottom: '1rem' }}>
          ⚠ Dispatch data is {dispatchAge} days old.
        </div>
      )}

      <div style={{ fontSize: 13, color: '#6B7280' }}>
        Generated {data.generated_at
          ? new Date(data.generated_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          : '—'}
      </div>
    </div>
  )
}
