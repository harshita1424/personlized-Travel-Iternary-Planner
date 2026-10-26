from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import UserCreate, UserLogin, UserResponse, TokenResponse
from app.db.database import db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from typing import Dict, Any

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserCreate):
    existing = db.get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    hashed = hash_password(user_data.password)
    user = db.create_user(user_data.email, hashed, user_data.full_name)
    
    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user.get("full_name")})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin):
    user = db.get_user_by_email(login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user.get("full_name")})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    user = db.get_user_by_id(current_user["id"])
    if not user:
        return current_user
    return user
