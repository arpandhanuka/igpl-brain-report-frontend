/**
 * Generic deep read page renderer — used for Company, Finance, Sales, and all plant pages.
 * Renders all 9 narrative sections in order.
 */
import { NarrativeSection } from '../components/NarrativeSection'
import { StatusDot } from '../components/StatusDot'
import type { PageData } from '../types/report'
import { PAGE_LABELS } from '../types/report'

const SECTION_ORDER = [
  'current_state',
  'what_changed',
  'key_risks',
  'opportunities',
  'decisions_needed',
  'numbers_that_matter',
  'forward_look',
  'what_to_watch',
  'owner_lens',
]

interface Props {
  data: PageData
}

export function DeepReadPage({ data }: Props) {
  const label = PAGE_LABELS[data.page_id] ?? data.page_id

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <StatusDot signal={data.signal_class} size={14} />
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{label}</h1>
        <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 'auto' }}>{data.date}</span>
      </div>

      {SECTION_ORDER.map(sid => {
        const content = data.sections[sid]
        return content ? (
          <NarrativeSection key={sid} sectionId={sid} content={content} />
        ) : null
      })}

      <div style={{ marginTop: '2rem', fontSize: 11, color: '#9CA3AF' }}>
        Generated {data.generated_at
          ? new Date(data.generated_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          : '—'}
      </div>
    </div>
  )
}
