from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from app.models.images import ImageGenerationRequest, ImageGenerationResponse
from app.services.llm_service import get_llm_service, LLMService
import logging
import time

router = APIRouter()
logger = logging.getLogger(__name__)


def get_celpip_generator():
    """Dependency to get CELPIP task generator instance"""
    llm_service = get_llm_service()
    return llm_service.get_generator()


@router.post("/generate", response_model=ImageGenerationResponse)
async def generate_image(
    request: ImageGenerationRequest,
    generator = Depends(get_celpip_generator)
) -> ImageGenerationResponse:
    """
    Generate an image based on a text prompt
    
    - **Generic**: Can be used by any CELPIP task (speaking, writing, etc.)
    - **Customizable**: Supports different styles, sizes, and quality levels
    - **Context-aware**: Adjusts generation based on task type
    - **Educational**: Optimized for educational and testing contexts
    
    **Supported formats**:
    - Styles: realistic, cartoon, professional, casual, educational, diagram
    - Sizes: 256x256, 512x512, 1024x1024, 1024x512, 512x1024
    - Quality: standard, high
    """
    start_time = time.time()
    
    try:
        logger.info(f"Generating image for task_type: {request.task_type}")
        logger.info(f"Prompt: {request.prompt[:100]}...")
        
        # Validate prompt
        if not request.prompt or len(request.prompt.strip()) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Prompt must be at least 10 characters long"
            )
        
        # Generate image using CELPIP generator
        response = await generator.generate_image(request)
        
        generation_time = time.time() - start_time
        logger.info(f"Image generation completed in {generation_time:.2f} seconds")
        
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in image generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in image generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return ImageGenerationResponse(
            success=False,
            image_url=None,
            image_data=None,
            error_message=f"Image generation failed: {str(e)}",
            generation_time_seconds=generation_time,
            prompt_used=request.prompt,
            style_applied=request.style.value if request.style else None,
            size_generated=request.size.value if request.size else None
        )


@router.get("/health")
async def health_check(
    llm_service: LLMService = Depends(get_llm_service)
) -> JSONResponse:
    """
    Health check for Image Generation service
    
    Checks:
    - LLM service availability (for image prompt generation)
    - Image generation service availability
    - Overall system health
    """
    try:
        # Check LLM service (used for image prompt enhancement)
        llm_healthy = await llm_service.health_check()
        
        # TODO: Check actual image generation service when implemented
        # For now, assume it's healthy if LLM is healthy
        image_service_healthy = llm_healthy
        
        overall_healthy = llm_healthy and image_service_healthy
        
        health_status = {
            "status": "healthy" if overall_healthy else "unhealthy",
            "llm_service": "healthy" if llm_healthy else "unhealthy",
            "image_generation_service": "healthy" if image_service_healthy else "unhealthy",
            "supported_formats": ["webp", "png", "jpeg"],
            "supported_sizes": ["256x256", "512x512", "1024x1024", "1024x512", "512x1024"],
            "supported_styles": ["realistic", "cartoon", "professional", "casual", "educational", "diagram"],
            "timestamp": time.time()
        }
        
        status_code = status.HTTP_200_OK if overall_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
        
        return JSONResponse(
            content=health_status,
            status_code=status_code
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": time.time()
            },
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )