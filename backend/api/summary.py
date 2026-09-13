from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Encounter, ClinicalSummary, AuditLog
from schemas.schemas import SummaryRequest, SummaryUpdate
from services.security import require_roles
router=APIRouter(tags=["AI Summary"])

def build_summary(e):
    p=e.patient; h=e.history; a=e.ayurveda
    docs="\n".join(d.ocr_text for d in e.documents if d.ocr_text)
    return f"""PATIENT: {p.full_name} ({p.patient_code})
ENCOUNTER: {e.registration_id} | {e.visit_date}

CHIEF COMPLAINT:
{(h.chief_complaint if h else '') or 'Not documented'}

HISTORY OF PRESENT ILLNESS:
{(h.history_present_illness if h else '') or 'Not documented'}

PAST MEDICAL / SURGICAL HISTORY:
{(h.past_medical_history if h else '') or 'Not documented'} / {(h.past_surgical_history if h else '') or 'Not documented'}

CURRENT MEDICATIONS:
{(h.current_medications if h else '') or 'Not documented'}

ALLERGIES:
{(h.allergies if h else '') or 'Not documented'}

AYURVEDA ASSESSMENT:
Prakriti: {(a.prakriti if a else '') or 'Not documented'}
Vikriti: {(a.vikriti if a else '') or 'Not documented'}
Agni: {(a.agni if a else '') or 'Not documented'}
Koshta: {(a.koshta if a else '') or 'Not documented'}

DOCUMENT/OCR TEXT:
{docs or 'No OCR text available.'}

DISCLAIMER: Documentation assistance only. This is an AI-generated draft and is not a diagnosis or treatment recommendation. A qualified doctor must review and approve it."""
@router.post("/summary/generate")
def generate(body:SummaryRequest,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    e=db.get(Encounter,body.encounter_id)
    if not e: raise HTTPException(404,"Encounter not found")
    text=build_summary(e)
    s=e.summary or ClinicalSummary(encounter_id=e.id)
    s.summary_text=text; s.ai_generated=True; s.doctor_reviewed=False; s.doctor_approved=False; s.generated_at=datetime.utcnow()
    db.add(s); db.add(AuditLog(user_id=user.id,action="AI_SUMMARY_GENERATED",entity_type="encounter",entity_id=str(e.id))); db.commit()
    return {"id":s.id,"summary_text":s.summary_text,"ai_generated":True,"doctor_approved":False}
@router.get("/summary/{encounter_id}")
def get_summary(encounter_id:int,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    s=db.query(ClinicalSummary).filter(ClinicalSummary.encounter_id==encounter_id).first()
    if not s: raise HTTPException(404,"Summary not found")
    return {"id":s.id,"summary_text":s.summary_text,"ai_generated":s.ai_generated,"doctor_reviewed":s.doctor_reviewed,"doctor_approved":s.doctor_approved}
@router.put("/summary/{summary_id}")
def edit(summary_id:int,body:SummaryUpdate,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    s=db.get(ClinicalSummary,summary_id)
    if not s: raise HTTPException(404,"Summary not found")
    s.summary_text=body.summary_text;s.doctor_reviewed=True;s.doctor_approved=False
    db.add(AuditLog(user_id=user.id,action="AI_SUMMARY_EDITED",entity_type="summary",entity_id=str(s.id)));db.commit()
    return {"id":s.id,"summary_text":s.summary_text,"doctor_reviewed":True,"doctor_approved":False}
@router.put("/summary/{summary_id}/approve")
def approve(summary_id:int,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    s=db.get(ClinicalSummary,summary_id)
    if not s: raise HTTPException(404,"Summary not found")
    s.doctor_reviewed=True;s.doctor_approved=True;s.approved_at=datetime.utcnow();s.approved_by=user.id
    db.add(AuditLog(user_id=user.id,action="AI_SUMMARY_APPROVED",entity_type="summary",entity_id=str(s.id)));db.commit()
    return {"id":s.id,"doctor_approved":True,"approved_at":s.approved_at}
