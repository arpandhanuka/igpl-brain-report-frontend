import { useState, useCallback } from 'react'

export interface SectionResult {
  index: number
  label: string
  tool: string
  content: string
  status: 'loading' | 'done' | 'error'
  error?: string
}

export interface ChatResponse {
  status: string
  answer?: string
  tools_called?: string[]
  confidence?: string
  error?: string
}

// Fetch one section for a page
export async function fetchSection(
  pageId: string,
  index: number,
  prompt: string
): Promise<SectionResult> {
  try {
    const res = await fetch('/api/brain/section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_id: pageId, index, prompt }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { index, label: `Section ${index}`, tool: '', content: '', status: 'error', error: err.error ?? `HTTP ${res.status}` }
    }
    const data = await res.json()
    return { index, label: data.label, tool: data.tool, content: data.content, status: 'done' }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Network error'
    return { index, label: `Section ${index}`, tool: '', content: '', status: 'error', error: msg }
  }
}

// Fetch section count for a page
export async function fetchSectionDefs(pageId: string): Promise<{ total: number; sections: {index: number; label: string}[] }> {
  try {
    const res = await fetch(`/api/brain/sections/${pageId}`)
    if (!res.ok) return { total: 0, sections: [] }
    return await res.json()
  } catch {
    return { total: 0, sections: [] }
  }
}

// Hook for chat bar
export function useChatQuery() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const query = useCallback(async (prompt: string): Promise<ChatResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/brain/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      return await res.json()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { query, loading, error }
}

// Legacy alias so ChatBar.tsx keeps compiling
export type BrainResponse = ChatResponse
