import React from 'react'
import { motion } from 'framer-motion'

const features = [
  { icon: '🏥', name: 'ABDM / ABHA Integration', desc: 'Integration with Ayushman Bharat Digital Mission for unified health IDs', color: '#3b82f6' },
  { icon: '📷', name: 'Advanced OCR', desc: 'Deep-learning powered OCR for handwritten prescriptions in multiple scripts', color: '#0ea5a0' },
  { icon: '🌐', name: 'Multilingual Support', desc: 'Full support for Hindi, Bengali, Tamil, Telugu, Marathi, and more', color: '#8b5cf6' },
  { icon: '🎙️', name: 'Speech-to-Text', desc: 'Real-time voice transcription for hands-free patient intake', color: '#f59e0b' },
  { icon: '📊', name: 'Analytics Dashboard', desc: 'Hospital-level analytics: patient flow, common conditions, response times', color: '#10b981' },
  { icon: '📅', name: 'Appointment Scheduling', desc: 'Integrated scheduling with calendar sync and automated reminders', color: '#06b6d4' },
  { icon: '📱', name: 'Mobile Application', desc: 'Native iOS and Android apps for patients and healthcare workers', color: '#ec4899' },
  { icon: '📞', name: 'Teleconsultation', desc: 'Video consultation with integrated AI-generated case sheets', color: '#a855f7' },
  { icon: '🏢', name: 'Multi-Clinic Support', desc: 'Manage multiple clinics, branches, and departments from one platform', color: '#f97316' },
]

export default function FutureScope() {
  return (
    <section id="future" style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🔮 FUTURE SCOPE</div>
          <h2 className="section-title">Roadmap & Future Vision</h2>
          <p className="section-subtitle">
            Planned enhancements to expand MediKiosk's capabilities
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotateX: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card holo-shimmer"
              style={{
                borderColor: `${f.color}10`, position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Top gradient accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)`,
              }} />

              {/* Future Scope badge */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 + 0.3 }}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  padding: '3px 10px', borderRadius: 6,
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
                  color: `${f.color}`, letterSpacing: '0.05em',
                }}
              >PLANNED</motion.div>

              {/* Floating icon */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                style={{ fontSize: '2rem', marginBottom: 12 }}
              >{f.icon}</motion.div>

              <h4 style={{
                fontFamily: 'var(--font-primary)', fontSize: '1rem',
                fontWeight: 600, marginBottom: 8, color: 'var(--white)',
              }}>{f.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
