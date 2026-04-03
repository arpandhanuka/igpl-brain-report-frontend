import { PAGES } from '../prompts'

interface Props {
  activePage: string
  onSelect: (id: string) => void
}

const BRAND_TEAL = '#007C66'
const BRAND_NAVY = '#0F2B4F'

export function Sidebar({ activePage, onSelect }: Props) {
  return (
    <nav style={{
      width: 200,
      minHeight: '100vh',
      background: BRAND_NAVY,
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      flexShrink: 0,
      boxShadow: '2px 0 12px rgba(0,0,0,0.3)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem 1.25rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          fontWeight: 800,
          fontSize: '1.05rem',
          color: '#fff',
          letterSpacing: '0.02em',
        }}>IGPL Brain</div>
        <div style={{
          fontSize: '0.7rem',
          color: BRAND_TEAL,
          marginTop: 2,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>Live Intelligence</div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '0.75rem 0' }}>
        {PAGES.map(page => {
          const isActive = activePage === page.id
          return (
            <button
              key={page.id}
              onClick={() => onSelect(page.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: isActive
                  ? `linear-gradient(90deg, ${BRAND_TEAL}22 0%, transparent 100%)`
                  : 'transparent',
                border: 'none',
                borderLeft: isActive ? `3px solid ${BRAND_TEAL}` : '3px solid transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                padding: '0.6rem 1.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{page.icon}</span>
              {page.label}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.25)',
      }}>
        IG Petrochemicals Ltd
      </div>
    </nav>
  )
}
