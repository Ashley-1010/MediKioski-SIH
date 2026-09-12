import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiCpu, FiZap, FiEdit3, FiCheck, FiAlertTriangle } from 'react-icons/fi'

const pipeline = [
  { label: 'Medical Records', icon: '📄', color: '#3b82f6' },
  { label: 'Data Processing', icon: '⚙️', color: '#0ea5a0' },
  { label: 'AI Analysis', icon: '🧠', color: '#8b5cf6' },
  { label: 'Structured Info', icon: '📊', color: '#f59e0b' },
  { label: 'Clinical Summary', icon: '📋', color: '#10b981' },
]

// Particle burst effect
function ParticleBurst({ active, color }) {
  if (!active) return null
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none', zIndex: 10,
    }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const dist = 30 + Math.random() * 40
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 6, height: 6, borderRadius: '50%',
              background: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function AISummary() {
  const [generating, setGenerating] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [showResult, setShowResult] = useState(false)
  const [doctorApproved, setDoctorApproved] = useState(false)
  const [burstActive, setBurstActive] = useState(false)
  const neuralRef = useRef(null)
  const isInView = useInView(neuralRef, { once: true })

  const generate = () => {
    setGenerating(true)
    setShowResult(false)
    setDoctorApproved(false)
    setActiveStep(0)
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < pipeline.length) {
        setActiveStep(step)
      } else {
        clearInterval(interval)
        setGenerating(false)
        setBurstActive(true)
        setTimeout(() => setBurstActive(false), 1000)
        setShowResult(true)
      }
    }, 800)
  }

  return (
    <section id="ai" style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🧠 AI ENGINE</div>
          <h2 className="section-title">AI Clinical Summary</h2>
          <p className="section-subtitle">
            Neural-network-powered analysis that transforms scattered patient data into a structured clinical summary
          </p>
        </div>

        {/* Neural Network Visualization */}
        <div ref={neuralRef} className="glass-strong holo-shimmer" style={{ padding: 32, marginBottom: 32, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Particle burst when generating */}
          <ParticleBurst active={burstActive} color="#8b5cf6" />

          <svg viewBox="0 0 600 200" style={{ width: '100%', maxWidth: 600, height: 200, position: 'relative', zIndex: 1 }}>
            {/* Neural Network Nodes with glow */}
            {[0, 1, 2].map(layer => {
              const nodes = layer === 1 ? 5 : 3
              const x = 100 + layer * 200
              return Array.from({ length: nodes }).map((_, i) => {
                const y = (i + 1) * (200 / (nodes + 1))
                const isActive = activeStep >= layer
                const color = isActive ? pipeline[layer].color : '#334155'
                return (
                  <g key={`${layer}-${i}`}>
                    {/* Glow ring */}
                    {isActive && (
                      <circle cx={x} cy={y} r={18} fill="none" stroke={color} strokeWidth={0.5} opacity={0.4}>
                        <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={x} cy={y} r={12} fill={`${color}33`} stroke={color} strokeWidth={1.5}
                      style={{ transition: 'all 0.5s ease' }} />
                    {isActive && (
                      <circle cx={x} cy={y} r={6} fill={color} opacity={0.3}>
                        <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                )
              })
            })}
            {/* Connections with animated dash */}
            {[0, 1].map(layer => {
              const nodes1 = layer === 0 ? 3 : 5
              const nodes2 = layer === 0 ? 5 : 3
              const x1 = 100 + layer * 200
              const x2 = x1 + 200
              const lines = []
              for (let i = 0; i < nodes1; i++) {
                for (let j = 0; j < nodes2; j++) {
                  const y1 = (i + 1) * (200 / (nodes1 + 1))
                  const y2 = (j + 1) * (200 / (nodes2 + 1))
                  const isActive = activeStep > layer
                  lines.push(
                    <line key={`${layer}-${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isActive ? pipeline[layer].color : '#334155'}
                      strokeWidth={isActive ? 1 : 0.5} opacity={isActive ? 0.4 : 0.15}
                      strokeDasharray={isActive ? '6 3' : 'none'}
                      style={{ transition: 'all 0.5s ease' }} />
                  )
                }
              }
              return lines
            })}
          </svg>

          {/* Pipeline Steps with connectors */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 24, flexWrap: 'wrap' }}>
            {pipeline.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  animate={activeStep >= i ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 14px', borderRadius: 100,
                    background: activeStep >= i ? `${step.color}15` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeStep >= i ? `${step.color}40` : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.5s ease',
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>{step.icon}</span>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 500,
                    color: activeStep >= i ? step.color : 'var(--gray-500)',
                  }}>{step.label}</span>
                  {activeStep > i && <span style={{ color: step.color, fontSize: '0.8rem' }}>✓</span>}
                </motion.div>
                {i < pipeline.length - 1 && (
                  <motion.span
                    animate={activeStep > i ? { x: [0, 3, 0] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{
                      color: activeStep > i ? pipeline[i].color : 'var(--gray-700)',
                      fontSize: '0.8rem', transition: 'color 0.3s',
                    }}
                  >→</motion.span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        {!generating && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <button className="btn-primary glow-border" onClick={generate} style={{ fontSize: '1rem', padding: '16px 32px' }}>
              <span><FiCpu size={18} /> Generate AI Summary</span>
            </button>
          </motion.div>
        )}

        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '12px 24px', borderRadius: 12,
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
            }}>
              <FiCpu size={18} style={{ color: 'var(--violet-400)', animation: 'rotate-slow 2s linear infinite' }} />
              <span style={{ color: 'var(--violet-300)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                Processing: {pipeline[Math.min(activeStep, pipeline.length - 1)].label}...
              </span>
            </div>
          </motion.div>
        )}

        {/* AI Generated Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ maxWidth: 800, margin: '0 auto' }}
            >
              {/* AI Badge */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="badge badge-violet"
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  🤖 AI GENERATED
                </motion.span>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 4 }}>
                  Doctor Review Required
                </div>
              </div>

              {/* Summary Card with holographic effect */}
              <div className="glass-strong holo-shimmer" style={{
                padding: 32, borderColor: 'rgba(139,92,246,0.2)',
                boxShadow: '0 0 40px rgba(139,92,246,0.1)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--violet-300)', marginBottom: 20 }}>
                  📋 AI Clinical Case Summary
                </h3>

                {[
                  { label: 'Patient', value: 'Ramesh Kumar, 52/M, PAT-00084721' },
                  { label: 'Chief Complaint', value: 'High fever for 3 days with severe headache' },
                  { label: 'Clinical Assessment', value: 'Acute febrile illness with cephalgia. Temperature 102.4°F with moderate headache. History of self-medication with Paracetamol 500mg without medical consultation.' },
                  { label: 'Risk Factors', value: 'Hypertension (130/85 mmHg), Type 2 Diabetes — requires blood sugar monitoring during fever. Penicillin allergy documented.' },
                  { label: 'Red Flags', value: '⚠ High fever >101°F for 3+ days — rule out dengue/malaria. ⚠ Self-medication without diagnosis. ⚠ Diabetic patient with fever.' },
                  { label: 'Recommended Investigations', value: 'CBC, Dengue NS1 Antigen, Malaria Parasite, Blood Sugar (Fasting & PP), Liver Function Tests, Urine Routine' },
                  { label: 'Ayurveda Assessment', value: 'Pitta-Kapha aggravation. Jihva: Coated. Agni: Mandya (weak). Recommended: Light diet, Tikta-kashaya (bitter decoctions), rest.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{ marginBottom: 16 }}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--teal-400)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-200)', lineHeight: 1.6 }}>
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Doctor Actions */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                  <FiEdit3 size={14} /> Edit Summary
                </button>
                {!doctorApproved ? (
                  <button className="btn-primary" onClick={() => setDoctorApproved(true)}
                    style={{ padding: '10px 20px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981, #0ea5a0)' }}>
                    <span><FiCheck size={14} /> Doctor Approved</span>
                  </button>
                ) : (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="badge badge-success"
                    style={{ padding: '12px 20px', fontSize: '0.85rem' }}
                  >
                    ✅ DOCTOR APPROVED
                  </motion.span>
                )}
              </div>

              {/* Disclaimer */}
              <div style={{
                marginTop: 24, padding: '12px 20px', borderRadius: 12,
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <FiAlertTriangle size={16} style={{ color: '#fbbf24', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#fbbf24' }}>Disclaimer:</strong> This AI-generated summary is for clinical documentation assistance only. It does not constitute a diagnosis or treatment recommendation. A qualified healthcare professional must review, verify, and approve all clinical information before patient consultation.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
