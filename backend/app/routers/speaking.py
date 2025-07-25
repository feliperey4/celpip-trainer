from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from app.models.speaking import (
    SpeakingTask1Response, SpeakingTask1ScoreResponse, 
    SpeakingTask1Submission, SpeakingTask1,
    SpeakingTask2Response, SpeakingTask2ScoreResponse,
    SpeakingTask2Submission, SpeakingTask2,
    SpeakingTask3Response, SpeakingTask3ScoreResponse,
    SpeakingTask3Submission, SpeakingTask3,
    SpeakingTask4Response, SpeakingTask4ScoreResponse,
    SpeakingTask4Submission, SpeakingTask4,
    SpeakingTask5Response, SpeakingTask5ScoreResponse,
    SpeakingTask5Submission, SpeakingTask5,
    SpeakingTask6Response, SpeakingTask6ScoreResponse,
    SpeakingTask6Submission, SpeakingTask6,
    SpeakingTask7Response, SpeakingTask7ScoreResponse,
    SpeakingTask7Submission, SpeakingTask7,
    SpeakingTask8Response, SpeakingTask8ScoreResponse,
    SpeakingTask8Submission, SpeakingTask8
)
from app.models.images import ImageGenerationRequest, ImageGenerationResponse
from app.services.llm_service import get_llm_service, LLMService
from app.services.speech_service import get_speech_service, SpeechToTextService
import logging
import time

router = APIRouter()
logger = logging.getLogger(__name__)


def get_celpip_generator():
    """Dependency to get CELPIP task generator instance"""
    llm_service = get_llm_service()
    return llm_service.get_generator()


def get_speech_to_text_service():
    """Dependency to get speech-to-text service instance"""
    return get_speech_service()


@router.post("/task1/generate", response_model=SpeakingTask1Response)
async def generate_speaking_task1(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask1Response:
    """
    Generate a CELPIP Speaking Task 1 (Giving Advice) using Gemini's LLM
    
    - **Format**: Giving Advice scenario
    - **Timing**: 90 seconds preparation + 90 seconds speaking
    - **Topic**: Randomly selected from realistic Canadian advice situations
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 1 with random advice scenario")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task1()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask1Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask1Response(
            success=False,
            task=None,
            error_message=f"Task generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task1/score", response_model=SpeakingTask1ScoreResponse)
async def score_speaking_task1(
    submission: SpeakingTask1Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask1ScoreResponse:
    """
    Score a CELPIP Speaking Task 1 submission
    
    - **Input**: Audio submission with original task context
    - **Process**: Speech-to-text conversion + context-aware AI scoring
    - **Output**: Detailed scoring with feedback based on original task
    - **Criteria**: Content, vocabulary, language use, task fulfillment
    - **Context**: Uses original task scenario for accurate evaluation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Scoring Speaking Task 1 submission for task {submission.task_id}")
        
        # Convert audio to text
        transcription_result = await speech_service.transcribe_audio(
            audio_data=submission.audio.audio_data,
            audio_format=submission.audio.audio_format
        )
        
        if not transcription_result["success"]:
            logger.error(f"Transcription failed: {transcription_result['error_message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio transcription failed: {transcription_result['error_message']}"
            )
        
        transcript = transcription_result["transcript"]
        logger.info(f"Transcription successful: {len(transcript)} characters")
        
        # Use the original task context from the submission
        original_task = submission.task_context
        logger.info(f"Using original task context: {original_task.scenario.title}")
        
        # Score the submission using the original task context
        score = await generator.score_speaking_task1(submission, original_task, transcript)
        
        processing_time = time.time() - start_time
        score.processing_time_seconds = processing_time
        
        logger.info(f"Successfully scored submission in {processing_time:.2f} seconds")
        
        return SpeakingTask1ScoreResponse(
            success=True,
            score=score
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask1ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.get("/health")
async def health_check(
    llm_service: LLMService = Depends(get_llm_service),
    speech_service: SpeechToTextService = Depends(get_speech_to_text_service)
) -> JSONResponse:
    """
    Health check for Speaking Task services
    
    Checks:
    - LLM service availability
    - Speech-to-text service availability
    - Overall system health
    """
    try:
        # Check LLM service
        llm_healthy = await llm_service.health_check()
        
        # Check speech-to-text service
        speech_healthy = await speech_service.health_check()
        
        overall_healthy = llm_healthy and speech_healthy
        
        health_status = {
            "status": "healthy" if overall_healthy else "unhealthy",
            "llm_service": "healthy" if llm_healthy else "unhealthy",
            "speech_service": "healthy" if speech_healthy else "unhealthy",
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


@router.post("/task2/generate", response_model=SpeakingTask2Response)
async def generate_speaking_task2(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask2Response:
    """
    Generate a CELPIP Speaking Task 2 (Talking about Personal Experience) using Gemini's LLM
    
    - **Format**: Personal experience narrative
    - **Timing**: 30 seconds preparation + 60 seconds speaking
    - **Topic**: Randomly selected from realistic personal experience topics
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 2 with random personal experience topic")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task2()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask2Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask2Response(
            success=False,
            task=None,
            error_message=f"Task generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task2/score", response_model=SpeakingTask2ScoreResponse)
async def score_speaking_task2(
    submission: SpeakingTask2Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask2ScoreResponse:
    """
    Score a CELPIP Speaking Task 2 submission
    
    - **Input**: Audio submission with original task context
    - **Process**: Speech-to-text conversion + context-aware AI scoring
    - **Output**: Detailed scoring with feedback based on original task
    - **Criteria**: Content, vocabulary, language use, task fulfillment
    - **Context**: Uses original task scenario for accurate evaluation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Scoring Speaking Task 2 submission for task {submission.task_id}")
        
        # Convert audio to text
        transcription_result = await speech_service.transcribe_audio(
            audio_data=submission.audio.audio_data,
            audio_format=submission.audio.audio_format
        )
        
        if not transcription_result["success"]:
            logger.error(f"Transcription failed: {transcription_result['error_message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio transcription failed: {transcription_result['error_message']}"
            )
        
        transcript = transcription_result["transcript"]
        logger.info(f"Transcription successful: {len(transcript)} characters")
        
        # Use the original task context from the submission
        original_task = submission.task_context
        logger.info(f"Using original task context: {original_task.scenario.title}")
        
        # Score the submission using the original task context
        score = await generator.score_speaking_task2(submission, original_task, transcript)
        
        processing_time = time.time() - start_time
        score.processing_time_seconds = processing_time
        
        logger.info(f"Successfully scored submission in {processing_time:.2f} seconds")
        
        return SpeakingTask2ScoreResponse(
            success=True,
            score=score
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask2ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.post("/task3/generate", response_model=SpeakingTask3Response)
async def generate_speaking_task3(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask3Response:
    """
    Generate a CELPIP Speaking Task 3 (Describing a Scene) using Gemini's LLM
    
    - **Format**: Scene description
    - **Timing**: 30 seconds preparation + 60 seconds speaking
    - **Topic**: Randomly selected from realistic Canadian scene types
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 3 with random scene description")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task3()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask3Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask3Response(
            success=False,
            task=None,
            error_message=f"Task generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task3/score", response_model=SpeakingTask3ScoreResponse)
async def score_speaking_task3(
    submission: SpeakingTask3Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask3ScoreResponse:
    """
    Score a CELPIP Speaking Task 3 submission
    
    - **Input**: Audio submission with original task context
    - **Process**: Speech-to-text conversion + context-aware AI scoring
    - **Output**: Detailed scoring with feedback based on original task
    - **Criteria**: Content, vocabulary, language use, task fulfillment
    - **Context**: Uses original task scenario for accurate evaluation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Scoring Speaking Task 3 submission for task {submission.task_id}")
        
        # Convert audio to text
        transcription_result = await speech_service.transcribe_audio(
            audio_data=submission.audio.audio_data,
            audio_format=submission.audio.audio_format
        )
        
        if not transcription_result["success"]:
            logger.error(f"Transcription failed: {transcription_result['error_message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio transcription failed: {transcription_result['error_message']}"
            )
        
        transcript = transcription_result["transcript"]
        logger.info(f"Transcription successful: {len(transcript)} characters")
        
        # Use the original task context from the submission
        original_task = submission.task_context
        logger.info(f"Using original task context: {original_task.scenario.title}")
        
        # Score the submission using the original task context
        score = await generator.score_speaking_task3(submission, original_task, transcript)
        
        processing_time = time.time() - start_time
        score.processing_time_seconds = processing_time
        
        logger.info(f"Successfully scored submission in {processing_time:.2f} seconds")
        
        return SpeakingTask3ScoreResponse(
            success=True,
            score=score
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask3ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.post("/task4/generate", response_model=SpeakingTask4Response)
async def generate_speaking_task4(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask4Response:
    """
    Generate a CELPIP Speaking Task 4 (Making Predictions) using Gemini's LLM
    
    - **Format**: Making predictions based on a scene
    - **Timing**: 30 seconds preparation + 60 seconds speaking
    - **Topic**: Randomly selected from realistic Canadian prediction scenarios
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 4 with random prediction scenario")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task4()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask4Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask4Response(
            success=False,
            task=None,
            error_message=f"Task generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task4/score", response_model=SpeakingTask4ScoreResponse)
async def score_speaking_task4(
    submission: SpeakingTask4Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask4ScoreResponse:
    """
    Score a CELPIP Speaking Task 4 submission
    
    - **Input**: Audio submission with original task context
    - **Process**: Speech-to-text conversion + context-aware AI scoring
    - **Output**: Detailed scoring with feedback based on original task
    - **Criteria**: Content, vocabulary, language use, task fulfillment
    - **Context**: Uses original task scenario for accurate evaluation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Scoring Speaking Task 4 submission for task {submission.task_id}")
        
        # Convert audio to text
        transcription_result = await speech_service.transcribe_audio(
            audio_data=submission.audio.audio_data,
            audio_format=submission.audio.audio_format
        )
        
        if not transcription_result["success"]:
            logger.error(f"Transcription failed: {transcription_result['error_message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio transcription failed: {transcription_result['error_message']}"
            )
        
        transcript = transcription_result["transcript"]
        logger.info(f"Transcription successful: {len(transcript)} characters")
        
        # Use the original task context from the submission
        original_task = submission.task_context
        logger.info(f"Using original task context: {original_task.scenario.title}")
        
        # Score the submission using the original task context
        score = await generator.score_speaking_task4(submission, original_task, transcript)
        
        processing_time = time.time() - start_time
        score.processing_time_seconds = processing_time
        
        logger.info(f"Successfully scored submission in {processing_time:.2f} seconds")
        
        return SpeakingTask4ScoreResponse(
            success=True,
            score=score
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask4ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.post("/task5/generate", response_model=SpeakingTask5Response)
async def generate_speaking_task5(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask5Response:
    """
    Generate a CELPIP Speaking Task 5 (Comparing and Persuading) using Gemini's LLM
    
    - **Format**: Comparing and persuading with two options
    - **Timing**: 60 seconds selection + 60 seconds preparation + 60 seconds speaking
    - **Topic**: Randomly selected from realistic Canadian comparison scenarios
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 5 with random comparison scenario")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task5()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask5Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except Exception as e:
        logger.error(f"Failed to generate Speaking Task 5: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask5Response(
            success=False,
            task=None,
            error_message=f"Generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task5/score", response_model=SpeakingTask5ScoreResponse)
async def score_speaking_task5(
    submission: SpeakingTask5Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask5ScoreResponse:
    """
    Score a CELPIP Speaking Task 5 (Comparing and Persuading) submission
    
    - **Input**: Audio recording + task context + selected option
    - **Output**: Detailed scoring breakdown with comparison and persuasion analysis
    - **Timing**: Includes analysis of selection, preparation, and speaking phases
    - **Evaluation**: Content, vocabulary, language use, and task fulfillment
    """
    
    try:
        logger.info(f"Scoring Speaking Task 5 submission for task {submission.task_id}")
        
        # Convert audio to text using speech-to-text service
        transcript_result = await speech_service.transcribe_audio(
            submission.audio.audio_data,
            submission.audio.audio_format
        )
        
        if not transcript_result.success:
            logger.error(f"Speech-to-text failed: {transcript_result.error_message}")
            return SpeakingTask5ScoreResponse(
                success=False,
                score=None,
                error_message=f"Speech transcription failed: {transcript_result.error_message}"
            )
        
        transcript = transcript_result.transcript
        logger.info(f"Successfully transcribed audio: {len(transcript)} characters")
        
        # Score the task using CELPIP generator
        score = await generator.score_speaking_task5(
            submission=submission,
            task=submission.task_context,
            transcript=transcript
        )
        
        logger.info(f"Successfully scored task {submission.task_id}")
        
        return SpeakingTask5ScoreResponse(
            success=True,
            score=score
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask5ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.post("/task6/generate", response_model=SpeakingTask6Response)
async def generate_speaking_task6(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask6Response:
    """
    Generate a CELPIP Speaking Task 6 (Dealing with Difficult Situations) using Gemini's LLM
    
    - **Format**: Difficult interpersonal situation with choice of communication approaches
    - **Timing**: 60 seconds preparation + 60 seconds speaking
    - **Topic**: Randomly selected from realistic difficult situations and relationship contexts
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 6 with random difficult situation")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task6()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask6Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask6Response(
            success=False,
            task=None,
            error_message=f"Task generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task6/score", response_model=SpeakingTask6ScoreResponse)
async def score_speaking_task6(
    submission: SpeakingTask6Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask6ScoreResponse:
    """
    Score a CELPIP Speaking Task 6 submission
    
    - **Input**: Audio submission with original task context
    - **Process**: Speech-to-text conversion + context-aware AI scoring
    - **Output**: Detailed scoring with feedback based on original task
    - **Criteria**: Content, vocabulary, language use, task fulfillment
    - **Context**: Uses original task scenario for accurate evaluation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Scoring Speaking Task 6 submission for task {submission.task_id}")
        
        # Convert audio to text
        transcription_result = await speech_service.transcribe_audio(
            audio_data=submission.audio.audio_data,
            audio_format=submission.audio.audio_format
        )
        
        if not transcription_result["success"]:
            logger.error(f"Transcription failed: {transcription_result['error_message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio transcription failed: {transcription_result['error_message']}"
            )
        
        transcript = transcription_result["transcript"]
        logger.info(f"Transcription successful: {len(transcript)} characters")
        
        # Use the original task context from the submission
        original_task = submission.task_context
        logger.info(f"Using original task context: {original_task.scenario.title}")
        
        # Score the submission using the original task context
        score = await generator.score_speaking_task6(submission, original_task, transcript)
        
        processing_time = time.time() - start_time
        score.processing_time_seconds = processing_time
        
        logger.info(f"Successfully scored submission in {processing_time:.2f} seconds")
        
        return SpeakingTask6ScoreResponse(
            success=True,
            score=score
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask6ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.post("/task7/generate", response_model=SpeakingTask7Response)
async def generate_speaking_task7(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask7Response:
    """
    Generate a CELPIP Speaking Task 7 (Expressing Opinions) using Gemini's LLM
    
    - **Format**: Opinion expression on controversial topics
    - **Timing**: 30 seconds preparation + 60-90 seconds speaking
    - **Topic**: Randomly selected from current social/policy issues
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 7 with random opinion topic")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task7()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask7Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask7Response(
            success=False,
            task=None,
            error_message=f"Task generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task7/score", response_model=SpeakingTask7ScoreResponse)
async def score_speaking_task7(
    submission: SpeakingTask7Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask7ScoreResponse:
    """
    Score a CELPIP Speaking Task 7 submission
    
    - **Input**: Audio submission with original task context
    - **Process**: Speech-to-text conversion + context-aware AI scoring
    - **Output**: Detailed scoring with feedback based on original task
    - **Criteria**: Content, vocabulary, language use, task fulfillment
    - **Context**: Uses original task scenario for accurate evaluation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Scoring Speaking Task 7 submission for task {submission.task_id}")
        
        # Convert audio to text
        transcription_result = await speech_service.transcribe_audio(
            audio_data=submission.audio.audio_data,
            audio_format=submission.audio.audio_format
        )
        
        if not transcription_result["success"]:
            logger.error(f"Transcription failed: {transcription_result['error_message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio transcription failed: {transcription_result['error_message']}"
            )
        
        transcript = transcription_result["transcript"]
        logger.info(f"Transcription successful: {len(transcript)} characters")
        
        # Use the original task context from the submission
        original_task = submission.task_context
        logger.info(f"Using original task context: {original_task.scenario.title}")
        
        # Score the submission using the original task context
        score = await generator.score_speaking_task7(submission, original_task, transcript)
        
        processing_time = time.time() - start_time
        score.processing_time_seconds = processing_time
        
        logger.info(f"Successfully scored submission in {processing_time:.2f} seconds")
        
        return SpeakingTask7ScoreResponse(
            success=True,
            score=score
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask7ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.post("/task8/generate", response_model=SpeakingTask8Response)
async def generate_speaking_task8(
    generator = Depends(get_celpip_generator)
) -> SpeakingTask8Response:
    """
    Generate a CELPIP Speaking Task 8 (Describing an Unusual Situation) using Gemini's LLM
    
    - **Format**: Unusual situation description
    - **Timing**: 30 seconds preparation + 60 seconds speaking
    - **Topic**: Randomly selected from unusual situations and contexts
    - **Difficulty**: Intermediate level matching CELPIP standards
    """
    start_time = time.time()
    
    try:
        logger.info("Generating CELPIP Speaking Task 8 with random unusual situation")
        
        # Generate the task using CELPIP generator
        task = await generator.generate_speaking_task8()
        
        generation_time = time.time() - start_time
        
        logger.info(f"Successfully generated task {task.task_id} in {generation_time:.2f} seconds")
        
        return SpeakingTask8Response(
            success=True,
            task=task,
            generation_time_seconds=generation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error in task generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task generation validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in task generation: {str(e)}")
        generation_time = time.time() - start_time
        
        return SpeakingTask8Response(
            success=False,
            task=None,
            error_message=f"Task generation failed: {str(e)}",
            generation_time_seconds=generation_time
        )


@router.post("/task8/score", response_model=SpeakingTask8ScoreResponse)
async def score_speaking_task8(
    submission: SpeakingTask8Submission,
    generator = Depends(get_celpip_generator),
    speech_service = Depends(get_speech_to_text_service)
) -> SpeakingTask8ScoreResponse:
    """
    Score a CELPIP Speaking Task 8 submission
    
    - **Input**: Audio submission with original task context
    - **Process**: Speech-to-text conversion + context-aware AI scoring
    - **Output**: Detailed scoring with feedback based on original task
    - **Criteria**: Content, vocabulary, language use, task fulfillment
    - **Context**: Uses original task scenario for accurate evaluation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Scoring Speaking Task 8 submission for task {submission.task_id}")
        
        # Convert audio to text
        transcription_result = await speech_service.transcribe_audio(
            audio_data=submission.audio.audio_data,
            audio_format=submission.audio.audio_format
        )
        
        if not transcription_result["success"]:
            logger.error(f"Transcription failed: {transcription_result['error_message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio transcription failed: {transcription_result['error_message']}"
            )
        
        transcript = transcription_result["transcript"]
        logger.info(f"Transcription successful: {len(transcript)} characters")
        
        # Use the original task context from the submission
        original_task = submission.task_context
        logger.info(f"Using original task context: {original_task.scenario.title}")
        
        # Score the submission using the original task context
        score = await generator.score_speaking_task8(submission, original_task, transcript)
        
        processing_time = time.time() - start_time
        score.processing_time_seconds = processing_time
        
        logger.info(f"Successfully scored submission in {processing_time:.2f} seconds")
        
        return SpeakingTask8ScoreResponse(
            success=True,
            score=score
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except ValueError as e:
        logger.error(f"Validation error in scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring validation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in scoring: {str(e)}")
        
        return SpeakingTask8ScoreResponse(
            success=False,
            score=None,
            error_message=f"Scoring failed: {str(e)}"
        )


@router.post("/images/generate", response_model=ImageGenerationResponse)
async def generate_image(
    request: ImageGenerationRequest,
    llm_service: LLMService = Depends(get_llm_service)
) -> ImageGenerationResponse:
    """
    Generate an image using Gemini's image generation model
    
    - **Prompt**: Description of the image to generate
    - **Style**: Style of the image (realistic, cartoon, professional, etc.)
    - **Size**: Size of the generated image
    - **Context**: Additional context for better generation
    - **Task Type**: Type of task this image is for (speaking, writing, etc.)
    """
    start_time = time.time()
    
    try:
        logger.info(f"Generating image with prompt: {request.prompt[:100]}...")
        
        # Get the LLM provider from the service
        generator = llm_service.get_generator()
        
        # Generate the image using the LLM provider
        response = await generator.llm_provider.generate_image(request)
        
        generation_time = time.time() - start_time
        response.generation_time_seconds = generation_time
        
        if response.success:
            logger.info(f"Successfully generated image in {generation_time:.2f} seconds")
        else:
            logger.warning(f"Image generation failed: {response.error_message}")
        
        return response
        
    except Exception as e:
        generation_time = time.time() - start_time
        error_msg = f"Image generation failed: {str(e)}"
        logger.error(error_msg)
        
        return ImageGenerationResponse(
            success=False,
            error_message=error_msg,
            generation_time_seconds=generation_time,
            prompt_used=request.prompt
        )