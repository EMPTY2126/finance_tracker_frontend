import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Wallet, Calendar, ArrowRight,
  PlusCircle, MinusCircle, Target, FileBarChart,
} from 'lucide-react'
import { getDashboard } from '../api/dashboard'
import { formatCurrency, categoryLabel, monthLabel, CATEGORY_META } from '../constants'
import { useAuth } from '../context/AuthContext.jsx'
import StatCard from '../components/StatCard.jsx'
import BudgetRing from '../components/BudgetRing.jsx'
import CategoryBadge from '../components/CategoryBadge.jsx'
import TypePill from '../components/TypePill.jsx'

const now = new Date()

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E7E9F1',
  borderRadius: 8,
  fontSize: 12,
  color: '#0F172A',
  boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
}

export default function Dashboard() {
  const { email } = useAuth()
  const navigate = useNavigate()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const displayName = email ? email.split('@')[0].replace(/[._]/g, ' ') : 'there'
  const capitalizedName = displayName.replace(/\b\w/g, (c) => c.toUpperCase())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getDashboard(month, year)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message || 'Could not load dashboard'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [month, year])

  const categoryExpenses = data?.categoryExpenses || []
  const categoryBudgets = data?.categoryBudgets || []
  const summary = data?.dashboardSummary
  const recentTransactions = data?.transactions?.content || []

  const donutData = useMemo(
    () => categoryExpenses.map((e) => ({
      name: categoryLabel(e.category),
      category: e.category,
      value: Number(e.amount),
      color: (CATEGORY_META[e.category] || CATEGORY_META.OTHER).hex,
    })),
    [categoryExpenses],
  )
  const totalExpense = Number(summary?.totalExpense ?? 0)
  const totalIncome = Number(summary?.totalIncome ?? 0)
  const totalBudget = Number(summary?.totalBudget ?? 0)
  const balance = totalIncome - totalExpense
  const budgetUsedPct = totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0

  const trendData = useMemo(() => {
    if (!data) return []
    return (data.monthlyTrends || []).map((t) => ({
      monthNum: new Date(`${monthLabel(t.month)} 1, 2000`).getMonth() + 1,
      month: monthLabel(t.month).slice(0, 3),
      income: Number(t.income),
      expense: Number(t.expense),
    }))
  }, [data])

  const deltas = useMemo(() => {
    const current = trendData.find((t) => t.monthNum === month)
    const prev = trendData.find((t) => t.monthNum === month - 1)
    if (!current || !prev) return {}
    const pct = (curr, before) => (before > 0 ? ((curr - before) / before) * 100 : undefined)
    return {
      income: pct(current.income, prev.income),
      expense: pct(current.expense, prev.expense),
      balance: pct(current.income - current.expense, prev.income - prev.expense),
    }
  }, [trendData, month])

  const budgetStatus = useMemo(() => {
    const expenseMap = Object.fromEntries(categoryExpenses.map((e) => [e.category, Number(e.amount)]))
    return categoryBudgets.map((b) => {
      const spent = expenseMap[b.category] || 0
      const limit = Number(b.monthlyLimit)
      const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0
      return { category: b.category, spent, limit, pct }
    })
  }, [categoryBudgets, categoryExpenses])

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  const yearOptions = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 3 + i)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Welcome back, {capitalizedName}! 👋</h1>
          <p className="mt-1 text-sm text-muted">Here's what's happening with your finances today.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-card">
          <Calendar className="h-4 w-4 text-faint" />
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-transparent text-sm font-medium text-ink focus:outline-none"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="num bg-transparent text-sm font-medium text-ink focus:outline-none"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-rose/30 bg-rose-soft px-4 py-3 text-sm text-rose">{error}</p>
      )}

      {loading && !data ? (
        <p className="text-sm text-muted">Loading dashboard…</p>
      ) : data ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Income" value={totalIncome} icon={TrendingUp} tone="brand" delta={deltas.income} />
            <StatCard label="Total Expenses" value={totalExpense} icon={TrendingDown} tone="rose" delta={deltas.expense} />
            <StatCard label="Current Balance" value={balance} icon={Wallet} tone="sky" delta={deltas.balance} />

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted">Monthly Budget</p>
                  <p className="num mt-3 text-2xl font-semibold text-ink">{formatCurrency(totalBudget)}</p>
                </div>
                <BudgetRing percent={budgetUsedPct} />
              </div>
              <p className="mt-2 text-xs text-faint">{formatCurrency(totalExpense)} spent this month</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <p className="mb-4 font-semibold text-ink">Expense Overview</p>
              {donutData.length ? (
                <div className="flex items-center gap-4">
                  <div className="relative h-40 w-40 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={2}>
                          {donutData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="num text-base font-semibold text-ink">{formatCurrency(totalExpense)}</span>
                      <span className="text-[11px] text-faint">Total</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {donutData.map((d) => (
                      <div key={d.category} className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1.5 truncate text-muted">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.color }} />
                          <span className="truncate">{d.name}</span>
                        </span>
                        <span className="num shrink-0 font-medium text-ink">
                          {totalExpense > 0 ? ((d.value / totalExpense) * 100).toFixed(1) : '0'}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="py-14 text-center text-sm text-faint">No expenses recorded this month.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <p className="mb-4 font-semibold text-ink">Monthly Trend</p>
              {trendData.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData} margin={{ left: -18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E9F1" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#E7E9F1' }} tickLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#64748B' }} />
                    <Line type="monotone" dataKey="income" name="Income" stroke="#16A34A" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="expense" name="Expenses" stroke="#F43F5E" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-14 text-center text-sm text-faint">No trend data yet for {year}.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <p className="mb-4 font-semibold text-ink">Budget Status</p>
              {budgetStatus.length ? (
                <div className="space-y-4">
                  {budgetStatus.map((b) => (
                    <div key={b.category}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-ink">{categoryLabel(b.category)}</span>
                        <span className="num text-faint">
                          {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${b.pct >= 90 ? 'bg-rose' : b.pct >= 70 ? 'bg-amber' : 'bg-brand'}`}
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/budgets')}
                    className="flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-bright"
                  >
                    View all budgets <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <p className="py-14 text-center text-sm text-faint">No budgets set for this month.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-ink">Recent Transactions</p>
                <button
                  onClick={() => navigate('/transactions')}
                  className="text-xs font-medium text-brand hover:text-brand-bright"
                >
                  View All
                </button>
              </div>
              {recentTransactions.length ? (
                <div className="-mx-5 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <tbody>
                      {recentTransactions.map((t) => (
                        <tr key={t.id} className="border-b border-border last:border-0">
                          <td className="py-3 pl-5">
                            <div className="flex items-center gap-3">
                              <CategoryBadge category={t.category} size="sm" />
                              <div>
                                <p className="font-medium text-ink">{t.title}</p>
                                <p className="num text-xs text-faint">{t.transactionDate}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-5 text-right">
                            <span className={`num font-medium ${t.type === 'INCOME' ? 'text-brand' : 'text-rose'}`}>
                              {t.type === 'INCOME' ? '+' : '−'}{formatCurrency(Math.abs(t.amount))}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-faint">Nothing recorded for this period yet.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <p className="mb-4 font-semibold text-ink">Quick Actions</p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/transactions', { state: { openAdd: true, presetType: 'INCOME' } })}
                  className="flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-ink hover:border-brand hover:bg-brand-soft/40"
                >
                  <PlusCircle className="h-4 w-4 text-brand" /> Add Income
                </button>
                <button
                  onClick={() => navigate('/transactions', { state: { openAdd: true, presetType: 'EXPENSE' } })}
                  className="flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-ink hover:border-rose hover:bg-rose-soft/40"
                >
                  <MinusCircle className="h-4 w-4 text-rose" /> Add Expense
                </button>
                <button
                  onClick={() => navigate('/budgets', { state: { openAdd: true } })}
                  className="flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-ink hover:border-violet hover:bg-violet-soft/40"
                >
                  <Target className="h-4 w-4 text-violet" /> Set Budget
                </button>
                <button
                  onClick={() => navigate('/reports', { state: { openAdd: true } })}
                  title="Coming soon"
                  className="flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium  hover:border-orange-400 hover:bg-violet-soft/40"
                >
                  <FileBarChart className="h-4 w-4 text-orange-400" /> Generate Report
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
