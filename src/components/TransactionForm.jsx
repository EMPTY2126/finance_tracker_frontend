import { useState } from 'react'
import { CATEGORIES, TRANSACTION_TYPES, categoryLabel } from '../constants'

const EMPTY = { title: '', amount: '', type: 'EXPENSE', category: 'OTHER', description: '' }

export default function TransactionForm({ initial, onSubmit, onCancel, submitLabel = 'Add transaction' }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) return setError('Title is required')
    if (!form.amount || Number(form.amount) <= 0) return setError('Enter an amount greater than 0')

    setSaving(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        description: form.description.trim() || null,
      })
    } catch (err) {
      setError(err.message || 'Could not save transaction')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-app px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-brand focus:bg-surface'

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Title</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Grocery run, freelance invoice…"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`${inputClass} num`}
            value={form.amount}
            onChange={(e) => update('amount', e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Type</label>
          <select className={inputClass} value={form.type} onChange={(e) => update('type', e.target.value)}>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t} value={t}>{categoryLabel(t)}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Category</label>
          <select className={inputClass} value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{categoryLabel(c)}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">
            Description <span className="text-faint">(optional)</span>
          </label>
          <input
            className={inputClass}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Notes about this transaction"
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
