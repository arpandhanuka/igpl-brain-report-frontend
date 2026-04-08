import { useCallback } from 'react'
import { useDataFetch } from '../hooks/useDataFetch'
import { fetchOperations } from '../api/client'
import { PageLayout } from '../components/PageLayout'
import { MetricCard, MetricCardSkeleton } from '../components/MetricCard'
import { PlantStatusBadge } from '../components/PlantStatusBadge'
import { TrustDot } from '../components/TrustDot'
import { DataFreshnessTag } from '../components/DataFreshnessTag'
import { ErrorBanner } from '../components/ErrorBanner'
import { AlertCard } from '../components/AlertCard'

export function OperationsPage() {
  const fetcher = useCallback(() => fetchOperations(), [])
  const { data, loading, error, lastFetched, refresh } = useDataFetch(fetcher)

  return (
    <PageLayout lastRefreshed={lastFetched} onRefresh={refresh}>
      {error && <ErrorBanner message={`Unable to reach Brain server: ${error}`} onRetry={refresh} />}

      {/* Fleet KPIs */}
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
              metric={data.fleet_production_mt_hr}
            />
            <MetricCard
              label="Plants Running"
              value={data.plants_running}
              unit=""
              trust="ready"
              asOf={data.valid_at}
            />
            <MetricCard
              label="Plants Down"
              value={data.plants_down}
              unit=""
              trust={data.plants_down > 0 ? 'partial' : 'ready'}
              asOf={data.valid_at}
            />
            <MetricCard
              label="Loading Opportunity Cost"
              value={data.total_loading_opportunity_cost_rs_day}
              unit="Rs/day"
              asOf={data.valid_at}
              trust={data.total_loading_opportunity_cost_rs_day <= 0 ? 'ready' : 'partial'}
            />
          </>
        ) : null}
      </div>

      {/* Per-plant cards */}
      {data && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Per-Plant Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(data.plants)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([slug, plant]) => {
                const economics = data.loading_economics_by_plant[slug]
                return (
                  <div key={slug} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-800 uppercase">{slug}</span>
                        <TrustDot status={plant.status === 'running' ? 'ready' : plant.status === 'unknown' ? 'unknown' : 'partial'} />
                      </div>
                      <PlantStatusBadge status={plant.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">Production</div>
                        <div className="text-lg font-bold text-gray-900 tabular-nums">
                          {plant.production_rate_mt_hr.value != null
                            ? `${Number(plant.production_rate_mt_hr.value).toFixed(1)}`
                            : '--'}
                          <span className="text-xs text-gray-400 ml-1">{plant.production_rate_mt_hr.unit}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">OX Loading</div>
                        <div className="text-lg font-bold text-gray-900 tabular-nums">
                          {plant.ox_loading_g_nm3.value != null
                            ? `${Number(plant.ox_loading_g_nm3.value).toFixed(1)}`
                            : '--'}
                          <span className="text-xs text-gray-400 ml-1">{plant.ox_loading_g_nm3.unit}</span>
                        </div>
                      </div>
                    </div>

                    {economics && (
                      <div className="border-t border-gray-50 pt-3">
                        <div className="text-xs text-gray-400 mb-0.5">Standby/Opportunity Cost</div>
                        <div className="text-sm font-semibold text-gray-700 tabular-nums">
                          {economics.opportunity_cost_rs_day > 0
                            ? `₹${Math.round(economics.opportunity_cost_rs_day).toLocaleString('en-IN')}/day`
                            : plant.status === 'down' || plant.status === 'maintenance'
                              ? `₹${Math.round(economics.net_daily_cost_rs).toLocaleString('en-IN')}/day idle`
                              : '₹0/day'}
                        </div>
                      </div>
                    )}

                    {plant.active_alerts.length > 0 && (
                      <div className="border-t border-gray-50 pt-3 mt-3 space-y-1.5">
                        {plant.active_alerts.slice(0, 2).map(alert => (
                          <AlertCard key={alert.id} alert={alert} />
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex justify-end">
                      <DataFreshnessTag asOf={plant.last_updated} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Fleet Alerts */}
      {data && data.active_alerts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Fleet Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.active_alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
