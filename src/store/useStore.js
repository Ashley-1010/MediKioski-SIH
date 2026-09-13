import { create } from 'zustand'
import { api } from '../services/api'

const STATUS_FLOW = ['registered', 'waiting', 'checked-in', 'in-consultation', 'completed']
const today = () => new Date().toISOString().slice(0, 10)
const nextQueueNumber = (patients) => patients.reduce((m, p) => Math.max(m, p.queueNumber || 0), 0) + 1

// Demo registry (prototype data). New registrations are added to this list so
// Reception and Doctor dashboards share the same live records. When the API is
// reachable, dashboards hydrate from the backend instead.
export const demoPatients = [
  {
    id: 'PAT-00084721', regId: 'REG-2026-0911-0042', name: 'Ramesh Kumar', age: 52, gender: 'Male',
    phone: '+91 98300 11221', status: 'completed', queueNumber: null,
    chiefComplaint: 'High fever for 3 days with severe headache',
    vitals: { temp: '102.4°F', bp: '130/85 mmHg', hr: 92, spo2: 97 },
    medications: 'Paracetamol 500mg', allergies: 'Penicillin', history: 'Hypertension, Type 2 Diabetes',
    notes: [{ id: 1, date: '2025-11-10', text: 'Advised continuation of antihypertensives; reviewed lab reports. Fever managed symptomatically.' }],
    prescriptions: [{ id: 1, date: '2025-11-10', items: [{ name: 'Paracetamol', dose: '500mg', frequency: '3 times a day', duration: '5 days' }] }],
    reports: [
      { name: 'Blood Test Report (2026-08-15)', type: 'Lab Report', status: 'processed' },
      { name: 'Chest X-Ray (2025-11-10)', type: 'Imaging', status: 'processed' },
      { name: 'ECG Report (2026-09-12)', type: 'Cardiology', status: 'processing' },
    ],
    timeline: [
      { date: '2025-06-15', event: 'First visit — General checkup', status: 'completed' },
      { date: '2025-08-22', event: 'Follow-up — Blood pressure monitoring', status: 'completed' },
      { date: '2025-11-10', event: 'Emergency — Acute respiratory infection', status: 'completed' },
      { date: '2026-09-12', event: 'Current Visit — High fever for 3 days with severe headache', status: 'current' },
    ],
  },
  {
    id: 'PAT-00084722', regId: 'REG-2026-0912-0001', name: 'Priya Sharma', age: 34, gender: 'Female',
    phone: '+91 98311 22334', status: 'in-consultation', queueNumber: null,
    chiefComplaint: 'Persistent cough and chest tightness for 2 weeks',
    vitals: { temp: '98.6°F', bp: '118/76 mmHg', hr: 78, spo2: 98 },
    medications: 'None', allergies: 'None known', history: 'Asthma (childhood)',
    notes: [],
    prescriptions: [],
    reports: [{ name: 'Spirometry Report (2026-09-01)', type: 'Pulmonology', status: 'processed' }],
    timeline: [
      { date: '2026-01-20', event: 'First visit — Routine health screening', status: 'completed' },
      { date: '2026-09-12', event: 'Current Visit — Persistent cough and chest tightness for 2 weeks', status: 'current' },
    ],
  },
  {
    id: 'PAT-00084723', regId: 'REG-2026-0912-0002', name: 'Amit Patel', age: 45, gender: 'Male',
    phone: '+91 98322 33445', status: 'waiting', queueNumber: 1,
    chiefComplaint: 'Lower back pain radiating to left leg for 1 month',
    vitals: { temp: '98.4°F', bp: '125/82 mmHg', hr: 74, spo2: 99 },
    medications: 'Ibuprofen 400mg', allergies: 'Aspirin', history: 'Lumbar spondylosis',
    notes: [{ id: 1, date: '2026-02-14', text: 'Physiotherapy advised for lumbar pain; follow-up in 6 weeks.' }],
    prescriptions: [{ id: 1, date: '2026-02-14', items: [{ name: 'Ibuprofen', dose: '400mg', frequency: 'Twice a day', duration: '7 days' }] }],
    reports: [{ name: 'MRI Lumbar Spine (2026-02-10)', type: 'Imaging', status: 'processed' }],
    timeline: [
      { date: '2026-02-14', event: 'First visit — Lumbar pain evaluation', status: 'completed' },
      { date: '2026-09-12', event: 'Current Visit — Lower back pain radiating to left leg for 1 month', status: 'current' },
    ],
  },
  {
    id: 'PAT-00084724', regId: 'REG-2026-0912-0003', name: 'Sunita Devi', age: 28, gender: 'Female',
    phone: '+91 98333 44556', status: 'registered', queueNumber: 2,
    chiefComplaint: 'Abdominal pain and nausea for 3 days',
    vitals: { temp: '99.1°F', bp: '110/70 mmHg', hr: 82, spo2: 99 },
    medications: 'Omeprazole 20mg', allergies: 'None known', history: 'GERD',
    notes: [], prescriptions: [],
    reports: [],
    timeline: [{ date: '2026-09-12', event: 'Current Visit — Abdominal pain and nausea for 3 days', status: 'current' }],
  },
  {
    id: 'PAT-00084725', regId: 'REG-2026-0912-0004', name: 'Vikram Singh', age: 61, gender: 'Male',
    phone: '+91 98344 55667', status: 'checked-in', queueNumber: 3,
    chiefComplaint: 'Fatigue and dizziness for 2 weeks',
    vitals: { temp: '98.2°F', bp: '140/90 mmHg', hr: 88, spo2: 96 },
    medications: 'Amlodipine 5mg, Metformin 500mg', allergies: 'Sulfa drugs', history: 'Hypertension, Type 2 Diabetes, CKD Stage 3',
    notes: [{ id: 1, date: '2026-05-03', text: 'BP controlled on current regimen; renal function panel repeated.' }],
    prescriptions: [{ id: 1, date: '2026-05-03', items: [{ name: 'Amlodipine', dose: '5mg', frequency: 'Once a day', duration: 'Ongoing' }] }],
    reports: [{ name: 'Renal Function Panel (2026-05-03)', type: 'Lab Report', status: 'processed' }],
    timeline: [
      { date: '2025-12-01', event: 'First visit — Hypertension review', status: 'completed' },
      { date: '2026-09-12', event: 'Current Visit — Fatigue and dizziness for 2 weeks', status: 'current' },
    ],
  },
]

const useStore = create((set, get) => ({
  // Navigation
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

  // ===== Role-based access control =====
  role: null, // null | 'patient' | 'receptionist' | 'doctor'
  setRole: (role) => set({ role }),
  staff: null, // { name, staffId, occupation }
  loginStaff: ({ name, staffId, occupation }) => set({ staff: { name, staffId, occupation } }),
  logout: () => set({ role: null, staff: null, currentPage: 'home', selectedPatient: null }),

  // ===== Patient registry (Registration → Reception queue → Doctor) =====
  patients: demoPatients,
  loadPatients: (rows) => set({ patients: rows }),

  // Registration
  registrationStep: 0,
  setRegistrationStep: (step) => set({ registrationStep: step }),
  patientData: {
    fullName: '', dob: '', gender: '', phone: '', email: '', address: '',
    emergencyContact: '', emergencyPhone: '',
    consentGiven: false, consentDate: '',
    chiefComplaint: '', historyOfPresentIllness: '', pastMedicalHistory: '',
    pastSurgicalHistory: '', currentMedications: '', allergies: '',
    familyHistory: '', personalHistory: '', reviewOfSystems: '',
    prakriti: '', vikriti: '', agni: '', koshta: '', aharaVihara: '',
    dashavidhaPariksha: { prakriti: '', jihva: '', mala: '', mutra: '',
      shabda: '', sparsha: '', drik: '', akriti: '', satmya: '', sara: '' },
    documents: [],
  },
  updatePatientData: (updates) => set((s) => ({
    patientData: { ...s.patientData, ...updates }
  })),
  patientId: null,
  registrationId: null,
  registrationError: null,
  isSubmitting: false,
  submitRegistration: async () => {
    const { patientData, patients } = get()
    set({ isSubmitting: true, registrationError: null })
    const d = patientData

    // Try the real backend first; fall back to prototype IDs if unavailable.
    let patientId, registrationId, offline = false
    try {
      const result = await api.register({
        patient: {
          full_name: d.fullName, date_of_birth: d.dob || null, gender: d.gender,
          phone: d.phone, email: d.email, address: d.address,
          emergency_contact_name: d.emergencyContact, emergency_contact_phone: d.emergencyPhone,
        },
        consent: { given: !!d.consentGiven, consent_date: d.consentDate || null },
        clinical_history: {
          chief_complaint: d.chiefComplaint,
          history_present_illness: d.historyOfPresentIllness,
          past_medical_history: d.pastMedicalHistory,
          past_surgical_history: d.pastSurgicalHistory,
          current_medications: d.currentMedications,
          allergies: d.allergies,
          family_history: d.familyHistory,
          personal_history: d.personalHistory,
          review_of_systems: d.reviewOfSystems,
        },
        ayurveda: {
          prakriti: d.prakriti, vikriti: d.vikriti, agni: d.agni, koshta: d.koshta,
          ahara_vihara: d.aharaVihara, dashavidha_pariksha: d.dashavidhaPariksha,
        },
      })
      patientId = result.patient_id
      registrationId = result.registration_id
    } catch (error) {
      // Keep the SIH prototype usable if the API is temporarily unavailable.
      offline = true
      patientId = 'PAT-' + String(Math.floor(10000000 + Math.random() * 90000000))
      registrationId = 'REG-2026-' + String(Math.floor(100 + Math.random() * 900)) + '-' + String(Math.floor(1000 + Math.random() * 9000))
      set({ registrationError: error.message })
    }

    const record = {
      id: patientId,
      regId: registrationId,
      name: d.fullName || 'New Patient',
      age: d.dob ? Math.max(0, new Date().getFullYear() - new Date(d.dob).getFullYear()) : 30,
      gender: d.gender || 'Other',
      phone: d.phone || '—',
      status: 'registered',
      queueNumber: nextQueueNumber(patients),
      chiefComplaint: d.chiefComplaint || 'General consultation',
      vitals: { temp: '—', bp: '—', hr: 0, spo2: 0 },
      medications: d.currentMedications || 'None',
      allergies: d.allergies || 'None known',
      history: d.pastMedicalHistory || 'No significant history',
      notes: [],
      prescriptions: [],
      reports: (d.documents || []).map(doc => ({ name: doc.name, type: 'Document', status: 'processed' })),
      timeline: [{ date: today(), event: 'Registered' + (d.chiefComplaint ? ' — ' + d.chiefComplaint : ''), status: 'current' }],
    }
    set({ patientId, registrationId, isSubmitting: false, patients: [record, ...patients] })
    return { patient_id: patientId, registration_id: registrationId, offline }
  },

  // ===== Reception queue workflow =====
  updatePatientStatus: (id, status) => set((s) => ({
    patients: s.patients.map((p) => (p.id === id ? { ...p, status } : p)),
  })),
  advanceStatus: (id) => set((s) => ({
    patients: s.patients.map((p) => {
      if (p.id !== id) return p
      const idx = STATUS_FLOW.indexOf(p.status)
      if (idx < 0 || idx >= STATUS_FLOW.length - 1) return p
      const status = STATUS_FLOW[idx + 1]
      const events = {
        'waiting': 'Waiting in reception queue',
        'checked-in': 'Called by reception — proceeding to consultation',
        'in-consultation': 'Consultation started',
        'completed': 'Consultation completed',
      }
      return { ...p, status, timeline: [...(p.timeline || []), { date: today(), event: events[status] || status, status: 'completed' }] }
    }),
  })),
  // Reception: call the first patient in queue order (by queue number)
  callNext: () => {
    const { patients } = get()
    const next = patients
      .filter((p) => ['registered', 'waiting', 'checked-in'].includes(p.status) && p.queueNumber)
      .sort((a, b) => a.queueNumber - b.queueNumber)[0]
    if (!next) return null
    set({
      patients: patients.map((p) => (p.id === next.id
        ? { ...p, status: 'checked-in', timeline: [...(p.timeline || []), { date: today(), event: 'Called by reception — proceeding to consultation', status: 'completed' }] }
        : p)),
    })
    return next
  },

  // Doctor
  selectedPatient: null,
  setSelectedPatient: (p) => set({ selectedPatient: p }),
  startConsultation: (id) => set((s) => ({
    patients: s.patients.map((p) => (p.id === id
      ? { ...p, status: 'in-consultation', timeline: [...(p.timeline || []), { date: today(), event: 'Consultation started', status: 'current' }] }
      : p)),
  })),
  addDoctorNote: (id, text) => set((s) => ({
    patients: s.patients.map((p) => (p.id === id
      ? { ...p, notes: [{ id: Date.now(), date: today(), text }, ...(p.notes || [])] }
      : p)),
  })),
  addPrescription: (id, items) => set((s) => ({
    patients: s.patients.map((p) => (p.id === id
      ? { ...p, prescriptions: [...(p.prescriptions || []), { id: Date.now(), date: today(), items }] }
      : p)),
  })),
  completeConsultation: (id) => set((s) => ({
    patients: s.patients.map((p) => (p.id === id
      ? { ...p, status: 'completed', timeline: [...(p.timeline || []), { date: today(), event: 'Consultation completed — prescription issued & notes saved', status: 'completed' }] }
      : p)),
  })),

  // Reception search (kept for compatibility)
  registrationSearch: '',
  setRegistrationSearch: (v) => set({ registrationSearch: v }),

  // AI Summary
  aiGenerating: false,
  aiSummary: null,
  setAiGenerating: (v) => set({ aiGenerating: v }),
  setAiSummary: (s) => set({ aiSummary: s }),

  // Theme (dark is the original look; light mode added as an option)
  theme: (() => { try { return localStorage.getItem('mk-theme') || 'dark' } catch { return 'dark' } })(),
  toggleTheme: () => set((s) => {
    const theme = s.theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('mk-theme', theme) } catch { /* private mode */ }
    return { theme }
  }),

  // Theme
  reducedMotion: false,
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
}))

export default useStore
