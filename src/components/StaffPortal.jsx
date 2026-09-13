import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiLogIn, FiUserPlus, FiArrowRight, FiLogOut } from 'react-icons/fi'
import useStore from '../store/useStore'

const occupations = ['Receptionist', 'Doctor', 'Nurse', 'Technician', 'Manager']

const roleOptions = [
  {
    role: 'receptionist', occupation: 'Receptionist', icon: '🖥️',
    title: 'Receptionist Dashboard',
    desc: 'Waiting list in queue order, patient search by Registration ID, and queue management.',
    page: 'reception',
  },
  {
    role: 'doctor', occupation: 'Doctor', icon: '👨‍⚕️',
    title: 'Doctor Dashboard',
    desc: 'Patient records, current encounter, medical reports, prescriptions, notes & timeline.',
    page: 'doctor',
  },
]

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'block', fontSize: '0.8rem', color: 'var(--teal-300)',
      fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>{label}</label>
    {children}
  </div>
)

export default function StaffPortal() {
  const staff = useStore((s) => s.staff)
  const loginStaff = useStore((s) => s.loginStaff)
  const setRole = useStore((s) => s.setRole)
  const logout = useStore((s) => s.logout)
  const setCurrentPage = useStore((s) => s.setCurrentPage)

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', staffId: '', occupation: 'Receptionist', password: '' })
  const [error, setError] = useState('')

  const update = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.staffId.trim() || !form.password) {
      setError('Please fill in Staff Name, Staff ID and Password.')
      return
    }
    setError('')
    loginStaff({ name: form.name.trim(), staffId: form.staffId.trim(), occupation: form.occupation })
  }

  // Logged in → role-based dashboard chooser
  if (staff) {
    return (
      <section style={{ padding: 'var(--section-padding)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">🔐 STAFF PORTAL</div>
            <h2 className="section-title">Welcome, {staff.name}</h2>
            <p className="section-subtitle">{staff.staffId} • {staff.occupation} — choose your workspace</p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16, maxWidth: 760, margin: '0 auto',
          }}>
            {roleOptions.filter((o) => o.occupation === staff.occupation).map((o, i) => {
              const matched = true
              return (
                <motion.div
                  key={o.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-card glow-border"
                  style={{
                    padding: 28, cursor: 'pointer',
                    borderColor: matched ? 'rgba(14,165,160,0.5)' : 'rgba(255,255,255,0.06)',
                    boxShadow: matched ? '0 0 30px rgba(14,165,160,0.15)' : 'none',
                  }}
                  onClick={() => { setRole(o.role); setCurrentPage(o.page) }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{o.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: 8 }}>{o.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>{o.desc}</p>
                  {matched && (
                    <div className="badge badge-teal" style={{ marginTop: 12, display: 'inline-block' }}>
                      ● MATCHES YOUR OCCUPATION
                    </div>
                  )}
                  <button className="btn-primary glow-border next-pulse" style={{
                    marginTop: 20, width: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span>Open <FiArrowRight size={14} /></span>
                  </button>
                </motion.div>
              )
            })}
            {roleOptions.every((o) => o.occupation !== staff.occupation) && (
              <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>🔒</div>
                <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: 8 }}>
                  No workspace assigned for “{staff.occupation}”
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                  Only Receptionist and Doctor occupations have dashboards in this prototype.
                </p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button className="btn-secondary" onClick={logout} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Not logged in → login / register
  return (
    <section style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🔐 STAFF PORTAL</div>
          <h2 className="section-title">Staff Login</h2>
          <p className="section-subtitle">Receptionist and Doctor access — dashboards differ by role</p>
        </div>

        <div className="glass-strong holo-shimmer" style={{ maxWidth: 460, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px)' }}>
          {/* Mode switch */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button
              className={mode === 'login' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setMode('login')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <FiLogIn size={14} /> Login
            </button>
            <button
              className={mode === 'register' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setMode('register')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <FiUserPlus size={14} /> Register
            </button>
          </div>

          <form onSubmit={submit}>
            <Field label="Staff Name">
              <input className="input-field" value={form.name}
                onChange={(e) => update('name')(e.target.value)}
                placeholder="e.g. Dr. Ananya Rao" />
            </Field>
            <Field label="Staff ID">
              <input className="input-field" value={form.staffId}
                onChange={(e) => update('staffId')(e.target.value)}
                placeholder="e.g. MK-STF-0042" />
            </Field>
            <Field label="Staff Occupation">
              <select className="input-field" value={form.occupation}
                onChange={(e) => update('occupation')(e.target.value)}>
                {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Password">
              <input className="input-field" type="password" value={form.password}
                onChange={(e) => update('password')(e.target.value)}
                placeholder="••••••••" />
            </Field>

            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>
            )}

            <button type="submit" className="btn-primary glow-border next-pulse" style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span>{mode === 'login' ? 'Login' : 'Create Staff Account'} <FiArrowRight size={14} /></span>
            </button>
          </form>

          <p style={{
            fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 16,
            textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
          }}>
            DEMO MODE — ANY CREDENTIALS WORK
          </p>
        </div>
      </div>
    </section>
  )
}
