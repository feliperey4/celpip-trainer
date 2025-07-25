"""
CELPIP Task Generator Implementation

This module implements CELPIP task generation using various LLM providers.
"""

import json
import time
import uuid
import logging
import random
from typing import Dict, Any, Optional

from app.services.llm_provider import LLMProvider, CELPIPTaskGenerator
from app.services.prompts.reading_prompts import ReadingTaskPrompts, ReadingTaskTopics
from app.services.prompts.listening_prompts import ListeningTaskPrompts, ListeningTaskTopics
from app.services.prompts.writing_prompts import WritingTaskPrompts
from app.services.prompts.speaking_prompts import SpeakingTaskPrompts, SpeakingTaskTopics
from app.models.reading import ReadingTask1, ReadingTask2, ReadingTask3, ReadingTask4
from app.models.listening import ListeningPart1, ListeningPart2, ListeningPart3, ListeningPart4, ListeningPart5, ListeningPart6
from app.models.writing import WritingTask1, WritingTask1Review, WritingTask1Scenario, WritingTask2, WritingTask2Review, WritingTask2Survey
from app.models.speaking import SpeakingTask1, SpeakingTask1Score, SpeakingTask1Submission, SpeakingTask2, SpeakingTask2Score, SpeakingTask2Submission, SpeakingTask3, SpeakingTask3Score, SpeakingTask3Submission, SpeakingTask4, SpeakingTask4Score, SpeakingTask4Submission, SpeakingTask5, SpeakingTask5Score, SpeakingTask5Submission, SpeakingTask6, SpeakingTask6Score, SpeakingTask6Submission, SpeakingTask7, SpeakingTask7Score, SpeakingTask7Submission, SpeakingTask8, SpeakingTask8Score, SpeakingTask8Submission
from app.models.images import ImageGenerationRequest, ImageGenerationResponse

logger = logging.getLogger(__name__)


class CELPIPGenerator(CELPIPTaskGenerator):
    """CELPIP task generator using configurable LLM providers."""
    
    def __init__(self, llm_provider: LLMProvider):
        super().__init__(llm_provider)
        self.logger = logger
    
    async def _generate_and_parse_json(self, prompt: str, task_type: str) -> Dict[str, Any]:
        """
        Generate content using LLM and parse as JSON.
        
        Args:
            prompt: The prompt to send to the LLM
            task_type: Type of task for logging purposes
            
        Returns:
            Parsed JSON data
            
        Raises:
            Exception: If generation or parsing fails
        """
        try:
            self.logger.info(f"Generating {task_type} with {self.llm_provider.get_provider_name()}")
            
            response = await self.llm_provider.generate_content(prompt)
            
            if not response or len(response.strip()) < 10:
                raise ValueError(f"Empty or too short response from LLM provider")
            
            # Check if response is HTML (error page)
            if response.strip().lower().startswith('<!doctype') or response.strip().lower().startswith('<html'):
                self.logger.error(f"Received HTML response instead of JSON for {task_type}")
                self.logger.error(f"Response preview: {response[:200]}...")
                raise ValueError(f"LLM provider returned HTML error page instead of JSON content")
            
            # Check if response contains error indicators
            if "error" in response.lower() and ("exception" in response.lower() or "traceback" in response.lower()):
                self.logger.error(f"Error response detected for {task_type}: {response[:200]}...")
                raise ValueError(f"LLM provider returned error response")
            
            # Extract JSON from response (handle markdown code blocks)
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start == -1 or json_end == 0:
                # Try to find JSON in code blocks
                if '```json' in response:
                    json_block_start = response.find('```json') + 7
                    json_block_end = response.find('```', json_block_start)
                    if json_block_end > json_block_start:
                        json_content = response[json_block_start:json_block_end].strip()
                        json_start = json_content.find('{')
                        json_end = json_content.rfind('}') + 1
                        if json_start != -1 and json_end > 0:
                            json_str = json_content[json_start:json_end]
                        else:
                            raise ValueError("No valid JSON found in code block")
                    else:
                        raise ValueError("Malformed JSON code block")
                else:
                    self.logger.error(f"No JSON found in response for {task_type}")
                    self.logger.error(f"Response preview: {response[:500]}...")
                    raise ValueError("No valid JSON found in response")
            else:
                json_str = response[json_start:json_end]
            
            self.logger.info(f"Raw JSON string length: {len(json_str)}")
            
            # Validate JSON before parsing
            if len(json_str.strip()) < 10:
                raise ValueError("Extracted JSON too short")
            
            data = json.loads(json_str)
            self.logger.info(f"Parsed JSON successfully")
            
            # Auto-fix missing ID fields
            self.logger.info(f"Before ID fix: {list(data.keys())}")
            data = self._ensure_question_ids(data)
            self.logger.info(f"After ID fix: {list(data.keys())}")
            
            # Log structure for debugging
            if "questions" in data:
                self.logger.info(f"Questions count: {len(data['questions'])}")
            
            if "scenario" in data:
                self.logger.info(f"Scenario structure found")
            
            self.logger.info(f"Successfully generated and parsed {task_type}")
            return data
            
        except json.JSONDecodeError as e:
            self.logger.error(f"JSON parsing failed for {task_type}: {str(e)}")
            raise Exception(f"Failed to parse {task_type} JSON: {str(e)}")
        except Exception as e:
            self.logger.error(f"{task_type} generation failed: {str(e)}")
            raise Exception(f"Failed to generate {task_type}: {str(e)}")
    
    def _ensure_question_ids(self, data: dict) -> dict:
        """Ensure all questions and entities have required ID fields."""
        import uuid

        
        # Add task_id if missing
        if "task_id" not in data:
            data["task_id"] = str(uuid.uuid4())
        
        # Add passage_id if missing
        if "passage" in data and isinstance(data["passage"], dict):
            if "passage_id" not in data["passage"]:
                data["passage"]["passage_id"] = str(uuid.uuid4())
        
        # Add question_id if missing
        if "questions" in data and isinstance(data["questions"], list):
            for i, question in enumerate(data["questions"]):
                if isinstance(question, dict) and "question_id" not in question:
                    question["question_id"] = f"q{i+1}"
        
        # Handle special Reading Task 1 structure with reply_passage 
        if "reply_passage" in data and isinstance(data["reply_passage"], dict):
            if "passage_id" not in data["reply_passage"]:
                data["reply_passage"]["passage_id"] = str(uuid.uuid4())
        
        # Handle Reading Task 3 structure
        if "passage" in data and isinstance(data["passage"], dict):
            # For Task 3, ensure paragraph fields exist
            task3_fields = ["paragraph_a", "paragraph_b", "paragraph_c", "paragraph_d"]
            if any(field in data["passage"] for field in task3_fields):
                if "passage_id" not in data["passage"]:
                    data["passage"]["passage_id"] = str(uuid.uuid4())
        
        # Handle Reading Task 4 structure  
        if "passage" in data and isinstance(data["passage"], dict):
            if "article_content" in data["passage"] and "comment_content" in data["passage"]:
                if "passage_id" not in data["passage"]:
                    data["passage"]["passage_id"] = str(uuid.uuid4())
        
        # Handle Listening structures
        if "conversations" in data and isinstance(data["conversations"], list):
            for conversation in data["conversations"]:
                if isinstance(conversation, dict) and "conversation_id" not in conversation:
                    conversation["conversation_id"] = str(uuid.uuid4())
        
        if "conversation" in data and isinstance(data["conversation"], dict):
            if "conversation_id" not in data["conversation"]:
                data["conversation"]["conversation_id"] = str(uuid.uuid4())
        
        if "news_item" in data and isinstance(data["news_item"], dict):
            if "news_id" not in data["news_item"]:
                data["news_item"]["news_id"] = str(uuid.uuid4())
        
        if "discussion" in data and isinstance(data["discussion"], dict):
            if "discussion_id" not in data["discussion"]:
                data["discussion"]["discussion_id"] = str(uuid.uuid4())
        
        if "viewpoint" in data and isinstance(data["viewpoint"], dict):
            if "viewpoint_id" not in data["viewpoint"]:
                data["viewpoint"]["viewpoint_id"] = str(uuid.uuid4())
        
        # Handle Writing Task 1 structure
        if "scenario" in data and isinstance(data["scenario"], dict):
            if "scenario_id" not in data["scenario"]:
                data["scenario"]["scenario_id"] = str(uuid.uuid4())
        
        # Handle Writing Task 2 structure
        if "survey" in data and isinstance(data["survey"], dict):
            if "survey_id" not in data["survey"]:
                data["survey"]["survey_id"] = str(uuid.uuid4())
        
        return data
    
    # Reading Task Generation Methods
    async def generate_reading_task1(self) -> ReadingTask1:
        """Generate CELPIP Reading Task 1."""
        topic = random.choice(ReadingTaskTopics.TASK1_TOPICS)
        context_type = random.choice(ReadingTaskTopics.TASK1_CONTEXT_TYPES)
        
        prompt = ReadingTaskPrompts.create_task1_prompt(topic, context_type)
        data = await self._generate_and_parse_json(prompt, "Reading Task 1")
        
        return ReadingTask1(**data)
    
    async def generate_reading_task2(self) -> ReadingTask2:
        """Generate CELPIP Reading Task 2.""" 
        topic = random.choice(ReadingTaskTopics.TASK2_TOPICS)
        
        prompt = ReadingTaskPrompts.create_task2_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Reading Task 2")
        
        return ReadingTask2(**data)
    
    async def generate_reading_task3(self) -> ReadingTask3:
        """Generate CELPIP Reading Task 3."""
        topic = random.choice(ReadingTaskTopics.TASK3_TOPICS)
        
        prompt = ReadingTaskPrompts.create_task3_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Reading Task 3")
        
        return ReadingTask3(**data)
    
    async def generate_reading_task4(self) -> ReadingTask4:
        """Generate CELPIP Reading Task 4."""
        topic = random.choice(ReadingTaskTopics.TASK4_TOPICS)
        
        prompt = ReadingTaskPrompts.create_task4_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Reading Task 4")
        
        return ReadingTask4(**data)
    
    # Listening Task Generation Methods
    async def generate_listening_part1(self) -> ListeningPart1:
        """Generate CELPIP Listening Part 1."""
        topic = random.choice(ListeningTaskTopics.PART1_TOPICS)
        
        prompt = ListeningTaskPrompts.create_part1_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Listening Part 1")
        
        return ListeningPart1(**data)
    
    async def generate_listening_part2(self) -> ListeningPart2:
        """Generate CELPIP Listening Part 2."""
        topic = random.choice(ListeningTaskTopics.PART2_TOPICS)
        
        prompt = ListeningTaskPrompts.create_part2_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Listening Part 2")
        
        return ListeningPart2(**data)
    
    async def generate_listening_part3(self) -> ListeningPart3:
        """Generate CELPIP Listening Part 3."""
        topic = random.choice(ListeningTaskTopics.PART3_TOPICS)
        
        prompt = ListeningTaskPrompts.create_part3_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Listening Part 3")
        
        return ListeningPart3(**data)
    
    async def generate_listening_part4(self) -> ListeningPart4:
        """Generate CELPIP Listening Part 4."""
        topic = random.choice(ListeningTaskTopics.PART4_TOPICS)
        
        prompt = ListeningTaskPrompts.create_part4_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Listening Part 4")
        
        return ListeningPart4(**data)
    
    async def generate_listening_part5(self) -> ListeningPart5:
        """Generate CELPIP Listening Part 5."""
        topic = random.choice(ListeningTaskTopics.PART5_TOPICS)
        
        prompt = ListeningTaskPrompts.create_part5_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Listening Part 5")
        
        return ListeningPart5(**data)
    
    async def generate_listening_part6(self) -> ListeningPart6:
        """Generate CELPIP Listening Part 6."""
        topic = random.choice(ListeningTaskTopics.PART6_TOPICS)
        
        prompt = ListeningTaskPrompts.create_part6_prompt(topic)
        data = await self._generate_and_parse_json(prompt, "Listening Part 6")
        
        return ListeningPart6(**data)
    
    # Writing Task Generation Methods
    async def generate_writing_task1(self) -> WritingTask1:
        """Generate CELPIP Writing Task 1."""        
        prompt = WritingTaskPrompts.create_task1_prompt()
        data = await self._generate_and_parse_json(prompt, "Writing Task 1")
        
        return WritingTask1(**data)
    
    async def generate_writing_task2(self) -> WritingTask2:
        """Generate CELPIP Writing Task 2."""        
        prompt = WritingTaskPrompts.create_task2_prompt()
        data = await self._generate_and_parse_json(prompt, "Writing Task 2")
        
        return WritingTask2(**data)
    
    # Writing Task Review Methods
    async def review_writing_task1(self, user_text: str, scenario: WritingTask1Scenario, task_id: str) -> WritingTask1Review:
        """Review and score CELPIP Writing Task 1 submission."""
        
        # Count words in user text
        word_count = len(user_text.strip().split()) if user_text.strip() else 0
        
        # Create review prompt
        prompt = WritingTaskPrompts.create_review_prompt(
            user_text=user_text,
            scenario_title=scenario.title,
            scenario_context=scenario.context,
            recipient=scenario.recipient,
            purpose=scenario.purpose,
            tone=scenario.tone,
            key_points=scenario.key_points,
            word_count_min=150,
            word_count_max=200
        )
        
        # Generate review using LLM
        data = await self._generate_and_parse_json(prompt, "Writing Task 1 Review")
        
        # Add calculated word count to the data
        data["word_count"] = word_count
        data["is_word_count_appropriate"] = 150 <= word_count <= 200
        
        return WritingTask1Review(**data)
    
    async def review_writing_task2(self, user_text: str, survey: WritingTask2Survey, chosen_option: str, task_id: str) -> WritingTask2Review:
        """Review and score CELPIP Writing Task 2 submission."""
        
        # Count words in user text
        word_count = len(user_text.strip().split()) if user_text.strip() else 0
        
        # Create review prompt
        prompt = WritingTaskPrompts.create_task2_review_prompt(
            user_text=user_text,
            survey_title=survey.title,
            survey_description=survey.description,
            survey_question=survey.question,
            survey_options=survey.options,
            chosen_option=chosen_option,
            additional_considerations=survey.additional_considerations,
            word_count_min=150,
            word_count_max=200
        )
        
        # Generate review using LLM
        data = await self._generate_and_parse_json(prompt, "Writing Task 2 Review")
        
        # Add calculated word count and chosen option to the data
        data["word_count"] = word_count
        data["is_word_count_appropriate"] = 150 <= word_count <= 200
        data["chosen_option"] = chosen_option
        
        return WritingTask2Review(**data)
    
    # Speaking Task Generation Methods
    async def generate_speaking_task1(self) -> SpeakingTask1:
        """Generate CELPIP Speaking Task 1 (Giving Advice)."""
        scenario = random.choice(SpeakingTaskTopics.TASK1_ADVICE_SCENARIOS)
        person_description = random.choice(SpeakingTaskTopics.PERSON_DESCRIPTIONS)
        advice_context = random.choice(SpeakingTaskTopics.ADVICE_CONTEXTS)
        
        prompt = SpeakingTaskPrompts.create_task1_prompt(scenario, person_description, advice_context)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 1")
        
        return SpeakingTask1(**data)
    
    async def score_speaking_task1(self, submission: SpeakingTask1Submission, task: SpeakingTask1, transcript: str) -> SpeakingTask1Score:
        """Score a CELPIP Speaking Task 1 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Situation: {task.scenario.situation}
        Context: {task.scenario.context}
        Person Description: {task.scenario.person_description}
        Advice Topic: {task.scenario.advice_topic}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        """
        
        prompt = SpeakingTaskPrompts.create_speech_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 1 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        
        return SpeakingTask1Score(**data)
    
    async def generate_speaking_task2(self) -> SpeakingTask2:
        """Generate CELPIP Speaking Task 2 (Talking about Personal Experience)."""
        experience_topic = random.choice(SpeakingTaskTopics.TASK2_EXPERIENCE_TOPICS)
        experience_type = random.choice(SpeakingTaskTopics.EXPERIENCE_TYPES)
        
        prompt = SpeakingTaskPrompts.create_task2_prompt(experience_topic, experience_type)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 2")
        
        return SpeakingTask2(**data)
    
    async def score_speaking_task2(self, submission: SpeakingTask2Submission, task: SpeakingTask2, transcript: str) -> SpeakingTask2Score:
        """Score a CELPIP Speaking Task 2 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Topic: {task.scenario.topic}
        Context: {task.scenario.context}
        Experience Type: {task.scenario.experience_type}
        Guiding Questions: {', '.join(task.scenario.guiding_questions)}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        """
        
        prompt = SpeakingTaskPrompts.create_task2_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 2 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        
        return SpeakingTask2Score(**data)
    
    async def generate_speaking_task3(self) -> SpeakingTask3:
        """Generate CELPIP Speaking Task 3 (Describing a Scene)."""
        scene_type = random.choice(SpeakingTaskTopics.TASK3_SCENE_TYPES)
        scene_setting = random.choice(SpeakingTaskTopics.TASK3_SCENE_SETTINGS)
        
        prompt = SpeakingTaskPrompts.create_task3_prompt(scene_type, scene_setting)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 3")
        
        # Generate the scene image
        image_data = await self._generate_scene_image(data, scene_type, scene_setting)
        if image_data:
            data["scene_image"] = image_data
        
        return SpeakingTask3(**data)
    
    async def _generate_scene_image(self, task_data: Dict[str, Any], scene_type: str, scene_setting: str) -> Optional[str]:
        """
        Generate a scene image for Speaking Task 3.
        
        Args:
            task_data: Generated task data containing scenario description
            scene_type: Type of scene (e.g., 'park', 'office')
            scene_setting: Setting context (e.g., 'outdoor', 'indoor')
            
        Returns:
            Base64 encoded image data or None if generation fails
        """
        try:
            # Extract scene description from task data
            scenario = task_data.get("scenario", {})
            scene_description = scenario.get("scene_description", "")
            title = scenario.get("title", "")
            
            # Create image generation prompt
            image_prompt = self._build_scene_image_prompt(
                scene_description, title, scene_type, scene_setting
            )
            
            # Create image generation request
            from app.models.images import ImageGenerationRequest, ImageStyle, ImageSize
            
            request = ImageGenerationRequest(
                prompt=image_prompt,
                style=ImageStyle.CARTOON,
                size=ImageSize.MEDIUM,
                context=f"CELPIP Speaking Task 3 or 4 - {scene_type} scene in {scene_setting} setting",
                task_type="speaking",
                negative_prompt="blurry, low quality, inappropriate content, text, watermarks"
            )
            
            # Generate the image
            response = await self.llm_provider.generate_image(request)
            
            if response.success and response.image_data:
                self.logger.info(f"Successfully generated scene image for {scene_type} in {response.generation_time_seconds:.2f}s")
                return response.image_data
            else:
                self.logger.warning(f"Image generation failed: {response.error_message}")
                return None
                
        except Exception as e:
            self.logger.error(f"Error generating scene image: {str(e)}")
            return None
    
    def _build_scene_image_prompt(self, scene_description: str, title: str, scene_type: str, scene_setting: str) -> str:
        """
        Build an image generation prompt for the scene.
        
        Args:
            scene_description: Detailed description of the scene
            title: Title of the scenario
            scene_type: Type of scene
            scene_setting: Setting context
            
        Returns:
            Formatted image generation prompt
        """
        prompt_parts = []
        
        # Use the generated scene description as the base
        if scene_description:
            prompt_parts.append(scene_description)
        elif title:
            prompt_parts.append(f"A detailed scene showing: {title}")
        else:
            prompt_parts.append(f"A {scene_type} scene in a {scene_setting} setting")
        
        # Add CELPIP-specific requirements
        prompt_parts.extend([
            "The scene should be rich in detail to allow for comprehensive verbal description",
            "Include multiple people, objects, and activities that can be clearly identified",
            "Show clear spatial relationships between elements",
            "Use natural lighting and realistic proportions",
            "Ensure the scene is appropriate for language learning and test practice",
            "Include elements that would encourage detailed description of actions, emotions, and spatial layout"
        ])
        
        return ". ".join(prompt_parts)
    
    async def _generate_option_image(self, image_prompt: str, option_type: str) -> Optional[str]:
        """
        Generate an option image for Speaking Task 5.
        
        Args:
            image_prompt: Description of the option to generate
            option_type: Type of option (e.g., 'option_a', 'option_b')
            
        Returns:
            Base64 encoded image data or None if generation fails
        """
        try:
            # Create image generation request
            from app.models.images import ImageGenerationRequest, ImageStyle, ImageSize
            
            request = ImageGenerationRequest(
                prompt=image_prompt,
                style=ImageStyle.CARTOON,
                size=ImageSize.MEDIUM,
                quality="standard",
                task_type="speaking",
                context=f"CELPIP Speaking Task 5 - {option_type}"
            )
            
            # Generate image (this is a placeholder - real implementation would use actual image generation)
            response = await self.llm_provider.generate_image(request)
            
            if response.success and response.image_data:
                self.logger.info(f"Successfully generated {option_type} image")
                return response.image_data
            else:
                self.logger.warning(f"Failed to generate {option_type} image: {response.error_message}")
                return None
                
        except Exception as e:
            self.logger.error(f"Error generating {option_type} image: {str(e)}")
            return None
    
    async def score_speaking_task3(self, submission: SpeakingTask3Submission, task: SpeakingTask3, transcript: str) -> SpeakingTask3Score:
        """Score a CELPIP Speaking Task 3 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Scene Description: {task.scenario.scene_description}
        Context: {task.scenario.context}
        Scene Type: {task.scenario.scene_type}
        Key Elements: {', '.join(task.scenario.key_elements)}
        Spatial Layout: {task.scenario.spatial_layout}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        """
        
        prompt = SpeakingTaskPrompts.create_task3_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 3 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        
        return SpeakingTask3Score(**data)
    
    async def generate_speaking_task4(self) -> SpeakingTask4:
        """Generate CELPIP Speaking Task 4 (Making Predictions)."""
        prediction_scenario = random.choice(SpeakingTaskTopics.TASK4_PREDICTION_SCENARIOS)
        prediction_element = random.choice(SpeakingTaskTopics.TASK4_PREDICTION_ELEMENTS)
        
        prompt = SpeakingTaskPrompts.create_task4_prompt(prediction_scenario, prediction_element)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 4")
        
        # Generate the scene image (same as Task 3 since it's the same scene)
        scene_type = data.get("scenario", {}).get("scene_type", "public space")
        scene_setting = data.get("scenario", {}).get("context", "daytime")
        image_data = await self._generate_scene_image(data, scene_type, scene_setting)
        if image_data:
            data["scene_image"] = image_data
        
        return SpeakingTask4(**data)
    
    async def score_speaking_task4(self, submission: SpeakingTask4Submission, task: SpeakingTask4, transcript: str) -> SpeakingTask4Score:
        """Score a CELPIP Speaking Task 4 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Scene Description: {task.scenario.scene_description}
        Context: {task.scenario.context}
        Scene Type: {task.scenario.scene_type}
        Current Situation: {task.scenario.current_situation}
        Key Characters: {', '.join(task.scenario.key_characters)}
        Prediction Elements: {', '.join(task.scenario.prediction_elements)}
        Possible Outcomes: {', '.join(task.scenario.possible_outcomes)}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        """
        
        prompt = SpeakingTaskPrompts.create_task4_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 4 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        
        return SpeakingTask4Score(**data)
    
    async def generate_speaking_task5(self) -> SpeakingTask5:
        """Generate CELPIP Speaking Task 5 (Comparing and Persuading)."""
        comparison_scenario = random.choice(SpeakingTaskTopics.TASK5_COMPARISON_SCENARIOS)
        decision_maker = random.choice(SpeakingTaskTopics.TASK5_DECISION_MAKERS)
        category = random.choice(SpeakingTaskTopics.TASK5_CATEGORIES)
        
        prompt = SpeakingTaskPrompts.create_task5_prompt(comparison_scenario, decision_maker, category)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 5")
        
        # Generate images for both options if available
        option_a_data = data.get("scenario", {}).get("option_a", {})
        option_b_data = data.get("scenario", {}).get("option_b", {})
        
        # Generate image for Option A
        if option_a_data.get("image_description"):
            image_prompt = f"Option A: {option_a_data.get('title', 'Option A')} - {option_a_data.get('image_description', '')}"
            option_a_image = await self._generate_option_image(image_prompt, "option_a")
            if option_a_image:
                data["option_a_image"] = option_a_image
        
        # Generate image for Option B
        if option_b_data.get("image_description"):
            image_prompt = f"Option B: {option_b_data.get('title', 'Option B')} - {option_b_data.get('image_description', '')}"
            option_b_image = await self._generate_option_image(image_prompt, "option_b")
            if option_b_image:
                data["option_b_image"] = option_b_image
        
        return SpeakingTask5(**data)
    
    async def score_speaking_task5(self, submission: SpeakingTask5Submission, task: SpeakingTask5, transcript: str) -> SpeakingTask5Score:
        """Score a CELPIP Speaking Task 5 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Context: {task.scenario.context}
        Decision Maker: {task.scenario.decision_maker}
        Category: {task.scenario.category}
        Persuasion Context: {task.scenario.persuasion_context}
        
        Option A: {task.scenario.option_a.title}
        - Description: {task.scenario.option_a.description}
        - Specifications: {', '.join(task.scenario.option_a.specifications)}
        - Price: {task.scenario.option_a.price or 'Not specified'}
        - Pros: {', '.join(task.scenario.option_a.pros)}
        - Cons: {', '.join(task.scenario.option_a.cons)}
        
        Option B: {task.scenario.option_b.title}
        - Description: {task.scenario.option_b.description}
        - Specifications: {', '.join(task.scenario.option_b.specifications)}
        - Price: {task.scenario.option_b.price or 'Not specified'}
        - Pros: {', '.join(task.scenario.option_b.pros)}
        - Cons: {', '.join(task.scenario.option_b.cons)}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Selection Time: {task.instructions.selection_time_seconds} seconds
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Selection Time Used: {submission.selection_time_used or 'Unknown'} seconds
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        Selected Option: {submission.selected_option}
        """
        
        prompt = SpeakingTaskPrompts.create_task5_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 5 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        data["selected_option_analysis"] = f"User selected {submission.selected_option}"
        data["persuasion_effectiveness"] = "Analysis of persuasion effectiveness will be included in scoring"
        
        return SpeakingTask5Score(**data)
    
    async def generate_speaking_task8(self) -> SpeakingTask8:
        """Generate CELPIP Speaking Task 8 (Describing an Unusual Situation)."""
        unusual_situation = random.choice(SpeakingTaskTopics.TASK8_UNUSUAL_SITUATIONS)
        context = random.choice(SpeakingTaskTopics.TASK8_UNUSUAL_CONTEXTS)
        
        prompt = SpeakingTaskPrompts.create_task8_prompt(unusual_situation, context)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 8")
        
        # Generate the unusual situation image
        image_data = await self._generate_unusual_situation_image(data, unusual_situation, context)
        if image_data:
            data["situation_image"] = image_data
        
        return SpeakingTask8(**data)
    
    async def _generate_unusual_situation_image(self, task_data: Dict[str, Any], unusual_situation: str, context: str) -> Optional[str]:
        """
        Generate an unusual situation image for Speaking Task 8.
        
        Args:
            task_data: Generated task data containing scenario description
            unusual_situation: The unusual situation description
            context: Context where the unusual situation occurs
            
        Returns:
            Base64 encoded image data or None if generation fails
        """
        try:
            # Extract situation description from task data
            scenario = task_data.get("scenario", {})
            situation_description = scenario.get("situation_description", "")
            title = scenario.get("title", "")
            
            # Create image generation prompt
            image_prompt = self._build_unusual_situation_image_prompt(
                situation_description, title, unusual_situation, context
            )
            
            # Create image generation request
            from app.models.images import ImageGenerationRequest, ImageStyle, ImageSize
            
            request = ImageGenerationRequest(
                prompt=image_prompt,
                style=ImageStyle.CARTOON,
                size=ImageSize.MEDIUM,
                context=f"CELPIP Speaking Task 8 - {unusual_situation} in {context}",
                task_type="speaking",
                negative_prompt="blurry, low quality, inappropriate content, text, watermarks"
            )
            
            # Generate the image
            response = await self.llm_provider.generate_image(request)
            
            if response.success and response.image_data:
                self.logger.info(f"Successfully generated unusual situation image for {unusual_situation[:50]}... in {response.generation_time_seconds:.2f}s")
                return response.image_data
            else:
                self.logger.warning(f"Image generation failed: {response.error_message}")
                return None
                
        except Exception as e:
            self.logger.error(f"Error generating unusual situation image: {str(e)}")
            return None
    
    def _build_unusual_situation_image_prompt(self, situation_description: str, title: str, unusual_situation: str, context: str) -> str:
        """
        Build an image generation prompt for the unusual situation.
        
        Args:
            situation_description: Detailed description of the unusual situation
            title: Title of the scenario
            unusual_situation: The unusual situation
            context: Context where it occurs
            
        Returns:
            Formatted image generation prompt
        """
        prompt_parts = []
        
        # Use the generated situation description as the base
        if situation_description:
            prompt_parts.append(situation_description)
        elif title:
            prompt_parts.append(f"A detailed scene showing: {title}")
        else:
            prompt_parts.append(f"An unusual situation: {unusual_situation} in {context}")
        
        # Add CELPIP-specific requirements for unusual situations
        prompt_parts.extend([
            "The situation should be clearly unusual and unexpected",
            "Include elements that are obviously out of place or strange",
            "Make the unusual aspects clearly visible and describable",
            "Use natural lighting and realistic proportions",
            "Ensure the situation is appropriate for language learning and test practice",
            "Include elements that would encourage creative explanations",
            "Make the unusual elements stand out but maintain overall realism"
        ])
        
        return ". ".join(prompt_parts)
    
    async def score_speaking_task8(self, submission: SpeakingTask8Submission, task: SpeakingTask8, transcript: str) -> SpeakingTask8Score:
        """Score a CELPIP Speaking Task 8 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Situation Description: {task.scenario.situation_description}
        Context: {task.scenario.context}
        Unusual Elements: {', '.join(task.scenario.unusual_elements)}
        Possible Explanations: {', '.join(task.scenario.possible_explanations)}
        Descriptive Focus: {task.scenario.descriptive_focus}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        """
        
        prompt = SpeakingTaskPrompts.create_task8_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 8 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        
        return SpeakingTask8Score(**data)
    
    async def generate_speaking_task7(self) -> SpeakingTask7:
        """Generate CELPIP Speaking Task 7 (Expressing Opinions)."""
        opinion_topic = random.choice(SpeakingTaskTopics.TASK7_OPINION_TOPICS)
        context_type = random.choice(SpeakingTaskTopics.TASK7_CONTEXT_TYPES)
        
        prompt = SpeakingTaskPrompts.create_task7_prompt(opinion_topic, context_type)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 7")
        
        return SpeakingTask7(**data)
    
    async def score_speaking_task7(self, submission: SpeakingTask7Submission, task: SpeakingTask7, transcript: str) -> SpeakingTask7Score:
        """Score a CELPIP Speaking Task 7 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Topic Statement: {task.scenario.topic_statement}
        Context: {task.scenario.context}
        Position Options: {', '.join(task.scenario.position_options)}
        Supporting Points: {', '.join(task.scenario.supporting_points)}
        Considerations: {', '.join(task.scenario.considerations)}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        Chosen Position: {submission.chosen_position or 'Not specified'}
        """
        
        prompt = SpeakingTaskPrompts.create_task7_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 7 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        
        return SpeakingTask7Score(**data)
    
    async def generate_speaking_task6(self) -> SpeakingTask6:
        """Generate CELPIP Speaking Task 6 (Dealing with Difficult Situations)."""
        difficult_situation = random.choice(SpeakingTaskTopics.TASK6_DIFFICULT_SITUATIONS)
        relationship_context = random.choice(SpeakingTaskTopics.TASK6_RELATIONSHIP_CONTEXTS)
        
        prompt = SpeakingTaskPrompts.create_task6_prompt(difficult_situation, relationship_context)
        data = await self._generate_and_parse_json(prompt, "Speaking Task 6")
        
        return SpeakingTask6(**data)
    
    async def score_speaking_task6(self, submission: SpeakingTask6Submission, task: SpeakingTask6, transcript: str) -> SpeakingTask6Score:
        """Score a CELPIP Speaking Task 6 submission using the original task context."""
        # Create detailed evaluation prompt with full task context
        task_scenario = f"""
        Title: {task.scenario.title}
        Situation Description: {task.scenario.situation_description}
        Context: {task.scenario.context}
        Involved Parties: {', '.join(task.scenario.involved_parties)}
        Dilemma Explanation: {task.scenario.dilemma_explanation}
        Communication Options: {', '.join(task.scenario.communication_options)}
        Relationship Context: {task.scenario.relationship_context}
        """
        
        task_instructions = f"""
        Task Description: {task.instructions.task_description}
        Preparation Time: {task.instructions.preparation_time_seconds} seconds
        Speaking Time: {task.instructions.speaking_time_seconds} seconds
        Evaluation Criteria: {', '.join(task.instructions.evaluation_criteria)}
        """
        
        # Include timing information from submission
        timing_info = f"""
        Preparation Time Used: {submission.preparation_time_used or 'Unknown'} seconds
        Speaking Time Used: {submission.speaking_time_used or 'Unknown'} seconds
        Audio Duration: {submission.audio.duration_seconds} seconds
        Chosen Option: {submission.chosen_option or 'Not specified'}
        """
        
        prompt = SpeakingTaskPrompts.create_task6_evaluation_prompt(
            transcript=transcript,
            task_scenario=task_scenario,
            task_instructions=task_instructions,
            timing_info=timing_info
        )
        
        # Generate scoring using LLM
        data = await self._generate_and_parse_json(prompt, "Speaking Task 6 Scoring")
        
        # Add submission metadata
        data["task_id"] = submission.task_id
        data["submission_id"] = str(uuid.uuid4())
        data["transcript"] = transcript
        data["processing_time_seconds"] = time.time()  # This will be updated by the caller
        
        return SpeakingTask6Score(**data)
    
    # Generic Image Generation Methods
    async def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        """Generate an image based on the request."""
        start_time = time.time()
        
        try:
            # Create image generation prompt
            if request.task_type == "speaking":
                prompt = SpeakingTaskPrompts.create_image_generation_prompt(
                    scenario_description=request.prompt,
                    context=request.context or ""
                )
            else:
                # Generic image prompt
                prompt = f"""
Create a {request.style.value} image with the following description:

{request.prompt}

Style: {request.style.value}
Size: {request.size.value}
Quality: {request.quality}

{f"Context: {request.context}" if request.context else ""}
{f"Avoid: {request.negative_prompt}" if request.negative_prompt else ""}

The image should be clear, professional, and appropriate for educational use.
"""
            
            # Note: This is a placeholder for actual image generation
            # In a real implementation, you would integrate with an image generation service
            # like DALL-E, Midjourney, or Google's Imagen
            
            self.logger.info(f"Image generation requested for task_type: {request.task_type}")
            self.logger.info(f"Prompt: {request.prompt[:100]}...")
            
            # For now, return a mock response
            # TODO: Integrate with actual image generation service
            generation_time = time.time() - start_time
            
            return ImageGenerationResponse(
                success=True,
                image_url=None,  # Would contain actual image URL
                image_data=None,  # Would contain base64 encoded image
                error_message=None,
                generation_time_seconds=generation_time,
                prompt_used=request.prompt,
                style_applied=request.style.value,
                size_generated=request.size.value
            )
            
        except Exception as e:
            self.logger.error(f"Image generation failed: {str(e)}")
            generation_time = time.time() - start_time
            
            return ImageGenerationResponse(
                success=False,
                image_url=None,
                image_data=None,
                error_message=f"Image generation failed: {str(e)}",
                generation_time_seconds=generation_time,
                prompt_used=request.prompt,
                style_applied=request.style.value,
                size_generated=request.size.value
            )