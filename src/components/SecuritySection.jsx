import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiLock, FiShield, FiKey, FiDatabase, FiFileText, FiEye, FiClipboard, FiCloud } from 'react-icons/fi'

const layers = [
  { icon: <FiKey size={20} />, name: 'Authentication', desc: 'Secure login with hashed passwords and session management', color: '#3b82f6' },
  { icon: <FiShield size={20} />, name: 'RBAC', desc: 'Role-based module access — Patient, Receptionist, Doctor, Admin', color: '#0ea5a0' },
  { icon: <FiLock size={20} />, name: 'HTTPS/TLS', desc: 'All communications encrypted in transit via TLS 1.3', color: '#8b5cf6' },
  { icon: <FiDatabase size={20} />, name: 'Password Hashing', desc: 'Bcrypt hashing with salt for all stored credentials', color: '#f59e0b' },
  { icon: <FiFileText size={20} />, name: 'Input Validation', desc: 'Pydantic models with strict type checking on all inputs', color: '#10b981' },
  { icon: <FiCloud size={20} />, name: 'Secure File Handling', desc: 'Scoped file access, type validation, and size limits on uploads', color: '#06b6d4' },
  { icon: <FiEye size={20} />, name: 'Audit Logs', desc: 'Complete action tracking for compliance and accountability', color: '#a855f7' },
  { icon: <FiClipboard size={20} />, name: 'Consent Management', desc: 'Digital consent tracking with timestamp and IP logging', color: '#ec4899' },
]

function AnimatedShield() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
      <div style={{ position: 'relative', width: 160, height: 180 }}>
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: -20,
            border: '1px dashed rgba(14,165,160,0.15)',
            borderRadius: '50%',
          }}
        />
        {/* Expanding glow rings */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: -10 - i * 15,
            border: `1px solid rgba(14,165,160,${0.15 - i * 0.04})`,
            borderRadius: '50%',
            animation: `glow-ring-expand 4s ease-in-out infinite`,
            animationDelay: `${i * 1.3}s`,
            pointerEvents: 'none',
          }} />
        ))}
        {/* Shield body */}
        <motion.svg
          viewBox="0 0 140 160"
          style={{ width: '100%', height: '100%', position: 'absolute', filter: 'drop-shadow(0 0 20px rgba(14,165,160,0.3))' }}
          animate={isInView ? { scale: [0.9, 1.02, 1] } : {}}
          transition={{ duration: 0.8 }}
        >
          <path d="M70 10 L130 40 L130 90 C130 120 100 150 70 160 C40 150 10 120 10 90 L10 40 Z"
            fill="rgba(14,165,160,0.1)" stroke="rgba(14,165,160,0.4)" strokeWidth="2" />
          <path d="M70 25 L120 48 L120 88 C120 112 95 138 70 148 C45 138 20 112 20 88 L20 48 Z"
            fill="rgba(14,165,160,0.05)" stroke="rgba(14,165,160,0.2)" strokeWidth="1" />
        </motion.svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'shield-pulse 3s ease-in-out infinite',
        }}>
          <FiShield size={40} style={{ color: 'var(--teal-400)' }} />
        </div>
        {/* Orbiting security icons */}
        {['🔐', '🛡️', '🔑', '📋'].map((icon, i) => {
          const angle = (i / 4) * Math.PI * 2
          const radius = 90
          return (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 0, height: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                left: Math.cos(angle) * radius - 12,
                top: Math.sin(angle) * radius - 12,
                width: 24, height: 24, fontSize: '0.8rem',
              }}>{icon}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function SecuritySection() {
  return (
    <section id="security" style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🔒 SECURITY</div>
          <h2 className="section-title">Security & Privacy</h2>
          <p className="section-subtitle">
            HIPAA-aligned security architecture protecting patient data at every layer
          </p>
        </div>

        <AnimatedShield />

        {/* Security Layers with cascade animation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {layers.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card glass-lift"
              style={{ display: 'flex', gap: 14, alignItems: 'flex-start', borderColor: `${l.color}15` }}
            >
              <div className="icon-glow" style={{
                width: 42, height: 42, minWidth: 42, borderRadius: 10,
                background: `${l.color}15`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: l.color,
                position: 'relative',
              }}>
                {l.icon}
                {/* Mini glow ring */}
                <div style={{
                  position: 'absolute', inset: -3, borderRadius: 12,
                  border: `1px solid ${l.color}20`,
                  animation: `glow-ring-expand ${3 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                  pointerEvents: 'none',
                }} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-primary)', fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>{l.name}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>{l.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
