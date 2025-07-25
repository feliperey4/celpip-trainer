from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from app.models.reading import ReadingTask1Response, ReadingTask2Response, ReadingTask3Response, ReadingTask4Response
from app.services.llm_service import get_llm_service, LLMService
import logging
import time

router = APIRouter()
logger = logging.getLogger(__name__)


def get_celpip_generator():
    """Dependency to get CELPIP task generator instance"""
    llm_service = get_llm_service()
    return llm_service.get_generator()


@router.post("/task1/generate", response_model=ReadingTask1Response)
async def generate_reading_task1(
    generator = Depends(get_celpip_generator)
) -> ReadingTask1Response:
    """
    Generate a CELPIP Reading Task 1 using Gemini's LLM
    
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from realistic Canadian contexts
    - **Context**: Randomly selected context type
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Reading Task 1 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_reading_task1()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ReadingTask1Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return ReadingTask1Response(
            success=False,
            error_message=f"Failed to generate reading task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task2/generate", response_model=ReadingTask2Response)
async def generate_reading_task2(
    generator = Depends(get_celpip_generator)
) -> ReadingTask2Response:
    """
    Generate a CELPIP Reading Task 2 using Gemini's LLM
    
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from informational/academic topics
    - **Format**: 400-500 word informational article with 8 questions
    - **Time Limit**: 26 minutes
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Reading Task 2 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_reading_task2()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ReadingTask2Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return ReadingTask2Response(
            success=False,
            error_message=f"Failed to generate reading task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task3/generate", response_model=ReadingTask3Response)
async def generate_reading_task3(
    generator = Depends(get_celpip_generator)
) -> ReadingTask3Response:
    """
    Generate a CELPIP Reading Task 3 using Gemini's LLM
    
    - **Task Name**: Reading for Information
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from academic/informational topics
    - **Format**: 500-700 word academic article with 4 labeled paragraphs (A, B, C, D)
    - **Questions**: 9 statements to match to paragraphs (A, B, C, D, or E for "not given")
    - **Time Limit**: 10 minutes
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Reading Task 3 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_reading_task3()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ReadingTask3Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return ReadingTask3Response(
            success=False,
            error_message=f"Failed to generate reading task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task4/generate", response_model=ReadingTask4Response)
async def generate_reading_task4(
    generator = Depends(get_celpip_generator)
) -> ReadingTask4Response:
    """
    Generate a CELPIP Reading Task 4 using Gemini's LLM
    
    - **Task Name**: Reading for Viewpoints
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from news/debate topics
    - **Format**: News article with multiple viewpoints + reader's comment with blanks
    - **Questions**: 5 questions about article viewpoints + 5 questions for comment completion
    - **Time Limit**: 13 minutes
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Reading Task 4 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_reading_task4()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ReadingTask4Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return ReadingTask4Response(
            success=False,
            error_message=f"Failed to generate reading task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.get("/health")
async def health_check(
    generator = Depends(get_celpip_generator)
):
    """
    Health check endpoint to verify Gemini API connectivity
    """
    try:
        is_healthy = await generator.health_check()
        
        if is_healthy:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"status": "healthy", "gemini_api": "connected"}
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"status": "unhealthy", "gemini_api": "disconnected"}
            )
            
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "error", "message": str(e)}
        )