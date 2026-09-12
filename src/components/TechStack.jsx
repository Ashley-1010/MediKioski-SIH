import React from 'react'
import { motion } from 'framer-motion'

const layers = [
  { label: 'Frontend', color: '#3b82f6', techs: [
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Vite', icon: '⚡' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Axios', icon: '🔗' },
    { name: 'React Router', icon: '🧭' },
  ]},
  { label: 'Backend', color: '#0ea5a0', techs: [
    { name: 'Python', icon: '🐍' },
    { name: 'FastAPI', icon: '⚡' },
    { name: 'Pydantic', icon: '✅' },
    { name: 'SQLAlchemy', icon: '🗄️' },
  ]},
  { label: 'Data & AI', color: '#8b5cf6', techs: [
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'SQLite', icon: '💾' },
    { name: 'OCR Engine', icon: '📷' },
    { name: 'AI / LLM', icon: '🧠' },
    { name: 'Object Storage', icon: '📦' },
  ]},
]

function ConnectorArrow({ color }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', padding: '8px 0',
      position: 'relative',
    }}>
      <motion.svg
        width="20" height="32" viewBox="0 0 20 32"
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M10 0 L10 20 M6 16 L10 24 L14 16" stroke={color} strokeWidth="1.5" fill="none" opacity={0.6} />
      </motion.svg>
      {/* Animated dot */}
      <motion.div
        animate={{ y: [0, 24], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: 4, left: '50%',
          width: 4, height: 4, borderRadius: '50%',
          background: color, transform: 'translateX(-50%)',
        }}
      />
    </div>
  )
}

export default function TechStack() {
  return (
    <section id="technology" style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🔧 ARCHITECTURE</div>
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">Built on modern, scalable, and secure technologies</p>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {layers.map((layer, li) => (
            <motion.div
              key={li}
              initial={{ opacity: 0, x: li % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: li * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: li < layers.length - 1 ? 4 : 0 }}
            >
              {/* Connector */}
              {li > 0 && <ConnectorArrow color={layers[li].color} />}

              <div className="glass-strong holo-shimmer" style={{ padding: 24 }}>
                <div style={{
                  fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                  color: layer.color, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 16,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: layer.color, opacity: 0.6,
                    animation: 'pulse-glow 2s ease infinite',
                    animationDelay: `${li * 0.5}s`,
                  }} />
                  {layer.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {layer.techs.map((t, ti) => (
                    <motion.div
                      key={ti}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: li * 0.1 + ti * 0.05 }}
                      whileHover={{ scale: 1.08, y: -3, boxShadow: `0 4px 20px ${layer.color}20` }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'default', transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{t.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Document Pipeline with animated flow */}
        <div className="glass-strong holo-shimmer" style={{ padding: 24, maxWidth: 700, margin: '40px auto 0' }}>
          <div style={{
            fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--violet-400)',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center',
          }}>
            DOCUMENT PIPELINE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
            {['Medical Documents', '→ Storage', '→ OCR', '→ AI', '→ Doctor Review'].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{ color: 'var(--gray-500)', fontSize: '0.7rem' }}
                  >→</motion.span>
                )}
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: '0.82rem',
                    background: i === 0 ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${i === 0 ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    color: i === 0 ? 'var(--electric-300)' : 'var(--gray-300)',
                    transition: 'all 0.2s ease',
                  }}
                >{s}</motion.span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
