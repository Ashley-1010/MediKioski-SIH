from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from app.models.base import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(20), unique=True, index=True)  # PAT-XXXXXXXX
    registration_id = Column(String(30), unique=True, index=True)  # REG-YYYY-...

    # Personal
    full_name = Column(String(200), nullable=False)
    dob = Column(String(20), default="")
    gender = Column(String(10), default="")
    phone = Column(String(20), default="")
    email = Column(String(200), default="")
    address = Column(Text, default="")
    emergency_contact = Column(String(200), default="")
    emergency_phone = Column(String(20), default="")

    # Consent
    consent_given = Column(Boolean, default=False)
    consent_date = Column(String(50), default="")

    # Medical History
    chief_complaint = Column(Text, default="")
    history_of_present_illness = Column(Text, default="")
    past_medical_history = Column(Text, default="")
    past_surgical_history = Column(Text, default="")
    current_medications = Column(Text, default="")
    allergies = Column(Text, default="")
    family_history = Column(Text, default="")
    personal_history = Column(Text, default="")
    review_of_systems = Column(Text, default="")

    # Ayurveda
    prakriti = Column(String(50), default="")
    vikriti = Column(String(50), default="")
    agni = Column(String(50), default="")
    koshta = Column(String(50), default="")
    ahara_vihara = Column(Text, default="")
    dashavidha_pariksha = Column(JSON, default=dict)

    # Status
    status = Column(String(30), default="registered")  # registered, waiting, checked-in, in-consultation, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    encounters = relationship("Encounter", back_populates="patient", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="patient", cascade="all, delete-orphan")
    ai_summaries = relationship("AISummary", back_populates="patient", cascade="all, delete-orphan")
    doctor_notes = relationship("DoctorNote", back_populates="patient", cascade="all, delete-orphan")


class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    encounter_date = Column(DateTime, default=datetime.utcnow)
    chief_complaint = Column(Text, default="")
    vitals = Column(JSON, default=dict)  # {temp, bp, hr, spo2}
    diagnosis = Column(Text, default="")
    treatment_plan = Column(Text, default="")
    status = Column(String(30), default="current")  # current, completed

    patient = relationship("Patient", back_populates="encounters")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    filename = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    file_type = Column(String(100), default="")
    storage_path = Column(String(1000), default="")
    ocr_text = Column(Text, default="")
    ocr_status = Column(String(30), default="uploaded")  # uploaded, scanning, extracting, structuring, ready
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="documents")


class AISummary(Base):
    __tablename__ = "ai_summaries"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), nullable=True)
    summary_text = Column(Text, default="")
    structured_data = Column(JSON, default=dict)
    red_flags = Column(JSON, default=list)  # list of alert strings
    status = Column(String(30), default="generated")  # generated, reviewed, approved
    generated_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    doctor_edits = Column(Text, default="")

    patient = relationship("Patient", back_populates="ai_summaries")


class DoctorNote(Base):
    __tablename__ = "doctor_notes"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    encounter_id = Column(Integer, nullable=True)
    note_text = Column(Text, default="")
    doctor_name = Column(String(200), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="doctor_notes")
