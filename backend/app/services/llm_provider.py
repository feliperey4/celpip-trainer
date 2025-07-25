from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.models.reading import ReadingTask1, ReadingTask2, ReadingTask3, ReadingTask4
from app.models.listening import ListeningPart1, ListeningPart2, ListeningPart3, ListeningPart4, ListeningPart5, ListeningPart6
from app.models.writing import WritingTask1, WritingTask1Review, WritingTask1Scenario
from app.models.images import ImageGenerationRequest, ImageGenerationResponse


class LLMProvider(ABC):
    """Abstract base class for Language Model providers."""
    
    @abstractmethod
    async def generate_content(self, prompt: str) -> str:
        """
        Generate content using the LLM provider.
        
        Args:
            prompt: The prompt to send to the LLM
            
        Returns:
            Generated content as string
            
        Raises:
            Exception: If generation fails
        """
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """
        Check if the LLM provider is healthy and accessible.
        
        Returns:
            True if healthy, False otherwise
        """
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """
        Get the name of the LLM provider.
        
        Returns:
            Provider name string
        """
        pass
    
    @abstractmethod
    async def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        """
        Generate an image using the LLM provider's image generation capabilities.
        
        Args:
            request: Image generation request with prompt and configuration
            
        Returns:
            Image generation response with image data or error
            
        Raises:
            Exception: If image generation fails
        """
        pass


class CELPIPTaskGenerator(ABC):
    """Abstract base class for CELPIP task generation using LLM providers."""
    
    def __init__(self, llm_provider: LLMProvider):
        self.llm_provider = llm_provider
    
    # Reading Task Generation Methods
    @abstractmethod
    async def generate_reading_task1(self) -> ReadingTask1:
        """Generate CELPIP Reading Task 1."""
        pass
    
    @abstractmethod
    async def generate_reading_task2(self) -> ReadingTask2:
        """Generate CELPIP Reading Task 2."""
        pass
    
    @abstractmethod
    async def generate_reading_task3(self) -> ReadingTask3:
        """Generate CELPIP Reading Task 3."""
        pass
    
    @abstractmethod
    async def generate_reading_task4(self) -> ReadingTask4:
        """Generate CELPIP Reading Task 4."""
        pass
    
    # Listening Task Generation Methods
    @abstractmethod
    async def generate_listening_part1(self) -> ListeningPart1:
        """Generate CELPIP Listening Part 1."""
        pass
    
    @abstractmethod
    async def generate_listening_part2(self) -> ListeningPart2:
        """Generate CELPIP Listening Part 2."""
        pass
    
    @abstractmethod
    async def generate_listening_part3(self) -> ListeningPart3:
        """Generate CELPIP Listening Part 3."""
        pass
    
    @abstractmethod
    async def generate_listening_part4(self) -> ListeningPart4:
        """Generate CELPIP Listening Part 4."""
        pass
    
    @abstractmethod
    async def generate_listening_part5(self) -> ListeningPart5:
        """Generate CELPIP Listening Part 5."""
        pass
    
    @abstractmethod
    async def generate_listening_part6(self) -> ListeningPart6:
        """Generate CELPIP Listening Part 6."""
        pass
    
    # Writing Task Generation Methods
    @abstractmethod
    async def generate_writing_task1(self) -> WritingTask1:
        """Generate CELPIP Writing Task 1."""
        pass
    
    # Writing Task Review Methods
    @abstractmethod
    async def review_writing_task1(self, user_text: str, scenario: WritingTask1Scenario, task_id: str) -> WritingTask1Review:
        """Review and score CELPIP Writing Task 1 submission."""
        pass
    
    async def health_check(self) -> bool:
        """Check if the task generator is healthy."""
        return await self.llm_provider.health_check()