from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ── Patient Registration ──
class PatientCreate(BaseModel):
    full_name: str
    dob: str = ""
    gender: str = ""
    phone: str = ""
    email: str = ""
    address: str = ""
    emergency_contact: str = ""
    emergency_phone: str = ""
    consent_given: bool = False
    consent_date: str = ""
    chief_complaint: str = ""
    history_of_present_illness: str = ""
    past_medical_history: str = ""
    past_surgical_history: str = ""
    current_medications: str = ""
    allergies: str = ""
    family_history: str = ""
    personal_history: str = ""
    review_of_systems: str = ""
    prakriti: str = ""
    vikriti: str = ""
    agni: str = ""
    koshta: str = ""
    ahara_vihara: str = ""
    dashavidha_pariksha: dict = {}


class PatientResponse(BaseModel):
    id: int
    patient_id: str
    registration_id: str
    full_name: str
    dob: str
    gender: str
    phone: str
    email: str
    address: str
    emergency_contact: str
    emergency_phone: str
    consent_given: bool
    consent_date: str
    chief_complaint: str
    history_of_present_illness: str
    past_medical_history: str
    past_surgical_history: str
    current_medications: str
    allergies: str
    family_history: str
    personal_history: str
    review_of_systems: str
    prakriti: str
    vikriti: str
    agni: str
    koshta: str
    ahara_vihara: str
    dashavidha_pariksha: dict
    status: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class PatientListItem(BaseModel):
    id: int
    patient_id: str
    registration_id: str
    full_name: str
    dob: str
    gender: str
    status: str
    chief_complaint: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


# ── Status Update ──
class StatusUpdate(BaseModel):
    status: str


# ── Encounter / Vitals ──
class EncounterCreate(BaseModel):
    chief_complaint: str = ""
    vitals: dict = {}
    diagnosis: str = ""
    treatment_plan: str = ""


class EncounterResponse(BaseModel):
    id: int
    patient_id: int
    encounter_date: Optional[str] = None
    chief_complaint: str
    vitals: dict
    diagnosis: str
    treatment_plan: str
    status: str

    class Config:
        from_attributes = True


# ── Document ──
class DocumentResponse(BaseModel):
    id: int
    patient_id: int
    filename: str
    file_size: int
    file_type: str
    ocr_text: str
    ocr_status: str
    uploaded_at: Optional[str] = None

    class Config:
        from_attributes = True


# ── AI Summary ──
class AISummaryCreate(BaseModel):
    encounter_id: Optional[int] = None


class AISummaryResponse(BaseModel):
    id: int
    patient_id: int
    encounter_id: Optional[int]
    summary_text: str
    structured_data: dict
    red_flags: list
    status: str
    generated_at: Optional[str] = None

    class Config:
        from_attributes = True


class AISummaryUpdate(BaseModel):
    doctor_edits: str = ""
    status: str  # reviewed | approved


# ── Doctor Notes ──
class DoctorNoteCreate(BaseModel):
    encounter_id: Optional[int] = None
    note_text: str
    doctor_name: str = "Dr. Admin"


class DoctorNoteResponse(BaseModel):
    id: int
    patient_id: int
    note_text: str
    doctor_name: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


# ── Dashboard Stats ──
class DashboardStats(BaseModel):
    registered: int
    waiting: int
    checked_in: int
    in_consultation: int
    completed: int
    total: int
