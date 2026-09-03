from datetime import date

from pydantic import BaseModel


class ChatCreate(BaseModel):
    message: str


class ChatResponse(BaseModel):
    message_id: int
    sender: str
    message_text: str
    log_date: date

    model_config = {
        "from_attributes": True,
    }


class AIChatResponse(BaseModel):
    reply: str