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


@router.get("/", response_model=list[NoteResponse])
def list_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_notes(
        db=db,
        user_id=current_user.user_id,
    )


@router.get("/{note_id}", response_model=NoteResponse)
def get_single_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = get_note(
        db=db,
        note_id=note_id,
        user_id=current_user.user_id,
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    return note


@router.put("/{note_id}", response_model=NoteResponse)
def edit_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = get_note(
        db=db,
        note_id=note_id,
        user_id=current_user.user_id,
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    return update_note(
        db=db,
        note=note,
        title=note_data.title,
        content=note_data.content,
        is_for_revision=note_data.is_for_revision,
        next_revision_date=note_data.next_revision_date,
    )


@router.delete("/{note_id}")
def remove_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = get_note(
        db=db,
        note_id=note_id,
        user_id=current_user.user_id,
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    delete_note(
        db=db,
        note=note,
    )

    return {
        "message": "Note deleted successfully"
    }