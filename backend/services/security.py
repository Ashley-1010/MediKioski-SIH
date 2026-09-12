import os, hashlib, secrets
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import User

SECRET=os.getenv("JWT_SECRET","CHANGE-ME-IN-PRODUCTION")
ALGO="HS256"
bearer=HTTPBearer(auto_error=False)

def hash_password(password):
    salt=secrets.token_bytes(16)
    digest=hashlib.scrypt(password.encode(),salt=salt,n=2**14,r=8,p=1)
    return f"scrypt${salt.hex()}${digest.hex()}"

def verify_password(password, encoded):
    try:
        _,salt_hex,digest_hex=encoded.split("$")
        digest=hashlib.scrypt(password.encode(),salt=bytes.fromhex(salt_hex),n=2**14,r=8,p=1)
        return secrets.compare_digest(digest.hex(),digest_hex)
    except Exception: return False

def create_token(user):
    payload={"sub":str(user.id),"role":user.role,"exp":datetime.now(timezone.utc)+timedelta(hours=8)}
    return jwt.encode(payload,SECRET,algorithm=ALGO)

def current_user(creds:HTTPAuthorizationCredentials=Depends(bearer), db:Session=Depends(get_db)):
    if not creds: raise HTTPException(401,"Authentication required")
    try: payload=jwt.decode(creds.credentials,SECRET,algorithms=[ALGO])
    except Exception: raise HTTPException(401,"Invalid or expired token")
    user=db.get(User,int(payload["sub"]))
    if not user or not user.is_active: raise HTTPException(401,"Inactive user")
    return user

def require_roles(*roles):
    def dep(user=Depends(current_user)):
        if user.role not in roles: raise HTTPException(403,"Insufficient permissions")
        return user
    return dep
