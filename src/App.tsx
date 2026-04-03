import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { CommandView } from './pages/CommandView'
import { TrendsPage } from './pages/TrendsPage'
import { DeepReadPage } from './pages/DeepReadPage'
import { LoadingPage, ErrorPage } from './pages/LoadingPage'
import { useLatestReport, usePage } from './hooks/useReport'
import type { PageData } from './types/report'
import { PAGE_ORDER } from './types/report'

export default function App() {
  const { data: meta, loading: metaLoading, error: metaError } = useLatestReport()
  const [activePage, setActivePage] = useState<string>('command')

  // Auto-select first available page when meta loads
  useEffect(() => {
    if (meta?.pages?.length) {
      const first = PAGE_ORDER.find(id => meta.pages.some(p => p.id === id))
      if (first) setActivePage(first)
    }
  }, [meta])

  const { data: pageData, loading: pageLoading, error: pageError } =
    usePage(meta?.date ?? null, activePage)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (metaLoading) return <LoadingPage />
  if (metaError || !meta) return <ErrorPage message={metaError ?? 'No reports found'} />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        pages={meta.pages}
        currentPage={activePage}
        reportDate={meta.date}
        onSelect={setActivePage}
      />

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
        maxWidth: 960,
      }}>
        {pageLoading && <LoadingPage />}
        {pageError && <ErrorPage message={pageError} />}
        {!pageLoading && !pageError && pageData && renderPage(pageData)}
      </main>
    </div>
  )
}

function renderPage(data: PageData) {
  switch (data.page_id) {
    case 'command': return <CommandView data={data} />
    case 'trends': return <TrendsPage data={data} />
    default: return <DeepReadPage data={data} />
  }
}
