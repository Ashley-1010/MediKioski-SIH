import os, uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
BASE=Path(os.getenv("STORAGE_DIR","./storage")).resolve()
MAX=int(os.getenv("MAX_UPLOAD_MB","10"))*1024*1024
ALLOWED={"application/pdf","image/jpeg","image/png","image/heic","image/heif"}
async def save_upload(file:UploadFile):
    if file.content_type not in ALLOWED: raise HTTPException(400,"Unsupported file type")
    data=await file.read()
    if len(data)>MAX: raise HTTPException(413,"File exceeds 10 MB limit")
    ext=Path(file.filename or "").suffix.lower()
    name=f"{uuid.uuid4().hex}{ext}"
    BASE.mkdir(parents=True,exist_ok=True)
    path=BASE/name; path.write_bytes(data)
    return name,len(data),file.content_type,path
