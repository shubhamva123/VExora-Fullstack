from sqlalchemy.orm import Session

from app.database.models import Note


def get_notes(db: Session, user_id: int):
    return (
        db.query(Note)
        .filter(Note.user_id == user_id)
        .order_by(Note.updated_at.desc())
        .all()
    )


def get_note(db: Session, note_id: int, user_id: int):
    return (
        db.query(Note)
        .filter(
            Note.note_id == note_id,
            Note.user_id == user_id,
        )
        .first()
    )


def create_note(
    db: Session,
    user_id: int,
    title: str,
    content: str = "",
    is_for_revision: bool = False,
    next_revision_date=None,
):
    note = Note(
        user_id=user_id,
        title=title,
        content=content,
        is_for_revision=is_for_revision,
        next_revision_date=next_revision_date,
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return note


def update_note(
    db: Session,
    note: Note,
    data: dict,
):
    for key, value in data.items():
        setattr(note, key, value)

    db.commit()
    db.refresh(note)

    return note


def delete_note(
    db: Session,
    note: Note,
):
    db.delete(note)
    db.commit()