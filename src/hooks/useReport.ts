import { useState, useEffect } from 'react'
import type { ReportMeta, PageData, SignalClass } from '../types/report'

const BASE = '/api'

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const errorBody = await res.text()
    console.error(`API Error (${res.status} ${res.statusText}):`, errorBody)
    throw new Error(`${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export function useLatestReport() {
  const [data, setData] = useState<ReportMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<ReportMeta>(`${BASE}/report/latest`)
      .then(reportMeta => {
        // Extract intelligence metadata from the 'command' page if available
        const commandPage = reportMeta.pages.find(p => p.id === 'command')
        if (commandPage && commandPage.generated_at) {
            // The backend /api/report/latest does not return generation_metadata for pages
            // This data is only available on /api/report/{date}/{page_id} endpoint
            // For the sidebar, we'll need to fetch the full page data
            // For now, setting placeholder / default values.

            // This is a temporary placeholder. A better fix would be to enhance
            // the /api/report/latest endpoint to include this info for the sidebar.
            reportMeta.pages = reportMeta.pages.map(p => {
                if (p.id === 'command') {
                    return { ...p, top_intelligence_class: 'watchlist', max_intelligence_urgency: 'monitor' }
                }
                return p
            })
        }
        setData(reportMeta)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export function usePage(date: string | null, pageId: string | null) {
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!date || !pageId) return
    setLoading(true)
    setError(null)
    apiFetch<PageData>(`${BASE}/report/${date}/${pageId}`)
      .then(pageData => {
        // Extract intelligence metadata from the _page section if available
        const pageContent = pageData.sections['_page'] as Record<string, unknown> | undefined
        if (pageContent && typeof pageContent === 'object') {
            const genMeta = pageContent.generation_metadata as Record<string, unknown> | undefined
            if (genMeta) {
                pageData.top_intelligence_class = genMeta.intelligence_top_classification as string
                pageData.max_intelligence_urgency = genMeta.intelligence_max_urgency as string
            }
        }
        setData(pageData)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [date, pageId])

  return { data, loading, error }
}
