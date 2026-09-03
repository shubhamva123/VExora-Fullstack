from datetime import date, datetime

from pydantic import BaseModel


class RevisionCreate(BaseModel):
    note_id: int
    scheduled_date: date


class RevisionResponse(BaseModel):
    revision_id: int
    user_id: int
    note_id: int
    revision_number: int
    scheduled_date: date
    completed_date: datetime | None = None
    status: str
    interval_days: int
    ease_factor: float
    quality_score: int | None = None

    model_config = {
        "from_attributes": True,
    }