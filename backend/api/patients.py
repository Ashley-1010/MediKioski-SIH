from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Patient
from services.security import require_roles
router=APIRouter(tags=["Patients"])

@router.get("/patients/{patient_code}")
def patient(patient_code:str,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    p=db.query(Patient).filter(Patient.patient_code==patient_code).first()
    if not p: raise HTTPException(404,"Patient not found")
    return {"patient_id":p.patient_code,"name":p.full_name,"dob":p.date_of_birth,"gender":p.gender,"phone":p.phone,"email":p.email,"address":p.address}

@router.get("/patients/{patient_code}/history")
def history(patient_code:str,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    p=db.query(Patient).filter(Patient.patient_code==patient_code).first()
    if not p: raise HTTPException(404,"Patient not found")
    return [{"encounter_id":e.id,"registration_id":e.registration_id,"date":e.visit_date,"status":e.status,
             "chief_complaint":e.history.chief_complaint if e.history else ""} for e in p.encounters]
