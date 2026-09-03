from sqlalchemy.orm import Session

from app.database.models import CalendarEvent


def create_event(
    db: Session,
    user_id: int,
    **data,
):
    # Accept `start_datetime` / `end_datetime` from API and split into
    # `event_date`, `start_time`, `end_time` for the DB model.
    sd = data.pop("start_datetime", None)
    ed = data.pop("end_datetime", None)

    if sd:
        data["event_date"] = sd.date()
        data["start_time"] = sd.time()
    elif ed:
        # If only end provided, use its date as event_date
        data["event_date"] = ed.date()

    if ed:
        data["end_time"] = ed.time()

    # Ensure defaults for optional fields
    data.setdefault("reminder_minutes", 30)
    data.setdefault("color", "#3b82f6")

    event = CalendarEvent(
        user_id=user_id,
        **data,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


def get_events(
    db: Session,
    user_id: int,
):
    events = (
        db.query(CalendarEvent)
        .filter(CalendarEvent.user_id == user_id)
        .order_by(
            CalendarEvent.event_date.asc(),
            CalendarEvent.start_time.asc(),
        )
        .all()
    )

    # Ensure defaults for serialization compatibility
    for ev in events:
        if getattr(ev, "reminder_minutes", None) is None:
            ev.reminder_minutes = 30
        if getattr(ev, "color", None) is None:
            ev.color = "#3b82f6"

    return events


def get_event(
    db: Session,
    event_id: int,
    user_id: int,
):
    event = (
        db.query(CalendarEvent)
        .filter(
            CalendarEvent.event_id == event_id,
            CalendarEvent.user_id == user_id,
        )
        .first()
    )

    if event is None:
        return None

    if getattr(event, "reminder_minutes", None) is None:
        event.reminder_minutes = 30
    if getattr(event, "color", None) is None:
        event.color = "#3b82f6"

    return event


def update_event(
    db: Session,
    event: CalendarEvent,
    data: dict,
):
    # Handle datetime fields coming from the API
    sd = data.pop("start_datetime", None)
    ed = data.pop("end_datetime", None)

    if sd:
        event.event_date = sd.date()
        event.start_time = sd.time()

    if ed:
        event.end_time = ed.time()

    for key, value in data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    return event


def delete_event(
    db: Session,
    event: CalendarEvent,
):
    db.delete(event)
    db.commit()