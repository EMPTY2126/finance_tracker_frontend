import axios from 'axios'

// In dev, Vite proxies /api -> http://localhost:8080 (see vite.config.js),
// so the browser treats requests as same-origin and the httpOnly "jwt"
// cookie set by the backend on /auth/login is sent automatically.
// In production, point this at your deployed backend and make sure the
// backend's CORS config allows credentials from your frontend's origin.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const client = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalizes the backend's ErrorBody { status, error, msg } into a plain
// message string so components don't need to know the shape.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data
    const message =
      (typeof data === 'string' && data) ||
      data?.msg ||
      data?.error ||
      err.message ||
      'Something went wrong'
    return Promise.reject({ ...err, message })
  },
)

export default client
