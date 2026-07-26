import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Download, Plus } from 'lucide-react'
import * as txApi from '../api/transactions'
import TransactionForm from '../components/TransactionForm.jsx'
import TransactionTableExport from '../components/TransactionTableExport.jsx'
import TransactionFilterBar from '../components/TransactionFilterBar.jsx'
import Pagination from '../components/Pagination.jsx'
import { downloadExcel } from "../api/reports";

export default function Transactions() {
  const location = useLocation()
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ page: 0, size: 10 })
  const [pageData, setPageData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [presetType, setPresetType] = useState(null)


  useEffect(() => {
    if (location.state?.openAdd) {
      setPresetType(location.state.presetType || null)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await txApi.getTransactions(filters)
      setPageData(res)
    } catch (err) {
      setError(err.message || 'Could not load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [filters])

  async function downloadReport() {
    try {
        const blob = await downloadExcel(filters);

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "Transactions.xlsx";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (err) {
        console.error(err);
    }
}

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Transactions</h1>
          <p className="mt-1 text-sm text-muted">Every entry, filterable and editable.</p>
        </div>
        <button
          onClick={() => { downloadReport(filters) }}
          className="flex items-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-bright"
        >
          <Download className="h-4 w-4" /> {'Download'}
        </button>
      </div>

      <div className="mb-5">
        <TransactionFilterBar filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-rose/30 bg-rose-soft px-4 py-3 text-sm text-rose">{error}</p>
      )}

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted">Loading…</p>
        ) : (
          <>
            <TransactionTableExport
              transactions={pageData.content || []}
            />
            <div className="mt-4">
              <Pagination
                page={filters.page}
                totalPages={pageData.totalPages || 0}
                onChange={(page) => setFilters((f) => ({ ...f, page }))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
