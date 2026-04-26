// API service layer — replace BASE_URL and endpoints with your real backend
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const AI_URL   = import.meta.env.VITE_AI_URL  || 'http://localhost:5000/ai'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Intercept for auth token (add when backend ready)
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('sandy_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ── Projects ──────────────────────────────────────────────────────────────────
export const ProjectsAPI = {
  list:   ()       => api.get('/projects'),
  get:    id       => api.get(`/projects/${id}`),
  create: data     => api.post('/projects', data),
  update: (id, d)  => api.put(`/projects/${id}`, d),
  delete: id       => api.delete(`/projects/${id}`),
}

// ── Experiments ───────────────────────────────────────────────────────────────
export const ExperimentsAPI = {
  list:   ()       => api.get('/experiments'),
  get:    id       => api.get(`/experiments/${id}`),
  create: data     => api.post('/experiments', data),
  update: (id, d)  => api.put(`/experiments/${id}`, d),
}

// ── Inventory ─────────────────────────────────────────────────────────────────
export const InventoryAPI = {
  list:   ()       => api.get('/inventory'),
  update: (id, d)  => api.put(`/inventory/${id}`, d),
  create: data     => api.post('/inventory', data),
  delete: id       => api.delete(`/inventory/${id}`),
}

// ── AI Chat ───────────────────────────────────────────────────────────────────
export const ChatAPI = {
  send: (message, history = []) =>
    axios.post(`${AI_URL}/chat`, { message, history }),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const AdminAPI = {
  systemStatus: () => api.get('/admin/status'),
  logs:         () => api.get('/admin/logs'),
  analytics:    () => api.get('/admin/analytics'),
  clearLogs:    () => api.delete('/admin/logs'),
}

export default api
