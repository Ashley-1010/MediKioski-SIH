import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiUser, FiShield, FiFileText, FiHeart, FiUpload, FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import useStore from '../store/useStore'

const steps = [
  { icon: <FiUser size={18} />, label: 'Personal' },
  { icon: <FiShield size={18} />, label: 'Consent' },
  { icon: <FiFileText size={18} />, label: 'Medical' },
  { icon: <FiHeart size={18} />, label: 'Ayurveda' },
  { icon: <FiUpload size={18} />, label: 'Documents' },
  { icon: <FiCheckCircle size={18} />, label: 'Review' },
]

const InputField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'block', fontSize: '0.8rem', color: 'var(--teal-300)',
      fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>{label}</label>
    <input className="input-field" type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} />
  </div>
)

const SelectField = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'block', fontSize: '0.8rem', color: 'var(--teal-300)',
      fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>{label}</label>
    <select className="input-field" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

const TextareaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'block', fontSize: '0.8rem', color: 'var(--teal-300)',
      fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>{label}</label>
    <textarea className="input-field" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} style={{ resize: 'vertical' }} />
  </div>
)

function StepPersonal({ data, update }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
      <InputField label="Full Name" value={data.fullName} onChange={v => update({ fullName: v })} placeholder="Enter full name" />
      <InputField label="Date of Birth" value={data.dob} onChange={v => update({ dob: v })} type="date" />
      <SelectField label="Gender" value={data.gender} onChange={v => update({ gender: v })} options={['Male', 'Female', 'Other']} />
      <InputField label="Phone" value={data.phone} onChange={v => update({ phone: v })} placeholder="+91 XXXXX XXXXX" />
      <InputField label="Email" value={data.email} onChange={v => update({ email: v })} placeholder="email@example.com" type="email" />
      <InputField label="Address" value={data.address} onChange={v => update({ address: v })} placeholder="Full address" />
      <InputField label="Emergency Contact Name" value={data.emergencyContact} onChange={v => update({ emergencyContact: v })} placeholder="Name" />
      <InputField label="Emergency Contact Phone" value={data.emergencyPhone} onChange={v => update({ emergencyPhone: v })} placeholder="Phone" />
    </div>
  )
}

function StepConsent({ data, update }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <div className="glass-card" style={{ borderColor: 'var(--teal-400)30', padding: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: 16, color: 'var(--teal-300)' }}>
          📋 Digital Consent Form
        </h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray-300)', lineHeight: 1.8, marginBottom: 24 }}>
          <p>I, <strong style={{ color: 'var(--white)' }}>{data.fullName || '[Patient Name]'}</strong>, hereby give my informed consent for MediKiosk to:</p>
          <ul style={{ margin: '12px 0 12px 20px' }}>
            <li>Collect and process my personal and medical information</li>
            <li>Store my health records securely in the system</li>
            <li>Use AI-assisted tools to generate clinical summaries for doctor review</li>
            <li>Process uploaded medical documents via OCR</li>
          </ul>
          <p>I understand that:</p>
          <ul style={{ margin: '12px 0 12px 20px' }}>
            <li>The AI-generated summary is for <strong style={{ color: 'var(--white)' }}>documentation assistance only</strong></li>
            <li>A qualified doctor will review, verify, and approve all clinical information</li>
            <li>I can request deletion of my data at any time</li>
          </ul>
        </div>
        <label style={{
          display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
          padding: 16, background: data.consentGiven ? 'rgba(14,165,160,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${data.consentGiven ? 'var(--teal-400)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12, transition: 'all 0.3s ease',
        }}>
          <input type="checkbox" checked={data.consentGiven}
            onChange={e => update({ consentGiven: e.target.checked, consentDate: e.target.checked ? new Date().toISOString() : '' })}
            style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--teal-400)' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
              I give my informed consent
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>
              I have read and understood the above information and voluntarily consent to data collection and processing.
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

function StepMedical({ data, update }) {
  return (
    <div>
      <TextareaField label="Chief Complaint" value={data.chiefComplaint} onChange={v => update({ chiefComplaint: v })} placeholder="Primary reason for visit" rows={2} />
      <TextareaField label="History of Present Illness" value={data.historyOfPresentIllness} onChange={v => update({ historyOfPresentIllness: v })} placeholder="Detailed description of current symptoms, onset, duration, severity..." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <TextareaField label="Past Medical History" value={data.pastMedicalHistory} onChange={v => update({ pastMedicalHistory: v })} placeholder="Previous diagnoses, chronic conditions" />
        <TextareaField label="Past Surgical History" value={data.pastSurgicalHistory} onChange={v => update({ pastSurgicalHistory: v })} placeholder="Previous surgeries" />
        <TextareaField label="Current Medications" value={data.currentMedications} onChange={v => update({ currentMedications: v })} placeholder="Current medications with dosage" />
        <TextareaField label="Allergies" value={data.allergies} onChange={v => update({ allergies: v })} placeholder="Drug allergies, food allergies" />
        <TextareaField label="Family History" value={data.familyHistory} onChange={v => update({ familyHistory: v })} placeholder="Family medical history" />
        <TextareaField label="Personal History" value={data.personalHistory} onChange={v => update({ personalHistory: v })} placeholder="Smoking, alcohol, exercise habits" />
      </div>
      <TextareaField label="Review of Systems" value={data.reviewOfSystems} onChange={v => update({ reviewOfSystems: v })} placeholder="Systematic review of body systems" />
    </div>
  )
}

function StepAyurveda({ data, update }) {
  const dashavidha = data.dashavidhaPariksha || {}
  const updateDashavidha = (key, val) => update({ dashavidhaPariksha: { ...dashavidha, [key]: val } })

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        <SelectField label="Prakriti (Constitution)" value={data.prakriti} onChange={v => update({ prakriti: v })}
          options={['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Sama']} />
        <SelectField label="Vikriti (Current Imbalance)" value={data.vikriti} onChange={v => update({ vikriti: v })}
          options={['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Sama']} />
        <SelectField label="Agni (Digestive Fire)" value={data.agni} onChange={v => update({ agni: v })}
          options={['Sama (Balanced)', 'Vishama (Irregular)', 'Tikshna (Sharp/Strong)', 'Manda (Dull/Weak)', 'Vyavayi (Spreading)',]} />
        <SelectField label="Koshta (Bowel Habit)" value={data.koshta} onChange={v => update({ koshta: v })}
          options={['Krura (Hard/Constipated)', 'Madhyama (Moderate)', 'Slakshna (Soft/Loose)']} />
        <TextareaField label="Ahara-Vihara (Diet & Lifestyle)" value={data.aharaVihara} onChange={v => update({ aharaVihara: v })}
          placeholder="Dietary habits, daily routine, sleep patterns, exercise" />
      </div>

      <div className="glass-card" style={{ borderColor: 'rgba(14,165,160,0.2)' }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--teal-300)', marginBottom: 16 }}>
          🌿 Dashavidha Pariksha (Tenfold Examination)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            ['prakriti', 'Prakriti (Constitution)'],
            ['jihva', 'Jihva (Tongue)'],
            ['mala', 'Mala (Bowel)'],
            ['mutra', 'Mutra (Urine)'],
            ['shabda', 'Shabda (Voice)'],
            ['sparsha', 'Sparsha (Touch)'],
            ['drik', 'Drik (Eyes)'],
            ['akriti', 'Akriti (Appearance)'],
            ['satmya', 'Satmya (Adaptability)'],
            ['sara', 'Sara (Vitality)'],
          ].map(([key, label]) => (
            <InputField key={key} label={label} value={dashavidha[key] || ''} onChange={v => updateDashavidha(key, v)} placeholder="Enter observation" />
          ))}
        </div>
      </div>
    </div>
  )
}

function StepDocuments({ data, update }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = [...e.dataTransfer.files].map(f => ({ name: f.name, size: f.size, type: f.type, status: 'uploaded' }))
    update({ documents: [...(data.documents || []), ...files] })
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? 'var(--teal-400)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 20, padding: '48px 32px', textAlign: 'center',
          background: dragOver ? 'rgba(14,165,160,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.3s ease', cursor: 'pointer',
        }}
        onClick={() => {
          const fakeFiles = [
            { name: 'prescription_2024.pdf', size: 245000, type: 'application/pdf', status: 'uploaded' },
            { name: 'blood_test_report.jpg', size: 180000, type: 'image/jpeg', status: 'uploaded' },
          ]
          update({ documents: [...(data.documents || []), ...fakeFiles] })
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📤</div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.1rem', marginBottom: 8 }}>
          Upload Medical Documents
        </h3>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
          Drag and drop prescriptions, lab reports, discharge summaries<br />
          or click to browse
        </p>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginTop: 12 }}>
          Supports PDF, JPG, PNG, HEIC — Max 10MB per file
        </p>
      </div>

      {data.documents && data.documents.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--teal-300)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
            UPLOADED FILES
          </h4>
          {data.documents.map((doc, i) => (
            <div key={i} className="glass" style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              marginBottom: 8, borderRadius: 12,
            }}>
              <span style={{ fontSize: '1.3rem' }}>📎</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{doc.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  {(doc.size / 1024).toFixed(0)} KB
                </div>
              </div>
              <span className="badge badge-success">✓ Uploaded</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StepReview({ data }) {
  return (
    <div>
      <div className="glass-card" style={{ borderColor: 'rgba(14,165,160,0.2)', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--teal-300)', marginBottom: 16 }}>
          📋 Registration Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {[
            ['Full Name', data.fullName],
            ['Date of Birth', data.dob],
            ['Gender', data.gender],
            ['Phone', data.phone],
            ['Email', data.email],
            ['Consent', data.consentGiven ? '✓ Given' : '✗ Not Given'],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--white)', fontWeight: 500 }}>{v || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--electric-300)', marginBottom: 12 }}>
          📝 Clinical Information
        </h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray-300)', lineHeight: 1.8 }}>
          <p><strong style={{ color: 'var(--teal-300)' }}>Chief Complaint:</strong> {data.chiefComplaint || '—'}</p>
          <p><strong style={{ color: 'var(--teal-300)' }}>Medications:</strong> {data.currentMedications || '—'}</p>
          <p><strong style={{ color: 'var(--teal-300)' }}>Allergies:</strong> {data.allergies || '—'}</p>
          <p><strong style={{ color: 'var(--teal-300)' }}>Prakriti:</strong> {data.prakriti || '—'} | <strong style={{ color: 'var(--teal-300)' }}>Vikriti:</strong> {data.vikriti || '—'}</p>
          <p><strong style={{ color: 'var(--teal-300)' }}>Documents:</strong> {data.documents?.length || 0} files uploaded</p>
        </div>
      </div>
    </div>
  )
}

export default function Registration() {
  const navigate = useNavigate()
  const location = useLocation()
  const { registrationStep, setRegistrationStep, patientData, updatePatientData, submitRegistration, patientId, registrationId, patients } = useStore()
  const setCurrentPage = useStore((s) => s.setCurrentPage)
  const myRecord = patients.find((p) => p.regId === registrationId)

  const routes = [
    '/patient/registration/personal',
    '/patient/registration/consent',
    '/patient/registration/medical',
    '/patient/registration/ayurveda',
    '/patient/registration/documents',
    '/patient/registration/review'
  ]

  // Inside BrowserRouter (standalone route) the URL drives the step;
  // in the deck (`/`) the store's registrationStep drives it.
  const routerIndex = routes.indexOf(location.pathname)
  const currentStep = routerIndex >= 0
    ? routerIndex
    : (typeof registrationStep === 'number' ? registrationStep : 0)

  const goNext = () => {
    if (currentStep === 0 && !patientData.fullName.trim()) {
      alert('Please enter the patient name.')
      return
    }
    if (currentStep === 1 && !patientData.consentGiven) {
      alert('Please provide consent before continuing.')
      return
    }
    if (currentStep < 5) {
      if (routerIndex >= 0) navigate(routes[currentStep + 1])
      else setRegistrationStep(currentStep + 1)
    }
  }

  const goPrevious = () => {
    if (currentStep > 0) {
      if (routerIndex >= 0) navigate(routes[currentStep - 1])
      else setRegistrationStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!patientData.consentGiven) {
      alert('Patient consent is required.')
      return
    }
    try {
      await submitRegistration()
    } catch (error) {
      console.error('Registration failed:', error)
      alert(error?.message || 'Registration failed. Please try again.')
    }
  }

  const renderStep = () => {
    const props = {
      data: patientData,
      update: updatePatientData
    }

    switch (currentStep) {
      case 0:
        return <StepPersonal {...props} />

      case 1:
        return <StepConsent {...props} />

      case 2:
        return <StepMedical {...props} />

      case 3:
        return <StepAyurveda {...props} />

      case 4:
        return <StepDocuments {...props} />

      case 5:
        return <StepReview {...props} />

      default:
        return <StepPersonal {...props} />
    }
  }

  return (
    <section
      id="registration"
      style={{
        padding: 'var(--section-padding)'
      }}
    >
      <div className="container">

        {/* Header */}

        <div className="section-header">

          <div className="section-label">
            🧑‍⚕️ PATIENT REGISTRATION
          </div>

          <h2 className="section-title">
            Register a New Patient
          </h2>

          <p className="section-subtitle">
            Multi-step guided registration with medical history
            and Ayurveda assessment
          </p>

        </div>


        {/* Step Indicator */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 48,
            flexWrap: 'wrap'
          }}
        >

          {steps.map((step, index) => (

            <div
              key={index}
              onClick={() => {
                if (index <= currentStep) {
                  if (routerIndex >= 0) navigate(routes[index])
                  else setRegistrationStep(index)
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 100,
                cursor:
                  index <= currentStep
                    ? 'pointer'
                    : 'default',

                background:
                  index === currentStep
                    ? 'rgba(14,165,160,0.15)'
                    : 'rgba(255,255,255,0.03)',

                border:
                  `1px solid ${
                    index === currentStep
                      ? 'var(--teal-400)'
                      : index < currentStep
                        ? 'rgba(14,165,160,0.3)'
                        : 'rgba(255,255,255,0.08)'
                  }`,

                transition: 'all 0.3s ease'
              }}
            >

              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background:
                    index < currentStep
                      ? 'var(--teal-500)'
                      : index === currentStep
                        ? 'var(--teal-400)'
                        : 'rgba(255,255,255,0.1)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  fontSize: '0.75rem',
                  fontWeight: 600,

                  color:
                    index <= currentStep
                      ? 'white'
                      : 'var(--gray-500)'
                }}
              >

                {index < currentStep
                  ? '✓'
                  : step.icon}

              </span>


              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 500,

                  color:
                    index === currentStep
                      ? 'var(--teal-300)'
                      : index < currentStep
                        ? 'var(--gray-300)'
                        : 'var(--gray-500)'
                }}
              >
                {step.label}
              </span>

            </div>

          ))}

        </div>


        {/* Step Content */}

        <div
          className="glass-strong"
          style={{
            padding: 'clamp(24px, 4vw, 40px)',
            maxWidth: 900,
            margin: '0 auto'
          }}
        >

          <AnimatePresence mode="wait">

            <motion.div
              key={location.pathname}

              initial={{
                opacity: 0,
                x: 20
              }}

              animate={{
                opacity: 1,
                x: 0
              }}

              exit={{
                opacity: 0,
                x: -20
              }}

              transition={{
                duration: 0.3
              }}
            >

              {renderStep()}

            </motion.div>

          </AnimatePresence>

          {/* Navigation — Next action is always the obvious one */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button
              className="btn-secondary"
              onClick={goPrevious}
              disabled={currentStep === 0}
              style={{
                opacity:
                  currentStep === 0
                    ? 0.3
                    : 1
              }}
            >
              <FiArrowLeft size={16} />
              Previous
            </button>
            {currentStep < 5 ? (
              <button className="btn-primary glow-border next-pulse" onClick={goNext}>
                <span>Next: {steps[currentStep + 1].label} <FiArrowRight size={16} /></span>
              </button>

            ) : (
              <button className="btn-primary glow-border next-pulse" onClick={handleSubmit} style={{
                background: 'linear-gradient(135deg, #10b981, #0ea5a0)',
              }}>
                <span><FiCheckCircle size={16} /> Submit Registration</span>
              </button>

            )}

          </div>

        </div>


        {/* Registration Result */}

        {patientId && (

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8
            }}

            animate={{
              opacity: 1,
              scale: 1
            }}

            style={{
              maxWidth: 500,
              margin: '32px auto 0'
            }}
          >

            <div
              className="glass-strong"
              style={{
                padding: 32,
                textAlign: 'center',

                border:
                  '1px solid rgba(14,165,160,0.3)',

                boxShadow:
                  '0 0 40px rgba(14,165,160,0.15)',

                animation:
                  'hologram 4s ease-in-out infinite'
              }}
            >

              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--teal-400)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.15em',
                  marginBottom: 12
                }}
              >
                ✅ REGISTRATION COMPLETE
              </div>


              <div
                style={{
                  marginBottom: 16
                }}
              >

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--gray-500)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4
                  }}
                >
                  PATIENT ID
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--teal-300)',
                    letterSpacing: '0.05em'
                  }}
                >
                  {patientId}
                </div>

              </div>


              <div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--gray-500)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4
                  }}
                >
                  REGISTRATION ID
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--electric-300)',
                    letterSpacing: '0.05em'
                  }}
                >
                  {registrationId}
                </div>

              </div>

              {/* Patient-permitted status only (no doctor/clinical data) */}
              {myRecord && (
                <div style={{
                  marginTop: 20, padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(14,165,160,0.08)',
                  border: '1px solid rgba(14,165,160,0.3)',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--teal-400)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 6 }}>
                    CURRENT STATUS
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--teal-300)', textTransform: 'capitalize' }}>
                    {myRecord.status.replace('-', ' ')}
                  </div>
                  {typeof myRecord.queueNumber === 'number' && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginTop: 4 }}>
                      You are number <strong style={{ color: 'var(--teal-300)' }}>#{myRecord.queueNumber}</strong> in the reception queue — the receptionist will call you.
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                <button className="btn-primary glow-border next-pulse" onClick={() => setCurrentPage('my-status')} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>View My Status <FiArrowRight size={14} /></span>
                </button>
                <button className="btn-secondary" onClick={() => setCurrentPage('home')} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  Back to Home
                </button>
              </div>
              <button className="btn-secondary" onClick={() => navigate('/patient/dashboard')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Continue to Patient Portal
              </button>
            </div>

          </motion.div>

        )}

      </div>
    </section>
  )
}
