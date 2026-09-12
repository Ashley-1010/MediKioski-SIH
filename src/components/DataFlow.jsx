import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const flow = [
  { icon: '🧑', label: 'Patient', color: '#3b82f6' },
  { icon: '📝', label: 'Registration', color: '#0ea5a0' },
  { icon: '🆔', label: 'Patient ID + Reg ID', color: '#f59e0b' },
  { icon: '🏥', label: 'Encounter', color: '#8b5cf6' },
  { icon: '📋', label: 'Clinical + Ayurveda', color: '#10b981' },
  { icon: '📄', label: 'Medical Documents', color: '#06b6d4' },
  { icon: '📷', label: 'OCR', color: '#ec4899' },
  { icon: '🧠', label: 'AI Summary', color: '#a855f7' },
  { icon: '👨‍⚕️', label: 'Doctor Review', color: '#f59e0b' },
  { icon: '✅', label: 'Doctor Approval', color: '#10b981' },
]

function FlowNode({ step, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.08 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, padding: '16px 12px', minWidth: 100, cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Expanding glow ring */}
      <div style={{
        position: 'relative', width: 52, height: 52,
      }}>
        {/* Pulse ring */}
        <div style={{
          position: 'absolute', inset: -6, borderRadius: 16,
          border: `1px solid ${step.color}20`,
          animation: `glow-ring-expand ${3 + index * 0.2}s ease-in-out infinite`,
          animationDelay: `${index * 0.3}s`,
          pointerEvents: 'none',
        }} />
        <motion.div
          animate={isInView ? {
            boxShadow: [
              `0 0 0px ${step.color}00`,
              `0 0 15px ${step.color}30`,
              `0 0 0px ${step.color}00`,
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${step.color}15`, border: `1px solid ${step.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', transition: 'all 0.3s ease',
            position: 'relative', zIndex: 1,
          }}
        >
          {step.icon}
        </motion.div>
      </div>
      <span style={{
        fontSize: '0.72rem', fontWeight: 500, color: step.color,
        textAlign: 'center', whiteSpace: 'nowrap',
      }}>{step.label}</span>
      <span style={{
        fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
        color: 'var(--gray-600)',
      }}>Step {index + 1}</span>
    </motion.div>
  )
}

function FlowArrow({ index, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay: index * 0.1 + 0.05, duration: 0.4 }}
      style={{
        color: 'var(--gray-600)', fontSize: '0.8rem', flexShrink: 0,
        display: 'flex', alignItems: 'center', position: 'relative',
        width: 32, justifyContent: 'center',
      }}
    >
      <motion.span
        animate={{ x: [-3, 3, -3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 }}
        style={{ display: 'inline-block' }}
      >→</motion.span>
      {/* Animated dot */}
      <motion.div
        animate={{ x: [-10, 10], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
        style={{
          position: 'absolute', width: 3, height: 3, borderRadius: '50%',
          background: color, top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </motion.div>
  )
}

export default function DataFlow() {
  return (
    <section style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">🔗 DATA FLOW</div>
          <h2 className="section-title">System Data Flow</h2>
          <p className="section-subtitle">
            End-to-end journey from patient registration to doctor approval
          </p>
        </div>

        <div className="glass-strong holo-shimmer" style={{ padding: 32, overflowX: 'auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0, minWidth: 'max-content',
            justifyContent: 'center',
          }}>
            {flow.map((step, i) => (
              <React.Fragment key={i}>
                <FlowNode step={step} index={i} />
                {i < flow.length - 1 && (
                  <FlowArrow index={i} color={step.color} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
