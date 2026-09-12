import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiSearch, FiFilter, FiCalendar, FiUser, FiFileText, FiArrowLeft, FiClock, FiEdit3, FiCheck } from 'react-icons/fi'
import { demoPatients } from '../store/useStore'
import { useTilt } from '../hooks/useScrollAnimations'

const statusColors = {
  'registered': '#3b82f6',
  'waiting': '#f59e0b',
  'checked-in': '#0ea5a0',
  'in-consultation': '#8b5cf6',
  'completed': '#10b981',
}

function PatientRecord({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [timeline] = useState([
    { date: '2025-06-15', event: 'First visit — General checkup', status: 'completed' },
    { date: '2025-08-22', event: 'Follow-up — Blood pressure monitoring', status: 'completed' },
    { date: '2025-11-10', event: 'Emergency — Acute respiratory infection', status: 'completed' },
    { date: '2026-09-12', event: 'Current Visit — ' + patient.chiefComplaint, status: 'current' },
  ])

  const tabs = [
    { id: 'profile', label: 'Patient Profile' },
    { id: 'encounter', label: 'Current Encounter' },
    { id: 'history', label: 'Clinical History' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'reports', label: 'Medical Reports' },
    { id: 'notes', label: 'Doctor Notes' },
  ]

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <button onClick={onBack} className="btn-secondary" style={{ marginBottom: 24, padding: '8px 16px', fontSize: '0.85rem' }}>
        <FiArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* Patient Header */}
      <div className="glass-strong holo-shimmer" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            style={{
              width: 56, height: 56, borderRadius: 14,
              background: `${statusColors[patient.status]}20`,
              border: `2px solid ${statusColors[patient.status]}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '1.2rem',
              color: statusColors[patient.status],
            }}
          >
            {patient.name.split(' ').map(n => n[0]).join('')}
          </motion.div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.3rem', fontWeight: 700 }}>{patient.name}</h3>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem', color: 'var(--gray-400)' }}>
              <span>{patient.age}/{patient.gender}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{patient.id}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{patient.regId}</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <motion.span
              animate={{ boxShadow: [`0 0 0px ${statusColors[patient.status]}00`, `0 0 12px ${statusColors[patient.status]}30`, `0 0 0px ${statusColors[patient.status]}00`] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="badge"
              style={{
                background: `${statusColors[patient.status]}15`, color: statusColors[patient.status],
                border: `1px solid ${statusColors[patient.status]}30`, padding: '6px 14px',
              }}
            >
              {patient.status.replace('-', ' ').toUpperCase()}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(t => (
          <motion.button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '8px 16px', borderRadius: 10, border: 'none',
              background: activeTab === t.id ? 'rgba(14,165,160,0.15)' : 'rgba(255,255,255,0.03)',
              color: activeTab === t.id ? 'var(--teal-300)' : 'var(--gray-400)',
              fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >{t.label}</motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-strong" style={{ padding: 24 }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {activeTab === 'profile' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {[
                  ['Full Name', patient.name], ['Age/Gender', `${patient.age}/${patient.gender}`],
                  ['Patient ID', patient.id], ['Registration ID', patient.regId],
                  ['Chief Complaint', patient.chiefComplaint], ['Temperature', patient.vitals.temp],
                  ['Blood Pressure', patient.vitals.bp], ['Heart Rate', `${patient.vitals.hr} bpm`],
                  ['SpO2', `${patient.vitals.spo2}%`], ['Medications', patient.medications],
                  ['Allergies', patient.allergies], ['History', patient.history],
                ].map(([k, v]) => (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}
                  >
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--white)' }}>{v}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'encounter' && (
              <div>
                <h4 style={{ color: 'var(--teal-300)', marginBottom: 16 }}>Current Visit Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'CHIEF COMPLAINT', value: patient.chiefComplaint, color: '#3b82f6' },
                    { label: 'VITALS', value: `Temp: ${patient.vitals.temp}\nBP: ${patient.vitals.bp}\nHR: ${patient.vitals.hr} bpm\nSpO2: ${patient.vitals.spo2}%`, color: '#0ea5a0' },
                    { label: 'MEDICATIONS', value: patient.medications, color: '#8b5cf6' },
                    { label: 'ALLERGIES', value: patient.allergies, color: '#f59e0b' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card"
                      style={{ borderColor: `${item.color}20` }}
                    >
                      <div style={{ fontSize: '0.7rem', color: item.color, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{item.label}</div>
                      <p style={{ color: 'var(--gray-200)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div style={{ position: 'relative', paddingLeft: 24 }}>
                <div style={{
                  position: 'absolute', left: 8, top: 0, bottom: 0, width: 2,
                  background: 'linear-gradient(to bottom, var(--teal-500), var(--violet-500))',
                  opacity: 0.3,
                }} />
                {timeline.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    style={{ position: 'relative', marginBottom: 24, paddingLeft: 20 }}
                  >
                    <motion.div
                      animate={t.status === 'current' ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{
                        position: 'absolute', left: -20, top: 4, width: 12, height: 12,
                        borderRadius: '50%',
                        background: t.status === 'current' ? 'var(--teal-400)' : 'var(--gray-600)',
                        border: `2px solid ${t.status === 'current' ? 'var(--teal-400)' : 'var(--gray-500)'}`,
                        boxShadow: t.status === 'current' ? '0 0 10px var(--teal-400)' : 'none',
                      }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{t.date}</div>
                    <div style={{ fontSize: '0.95rem', color: t.status === 'current' ? 'var(--teal-300)' : 'var(--gray-200)' }}>
                      {t.event}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-300)', lineHeight: 1.8 }}>
                <p><strong style={{ color: 'var(--teal-300)' }}>Past Medical History:</strong> {patient.history}</p>
                <p style={{ marginTop: 8 }}><strong style={{ color: 'var(--teal-300)' }}>Previous Visits:</strong> 3 encounters in the past 12 months</p>
                <p style={{ marginTop: 8 }}><strong style={{ color: 'var(--teal-300)' }}>Family History:</strong> Father — Hypertension, Mother — Type 2 Diabetes</p>
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                {[
                  { name: 'Blood Test Report (2026-08-15)', type: 'Lab Report', status: 'processed' },
                  { name: 'Chest X-Ray (2025-11-10)', type: 'Imaging', status: 'processed' },
                  { name: 'ECG Report (2026-09-12)', type: 'Cardiology', status: 'processing' },
                ].map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="glass"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                      marginBottom: 8, borderRadius: 12,
                    }}
                  >
                    <FiFileText size={18} style={{ color: 'var(--electric-400)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{r.type}</div>
                    </div>
                    <span className={`badge badge-${r.status === 'processed' ? 'success' : 'warning'}`}>
                      {r.status === 'processed' ? '✓ Processed' : '⏳ Processing'}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <textarea className="input-field" rows={6} placeholder="Enter clinical notes, observations, and treatment plan..." style={{ marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                    <span><FiEdit3 size={14} /> Save Notes</span>
                  </button>
                  <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981, #0ea5a0)' }}>
                    <span><FiCheck size={14} /> Approve & Close</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function PatientCard({ patient, index, onClick }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(6)
  const c = statusColors[patient.status]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, rotateX: -5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card glow-border holo-shimmer"
      style={{ cursor: 'pointer', borderColor: `${c}20`, transformStyle: 'preserve-3d' }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          style={{
            width: 44, height: 44, borderRadius: 12, background: `${c}15`,
            border: `1px solid ${c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.85rem', color: c,
          }}
        >
          {patient.name.split(' ').map(n => n[0]).join('')}
        </motion.div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{patient.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{patient.age}/{patient.gender[0]}</div>
        </div>
        <span className="badge" style={{ background: `${c}15`, color: c, border: `1px solid ${c}30` }}>
          {patient.status.replace('-', ' ')}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gray-500)',
        marginBottom: 8,
      }}>
        {patient.id} • {patient.regId}
      </div>
      <p style={{ fontSize: '0.88rem', color: 'var(--gray-300)', lineHeight: 1.5 }}>
        {patient.chiefComplaint}
      </p>
      {/* Animated vitals */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <motion.span
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="badge badge-electric"
          style={{ fontSize: '0.65rem' }}
        >
          🌡️ {patient.vitals.temp}
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          className="badge badge-teal"
          style={{ fontSize: '0.65rem' }}
        >
          💓 {patient.vitals.hr} bpm
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
          className="badge badge-violet"
          style={{ fontSize: '0.65rem' }}
        >
          🫁 {patient.vitals.spo2}%
        </motion.span>
      </div>
    </motion.div>
  )
}

export default function DoctorDashboard() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState(null)

  const filtered = demoPatients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || p.status === filter
    return matchesSearch && matchesFilter
  })

  if (selectedPatient) {
    return (
      <section id="doctor" style={{ padding: 'var(--section-padding)' }}>
        <div className="container">
          <PatientRecord patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
        </div>
      </section>
    )
  }

  return (
    <section id="doctor" style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">👨‍⚕️ DOCTOR DASHBOARD</div>
          <h2 className="section-title">Clinical Command Center</h2>
          <p className="section-subtitle">Access patient records, review AI summaries, and manage clinical workflow</p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
            <input className="input-field" placeholder="Search by name or Patient ID..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'checked-in', 'waiting', 'in-consultation', 'completed'].map(f => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: 'none', fontSize: '0.8rem',
                  background: filter === f ? 'rgba(14,165,160,0.15)' : 'rgba(255,255,255,0.03)',
                  color: filter === f ? 'var(--teal-300)' : 'var(--gray-400)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                {f === 'all' ? 'All' : f.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Patient Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((p, i) => (
            <PatientCard
              key={p.id}
              patient={p}
              index={i}
              onClick={() => setSelectedPatient(p)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
