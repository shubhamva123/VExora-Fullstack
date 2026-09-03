from datetime import date, datetime

from sqlalchemy.orm import Session

from app.database.models import Note, RevisionSchedule


def get_revision_notes(
    db: Session,
    user_id: int,
):
    today = date.today()

    return (
        db.query(RevisionSchedule)
        .filter(
            RevisionSchedule.user_id == user_id,
            RevisionSchedule.scheduled_date == today,
            RevisionSchedule.status == "pending",
        )
        .order_by(
            RevisionSchedule.scheduled_date.asc(),
            RevisionSchedule.revision_id.asc(),
        )
        .all()
    )


def get_revisions_by_date(
    db: Session,
    user_id: int,
    selected_date: date,
):
    return (
        db.query(RevisionSchedule)
        .filter(
            RevisionSchedule.user_id == user_id,
            RevisionSchedule.scheduled_date == selected_date,
        )
        .order_by(
            RevisionSchedule.revision_id.asc(),
        )
        .all()
    )


def create_revision(
    db: Session,
    user_id: int,
    note_id: int,
    scheduled_date: date,
):
    note = (
        db.query(Note)
        .filter(
            Note.note_id == note_id,
            Note.user_id == user_id,
        )
        .first()
    )

    if not note:
        return None

    latest_revision = (
        db.query(RevisionSchedule)
        .filter(
            RevisionSchedule.user_id == user_id,
            RevisionSchedule.note_id == note_id,
        )
        .order_by(
            RevisionSchedule.revision_number.desc()
        )
        .first()
    )

    if latest_revision:
        revision_number = latest_revision.revision_number + 1
    else:
        revision_number = 1

    revision = RevisionSchedule(
        user_id=user_id,
        note_id=note_id,
        revision_number=revision_number,
        scheduled_date=scheduled_date,
        status="pending",
        interval_days=1,
        ease_factor=2.50,
        quality_score=None,
    )

    db.add(revision)
    db.commit()
    db.refresh(revision)

    return revision


def mark_revision_complete(
    db: Session,
    revision_id: int,
    user_id: int,
):
    revision = (
        db.query(RevisionSchedule)
        .filter(
            RevisionSchedule.revision_id == revision_id,
            RevisionSchedule.user_id == user_id,
        )
        .first()
    )

    if not revision:
        return None

    revision.status = "completed"
    revision.completed_date = datetime.utcnow()

    db.commit()
    db.refresh(revision)

    return revision