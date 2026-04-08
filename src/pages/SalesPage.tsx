import { useCallback } from 'react'
import { useDataFetch } from '../hooks/useDataFetch'
import { fetchFinance, extractBundleMetrics } from '../api/client'
import { PageLayout } from '../components/PageLayout'
import { MetricCard, MetricCardSkeleton } from '../components/MetricCard'
import { ErrorBanner } from '../components/ErrorBanner'

function fmtRs(v: number | null): string {
  if (v == null) return '--'
  if (Math.abs(v) >= 1e7) return `${(v / 1e7).toFixed(1)} Cr`
  if (Math.abs(v) >= 1e5) return `${(v / 1e5).toFixed(1)} L`
  return v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function SalesPage() {
  const fetcher = useCallback(async () => {
    const finance = await fetchFinance()
    const bundle = extractBundleMetrics(finance)
    return { finance, bundle }
  }, [])
  const { data, loading, error, lastFetched, refresh } = useDataFetch(fetcher)

  const fin = data?.finance
  const bundle = data?.bundle

  // Primary source: finance top-level MetricSnapshots for dispatch
  // Bundle has the 7-day authoritative dispatch_revenue_rs
  const dispatchRevBundle = bundle?.dispatch_revenue_rs
  const dispatchQty = fin?.dispatch_qty_mt
  const dispatchRev = fin?.dispatch_revenue_inr

  // Calculate NSR from finance dispatch data
  const nsr = dispatchQty?.value && dispatchRev?.value
    ? Math.round(Number(dispatchRev.value) / Number(dispatchQty.value))
    : null

  return (
    <PageLayout lastRefreshed={lastFetched} onRefresh={refresh}>
      {error && <ErrorBanner message={`Unable to reach Brain server: ${error}`} onRetry={refresh} />}

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading && !data ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              label="Dispatch Qty (7d)"
              metric={dispatchQty}
            />
            <MetricCard
              label="Dispatch Revenue (7d)"
              value={dispatchRevBundle?.latest_value != null ? fmtRs(dispatchRevBundle.latest_value) : undefined}
              unit=""
              asOf={dispatchRevBundle?.authoritative_as_of}
              trust={dispatchRevBundle?.latest_value != null ? 'ready' : 'blocked'}
              metric={!dispatchRevBundle?.latest_value ? dispatchRev : undefined}
            />
            <MetricCard
              label="Actual NSR"
              value={nsr}
              unit="Rs/MT"
              asOf={dispatchQty?.last_updated}
              trust={nsr != null ? 'ready' : 'blocked'}
            />
            <MetricCard
              label="PA FG Closing Stock"
              value={null}
              unit="MT"
              trust="blocked"
            />
          </>
        )}
      </div>

      {/* Dispatch detail from finance sections */}
      {fin && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Dispatch Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-gray-400">Dispatch Qty</span>
              <div className="text-lg font-bold text-gray-900 tabular-nums">
                {dispatchQty?.value != null ? `${Number(dispatchQty.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })} MT` : '--'}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Revenue</span>
              <div className="text-lg font-bold text-gray-900 tabular-nums">
                {dispatchRev?.value != null ? `₹${fmtRs(Number(dispatchRev.value))}` : '--'}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400">NSR</span>
              <div className="text-lg font-bold text-gray-900 tabular-nums">
                {nsr != null ? `₹${nsr.toLocaleString('en-IN')}/MT` : '--'}
              </div>
            </div>
            {fin.dispatch_margin_pct != null && (
              <div>
                <span className="text-xs text-gray-400">Margin</span>
                <div className="text-lg font-bold text-gray-900 tabular-nums">
                  {fin.dispatch_margin_pct.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data gaps */}
      {fin && fin.data_gaps.length > 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Data Gaps</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {fin.data_gaps.filter(g => g.toLowerCase().includes('revenue') || g.toLowerCase().includes('dispatch') || g.toLowerCase().includes('sales')).map((gap, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageLayout>
  )
}
