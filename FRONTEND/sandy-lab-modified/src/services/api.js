import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Auto-attach token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('sandy_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('sandy_refresh')
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh })
          localStorage.setItem('sandy_token', data.data.accessToken)
          err.config.headers.Authorization = `Bearer ${data.data.accessToken}`
          return axios(err.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const AuthAPI = {
  register: data  => api.post('/auth/register', data),
  login:    data  => api.post('/auth/login', data),
  refresh:  token => api.post('/auth/refresh', { refreshToken: token }),
  profile:  ()    => api.get('/auth/profile'),
}

// ── Projects ──────────────────────────────────────────────────────────────────
export const ProjectsAPI = {
  list:               ()        => api.get('/projects'),
  get:                id        => api.get(`/projects/${id}`),
  create:             data      => api.post('/projects', data),
  update:             (id, d)   => api.put(`/projects/${id}`, d),
  delete:             id        => api.delete(`/projects/${id}`),
  getRequirements:    id        => api.get(`/projects/${id}/requirements`),
  addRequirement:     (id, d)   => api.post(`/projects/${id}/requirements`, d),
  removeRequirement:  (id, rid) => api.delete(`/projects/${id}/requirements/${rid}`),
}

// ── Inventory ─────────────────────────────────────────────────────────────────
export const InventoryAPI = {
  list:            ()       => api.get('/inventory'),
  get:             id       => api.get(`/inventory/${id}`),
  create:          data     => api.post('/inventory', data),
  delete:          id       => api.delete(`/inventory/${id}`),
  adjust:          (id, d)  => api.patch(`/inventory/${id}/adjust`, d),
  history:         id       => api.get(`/inventory/${id}/history`),
  transactions:    id       => api.get(`/inventory/${id}/transactions`),
  addTransaction:  (id, d)  => api.post(`/inventory/${id}/transactions`, d),
  lowStock:        ()       => api.get('/inventory/low-stock'),
}

// ── Experiments ───────────────────────────────────────────────────────────────
export const ExperimentsAPI = {
  list:         ()       => api.get('/logs/experiments'),
  get:          id       => api.get(`/logs/experiments/${id}`),
  create:       data     => api.post('/logs/experiments', data),
  updateStatus: (id, d)  => api.patch(`/logs/experiments/${id}/status`, d),
  delete:       id       => api.delete(`/logs/experiments/${id}`),
}

// ── AI ────────────────────────────────────────────────────────────────────────
export const ChatAPI = {
  research:     data => api.post('/ai/research', data),
  analyze:      data => api.post('/ai/analyze', data),
  generateTask: data => api.post('/ai/generate-task', data),
  logs:         ()   => api.get('/ai/logs'),
}

// ── Agent Tasks ───────────────────────────────────────────────────────────────
export const AgentAPI = {
  run:    data => api.post('/logs/agent/run', data),
  list:   ()   => api.get('/logs/agent'),
  getOne: id   => api.get(`/logs/agent/${id}`),
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const NotificationsAPI = {
  list:       () => api.get('/logs/notifications'),
  markRead:   id => api.patch(`/logs/notifications/${id}/read`),
  markAllRead:() => api.patch('/logs/notifications/read-all'),
  delete:     id => api.delete(`/logs/notifications/${id}`),
}

export default api
