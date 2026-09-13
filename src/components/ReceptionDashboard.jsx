import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiUserCheck, FiClock, FiCheckCircle, FiActivity, FiArrowRight, FiLogOut } from 'react-icons/fi'
import useStore from '../store/useStore'
import { useCountUp } from '../hooks/useScrollAnimations'

const statusColors = {
  'registered': { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'Registered' },
  'waiting': { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: 'Waiting' },
  'checked-in': { bg: 'rgba(14,165,160,0.15)', color: '#3de8d8', label: 'Checked In' },
  'in-consultation': { bg: 'rgba(139,92,246,0.15)', color: '#c4b5fd', label: 'In Consultation' },
  'completed': { bg: 'rgba(16,185,129,0.15)', color: '#34d399', label: 'Completed' },
}

// Permitted fields only — no doctor notes, prescriptions or internal clinical data
function StatCard({ stat, index }) {
  const [ref, count] = useCountUp(stat.count, 1200 + index * 200)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="glass-card"
      style={{ textAlign: 'center', padding: 20, borderColor: `${stat.color}20`, position: 'relative', overflow: 'hidden' }}
    >
      {/* Glow ring */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 80, height: 80, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: `1px solid ${stat.color}15`,
        animation: `glow-ring-expand 4s ease-in-out infinite`,
        animationDelay: `${index * 0.5}s`,
        pointerEvents: 'none',
      }} />
      <motion.div
        animate={{ color: [stat.color, `${stat.color}cc`, stat.color] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        style={{ marginBottom: 8 }}
      >
        {stat.icon}
      </motion.div>
      <div style={{
        fontFamily: 'var(--font-primary)', fontSize: '2rem', fontWeight: 800,
        color: stat.color, lineHeight: 1,
      }}>{count}</div>
      <div style={{
        fontSize: '0.75rem', color: 'var(--gray-400)',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
        marginTop: 4,
      }}>{stat.label.toUpperCase()}</div>
    </motion.div>
  )
}

export default function ReceptionDashboard() {
  const staff = useStore((s) => s.staff)
  const patients = useStore((s) => s.patients)
  const advanceStatus = useStore((s) => s.advanceStatus)
  const callNext = useStore((s) => s.callNext)
  const setCurrentPage = useStore((s) => s.setCurrentPage)

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const inQueue = patients.filter((p) => ['registered', 'waiting', 'checked-in'].includes(p.status))
  const flowStats = [
    { label: 'Registered', count: patients.filter((p) => p.status === 'registered').length, icon: <FiUserCheck size={20} />, color: '#3b82f6' },
    { label: 'Waiting', count: patients.filter((p) => p.status === 'waiting').length, icon: <FiClock size={20} />, color: '#f59e0b' },
    { label: 'Checked In', count: patients.filter((p) => p.status === 'checked-in').length, icon: <FiActivity size={20} />, color: '#0ea5a0' },
    { label: 'In Consultation', count: patients.filter((p) => p.status === 'in-consultation').length, icon: <FiActivity size={20} />, color: '#8b5cf6' },
    { label: 'Completed', count: patients.filter((p) => p.status === 'completed').length, icon: <FiCheckCircle size={20} />, color: '#10b981' },
  ]

  const filtered = patients
    .filter((p) =>
      p.regId.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    // Queue order first, then the rest by registration order
    .sort((a, b) => (a.queueNumber || 9999) - (b.queueNumber || 9999))

  const handleCallNext = () => {
    const next = callNext()
    if (next) setSelectedId(next.id)
  }

  return (
    <section id="reception" style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🖥️ RECEPTIONIST DASHBOARD</div>
          <h2 className="section-title">Reception Control Center</h2>
          <p className="section-subtitle">
            {staff ? `Logged in as ${staff.name} (${staff.staffId}) — ` : ''}
            Waiting list in queue order • search & manage by Registration ID
          </p>
        </div>

        {/* Patient Flow Counters with count-up */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16, marginBottom: 40,
        }}>
          {flowStats.map((s, i) => (
            <StatCard key={i} stat={s} index={i} />
          ))}
        </div>

        {/* Search + Call Next */}
        <div className="glass-strong holo-shimmer" style={{ padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <FiSearch style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--gray-500)',
              }} />
              <input
                className="input-field"
                placeholder="Search by Registration ID or Patient Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
            <div className="badge badge-teal" style={{ padding: '12px 20px', fontSize: '0.85rem' }}>
              {filtered.length} patients
            </div>
            <button className="btn-primary glow-border next-pulse" onClick={handleCallNext}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Call Next in Queue <FiArrowRight size={14} /></span>
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
            REGISTRATION ID → VERIFY → CHECK IN → DOCTOR QUEUE
          </p>
        </div>

        {/* Patient List — queue-ordered */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((p, i) => {
            const st = statusColors[p.status]
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}
                whileHover={{ x: 4 }}
                className="glass-card"
                style={{
                  padding: '16px 24px', cursor: 'pointer',
                  borderColor: selectedId === p.id ? `${st.color}40` : 'rgba(255,255,255,0.05)',
                }}
                onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {/* Queue number */}
                  {p.queueNumber ? (
                    <div className="queue-chip" title="Queue position">
                      {p.status === 'completed' ? '✓' : `#${p.queueNumber}`}
                    </div>
                  ) : null}

                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${st.color}15`, border: `1px solid ${st.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '0.9rem',
                      color: st.color,
                    }}
                  >
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </motion.div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>{p.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{p.age}/{p.gender[0]}</span>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                      color: 'var(--gray-500)', marginTop: 2,
                    }}>
                      {p.regId} • {p.id}
                    </div>
                  </div>

                  {/* Status Badge with pulse */}
                  <motion.span
                    animate={selectedId === p.id ? {
                      boxShadow: [`0 0 0px ${st.color}00`, `0 0 10px ${st.color}30`, `0 0 0px ${st.color}00`],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="badge"
                    style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}
                  >
                    {st.label}
                  </motion.span>

                  {/* Action Button — advance waiting status */}
                  {p.status !== 'completed' && (
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                      onClick={(e) => { e.stopPropagation(); advanceStatus(p.id) }}
                    >
                      <span>
                        {p.status === 'registered' ? 'Send to Waiting' :
                         p.status === 'waiting' ? 'Check In' :
                         p.status === 'checked-in' ? 'Send to Doctor' :
                         'Mark Completed'} <FiArrowRight size={12} />
                      </span>
                    </button>
                  )}
                </div>

                {/* Expanded Details — permitted patient record fields only */}
                <AnimatePresence>
                  {selectedId === p.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                        {[
                          ['Chief Complaint', p.chiefComplaint],
                          ['Phone', p.phone || '—'],
                          ['Medications (self-reported)', p.medications],
                          ['Allergies', p.allergies],
                          ['History (self-reported)', p.history],
                        ].map(([k, v]) => (
                          <div key={k} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--gray-200)' }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <p style={{
                        fontSize: '0.7rem', color: 'var(--gray-500)', marginTop: 12,
                        fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.03em',
                      }}>
                        RESTRICTED: CLINICAL RECORDS, DOCTOR NOTES & PRESCRIPTIONS ARE DOCTOR-ONLY.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
          {filtered.length === 0 && (
            <div className="glass-card" style={{ padding: 32, textAlign: 'center', color: 'var(--gray-400)' }}>
              No patients match “{search}”.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
