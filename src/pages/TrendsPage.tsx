import { ChartImage } from '../components/ChartImage'
import { StatusDot } from '../components/StatusDot'
import type { PageData } from '../types/report'

const CHART_GROUPS = [
  { label: 'Production', ids: ['pa_production_stacked', 'ox_loading_trend', 'ma_production_placeholder'] },
  { label: 'Economics', ids: ['pa_nsr_ox_dual_axis', 'pa_spread_weekly'] },
  { label: 'P&L & Cash', ids: ['ebitda_daily', 'cash_flows_bar', 'mtd_pl_cumulative'] },
  { label: 'Cash & Receivables', ids: ['cash_position', 'ar_aging_stacked'] },
  { label: 'Supply Chain & Stock', ids: ['ox_days_cover', 'supplier_concentration', 'fg_stock_today'] },
]

interface Props {
  data: PageData
}

export function TrendsPage({ data }: Props) {
  const chartMap = Object.fromEntries(data.charts.map(c => [c.id, c]))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <StatusDot signal={data.signal_class} size={14} />
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Trends & Charts</h1>
        <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 'auto' }}>{data.date}</span>
      </div>

      {CHART_GROUPS.map(group => (
        <div key={group.label} style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#374151',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #E5E7EB',
          }}>
            {group.label}
          </h2>
          {group.ids.map(id => {
            const chart = chartMap[id]
            return chart ? <ChartImage key={id} chart={chart} /> : null
          })}
        </div>
      ))}
    </div>
  )
}
