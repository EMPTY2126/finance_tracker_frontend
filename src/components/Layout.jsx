import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid, ArrowLeftRight, PlusCircle, PiggyBank, BarChart3,
  Tags, User, Settings, LogOut, Menu, X, Search, Bell, ChevronDown, Leaf,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to : "/reports", label : 'Reports', icon: BarChart3}
]

const COMING_SOON = [
  // { label: 'Reports', icon: BarChart3 },
]

function SidebarContent({ email, logout, onNavigate }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 px-5 py-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <Leaf className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold text-white">FinanceTracker</span>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand/15 text-brand-bright'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
          {COMING_SOON.map(({ label, icon: Icon }) => (
            <span
              key={label}
              title="Coming soon"
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {label}
            </span>
          ))}
        </nav>
      </div>

      <div className="border-t border-nav-border px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
            {email ? email[0].toUpperCase() : 'U'}
          </span>
          <span className="truncate text-sm text-slate-300">{email}</span>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Layout({ children }) {
  const { email, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-app">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-nav lg:block">
        <SidebarContent email={email} logout={logout} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-nav">
            <div className="flex justify-end px-3 pt-3">
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent email={email} logout={logout} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-muted hover:bg-app lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* <div className="hidden flex-1 items-center gap-2 rounded-lg border border-border bg-app px-3 py-2 text-sm text-faint sm:flex sm:max-w-xs">
            <Search className="h-4 w-4" />
            <span>Search transactions…</span>
          </div> */}

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            {/* <button className="relative rounded-lg p-2 text-muted hover:bg-app">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose" />
            </button> */}
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand">
                {email ? email[0].toUpperCase() : 'U'}
              </span>
              <span className="hidden text-sm font-medium text-ink sm:inline">{email}</span>
              <ChevronDown className="hidden h-4 w-4 text-faint sm:inline" />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
