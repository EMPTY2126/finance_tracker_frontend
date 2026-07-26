import client from './client'

// Login only requires email + password — the backend authenticates against
// the email field regardless of what's sent as userName.
export async function login(email, password) {
  const res = await client.post('/auth/login', { email, password })
  // The backend returns a raw string: "Login Successful <token>" or
  // "Login Faild" (sic) — it's not JSON. The actual session lives in the
  // httpOnly cookie the response also sets, so we just check the text.
  const text = String(res.data ?? '')
  if (!text.toLowerCase().startsWith('login successful')) {
    throw new Error('Invalid email or password')
  }
  return text
}

export async function register(userName, email, password) {
  const res = await client.post('/auth/register', { userName, email, password })
  return res.data // UserResponse: { userName, email, createdAt }
}

// There's no /auth/me or /auth/logout endpoint on the backend yet, so we
// probe a protected route to check session validity, and treat "logout" as
// clearing local state only (the cookie itself will expire on its own).
// See README.md for a small backend addition that makes logout immediate.
export async function checkSession() {
  await client.get('/test/gettest')
  return true
}
