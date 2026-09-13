from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import User,Patient
from schemas.schemas import (
    LoginRequest, DemoLoginRequest,StaffRegisterRequest, PatientRegisterRequest)
from services.security import verify_password, create_token,hash_password
import os
router=APIRouter(tags=["Authentication"])

# Restored: /auth/login and /auth/demo-login were removed in the auth
# refactor while the frontend (Login.jsx, api.js) still calls them.
@router.post("/auth/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")

    patient_code = None
    if user.patient_id:
        patient = db.query(Patient).filter(Patient.id == user.patient_id).first()
        patient_code = patient.patient_code if patient else None

    return {
        "access_token": create_token(user),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "patient_code": patient_code,
        },
    }


@router.post("/auth/demo-login")
def demo_login(body: DemoLoginRequest, db: Session = Depends(get_db)):
    if os.getenv("DEMO_MODE", "true").lower() != "true":
        raise HTTPException(404, "Demo login disabled")
    email = f"{body.role}@medikiosk.demo"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(500, "Demo user unavailable")
    return {
        "access_token": create_token(user),
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "role": user.role},
    }


"""
Previouly for Staff:
@router.post("/auth/register/staff")
def register_staff(body:LoginRequest, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==body.email).first()
    if not user or not verify_password(body.password,user.password_hash): 
        raise HTTPException(401,"Invalid credentials")
    return {"access_token":create_token(user),
            "token_type":"bearer",
            "user":{
                "id":user.id,
                "name":user.name,
                "role":user.role
                }
            }
"""
#Currently for Staff:
@router.post("/auth/register/staff")
def register_staff(
    body: StaffRegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == body.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )

    user = User(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
        role=body.role,
        is_active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user)

    return {
        "message": "Staff registration successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

"""
Previously for Patient:
@router.post("/auth/register/patient")
def register_patient(body:DemoLoginRequest, db:Session=Depends(get_db)):
    if os.getenv("DEMO_MODE","true").lower()!="true": raise HTTPException(404,"Demo login disabled")
    email=f"{body.role}@medikiosk.demo"
    user=db.query(User).filter(User.email==email).first()
    if not user: raise HTTPException(500,"Demo user unavailable")
    return {"access_token":create_token(user),"token_type":"bearer","user":{"id":user.id,"name":user.name,"role":user.role}}
"""

#Currently for Patient:
@router.post("/auth/register/patient")
def register_patient(
    body: PatientRegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == body.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )

    patient = db.query(Patient).filter(
        Patient.patient_code == body.patient_code
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient ID not found. Complete patient registration first."
        )

    if patient.email and patient.email != body.email:
        raise HTTPException(
            status_code=400,
            detail="Email does not match the patient record"
        )

    user = User(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
        role="patient",
        patient_id=patient.id,
        is_active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user)

    return {
        "message": "Patient registration successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "patient_id": patient.id,
            "patient_code": patient.patient_code
        }
    }