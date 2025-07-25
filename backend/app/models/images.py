from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class ImageStyle(str, Enum):
    REALISTIC = "realistic"
    CARTOON = "cartoon"
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    EDUCATIONAL = "educational"
    DIAGRAM = "diagram"


class ImageSize(str, Enum):
    SMALL = "256x256"
    MEDIUM = "512x512"
    LARGE = "1024x1024"
    WIDE = "1024x512"
    TALL = "512x1024"


class ImageGenerationRequest(BaseModel):
    prompt: str = Field(..., description="Text prompt for image generation")
    style: ImageStyle = Field(default=ImageStyle.REALISTIC, description="Style of the image")
    size: ImageSize = Field(default=ImageSize.MEDIUM, description="Size of the generated image")
    quality: str = Field(default="standard", description="Quality level (standard, high)")
    context: Optional[str] = Field(None, description="Additional context for better generation")
    negative_prompt: Optional[str] = Field(None, description="What to avoid in the image")
    task_type: Optional[str] = Field(None, description="Type of task this image is for (speaking, writing, etc.)")


class ImageGenerationResponse(BaseModel):
    success: bool = Field(..., description="Whether the image generation was successful")
    image_url: Optional[str] = Field(None, description="URL of the generated image")
    image_data: Optional[str] = Field(None, description="Base64 encoded image data")
    error_message: Optional[str] = Field(None, description="Error message if generation failed")
    generation_time_seconds: Optional[float] = Field(None, description="Time taken to generate the image")
    prompt_used: Optional[str] = Field(None, description="Final prompt used for generation")
    style_applied: Optional[str] = Field(None, description="Style that was applied")
    size_generated: Optional[str] = Field(None, description="Actual size of generated image")