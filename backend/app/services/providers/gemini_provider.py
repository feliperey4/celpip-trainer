"""
Gemini LLM Provider Implementation

This module implements the Google Gemini LLM provider for CELPIP task generation.
"""

import json
import logging
import time
import base64
from typing import Dict, Any, Optional
from google import genai
from google.genai.types import GenerateContentConfig, Modality
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.services.llm_provider import LLMProvider
from app.models.images import ImageGenerationRequest, ImageGenerationResponse

logger = logging.getLogger(__name__)


class GeminiProvider(LLMProvider):
    """Google Gemini LLM provider implementation."""
    
    def __init__(self):
        """Initialize Gemini provider with API configuration."""
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.text_model = 'gemini-2.0-flash-lite'
        self.image_model = 'gemini-2.0-flash-preview-image-generation'
        self.provider_name = "Google Gemini"
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_content(self, prompt: str) -> str:
        """
        Generate content using Google Gemini.
        
        Args:
            prompt: The prompt to send to Gemini
            
        Returns:
            Generated content as string
            
        Raises:
            Exception: If generation fails after retries
        """
        try:
            logger.info("Generating content with Gemini")
            
            response = self.client.models.generate_content(
                model=self.text_model,
                contents=prompt
            )
            
            if not response.text:
                raise ValueError("Gemini returned empty response")
            
            # Log token usage information if available
            if hasattr(response, 'usage_metadata') and response.usage_metadata:
                usage = response.usage_metadata
                logger.info(f"Token usage - Input: {usage.prompt_token_count}, "
                           f"Output: {usage.candidates_token_count}, "
                           f"Total: {usage.total_token_count}")
            else:
                logger.warning("Token usage information not available in response")
            
            logger.info(f"Successfully generated {len(response.text)} characters")
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Gemini content generation failed: {str(e)}")
            raise Exception(f"Failed to generate content with Gemini: {str(e)}")
    
    async def health_check(self) -> bool:
        """
        Check if Gemini API is accessible and working.
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            test_prompt = "Respond with exactly: 'HEALTH_CHECK_OK'"
            response = await self.generate_content(test_prompt)
            return "HEALTH_CHECK_OK" in response
        except Exception as e:
            logger.error(f"Gemini health check failed: {str(e)}")
            return False
    
    def get_provider_name(self) -> str:
        """Get the provider name."""
        return self.provider_name
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        """
        Generate an image using Gemini's image generation model.
        
        Args:
            request: Image generation request with prompt and configuration
            
        Returns:
            Image generation response with image data or error
        """
        start_time = time.time()
        
        try:
            logger.info(f"Generating image with Gemini: {request.prompt[:100]}...")
            
            # Construct the image generation prompt
            image_prompt = self._build_image_prompt(request)

            # Generate the image using Gemini's image generation model
            response = self.client.models.generate_content(
                model=self.image_model,
                contents=image_prompt,
                config=GenerateContentConfig(
                    response_modalities=[Modality.TEXT, Modality.IMAGE]
                )
            )

            # Extract image data from response
            image_data = None
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    image_data = base64.b64encode(part.inline_data.data).decode('utf-8')
            
            if not image_data:
                raise ValueError("No image data found in Gemini response")
            
            generation_time = time.time() - start_time
            
            logger.info(f"Successfully generated image in {generation_time:.2f} seconds")
            # Log token usage information if available
            if hasattr(response, 'usage_metadata') and response.usage_metadata:
                usage = response.usage_metadata
                logger.info(f"Token usage - Input: {usage.prompt_token_count}, "
                            f"Output: {usage.candidates_token_count}, "
                            f"Total: {usage.total_token_count}")
            else:
                logger.warning("Token usage information not available in response")
            
            return ImageGenerationResponse(
                success=True,
                image_data=image_data,
                generation_time_seconds=generation_time,
                prompt_used=image_prompt,
                style_applied=request.style.value,
                size_generated=request.size.value
            )
            
        except Exception as e:
            generation_time = time.time() - start_time
            error_msg = f"Failed to generate image with Gemini: {str(e)}"
            logger.error(error_msg)
            
            return ImageGenerationResponse(
                success=False,
                error_message=error_msg,
                generation_time_seconds=generation_time,
                prompt_used=request.prompt
            )
    
    def _build_image_prompt(self, request: ImageGenerationRequest) -> str:
        """
        Build a comprehensive image generation prompt for Gemini.
        
        Args:
            request: Image generation request
            
        Returns:
            Formatted prompt for image generation
        """
        prompt_parts = []
        
        # Base prompt
        prompt_parts.append("Generate a high-quality image based on the following description:")
        prompt_parts.append(request.prompt)
        
        # Add style specifications
        style_descriptions = {
            "realistic": "Create a photorealistic image with natural lighting and authentic details",
            "cartoon": "Create a cartoon-style illustration with vibrant colors and clear lines",
            "professional": "Create a professional, clean image suitable for business or educational contexts",
            "casual": "Create a casual, relaxed scene with natural, everyday atmosphere",
            "educational": "Create an educational illustration that clearly shows details for learning purposes",
            "diagram": "Create a clear, diagram-style illustration with clean lines and labels if appropriate"
        }
        
        if request.style.value in style_descriptions:
            prompt_parts.append(f"Style: {style_descriptions[request.style.value]}")
        
        # Add context if provided
        if request.context:
            prompt_parts.append(f"Additional context: {request.context}")
        
        # Add quality specifications
        prompt_parts.append("Ensure the image is:")
        prompt_parts.append("- High resolution and clear")
        prompt_parts.append("- Well-lit with good contrast")
        prompt_parts.append("- Appropriate for CELPIP speaking test practice")
        prompt_parts.append("- Safe for all audiences")
        
        # Add negative prompt if provided
        if request.negative_prompt:
            prompt_parts.append(f"Avoid: {request.negative_prompt}")
        
        # Add CELPIP-specific requirements for speaking tasks
        if request.task_type == "speaking":
            prompt_parts.append("Make the scene detailed enough to provide rich content for verbal description")
            prompt_parts.append("Include clear, identifiable objects, people, and activities")
            prompt_parts.append("Use compositions that encourage detailed spatial description")
        
        return " ".join(prompt_parts)