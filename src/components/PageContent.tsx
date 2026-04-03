import ReactMarkdown from 'react-markdown'
import type { SectionResult } from '../hooks/useBrainQuery'

const BRAND_TEAL = '#007C66'

interface Props {
  pageLabel: string
  sections: SectionResult[]
  totalSections: number
  loading: boolean
  onRefresh: () => void
  lastFetched: Date | null
}

export function PageContent({ pageLabel, sections, totalSections, loading, onRefresh, lastFetched }: Props) {
  const done = sections.filter(s => s.status === 'done').length
  const errors = sections.filter(s => s.status === 'error').length
  const progress = totalSections > 0 ? Math.round((done / totalSections) * 100) : 0
  const allDone = !loading && totalSections > 0 && (done + errors) === totalSections

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '1.5rem', paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{pageLabel}</h1>

          {/* Status line */}
          {lastFetched && !loading && (
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
              Last refreshed: {lastFetched.toLocaleTimeString('en-IN')}
              {allDone && errors === 0 && ' · All sections loaded'}
              {allDone && errors > 0 && ` · ${done} loaded, ${errors} failed`}
            </div>
          )}

          {/* Progress bar while loading */}
          {loading && totalSections > 0 && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 120, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress}%`, height: '100%',
                  background: BRAND_TEAL, borderRadius: 2,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
                {done}/{totalSections} sections
                {errors > 0 && ` · ${errors} failed`}
              </span>
            </div>
          )}

          {/* Loading spinner when fetching section defs (total still 0) */}
          {loading && totalSections === 0 && (
            <div style={{ marginTop: 8, fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: BRAND_TEAL, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Connecting to brain...
            </div>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            background: loading ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${BRAND_TEAL}, #005a4e)`,
            border: 'none', borderRadius: 8,
            padding: '0.5rem 1rem',
            color: loading ? 'rgba(255,255,255,0.3)' : '#fff',
            cursor: loading ? 'default' : 'pointer',
            fontSize: '0.8rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            flexShrink: 0, marginLeft: '1rem',
          }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'rgba(255,255,255,0.5)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Loading...
            </>
          ) : '↻ Refresh'}
        </button>
      </div>

      {/* Empty initial state — never loaded */}
      {!loading && sections.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 240,
          color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', gap: '0.75rem',
        }}>
          <div style={{ fontSize: '2.5rem' }}>🧠</div>
          <div>Press <strong style={{ color: BRAND_TEAL }}>Refresh</strong> to query the brain</div>
        </div>
      )}

      {/* Sections — render each as it arrives */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sections.map((s) => (
          <SectionCard key={s.index} section={s} />
        ))}

        {/* Skeleton placeholders for sections not yet started */}
        {loading && Array.from({ length: Math.max(0, totalSections - sections.length) }).map((_, i) => (
          <SkeletonCard key={`sk-${i}`} />
        ))}
      </div>
    </div>
  )
}

function SectionCard({ section }: { section: SectionResult }) {
  const BRAND_TEAL = '#007C66'

  if (section.status === 'loading') return <SkeletonCard label={section.label} />

  if (section.status === 'error') {
    return (
      <div style={{
        background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 10, padding: '1rem 1.25rem',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(239,68,68,0.7)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {section.label} — Failed
        </div>
        <div style={{ color: '#fca5a5', fontSize: '0.82rem' }}>
          {section.error ?? 'Failed to load this section. Click Refresh to retry.'}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '1.25rem 1.5rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        fontSize: '0.68rem', fontWeight: 700, color: BRAND_TEAL,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
      }}>
        <span>●</span> {section.label}
        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
          {section.tool}
        </span>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.7 }}>
        <ReactMarkdown
          components={{
            h3: ({children}) => <h3 style={{ color: '#fff', fontSize: '0.95rem', margin: '0.75rem 0 0.35rem', fontWeight: 600 }}>{children}</h3>,
            h4: ({children}) => <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: '0.6rem 0 0.25rem', fontWeight: 600 }}>{children}</h4>,
            strong: ({children}) => <strong style={{ color: '#fff', fontWeight: 600 }}>{children}</strong>,
            ul: ({children}) => <ul style={{ paddingLeft: '1.25rem', margin: '0.3rem 0' }}>{children}</ul>,
            ol: ({children}) => <ol style={{ paddingLeft: '1.25rem', margin: '0.3rem 0' }}>{children}</ol>,
            li: ({children}) => <li style={{ marginBottom: '0.25rem' }}>{children}</li>,
            p: ({children}) => <p style={{ margin: '0.3rem 0' }}>{children}</p>,
            code: ({children}) => <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.82rem', color: BRAND_TEAL }}>{children}</code>,
            hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '0.75rem 0' }} />,
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

function SkeletonCard({ label }: { label?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.018)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 10, padding: '1.25rem 1.5rem',
      animation: 'pulse 1.5s ease infinite',
    }}>
      {label && (
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(0,124,102,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ height: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 4, width: '80%' }} />
        <div style={{ height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 4, width: '65%' }} />
        <div style={{ height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 4, width: '72%' }} />
      </div>
    </div>
  )
}
