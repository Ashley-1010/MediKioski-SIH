import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFileText, FiCheck } from 'react-icons/fi'

const states = [
  { label: 'Uploading', icon: '📤', progress: 15, color: '#3b82f6' },
  { label: 'Scanning', icon: '🔍', progress: 30, color: '#0ea5a0' },
  { label: 'Extracting Text', icon: '📝', progress: 50, color: '#8b5cf6' },
  { label: 'Structuring Data', icon: '📊', progress: 70, color: '#f59e0b' },
  { label: 'Summarizing', icon: '🧠', progress: 85, color: '#a855f7' },
  { label: 'Ready for Review', icon: '✅', progress: 100, color: '#10b981' },
]

export default function OCRScanner() {
  const [scanning, setScanning] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(-1)

  const startScan = () => {
    setScanning(true)
    setCurrentIdx(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      if (i < states.length) setCurrentIdx(i)
      else { clearInterval(interval); setTimeout(() => { setScanning(false) }, 1000) }
    }, 700)
  }

  return (
    <section style={{ padding: 'var(--section-padding)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">📷 DOCUMENT AI</div>
          <h2 className="section-title">OCR Document Scanner</h2>
          <p className="section-subtitle">
            Digitize handwritten prescriptions, printed lab reports, and discharge summaries
          </p>
        </div>

        <div className="glass-strong holo-shimmer" style={{ padding: 32, maxWidth: 700, margin: '0 auto' }}>
          {/* Scanner Visual */}
          <div style={{
            position: 'relative', height: 220, borderRadius: 16,
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden', marginBottom: 24,
          }}>
            {/* Corner brackets */}
            {[
              { top: 10, left: 10 },
              { top: 10, right: 10 },
              { bottom: 10, left: 10 },
              { bottom: 10, right: 10 },
            ].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute', ...pos,
                width: 20, height: 20,
                borderTop: i < 2 ? '2px solid rgba(14,165,160,0.3)' : 'none',
                borderBottom: i >= 2 ? '2px solid rgba(14,165,160,0.3)' : 'none',
                borderLeft: i % 2 === 0 ? '2px solid rgba(14,165,160,0.3)' : 'none',
                borderRight: i % 2 === 1 ? '2px solid rgba(14,165,160,0.3)' : 'none',
              }} />
            ))}

            {/* Document */}
            <motion.div
              animate={scanning ? {
                boxShadow: [
                  '0 0 0px rgba(14,165,160,0)',
                  '0 0 30px rgba(14,165,160,0.3)',
                  '0 0 0px rgba(14,165,160,0)',
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 120, height: 150, borderRadius: 8,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                padding: 12, transition: 'all 0.5s ease',
              }}
            >
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  height: 3, borderRadius: 2, marginBottom: 6,
                  width: `${60 + Math.random() * 30}%`,
                  background: currentIdx >= 2 ? 'rgba(14,165,160,0.3)' : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.5s ease',
                }} />
              ))}
              {/* Document icon */}
              <div style={{
                textAlign: 'center', marginTop: 8, fontSize: '1.5rem', opacity: 0.3,
              }}>📄</div>
            </motion.div>

            {/* Holographic scan line */}
            {scanning && (
              <motion.div
                initial={{ top: '10%', opacity: 0 }}
                animate={{ top: ['10%', '90%', '10%'], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', left: '20%', width: '60%',
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${states[currentIdx]?.color || 'var(--teal-400)'}, transparent)`,
                  boxShadow: `0 0 20px ${states[currentIdx]?.color || 'var(--teal-400)'}, 0 0 40px ${states[currentIdx]?.color || 'var(--teal-400)'}`,
                  borderRadius: 2,
                }}
              />
            )}

            {/* Scanning grid overlay */}
            {scanning && (
              <div style={{
                position: 'absolute', inset: 0,
                background: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(14,165,160,0.03) 20px, rgba(14,165,160,0.03) 21px)`,
                pointerEvents: 'none',
              }} />
            )}

            {/* Extracted Text Panel */}
            <AnimatePresence>
              {currentIdx >= 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  style={{
                    position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)',
                    padding: 14, background: 'rgba(14,165,160,0.08)', borderRadius: 10,
                    border: '1px solid rgba(14,165,160,0.2)', width: 200,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ fontSize: '0.65rem', color: 'var(--teal-400)', fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: '0.05em' }}>
                    EXTRACTED TEXT
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-300)', lineHeight: 1.6 }}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>Paracetamol 500mg</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>Tab TDS x 5 days</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>BP: 130/85</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Temp: 102.4°F</motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Processing indicator */}
            {scanning && (
              <div style={{
                position: 'absolute', left: 30, bottom: 20,
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 8,
                background: 'rgba(14,165,160,0.1)', border: '1px solid rgba(14,165,160,0.2)',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--teal-400)',
                  animation: 'pulse-glow 1s ease infinite',
                }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--teal-300)', fontFamily: 'var(--font-mono)' }}>
                  {states[currentIdx]?.label || 'Processing'}...
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar with glow */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: currentIdx >= 0 ? `${states[Math.min(currentIdx, states.length - 1)].progress}%` : '0%' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%', borderRadius: 2,
                  background: `linear-gradient(90deg, ${states[Math.max(0, currentIdx)]?.color || 'var(--teal-500)'}, ${states[Math.min(currentIdx, states.length - 1)]?.color || 'var(--electric-500)'})`,
                  boxShadow: currentIdx >= 0 ? `0 0 10px ${states[Math.min(currentIdx, states.length - 1)]?.color}40` : 'none',
                  transition: 'box-shadow 0.5s ease',
                }}
              />
            </div>
          </div>

          {/* State Indicators with ripple */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
            {states.map((s, i) => (
              <motion.div
                key={i}
                animate={i === currentIdx ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem',
                  color: i <= currentIdx ? s.color : 'var(--gray-500)',
                  transition: 'color 0.3s ease',
                }}
              >
                <motion.span
                  animate={i === currentIdx ? {
                    boxShadow: [`0 0 0px ${s.color}00`, `0 0 8px ${s.color}40`, `0 0 0px ${s.color}00`],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    display: 'inline-flex', width: 20, height: 20, borderRadius: '50%',
                    alignItems: 'center', justifyContent: 'center',
                    background: i <= currentIdx ? `${s.color}20` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${i <= currentIdx ? `${s.color}40` : 'rgba(255,255,255,0.08)'}`,
                    fontSize: '0.6rem',
                  }}
                >
                  {i < currentIdx ? '✓' : i === currentIdx ? '●' : s.icon}
                </motion.span>
                <span>{s.label}</span>
              </motion.div>
            ))}
          </div>

          {!scanning && currentIdx < 0 && (
            <div style={{ textAlign: 'center' }}>
              <button className="btn-primary glow-border" onClick={startScan}>
                <span>🔍 Start OCR Scan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
