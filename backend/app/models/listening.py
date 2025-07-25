from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class ListeningQuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    PICTURE_SELECTION = "picture_selection"
    TRUE_FALSE = "true_false"


class ListeningQuestion(BaseModel):
    question_id: str = Field(..., description="Unique identifier for the question")
    question_text: str = Field(..., description="The question text")
    question_type: ListeningQuestionType = Field(default=ListeningQuestionType.MULTIPLE_CHOICE)
    options: List[str] = Field(..., description="Answer options (A, B, C, D)")
    correct_answer: str = Field(..., description="The correct answer (A, B, C, or D)")
    explanation: Optional[str] = Field(None, description="Explanation of the correct answer")
    picture_options: Optional[List[str]] = Field(None, description="Image descriptions for picture selection questions")
    conversation_id: Optional[str] = Field(None, description="ID of the conversation this question relates to")


class ListeningConversation(BaseModel):
    conversation_id: str = Field(..., description="Unique identifier for the conversation")
    title: str = Field(..., description="Brief title describing the conversation scenario")
    transcript: str = Field(..., description="Full transcript of the conversation")
    audio_description: str = Field(..., description="Description of the audio content and scenario")
    duration_seconds: int = Field(..., description="Duration of the conversation in seconds")
    speakers: List[str] = Field(..., description="List of speaker names/roles")
    scenario: str = Field(..., description="The problem-solving scenario (e.g., asking for directions)")


class ListeningPart1(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    conversations: List[ListeningConversation] = Field(..., description="List of 3 conversations")
    questions: List[ListeningQuestion] = Field(..., description="List of 8 questions for the conversations")
    time_limit_minutes: int = Field(default=12, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Listen to each conversation and answer the questions that follow.", description="Task instructions")


class ListeningPart1Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ListeningPart1] = Field(None, description="The generated listening task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ListeningPart2(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    conversation: ListeningConversation = Field(..., description="Single daily life conversation")
    questions: List[ListeningQuestion] = Field(..., description="List of 5 questions for the conversation")
    time_limit_minutes: int = Field(default=8, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Listen to the conversation and answer the questions that follow. You will hear the conversation only once.", description="Task instructions")


class ListeningPart2Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ListeningPart2] = Field(None, description="The generated listening task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ListeningPart3(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    conversation: ListeningConversation = Field(..., description="Single informational conversation/interview")
    questions: List[ListeningQuestion] = Field(..., description="List of 6 questions for the conversation")
    time_limit_minutes: int = Field(default=10, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Listen to the conversation and answer the questions that follow. You will hear the conversation only once.", description="Task instructions")


class ListeningPart3Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ListeningPart3] = Field(None, description="The generated listening task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ListeningNewsItem(BaseModel):
    news_id: str = Field(..., description="Unique identifier for the news item")
    title: str = Field(..., description="News item headline/title")
    content: str = Field(..., description="Full news report content/transcript")
    audio_description: str = Field(..., description="Description of the news broadcast")
    duration_seconds: int = Field(..., description="Duration of the news item in seconds")
    topic: str = Field(..., description="News topic/category (e.g., local community, health, technology)")
    location: str = Field(..., description="Location where the news event occurred")
    date: str = Field(..., description="Date of the news event")
    reporter: str = Field(..., description="Reporter name or news anchor")


class ListeningPart4(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    news_item: ListeningNewsItem = Field(..., description="Single news item broadcast")
    questions: List[ListeningQuestion] = Field(..., description="List of 5 questions for the news item")
    time_limit_minutes: int = Field(default=5, description="Time limit for the task in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Listen to the news item and answer the questions that follow. You will hear the news item only once.", description="Task instructions")


class ListeningPart4Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ListeningPart4] = Field(None, description="The generated listening task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ListeningDiscussion(BaseModel):
    discussion_id: str = Field(..., description="Unique identifier for the discussion")
    title: str = Field(..., description="Discussion topic/title")
    transcript: str = Field(..., description="Full transcript of the discussion")
    video_description: str = Field(..., description="Description of the video discussion content and visual elements")
    duration_seconds: int = Field(..., description="Duration of the discussion in seconds")
    speakers: List[str] = Field(..., description="List of speaker names/roles in the discussion")
    setting: str = Field(..., description="Discussion setting (e.g., workplace meeting, academic panel, conference)")
    topic: str = Field(..., description="Main topic of discussion")
    key_points: List[str] = Field(..., description="Key points covered in the discussion")


class ListeningPart5(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    discussion: ListeningDiscussion = Field(..., description="Single video discussion")
    questions: List[ListeningQuestion] = Field(..., description="List of 8 questions for the discussion")
    time_limit_minutes: int = Field(default=4, description="Time limit for answering questions in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Watch the video discussion and answer the questions that follow. You will see the video only once.", description="Task instructions")


class ListeningPart5Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ListeningPart5] = Field(None, description="The generated listening task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class ListeningViewpoint(BaseModel):
    viewpoint_id: str = Field(..., description="Unique identifier for the viewpoint presentation")
    title: str = Field(..., description="Viewpoint presentation title/topic")
    content: str = Field(..., description="Full viewpoint presentation content/transcript")
    audio_description: str = Field(..., description="Description of the presentation delivery and setting")
    duration_seconds: int = Field(..., description="Duration of the viewpoint presentation in seconds")
    speaker: str = Field(..., description="Speaker name or role (expert, commentator, etc.)")
    topic: str = Field(..., description="Main topic/issue being discussed")
    position: str = Field(..., description="Speaker's position or stance on the issue")
    key_arguments: List[str] = Field(..., description="Key arguments or points presented")
    supporting_evidence: List[str] = Field(..., description="Evidence or examples used to support the viewpoint")


class ListeningPart6(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    viewpoint: ListeningViewpoint = Field(..., description="Single viewpoint presentation")
    questions: List[ListeningQuestion] = Field(..., description="List of 6 questions for the viewpoint")
    time_limit_minutes: int = Field(default=8, description="Time limit for answering questions in minutes")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Listen to the viewpoint presentation and answer the questions that follow. You will hear the presentation only once.", description="Task instructions")


class ListeningPart6Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[ListeningPart6] = Field(None, description="The generated listening task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")