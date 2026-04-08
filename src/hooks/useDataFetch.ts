import { useState, useEffect, useCallback, useRef } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastFetched: Date | null
}

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function useDataFetch<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
    lastFetched: null,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetcher()
      setState({ data, loading: false, error: null, lastFetched: new Date() })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setState(prev => ({ ...prev, loading: false, error: msg }))
    }
  }, [fetcher])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, REFRESH_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [load])

  return { ...state, refresh: load }
}
