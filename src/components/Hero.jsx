import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowDown, FiPlay, FiMonitor } from 'react-icons/fi'
import ParticleField from './ParticleField'
import { useMouseParallax } from '../hooks/useScrollAnimations'

const badges = [
  { icon: '🏥', label: 'SIH 2026', sub: 'Problem 26047' },
  { icon: '🔬', label: 'MedTech', sub: 'HealthTech' },
  { icon: '🏛️', label: 'QUBITS', sub: 'RCCIIT' },
]

const techStack = [
  { icon: '⚛️', name: 'React' },
  { icon: '⚡', name: 'FastAPI' },
  { icon: '🐍', name: 'Python' },
  { icon: '📊', name: 'TypeScript' },
]

// Floating holographic UI element
function FloatingHoloCard({ style, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        padding: '10px 16px',
        background: 'rgba(14, 165, 160, 0.06)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(14, 165, 160, 0.15)',
        borderRadius: 12,
        fontSize: '0.72rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--teal-300)',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

// Orbiting ring decoration
function OrbitingBadge({ icon, radius, speed, size = 32 }) {
  const [angle, setAngle] = useState(0)
  useEffect(() => {
    let raf
    const animate = () => {
      setAngle(a => (a + speed) % 360)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [speed])

  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius * 0.3

  return (
    <div style={{
      position: 'absolute',
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      width: size, height: size, borderRadius: '50%',
      background: 'rgba(14, 165, 160, 0.08)',
      border: '1px solid rgba(14, 165, 160, 0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: `${size * 0.5}px`,
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 0 15px rgba(14, 165, 160, 0.1)',
      pointerEvents: 'none',
    }}>
      {icon}
    </div>
  )
}

export default function Hero() {
  const [typedLine1, setTypedLine1] = useState('')
  const [typedLine2, setTypedLine2] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const mouseOffset = useMouseParallax(0.015)

  const line1 = 'Smart Digital Patient Case-Taking & Clinical Records'
  const line2 = 'Transform patient registration, clinical case-taking, medical documents and AI-assisted summarization into one intelligent digital workflow.'

  useEffect(() => {
    let i = 0
    const t1 = setInterval(() => {
      if (i < line1.length) { setTypedLine1(line1.slice(0, i + 1)); i++ }
      else {
        clearInterval(t1)
        let j = 0
        const t2 = setInterval(() => {
          if (j < line2.length) { setTypedLine2(line2.slice(0, j + 1)); j++ }
          else clearInterval(t2)
        }, 12)
      }
    }, 35)

    const blink = setInterval(() => setShowCursor(c => !c), 530)
    return () => { clearInterval(t1); clearInterval(blink) }
  }, [])

  return (
    <section id="home" style={{
      position: 'relative', minHeight: '100vh', display: 'flex',
      alignItems: 'center', overflow: 'hidden',
    }}>
      <ParticleField />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(14,165,160,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Floating holographic UI elements (mouse-reactive) */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <FloatingHoloCard
          delay={1.8}
          style={{
            left: '8%', top: '20%',
            transform: `translate(${mouseOffset.x * 2}px, ${mouseOffset.y * 2}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#10b981' }}>●</span> Patient Active
          </div>
        </FloatingHoloCard>

        <FloatingHoloCard
          delay={2.0}
          style={{
            right: '8%', top: '25%',
            transform: `translate(${mouseOffset.x * -1.5}px, ${mouseOffset.y * 1.5}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#8b5cf6' }}>●</span> AI Processing
          </div>
        </FloatingHoloCard>

        <FloatingHoloCard
          delay={2.2}
          style={{
            left: '5%', bottom: '25%',
            transform: `translate(${mouseOffset.x * 1.8}px, ${mouseOffset.y * -1.8}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#3b82f6' }}>●</span> Records Secured
          </div>
        </FloatingHoloCard>

        <FloatingHoloCard
          delay={2.4}
          style={{
            right: '6%', bottom: '20%',
            transform: `translate(${mouseOffset.x * -2}px, ${mouseOffset.y * -1.5}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#f59e0b' }}>●</span> OCR Complete
          </div>
        </FloatingHoloCard>

        {/* Orbiting icons */}
        <div style={{ position: 'absolute', left: '10%', top: '40%', width: 0, height: 0 }}>
          <OrbitingBadge icon="🩺" radius={60} speed={0.3} size={28} />
        </div>
        <div style={{ position: 'absolute', right: '12%', top: '35%', width: 0, height: 0 }}>
          <OrbitingBadge icon="🧬" radius={50} speed={-0.25} size={26} />
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '120px 24px 80px' }}>
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}
        >
          {badges.map((b, i) => (
            <div key={i} className="glass holo-shimmer" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 100,
              animation: `floating-badge ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}>
              <span style={{ fontSize: '1.1rem' }}>{b.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.label}</span>
              <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{b.sub}</span>
            </div>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-primary)', fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 900, lineHeight: 1.05, marginBottom: 8,
            transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.3}px)`,
            transition: 'transform 0.15s linear',
          }}
        >
          <span style={{ color: 'var(--white)' }}>Medi</span>
          <span className="text-gradient-animate">Kiosk</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-primary)', fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            fontWeight: 600, color: 'var(--teal-300)', marginBottom: 16,
            minHeight: '2em',
          }}
        >
          {typedLine1}<span style={{ opacity: showCursor ? 1 : 0, color: 'var(--teal-400)' }}>|</span>
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            fontSize: '1.05rem', color: 'var(--gray-400)',
            maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.7,
            minHeight: '3em',
          }}
        >
          {typedLine2}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}
        >
          <button className="btn-primary glow-border" onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}>
            <span><FiPlay size={16} /> Start Patient Registration</span>
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            <FiMonitor size={16} /> Explore Platform
          </button>
        </motion.div>

        {/* Feature Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: 40,
          }}
        >
          {['AI ASSISTED', 'DOCTOR CONTROLLED', 'SECURE'].map((tag, i) => (
            <span key={i} className="badge badge-teal" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
              ● {tag}
            </span>
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}
        >
          {techStack.map((t, i) => (
            <div key={i} className="glass magnetic-hover" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 12,
              transition: 'all 0.3s ease', cursor: 'default',
              animationDelay: `${i * 0.1}s`,
            }}>
              <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{t.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ animation: 'float 2s ease-in-out infinite' }}
        >
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', letterSpacing: '0.15em', marginBottom: 8 }}>
            SCROLL TO EXPLORE
          </p>
          <FiArrowDown size={20} style={{ color: 'var(--teal-400)' }} />
        </motion.div>
      </div>
    </section>
  )
}
