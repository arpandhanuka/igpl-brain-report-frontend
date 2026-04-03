import ReactMarkdown from 'react-markdown'

const SECTION_LABELS: Record<string, string> = {
  current_state: 'Current State',
  what_changed: 'What Changed',
  key_risks: 'Key Risks',
  opportunities: 'Opportunities',
  decisions_needed: 'Decisions Needed',
  numbers_that_matter: 'Numbers That Matter',
  forward_look: 'Forward Look',
  what_to_watch: 'What to Watch',
  owner_lens: "Owner's Lens",
}

interface Props {
  sectionId: string
  content: { narrative?: string; [key: string]: unknown }
}

export function NarrativeSection({ sectionId, content }: Props) {
  const label = SECTION_LABELS[sectionId] ?? sectionId
  const text = content?.narrative ?? ''

  if (!text) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#6B7280',
          marginBottom: '0.5rem',
        }}>
          {label}
        </h3>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: '#9CA3AF' }}>
          Analysis pending...
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#6B7280',
        marginBottom: '0.5rem',
      }}>
        {label}
      </h3>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: '#1F2937' }}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  )
}
