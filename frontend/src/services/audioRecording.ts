/**
 * Audio Recording Service for CELPIP Speaking Tasks
 * 
 * This service handles audio recording using the MediaRecorder API
 * with proper error handling and browser compatibility checks.
 */

export interface AudioRecordingConfig {
  mimeType?: string;
  audioBitsPerSecond?: number;
  timeslice?: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
}

export interface AudioRecordingResult {
  success: boolean;
  audioData?: string; // base64 encoded
  audioBlob?: Blob;
  duration: number;
  mimeType: string;
  error?: string;
}

export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private pausedTime: number = 0;
  private animationFrame: number | null = null;
  private currentMimeType: string = 'audio/webm';

  // Event callbacks
  public onStateChange?: (state: RecordingState) => void;
  public onAudioLevel?: (level: number) => void;
  public onError?: (error: string) => void;

  constructor(private config: AudioRecordingConfig = {}) {
    this.config = {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 128000,
      timeslice: 100,
      ...config
    };
  }

  /**
   * Check if audio recording is supported in this browser
   */
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' && window.MediaRecorder);
  }

  /**
   * Get supported MIME types for audio recording
   */
  static getSupportedMimeTypes(): string[] {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/mp4',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mpeg',
      'audio/wav'
    ];
    
    return types.filter(type => MediaRecorder.isTypeSupported(type));
  }

  /**
   * Request microphone permission and initialize audio stream
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (!AudioRecordingService.isSupported()) {
        throw new Error('Audio recording not supported in this browser');
      }

      // Request microphone permission
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.handleError(`Failed to get microphone permission: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<boolean> {
    try {
      if (!this.audioStream) {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
          return false;
        }
      }

      // Clear previous recording
      this.audioChunks = [];
      
      // Determine best MIME type
      const supportedTypes = AudioRecordingService.getSupportedMimeTypes();
      const mimeType = supportedTypes.find(type => type.includes(this.config.mimeType || 'webm')) || supportedTypes[0];

      if (!mimeType) {
        throw new Error('No supported audio MIME type found');
      }

      // Store the mime type for later use
      this.currentMimeType = mimeType;

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.audioStream!, {
        mimeType,
        audioBitsPerSecond: this.config.audioBitsPerSecond
      });

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        this.handleError(`MediaRecorder error: ${event.type}`);
      };

      // Start recording
      this.mediaRecorder.start(this.config.timeslice);
      this.startTime = Date.now();
      this.pausedTime = 0;

      // Start monitoring audio level
      this.startAudioLevelMonitoring();

      this.notifyStateChange();
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.handleError(`Failed to start recording: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Stop recording and return the audio data
   */
  async stopRecording(): Promise<AudioRecordingResult> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve({
          success: false,
          duration: 0,
          mimeType: '',
          error: 'No active recording to stop'
        });
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: this.currentMimeType });
          const duration = this.getDuration();
          
          // Convert to base64
          const audioData = await this.blobToBase64(audioBlob);
          
          // Clean up
          this.cleanup();
          
          resolve({
            success: true,
            audioData,
            audioBlob,
            duration,
            mimeType: this.currentMimeType
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          resolve({
            success: false,
            duration: 0,
            mimeType: this.currentMimeType,
            error: `Failed to process recording: ${errorMessage}`
          });
        }
      };

      this.mediaRecorder.stop();
      this.stopAudioLevelMonitoring();
      this.notifyStateChange();
    });
  }

  /**
   * Pause recording
   */
  pauseRecording(): boolean {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
      return false;
    }

    this.mediaRecorder.pause();
    this.pausedTime = Date.now();
    this.notifyStateChange();
    return true;
  }

  /**
   * Resume recording
   */
  resumeRecording(): boolean {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'paused') {
      return false;
    }

    this.mediaRecorder.resume();
    if (this.pausedTime > 0) {
      this.startTime += Date.now() - this.pausedTime;
      this.pausedTime = 0;
    }
    this.notifyStateChange();
    return true;
  }

  /**
   * Get current recording state
   */
  getState(): RecordingState {
    const isRecording = this.mediaRecorder?.state === 'recording';
    const isPaused = this.mediaRecorder?.state === 'paused';
    const duration = this.getDuration();

    return {
      isRecording,
      isPaused,
      duration,
      audioLevel: 0 // Will be updated by audio level monitoring
    };
  }

  /**
   * Get current recording duration in seconds
   */
  private getDuration(): number {
    if (!this.startTime) return 0;
    
    const now = this.pausedTime > 0 ? this.pausedTime : Date.now();
    return Math.max(0, (now - this.startTime) / 1000);
  }

  /**
   * Convert Blob to base64 string
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (data:audio/webm;base64,)
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Start monitoring audio level for visualization
   */
  private startAudioLevelMonitoring(): void {
    if (!this.audioStream) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(this.audioStream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (this.mediaRecorder?.state === 'recording') {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const averageLevel = sum / bufferLength / 255; // Normalize to 0-1
          
          this.onAudioLevel?.(averageLevel);
          this.animationFrame = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      // Audio level monitoring is optional, don't fail the recording
      console.warn('Audio level monitoring not available:', error);
    }
  }

  /**
   * Stop audio level monitoring
   */
  private stopAudioLevelMonitoring(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    this.stopAudioLevelMonitoring();
    
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.startTime = 0;
    this.pausedTime = 0;
  }

  /**
   * Handle errors
   */
  private handleError(message: string): void {
    console.error('AudioRecordingService:', message);
    this.onError?.(message);
  }

  /**
   * Notify state change
   */
  private notifyStateChange(): void {
    this.onStateChange?.(this.getState());
  }

  /**
   * Release all resources
   */
  dispose(): void {
    this.stopRecording();
    this.cleanup();
  }
}

export default AudioRecordingService;