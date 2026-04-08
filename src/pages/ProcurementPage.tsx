import { useCallback } from 'react'
import { useDataFetch } from '../hooks/useDataFetch'
import { fetchProcurementData } from '../api/client'
import { PageLayout } from '../components/PageLayout'
import { MetricCard, MetricCardSkeleton } from '../components/MetricCard'
import { PlantStatusBadge } from '../components/PlantStatusBadge'
import { ErrorBanner } from '../components/ErrorBanner'

function fmtNum(v: number | string | null): string {
  if (v == null) return '--'
  const n = Number(v)
  return n.toLocaleString('en-IN', { maximumFractionDigits: 1 })
}

export function ProcurementPage() {
  const fetcher = useCallback(() => fetchProcurementData(), [])
  const { data, loading, error, lastFetched, refresh } = useDataFetch(fetcher)

  const sm = data?.sectionMetrics
  const ops = data?.operations

  // Extract key metrics from briefing section metrics
  const oxClosing = sm?.operational_closing_mt
  const oxDaysCover = sm?.operational_days_cover
  const dailyBurn = sm?.daily_burn_mt
  const localPrice = sm?.latest_local_price_rs_per_mt
  const importedPrice = sm?.latest_imported_price_rs_per_mt
  const dominantShare = sm?.dominant_share_pct
  const localPct = sm?.local_pct
  const importPct = sm?.import_pct
  const erpClosing = sm?.erp_closing_mt
  const openPoQty = sm?.open_po_qty_mt
  const openPoCount = sm?.open_po_count
  const net14dCoverage = sm?.net_14d_coverage_days

  return (
    <PageLayout lastRefreshed={lastFetched} onRefresh={refresh}>
      {error && <ErrorBanner message={`Unable to reach Brain server: ${error}`} onRetry={refresh} />}

      {/* Top KPIs */}
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
              label="OX Closing Stock"
              value={oxClosing?.value != null ? fmtNum(oxClosing.value) : null}
              unit="MT"
              asOf={oxClosing?.last_updated}
              trust={oxClosing?.value != null ? 'ready' : 'blocked'}
            />
            <MetricCard
              label="OX Days Cover"
              value={oxDaysCover?.value != null ? Number(oxDaysCover.value).toFixed(1) : null}
              unit="days"
              asOf={oxDaysCover?.last_updated}
              trust={oxDaysCover?.value != null
                ? (Number(oxDaysCover.value) < 7 ? 'partial' : 'ready')
                : 'blocked'}
            />
            <MetricCard
              label="Daily OX Burn"
              value={dailyBurn?.value != null ? fmtNum(dailyBurn.value) : null}
              unit="MT/day"
              asOf={dailyBurn?.last_updated}
              trust={dailyBurn?.value != null ? 'ready' : 'blocked'}
            />
            <MetricCard
              label="OX Local Price"
              value={localPrice?.value != null ? `₹${fmtNum(localPrice.value)}` : null}
              unit="/MT"
              asOf={localPrice?.last_updated}
              trust={localPrice?.value != null ? 'ready' : 'blocked'}
            />
          </>
        )}
      </div>

      {/* Supplier Concentration */}
      {dominantShare && Number(dominantShare.value) > 80 && (
        <div className="mb-6 bg-amber-50 rounded-xl border border-amber-200 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-800">
                Supplier Concentration: {Number(dominantShare.value).toFixed(1)}%
              </div>
              <div className="text-sm text-amber-700 mt-1">
                Local sourcing {localPct ? `${Number(localPct.value).toFixed(1)}%` : '--'},
                imported {importPct ? `${Number(importPct.value).toFixed(1)}%` : '--'}.
                High single-supplier dependency — diversification recommended.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="ERP Closing Stock"
          value={erpClosing?.value != null ? fmtNum(erpClosing.value) : null}
          unit="MT"
          asOf={erpClosing?.last_updated}
          trust={erpClosing?.value != null ? 'ready' : 'blocked'}
        />
        <MetricCard
          label="Open PO Qty"
          value={openPoQty?.value != null ? fmtNum(openPoQty.value) : null}
          unit="MT"
          asOf={openPoQty?.last_updated}
          trust={openPoQty?.value != null ? 'ready' : 'blocked'}
        />
        <MetricCard
          label="Open PO Count"
          value={openPoCount?.value != null ? String(openPoCount.value) : null}
          unit="lines"
          asOf={openPoCount?.last_updated}
          trust={openPoCount?.value != null ? 'ready' : 'blocked'}
        />
        <MetricCard
          label="14-day Coverage"
          value={net14dCoverage?.value != null ? Number(net14dCoverage.value).toFixed(1) : null}
          unit="days"
          asOf={net14dCoverage?.last_updated}
          trust={net14dCoverage?.value != null ? 'ready' : 'blocked'}
        />
      </div>

      {/* Imported price */}
      {importedPrice?.value != null && Number(importedPrice.value) > 1 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="OX Imported Price"
            value={`₹${fmtNum(importedPrice.value)}`}
            unit="/MT"
            asOf={importedPrice.last_updated}
            trust="ready"
          />
        </div>
      )}

      {/* Plant Fleet (for OX consumption context) */}
      {ops && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Fleet OX Loading</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(ops.plants)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([slug, plant]) => (
                <div key={slug} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-600 uppercase">{slug}</span>
                    <PlantStatusBadge status={plant.status} size="sm" />
                  </div>
                  <div className="text-base font-bold text-gray-900 tabular-nums">
                    {plant.ox_loading_g_nm3.value != null && Number(plant.ox_loading_g_nm3.value) > 0
                      ? `${Number(plant.ox_loading_g_nm3.value).toFixed(1)}`
                      : '--'}
                    <span className="text-xs text-gray-400 ml-1">g/Nm3</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
