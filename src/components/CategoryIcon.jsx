import {
  Wallet, Briefcase, UtensilsCrossed, Plane, ShoppingBag,
  Receipt, Film, HeartPulse, GraduationCap, TrendingUp, MoreHorizontal,
} from 'lucide-react'

const ICONS = {
  SALARY: Wallet,
  FREELANCE: Briefcase,
  FOOD: UtensilsCrossed,
  TRAVEL: Plane,
  SHOPPING: ShoppingBag,
  BILLS: Receipt,
  ENTERTAINMENT: Film,
  HEALTH: HeartPulse,
  EDUCATION: GraduationCap,
  INVESTMENT: TrendingUp,
  OTHER: MoreHorizontal,
}

export default function CategoryIcon({ category, className = 'h-4 w-4' }) {
  const Icon = ICONS[category] || MoreHorizontal
  return <Icon className={className} strokeWidth={2} />
}
