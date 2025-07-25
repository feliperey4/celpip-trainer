"""
Speech-to-Text Service for CELPIP

This module provides speech-to-text functionality for CELPIP speaking tasks using Faster Whisper.
"""

import base64
import logging
import tempfile
import os
from faster_whisper import WhisperModel
from typing import Optional, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)


class SpeechToTextService:
    """Service for converting audio to text using Faster Whisper."""
    
    def __init__(self, model_name: str = "base"):
        """
        Initialize the speech-to-text service.
        
        Args:
            model_name: Whisper model to use (tiny, base, small, medium, large)
        """
        self.logger = logger
        self.model_name = model_name
        self._model = None
        self.logger.info(f"Initializing SpeechToTextService with Faster Whisper model: {model_name}")
    
    def _load_model(self):
        """Load the Faster Whisper model if not already loaded."""
        if self._model is None:
            self.logger.info(f"Loading Faster Whisper model: {self.model_name}")
            self._model = WhisperModel(self.model_name, device="cpu", compute_type="int8")
            self.logger.info(f"Faster Whisper model {self.model_name} loaded successfully")
    
    async def transcribe_audio(self, audio_data: str, audio_format: str = "webm") -> Dict[str, Any]:
        """
        Transcribe audio data to text using Faster Whisper.
        
        Args:
            audio_data: Base64 encoded audio data
            audio_format: Format of the audio (webm, mp3, wav)
            
        Returns:
            Dictionary containing transcript and metadata
        """
        try:
            self.logger.info(f"Starting Faster Whisper transcription for {audio_format} audio")
            
            # Load Whisper model
            self._load_model()
            
            # Decode base64 audio data
            try:
                audio_bytes = base64.b64decode(audio_data)
                self.logger.info(f"Decoded audio data: {len(audio_bytes)} bytes")
            except Exception as e:
                self.logger.error(f"Failed to decode audio data: {str(e)}")
                return {
                    "success": False,
                    "transcript": "",
                    "error_message": f"Invalid audio data: {str(e)}",
                    "confidence": 0.0
                }
            
            # Save audio to temporary file
            with tempfile.NamedTemporaryFile(suffix=f".{audio_format}", delete=False) as temp_audio:
                temp_audio.write(audio_bytes)
                temp_audio_path = temp_audio.name
            
            try:
                # Transcribe using Faster Whisper
                self.logger.info(f"Transcribing audio file: {temp_audio_path}")
                segments, info = self._model.transcribe(temp_audio_path, language="en")
                
                # Extract text and calculate confidence
                transcript = ""
                confidences = []
                segment_list = list(segments)  # Convert generator to list
                
                for segment in segment_list:
                    transcript += segment.text
                    if hasattr(segment, 'avg_logprob') and segment.avg_logprob is not None:
                        # Convert log probability to confidence (approximate)
                        conf = max(0.0, min(1.0, (segment.avg_logprob + 1.0) / 1.0))
                        confidences.append(conf)
                
                transcript = transcript.strip()
                detected_language = info.language if hasattr(info, 'language') else "en"
                
                # Calculate average confidence
                if confidences:
                    confidence = sum(confidences) / len(confidences)
                else:
                    confidence = 0.8  # Default confidence if no segments
                
                self.logger.info(f"Transcription completed: {len(transcript)} characters")
                self.logger.info(f"Detected language: {detected_language}")
                self.logger.info(f"Average confidence: {confidence:.2f}")
                
                return {
                    "success": True,
                    "transcript": transcript,
                    "error_message": None,
                    "confidence": confidence,
                    "audio_duration": self._get_audio_duration(segment_list, info),
                    "detected_language": detected_language,
                    "model_used": self.model_name
                }
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_audio_path):
                    os.unlink(temp_audio_path)
                    
        except Exception as e:
            self.logger.error(f"Faster Whisper transcription failed: {str(e)}")
            return {
                "success": False,
                "transcript": "",
                "error_message": f"Transcription failed: {str(e)}",
                "confidence": 0.0
            }
    
    def _get_audio_duration(self, segments: list, info) -> float:
        """
        Get audio duration from Faster Whisper result.
        
        Args:
            segments: List of segments from Faster Whisper transcription
            info: TranscriptionInfo object from Faster Whisper
            
        Returns:
            Duration in seconds
        """
        # Try to get duration from info object
        if hasattr(info, 'duration') and info.duration is not None:
            return float(info.duration)
        
        # Try to get duration from last segment
        if segments:
            last_segment = segments[-1]
            if hasattr(last_segment, 'end') and last_segment.end is not None:
                return float(last_segment.end)
        
        # Fallback: estimate based on transcript length
        # Approximate 150 words per minute for average speaking rate
        transcript = " ".join([seg.text for seg in segments])
        word_count = len(transcript.split())
        estimated_duration = (word_count / 150) * 60  # Convert to seconds
        
        return max(1.0, min(estimated_duration, 180.0))  # Cap between 1-180 seconds
    
    async def health_check(self) -> bool:
        """
        Check if the Faster Whisper speech-to-text service is healthy.
        
        Returns:
            True if service is available, False otherwise
        """
        try:
            self.logger.info("Faster Whisper speech-to-text service health check")
            
            # Try to load the model
            self._load_model()
            
            # Model loaded successfully
            self.logger.info(f"Faster Whisper model {self.model_name} health check passed")
            return True
            
        except Exception as e:
            self.logger.error(f"Faster Whisper health check failed: {str(e)}")
            return False


# Global service instance
_speech_service: Optional[SpeechToTextService] = None


def get_speech_service() -> SpeechToTextService:
    """
    Get the global speech-to-text service instance.
    
    Returns:
        Speech-to-text service singleton instance with Faster Whisper base model
    """
    global _speech_service
    if _speech_service is None:
        _speech_service = SpeechToTextService(model_name="base")
    return _speech_service