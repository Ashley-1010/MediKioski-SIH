import React, { useState } from 'react'
import { FiMenu, FiX, FiShield, FiLogIn, FiUserPlus, FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi'
import useStore from '../store/useStore'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'patient-portal', label: 'Patient Portal' },
  { id: 'registration', label: 'Registration' },
  { id: 'reception', label: 'Reception', role: 'receptionist' },
  { id: 'doctor', label: 'Doctor', role: 'doctor' },
  { id: 'ai', label: 'AI' },
  { id: 'security', label: 'Security' },
  { id: 'technology', label: 'Technology' },
  { id: 'future', label: 'Future Scope' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentPage = useStore((s) => s.currentPage)
  const setCurrentPage = useStore((s) => s.setCurrentPage)
  const role = useStore((s) => s.role)
  const staff = useStore((s) => s.staff)
  const logout = useStore((s) => s.logout)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)

  const activeSection = currentPage
  const goTo = (id) => {
    setMobileOpen(false)
    setCurrentPage(id)
    window.scrollTo({ top: 0 })
  }

  // Role-based access control: hide dashboards from unauthorized roles
  const links = navLinks.filter((l) => !l.role || l.role === role)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '12px 0',
        background: 'rgba(6, 13, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          maxWidth: 'var(--container-max)', margin: '0 auto',
          padding: '0 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
               onClick={() => goTo('home')}>
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
            {links.slice(0, 8).map(link => (
              <button key={link.id} onClick={() => goTo(link.id)} style={{
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
            {staff ? (
              <>
                <div className="glass" style={{
                  padding: '6px 14px', borderRadius: 100, display: 'flex',
                  alignItems: 'center', gap: 8, border: '1px solid rgba(14,165,160,0.3)',
                }}>
                  <FiUser size={13} style={{ color: 'var(--teal-400)' }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--teal-300)', fontFamily: 'var(--font-mono)' }}>
                    {staff.occupation.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-300)' }}>• {staff.name}</span>
                </div>
                <button className="btn-primary" onClick={() => goTo(role === 'doctor' ? 'doctor' : 'reception')} style={{
                  padding: '8px 16px', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>My Dashboard</span>
                </button>
                <button className="btn-secondary" onClick={logout} style={{
                  padding: '8px 12px', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <FiLogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <button className="btn-secondary" onClick={() => goTo('staff-portal')} style={{
                  padding: '8px 16px', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <FiLogIn size={14} /> <span>Staff Login</span>
                </button>
                <button className="btn-primary glow-border next-pulse" onClick={() => goTo('patient-portal')} style={{
                  padding: '8px 16px', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span><FiUserPlus size={14} /> Patient Portal</span>
                </button>
              </>
            )}
            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-label="Toggle theme" style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--teal-300)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}>
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
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
        }} className="drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="mobile-drawer" style={{
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
            {links.map((link, i) => (
              <button key={link.id} onClick={() => goTo(link.id)} style={{
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
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: 16 }}>
              <button className="theme-toggle" onClick={toggleTheme} style={{
                width: '100%', marginBottom: 8, padding: '10px 16px',
                borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)', color: 'var(--teal-300)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              }}>
                {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              {staff ? (
                <>
                  <div style={{ padding: '0 16px', marginBottom: 12, fontSize: '0.8rem', color: 'var(--teal-300)', fontFamily: 'var(--font-mono)' }}>
                    {staff.occupation.toUpperCase()} • {staff.name}
                  </div>
                  <button className="btn-secondary" onClick={() => { logout(); setMobileOpen(false) }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <FiLogOut size={14} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-secondary" onClick={() => goTo('staff-portal')}
                    style={{ width: '100%', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <FiLogIn size={14} /> Staff Login
                  </button>
                  <button className="btn-primary glow-border next-pulse" onClick={() => goTo('patient-portal')}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span><FiUserPlus size={14} /> Patient Portal</span>
                  </button>
                </>
              )}
            </div>
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
