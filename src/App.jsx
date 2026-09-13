import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import ScrollStory from './components/ScrollStory'
import Registration from './components/Registration'
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
import Login from './pages/Login'
import StaffRegister from './pages/StaffRegister'
import PatientRegister from './pages/PatientRegister'
import PatientDashboard from './pages/PatientDashboard'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? window.scrollY / h : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: 3, zIndex: 9999,
      width: `${progress * 100}%`,
      background: 'linear-gradient(90deg, var(--teal-500), var(--electric-500), var(--violet-500))',
      transition: 'width 0.1s linear',
    }} />
  )
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 30, right: 30, zIndex: 999,
        width: 48, height: 48, borderRadius: 14,
        background: 'linear-gradient(135deg, var(--teal-500), var(--electric-500))',
        border: 'none', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(14,165,160,0.4)',
        transition: 'all 0.3s ease', color: 'white', fontSize: '1.2rem',
      }}
    >
      ↑
    </button>
  )
}

function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Features />
      <ScrollStory />
      <Registration />
      <ReceptionDashboard />
      <DoctorDashboard />
      <AISummary />
      <OCRScanner />
      <AyurvedaSection />
      <RBACSection />
      <SecuritySection />
      <TechStack />
      <DataFlow />
      <FutureScope />
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/staff" element={<StaffRegister />} />
        <Route path="/register/patient" element={<PatientRegister />} />

        {/* Patient */}
        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        {/* Patient case-taking */}
        <Route
          path="/patient/registration/personal"
          element={<Registration />}
        />
        <Route
          path="/patient/registration/consent"
          element={<Registration />}
        />
        <Route
          path="/patient/registration/medical"
          element={<Registration />}
        />
        <Route
          path="/patient/registration/ayurveda"
          element={<Registration />}
        />
        <Route
          path="/patient/registration/documents"
          element={<Registration />}
        />
        <Route
          path="/patient/registration/review"
          element={<Registration />}
        />
        <Route
          path="/patient/registration"
          element={<Navigate
                    to="/patient/registration/personal"
                    replace
                  />
               }
        />
        {/* Receptionist */}
        <Route
          path="/reception/dashboard"
          element={<ReceptionDashboard />}
        />

        {/* Doctor */}
        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}
