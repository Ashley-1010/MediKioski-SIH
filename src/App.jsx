import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import PageDeck from './components/PageDeck'
import useStore from './store/useStore'
import Hero from './components/Hero'
import Features from './components/Features'
import ScrollStory from './components/ScrollStory'
import PatientPortal from './components/PatientPortal'
import Registration from './components/Registration'
import PatientStatus from './components/PatientStatus'
import StaffPortal from './components/StaffPortal'
import ReceptionDashboard from './components/ReceptionDashboard'
import DoctorDashboard from './components/DoctorDashboard'
import AISummary from './components/AISummary'
import OCRScanner from './components/OCRScanner'
import AyurvedaSection from './components/AyurvedaSection'
import RBACSection from './components/RBACSection'
import SecuritySection from './components/SecuritySection'
import TechStack from './components/TechStack'
import DataFlow from './components/DataFlow'
import FutureScope from './components/FutureScope'
import Footer from './components/Footer'

/* Full-viewport page wrapper: each page fills the screen; only the page
   itself may scroll internally if its content exceeds the viewport. */
function P({ children, pad = true }) {
  return (
    <div className="deck-page" style={pad ? undefined : { padding: 0 }}>
      {children}
    </div>
  )
}

// Role-based access control: dashboards are only reachable by their role.
const pageRoles = {
  reception: 'receptionist',
  doctor: 'doctor',
}

export default function App() {
  const currentPage = useStore((s) => s.currentPage)
  const setCurrentPage = useStore((s) => s.setCurrentPage)
  const role = useStore((s) => s.role)
  const theme = useStore((s) => s.theme)

  // Apply theme class to <html> for the CSS variable overrides
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  const pages = [
    { id: 'home', label: 'Home', component: <P pad={false}><Hero /></P> },
    { id: 'features', label: 'Features', component: <P><Features /></P> },
    { id: 'how-it-works', label: 'How It Works', component: <P><ScrollStory /></P> },
    { id: 'patient-portal', label: 'Patient Portal', component: <P><PatientPortal /></P> },
    { id: 'registration', label: 'Patient Registration', component: <P><Registration /></P> },
    { id: 'my-status', label: 'My Status', component: <P><PatientStatus /></P> },
    { id: 'staff-portal', label: 'Staff Portal', component: <P><StaffPortal /></P> },
    { id: 'reception', label: 'Receptionist Dashboard', component: <P><ReceptionDashboard /></P> },
    { id: 'doctor', label: 'Doctor Dashboard', component: <P><DoctorDashboard /></P> },
    { id: 'ai', label: 'AI Summary', component: <P><AISummary /></P> },
    { id: 'ocr', label: 'OCR Scanner', component: <P><OCRScanner /></P> },
    { id: 'ayurveda', label: 'Ayurveda', component: <P><AyurvedaSection /></P> },
    { id: 'rbac', label: 'Access Control', component: <P><RBACSection /></P> },
    { id: 'security', label: 'Security', component: <P><SecuritySection /></P> },
    { id: 'technology', label: 'Technology', component: <P><TechStack /></P> },
    { id: 'dataflow', label: 'Data Flow', component: <P><DataFlow /></P> },
    { id: 'future', label: 'Future Scope', component: <P><FutureScope /></P> },
    { id: 'footer', label: 'About', component: <P pad={false}><Footer /></P> },
  ]

  // Hide & guard role-restricted dashboards
  const allowed = (id) => !pageRoles[id] || role === pageRoles[id]
  const visiblePages = pages.filter((p) => allowed(p.id))

  // Guard: redirect away from pages the current role cannot access
  useEffect(() => {
    if (!allowed(currentPage)) {
      setCurrentPage(role ? 'home' : 'staff-portal')
    }
  }, [currentPage, role])

  // Deep-link: restore page from URL hash on load (e.g. #staff-portal)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && visiblePages.some((p) => p.id === hash) && hash !== currentPage) {
      setCurrentPage(hash)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reflect the current page in the URL hash so it is shareable
  useEffect(() => {
    if (window.location.hash !== `#${currentPage}`) {
      window.history.replaceState(null, '', `#${currentPage}`)
    }
  }, [currentPage])

  return (
    <>
      <Navbar />
      <PageDeck pages={visiblePages} page={currentPage} setPage={setCurrentPage} />
    </>
  )
}
