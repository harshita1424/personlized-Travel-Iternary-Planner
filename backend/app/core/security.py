import hashlib
import hmac
import json
import base64
import time
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security_scheme = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Hash a password using PBKDF2 with SHA-256 and salt."""
    salt = "travel_salt_2026"
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return key.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password matches hash."""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: Dict[str, Any], expires_delta_seconds: Optional[int] = None) -> str:
    """Create a self-contained HMAC-SHA256 JWT-compatible token."""
    to_encode = data.copy()
    if expires_delta_seconds:
        expire = int(time.time()) + expires_delta_seconds
    else:
        expire = int(time.time()) + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    to_encode.update({"exp": expire})
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode().rstrip("=")
    
    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        f"{header_b64}.{payload_b64}".encode(),
        hashlib.sha256
    ).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify access token."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        # Verify signature
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode(),
            f"{header_b64}.{payload_b64}".encode(),
            hashlib.sha256
        ).digest()
        
        # Add padding back if necessary
        sig_padding = "=" * (4 - len(sig_b64) % 4) if len(sig_b64) % 4 != 0 else ""
        decoded_sig = base64.urlsafe_b64decode(sig_b64 + sig_padding)
        
        if not hmac.compare_digest(expected_sig, decoded_sig):
            return None
            
        payload_padding = "=" * (4 - len(payload_b64) % 4) if len(payload_b64) % 4 != 0 else ""
        payload = json.loads(base64.urlsafe_b64decode(payload_b64 + payload_padding).decode())
        
        if payload.get("exp") and time.time() > payload["exp"]:
            return None
            
        return payload
    except Exception:
        return None

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)) -> Dict[str, Any]:
    """Dependency to retrieve current user from Bearer token."""
    if not credentials or not credentials.credentials:
        # Default mock user if testing without auth headers
        return {
            "id": "00000000-0000-0000-0000-000000000001",
            "email": "demo@travelplanner.com",
            "full_name": "Demo Explorer"
        }
        
    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "id": payload.get("sub"),
        "email": payload.get("email", ""),
        "full_name": payload.get("name", "Traveler")
    }
