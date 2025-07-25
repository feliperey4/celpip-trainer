from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from app.models.writing import WritingTask1Response, WritingTask1ReviewRequest, WritingTask1ReviewResponse, WritingTask2Response, WritingTask2ReviewRequest, WritingTask2ReviewResponse
from app.services.llm_service import get_llm_service, LLMService
import logging
import time

router = APIRouter()
logger = logging.getLogger(__name__)


def get_celpip_generator():
    """Dependency to get CELPIP task generator instance"""
    llm_service = get_llm_service()
    return llm_service.get_generator()


@router.post("/task1/generate", response_model=WritingTask1Response)
async def generate_writing_task1(
    generator = Depends(get_celpip_generator)
) -> WritingTask1Response:
    """
    Generate a CELPIP Writing Task 1 using Gemini's LLM
    
    - **Task Name**: Writing an Email
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Context**: Randomly selected from realistic Canadian scenarios
    - **Format**: Email writing scenario with specific requirements
    - **Content**: Authentic Canadian contexts requiring email responses
    - **Time Limit**: 27 minutes
    - **Word Count**: 150-200 words
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Writing Task 1 with random scenario and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_writing_task1()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return WritingTask1Response(
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
        
        return WritingTask1Response(
            success=False,
            error_message=f"Failed to generate writing task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task1/review", response_model=WritingTask1ReviewResponse)
async def review_writing_task1(
    review_request: WritingTask1ReviewRequest,
    generator = Depends(get_celpip_generator)
) -> WritingTask1ReviewResponse:
    """
    Review and score a CELPIP Writing Task 1 submission using official CELPIP criteria
    
    - **Content & Coherence**: Ideas, organization, flow, transitions
    - **Vocabulary**: Word choice, range, accuracy, appropriateness
    - **Readability**: Grammar, sentence structure, mechanics, clarity
    - **Task Fulfillment**: Addressing requirements, tone, format, completeness
    - **Scoring**: 1-12 scale matching official CELPIP scoring
    - **Feedback**: Detailed feedback with specific examples and improvement strategies
    """
    start_time = time.time()
    
    try:
        logger.info(f"Reviewing CELPIP Writing Task 1 submission for task {review_request.task_id}")
        
        # Review the submission using CELPIP generator
        review = await generator.review_writing_task1(
            user_text=review_request.user_text,
            scenario=review_request.scenario,
            task_id=review_request.task_id
        )
        
        review_time = time.time() - start_time
        
        logger.info(f"Successfully reviewed task {review_request.task_id} with overall score {review.overall_score} in {review_time:.2f} seconds")
        
        return WritingTask1ReviewResponse(
            success=True,
            review=review,
            review_time_seconds=review_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task review: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in task review: {str(e)}")
        review_time = time.time() - start_time
        
        return WritingTask1ReviewResponse(
            success=False,
            error_message=f"Failed to review writing task: {str(e)}",
            review_time_seconds=review_time
        )


@router.post("/task2/generate", response_model=WritingTask2Response)
async def generate_writing_task2(
    generator = Depends(get_celpip_generator)
) -> WritingTask2Response:
    """
    Generate a CELPIP Writing Task 2 using Gemini's LLM
    
    - **Task Name**: Responding to Survey Questions
    - **Difficulty**: Always high/advanced (matching real CELPIP test level)
    - **Context**: Randomly selected from realistic Canadian survey scenarios
    - **Format**: Opinion essay responding to a survey question with multiple choice options
    - **Content**: Authentic Canadian contexts requiring thoughtful opinion responses
    - **Time Limit**: 26 minutes
    - **Word Count**: 150-200 words
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Writing Task 2 with random survey and advanced difficulty")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_writing_task2()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return WritingTask2Response(
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
        
        return WritingTask2Response(
            success=False,
            error_message=f"Failed to generate writing task: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task2/review", response_model=WritingTask2ReviewResponse)
async def review_writing_task2(
    review_request: WritingTask2ReviewRequest,
    generator = Depends(get_celpip_generator)
) -> WritingTask2ReviewResponse:
    """
    Review and score a CELPIP Writing Task 2 submission using official CELPIP criteria
    
    - **Content & Coherence**: Position clarity, reasoning development, logical support
    - **Vocabulary**: Word choice, range, precision, appropriateness for survey response
    - **Readability**: Grammar, sentence structure, mechanics, clarity for persuasive writing
    - **Task Fulfillment**: Option selection, survey format, persuasiveness, completeness
    - **Scoring**: 1-12 scale matching official CELPIP scoring
    - **Feedback**: Detailed feedback with specific examples and improvement strategies
    """
    start_time = time.time()
    
    try:
        logger.info(f"Reviewing CELPIP Writing Task 2 submission for task {review_request.task_id}")
        
        # Review the submission using CELPIP generator
        review = await generator.review_writing_task2(
            user_text=review_request.user_text,
            survey=review_request.survey,
            chosen_option=review_request.chosen_option,
            task_id=review_request.task_id
        )
        
        review_time = time.time() - start_time
        
        logger.info(f"Successfully reviewed task {review_request.task_id} with overall score {review.overall_score} in {review_time:.2f} seconds")
        
        return WritingTask2ReviewResponse(
            success=True,
            review=review,
            review_time_seconds=review_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task review: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in task review: {str(e)}")
        review_time = time.time() - start_time
        
        return WritingTask2ReviewResponse(
            success=False,
            error_message=f"Failed to review writing task: {str(e)}",
            review_time_seconds=review_time
        )


@router.get("/health")
async def health_check(
    generator = Depends(get_celpip_generator)
):
    """
    Health check endpoint to verify Gemini API connectivity for writing tasks
    """
    try:
        is_healthy = await generator.health_check()
        
        if is_healthy:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"status": "healthy", "gemini_api": "connected", "service": "writing"}
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"status": "unhealthy", "gemini_api": "disconnected", "service": "writing"}
            )
            
    except Exception as e:
        logger.error(f"Writing health check failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "error", "message": str(e), "service": "writing"}
        )