from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from app.models.listening import ListeningPart1Response, ListeningPart2Response, ListeningPart3Response, ListeningPart4Response, ListeningPart5Response, ListeningPart6Response
from app.services.llm_service import get_llm_service, LLMService
import logging
import time

router = APIRouter()
logger = logging.getLogger(__name__)


def get_celpip_generator():
    """Dependency to get CELPIP task generator instance"""
    llm_service = get_llm_service()
    return llm_service.get_generator()


@router.post("/part1/generate", response_model=ListeningPart1Response)
async def generate_listening_part1(
    generator = Depends(get_celpip_generator)
) -> ListeningPart1Response:
    """
    Generate a CELPIP Listening Part 1 using Gemini's LLM
    
    - **Task Name**: Listening to Problem Solving
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from problem-solving/direction scenarios
    - **Format**: 3 conversations (1-1.5 minutes each) with 8 total questions
    - **Content**: People asking for directions and solving location problems
    - **Time Limit**: 12 minutes
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Listening Part 1 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_listening_part1()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ListeningPart1Response(
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
        
        return ListeningPart1Response(
            success=False,
            error_message=f"Failed to generate listening task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/part2/generate", response_model=ListeningPart2Response)
async def generate_listening_part2(
    generator = Depends(get_celpip_generator)
) -> ListeningPart2Response:
    """
    Generate a CELPIP Listening Part 2 using Gemini's LLM
    
    - **Task Name**: Listening to a Daily Life Conversation
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from daily life conversation scenarios
    - **Format**: 1 conversation (1.5-2 minutes) with 5 questions
    - **Content**: Friends/colleagues discussing personal matters, problems, or plans
    - **Time Limit**: 8 minutes
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Listening Part 2 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_listening_part2()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ListeningPart2Response(
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
        
        return ListeningPart2Response(
            success=False,
            error_message=f"Failed to generate listening task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/part3/generate", response_model=ListeningPart3Response)
async def generate_listening_part3(
    generator = Depends(get_celpip_generator)
) -> ListeningPart3Response:
    """
    Generate a CELPIP Listening Part 3 using Gemini's LLM
    
    - **Task Name**: Listening for Information
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from informational conversation/interview scenarios
    - **Format**: 1 conversation (2-2.5 minutes) with 6 questions
    - **Content**: Interview/consultation with expert providing informational content
    - **Time Limit**: 10 minutes
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Listening Part 3 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_listening_part3()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ListeningPart3Response(
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
        
        return ListeningPart3Response(
            success=False,
            error_message=f"Failed to generate listening task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/part4/generate", response_model=ListeningPart4Response)
async def generate_listening_part4(
    generator = Depends(get_celpip_generator)
) -> ListeningPart4Response:
    """
    Generate a CELPIP Listening Part 4 using Gemini's LLM
    
    - **Task Name**: Listening to News Item
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from local community news scenarios
    - **Format**: 1 news item (1.5-2 minutes) with 5 questions
    - **Content**: Local community news broadcast with factual information
    - **Time Limit**: 5 minutes
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Listening Part 4 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_listening_part4()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ListeningPart4Response(
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
        
        return ListeningPart4Response(
            success=False,
            error_message=f"Failed to generate listening task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/part5/generate", response_model=ListeningPart5Response)
async def generate_listening_part5(
    generator = Depends(get_celpip_generator)
) -> ListeningPart5Response:
    """
    Generate a CELPIP Listening Part 5 using Gemini's LLM
    
    - **Task Name**: Listening to a Discussion
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from professional discussion scenarios
    - **Format**: 1 video discussion (2 minutes) with 8 questions
    - **Content**: Professional discussions, meetings, panels, or expert conversations
    - **Time Limit**: 4 minutes for questions
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Listening Part 5 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_listening_part5()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ListeningPart5Response(
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
        
        return ListeningPart5Response(
            success=False,
            error_message=f"Failed to generate listening task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/part6/generate", response_model=ListeningPart6Response)
async def generate_listening_part6(
    generator = Depends(get_celpip_generator)
) -> ListeningPart6Response:
    """
    Generate a CELPIP Listening Part 6 using Gemini's LLM
    
    - **Task Name**: Listening to Viewpoints
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Topic**: Randomly selected from controversial social issue viewpoints
    - **Format**: 1 viewpoint presentation (3-3.5 minutes) with 6 questions
    - **Content**: Opinion pieces on social controversies, policy debates, or current issues
    - **Time Limit**: 8 minutes for questions
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Listening Part 6 with random topic and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_listening_part6()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return ListeningPart6Response(
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
        
        return ListeningPart6Response(
            success=False,
            error_message=f"Failed to generate listening task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.get("/health")
async def health_check(
    generator = Depends(get_celpip_generator)
):
    """
    Health check endpoint to verify Gemini API connectivity for listening tasks
    """
    try:
        is_healthy = await generator.health_check()
        
        if is_healthy:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"status": "healthy", "gemini_api": "connected", "service": "listening"}
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"status": "unhealthy", "gemini_api": "disconnected", "service": "listening"}
            )
            
    except Exception as e:
        logger.error(f"Listening health check failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "error", "message": str(e), "service": "listening"}
        )