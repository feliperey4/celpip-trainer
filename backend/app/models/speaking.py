from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
import base64


class SpeakingTaskType(str, Enum):
    GIVING_ADVICE = "giving_advice"
    TALKING_ABOUT_PERSONAL_EXPERIENCE = "talking_about_personal_experience"
    DESCRIBING_SCENE = "describing_scene"
    MAKING_PREDICTIONS = "making_predictions"
    COMPARING_OPINIONS = "comparing_opinions"
    DEALING_WITH_DIFFICULT_SITUATION = "dealing_with_difficult_situation"
    EXPRESSING_OPINIONS = "expressing_opinions"
    DESCRIBING_UNUSUAL_SITUATION = "describing_unusual_situation"


class SpeakingTask1Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title or subject of the advice scenario")
    situation: str = Field(..., description="The situation description where advice is needed")
    context: str = Field(..., description="Context or background information")
    person_description: str = Field(..., description="Description of the person asking for advice")
    advice_topic: str = Field(..., description="The main topic for advice (e.g., career, relationships, health)")
    image_description: Optional[str] = Field(None, description="Description of scenario image if applicable")


class SpeakingTask1Instructions(BaseModel):
    preparation_time_seconds: int = Field(default=30, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=90, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask1(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: SpeakingTaskType = Field(default=SpeakingTaskType.GIVING_ADVICE)
    scenario: SpeakingTask1Scenario = Field(..., description="The advice scenario")
    instructions: SpeakingTask1Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=3, description="Estimated total duration including prep time")


class SpeakingTask2Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the personal experience topic")
    topic: str = Field(..., description="The main topic to talk about")
    context: str = Field(..., description="Context or background for the experience")
    experience_type: str = Field(..., description="Type of experience (e.g., travel, learning, achievement)")
    guiding_questions: List[str] = Field(..., description="Questions to help guide the response")
    image_description: Optional[str] = Field(None, description="Description of scenario image if applicable")


class SpeakingTask2Instructions(BaseModel):
    preparation_time_seconds: int = Field(default=30, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=60, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask2(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: SpeakingTaskType = Field(default=SpeakingTaskType.TALKING_ABOUT_PERSONAL_EXPERIENCE)
    scenario: SpeakingTask2Scenario = Field(..., description="The personal experience scenario")
    instructions: SpeakingTask2Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=2, description="Estimated total duration including prep time")


class SpeakingTask3Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the scene description task")
    scene_description: str = Field(..., description="Detailed description of the scene/picture")
    context: str = Field(..., description="Context or setting of the scene")
    scene_type: str = Field(..., description="Type of scene (e.g., outdoor, indoor, workplace, social)")
    key_elements: List[str] = Field(..., description="Key elements that should be described")
    spatial_layout: str = Field(..., description="Description of spatial relationships in the scene")
    image_description: Optional[str] = Field(None, description="Description of the actual image if applicable")


class SpeakingTask3Instructions(BaseModel):
    preparation_time_seconds: int = Field(default=30, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=60, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask3(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: SpeakingTaskType = Field(default=SpeakingTaskType.DESCRIBING_SCENE)
    scenario: SpeakingTask3Scenario = Field(..., description="The scene description scenario")
    instructions: SpeakingTask3Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=2, description="Estimated total duration including prep time")
    scene_image: Optional[str] = Field(None, description="Base64 encoded image of the scene to describe")


class SpeakingTask4Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the prediction task")
    scene_description: str = Field(..., description="Detailed description of the scene/picture")
    context: str = Field(..., description="Context or setting of the scene")
    scene_type: str = Field(..., description="Type of scene (e.g., outdoor, indoor, workplace, social)")
    current_situation: str = Field(..., description="Current situation description")
    key_characters: List[str] = Field(..., description="Key characters/people in the scene")
    prediction_elements: List[str] = Field(..., description="Elements that can be used for predictions")
    possible_outcomes: List[str] = Field(..., description="Possible future outcomes to guide predictions")
    image_description: Optional[str] = Field(None, description="Description of the actual image if applicable")


class SpeakingTask4Instructions(BaseModel):
    preparation_time_seconds: int = Field(default=30, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=60, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask4(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: SpeakingTaskType = Field(default=SpeakingTaskType.MAKING_PREDICTIONS)
    scenario: SpeakingTask4Scenario = Field(..., description="The prediction scenario")
    instructions: SpeakingTask4Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=2, description="Estimated total duration including prep time")
    scene_image: Optional[str] = Field(None, description="Base64 encoded image of the scene to make predictions about")


class SpeakingTask8Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the unusual situation")
    situation_description: str = Field(..., description="Detailed description of the unusual situation")
    context: str = Field(..., description="Context or setting of the unusual situation")
    unusual_elements: List[str] = Field(..., description="List of unusual elements that make the situation strange")
    possible_explanations: List[str] = Field(..., description="Possible explanations for the unusual situation")
    descriptive_focus: str = Field(..., description="What aspects should be emphasized in the description")
    image_description: Optional[str] = Field(None, description="Description of the image if applicable")


class SpeakingTask8Instructions(BaseModel):
    preparation_time_seconds: int = Field(default=30, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=60, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask8(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: SpeakingTaskType = Field(default=SpeakingTaskType.DESCRIBING_UNUSUAL_SITUATION)
    scenario: SpeakingTask8Scenario = Field(..., description="The unusual situation scenario")
    instructions: SpeakingTask8Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=2, description="Estimated total duration including prep time")
    situation_image: Optional[str] = Field(None, description="Base64 encoded image of the unusual situation to describe")


class SpeakingTask1Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask1] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class SpeakingTask2Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask2] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class SpeakingTask3Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask3] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class SpeakingTask4Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask4] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class AudioSubmission(BaseModel):
    audio_data: str = Field(..., description="Base64 encoded audio data")
    audio_format: str = Field(default="webm", description="Audio format (webm, mp3, wav)")
    duration_seconds: float = Field(..., description="Duration of the audio in seconds")
    recording_quality: Optional[str] = Field(None, description="Recording quality assessment")


class SpeakingScoreBreakdown(BaseModel):
    content_score: float = Field(..., description="Score for content quality (1-12)")
    vocabulary_score: float = Field(..., description="Score for vocabulary usage (1-12)")
    language_use_score: float = Field(..., description="Score for grammar and language use (1-12)")
    task_fulfillment_score: float = Field(..., description="Score for task fulfillment (1-12)")
    overall_score: float = Field(..., description="Overall score (1-12)")


class SpeakingFeedback(BaseModel):
    strengths: List[str] = Field(..., description="Areas where the response was strong")
    improvements: List[str] = Field(..., description="Areas for improvement")
    specific_suggestions: List[str] = Field(..., description="Specific actionable suggestions")
    pronunciation_notes: Optional[str] = Field(None, description="Notes on pronunciation")
    fluency_notes: Optional[str] = Field(None, description="Notes on fluency and pacing")


# Speaking Task 5: Comparing and Persuading
class SpeakingTask5Option(BaseModel):
    option_id: str = Field(..., description="Unique identifier for the option")
    title: str = Field(..., description="Title of the option")
    description: str = Field(..., description="Description of the option")
    specifications: List[str] = Field(..., description="Key specifications or features")
    price: Optional[str] = Field(None, description="Price information if applicable")
    pros: List[str] = Field(..., description="Positive aspects of this option")
    cons: List[str] = Field(..., description="Negative aspects of this option")
    image_description: Optional[str] = Field(None, description="Description of the option image")


class SpeakingTask5Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the comparison scenario")
    context: str = Field(..., description="Context or background of the decision")
    decision_maker: str = Field(..., description="Who needs to be persuaded (e.g., 'family member', 'friend', 'colleague')")
    category: str = Field(..., description="Category of items being compared (e.g., 'houses', 'cars', 'electronics')")
    option_a: SpeakingTask5Option = Field(..., description="First option to compare")
    option_b: SpeakingTask5Option = Field(..., description="Second option to compare")
    persuasion_context: str = Field(..., description="Why persuasion is needed in this scenario")


class SpeakingTask5Instructions(BaseModel):
    selection_time_seconds: int = Field(default=60, description="Time for option selection in seconds")
    preparation_time_seconds: int = Field(default=60, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=60, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask5(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: str = Field(default="comparing_and_persuading", description="Type of speaking task")
    scenario: SpeakingTask5Scenario = Field(..., description="The comparison scenario")
    instructions: SpeakingTask5Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=3, description="Estimated total duration including all phases")
    option_a_image: Optional[str] = Field(None, description="Base64 encoded image for option A")
    option_b_image: Optional[str] = Field(None, description="Base64 encoded image for option B")


class SpeakingTask5Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="ID of the user submitting")
    selected_option: str = Field(..., description="Which option was selected (A or B)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask5 = Field(..., description="Context of the task")
    selection_time_used: Optional[int] = Field(None, description="Time used for selection phase")
    preparation_time_used: Optional[int] = Field(None, description="Time used for preparation phase")
    speaking_time_used: Optional[int] = Field(None, description="Time used for speaking phase")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")


class SpeakingTask5Score(BaseModel):
    task_id: str = Field(..., description="ID of the task")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the response")
    confidence_level: Optional[float] = Field(None, description="AI confidence in the scoring")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process the scoring")
    selected_option_analysis: Optional[str] = Field(None, description="Analysis of the option selection")
    persuasion_effectiveness: Optional[str] = Field(None, description="Analysis of persuasion effectiveness")


class SpeakingTask5ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask5Score] = Field(None, description="The calculated score")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")


class SpeakingTask5Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask5] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class SpeakingTask7Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the opinion topic")
    topic_statement: str = Field(..., description="The statement or question about which to express an opinion")
    context: str = Field(..., description="Context or background information about the topic")
    position_options: List[str] = Field(..., description="Available positions (e.g., 'agree', 'disagree', 'neutral')")
    supporting_points: List[str] = Field(..., description="Suggested supporting points for different positions")
    considerations: List[str] = Field(..., description="Important factors to consider when forming an opinion")
    image_description: Optional[str] = Field(None, description="Description of topic image if applicable")


class SpeakingTask7Instructions(BaseModel):
    preparation_time_seconds: int = Field(default=30, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=90, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask7(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: SpeakingTaskType = Field(default=SpeakingTaskType.EXPRESSING_OPINIONS)
    scenario: SpeakingTask7Scenario = Field(..., description="The opinion expression scenario")
    instructions: SpeakingTask7Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=2, description="Estimated total duration including prep time")


class SpeakingTask7Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask7] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class SpeakingTask8Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask8] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")



class SpeakingTask1Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="User identifier (optional)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask1 = Field(..., description="Original task context for scoring")
    preparation_time_used: Optional[float] = Field(None, description="Time spent in preparation phase")
    speaking_time_used: Optional[float] = Field(None, description="Time spent speaking")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")


class SpeakingTask2Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="User identifier (optional)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask2 = Field(..., description="Original task context for scoring")
    preparation_time_used: Optional[float] = Field(None, description="Time spent in preparation phase")
    speaking_time_used: Optional[float] = Field(None, description="Time spent speaking")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")


class SpeakingTask3Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="User identifier (optional)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask3 = Field(..., description="Original task context for scoring")
    preparation_time_used: Optional[float] = Field(None, description="Time spent in preparation phase")
    speaking_time_used: Optional[float] = Field(None, description="Time spent speaking")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")


class SpeakingTask4Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="User identifier (optional)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask4 = Field(..., description="Original task context for scoring")
    preparation_time_used: Optional[float] = Field(None, description="Time spent in preparation phase")
    speaking_time_used: Optional[float] = Field(None, description="Time spent speaking")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")


class SpeakingTask7Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="User identifier (optional)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask7 = Field(..., description="Original task context for scoring")
    chosen_position: Optional[str] = Field(None, description="Position chosen by the test-taker")
    preparation_time_used: Optional[float] = Field(None, description="Time spent in preparation phase")
    speaking_time_used: Optional[float] = Field(None, description="Time spent speaking")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")


class SpeakingTask8Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="User identifier (optional)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask8 = Field(..., description="Original task context for scoring")
    preparation_time_used: Optional[float] = Field(None, description="Time spent in preparation phase")
    speaking_time_used: Optional[float] = Field(None, description="Time spent speaking")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")




class SpeakingTask1Score(BaseModel):
    task_id: str = Field(..., description="ID of the task that was scored")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the spoken response")
    confidence_level: Optional[float] = Field(None, description="Confidence level of the scoring (0-1)")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process and score")


class SpeakingTask1ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask1Score] = Field(None, description="The scoring results")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")


class SpeakingTask2Score(BaseModel):
    task_id: str = Field(..., description="ID of the task that was scored")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the spoken response")
    confidence_level: Optional[float] = Field(None, description="Confidence level of the scoring (0-1)")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process and score")


class SpeakingTask2ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask2Score] = Field(None, description="The scoring results")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")


class SpeakingTask3Score(BaseModel):
    task_id: str = Field(..., description="ID of the task that was scored")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the spoken response")
    confidence_level: Optional[float] = Field(None, description="Confidence level of the scoring (0-1)")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process and score")


class SpeakingTask3ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask3Score] = Field(None, description="The scoring results")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")


class SpeakingTask4Score(BaseModel):
    task_id: str = Field(..., description="ID of the task that was scored")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the spoken response")
    confidence_level: Optional[float] = Field(None, description="Confidence level of the scoring (0-1)")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process and score")


class SpeakingTask4ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask4Score] = Field(None, description="The scoring results")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")


class SpeakingTask8Score(BaseModel):
    task_id: str = Field(..., description="ID of the task that was scored")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the spoken response")
    confidence_level: Optional[float] = Field(None, description="Confidence level of the scoring (0-1)")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process and score")


class SpeakingTask7Score(BaseModel):
    task_id: str = Field(..., description="ID of the task that was scored")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the spoken response")
    confidence_level: Optional[float] = Field(None, description="Confidence level of the scoring (0-1)")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process and score")


class SpeakingTask7ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask7Score] = Field(None, description="The scoring results")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")


class SpeakingTask6Scenario(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the scenario")
    title: str = Field(..., description="Title of the difficult situation")
    situation_description: str = Field(..., description="Detailed description of the difficult situation")
    context: str = Field(..., description="Context or background of the situation")
    involved_parties: List[str] = Field(..., description="List of people/parties involved in the situation")
    dilemma_explanation: str = Field(..., description="Explanation of why this situation is difficult")
    communication_options: List[str] = Field(..., description="Two communication options to choose from")
    relationship_context: str = Field(..., description="Context about relationships between parties")
    image_description: Optional[str] = Field(None, description="Description of scenario image if applicable")


class SpeakingTask6Instructions(BaseModel):
    preparation_time_seconds: int = Field(default=60, description="Time for preparation in seconds")
    speaking_time_seconds: int = Field(default=60, description="Time for speaking in seconds")
    task_description: str = Field(..., description="What the test-taker should do")
    evaluation_criteria: List[str] = Field(..., description="What will be evaluated")
    tips: List[str] = Field(default_factory=list, description="Helpful tips for the task")


class SpeakingTask6(BaseModel):
    task_id: str = Field(..., description="Unique identifier for the task")
    task_type: SpeakingTaskType = Field(default=SpeakingTaskType.DEALING_WITH_DIFFICULT_SITUATION)
    scenario: SpeakingTask6Scenario = Field(..., description="The difficult situation scenario")
    instructions: SpeakingTask6Instructions = Field(..., description="Task instructions and timing")
    difficulty_level: str = Field(default="intermediate", description="Difficulty level of the task")
    estimated_duration_minutes: int = Field(default=2, description="Estimated total duration including prep time")


class SpeakingTask6Response(BaseModel):
    success: bool = Field(..., description="Whether the task generation was successful")
    task: Optional[SpeakingTask6] = Field(None, description="The generated speaking task")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the task")


class SpeakingTask6Submission(BaseModel):
    task_id: str = Field(..., description="ID of the task being submitted")
    user_id: Optional[str] = Field(None, description="User identifier (optional)")
    audio: AudioSubmission = Field(..., description="Audio recording of the response")
    task_context: SpeakingTask6 = Field(..., description="Original task context for scoring")
    chosen_option: Optional[str] = Field(None, description="Communication option chosen by the test-taker")
    preparation_time_used: Optional[float] = Field(None, description="Time spent in preparation phase")
    speaking_time_used: Optional[float] = Field(None, description="Time spent speaking")
    submission_timestamp: Optional[str] = Field(None, description="When the submission was made")


class SpeakingTask6Score(BaseModel):
    task_id: str = Field(..., description="ID of the task that was scored")
    submission_id: str = Field(..., description="ID of the submission")
    scores: SpeakingScoreBreakdown = Field(..., description="Detailed score breakdown")
    feedback: SpeakingFeedback = Field(..., description="Detailed feedback")
    transcript: Optional[str] = Field(None, description="Transcript of the spoken response")
    confidence_level: Optional[float] = Field(None, description="Confidence level of the scoring (0-1)")
    processing_time_seconds: Optional[float] = Field(None, description="Time taken to process and score")


class SpeakingTask6ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask6Score] = Field(None, description="The scoring results")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")


class SpeakingTask8ScoreResponse(BaseModel):
    success: bool = Field(..., description="Whether the scoring was successful")
    score: Optional[SpeakingTask8Score] = Field(None, description="The scoring results")
    error_message: Optional[str] = Field(None, description="Error message if scoring failed")