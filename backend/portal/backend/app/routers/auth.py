from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
    OAuth2PasswordRequestForm,
)
from sqlalchemy.orm import Session

from app.auth.security import (
    create_access_token,
    get_current_user,
)
from app.database.connection import get_db
from app.schemas.auth import UserLogin, UserRegister
from app.services.auth_service import create_user, login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

security = HTTPBearer()


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    new_user = create_user(
        db=db,
        username=user.username,
        email=user.email,
        password=user.password,
    )

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    return {
        "message": "User registered successfully",
    }


# JSON login (React frontend)
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    db_user = login_user(
        db,
        user.email,
        user.password,
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token(
        data={"sub": str(db_user.user_id)}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.user_id,
            "username": db_user.username,
            "email": db_user.email,
        },
    }


# OAuth2 login (Swagger)
@router.post("/token")
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    db_user = login_user(
        db,
        form_data.username,
        form_data.password,
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={"sub": str(db_user.user_id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    user = get_current_user(
        credentials.credentials,
        db,
    )

    return {
        "id": user.user_id,
        "username": user.username,
        "email": user.email,
    }