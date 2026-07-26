import { formatCurrency } from '../constants'
import CategoryBadge from './CategoryBadge.jsx'
import CategoryPill from './CategoryPill.jsx'

export default function TransactionTable({ transactions}) {
  if (!transactions.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted">No transactions match these filters.</p>
        <p className="mt-1 text-xs text-faint">Add one above, or widen your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-faint">
            <th className="py-2 pr-4 font-medium">Transaction</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 text-right font-medium">Amount</th>
            <th className="py-2 pr-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-border last:border-0">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge category={t.category} size="sm" />
                  <div>
                    <p className="font-medium text-ink">{t.title}</p>
                    {t.description && <p className="text-xs text-faint">{t.description}</p>}
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4">
                <CategoryPill category={t.category} />
              </td>
              <td className="num py-3 pr-4 text-xs text-muted">{t.transactionDate || '—'}</td>
              <td className={`num py-3 pr-4 text-right font-medium ${t.type === 'INCOME' ? 'text-brand' : 'text-rose'}`}>
                {t.type === 'INCOME' ? '+' : '−'}{formatCurrency(Math.abs(t.amount))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
