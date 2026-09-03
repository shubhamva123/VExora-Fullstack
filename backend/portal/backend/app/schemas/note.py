from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = ""
    is_for_revision: bool = False
    next_revision_date: Optional[date] = None


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_for_revision: Optional[bool] = None
    next_revision_date: Optional[date] = None


class NoteResponse(BaseModel):
    note_id: int
    user_id: int
    title: str
    content: Optional[str]
    is_for_revision: bool
    next_revision_date: Optional[date]
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }