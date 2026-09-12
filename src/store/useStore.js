import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Navigation
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

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
  submitRegistration: () => set({
    patientId: 'PAT-' + String(Math.floor(10000000 + Math.random() * 90000000)),
    registrationId: 'REG-2026-' + String(Math.floor(100 + Math.random() * 900)) + '-' + String(Math.floor(1000 + Math.random() * 9000)),
  }),

  // Reception
  registrationSearch: '',
  setRegistrationSearch: (v) => set({ registrationSearch: v }),

  // Doctor
  selectedPatient: null,
  setSelectedPatient: (p) => set({ selectedPatient: p }),

  // AI Summary
  aiGenerating: false,
  aiSummary: null,
  setAiGenerating: (v) => set({ aiGenerating: v }),
  setAiSummary: (s) => set({ aiSummary: s }),

  // Theme
  reducedMotion: false,
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
}))

// Demo patients for dashboard
export const demoPatients = [
  { id: 'PAT-00084721', regId: 'REG-2026-0911-0042', name: 'Ramesh Kumar', age: 52, gender: 'Male', status: 'completed', chiefComplaint: 'High fever for 3 days with severe headache', vitals: { temp: '102.4°F', bp: '130/85 mmHg', hr: 92, spo2: 97 }, medications: 'Paracetamol 500mg', allergies: 'Penicillin', history: 'Hypertension, Type 2 Diabetes' },
  { id: 'PAT-00084722', regId: 'REG-2026-0912-0001', name: 'Priya Sharma', age: 34, gender: 'Female', status: 'in-consultation', chiefComplaint: 'Persistent cough and chest tightness for 2 weeks', vitals: { temp: '98.6°F', bp: '118/76 mmHg', hr: 78, spo2: 98 }, medications: 'None', allergies: 'None known', history: 'Asthma (childhood)' },
  { id: 'PAT-00084723', regId: 'REG-2026-0912-0002', name: 'Amit Patel', age: 45, gender: 'Male', status: 'waiting', chiefComplaint: 'Lower back pain radiating to left leg for 1 month', vitals: { temp: '98.4°F', bp: '125/82 mmHg', hr: 74, spo2: 99 }, medications: 'Ibuprofen 400mg', allergies: 'Aspirin', history: 'Lumbar spondylosis' },
  { id: 'PAT-00084724', regId: 'REG-2026-0912-0003', name: 'Sunita Devi', age: 28, gender: 'Female', status: 'registered', chiefComplaint: 'Abdominal pain and nausea for 3 days', vitals: { temp: '99.1°F', bp: '110/70 mmHg', hr: 82, spo2: 99 }, medications: 'Omeprazole 20mg', allergies: 'None known', history: 'GERD' },
  { id: 'PAT-00084725', regId: 'REG-2026-0912-0004', name: 'Vikram Singh', age: 61, gender: 'Male', status: 'checked-in', chiefComplaint: 'Fatigue and dizziness for 2 weeks', vitals: { temp: '98.2°F', bp: '140/90 mmHg', hr: 88, spo2: 96 }, medications: 'Amlodipine 5mg, Metformin 500mg', allergies: 'Sulfa drugs', history: 'Hypertension, Type 2 Diabetes, CKD Stage 3' },
]

export default useStore
