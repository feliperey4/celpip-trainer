from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class WritingTaskType(str, Enum):
    EMAIL = "email"


class WritingTask1Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Brief title describing the scenario")
    context: str = Field(..., description="Situation context and background")
    recipient: str = Field(..., description="Who you are writing to (friend, colleague, service provider, etc.)")
    purpose: str = Field(..., description="Purpose of the email (request, complaint, inquiry, etc.)")
    key_points: List[str] = Field(..., description="Key points that must be addressed in the email")
    tone: str = Field(..., description="Required tone (formal, informal, friendly, professional, etc.)")
    relationship: str = Field(..., description="Relationship to recipient (personal, professional, business)")


class WritingTask1(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    scenario: WritingTask1Scenario = Field(..., description="The writing scenario and instructions")
    time_limit_minutes: int = Field(default=27, description="Time limit for the task in minutes")
    word_count_min: int = Field(default=150, description="Minimum word count")
    word_count_max: int = Field(default=200, description="Maximum word count")
    task_type: WritingTaskType = Field(default=WritingTaskType.EMAIL, description="Type of writing task")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Write an email responding to the situation described above. Your email should be between 150-200 words.", description="Task instructions")


class WritingTask1Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[WritingTask1] = Field(None, description="The generated writing task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


# Review Models for CELPIP Writing Assessment
class WritingCriteriaScore(BaseModel):
    score: int = Field(..., description="Score from 1-12 for this criterion", ge=1, le=12)
    feedback: str = Field(..., description="Detailed feedback for this criterion")
    strengths: List[str] = Field(..., description="What the writer did well in this area")
    areas_for_improvement: List[str] = Field(..., description="What needs to be improved")
    examples: List[str] = Field(default=[], description="Specific examples from the text")


class WritingTask1Review(BaseModel):
    overall_score: int = Field(..., description="Overall CELPIP score from 1-12", ge=1, le=12)
    content_coherence: WritingCriteriaScore = Field(..., description="Content & Coherence assessment")
    vocabulary: WritingCriteriaScore = Field(..., description="Vocabulary assessment")
    readability: WritingCriteriaScore = Field(..., description="Readability assessment")
    task_fulfillment: WritingCriteriaScore = Field(..., description="Task Fulfillment assessment")
    
    overall_feedback: str = Field(..., description="Overall feedback summary")
    improvement_strategies: List[str] = Field(..., description="Specific strategies to improve writing")
    word_count: int = Field(..., description="Actual word count of the submission")
    is_word_count_appropriate: bool = Field(..., description="Whether word count is within required range")
    
    key_achievements: List[str] = Field(..., description="Main strengths of the writing")
    priority_improvements: List[str] = Field(..., description="Top 3 areas to focus on for improvement")


class WritingTask1ReviewRequest(BaseModel):
    task_id: str = Field(..., description="ID of the original writing task")
    user_text: str = Field(..., description="The user's written response to review")
    scenario: WritingTask1Scenario = Field(..., description="The original scenario for context")


class WritingTask1ReviewResponse(BaseModel):
    success: bool = Field(..., description="Whether the review was successful")
    review: Optional[WritingTask1Review] = Field(None, description="The detailed review and scoring")
    error_message: Optional[str] = Field(None, description="Error message if review failed")
    review_time_seconds: Optional[float] = Field(None, description="Time taken to complete the review")


# Writing Task 2 Models (Survey Response)
class WritingTask2Survey(BaseModel):
    survey_id: str = Field(..., description="Unique identifier for the survey")
    title: str = Field(..., description="Survey title and topic")
    description: str = Field(..., description="Survey background and context")
    question: str = Field(..., description="The main survey question to respond to")
    options: List[str] = Field(..., description="Survey options (typically 2-3 choices)")
    additional_considerations: List[str] = Field(..., description="Additional aspects to consider in the response")


class WritingTask2(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    survey: WritingTask2Survey = Field(..., description="The survey to respond to")
    time_limit_minutes: int = Field(default=26, description="Time limit for the task in minutes")
    word_count_min: int = Field(default=150, description="Minimum word count")
    word_count_max: int = Field(default=200, description="Maximum word count")
    task_type: str = Field(default="survey_response", description="Type of writing task")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    instructions: str = Field(default="Choose ONE option that you prefer. Explain the reasons for your choice. Write about 150-200 words.", description="Task instructions")


class WritingTask2Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[WritingTask2] = Field(None, description="The generated writing task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


# Writing Task 2 Review Models
class WritingTask2Review(BaseModel):
    overall_score: int = Field(..., description="Overall CELPIP score from 1-12", ge=1, le=12)
    content_coherence: WritingCriteriaScore = Field(..., description="Content & Coherence assessment")
    vocabulary: WritingCriteriaScore = Field(..., description="Vocabulary assessment")
    readability: WritingCriteriaScore = Field(..., description="Readability assessment")
    task_fulfillment: WritingCriteriaScore = Field(..., description="Task Fulfillment assessment")
    
    overall_feedback: str = Field(..., description="Overall feedback summary")
    improvement_strategies: List[str] = Field(..., description="Specific strategies to improve writing")
    word_count: int = Field(..., description="Actual word count of the submission")
    is_word_count_appropriate: bool = Field(..., description="Whether word count is within required range")
    
    key_achievements: List[str] = Field(..., description="Main strengths of the writing")
    priority_improvements: List[str] = Field(..., description="Top 3 areas to focus on for improvement")
    chosen_option: str = Field(..., description="The option the user chose to support")
    option_support_quality: str = Field(..., description="Assessment of how well the user supported their chosen option")


class WritingTask2ReviewRequest(BaseModel):
    task_id: str = Field(..., description="ID of the original writing task")
    user_text: str = Field(..., description="The user's written response to review")
    survey: WritingTask2Survey = Field(..., description="The original survey for context")
    chosen_option: str = Field(..., description="The option the user chose to support")


class WritingTask2ReviewResponse(BaseModel):
    success: bool = Field(..., description="Whether the review was successful")
    review: Optional[WritingTask2Review] = Field(None, description="The detailed review and scoring")
    error_message: Optional[str] = Field(None, description="Error message if review failed")
    review_time_seconds: Optional[float] = Field(None, description="Time taken to complete the review")