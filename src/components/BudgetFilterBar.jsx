import { CATEGORIES, categoryLabel } from '../constants'

export default function BudgetFilterBar({ filters, onChange }) {
  const inputClass =
    'rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-brand'

  function set(field, value) {
    onChange({ ...filters, [field]: value, page: 0 })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className={inputClass} value={filters.category || ''} onChange={(e) => set('category', e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{categoryLabel(c)}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Month"
        min="1"
        max="12"
        className={`${inputClass} num w-20`}
        value={filters.month || ''}
        onChange={(e) => set('month', e.target.value)}
      />
      <input
        type="number"
        placeholder="Year"
        className={`${inputClass} num w-24`}
        value={filters.year || ''}
        onChange={(e) => set('year', e.target.value)}
      />
      {(filters.category || filters.month || filters.year) && (
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
