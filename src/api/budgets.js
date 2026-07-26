import client from './client'

function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}

export async function getBudgets(filters = {}) {
  const res = await client.get('/budgets', { params: cleanParams(filters) })
  return res.data // Spring Page<BudgetResponse>
}

export async function createBudget(payload) {
  const res = await client.post('/budgets', payload)
  return res.data
}

export async function updateBudget(id, payload) {
  const res = await client.put(`/budgets/${id}`, payload)
  return res.data
}

export async function deleteBudget(id) {
  const res = await client.delete(`/budgets/${id}`)
  return res.data
}

export async function bulkAddBudgets(payloads) {
  const res = await client.post('/budgets/bulk', payloads)
  return res.data
}
