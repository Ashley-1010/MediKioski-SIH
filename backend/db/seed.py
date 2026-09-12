from datetime import date
from db.database import SessionLocal
from models.models import User
from services.security import hash_password

def seed_demo_users():
    db=SessionLocal()
    try:
        if not db.query(User).filter(User.email=="doctor@medikiosk.demo").first():
            db.add(User(name="Demo Doctor",email="doctor@medikiosk.demo",password_hash=hash_password("DemoDoctor@123"),role="doctor"))
        if not db.query(User).filter(User.email=="reception@medikiosk.demo").first():
            db.add(User(name="Demo Receptionist",email="reception@medikiosk.demo",password_hash=hash_password("DemoReception@123"),role="receptionist"))
        db.commit()
    finally: db.close()
