export default function TypePill({ type }) {
  const isIncome = type === 'INCOME'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        isIncome ? 'bg-brand-soft text-brand' : 'bg-rose-soft text-rose'
      }`}
    >
      {isIncome ? 'Income' : 'Expense'}
    </span>
  )
}
