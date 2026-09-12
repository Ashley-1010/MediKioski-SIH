from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Encounter, MedicalDocument, AuditLog
from services.security import require_roles
from services.file_storage import save_upload
from ocr.document_ocr import extract_text
router=APIRouter(tags=["Documents"])

@router.post("/documents/upload")
async def upload(encounter_id:int=Form(...),files:list[UploadFile]=File(...),db:Session=Depends(get_db),user=Depends(require_roles("doctor","receptionist","admin"))):
    e=db.get(Encounter,encounter_id)
    if not e: raise HTTPException(404,"Encounter not found")
    out=[]
    for f in files:
        storage_name,size,mime,path=await save_upload(f)
        ocr_text=extract_text(path,mime)
        d=MedicalDocument(patient_id=e.patient_id,encounter_id=e.id,document_type="medical_report",
                          file_name=f.filename or storage_name,storage_name=storage_name,mime_type=mime,file_size=size,ocr_text=ocr_text,uploaded_by=user.id)
        db.add(d); db.flush()
        out.append({"id":d.id,"name":d.file_name,"size":d.file_size,"mime_type":d.mime_type})
    db.add(AuditLog(user_id=user.id,action="DOCUMENT_UPLOADED",entity_type="encounter",entity_id=str(e.id),detail=f"{len(out)} file(s)"))
    db.commit(); return out

@router.get("/documents/{encounter_id}")
def list_docs(encounter_id:int,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    return [{"id":d.id,"name":d.file_name,"mime_type":d.mime_type,"size":d.file_size} for d in db.query(MedicalDocument).filter(MedicalDocument.encounter_id==encounter_id).all()]

@router.get("/documents/file/{document_id}")
def get_file(document_id:int,db:Session=Depends(get_db),user=Depends(require_roles("doctor","admin"))):
    d=db.get(MedicalDocument,document_id)
    if not d: raise HTTPException(404,"Document not found")
    from services.file_storage import BASE
    path=BASE/d.storage_name
    if not path.exists(): raise HTTPException(404,"Stored file not found")
    return FileResponse(path,media_type=d.mime_type,filename=d.file_name)
