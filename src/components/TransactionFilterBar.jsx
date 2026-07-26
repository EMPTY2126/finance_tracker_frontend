import { CATEGORIES, TRANSACTION_TYPES, categoryLabel } from '../constants'

export default function TransactionFilterBar({ filters, onChange }) {
  const inputClass =
    'rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-brand'

  function set(field, value) {
    onChange({ ...filters, [field]: value, page: 0 })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className={inputClass} value={filters.type || ''} onChange={(e) => set('type', e.target.value)}>
        <option value="">All types</option>
        {TRANSACTION_TYPES.map((t) => (
          <option key={t} value={t}>{categoryLabel(t)}</option>
        ))}
      </select>
      <select className={inputClass} value={filters.category || ''} onChange={(e) => set('category', e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{categoryLabel(c)}</option>
        ))}
      </select>
      <input type="date" className={inputClass} value={filters.startDate || ''} onChange={(e) => set('startDate', e.target.value)} />
      <span className="text-xs text-faint">to</span>
      <input type="date" className={inputClass} value={filters.endDate || ''} onChange={(e) => set('endDate', e.target.value)} />
      <input
        type="number"
        placeholder="Min ₹"
        className={`${inputClass} num w-20`}
        value={filters.minAmount || ''}
        onChange={(e) => set('minAmount', e.target.value)}
      />
      <input
        type="number"
        placeholder="Max ₹"
        className={`${inputClass} num w-20`}
        value={filters.maxAmount || ''}
        onChange={(e) => set('maxAmount', e.target.value)}
      />
      {(filters.type || filters.category || filters.startDate || filters.endDate || filters.minAmount || filters.maxAmount) && (
        <button
          onClick={() => onChange({ page: 0, size: filters.size })}
          className="text-xs font-medium text-rose hover:text-rose-bright"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
