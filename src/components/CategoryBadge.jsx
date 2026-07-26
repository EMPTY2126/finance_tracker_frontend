import CategoryIcon from './CategoryIcon.jsx'
import { CATEGORY_META } from '../constants'

// Tailwind needs full class strings to detect them at build time, so this
// maps each color key to its complete bg/text classes rather than
// interpolating `bg-${color}-soft` (which the JIT compiler can't see).
const STYLES = {
  brand: 'bg-brand-soft text-brand',
  violet: 'bg-violet-soft text-violet',
  amber: 'bg-amber-soft text-amber',
  sky: 'bg-sky-soft text-sky',
  pink: 'bg-pink-soft text-pink',
  rose: 'bg-rose-soft text-rose',
  slate: 'bg-slate-100 text-slate-500',
}

export default function CategoryBadge({ category, size = 'md' }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.OTHER
  const dims = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  return (
    <span className={`inline-flex ${dims} shrink-0 items-center justify-center rounded-lg ${STYLES[meta.color]}`}>
      <CategoryIcon category={category} className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </span>
  )
}

export { STYLES as CATEGORY_BADGE_STYLES }
