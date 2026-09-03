import os

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import User
from app.schemas.file import FileUploadResponse
from app.services.file_service import (
    save_uploaded_file,
    get_note_files,
    get_file,
    delete_file,
)

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


@router.post(
    "/upload/{note_id}",
    response_model=FileUploadResponse,
)
def upload_file(
    note_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return save_uploaded_file(
        db=db,
        note_id=note_id,
        file=file,
    )


@router.get(
    "/note/{note_id}",
    response_model=list[FileUploadResponse],
)
def list_note_files(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_note_files(
        db,
        note_id,
    )


@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file = get_file(
        db,
        file_id,
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    if not os.path.exists(file.file_url):
        raise HTTPException(
            status_code=404,
            detail="Physical file not found",
        )

    return FileResponse(
        path=file.file_url,
        filename=file.file_name,
    )


@router.delete("/{file_id}")
def remove_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file = get_file(
        db,
        file_id,
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    delete_file(
        db,
        file,
    )

    return {
        "message": "File deleted successfully",
    }