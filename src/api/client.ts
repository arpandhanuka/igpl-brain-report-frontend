import type {
  ApiResponse,
  DashboardData,
  OperationsData,
  FinanceData,
  BriefingData,
} from '../types/api'

const BASE = '/api/v2/brain'

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  const json: ApiResponse<T> = await res.json()
  if (json.error) {
    throw new Error('API returned error')
  }
  return json.data
}

export async function fetchDashboard(): Promise<DashboardData> {
  return fetchApi<DashboardData>(`${BASE}/dashboard?include_time_series=true`)
}

export async function fetchOperations(): Promise<OperationsData> {
  return fetchApi<OperationsData>(`${BASE}/operations`)
}

export async function fetchFinance(): Promise<FinanceData> {
  return fetchApi<FinanceData>(`${BASE}/finance`)
}

export async function fetchSalesBriefing(): Promise<BriefingData> {
  return fetchApi<BriefingData>(`${BASE}/briefing?audience=commercial`)
}

export async function fetchProcurementBriefing(): Promise<BriefingData> {
  return fetchApi<BriefingData>(`${BASE}/briefing?audience=procurement`)
}

// ---- Derived data types ----

/** Extracted metrics from snapshot_bundle.metrics (rich format with latest_value) */
export interface BundleMetric {
  metric_key: string
  label: string
  latest_value: number | null
  authoritative_as_of: string | null
  evidence_count: number
  section_id?: string
}

/** Extract bundle metrics from finance snapshot_bundle */
export function extractBundleMetrics(data: FinanceData): Record<string, BundleMetric> {
  const sb = (data as unknown as Record<string, unknown>).snapshot_bundle as Record<string, unknown> | undefined
  if (!sb) return {}
  const metrics = sb.metrics as Record<string, Record<string, unknown>> | undefined
  if (!metrics) return {}
  const result: Record<string, BundleMetric> = {}
  for (const [key, val] of Object.entries(metrics)) {
    result[key] = {
      metric_key: (val.metric_key as string) ?? key,
      label: (val.label as string) ?? key,
      latest_value: (val.latest_value as number) ?? null,
      authoritative_as_of: (val.authoritative_as_of as string) ?? null,
      evidence_count: (val.evidence_count as number) ?? 0,
      section_id: val.section_id as string | undefined,
    }
  }
  return result
}

/** Extract section metrics from briefing response */
export function extractSectionMetrics(data: BriefingData): Record<string, {
  value: number | string | null
  unit: string
  last_updated: string | null
  section_id: string
}> {
  const result: Record<string, { value: number | string | null; unit: string; last_updated: string | null; section_id: string }> = {}
  for (const section of data.sections) {
    for (const [key, metric] of Object.entries(section.metrics)) {
      result[key] = {
        value: metric.value,
        unit: metric.unit,
        last_updated: metric.last_updated ?? null,
        section_id: section.section_id,
      }
    }
  }
  return result
}

// ---- Combined overview ----

export interface CombinedOverview {
  dashboard: DashboardData
  operations: OperationsData
  finance: FinanceData
  financeBundle: Record<string, BundleMetric>
}

export async function fetchCombinedOverview(): Promise<CombinedOverview> {
  const [dashboard, operations, finance] = await Promise.all([
    fetchDashboard(),
    fetchOperations(),
    fetchFinance(),
  ])
  return {
    dashboard,
    operations,
    finance,
    financeBundle: extractBundleMetrics(finance),
  }
}

// ---- Procurement combined ----

export interface ProcurementData {
  briefing: BriefingData
  sectionMetrics: Record<string, { value: number | string | null; unit: string; last_updated: string | null; section_id: string }>
  operations: OperationsData
}

export async function fetchProcurementData(): Promise<ProcurementData> {
  const [briefing, operations] = await Promise.all([
    fetchProcurementBriefing(),
    fetchOperations(),
  ])
  return {
    briefing,
    sectionMetrics: extractSectionMetrics(briefing),
    operations,
  }
}
