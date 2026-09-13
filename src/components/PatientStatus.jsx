import React from 'react'
import { motion } from 'framer-motion'
import { FiUserPlus } from 'react-icons/fi'
import useStore from '../store/useStore'

const statusCopy = {
  'registered': { label: 'Registered', color: '#60a5fa', desc: 'Your details are with the reception desk.' },
  'waiting': { label: 'Waiting in Queue', color: '#fbbf24', desc: 'Please wait — you will be called shortly.' },
  'checked-in': { label: 'Called', color: '#3de8d8', desc: 'The receptionist has called you. Please proceed to the consultation room.' },
  'in-consultation': { label: 'In Consultation', color: '#c4b5fd', desc: 'You are currently with the doctor.' },
  'completed': { label: 'Consultation Completed', color: '#34d399', desc: 'Your visit is complete. Thank you!' },
}
const QUEUED = ['registered', 'waiting', 'checked-in']

export default function PatientStatus() {
  const registrationId = useStore((s) => s.registrationId)
  const patientId = useStore((s) => s.patientId)
  const patients = useStore((s) => s.patients)
  const patientData = useStore((s) => s.patientData)
  const setCurrentPage = useStore((s) => s.setCurrentPage)

  if (!registrationId) {
    return (
      <section style={{ padding: 'var(--section-padding)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">🧑‍⚕️ MY REGISTRATION</div>
            <h2 className="section-title">My Status</h2>
            <p className="section-subtitle">No registration found on this device yet</p>
          </div>
          <div className="glass-strong" style={{ maxWidth: 520, margin: '0 auto', padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>🗂️</div>
            <p style={{ color: 'var(--gray-300)', marginBottom: 24 }}>
              Complete the patient registration to receive your Registration ID and live status.
            </p>
            <button className="btn-primary glow-border next-pulse" onClick={() => setCurrentPage('registration')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span><FiUserPlus size={14} /> Start Patient Registration</span>
            </button>
          </div>
        </div>
      </section>
    )
  }

  const record = patients.find((p) => p.regId === registrationId)
  const st = statusCopy[record?.status] || statusCopy.registered
  const queueList = patients
    .filter((p) => QUEUED.includes(p.status) && p.queueNumber)
    .sort((a, b) => a.queueNumber - b.queueNumber)
  const queuePos = record && QUEUED.includes(record.status)
    ? queueList.findIndex((p) => p.id === record.id) + 1
    : null

  return (
    <section style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🧑‍⚕️ MY REGISTRATION</div>
          <h2 className="section-title">My Status</h2>
          <p className="section-subtitle">Your registration details and live waiting status</p>
        </div>

        <div className="glass-strong holo-shimmer" style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px)' }}>
          {/* IDs */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              REGISTRATION ID
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700,
              color: 'var(--electric-300)', letterSpacing: '0.05em',
              textShadow: '0 0 20px rgba(59,130,246,0.4)',
            }}>{registrationId}</div>
            {patientId && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 6 }}>
                PATIENT ID: {patientId}
              </div>
            )}
          </div>

          {/* Live status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ borderColor: `${st.color}40`, padding: 20, textAlign: 'center', marginBottom: 24 }}
          >
            <span className="badge" style={{
              background: `${st.color}15`, color: st.color,
              border: `1px solid ${st.color}40`, padding: '6px 16px', fontSize: '0.85rem',
            }}>
              ● {st.label.toUpperCase()}
            </span>
            <p style={{ color: 'var(--gray-300)', marginTop: 12, fontSize: '0.92rem' }}>{st.desc}</p>
            {queuePos !== null && (
              <div style={{
                marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                color: 'var(--teal-300)', letterSpacing: '0.05em',
              }}>
                QUEUE POSITION: #{queuePos} OF {queueList.length}
              </div>
            )}
          </motion.div>

          {/* Own submitted information (patient-permitted only) */}
          <div className="glass-card" style={{ borderColor: 'rgba(14,165,160,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--teal-300)', marginBottom: 16, fontSize: '1rem' }}>
              📋 My Submitted Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                ['Full Name', record?.name || patientData.fullName],
                ['Date of Birth', patientData.dob],
                ['Gender', record?.gender || patientData.gender],
                ['Phone', record?.phone || patientData.phone],
                ['Email', patientData.email],
                ['Documents Uploaded', `${(record?.reports || patientData.documents || []).length}`],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                  <div style={{
                    fontSize: '0.65rem', color: 'var(--gray-500)', fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase', marginBottom: 4,
                  }}>{k}</div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--white)', fontWeight: 500 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
            <p style={{
              fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 16,
              fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.03em',
            }}>
              CLINICAL NOTES, PRESCRIPTIONS AND DOCTOR RECORDS ARE VISIBLE ONLY TO AUTHORISED STAFF.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
