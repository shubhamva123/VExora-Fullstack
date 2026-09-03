from pydantic import BaseModel


class FileUploadResponse(BaseModel):
    file_id: int
    file_name: str
    file_url: str
    file_type: str

    class Config:
        from_attributes = True