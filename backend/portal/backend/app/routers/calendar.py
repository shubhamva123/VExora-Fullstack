from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import User
from app.schemas.calendar import (
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventResponse,
)
from app.services.calendar_service import (
    create_event,
    get_events,
    get_event,
    update_event,
    delete_event,
)

router = APIRouter(
    prefix="/calendar",
    tags=["Calendar"],
)


@router.get("/", response_model=list[CalendarEventResponse])
def list_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_events(db, current_user.user_id)


@router.post("/", response_model=CalendarEventResponse)
def add_event(
    event: CalendarEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_event(
        db=db,
        user_id=current_user.user_id,
        **event.model_dump(),
    )


@router.get("/{event_id}", response_model=CalendarEventResponse)
def read_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event(db, event_id, current_user.user_id)

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    return event


@router.patch("/{event_id}", response_model=CalendarEventResponse)
def edit_event(
    event_id: int,
    payload: CalendarEventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event(db, event_id, current_user.user_id)

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    return update_event(
        db,
        event,
        payload.model_dump(exclude_unset=True),
    )


@router.delete("/{event_id}")
def remove_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event(db, event_id, current_user.user_id)

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    delete_event(db, event)

    return {
        "message": "Event deleted successfully"
    }