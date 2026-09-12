import React from 'react'
import { motion } from 'framer-motion'

const concepts = [
  { name: 'Prakriti', icon: '🌿', desc: 'Constitution — the fundamental nature of the individual determined at conception', color: '#10b981', details: 'Vata, Pitta, Kapha, or combinations thereof. Determines predisposition to certain conditions.' },
  { name: 'Vikriti', icon: '⚖️', desc: 'Current imbalance — deviation from natural constitution due to lifestyle, diet, or environment', color: '#f59e0b', details: 'Identifies the current state of dosha imbalance driving present symptoms.' },
  { name: 'Agni', icon: '🔥', desc: 'Digestive fire — capacity to transform food into nutrients and energy', color: '#ef4444', details: 'Sama (balanced), Vishama (irregular), Tikshna (sharp), Manda (weak).' },
  { name: 'Koshta', icon: '🔄', desc: 'Bowel habit — pattern of elimination reflecting digestive health', color: '#8b5cf6', details: 'Krura (hard/constipated), Madhyama (moderate), Slakshna (soft/loose).' },
  { name: 'Ahara-Vihara', icon: '🧘', desc: 'Diet & lifestyle — food habits, daily routines, sleep, and exercise patterns', color: '#06b6d4', details: 'Comprehensive assessment of dietary and lifestyle factors influencing health.' },
  { name: 'Dashavidha Pariksha', icon: '🔬', desc: 'Tenfold examination — comprehensive physical assessment', color: '#ec4899', details: 'Prakriti, Jihva, Mala, Mutra, Shabda, Sparsha, Drik, Akriti, Satmya, Sara.' },
]

export default function AyurvedaSection() {
  return (
    <section style={{ padding: 'var(--section-padding)', position: 'relative', overflow: 'hidden' }}>
      {/* Mandala rotating background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, opacity: 0.03,
        animation: 'mandala-rotate 60s linear infinite',
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }}>
          {[0, 1, 2, 3, 4, 5].map(i => {
            const r = 100 + i * 40
            return (
              <React.Fragment key={i}>
                <circle cx={300} cy={300} r={r} fill="none" stroke="#0ea5a0" strokeWidth={0.5} />
                {[0, 1, 2, 3, 4, 5, 6, 7].map(j => {
                  const angle = (j / 8) * Math.PI * 2
                  const x = 300 + Math.cos(angle) * r
                  const y = 300 + Math.sin(angle) * r
                  return <circle key={j} cx={x} cy={y} r={3} fill="#0ea5a0" opacity={0.3} />
                })}
              </React.Fragment>
            )
          })}
          {/* Inner petals */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const angle = (i / 8) * Math.PI * 2
            const x1 = 300 + Math.cos(angle) * 60
            const y1 = 300 + Math.sin(angle) * 60
            const x2 = 300 + Math.cos(angle) * 200
            const y2 = 300 + Math.sin(angle) * 200
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0ea5a0" strokeWidth={0.3} opacity={0.4} />
          })}
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <div className="section-label">🌿 AYURVEDA</div>
          <h2 className="section-title">Traditional Medicine Integration</h2>
          <p className="section-subtitle">
            Modern clinical workflow enriched with Ayurvedic assessment and documentation
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {concepts.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotateX: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card holo-shimmer"
              style={{ borderColor: `${c.color}15`, position: 'relative', overflow: 'hidden' }}
            >
              {/* Top gradient accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, transparent, ${c.color}, transparent)`,
                opacity: 0.5,
              }} />

              {/* Floating icon */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                  style={{
                    width: 52, height: 52, minWidth: 52, borderRadius: 14,
                    background: `${c.color}15`, border: `1px solid ${c.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', position: 'relative',
                  }}
                >
                  {c.icon}
                  {/* Glow ring */}
                  <div style={{
                    position: 'absolute', inset: -4, borderRadius: 16,
                    border: `1px solid ${c.color}15`,
                    animation: `glow-ring-expand ${4 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                    pointerEvents: 'none',
                  }} />
                </motion.div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-primary)', fontSize: '1.1rem',
                    fontWeight: 600, color: c.color, marginBottom: 6,
                  }}>{c.name}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--gray-300)', lineHeight: 1.6, marginBottom: 8 }}>
                    {c.desc}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>
                    {c.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
