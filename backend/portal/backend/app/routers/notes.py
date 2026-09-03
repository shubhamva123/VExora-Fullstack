from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import User
from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteUpdate,
)
from app.services.note_service import (
    create_note,
    delete_note,
    get_note,
    get_notes,
    update_note,
)

router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
)


@router.get("/", response_model=list[NoteResponse])
def list_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_notes(
        db,
        current_user.user_id,
    )


@router.get("/{note_id}", response_model=NoteResponse)
def read_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = get_note(
        db,
        note_id,
        current_user.user_id,
    )

    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    return note


@router.post("/", response_model=NoteResponse)
def create_new_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_note(
        db=db,
        user_id=current_user.user_id,
        title=note.title,
        content=note.content,
        is_for_revision=note.is_for_revision,
        next_revision_date=note.next_revision_date,
    )


@router.patch("/{note_id}", response_model=NoteResponse)
def edit_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = get_note(
        db,
        note_id,
        current_user.user_id,
    )

    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    data = note_data.model_dump(exclude_unset=True)

    return update_note(
        db,
        note,
        data,
    )


@router.delete("/{note_id}")
def remove_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = get_note(
        db,
        note_id,
        current_user.user_id,
    )

    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    delete_note(
        db,
        note,
    )

    return {
        "message": "Note deleted successfully"
    }