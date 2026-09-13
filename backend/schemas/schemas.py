from datetime import date, datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
class DemoLoginRequest(BaseModel):
    role: str = Field(pattern="^(doctor|receptionist)$")

class StaffRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    role: str = Field(pattern="^(doctor|receptionist)$")

class PatientRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    patient_code: str
"""
class PatientAccountRequest(BaseModel):
    patient_code: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
"""

class PatientIn(BaseModel):
    full_name: str = Field(min_length=2,max_length=200)
    date_of_birth: Optional[date]=None
    gender: Optional[str]=None
    phone: Optional[str]=None
    email: Optional[EmailStr]=None
    address: Optional[str]=None
    emergency_contact_name: Optional[str]=None
    emergency_contact_phone: Optional[str]=None
class ConsentIn(BaseModel):
    given: bool
    consent_date: Optional[datetime]=None
class ClinicalHistoryIn(BaseModel):
    chief_complaint: Optional[str]=None
    history_present_illness: Optional[str]=None
    past_medical_history: Optional[str]=None
    past_surgical_history: Optional[str]=None
    current_medications: Optional[str]=None
    allergies: Optional[str]=None
    family_history: Optional[str]=None
    personal_history: Optional[str]=None
    review_of_systems: Optional[str]=None
class AyurvedaIn(BaseModel):
    prakriti: Optional[str]=None; vikriti: Optional[str]=None; agni: Optional[str]=None; koshta: Optional[str]=None
    ahara_vihara: Optional[str]=None
    dashavidha_pariksha: dict[str,Any]={}
class RegistrationIn(BaseModel):
    patient: PatientIn
    consent: ConsentIn
    clinical_history: ClinicalHistoryIn
    ayurveda: AyurvedaIn
    department: str="Ayurveda"
class SummaryRequest(BaseModel):
    encounter_id: int
class SummaryUpdate(BaseModel):
    summary_text: str = Field(min_length=1)
class StatusUpdate(BaseModel):
    status: str
