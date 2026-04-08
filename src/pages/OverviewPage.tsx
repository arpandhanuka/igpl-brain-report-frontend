import { useCallback } from 'react'
import { useDataFetch } from '../hooks/useDataFetch'
import { fetchCombinedOverview } from '../api/client'
import { PageLayout } from '../components/PageLayout'
import { MetricCard, MetricCardSkeleton } from '../components/MetricCard'
import { PlantStatusBadge } from '../components/PlantStatusBadge'
import { ErrorBanner } from '../components/ErrorBanner'
import { AlertCard, IssueCard } from '../components/AlertCard'

function fmtRs(v: number | null): string {
  if (v == null) return '--'
  if (Math.abs(v) >= 1e7) return `${(v / 1e7).toFixed(1)} Cr`
  if (Math.abs(v) >= 1e5) return `${(v / 1e5).toFixed(1)} L`
  return v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function OverviewPage() {
  const fetcher = useCallback(() => fetchCombinedOverview(), [])
  const { data, loading, error, lastFetched, refresh } = useDataFetch(fetcher)

  const d = data?.dashboard
  const ops = data?.operations
  const fb = data?.financeBundle

  // Use finance bundle for dispatch revenue (authoritative)
  const dispatchRevenue = fb?.dispatch_revenue_rs
  const oxStock = data?.operations

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
        ) : data ? (
          <>
            <MetricCard
              label="Fleet Production"
              metric={d?.production.total_production_rate_mt_hr}
              asOf={d?.production.valid_at ?? d?.as_of}
            />
            <MetricCard
              label="Dispatch Revenue (7d)"
              value={dispatchRevenue?.latest_value != null ? fmtRs(dispatchRevenue.latest_value) : undefined}
              unit=""
              asOf={dispatchRevenue?.authoritative_as_of}
              trust={dispatchRevenue?.latest_value != null ? 'ready' : 'blocked'}
              metric={!dispatchRevenue?.latest_value ? d?.dispatch.dispatch_revenue_inr : undefined}
            />
            <MetricCard
              label="Loading Opportunity Cost"
              value={d?.loading_opportunity_cost_rs_day != null
                ? `${d.loading_opportunity_cost_rs_day < 0 ? '-' : ''}${fmtRs(Math.abs(d.loading_opportunity_cost_rs_day))}`
                : null}
              unit="Rs/day"
              asOf={d?.as_of}
              trust={d?.loading_opportunity_cost_rs_day != null ? 'ready' : 'blocked'}
            />
            <MetricCard
              label="OX Days Cover"
              value={null}
              unit="days"
              trust="blocked"
              asOf={d?.as_of}
            />
          </>
        ) : null}
      </div>

      {/* Plant Fleet Status */}
      {ops && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Plant Fleet</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(ops.plants)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([slug, plant]) => (
                <div key={slug} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700 uppercase">{slug}</span>
                    <PlantStatusBadge status={plant.status} />
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-xs text-gray-400">OX Loading</span>
                      <div className="text-lg font-bold text-gray-900 tabular-nums">
                        {plant.ox_loading_g_nm3.value != null && Number(plant.ox_loading_g_nm3.value) > 0
                          ? `${Number(plant.ox_loading_g_nm3.value).toFixed(1)}`
                          : '--'}
                        <span className="text-xs text-gray-400 ml-1">g/Nm3</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Summary + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {d?.summary && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Business Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{d.summary}</p>
          </div>
        )}

        <div className="space-y-4">
          {d?.critical_alerts && d.critical_alerts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Critical Alerts</h2>
              <div className="space-y-2">
                {d.critical_alerts.slice(0, 5).map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}
          {d?.top_issues && d.top_issues.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Top Issues</h2>
              <div className="space-y-2">
                {d.top_issues.slice(0, 3).map(issue => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          )}
          {(!d?.critical_alerts || d.critical_alerts.length === 0) &&
           (!d?.top_issues || d.top_issues.length === 0) && d && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5 text-sm text-emerald-700">
              No critical alerts or issues at this time.
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
