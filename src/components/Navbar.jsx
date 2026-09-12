import React, { useState, useEffect } from 'react'
import { FiMenu, FiX, FiShield, FiLogIn, FiUserPlus } from 'react-icons/fi'
import useStore from '../store/useStore'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'registration', label: 'Registration' },
  { id: 'reception', label: 'Reception' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'ai', label: 'AI' },
  { id: 'security', label: 'Security' },
  { id: 'technology', label: 'Technology' },
  { id: 'future', label: 'Future Scope' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { currentPage, setCurrentPage } = useStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = navLinks.map(l => l.id)
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '12px 0' : '18px 0',
        background: scrolled ? 'rgba(6, 13, 26, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          maxWidth: 'var(--container-max)', margin: '0 auto',
          padding: '0 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
               onClick={() => scrollTo('home')}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #0ea5a0, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(14, 165, 160, 0.3)',
            }}>
              <FiShield size={20} color="white" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-primary)', fontWeight: 700,
                fontSize: '1.2rem', color: 'var(--white)',
              }}>Medi</span>
              <span style={{
                fontFamily: 'var(--font-primary)', fontWeight: 700,
                fontSize: '1.2rem', color: 'var(--teal-400)',
              }}>Kiosk</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {navLinks.slice(0, 8).map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)} style={{
                padding: '6px 12px', background: 'none', border: 'none',
                color: activeSection === link.id ? 'var(--teal-400)' : 'var(--gray-400)',
                fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500,
                cursor: 'pointer', borderRadius: 8,
                transition: 'all 0.2s ease',
                borderBottom: activeSection === link.id ? '2px solid var(--teal-400)' : '2px solid transparent',
              }}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn-secondary" style={{
              padding: '8px 16px', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <FiLogIn size={14} /> <span>Login</span>
            </button>
            <button className="btn-primary" style={{
              padding: '8px 16px', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span><FiUserPlus size={14} /> Register</span>
            </button>
            <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
              display: 'none', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
              padding: 8, color: 'white', cursor: 'pointer',
            }}>
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }} onClick={() => setMobileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: 300, background: 'rgba(6, 13, 26, 0.97)',
            backdropFilter: 'blur(30px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            padding: '24px', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <span style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                Medi<span style={{ color: 'var(--teal-400)' }}>Kiosk</span>
              </span>
              <button onClick={() => setMobileOpen(false)} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: 8, padding: 6, color: 'white', cursor: 'pointer',
              }}>
                <FiX size={18} />
              </button>
            </div>
            {navLinks.map((link, i) => (
              <button key={link.id} onClick={() => scrollTo(link.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 16px', background: 'none', border: 'none',
                color: activeSection === link.id ? 'var(--teal-400)' : 'var(--gray-300)',
                fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                cursor: 'pointer', borderRadius: 10, marginBottom: 4,
                borderLeft: activeSection === link.id ? '3px solid var(--teal-400)' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .nav-right .btn-secondary, .nav-right .btn-primary { display: none !important; }
          .nav-right .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
