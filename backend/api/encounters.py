from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Encounter, AuditLog
from schemas.schemas import StatusUpdate
from services.security import require_roles
router=APIRouter(tags=["Encounters"])

@router.get("/encounters/today")
def today(db:Session=Depends(get_db), user=Depends(require_roles("doctor","receptionist","admin"))):
    q=db.query(Encounter).filter(Encounter.visit_date.__eq__(__import__("datetime").date.today()))
    if user.role=="doctor": q=q.filter(Encounter.doctor_id==user.id)
    return [{"id":e.id,"registration_id":e.registration_id,"patient_id":e.patient.patient_code,"name":e.patient.full_name,
             "status":e.status,"visit_date":e.visit_date.isoformat(),"chief_complaint":e.history.chief_complaint if e.history else ""} for e in q.order_by(Encounter.created_at).all()]

@router.get("/encounters/{encounter_id}/record")
def record(encounter_id:int, db:Session=Depends(get_db), user=Depends(require_roles("doctor","admin"))):
    e=db.get(Encounter,encounter_id)
    if not e: raise HTTPException(404,"Encounter not found")
    if user.role=="doctor" and e.doctor_id not in (None,user.id): raise HTTPException(403,"Encounter not assigned to this doctor")
    return {"encounter":{"id":e.id,"registration_id":e.registration_id,"status":e.status,"visit_date":e.visit_date},
            "patient":{"id":e.patient.patient_code,"name":e.patient.full_name,"dob":e.patient.date_of_birth,"gender":e.patient.gender,"phone":e.patient.phone,"email":e.patient.email},
            "clinical_history": e.history.__dict__ if e.history else None,
            "ayurveda": e.ayurveda.__dict__ if e.ayurveda else None,
            "documents":[{"id":d.id,"name":d.file_name,"mime_type":d.mime_type,"size":d.file_size} for d in e.documents],
            "summary": {"id":e.summary.id,"text":e.summary.summary_text,"doctor_approved":e.summary.doctor_approved} if e.summary else None}

@router.put("/encounters/{encounter_id}/status")
def update_status(encounter_id:int, body:StatusUpdate, db:Session=Depends(get_db), user=Depends(require_roles("doctor","receptionist","admin"))):
    allowed={"WAITING","CHECKED_IN","IN_CONSULTATION","COMPLETED"}
    if body.status not in allowed: raise HTTPException(400,"Invalid status")
    e=db.get(Encounter,encounter_id)
    if not e: raise HTTPException(404,"Encounter not found")
    e.status=body.status; db.add(AuditLog(user_id=user.id,action="ENCOUNTER_STATUS_UPDATED",entity_type="encounter",entity_id=str(e.id),detail=body.status)); db.commit()
    return {"id":e.id,"status":e.status}
