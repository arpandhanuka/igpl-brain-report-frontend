import { useState, useCallback, useRef } from 'react'
import { Sidebar } from './components/Sidebar'
import { ChatBar } from './components/ChatBar'
import { PageContent } from './components/PageContent'
import { fetchSection, fetchSectionDefs, useChatQuery } from './hooks/useBrainQuery'
import type { SectionResult } from './hooks/useBrainQuery'
import { PAGES, PROMPTS } from './prompts'

const BG = '#0a1628'

function todayStr() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function resolvePrompt(pageId: string): string {
  const raw = PROMPTS[pageId] ?? `Provide a detailed summary for ${pageId}.`
  return raw.replace('{DATE}', todayStr())
}

interface PageState {
  sections: SectionResult[]
  total: number
  loading: boolean
  lastFetched: Date | null
}

const emptyPage: PageState = { sections: [], total: 0, loading: false, lastFetched: null }

export default function App() {
  const [activePage, setActivePage] = useState('command')
  const [pages, setPages] = useState<Record<string, PageState>>({})
  const abortRef = useRef<AbortController | null>(null)
  const loadingPageRef = useRef<string | null>(null)
  const { query: chatQuery, loading: chatLoading } = useChatQuery()

  const loadPage = useCallback(async (pageId: string) => {
    // Cancel any in-flight requests
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    loadingPageRef.current = pageId

    // Set loading state for this page, keep old sections visible until new data arrives
    setPages(prev => ({
      ...prev,
      [pageId]: { sections: [], total: 0, loading: true, lastFetched: prev[pageId]?.lastFetched ?? null }
    }))

    const prompt = resolvePrompt(pageId)

    // Get section definitions first (fast, no data)
    const defs = await fetchSectionDefs(pageId)
    if (loadingPageRef.current !== pageId) return // aborted

    setPages(prev => ({
      ...prev,
      [pageId]: { ...prev[pageId] ?? emptyPage, total: defs.total, loading: true }
    }))

    if (defs.total === 0) {
      setPages(prev => ({ ...prev, [pageId]: { ...prev[pageId] ?? emptyPage, loading: false } }))
      return
    }

    // Fire all section requests in parallel
    const promises = defs.sections.map(async (def) => {
      // Add skeleton placeholder
      setPages(prev => {
        const ps = prev[pageId] ?? emptyPage
        if (ps.sections.find(s => s.index === def.index)) return prev
        return { ...prev, [pageId]: {
          ...ps,
          sections: [...ps.sections, { index: def.index, label: def.label, tool: '', content: '', status: 'loading' as const }]
            .sort((a, b) => a.index - b.index)
        }}
      })

      const result = await fetchSection(pageId, def.index, prompt)

      setPages(prev => {
        const ps = prev[pageId] ?? emptyPage
        return { ...prev, [pageId]: {
          ...ps,
          sections: ps.sections.map(s => s.index === result.index ? result : s)
        }}
      })
      return result
    })

    await Promise.allSettled(promises)

    setPages(prev => ({
      ...prev,
      [pageId]: { ...prev[pageId] ?? emptyPage, loading: false, lastFetched: new Date() }
    }))
  }, [])

  // No auto-loading — pages only load when user clicks refresh

  const handlePageSelect = (id: string) => {
    if (id !== activePage) setActivePage(id)
  }

  const pageLabel = PAGES.find(p => p.id === activePage)?.label ?? activePage
  const ps = pages[activePage] ?? emptyPage

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: BG,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <Sidebar activePage={activePage} onSelect={handlePageSelect} />
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', minWidth: 0 }}>
        <PageContent
          pageLabel={pageLabel}
          sections={ps.sections}
          totalSections={ps.total}
          loading={ps.loading}
          onRefresh={() => loadPage(activePage)}
          lastFetched={ps.lastFetched}
        />
      </main>
      <ChatBar onQuery={chatQuery} loading={chatLoading} />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${BG}; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  )
}
