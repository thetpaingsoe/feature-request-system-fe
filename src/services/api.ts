// services/api.js
import axios from 'axios'

const baseURL =
  import.meta.env.VITE_APP_ENV == 'production'
    ? import.meta.env.VITE_API_URL
    : 'http://127.0.0.1:8000/api'
console.log(baseURL);
const api = axios.create({
  baseURL: baseURL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Optional: Add auth token automatically if using login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
