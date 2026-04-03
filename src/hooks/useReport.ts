import { useState, useEffect } from 'react'
import type { ReportMeta, PageData } from '../types/report'

const BASE = 'http://95.216.145.196:3030/api'
const HEADERS = { 'X-Api-Token': 'c37643207501d944d02e1e09e1eebb61e8da02807afd902a' }

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export function useLatestReport() {
  const [data, setData] = useState<ReportMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<ReportMeta>(`${BASE}/report/latest`)
      .then(setData)
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
      .then(setData)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [date, pageId])

  return { data, loading, error }
}
