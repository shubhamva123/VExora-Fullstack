from datetime import date

from sqlalchemy.orm import Session

from app.database.models import ChatMessage
from app.services.ai_service import process_ai_request


def save_message(
    db: Session,
    user_id: int,
    sender: str,
    message: str,
):
    """
    Save a chat message to the database.
    """

    chat = ChatMessage(
        user_id=user_id,
        sender=sender,
        message_text=message,
        log_date=date.today(),
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


def chat_with_ai(
    db: Session,
    user_id: int,
    message: str,
):
    """
    Save the user's message, generate an AI response,
    save the AI response, and return it.
    """

    # Save user's message
    save_message(
        db=db,
        user_id=user_id,
        sender="user",
        message=message,
    )

    # Generate AI response
    ai_reply = process_ai_request(
        db=db,
        user_id=user_id,
        message=message,
    )

    # Save AI response
    save_message(
        db=db,
        user_id=user_id,
        sender="ai",
        message=ai_reply,
    )

    return {
        "reply": ai_reply,
    }


def get_chat_history(
    db: Session,
    user_id: int,
):
    """
    Retrieve chat history for a user.
    """

    return (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )