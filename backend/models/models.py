from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, ForeignKey, UniqueConstraint, JSON
from sqlalchemy.orm import relationship
from db.database import Base

class User(Base):
    __tablename__ = "users"
    id=Column(Integer,primary_key=True)
    name=Column(String(120),nullable=False)
    email=Column(String(255),unique=True,index=True,nullable=False)
    password_hash=Column(String(255),nullable=False)
    role=Column(String(30),nullable=False,index=True)
    patient_id=Column(Integer,ForeignKey("patients.id"),nullable=True)
    is_active=Column(Boolean,default=True)
    created_at=Column(DateTime,default=datetime.utcnow)

class Patient(Base):
    __tablename__="patients"
    id=Column(Integer,primary_key=True)
    patient_code=Column(String(30),unique=True,index=True,nullable=False)
    full_name=Column(String(200),nullable=False)
    date_of_birth=Column(Date)
    gender=Column(String(30))
    phone=Column(String(40),index=True)
    email=Column(String(255))
    address=Column(Text)
    emergency_contact_name=Column(String(200))
    emergency_contact_phone=Column(String(40))
    created_at=Column(DateTime,default=datetime.utcnow)
    updated_at=Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    encounters=relationship("Encounter",back_populates="patient")

class Encounter(Base):
    __tablename__="encounters"
    id=Column(Integer,primary_key=True)
    registration_id=Column(String(40),unique=True,index=True,nullable=False)
    patient_id=Column(Integer,ForeignKey("patients.id"),index=True,nullable=False)
    doctor_id=Column(Integer,ForeignKey("users.id"),index=True)
    department=Column(String(100),default="Ayurveda")
    visit_date=Column(Date,default=date.today,index=True)
    visit_time=Column(DateTime,default=datetime.utcnow)
    status=Column(String(30),default="WAITING",index=True)
    consent_given=Column(Boolean,default=False)
    consent_date=Column(DateTime)
    created_at=Column(DateTime,default=datetime.utcnow)
    updated_at=Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    patient=relationship("Patient",back_populates="encounters")
    history=relationship("ClinicalHistory",back_populates="encounter",uselist=False,cascade="all, delete-orphan")
    ayurveda=relationship("AyurvedaAssessment",back_populates="encounter",uselist=False,cascade="all, delete-orphan")
    documents=relationship("MedicalDocument",back_populates="encounter",cascade="all, delete-orphan")
    summary=relationship("ClinicalSummary",back_populates="encounter",uselist=False,cascade="all, delete-orphan")

class RegistrationSequence(Base):
    __tablename__="registration_sequences"
    id=Column(Integer,primary_key=True)
    sequence_date=Column(Date,unique=True,index=True,nullable=False)
    last_number=Column(Integer,default=0,nullable=False)

class ClinicalHistory(Base):
    __tablename__="clinical_history"
    id=Column(Integer,primary_key=True)
    encounter_id=Column(Integer,ForeignKey("encounters.id"),unique=True,nullable=False)
    chief_complaint=Column(Text)
    history_present_illness=Column(Text)
    past_medical_history=Column(Text)
    past_surgical_history=Column(Text)
    current_medications=Column(Text)
    allergies=Column(Text)
    family_history=Column(Text)
    personal_history=Column(Text)
    review_of_systems=Column(Text)
    created_at=Column(DateTime,default=datetime.utcnow)
    updated_at=Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    encounter=relationship("Encounter",back_populates="history")

class AyurvedaAssessment(Base):
    __tablename__="ayurveda_assessment"
    id=Column(Integer,primary_key=True)
    encounter_id=Column(Integer,ForeignKey("encounters.id"),unique=True,nullable=False)
    prakriti=Column(String(100)); vikriti=Column(String(100)); agni=Column(String(100)); koshta=Column(String(100))
    ahara_vihara=Column(Text)
    dashavidha_pariksha=Column(JSON)
    created_at=Column(DateTime,default=datetime.utcnow)
    updated_at=Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    encounter=relationship("Encounter",back_populates="ayurveda")

class MedicalDocument(Base):
    __tablename__="medical_documents"
    id=Column(Integer,primary_key=True)
    patient_id=Column(Integer,ForeignKey("patients.id"),index=True,nullable=False)
    encounter_id=Column(Integer,ForeignKey("encounters.id"),index=True,nullable=False)
    document_type=Column(String(60))
    file_name=Column(String(255),nullable=False)
    storage_name=Column(String(255),nullable=False)
    mime_type=Column(String(100),nullable=False)
    file_size=Column(Integer,nullable=False)
    ocr_text=Column(Text)
    uploaded_by=Column(Integer,ForeignKey("users.id"))
    uploaded_at=Column(DateTime,default=datetime.utcnow)
    encounter=relationship("Encounter",back_populates="documents")

class ClinicalSummary(Base):
    __tablename__="clinical_summaries"
    id=Column(Integer,primary_key=True)
    encounter_id=Column(Integer,ForeignKey("encounters.id"),unique=True,nullable=False)
    summary_text=Column(Text,nullable=False)
    ai_generated=Column(Boolean,default=True)
    doctor_reviewed=Column(Boolean,default=False)
    doctor_approved=Column(Boolean,default=False)
    generated_at=Column(DateTime,default=datetime.utcnow)
    updated_at=Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    approved_at=Column(DateTime)
    approved_by=Column(Integer,ForeignKey("users.id"))
    encounter=relationship("Encounter",back_populates="summary")

class AuditLog(Base):
    __tablename__="audit_logs"
    id=Column(Integer,primary_key=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    action=Column(String(100),index=True,nullable=False)
    entity_type=Column(String(60))
    entity_id=Column(String(80))
    detail=Column(Text)
    created_at=Column(DateTime,default=datetime.utcnow,index=True)
