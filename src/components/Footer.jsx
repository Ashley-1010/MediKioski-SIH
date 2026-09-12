import React from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer style={{ padding: '60px 0 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Disclaimer Banners with slide-in */}
      <div className="container" style={{ marginBottom: 40 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            padding: '16px 24px', borderRadius: 14, marginBottom: 12,
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: '1.2rem', marginTop: 2 }}
          >⚠️</motion.span>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fbbf24' }}>MediKiosk</strong> supports clinical intake and documentation. It does not replace doctors or autonomously diagnose patients.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            padding: '16px 24px', borderRadius: 14,
            background: 'rgba(14,165,160,0.06)', border: '1px solid rgba(14,165,160,0.15)',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '1.2rem', marginTop: 2 }}
          >🧪</motion.span>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--teal-300)' }}>Prototype</strong> — FHIR-ready, mock integrations. Human-in-the-loop: AI prepares, doctors verify.
          </p>
        </motion.div>
      </div>

      {/* Footer Content */}
      <div className="container" style={{ paddingBottom: 40 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 32, marginBottom: 40,
        }}>
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #0ea5a0, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 15px rgba(14,165,160,0.3)',
              }}>
                <FiShield size={18} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                Medi<span style={{ color: 'var(--teal-400)' }}>Kiosk</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 280 }}>
              Transforming patient registration, clinical case-taking, and AI-assisted documentation into one intelligent digital workflow.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
              color: 'var(--teal-400)', marginBottom: 16,
            }}>QUICK LINKS</h4>
            {['Features', 'How It Works', 'Patient Registration', 'Doctor Dashboard', 'AI Summary', 'Security'].map((link, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 6, color: 'var(--teal-300)' }}
                style={{
                  fontSize: '0.85rem', color: 'var(--gray-400)',
                  padding: '4px 0', cursor: 'pointer', transition: 'color 0.2s ease',
                }}
              >
                → {link}
              </motion.div>
            ))}
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
              color: 'var(--teal-400)', marginBottom: 16,
            }}>TEAM QUBITS</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.8 }}>
              <p>🏛️ RCC Institute of Information Technology</p>
              <p>🏆 Smart India Hackathon 2026</p>
              <p>📋 Problem ID: SIH26047</p>
              <p>🔬 Theme: MedTech / BioTech / HealthTech</p>
            </div>
          </motion.div>

          {/* Tech */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
              color: 'var(--teal-400)', marginBottom: 16,
            }}>TECHNOLOGY</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['⚛️ React', '📘 TypeScript', '⚡ FastAPI', '🐍 Python', '🐘 PostgreSQL', '🧠 AI/LLM'].map((t, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'default',
                  }}
                >{t}</motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar with gradient */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
            © 2026 Team QUBITS — Built with ❤️ for Indian Healthcare
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.2, y: -2,
                  background: 'rgba(14,165,160,0.15)',
                  color: 'var(--teal-400)',
                  boxShadow: '0 0 15px rgba(14,165,160,0.2)',
                }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gray-500)', cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
