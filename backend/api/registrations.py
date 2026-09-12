from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from db.database import get_db
from models.models import Patient, Encounter, RegistrationSequence, ClinicalHistory, AyurvedaAssessment, AuditLog, User
from schemas.schemas import RegistrationIn
from services.security import current_user

router=APIRouter(tags=["Registrations"])

def next_registration_id(db, d):
    seq=db.query(RegistrationSequence).filter(RegistrationSequence.sequence_date==d).with_for_update().first()
    if not seq:
        seq=RegistrationSequence(sequence_date=d,last_number=0); db.add(seq); db.flush()
    seq.last_number += 1
    db.flush()
    return f"REG-{d.strftime('%Y-%m-%d')}-{seq.last_number:04d}"

@router.post("/registrations")
def create_registration(body:RegistrationIn, db:Session=Depends(get_db)):
    if not body.consent.given: raise HTTPException(400,"Patient consent is required")
    today=date.today()
    try:
        patient=Patient(patient_code="TEMP-"+datetime.utcnow().strftime("%Y%m%d%H%M%S%f"),**body.patient.model_dump())
        db.add(patient); db.flush()
        patient.patient_code=f"PAT-{patient.id:08d}"
        enc=Encounter(registration_id=next_registration_id(db,today),patient_id=patient.id,
                      department=body.department,status="WAITING",consent_given=True,consent_date=body.consent.consent_date)
        db.add(enc); db.flush()
        enc.history=ClinicalHistory(**body.clinical_history.model_dump())
        enc.ayurveda=AyurvedaAssessment(**body.ayurveda.model_dump())
        db.add(AuditLog(action="REGISTRATION_CREATED",entity_type="encounter",entity_id=str(enc.id),detail=enc.registration_id))
        db.commit()
        return {"patient_id":patient.patient_code,"registration_id":enc.registration_id,"encounter_id":enc.id,"status":enc.status}
    except IntegrityError:
        db.rollback(); raise HTTPException(409,"Could not create unique registration; please retry")

@router.get("/registrations/{registration_id}")
def get_registration(registration_id:str, db:Session=Depends(get_db), user=Depends(current_user)):
    enc=db.query(Encounter).filter(Encounter.registration_id==registration_id).first()
    if not enc: raise HTTPException(404,"Registration ID not found")
    return {"registration_id":enc.registration_id,"patient_id":enc.patient.patient_code,"patient_name":enc.patient.full_name,
            "visit_date":enc.visit_date,"status":enc.status,"encounter_id":enc.id}

@router.post("/registrations/{registration_id}/check-in")
def check_in(registration_id:str, db:Session=Depends(get_db), user=Depends(current_user)):
    if user.role not in ("receptionist","admin"): raise HTTPException(403,"Receptionist access required")
    enc=db.query(Encounter).filter(Encounter.registration_id==registration_id).first()
    if not enc: raise HTTPException(404,"Registration ID not found")
    if enc.status=="WAITING": enc.status="CHECKED_IN"
    db.add(AuditLog(user_id=user.id,action="PATIENT_CHECKED_IN",entity_type="encounter",entity_id=str(enc.id)))
    db.commit()
    return {"registration_id":enc.registration_id,"status":enc.status}
