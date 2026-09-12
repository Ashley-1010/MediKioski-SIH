import React from 'react'
import { motion } from 'framer-motion'

const roles = [
  { name: 'Patient', icon: '🧑', color: '#3b82f6', perms: ['Register', 'Own Records', 'Consent'] },
  { name: 'Receptionist', icon: '🖥️', color: '#0ea5a0', perms: ['Search', 'Check-in', 'Queue Management'] },
  { name: 'Doctor', icon: '👨‍⚕️', color: '#8b5cf6', perms: ['Clinical Records', 'AI Summary', 'Approval'] },
  { name: 'Ayurvedic Doctor', icon: '🌿', color: '#10b981', perms: ['Clinical + Ayurveda', 'Prakriti/Vikriti', 'Treatment Plan'] },
  { name: 'Admin', icon: '⚙️', color: '#f59e0b', perms: ['User Management', 'Audit Logs', 'System Settings'] },
]

const modules = [
  { name: 'Registration', color: '#3b82f6' },
  { name: 'Case-Taking', color: '#0ea5a0' },
  { name: 'Documents', color: '#8b5cf6' },
  { name: 'AI Summary', color: '#f59e0b' },
  { name: 'Doctor Review', color: '#10b981' },
  { name: 'Admin Panel', color: '#ef4444' },
]

const access = [
  [1, 1, 0, 0, 0, 0], // Patient
  [1, 0, 1, 0, 0, 1], // Receptionist
  [1, 1, 1, 1, 1, 0], // Doctor
  [1, 1, 1, 1, 1, 0], // Ayurvedic
  [1, 1, 1, 1, 1, 1], // Admin
]

export default function RBACSection() {
  return (
    <section style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🔐 ACCESS CONTROL</div>
          <h2 className="section-title">Role-Based Access Control</h2>
          <p className="section-subtitle">
            Secure, role-based module access ensuring the right people see the right information
          </p>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {roles.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card"
              style={{ textAlign: 'center', borderColor: `${r.color}20` }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{r.icon}</div>
              <h4 style={{ fontFamily: 'var(--font-primary)', color: r.color, marginBottom: 8 }}>{r.name}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {r.perms.map((p, j) => (
                  <span key={j} className="badge" style={{
                    background: `${r.color}10`, color: `${r.color}cc`,
                    border: `1px solid ${r.color}20`, justifyContent: 'center',
                  }}>{p}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Access Matrix */}
        <div className="glass-strong" style={{ padding: 24, overflowX: 'auto' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', marginBottom: 16, textAlign: 'center' }}>
            ACCESS MATRIX — Registration ID ≠ Authentication
          </div>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4 }}>
            <thead>
              <tr>
                <th style={{ padding: 8, fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>ROLE</th>
                {modules.map((m, i) => (
                  <th key={i} style={{ padding: 8, fontSize: '0.65rem', color: m.color, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((r, ri) => (
                <tr key={ri}>
                  <td style={{ padding: 8, fontSize: '0.8rem', color: r.color, fontWeight: 500 }}>
                    {r.icon} {r.name}
                  </td>
                  {access[ri].map((a, ci) => (
                    <td key={ci} style={{ padding: 8, textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', width: 24, height: 24, borderRadius: 6,
                        background: a ? `${modules[ci].color}20` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${a ? `${modules[ci].color}40` : 'rgba(255,255,255,0.05)'}`,
                        color: a ? modules[ci].color : 'var(--gray-700)',
                        fontSize: '0.75rem', lineHeight: '22px',
                      }}>
                        {a ? '✓' : '—'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
