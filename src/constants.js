export const CATEGORIES = [
  'SALARY',
  'FREELANCE',
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'HEALTH',
  'EDUCATION',
  'INVESTMENT',
  'OTHER',
]

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE']

export const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
]

// Tailwind color family + chart hex per category, used for pills, icon
// badges, table rows, and chart series so the same category always reads
// the same color everywhere in the app.
export const CATEGORY_META = {
  SALARY: { color: 'brand', hex: '#16A34A' },
  FREELANCE: { color: 'violet', hex: '#7C3AED' },
  FOOD: { color: 'amber', hex: '#F59E0B' },
  TRAVEL: { color: 'sky', hex: '#38BDF8' },
  SHOPPING: { color: 'pink', hex: '#EC4899' },
  BILLS: { color: 'rose', hex: '#F43F5E' },
  ENTERTAINMENT: { color: 'violet', hex: '#8B5CF6' },
  HEALTH: { color: 'rose', hex: '#E11D48' },
  EDUCATION: { color: 'sky', hex: '#0284C7' },
  INVESTMENT: { color: 'brand', hex: '#22C55E' },
  OTHER: { color: 'slate', hex: '#94A3B8' },
}

export function monthLabel(monthName) {
  if (!monthName) return ''
  return MONTHS[monthName-1]
}

export function formatCurrency(value) {
  const n = Number(value ?? 0)
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
}

export function categoryLabel(cat) {
  if (typeof cat !== "string") return "";
  return cat.charAt(0) + cat.slice(1).toLowerCase().replace(/_/g, " ");
}
