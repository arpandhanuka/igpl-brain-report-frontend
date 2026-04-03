import { StatusDot } from './StatusDot'
import type { PageMeta } from '../types/report'
import { PAGE_LABELS, PAGE_ORDER } from '../types/report'

interface Props {
  pages: PageMeta[]
  currentPage: string
  reportDate: string
  onSelect: (pageId: string) => void
}

const SIGNAL_PRIORITY: Record<string, number> = { act: 3, watch: 2, normal: 1 }

export function Sidebar({ pages, currentPage, reportDate, onSelect }: Props) {
  const pageMap = Object.fromEntries(pages.map(p => [p.id, p]))

  const sorted = PAGE_ORDER.filter(id => pageMap[id])

  const generatedAt = pages[0]?.generated_at
    ? new Date(pages[0].generated_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })
    : null

  return (
    <nav style={{
      width: 220,
      minHeight: '100vh',
      background: '#111827',
      color: '#F9FAFB',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      flexShrink: 0,
    }}>
      <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid #374151' }}>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>IGPL BRAIN</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{reportDate}</div>
        {generatedAt && (
          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
            generated {generatedAt}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
        {sorted.map(id => {
          const page = pageMap[id]
          const active = id === currentPage
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '0.6rem 1rem',
                background: active ? '#1F2937' : 'transparent',
                border: 'none',
                color: active ? '#F9FAFB' : '#D1D5DB',
                cursor: 'pointer',
                fontSize: 13,
                textAlign: 'left',
                borderLeft: active ? '2px solid #3B82F6' : '2px solid transparent',
              }}
            >
              <StatusDot signal={page?.signal_class ?? null} size={8} />
              {PAGE_LABELS[id] ?? id}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
