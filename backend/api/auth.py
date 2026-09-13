from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import User
from schemas.schemas import LoginRequest, DemoLoginRequest
from services.security import verify_password, create_token
import os
router=APIRouter(tags=["Authentication"])

@router.post("/auth/login")
def login(body:LoginRequest, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==body.email).first()
    if not user or not verify_password(body.password,user.password_hash): raise HTTPException(401,"Invalid credentials")
    return {"access_token":create_token(user),"token_type":"bearer","user":{"id":user.id,"name":user.name,"role":user.role}}

@router.post("/auth/demo-login")
def demo_login(body:DemoLoginRequest, db:Session=Depends(get_db)):
    if os.getenv("DEMO_MODE","true").lower()!="true": raise HTTPException(404,"Demo login disabled")
    email=f"{body.role}@medikiosk.demo"
    user=db.query(User).filter(User.email==email).first()
    if not user: raise HTTPException(500,"Demo user unavailable")
    return {"access_token":create_token(user),"token_type":"bearer","user":{"id":user.id,"name":user.name,"role":user.role}}
