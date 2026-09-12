const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const token = localStorage.getItem('medikiosk_token')
  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) throw new Error(data?.detail || data?.message || `Request failed (${res.status})`)
  return data
}

export async function demoLogin(role = 'doctor') {
  const data = await request('/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ role })
  })
  if (data?.access_token) localStorage.setItem('medikiosk_token', data.access_token)
  return data
}

export const api = {
  register: (payload) => request('/registrations', { method: 'POST', body: JSON.stringify(payload) }),
  getRegistration: (id) => request(`/registrations/${encodeURIComponent(id)}`),
  checkIn: (id) => request(`/registrations/${encodeURIComponent(id)}/check-in`, { method: 'POST' }),
  todayPatients: () => request('/doctor/patients/today'),
  encounter: (id) => request(`/encounters/${id}/record`),
  generateSummary: (encounterId) => request('/summary/generate', { method: 'POST', body: JSON.stringify({ encounter_id: encounterId }) }),
  uploadDocuments: (encounterId, files) => {
    const form = new FormData()
    form.append('encounter_id', encounterId)
    files.forEach(f => form.append('files', f))
    return request('/documents/upload', { method: 'POST', body: form })
  }
}
export default api
