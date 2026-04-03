import { useState } from 'react'
import type { ChartRef } from '../types/report'

interface Props {
  chart: ChartRef
}

export function ChartImage({ chart }: Props) {
  const [error, setError] = useState(false)

  return (
    <div style={{
      background: '#FAFAFA',
      borderRadius: 8,
      border: '1px solid #E5E7EB',
      padding: '1rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#6B7280',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
      }}>
        {chart.title}
      </div>
      {error ? (
        <div style={{ color: '#9CA3AF', fontSize: 12, padding: '2rem 0', textAlign: 'center' }}>
          Chart unavailable
        </div>
      ) : (
        <img
          src={chart.url}
          alt={chart.title}
          loading="lazy"
          onError={() => setError(true)}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      )}
    </div>
  )
}
