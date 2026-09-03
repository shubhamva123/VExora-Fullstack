from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import User
from app.schemas.revision import RevisionCreate, RevisionResponse
from app.services.revision_service import (
    create_revision,
    get_revision_notes,
    get_revisions_by_date,
    mark_revision_complete,
)


router = APIRouter(
    prefix="/revision",
    tags=["Revision"],
)

# =========================================================
# GET TODAY'S PENDING REVISIONS
# =========================================================

@router.get(
    "/",
    response_model=list[RevisionResponse],
)
def list_revision_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_revision_notes(
        db=db,
        user_id=current_user.user_id,
    )

# =========================================================
# CREATE REVISION FROM NOTE
# =========================================================

@router.post(
    "/",
    response_model=RevisionResponse,
)
def add_revision(
    data: RevisionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    revision = create_revision(
        db=db,
        user_id=current_user.user_id,
        note_id=data.note_id,
        scheduled_date=data.scheduled_date,
    )

    if revision is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    return revision

# =========================================================
# MARK REVISION COMPLETE
# =========================================================

@router.patch(
    "/{revision_id}",
    response_model=RevisionResponse,
)
def complete_revision(
    revision_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    revision = mark_revision_complete(
        db=db,
        revision_id=revision_id,
        user_id=current_user.user_id,
    )

    if revision is None:
        raise HTTPException(
            status_code=404,
            detail="Revision not found",
        )

    return revision

# =========================================================
# GET REVISIONS FOR SPECIFIC DATE
# =========================================================

@router.get(
    "/date/{selected_date}",
    response_model=list[RevisionResponse],
)
def revisions_by_date(
    selected_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_revisions_by_date(
        db=db,
        user_id=current_user.user_id,
        selected_date=selected_date,
    )