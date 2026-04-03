export type SignalClass = 'act' | 'watch' | 'normal' | null

export interface PageMeta {
  id: string
  signal_class: SignalClass
  generated_at: string
  has_charts?: boolean
  top_intelligence_class?: string // 'critical', 'important', 'watchlist'
  max_intelligence_urgency?: string // 'immediate', 'this_week', 'monitor'
}

export interface ReportMeta {
  date: string
  pages: PageMeta[]
}

export interface ChartRef {
  id: string
  title: string
  url: string
  mime_type: string
}

export interface PageData {
  date: string
  page_id: string
  signal_class: SignalClass
  generated_at: string
  top_intelligence_class?: string
  max_intelligence_urgency?: string
  sections: Record<string, { narrative?: string; [key: string]: unknown }>
  charts: ChartRef[]
}

export interface HealthData {
  status: string
  last_report_date: string | null
  last_generated_at: string | null
  age_hours: number | null
  generation_metadata: Record<string, unknown>
}

export const PAGE_LABELS: Record<string, string> = {
  command: 'Command View',
  trends: 'Trends',
  company: 'Company',
  finance: 'Finance',
  sales: 'Sales',
  pa1: 'PA1',
  pa2: 'PA2',
  pa3: 'PA3',
  pa4: 'PA4',
  pa5: 'PA5',
}

export const PAGE_ORDER = ['command', 'trends', 'company', 'finance', 'sales',
                           'pa1', 'pa2', 'pa3', 'pa4', 'pa5']
