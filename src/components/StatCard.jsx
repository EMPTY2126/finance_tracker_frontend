import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '../constants'

const ICON_STYLES = {
  brand: 'bg-brand-soft text-brand',
  rose: 'bg-rose-soft text-rose',
  sky: 'bg-sky-soft text-sky',
  violet: 'bg-violet-soft text-violet',
}

// `delta` is an optional signed percentage (e.g. 20.5 or -8.2). When
// omitted, no comparison row is rendered rather than showing a fake one.
export default function StatCard({ label, value, icon: Icon, tone = 'brand', delta, deltaLabel = 'vs last month' }) {
  const hasDelta = typeof delta === 'number' && Number.isFinite(delta)
  const isPositive = delta >= 0

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
        {Icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${ICON_STYLES[tone]}`}>
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
        )}
      </div>
      <p className="num mt-3 text-2xl font-semibold text-ink">{formatCurrency(value)}</p>
      {hasDelta && (
        <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-brand' : 'text-rose'}`}>
          {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {isPositive ? '+' : ''}{delta.toFixed(1)}%
          <span className="font-normal text-faint">{deltaLabel}</span>
        </p>
      )}
    </div>
  )
}
