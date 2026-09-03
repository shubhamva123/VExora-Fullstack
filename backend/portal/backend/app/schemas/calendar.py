from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "general"
    start_datetime: datetime
    end_datetime: Optional[datetime] = None
    location: Optional[str] = None
    is_all_day: bool = False
    reminder_minutes: int = 30
    color: str = "#3b82f6"


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    location: Optional[str] = None
    is_all_day: Optional[bool] = None
    reminder_minutes: Optional[int] = None
    color: Optional[str] = None


class CalendarEventResponse(BaseModel):
    event_id: int
    user_id: int
    title: str
    description: Optional[str]
    event_type: str
    start_datetime: datetime
    end_datetime: Optional[datetime]
    location: Optional[str]
    is_all_day: bool
    reminder_minutes: int
    color: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }