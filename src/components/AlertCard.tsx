import type { AlertBrief, IssueBrief } from '../types/api'

const severityStyle: Record<string, string> = {
  critical: 'border-red-200 bg-red-50 text-red-800',
  high: 'border-amber-200 bg-amber-50 text-amber-800',
  medium: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  low: 'border-blue-200 bg-blue-50 text-blue-800',
  info: 'border-gray-200 bg-gray-50 text-gray-700',
}

const severityDot: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-400',
  info: 'bg-gray-400',
}

export function AlertCard({ alert }: { alert: AlertBrief }) {
  const style = severityStyle[alert.severity] ?? severityStyle.info
  const dot = severityDot[alert.severity] ?? severityDot.info
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${style}`}>
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
        <div className="min-w-0">
          <div className="text-sm font-medium">{alert.title}</div>
          {alert.description && (
            <div className="text-xs mt-0.5 opacity-80">{alert.description}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function IssueCard({ issue }: { issue: IssueBrief }) {
  const style = severityStyle[issue.severity] ?? severityStyle.info
  const dot = severityDot[issue.severity] ?? severityDot.info
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${style}`}>
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
        <div className="min-w-0">
          <div className="text-sm font-medium">{issue.title}</div>
          {issue.description && (
            <div className="text-xs mt-0.5 opacity-80">{issue.description}</div>
          )}
        </div>
      </div>
    </div>
  )
}
