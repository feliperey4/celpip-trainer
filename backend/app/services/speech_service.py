"""
Speech-to-Text Service for CELPIP

This module provides speech-to-text functionality for CELPIP speaking tasks using Vosk.
"""

import base64
import json
import logging
import tempfile
import os
import soundfile as sf
import vosk
from typing import Optional, Dict, Any
from pathlib import Path
import urllib.request

logger = logging.getLogger(__name__)


class SpeechToTextService:
    """Service for converting audio to text using Vosk."""
    
    def __init__(self, model_name: str = "vosk-model-small-en-us-0.15"):
        """
        Initialize the speech-to-text service.
        
        Args:
            model_name: Vosk model to use (default: vosk-model-small-en-us-0.15)
        """
        self.logger = logger
        self.model_name = model_name
        self._model = None
        self._recognizer = None
        self.model_path = None
        self.logger.info(f"Initializing SpeechToTextService with Vosk model: {model_name}")
    
    def _download_model(self):
        """Download Vosk model if not already available."""
        models_dir = Path.home() / ".vosk" / "models"
        models_dir.mkdir(parents=True, exist_ok=True)
        
        model_dir = models_dir / self.model_name
        
        if model_dir.exists() and (model_dir / "am" / "final.mdl").exists():
            self.logger.info(f"Vosk model {self.model_name} already exists")
            return str(model_dir)
        
        # Download model
        model_url = f"https://alphacephei.com/vosk/models/{self.model_name}.zip"
        temp_zip = models_dir / f"{self.model_name}.zip"
        
        try:
            self.logger.info(f"Downloading Vosk model from {model_url}")
            urllib.request.urlretrieve(model_url, temp_zip)
            
            # Extract model
            import zipfile
            with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
                zip_ref.extractall(models_dir)
            
            # Clean up zip file
            temp_zip.unlink()
            
            self.logger.info(f"Vosk model {self.model_name} downloaded and extracted successfully")
            return str(model_dir)
            
        except Exception as e:
            self.logger.error(f"Failed to download Vosk model: {str(e)}")
            raise
    
    def _load_model(self):
        """Load the Vosk model if not already loaded."""
        if self._model is None:
            self.logger.info(f"Loading Vosk model: {self.model_name}")
            
            # Download model if needed
            self.model_path = self._download_model()
            
            # Load Vosk model
            if not vosk.Model.Exists(self.model_path):
                raise Exception(f"Vosk model not found at {self.model_path}")
            
            self._model = vosk.Model(self.model_path)
            self._recognizer = vosk.KaldiRecognizer(self._model, 16000)
            self.logger.info(f"Vosk model {self.model_name} loaded successfully")
    
    async def transcribe_audio(self, audio_data: str, audio_format: str = "webm") -> Dict[str, Any]:
        """
        Transcribe audio data to text using Vosk.
        
        Args:
            audio_data: Base64 encoded audio data
            audio_format: Format of the audio (webm, mp3, wav)
            
        Returns:
            Dictionary containing transcript and metadata
        """
        try:
            self.logger.info(f"Starting Vosk transcription for {audio_format} audio")
            
            # Load Vosk model
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
                # Convert audio to WAV format with proper sample rate for Vosk
                wav_path = temp_audio_path.replace(f".{audio_format}", ".wav")
                
                # Read audio file and convert to 16kHz mono
                data, samplerate = sf.read(temp_audio_path)
                
                # Convert to mono if stereo
                if len(data.shape) > 1:
                    data = data.mean(axis=1)
                
                # Resample to 16kHz if needed
                if samplerate != 16000:
                    import librosa
                    data = librosa.resample(data, orig_sr=samplerate, target_sr=16000)
                    samplerate = 16000
                
                # Save as WAV
                sf.write(wav_path, data, samplerate)
                
                # Transcribe using Vosk
                self.logger.info(f"Transcribing audio file: {wav_path}")
                
                # Read audio data in chunks
                with open(wav_path, 'rb') as wf:
                    # Skip WAV header (44 bytes)
                    wf.read(44)
                    
                    transcript_parts = []
                    confidences = []
                    
                    # Process audio in chunks
                    while True:
                        chunk_data = wf.read(4000)
                        if len(chunk_data) == 0:
                            break
                        
                        if self._recognizer.AcceptWaveform(chunk_data):
                            result = json.loads(self._recognizer.Result())
                            if result.get('text'):
                                transcript_parts.append(result['text'])
                                confidences.append(result.get('confidence', 0.8))
                    
                    # Get final result
                    final_result = json.loads(self._recognizer.FinalResult())
                    if final_result.get('text'):
                        transcript_parts.append(final_result['text'])
                        confidences.append(final_result.get('confidence', 0.8))
                
                # Combine transcript parts
                transcript = " ".join(transcript_parts).strip()
                detected_language = "en"  # Vosk model is English-specific
                
                # Calculate average confidence
                if confidences:
                    confidence = sum(confidences) / len(confidences)
                else:
                    confidence = 0.8  # Default confidence
                
                # Get audio duration
                audio_duration = len(data) / samplerate if len(data) > 0 else 1.0
                
                self.logger.info(f"Transcription completed: {len(transcript)} characters")
                self.logger.info(f"Detected language: {detected_language}")
                self.logger.info(f"Average confidence: {confidence:.2f}")
                self.logger.info(f"Audio duration: {audio_duration:.2f} seconds")
                
                # Clean up WAV file
                if os.path.exists(wav_path):
                    os.unlink(wav_path)
                
                return {
                    "success": True,
                    "transcript": transcript,
                    "error_message": None,
                    "confidence": confidence,
                    "audio_duration": audio_duration,
                    "detected_language": detected_language,
                    "model_used": self.model_name
                }
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_audio_path):
                    os.unlink(temp_audio_path)
                    
        except Exception as e:
            self.logger.error(f"Vosk transcription failed: {str(e)}")
            return {
                "success": False,
                "transcript": "",
                "error_message": f"Transcription failed: {str(e)}",
                "confidence": 0.0
            }
    
    def _get_audio_duration(self, segments: list, info) -> float:
        """
        Get audio duration from Vosk result.
        
        Args:
            segments: List of segments (kept for compatibility)
            info: Info object (kept for compatibility)
            
        Returns:
            Duration in seconds
        """
        # This method is kept for compatibility but not used in Vosk implementation
        # Duration is calculated directly in transcribe_audio method
        return 1.0
    
    async def health_check(self) -> bool:
        """
        Check if the Vosk speech-to-text service is healthy.
        
        Returns:
            True if service is available, False otherwise
        """
        try:
            self.logger.info("Vosk speech-to-text service health check")
            
            # Try to load the model
            self._load_model()
            
            # Model loaded successfully
            self.logger.info(f"Vosk model {self.model_name} health check passed")
            return True
            
        except Exception as e:
            self.logger.error(f"Vosk health check failed: {str(e)}")
            return False


# Global service instance
_speech_service: Optional[SpeechToTextService] = None


def get_speech_service() -> SpeechToTextService:
    """
    Get the global speech-to-text service instance.
    
    Returns:
        Speech-to-text service singleton instance with Vosk model
    """
    global _speech_service
    if _speech_service is None:
        _speech_service = SpeechToTextService(model_name="vosk-model-small-en-us-0.15")
    return _speech_service