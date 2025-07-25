from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    FILL_IN_BLANK = "fill_in_blank"
    TRUE_FALSE = "true_false"


class ReadingQuestion(BaseModel):
    question_id: str = Field(..., description="Unique identifier for the question")
    question_text: str = Field(..., description="The question text")
    question_type: QuestionType = Field(default=QuestionType.MULTIPLE_CHOICE)
    options: List[str] = Field(..., description="Answer options (A, B, C, D)")
    correct_answer: str = Field(..., description="The correct answer (A, B, C, or D)")
    explanation: Optional[str] = Field(None, description="Explanation of the correct answer")


class ReadingPassage(BaseModel):
    passage_id: str = Field(..., description="Unique identifier for the passage")
    title: str = Field(..., description="Title or subject of the correspondence")
    content: str = Field(..., description="The main text content of the correspondence")
    passage_type: str = Field(default="email", description="Type of correspondence (email, letter, etc.)")
    context: str = Field(..., description="Context or scenario (e.g., family trip, party invitation)")

class ReplayPassage(BaseModel):
    content: str = Field(..., description="The replay text content")

class ReadingTask1(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    passage: ReadingPassage = Field(..., description="The reading passage")
    reply_passage: ReplayPassage = Field(..., description="The reply passage")
    questions: List[ReadingQuestion] = Field(..., description="List of questions for the passage")
    time_limit_minutes: int = Field(default=11, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")


# ReadingTask1Request removed - endpoint no longer accepts parameters


class ReadingTask1Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ReadingTask1] = Field(None, description="The generated reading task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ReadingTask2Passage(BaseModel):
    passage_id: str = Field(..., description="Unique identifier for the passage")
    title: str = Field(..., description="Title of the informational text")
    content: str = Field(..., description="The main text content of the informational article")
    passage_type: str = Field(default="informational", description="Type of text (informational, news, academic)")
    topic: str = Field(..., description="Topic or subject area (e.g., technology, health, environment)")
    word_count: int = Field(..., description="Approximate word count of the passage")


class ReadingTask2(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    passage: ReadingTask2Passage = Field(..., description="The reading passage")
    questions: List[ReadingQuestion] = Field(..., description="List of questions for the passage")
    time_limit_minutes: int = Field(default=9, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    question_count: int = Field(default=8, description="Number of questions for this task")
    diagram_description: Optional[str] = Field(None, description="Description of the diagram to be used with the email")


class ReadingTask2Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ReadingTask2] = Field(None, description="The generated reading task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ReadingTask3Passage(BaseModel):
    passage_id: str = Field(..., description="Unique identifier for the passage")
    title: str = Field(..., description="Title of the informational article")
    paragraph_a: str = Field(..., description="Content of paragraph A")
    paragraph_b: str = Field(..., description="Content of paragraph B")
    paragraph_c: str = Field(..., description="Content of paragraph C")
    paragraph_d: str = Field(..., description="Content of paragraph D")
    passage_type: str = Field(default="informational", description="Type of text (informational, academic, current events)")
    topic: str = Field(..., description="Topic or subject area")
    word_count: int = Field(..., description="Approximate total word count of the passage")


class ReadingTask3Question(BaseModel):
    question_id: str = Field(..., description="Unique identifier for the question")
    statement: str = Field(..., description="The statement to match to a paragraph")
    correct_answer: str = Field(..., description="The correct paragraph (A, B, C, D, or E)")
    explanation: Optional[str] = Field(None, description="Explanation of the correct answer")


class ReadingTask3(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    passage: ReadingTask3Passage = Field(..., description="The reading passage with labeled paragraphs")
    questions: List[ReadingTask3Question] = Field(..., description="List of statements to match to paragraphs")
    time_limit_minutes: int = Field(default=10, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    question_count: int = Field(default=9, description="Number of questions for this task")


class ReadingTask3Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ReadingTask3] = Field(None, description="The generated reading task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ReadingTask4Passage(BaseModel):
    passage_id: str = Field(..., description="Unique identifier for the passage")
    title: str = Field(..., description="Title of the news article")
    article_content: str = Field(..., description="The main article content with multiple viewpoints")
    comment_content: str = Field(..., description="Reader's comment with blanks to fill")
    passage_type: str = Field(default="news_viewpoints", description="Type of text (news article with viewpoints)")
    topic: str = Field(..., description="Topic or subject area")
    word_count: int = Field(..., description="Approximate total word count of the passage")


class ReadingTask4Question(BaseModel):
    question_id: str = Field(..., description="Unique identifier for the question")
    question_text: str = Field(..., description="The question text")
    question_type: str = Field(..., description="Type of question: 'article' or 'comment'")
    options: Optional[List[str]] = Field(None, description="Answer options for article questions")
    correct_answer: str = Field(..., description="The correct answer")
    explanation: Optional[str] = Field(None, description="Explanation of the correct answer")
    blank_position: Optional[int] = Field(None, description="Position of blank in comment (for comment questions)")


class ReadingTask4(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    passage: ReadingTask4Passage = Field(..., description="The reading passage with article and comment")
    questions: List[ReadingTask4Question] = Field(..., description="List of questions about viewpoints and comment completion")
    time_limit_minutes: int = Field(default=13, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    question_count: int = Field(default=10, description="Number of questions for this task")


class ReadingTask4Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ReadingTask4] = Field(None, description="The generated reading task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")