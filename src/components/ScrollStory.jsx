import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiUser, FiFileText, FiUpload, FiCpu, FiCheckCircle } from 'react-icons/fi'

const steps = [
  {
    num: '01', icon: <FiUser size={28} />, color: '#3b82f6',
    title: 'Register',
    subtitle: 'Patient enters personal information and gives consent.',
    details: 'Full name, date of birth, gender, contact details, emergency contact, and digital consent — all captured in a sleek, guided interface.',
    visual: 'patient',
  },
  {
    num: '02', icon: <FiFileText size={28} />, color: '#0ea5a0',
    title: 'Case Taking',
    subtitle: 'Collect structured medical and Ayurveda information.',
    details: 'Chief complaint, history of present illness, past medical/surgical history, medications, allergies, family history, and Ayurvedic assessment — Prakriti, Vikriti, Agni, and more.',
    visual: 'record',
  },
  {
    num: '03', icon: <FiUpload size={28} />, color: '#8b5cf6',
    title: 'Upload Reports',
    subtitle: 'Upload prescriptions, blood reports and other medical documents.',
    details: 'Drag-and-drop or photograph medical documents. Our OCR engine digitizes handwritten prescriptions, printed lab reports, and discharge summaries.',
    visual: 'documents',
  },
  {
    num: '04', icon: <FiCpu size={28} />, color: '#f59e0b',
    title: 'AI Summary',
    subtitle: 'AI organizes patient information into a concise clinical summary.',
    details: 'Neural-network-powered analysis converts scattered data into a structured, FHIR-ready clinical case summary — complete with red-flag alerts and completeness scoring.',
    visual: 'ai',
  },
  {
    num: '05', icon: <FiCheckCircle size={28} />, color: '#10b981',
    title: 'Doctor Review',
    subtitle: 'The doctor reviews, edits and approves the AI-generated summary.',
    details: 'Full human-in-the-loop workflow: the clinician reviews every detail, edits as needed, adds clinical notes, and approves the final case sheet before consultation.',
    visual: 'doctor',
  },
]

function StepVisual({ type, color }) {
  const shapes = {
    patient: (
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', border: `2px solid ${color}`,
          position: 'absolute', top: 10, left: 20, opacity: 0.3,
          animation: 'pulse-glow 3s ease infinite',
        }} />
        <div style={{
          width: 50, height: 50, borderRadius: '50%', background: `${color}22`,
          border: `2px solid ${color}`, position: 'absolute', top: 24, left: 35,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
        }}>👤</div>
        {/* Orbiting dot */}
        <div style={{
          position: 'absolute', top: 30, left: 50,
          width: 8, height: 8, borderRadius: '50%',
          background: color, opacity: 0.6,
          animation: 'orbit 4s linear infinite',
          '--orbit-radius': '40px',
        }} />
      </div>
    ),
    record: (
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{
              position: 'absolute', width: 70, height: 50, borderRadius: 8,
              border: `1px solid ${color}`, background: `${color}11`,
              top: 15 + i * 8, left: 25 + i * 5,
              transform: `rotate(${-5 + i * 5}deg)`,
            }}
          />
        ))}
      </div>
    ),
    documents: (
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0], x: [0, i * 2, 0] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            style={{
              position: 'absolute', width: 60, height: 40, borderRadius: 6,
              border: `1px solid ${color}`, background: `${color}15`,
              top: 30, left: 20 + i * 25,
            }}
          >
            <div style={{ padding: 6 }}>
              <div style={{ height: 3, width: '70%', background: color, opacity: 0.4, borderRadius: 2, marginBottom: 3 }} />
              <div style={{ height: 3, width: '50%', background: color, opacity: 0.3, borderRadius: 2 }} />
            </div>
          </motion.div>
        ))}
        {/* Scanning laser */}
        <div style={{
          position: 'absolute', left: 15, right: 15, height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: 'scanning-laser 2s ease-in-out infinite',
          boxShadow: `0 0 10px ${color}`,
        }} />
      </div>
    ),
    ai: (
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
          {[30, 60, 90].map((x, i) => (
            <React.Fragment key={i}>
              <circle cx={x} cy={30} r={6} fill={`${color}33`} stroke={color} strokeWidth={1.5}
                style={{ animation: `pulse-glow ${2 + i * 0.3}s ease infinite` }} />
              <circle cx={x} cy={60} r={5} fill={`${color}22`} stroke={color} strokeWidth={1}
                style={{ animation: `pulse-glow ${2.2 + i * 0.2}s ease infinite` }} />
              <circle cx={x} cy={90} r={6} fill={`${color}33`} stroke={color} strokeWidth={1.5}
                style={{ animation: `pulse-glow ${1.8 + i * 0.4}s ease infinite` }} />
            </React.Fragment>
          ))}
          {[30, 60, 90].map((x1) =>
            [30, 60, 90].map((x2, j) => (
              <line key={`${x1}-${x2}-${j}`} x1={x1} y1={30} x2={x2} y2={90}
                stroke={color} strokeWidth={0.5} opacity={0.2}
                strokeDasharray="4 4"
                style={{ animation: `neural-pulse ${3 + j * 0.5}s linear infinite` }} />
            ))
          )}
        </svg>
      </div>
    ),
    doctor: (
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div style={{
          width: 80, height: 60, borderRadius: 12, border: `2px solid ${color}`,
          background: `${color}11`, position: 'absolute', top: 20, left: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'hologram 4s ease-in-out infinite',
        }}>
          <span style={{ fontSize: '1.5rem' }}>✓</span>
        </div>
        <div style={{
          position: 'absolute', bottom: 10, left: 35, fontSize: '0.6rem',
          color, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
        }}>APPROVED</div>
        {/* Success glow ring */}
        <div style={{
          position: 'absolute', top: 25, left: 25, width: 70, height: 50,
          borderRadius: 14, border: `1px solid ${color}30`,
          animation: 'glow-ring-expand 3s ease-in-out infinite',
        }} />
      </div>
    ),
  }
  return shapes[type] || null
}

function StepCard({ step, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex', gap: 32, marginBottom: index < steps.length - 1 ? 48 : 0,
        alignItems: 'center',
      }}
    >
      {/* Step number circle with pulse */}
      <motion.div
        animate={isInView ? { scale: [0.8, 1.05, 1] } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        style={{
          width: 80, height: 80, minWidth: 80, borderRadius: '50%',
          background: `${step.color}15`, border: `2px solid ${step.color}40`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', position: 'relative', zIndex: 2,
          boxShadow: `0 0 30px ${step.color}20`,
        }}
      >
        {/* Expanding glow ring */}
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          border: `1px solid ${step.color}20`,
          animation: `glow-ring-expand 4s ease-in-out infinite`,
          animationDelay: `${index * 0.5}s`,
          pointerEvents: 'none',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          color: step.color, letterSpacing: '0.1em', fontWeight: 600,
        }}>STEP</span>
        <span style={{
          fontFamily: 'var(--font-primary)', fontSize: '1.4rem',
          fontWeight: 700, color: step.color, lineHeight: 1,
        }}>{step.num}</span>
      </motion.div>

      {/* Content Card */}
      <div className="glass-card glass-lift holo-shimmer" style={{
        flex: 1, padding: '28px 32px',
        borderColor: `${step.color}20`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div className="icon-glow" style={{ color: step.color }}>{step.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-primary)', fontSize: '1.3rem',
                fontWeight: 700, color: 'var(--white)',
              }}>{step.title}</h3>
            </div>
            <p style={{ fontSize: '1rem', color: step.color, fontWeight: 500, marginBottom: 8 }}>
              {step.subtitle}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
              {step.details}
            </p>
          </div>
          <div style={{ minWidth: 120, display: 'flex', justifyContent: 'center' }}>
            <StepVisual type={step.visual} color={step.color} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ScrollStory() {
  return (
    <section id="how-it-works" style={{ padding: 'var(--section-padding)', position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">
            <span style={{ animation: 'rotate-slow 4s linear infinite', display: 'inline-block' }}>⚙️</span>
            WORKFLOW
          </div>
          <h2 className="section-title">From Patient to Doctor</h2>
          <p className="section-subtitle">
            A 5-step intelligent workflow that transforms unstructured patient input into a structured, doctor-ready clinical case sheet
          </p>
        </div>

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          {/* Animated vertical line */}
          <div style={{
            position: 'absolute', left: 40, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(to bottom, var(--teal-500), var(--electric-500), var(--violet-500))',
            opacity: 0.3,
          }} />
          {/* Animated data stream on the line */}
          <div style={{
            position: 'absolute', left: 38, top: 0, width: 6, height: 30,
            background: 'linear-gradient(to bottom, transparent, var(--teal-400), transparent)',
            animation: 'data-stream-vertical 4s linear infinite',
            opacity: 0.5,
          }} />

          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
