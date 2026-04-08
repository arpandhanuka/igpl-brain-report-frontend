import { useCallback } from 'react'
import { useDataFetch } from '../hooks/useDataFetch'
import { fetchFinance, extractBundleMetrics } from '../api/client'
import { PageLayout } from '../components/PageLayout'
import { MetricCard, MetricCardSkeleton } from '../components/MetricCard'
import { ErrorBanner } from '../components/ErrorBanner'
import { IssueCard } from '../components/AlertCard'

function fmtRs(v: number | null): string {
  if (v == null) return '--'
  if (Math.abs(v) >= 1e7) return `${(v / 1e7).toFixed(1)} Cr`
  if (Math.abs(v) >= 1e5) return `${(v / 1e5).toFixed(1)} L`
  return v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function FinancePage() {
  const fetcher = useCallback(async () => {
    const finance = await fetchFinance()
    const bundle = extractBundleMetrics(finance)
    return { finance, bundle }
  }, [])
  const { data, loading, error, lastFetched, refresh } = useDataFetch(fetcher)

  const fin = data?.finance
  const b = data?.bundle

  return (
    <PageLayout lastRefreshed={lastFetched} onRefresh={refresh}>
      {error && <ErrorBanner message={`Unable to reach Brain server: ${error}`} onRetry={refresh} />}

      {/* Top KPIs — from snapshot_bundle (authoritative, dated) */}
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
              label="Receivables"
              value={b?.receivables_rs?.latest_value != null ? fmtRs(b.receivables_rs.latest_value) : null}
              unit=""
              asOf={b?.receivables_rs?.authoritative_as_of}
              trust={b?.receivables_rs?.latest_value != null ? 'ready' : 'blocked'}
            />
            <MetricCard
              label="Payables"
              value={b?.payables_rs?.latest_value != null ? fmtRs(b.payables_rs.latest_value) : null}
              unit=""
              asOf={b?.payables_rs?.authoritative_as_of}
              trust={b?.payables_rs?.latest_value != null ? 'ready' : 'blocked'}
            />
            <MetricCard
              label="Net Working Capital"
              value={b?.net_working_capital_rs?.latest_value != null ? fmtRs(b.net_working_capital_rs.latest_value) : null}
              unit=""
              asOf={b?.net_working_capital_rs?.authoritative_as_of}
              trust={b?.net_working_capital_rs?.latest_value != null ? 'ready' : 'blocked'}
            />
            <MetricCard
              label="Dispatch Revenue (7d)"
              value={b?.dispatch_revenue_rs?.latest_value != null ? fmtRs(b.dispatch_revenue_rs.latest_value) : null}
              unit=""
              asOf={b?.dispatch_revenue_rs?.authoritative_as_of}
              trust={b?.dispatch_revenue_rs?.latest_value != null ? 'ready' : 'blocked'}
            />
          </>
        )}
      </div>

      {/* Secondary KPIs — from MetricSnapshots */}
      {fin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Closing Bank Balance"
            value={b?.closing_bank_balance_cc_lakh?.latest_value != null
              ? `${b.closing_bank_balance_cc_lakh.latest_value.toFixed(0)} L`
              : null}
            unit=""
            asOf={b?.closing_bank_balance_cc_lakh?.authoritative_as_of}
            trust={b?.closing_bank_balance_cc_lakh?.latest_value != null
              ? (b.closing_bank_balance_cc_lakh.latest_value > 0 ? 'ready' : 'partial')
              : 'blocked'}
          />
          <MetricCard label="Credit Utilization" metric={fin.credit_utilization_pct} />
          <MetricCard label="Loading Opportunity Cost" metric={fin.loading_opportunity_cost_rs_day} />
          <MetricCard label="Dispatch Qty" metric={fin.dispatch_qty_mt} />
        </div>
      )}

      {/* Data gaps */}
      {fin && fin.data_gaps.length > 0 && (
        <div className="mb-8 bg-gray-50 rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Data Gaps</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {fin.data_gaps.map((gap, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fin?.key_risks && fin.key_risks.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Risks</h2>
            <div className="space-y-2">
              {fin.key_risks.map(risk => (
                <div key={risk.id} className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
                  <div className="text-sm font-medium text-gray-800">{risk.risk}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {risk.probability} probability / {risk.impact} impact / {risk.timeframe}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {fin?.linked_issues && fin.linked_issues.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Linked Issues</h2>
            <div className="space-y-2">
              {fin.linked_issues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
