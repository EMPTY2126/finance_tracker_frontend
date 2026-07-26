import { categoryLabel, CATEGORY_META } from '../constants'

const STYLES = {
  brand: 'bg-brand-soft text-brand',
  violet: 'bg-violet-soft text-violet',
  amber: 'bg-amber-soft text-amber',
  sky: 'bg-sky-soft text-sky',
  pink: 'bg-pink-soft text-pink',
  rose: 'bg-rose-soft text-rose',
  slate: 'bg-slate-100 text-slate-500',
}

export default function CategoryPill({ category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.OTHER
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[meta.color]}`}>
      {categoryLabel(category)}
    </span>
  )
}
