from pydantic import BaseModel




class AIRequest(BaseModel):
    message: str




class AIResponse(BaseModel):
    message: str


class SummaryRequest(BaseModel):
    text: str


class SummaryResponse(BaseModel):
    summary: str


class QuestionRequest(BaseModel):
    context: str
    question: str


class QuestionResponse(BaseModel):
    answer: str


class FlashcardResponse(BaseModel):
    question: str
    answer: str