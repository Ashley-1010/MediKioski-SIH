import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiMic, FiFileText, FiCpu, FiShield, FiLayers, FiUsers, FiDatabase, FiLock } from 'react-icons/fi'
import { useTilt } from '../hooks/useScrollAnimations'

const features = [
  { icon: <FiMic size={24} />, title: 'Multilingual Intake', desc: 'Patient registration in multiple Indian languages with voice and touch input support.', color: '#0ea5a0' },
  { icon: <FiFileText size={24} />, title: 'Smart Case-Taking', desc: 'Structured medical and Ayurveda information collection with guided workflow.', color: '#3b82f6' },
  { icon: <FiCpu size={24} />, title: 'AI Clinical Summary', desc: 'Neural-network-powered summarization with red-flag detection and completeness scoring.', color: '#8b5cf6' },
  { icon: <FiLayers size={24} />, title: 'OCR Document Processing', desc: 'Digitize handwritten prescriptions, lab reports, and discharge summaries via advanced OCR.', color: '#f59e0b' },
  { icon: <FiShield size={24} />, title: 'Doctor Verification', desc: 'Human-in-the-loop: AI prepares, doctors review, edit, and approve before consultation.', color: '#10b981' },
  { icon: <FiUsers size={24} />, title: 'Role-Based Access', desc: 'Patient, Receptionist, Doctor, Ayurvedic Doctor, and Admin roles with secure permissions.', color: '#ef4444' },
  { icon: <FiDatabase size={24} />, title: 'FHIR Interoperability', desc: 'Standards-compliant clinical data format for seamless hospital system integration.', color: '#06b6d4' },
  { icon: <FiLock size={24} />, title: 'Privacy & Security', desc: 'HIPAA-aligned data handling, consent management, and encrypted storage.', color: '#a855f7' },
]

function FeatureCard({ f, index }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(8)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card glow-border holo-shimmer"
      style={{ cursor: 'default', borderColor: `${f.color}15`, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
        background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
        opacity: 0.4, borderRadius: 1,
      }} />

      <div className="icon-glow" style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${f.color}15`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: f.color, marginBottom: 16,
        position: 'relative',
      }}>
        {f.icon}
        {/* Glow ring on hover */}
        <div style={{
          position: 'absolute', inset: -4, borderRadius: 14,
          border: `1px solid ${f.color}30`,
          animation: `glow-ring-expand 3s ease-in-out infinite`,
          animationDelay: `${index * 0.3}s`,
          pointerEvents: 'none',
        }} />
      </div>
      <h3 style={{
        fontFamily: 'var(--font-primary)', fontSize: '1.05rem',
        fontWeight: 600, marginBottom: 8, color: 'var(--white)',
      }}>{f.title}</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
        {f.desc}
      </p>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" style={{ padding: 'var(--section-padding)', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '20%', right: '-10%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(14,165,160,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div className="container">
        <div className="section-header">
          <div className="section-label">
            <span style={{ animation: 'pulse-glow 2s ease infinite', display: 'inline-block' }}>✦</span>
            CAPABILITIES
          </div>
          <h2 className="section-title">Platform Features</h2>
          <p className="section-subtitle">
            A comprehensive digital health platform combining AI, OCR, and clinical workflows into one seamless experience
          </p>
        </div>

        <div className="stagger-children" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
