// Types matching the v2 Brain API viewmodels

export interface MetricSnapshot {
  metric_id: string
  value: number | string | null
  unit: string
  vs_yesterday?: string | null
  vs_target?: string | null
  trend?: 'up' | 'down' | 'flat' | 'unknown' | null
  confidence: number
  is_stale: boolean
  source_fact_id?: string | null
  last_updated?: string | null
}

export interface TimeSeries {
  metric_id: string
  timestamps: string[]
  values: (number | null)[]
  confidence: number[]
  unit: string
  granularity: string
}

export interface AlertBrief {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  entity: string
  description?: string | null
  created_at?: string | null
  is_active: boolean
}

export interface IssueBrief {
  id: string
  title: string
  classification: string
  severity: string
  entity: string
  description?: string | null
  confidence: number
}

export interface RiskBrief {
  id: string
  risk: string
  probability: string
  impact: string
  timeframe: string
  entity?: string | null
}

export interface ActionItem {
  id: string
  title: string
  priority: string
  owner: string
  rationale: string
}

export interface TrustPayload {
  status: 'ready' | 'partial' | 'blocked'
  freshness_status: string
  authoritative_as_of?: string | null
  age_minutes?: number | null
  completeness_ratio: number
  missing_fields: string[]
}

export interface DataQualityBrief {
  healthy_count: number
  at_risk_count: number
  failed_count: number
  total_pipelines: number
  last_check?: string | null
}

export interface PlantSnapshot {
  plant_slug: string
  status: 'running' | 'down' | 'startup' | 'maintenance' | 'unknown'
  production_rate_mt_hr: MetricSnapshot
  ox_loading_g_nm3: MetricSnapshot
  equipment_availability_pct: MetricSnapshot
  production_series?: TimeSeries | null
  ox_loading_series?: TimeSeries | null
  active_alerts: AlertBrief[]
  recent_downtime_hours?: number | null
  last_updated: string
}

export interface OptimalLoadingSnapshot {
  plant_slug: string
  current_loading_g_nm3: number
  optimal_loading_g_nm3: number
  loading_gap_pct: number
  opportunity_cost_rs_day: number
  opportunity_cost_rs_month: number
  net_daily_cost_rs: number
  safe_loading_max_g_nm3: number
  loading_safety_margin_pct: number
  pa_price_rs_mt: number
  ox_price_rs_mt: number
  is_inputs_fallback: boolean
  valid_at?: string | null
}

export interface ProductionSnapshot {
  total_production_rate_mt_hr: MetricSnapshot
  by_plant: Record<string, MetricSnapshot>
  on_spec_pct?: number | null
  valid_at?: string | null
}

export interface InventorySnapshot {
  pa_closing_mt: MetricSnapshot
  pa_days_cover: MetricSnapshot
  by_product: Record<string, MetricSnapshot>
  valid_at?: string | null
}

export interface DispatchSnapshot {
  dispatch_qty_mt: MetricSnapshot
  dispatch_revenue_inr: MetricSnapshot
  by_product: Record<string, MetricSnapshot>
  dispatch_margin_rs?: number | null
  margin_pct?: number | null
  valid_at?: string | null
}

// --- Page-level viewmodels ---

export interface DashboardData {
  production: ProductionSnapshot
  inventory: InventorySnapshot
  dispatch: DispatchSnapshot
  plants_running: number
  plants_down: number
  total_production_mt_hr: number
  total_equipment_availability_pct: number
  dispatch_revenue_inr: number
  cash_position_inr: number
  credit_utilization_pct: number
  loading_opportunity_cost_rs_day: number
  as_of: string
  top_issues: IssueBrief[]
  critical_alerts: AlertBrief[]
  forward_risks: RiskBrief[]
  next_moves: ActionItem[]
  summary: string
  data_quality: DataQualityBrief
  page_trust?: TrustPayload | null
  data_gaps: string[]
  time_series_data: Record<string, TimeSeries>
}

export interface OperationsData {
  plants: Record<string, PlantSnapshot>
  fleet_production_mt_hr: MetricSnapshot
  fleet_equipment_availability_pct: MetricSnapshot
  loading_economics_by_plant: Record<string, OptimalLoadingSnapshot>
  total_loading_opportunity_cost_rs_day: number
  plants_running: number
  plants_down: number
  plants_maintenance: number
  active_alerts: AlertBrief[]
  top_issues: IssueBrief[]
  data_quality: DataQualityBrief
  page_trust?: TrustPayload | null
  data_gaps: string[]
  valid_at: string
}

export interface FinanceData {
  dispatch_qty_mt: MetricSnapshot
  dispatch_revenue_inr: MetricSnapshot
  revenue_ytd_inr: MetricSnapshot
  gross_contribution_ytd_inr: MetricSnapshot
  cash_position_inr: MetricSnapshot
  credit_utilization_pct: MetricSnapshot
  loading_opportunity_cost_rs_day: MetricSnapshot
  dispatch_margin_rs?: number | null
  dispatch_margin_pct?: number | null
  key_risks: RiskBrief[]
  linked_issues: IssueBrief[]
  available_metrics: Record<string, MetricSnapshot>
  data_gaps: string[]
  page_trust?: TrustPayload | null
  valid_at: string
}

export interface BriefingSection {
  section_id: string
  title: string
  status: string
  summary: string
  metrics: Record<string, MetricSnapshot>
  alerts: AlertBrief[]
  issues: IssueBrief[]
  notes: string[]
  payload: Record<string, unknown>
  trust?: TrustPayload | null
  snapshot_bundle: Record<string, unknown>
}

export interface BriefingData {
  audience: string
  headline: string
  summary: string
  sections: BriefingSection[]
  structured_actions: ActionItem[]
  data_gaps: string[]
  page_trust?: TrustPayload | null
  valid_at: string
}

export interface ApiResponse<T> {
  error: boolean
  api_version: string
  data: T
  timestamp: string
  cache_info: {
    hit: boolean
    age_seconds: number | null
    ttl_seconds: number
  }
}
