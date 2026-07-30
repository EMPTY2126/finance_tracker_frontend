import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import * as txApi from "../api/transactions";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import TransactionFilterBar from "../components/TransactionFilterBar.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 0, size: 10 });
  const [pageData, setPageData] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [presetType, setPresetType] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Arrives from the dashboard's "Add Income" / "Add Expense" quick actions.
  useEffect(() => {
    if (location.state?.openAdd) {
      setShowAdd(true);
      setPresetType(location.state.presetType || null);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await txApi.getTransactions(filters);
      setPageData(res);
    } catch (err) {
      setError(err.message || "Could not load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function handleAdd(payload) {
    await txApi.createTransaction(payload);
    setShowAdd(false);
    setPresetType(null);
    load();
  }

  async function handleUpdate(payload) {
    await txApi.updateTransaction(editing.id, payload);
    setEditing(null);
    load();
  }

  // async function handleDelete(t) {
  //   if (!confirm(`Delete "${t.title}"? This can't be undone.`)) return
  //   try {
  //     await txApi.deleteTransaction(t.id)
  //     load()
  //   } catch (err) {
  //     setError(err.message || 'Could not delete transaction')
  //   }
  // }

  async function handleDelete() {
    if (!deleteItem) return;

    setDeleting(true);

    try {
      await txApi.deleteTransaction(deleteItem.id);
      setDeleteItem(null);
      load();
    } catch (err) {
      setError(err.message || "Could not delete transaction");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Transactions</h1>
          <p className="mt-1 text-sm text-muted">
            Every entry, filterable and editable.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAdd((s) => !s);
            setEditing(null);
            setPresetType(null);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-bright"
        >
          <Plus className="h-4 w-4" /> {showAdd ? "Close" : "New transaction"}
        </button>
      </div>

      {showAdd && (
        <div className="mb-6">
          <TransactionForm
            initial={presetType ? { type: presetType } : undefined}
            onSubmit={handleAdd}
            onCancel={() => {
              setShowAdd(false);
              setPresetType(null);
            }}
          />
        </div>
      )}

      {editing && (
        <div className="mb-6">
          <TransactionForm
            initial={editing}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className="mb-5">
        <TransactionFilterBar filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-rose/30 bg-rose-soft px-4 py-3 text-sm text-rose">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted">Loading…</p>
        ) : (
          <>
            <TransactionTable
              transactions={pageData.content || []}
              onEdit={(t) => {
                setEditing(t);
                setShowAdd(false);
              }}
              onDelete={(t) => setDeleteItem(t)}
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
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-ink">
              Delete Transaction
            </h2>

            <p className="mt-2 text-sm text-muted">
              Are you sure you want to delete
              <span className="font-semibold"> "{deleteItem.title}"</span>?
            </p>

            <p className="mt-1 text-xs text-rose">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteItem(null)}
                disabled={deleting}
                className="rounded-lg border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-rose px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
