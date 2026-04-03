import { useState } from 'react'
import type { BrainResponse } from '../hooks/useBrainQuery'

const BRAND_TEAL = '#007C66'
const BRAND_NAVY = '#0F2B4F'

interface Props {
  onQuery: (prompt: string) => Promise<BrainResponse | null>
  loading: boolean
}

interface Message {
  role: 'user' | 'assistant'
  text: string
  timestamp: string
}

export function ChatBar({ onQuery, loading }: Props) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text, timestamp: now() }])
    const res = await onQuery(text)
    const answer = res?.answer ?? res?.error ?? 'No response.'
    setMessages(m => [...m, { role: 'assistant', text: answer, timestamp: now() }])
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Ask Brain"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${BRAND_TEAL}, #005a4e)`,
          border: 'none',
          color: '#fff',
          fontSize: '1.4rem',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,124,102,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease',
        }}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          width: 420,
          maxHeight: '70vh',
          background: BRAND_NAVY,
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 999,
          border: `1px solid rgba(255,255,255,0.08)`,
        }}>
          {/* Header */}
          <div style={{
            padding: '0.875rem 1rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontWeight: 600,
            color: '#fff',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ color: BRAND_TEAL }}>⚡</span>
            Ask Brain
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.3)',
              fontWeight: 400,
            }}>Live query</span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}>
            {messages.length === 0 && (
              <div style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.8rem',
                textAlign: 'center',
                padding: '2rem 0',
              }}>
                Ask anything about IGPL operations, production, finance, or procurement.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user'
                    ? `linear-gradient(135deg, ${BRAND_TEAL}, #005a4e)`
                    : 'rgba(255,255,255,0.07)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.2)',
                  marginTop: 2,
                  padding: '0 2px',
                }}>
                  {m.timestamp}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                color: BRAND_TEAL,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                Querying brain…
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '0.5rem',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '0.5rem 0.75rem',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? 'rgba(255,255,255,0.1)'
                  : BRAND_TEAL,
                border: 'none',
                borderRadius: 8,
                padding: '0.5rem 0.875rem',
                color: '#fff',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'background 0.15s',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
