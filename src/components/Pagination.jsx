export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="text-xs font-medium text-muted hover:text-ink disabled:opacity-30"
      >
        ← Previous
      </button>
      <span className="num text-xs text-faint">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className="text-xs font-medium text-muted hover:text-ink disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  )
}
