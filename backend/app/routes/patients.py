import random
import string
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.patient import Patient, Encounter, DoctorNote
from app.schemas.patient import (
    PatientCreate, PatientResponse, PatientListItem,
    StatusUpdate, EncounterCreate, EncounterResponse,
    DoctorNoteCreate, DoctorNoteResponse, DashboardStats,
)

router = APIRouter(prefix="/api/patients", tags=["patients"])


def _gen_patient_id():
    return "PAT-" + "".join(random.choices(string.digits, k=8))


def _gen_reg_id():
    return f"REG-2026-{random.randint(100,999)}-{random.randint(1000,9999)}"


def _patient_to_response(p: Patient) -> dict:
    return PatientResponse(
        id=p.id, patient_id=p.patient_id, registration_id=p.registration_id,
        full_name=p.full_name, dob=p.dob, gender=p.gender, phone=p.phone, email=p.email,
        address=p.address, emergency_contact=p.emergency_contact, emergency_phone=p.emergency_phone,
        consent_given=p.consent_given, consent_date=p.consent_date,
        chief_complaint=p.chief_complaint, history_of_present_illness=p.history_of_present_illness,
        past_medical_history=p.past_medical_history, past_surgical_history=p.past_surgical_history,
        current_medications=p.current_medications, allergies=p.allergies,
        family_history=p.family_history, personal_history=p.personal_history,
        review_of_systems=p.review_of_systems,
        prakriti=p.prakriti, vikriti=p.vikriti, agni=p.agni, koshta=p.koshta,
        ahara_vihara=p.ahara_vihara, dashavidha_pariksha=p.dashavidha_pariksha or {},
        status=p.status,
        created_at=str(p.created_at) if p.created_at else None,
        updated_at=str(p.updated_at) if p.updated_at else None,
    )


# ── Register Patient ──
@router.post("", response_model=PatientResponse, status_code=201)
def register_patient(data: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(
        patient_id=_gen_patient_id(),
        registration_id=_gen_reg_id(),
        full_name=data.full_name, dob=data.dob, gender=data.gender,
        phone=data.phone, email=data.email, address=data.address,
        emergency_contact=data.emergency_contact, emergency_phone=data.emergency_phone,
        consent_given=data.consent_given, consent_date=data.consent_date,
        chief_complaint=data.chief_complaint,
        history_of_present_illness=data.history_of_present_illness,
        past_medical_history=data.past_medical_history,
        past_surgical_history=data.past_surgical_history,
        current_medications=data.current_medications, allergies=data.allergies,
        family_history=data.family_history, personal_history=data.personal_history,
        review_of_systems=data.review_of_systems,
        prakriti=data.prakriti, vikriti=data.vikriti, agni=data.agni, koshta=data.koshta,
        ahara_vihara=data.ahara_vihara, dashavidha_pariksha=data.dashavidha_pariksha,
        status="registered",
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # Auto-create first encounter
    encounter = Encounter(
        patient_id=patient.id,
        chief_complaint=data.chief_complaint,
        vitals={"temp": "—", "bp": "—", "hr": 0, "spo2": 0},
        status="current",
    )
    db.add(encounter)
    db.commit()

    return _patient_to_response(patient)


# ── List / Search Patients ──
@router.get("")
def list_patients(
    search: str = Query("", description="Search by name, patient_id, or registration_id"),
    status: str = Query("", description="Filter by status"),
    db: Session = Depends(get_db),
):
    q = db.query(Patient)
    if search:
        like = f"%{search}%"
        q = q.filter(
            Patient.full_name.ilike(like)
            | Patient.patient_id.ilike(like)
            | Patient.registration_id.ilike(like)
        )
    if status and status != "all":
        q = q.filter(Patient.status == status)
    patients = q.order_by(Patient.created_at.desc()).all()
    return [_patient_to_list(p) for p in patients]


def _patient_to_list(p: Patient) -> dict:
    return PatientListItem(
        id=p.id, patient_id=p.patient_id, registration_id=p.registration_id,
        full_name=p.full_name, dob=p.dob, gender=p.gender, status=p.status,
        chief_complaint=p.chief_complaint,
        created_at=str(p.created_at) if p.created_at else None,
    ).model_dump()


# ── Get Single Patient (full) ──
@router.get("/{patient_id_str}")
def get_patient(patient_id_str: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(
        (Patient.patient_id == patient_id_str) | (Patient.registration_id == patient_id_str)
    ).first()
    if not patient:
        # Try by integer ID
        try:
            patient = db.query(Patient).filter(Patient.id == int(patient_id_str)).first()
        except (ValueError, TypeError):
            pass
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    encounters = db.query(Encounter).filter(Encounter.patient_id == patient.id).order_by(Encounter.encounter_date).all()
    notes = db.query(DoctorNote).filter(DoctorNote.patient_id == patient.id).order_by(DoctorNote.created_at).all()

    result = _patient_to_response(patient).model_dump()
    result["encounters"] = [
        EncounterResponse(
            id=e.id, patient_id=e.patient_id,
            encounter_date=str(e.encounter_date) if e.encounter_date else None,
            chief_complaint=e.chief_complaint, vitals=e.vitals or {},
            diagnosis=e.diagnosis, treatment_plan=e.treatment_plan, status=e.status,
        ).model_dump()
        for e in encounters
    ]
    result["doctor_notes"] = [
        DoctorNoteResponse(
            id=n.id, patient_id=n.patient_id, note_text=n.note_text,
            doctor_name=n.doctor_name,
            created_at=str(n.created_at) if n.created_at else None,
        ).model_dump()
        for n in notes
    ]
    return result


# ── Update Patient Status ──
@router.put("/{patient_id}/status")
def update_status(patient_id: str, data: StatusUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(
        (Patient.patient_id == patient_id) | (Patient.registration_id == patient_id)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient.status = data.status
    patient.updated_at = datetime.utcnow()
    db.commit()
    return {"status": patient.status, "message": "Status updated"}


# ── Update Patient Notes ──
@router.put("/{patient_id}")
def update_patient(patient_id: str, data: PatientCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(
        (Patient.patient_id == patient_id) | (Patient.registration_id == patient_id)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for field in data.model_dump():
        setattr(patient, field, getattr(data, field))
    patient.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(patient)
    return _patient_to_response(patient).model_dump()


# ── Encounters ──
@router.get("/{patient_id}/encounters")
def get_encounters(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    encounters = db.query(Encounter).filter(Encounter.patient_id == patient.id).all()
    return [
        EncounterResponse(
            id=e.id, patient_id=e.patient_id,
            encounter_date=str(e.encounter_date) if e.encounter_date else None,
            chief_complaint=e.chief_complaint, vitals=e.vitals or {},
            diagnosis=e.diagnosis, treatment_plan=e.treatment_plan, status=e.status,
        ).model_dump()
        for e in encounters
    ]


@router.post("/{patient_id}/encounters", status_code=201)
def create_encounter(patient_id: str, data: EncounterCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Mark old encounters as completed
    db.query(Encounter).filter(
        Encounter.patient_id == patient.id, Encounter.status == "current"
    ).update({"status": "completed"})

    encounter = Encounter(
        patient_id=patient.id,
        chief_complaint=data.chief_complaint, vitals=data.vitals,
        diagnosis=data.diagnosis, treatment_plan=data.treatment_plan, status="current",
    )
    db.add(encounter)
    db.commit()
    db.refresh(encounter)
    return EncounterResponse(
        id=encounter.id, patient_id=encounter.patient_id,
        encounter_date=str(encounter.encounter_date),
        chief_complaint=encounter.chief_complaint, vitals=encounter.vitals or {},
        diagnosis=encounter.diagnosis, treatment_plan=encounter.treatment_plan,
        status=encounter.status,
    ).model_dump()


# ── Doctor Notes ──
@router.post("/{patient_id}/notes", status_code=201)
def create_note(patient_id: str, data: DoctorNoteCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    note = DoctorNote(
        patient_id=patient.id, encounter_id=data.encounter_id,
        note_text=data.note_text, doctor_name=data.doctor_name,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return DoctorNoteResponse(
        id=note.id, patient_id=note.patient_id, note_text=note.note_text,
        doctor_name=note.doctor_name,
        created_at=str(note.created_at),
    ).model_dump()


# ── Dashboard Stats ──
@router.get("/stats/counts")
def get_stats(db: Session = Depends(get_db)):
    counts = db.query(Patient.status, func.count(Patient.id)).group_by(Patient.status).all()
    stats = {s: 0 for s in ["registered", "waiting", "checked-in", "in-consultation", "completed"]}
    total = 0
    for status, count in counts:
        stats[status] = count
        total += count
    return DashboardStats(
        registered=stats["registered"], waiting=stats["waiting"],
        checked_in=stats["checked-in"], in_consultation=stats["in-consultation"],
        completed=stats["completed"], total=total,
    ).model_dump()
