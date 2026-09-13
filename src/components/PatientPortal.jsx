import React from 'react'
import { motion } from 'framer-motion'
import { FiUserPlus, FiFileText, FiArrowRight } from 'react-icons/fi'
import useStore from '../store/useStore'

export default function PatientPortal() {
  const setCurrentPage = useStore((s) => s.setCurrentPage)
  const registrationId = useStore((s) => s.registrationId)

  const cards = [
    {
      icon: <FiUserPlus size={28} style={{ color: 'var(--teal-400)' }} />,
      title: 'Patient Registration',
      desc: 'New here? Complete a guided multi-step registration with consent, medical history and document upload — and receive your unique Registration ID.',
      cta: 'Start Registration',
      primary: true,
      page: 'registration',
    },
    {
      icon: <FiFileText size={28} style={{ color: 'var(--electric-400)' }} />,
      title: 'Check My Status',
      desc: registrationId
        ? `Already registered (${registrationId})? See your live waiting status and queue position.`
        : 'Already registered? See your Registration ID, submission status and live waiting position.',
      cta: 'View My Status',
      primary: false,
      page: 'my-status',
    },
  ]

  return (
    <section style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🧑‍⚕️ PATIENT PORTAL</div>
          <h2 className="section-title">Patient Portal</h2>
          <p className="section-subtitle">Register as a new patient or check the status of your visit</p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16, maxWidth: 820, margin: '0 auto',
        }}>
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass-card ${c.primary ? 'glow-border' : ''}`}
              style={{ padding: 32, cursor: 'pointer' }}
              onClick={() => setCurrentPage(c.page)}
            >
              <div style={{ marginBottom: 16 }}>{c.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: 10 }}>{c.title}</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--gray-400)', lineHeight: 1.7 }}>{c.desc}</p>
              {c.primary ? (
                <button className="btn-primary glow-border next-pulse" style={{
                  marginTop: 22, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>{c.cta} <FiArrowRight size={14} /></span>
                </button>
              ) : (
                <button className="btn-secondary" style={{
                  marginTop: 22, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>{c.cta} <FiArrowRight size={14} /></span>
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <p style={{
          textAlign: 'center', marginTop: 28, fontSize: '0.78rem',
          color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
        }}>
          STAFF MEMBER? USE THE STAFF LOGIN IN THE TOP-RIGHT CORNER
        </p>
      </div>
    </section>
  )
}
