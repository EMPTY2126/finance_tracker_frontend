import client from './client'

// Strips undefined/null/'' values so we don't send empty filter params.
function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

export async function getTransactions(filters = {}) {
  const res = await client.get('/transactions', { params: cleanParams(filters) })
  return res.data // Spring Page<TransactionResponse>
}

export async function createTransaction(payload) {
  const res = await client.post('/transactions', payload)
  return res.data
}

export async function updateTransaction(id, payload) {
  const res = await client.put(`/transactions/${id}`, payload)
  return res.data
}

export async function deleteTransaction(id) {
  const res = await client.delete(`/transactions/${id}`)
  return res.data
}

export async function bulkAddTransactions(payloads) {
  const res = await client.post('/transactions/bulk', payloads)
  return res.data
}
