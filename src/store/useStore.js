import { create } from 'zustand'
import { api } from '../services/api'

const initialPatientData = {
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
}

const useStore = create((set) => ({
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

  registrationStep: 0,
  setRegistrationStep: (step) => set({ registrationStep: step }),
  patientData: initialPatientData,
  updatePatientData: (updates) => set((s) => ({
    patientData: { ...s.patientData, ...updates }
  })),
  patientId: null,
  registrationId: null,
  registrationError: null,
  isSubmitting: false,

  submitRegistration: async () => {
    const state = useStore.getState()
    set({ isSubmitting: true, registrationError: null })
    try {
      const d = state.patientData
      const payload = {
        patient: {
          full_name: d.fullName, date_of_birth: d.dob || null, gender: d.gender,
          phone: d.phone, email: d.email, address: d.address,
          emergency_contact_name: d.emergencyContact, emergency_contact_phone: d.emergencyPhone
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
          review_of_systems: d.reviewOfSystems
        },
        ayurveda: {
          prakriti: d.prakriti, vikriti: d.vikriti, agni: d.agni, koshta: d.koshta,
          ahara_vihara: d.aharaVihara, dashavidha_pariksha: d.dashavidhaPariksha
        }
      }
      const result = await api.register(payload)
      set({
        patientId: result.patient_id,
        registrationId: result.registration_id,
        isSubmitting: false
      })
      return result
    } catch (error) {
      // Keep the SIH prototype usable if the API is temporarily unavailable.
      const patientId = 'PAT-' + String(Math.floor(10000000 + Math.random() * 90000000))
      const registrationId = 'REG-' + new Date().toISOString().slice(0, 10).replaceAll('-', '') + '-' + String(Math.floor(1000 + Math.random() * 9000))
      set({ patientId, registrationId, registrationError: error.message, isSubmitting: false })
      return { patient_id: patientId, registration_id: registrationId, offline: true }
    }
  },

  registrationSearch: '',
  setRegistrationSearch: (v) => set({ registrationSearch: v }),
  selectedPatient: null,
  setSelectedPatient: (p) => set({ selectedPatient: p }),
  aiGenerating: false,
  aiSummary: null,
  setAiGenerating: (v) => set({ aiGenerating: v }),
  setAiSummary: (s) => set({ aiSummary: s }),
  reducedMotion: false,
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
}))

export const demoPatients = [
  { id: 'PAT-00084721', regId: 'REG-2026-0911-0042', name: 'Ramesh Kumar', age: 52, gender: 'Male', status: 'completed', chiefComplaint: 'High fever for 3 days with severe headache', vitals: { temp: '102.4°F', bp: '130/85 mmHg', hr: 92, spo2: 97 }, medications: 'Paracetamol 500mg', allergies: 'Penicillin', history: 'Hypertension, Type 2 Diabetes' },
  { id: 'PAT-00084722', regId: 'REG-2026-0912-0001', name: 'Priya Sharma', age: 34, gender: 'Female', status: 'in-consultation', chiefComplaint: 'Persistent cough and chest tightness for 2 weeks', vitals: { temp: '98.6°F', bp: '118/76 mmHg', hr: 78, spo2: 98 }, medications: 'None', allergies: 'None known', history: 'Asthma (childhood)' },
  { id: 'PAT-00084723', regId: 'REG-2026-0912-0002', name: 'Amit Patel', age: 45, gender: 'Male', status: 'waiting', chiefComplaint: 'Lower back pain radiating to left leg for 1 month', vitals: { temp: '98.4°F', bp: '125/82 mmHg', hr: 74, spo2: 99 }, medications: 'Ibuprofen 400mg', allergies: 'Aspirin', history: 'Lumbar spondylosis' },
  { id: 'PAT-00084724', regId: 'REG-2026-0912-0003', name: 'Sunita Devi', age: 28, gender: 'Female', status: 'registered', chiefComplaint: 'Abdominal pain and nausea for 3 days', vitals: { temp: '99.1°F', bp: '110/70 mmHg', hr: 82, spo2: 99 }, medications: 'Omeprazole 20mg', allergies: 'None known', history: 'GERD' },
  { id: 'PAT-00084725', regId: 'REG-2026-0912-0004', name: 'Vikram Singh', age: 61, gender: 'Male', status: 'checked-in', chiefComplaint: 'Fatigue and dizziness for 2 weeks', vitals: { temp: '98.2°F', bp: '140/90 mmHg', hr: 88, spo2: 96 }, medications: 'Amlodipine 5mg, Metformin 500mg', allergies: 'Sulfa drugs', history: 'Hypertension, Type 2 Diabetes, CKD Stage 3' },
]
export default useStore
