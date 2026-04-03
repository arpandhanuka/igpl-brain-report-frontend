import { StatusDot } from '../components/StatusDot'
import type { PageData } from '../types/report'

interface Props {
  data: PageData
}

function MetricCard({ label, value, unit = '' }: { label: string; value: unknown; unit?: string }) {
  const display = value != null ? `${value}${unit}` : '—'
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '1rem',
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{display}</div>
    </div>
  )
}

export function CommandView({ data }: Props) {
  const content = data.sections
  const prod = (content?.['_page'] as { production?: Record<string, unknown> })?.production ?? {}
  const fin = (content?.['_page'] as { finance?: Record<string, unknown> })?.finance ?? {}
  const econ = (content?.['_page'] as { economics?: Record<string, unknown> })?.economics ?? {}
  const sc = (content?.['_page'] as { supply_chain?: Record<string, unknown> })?.supply_chain ?? {}

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <StatusDot signal={data.signal_class} size={14} />
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Command View</h1>
        <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 'auto' }}>
          {data.date}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <MetricCard label="Cash" value={(fin as Record<string, unknown>)?.cash_cr} unit=" Cr" />
        <MetricCard label="PA Spread" value={(econ as Record<string, unknown>)?.pa_spread_rs_mt} unit=" Rs/MT" />
        <MetricCard label="OX Cover" value={(sc as Record<string, unknown>)?.ox_days_cover} unit="d" />
        <MetricCard label="Bank Util" value={(fin as Record<string, unknown>)?.bank_utilization_pct} unit="%" />
        <MetricCard label="MTD Revenue" value={(fin as Record<string, unknown>)?.mtd_revenue_cr} unit=" Cr" />
        <MetricCard label="MTD EBITDA" value={(fin as Record<string, unknown>)?.mtd_ebitda_cr} unit=" Cr" />
      </div>

      <div style={{ fontSize: 13, color: '#6B7280' }}>
        Generated {data.generated_at
          ? new Date(data.generated_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          : '—'}
      </div>
    </div>
  )
}
