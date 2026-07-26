import { formatCurrency, categoryLabel } from '../constants'
import CategoryBadge from './CategoryBadge.jsx'

export default function BudgetTable({ budgets, onEdit, onDelete }) {
  if (!budgets.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted">No budgets set for these filters.</p>
        <p className="mt-1 text-xs text-faint">Set a monthly limit per category above.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-faint">
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium">Period</th>
            <th className="py-2 pr-4 text-right font-medium">Monthly limit</th>
            <th className="py-2 pr-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => (
            <tr key={b.id} className="border-b border-border last:border-0">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge category={b.category} size="sm" />
                  <span className="font-medium text-ink">{categoryLabel(b.category)}</span>
                </div>
              </td>
              <td className="num py-3 pr-4 text-xs text-muted">
                {String(b.month).padStart(2, '0')}/{b.year}
              </td>
              <td className="num py-3 pr-4 text-right font-medium text-violet">
                {formatCurrency(b.monthlyLimit)}
              </td>
              <td className="py-3 pr-4 text-right">
                <button onClick={() => onEdit(b)} className="mr-3 text-xs font-medium text-muted hover:text-brand">
                  Edit
                </button>
                <button onClick={() => onDelete(b)} className="text-xs font-medium text-muted hover:text-rose">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
