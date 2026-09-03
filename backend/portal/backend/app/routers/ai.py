from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import User
from app.schemas.ai import AIRequest, AIResponse
from app.services.ai_service import process_ai_request



router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)



@router.post(
    "/chat",
    response_model=AIResponse,
)
def ai_chat(
    data: AIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response = process_ai_request(
        db=db,
        user_id=current_user.user_id,
        message=data.message,
    )


    return AIResponse(
        message=response,
    )
