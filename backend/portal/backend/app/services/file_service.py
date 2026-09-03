import os
import shutil
import uuid

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.database.models import FileUpload

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_uploaded_file(
    db: Session,
    note_id: int,
    file: UploadFile,
):
    extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_file = FileUpload(
        note_id=note_id,
        file_name=file.filename,
        file_url=filepath,
        file_type=extension,
    )

    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file


def get_note_files(
    db: Session,
    note_id: int,
):
    return (
        db.query(FileUpload)
        .filter(FileUpload.note_id == note_id)
        .all()
    )


def get_file(
    db: Session,
    file_id: int,
):
    return (
        db.query(FileUpload)
        .filter(FileUpload.file_id == file_id)
        .first()
    )


def delete_file(
    db: Session,
    file: FileUpload,
):
    if os.path.exists(file.file_url):
        os.remove(file.file_url)

    db.delete(file)
    db.commit()