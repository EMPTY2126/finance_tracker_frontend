import client from './client'

export async function getDashboard(month, year) {
  const params = {}
  if (month) params.month = month
  if (year) params.year = year
  const res = await client.get('/dashboard', { params })
  return res.data
}
