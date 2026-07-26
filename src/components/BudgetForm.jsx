import { useState } from 'react'
import { CATEGORIES, categoryLabel } from '../constants'

const now = new Date()
const EMPTY = {
  category: 'FOOD',
  monthlyLimit: '',
  month: now.getMonth() + 1,
  year: now.getFullYear(),
}

export default function BudgetForm({ initial, onSubmit, onCancel, submitLabel = 'Add budget' }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.monthlyLimit || Number(form.monthlyLimit) <= 0) {
      return setError('Enter a monthly limit greater than 0')
    }
    if (form.month < 1 || form.month > 12) return setError('Month must be between 1 and 12')

    setSaving(true)
    try {
      await onSubmit({
        category: form.category,
        monthlyLimit: Number(form.monthlyLimit),
        month: Number(form.month),
        year: Number(form.year),
      })
    } catch (err) {
      setError(err.message || 'Could not save budget')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-app px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-brand focus:bg-surface'

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Category</label>
          <select className={inputClass} value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{categoryLabel(c)}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Monthly limit</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`${inputClass} num`}
            value={form.monthlyLimit}
            onChange={(e) => update('monthlyLimit', e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Month</label>
          <input
            type="number"
            min="1"
            max="12"
            className={`${inputClass} num`}
            value={form.month}
            onChange={(e) => update('month', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Year</label>
          <input
            type="number"
            className={`${inputClass} num`}
            value={form.year}
            onChange={(e) => update('year', e.target.value)}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-rose">{error}</p>}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-bright disabled:opacity-60"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-muted hover:text-ink">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
