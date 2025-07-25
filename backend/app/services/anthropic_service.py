import json
import time
from typing import Optional, Dict, Any
import anthropic
from app.config import settings
from app.models.reading import ReadingTask1, ReadingPassage, ReadingQuestion
import logging
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential


logger = logging.getLogger(__name__)


class AnthropicService:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=settings.anthropic_api_key
        )
    
    def _create_celpip_reading_task1_prompt(self, topic: Optional[str] = None, 
                                          difficulty: str = "intermediate",
                                          context_type: str = "daily_life") -> str:
        """Create a detailed prompt for generating CELPIP Reading Task 1 content"""
        
        prompt = f"""
You are an expert CELPIP test creator specializing in Reading Task 1 (Reading Correspondence). 

Create a realistic CELPIP Reading Task 1 that includes:

1. **Email/Correspondence Passage**:
   - Topic: {topic if topic else "A daily life situation (family event, party, trip, appointment, etc.)"}
   - Context: {context_type}
   - Difficulty: {difficulty}
   - Length: 150-250 words
   - Format: Professional or personal email/letter
   - Include specific details, dates, names, and practical information

2. **11 Multiple Choice Questions** (exactly 11 questions):
   - Each question has 4 options (A, B, C, D)
   - Questions should test:
     - Main purpose/intent of the correspondence
     - Specific details (dates, times, places, people)
     - Implicit information and inferences
     - Contextual understanding
     - Factual comprehension
   - Mix of difficulty levels within the {difficulty} range
   - Questions should be directly answerable from the passage

**IMPORTANT FORMATTING REQUIREMENTS:**
- Return response as valid JSON only
- Use this exact JSON structure:
```json
{{
  "passage": {{
    "title": "Email subject or correspondence title",
    "content": "Full email/letter content here...",
    "passage_type": "email",
    "context": "Brief description of the context"
  }},
  "questions": [
    {{
      "question_text": "Question text here?",
      "options": ["A. Option A", "B. Option B", "C. Option C", "D. Option D"],
      "correct_answer": "A",
      "explanation": "Brief explanation of why this is correct"
    }}
  ]
}}
```

**Example Topics for Inspiration:**
- Family reunion planning
- Apartment rental inquiry
- Medical appointment confirmation
- Birthday party invitation
- Work schedule changes
- Travel arrangements
- Club membership information
- Community event announcement

Make the correspondence realistic and engaging, similar to real-world communications that Canadian English speakers would encounter.
"""
        
        return prompt
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_reading_task1(self, topic: Optional[str] = None, 
                                   difficulty: str = "intermediate",
                                   context_type: str = "daily_life") -> ReadingTask1:
        """Generate a CELPIP Reading Task 1 using Anthropic's API"""
        
        start_time = time.time()
        
        try:
            prompt = self._create_celpip_reading_task1_prompt(topic, difficulty, context_type)
            
            # Make the API call
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=4000,
                    temperature=0.7,
                    messages=[{
                        "role": "user",
                        "content": prompt
                    }]
                )
            )
            
            # Parse the response
            content = response.content[0].text
            
            # Extract JSON from the response
            content_cleaned = content.strip()
            if content_cleaned.startswith("```json"):
                content_cleaned = content_cleaned[7:]
            if content_cleaned.endswith("```"):
                content_cleaned = content_cleaned[:-3]
            
            # Parse JSON
            try:
                parsed_data = json.loads(content_cleaned)
            except json.JSONDecodeError:
                logger.error(f"Failed to parse JSON response: {content_cleaned}")
                raise ValueError("Invalid JSON response from Anthropic API")
            
            # Create ReadingTask1 object
            passage = ReadingPassage(
                passage_id=f"task1_{int(time.time())}",
                title=parsed_data["passage"]["title"],
                content=parsed_data["passage"]["content"],
                passage_type=parsed_data["passage"].get("passage_type", "email"),
                context=parsed_data["passage"]["context"]
            )
            
            questions = []
            for i, q in enumerate(parsed_data["questions"]):
                question = ReadingQuestion(
                    question_id=f"q{i+1}_{int(time.time())}",
                    question_text=q["question_text"],
                    options=q["options"],
                    correct_answer=q["correct_answer"],
                    explanation=q.get("explanation", "")
                )
                questions.append(question)
            
            # Ensure we have exactly 11 questions
            if len(questions) != 11:
                logger.warning(f"Expected 11 questions, got {len(questions)}")
            
            generation_time = time.time() - start_time
            
            task = ReadingTask1(
                task_id=f"celpip_r1_{int(time.time())}",
                passage=passage,
                questions=questions,
                time_limit_minutes=11,
                difficulty_level=difficulty
            )
            
            logger.info(f"Successfully generated CELPIP Reading Task 1 in {generation_time:.2f} seconds")
            return task
            
        except Exception as e:
            logger.error(f"Error generating CELPIP Reading Task 1: {str(e)}")
            raise
    
    async def health_check(self) -> bool:
        """Check if the Anthropic API is accessible"""
        try:
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=10,
                    messages=[{
                        "role": "user",
                        "content": "Hello"
                    }]
                )
            )
            return True
        except Exception as e:
            logger.error(f"Anthropic API health check failed: {str(e)}")
            return False