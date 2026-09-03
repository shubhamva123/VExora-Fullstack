from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import User
from app.schemas.chat import (
    AIChatResponse,
    ChatCreate,
    ChatResponse,
)
from app.services.chat_service import (
    chat_with_ai,
    get_chat_history,
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/",
    response_model=AIChatResponse,
)
def create_chat_message(
    data: ChatCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return chat_with_ai(
        db=db,
        user_id=user.user_id,
        message=data.message,
    )


@router.get(
    "/",
    response_model=list[ChatResponse],
)
def list_chat_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_chat_history(
        db=db,
        user_id=user.user_id,
    )