from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Encounter
from services.security import require_roles
router=APIRouter(tags=["Doctor"])

@router.get("/doctor/patients/today")
def doctor_patients(db:Session=Depends(get_db), user=Depends(require_roles("doctor","receptionist","admin"))):
    q=db.query(Encounter).filter(Encounter.visit_date==date.today())
    if user.role=="doctor": q=q.filter((Encounter.doctor_id==user.id) | (Encounter.doctor_id==None))
    rows=q.order_by(Encounter.created_at).all()
    if user.role=="doctor":
        for e in rows:
            if e.doctor_id is None: e.doctor_id=user.id
        db.commit()
    return [{"id":e.id,"regId":e.registration_id,"name":e.patient.full_name,"age":None,"gender":e.patient.gender or "",
             "status":e.status.lower().replace("_","-"),"chiefComplaint":e.history.chief_complaint if e.history else "",
             "vitals":{"temp":"—","bp":"—","hr":0,"spo2":0},"medications":e.history.current_medications if e.history else "",
             "allergies":e.history.allergies if e.history else "None documented","history":e.history.past_medical_history if e.history else ""} for e in rows]
