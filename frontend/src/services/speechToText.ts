/**
 * Speech-to-Text Service for CELPIP Speaking Tasks
 * 
 * This service provides client-side speech recognition using the Web Speech API
 * as a fallback/preview option. The actual scoring uses server-side Whisper.
 */

export interface SpeechRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

export interface SpeechRecognitionError {
  error: string;
  message: string;
}

export class SpeechToTextService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentTranscript: string = '';

  // Event callbacks
  public onResult?: (result: SpeechRecognitionResult) => void;
  public onError?: (error: SpeechRecognitionError) => void;
  public onStart?: () => void;
  public onEnd?: () => void;

  constructor(private config: SpeechRecognitionConfig = {}) {
    this.config = {
      language: 'en-CA',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      ...config
    };
  }

  /**
   * Check if speech recognition is supported in this browser
   */
  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition
    );
  }

  /**
   * Get available languages for speech recognition
   */
  static getSupportedLanguages(): string[] {
    return [
      'en-CA', // Canadian English
      'en-US', // US English
      'en-GB', // British English
      'en-AU', // Australian English
    ];
  }

  /**
   * Initialize speech recognition
   */
  private initializeRecognition(): boolean {
    try {
      if (!SpeechToTextService.isSupported()) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const SpeechRecognition = 
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition;

      this.recognition = new SpeechRecognition();
      
      // Configure recognition
      this.recognition.language = this.config.language;
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.maxAlternatives = this.config.maxAlternatives;

      // Set up event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update current transcript
        if (finalTranscript) {
          this.currentTranscript += finalTranscript;
        }

        // Notify listeners
        this.onResult?.({
          transcript: finalTranscript || interimTranscript,
          confidence: event.results[event.resultIndex][0].confidence || 0,
          isFinal: !!finalTranscript,
          alternatives: this.extractAlternatives(event.results[event.resultIndex])
        });
      };

      this.recognition.onerror = (event: any) => {
        const error = this.mapSpeechError(event.error);
        this.onError?.(error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onEnd?.();
      };

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.onError?.({
        error: 'initialization_failed',
        message: errorMessage
      });
      return false;
    }
  }

  /**
   * Start listening for speech
   */
  startListening(): boolean {
    try {
      if (!this.recognition) {
        if (!this.initializeRecognition()) {
          return false;
        }
      }

      if (this.isListening) {
        return true; // Already listening
      }

      this.currentTranscript = '';
      this.recognition.start();
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.onError?.({
        error: 'start_failed',
        message: errorMessage
      });
      return false;
    }
  }

  /**
   * Stop listening for speech
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Abort listening immediately
   */
  abortListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
  }

  /**
   * Get current transcript
   */
  getCurrentTranscript(): string {
    return this.currentTranscript;
  }

  /**
   * Clear current transcript
   */
  clearTranscript(): void {
    this.currentTranscript = '';
  }

  /**
   * Check if currently listening
   */
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Extract alternatives from speech recognition results
   */
  private extractAlternatives(result: any): string[] {
    const alternatives: string[] = [];
    
    for (let i = 0; i < result.length && i < (this.config.maxAlternatives || 1); i++) {
      alternatives.push(result[i].transcript);
    }
    
    return alternatives;
  }

  /**
   * Map speech recognition errors to user-friendly messages
   */
  private mapSpeechError(errorCode: string): SpeechRecognitionError {
    const errorMap: { [key: string]: string } = {
      'no-speech': 'No speech detected. Please try speaking again.',
      'audio-capture': 'Audio capture failed. Please check your microphone.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'network': 'Network error. Please check your internet connection.',
      'not-supported': 'Speech recognition not supported in this browser.',
      'aborted': 'Speech recognition was aborted.',
      'bad-grammar': 'Grammar compilation failed.',
      'language-not-supported': 'Language not supported.',
      'service-not-allowed': 'Speech recognition service not allowed.',
    };

    return {
      error: errorCode,
      message: errorMap[errorCode] || `Unknown error: ${errorCode}`
    };
  }

  /**
   * Release all resources
   */
  dispose(): void {
    this.abortListening();
    this.recognition = null;
    this.currentTranscript = '';
  }
}

/**
 * Create a simple promise-based speech recognition function
 */
export async function recognizeSpeech(
  durationMs: number = 5000,
  config: SpeechRecognitionConfig = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const service = new SpeechToTextService(config);
    let finalTranscript = '';
    let timeout: NodeJS.Timeout;

    service.onResult = (result) => {
      if (result.isFinal) {
        finalTranscript += result.transcript + ' ';
      }
    };

    service.onError = (error) => {
      clearTimeout(timeout);
      service.dispose();
      reject(new Error(error.message));
    };

    service.onEnd = () => {
      clearTimeout(timeout);
      service.dispose();
      resolve(finalTranscript.trim());
    };

    // Start listening
    if (!service.startListening()) {
      reject(new Error('Failed to start speech recognition'));
      return;
    }

    // Set timeout
    timeout = setTimeout(() => {
      service.stopListening();
    }, durationMs);
  });
}

export default SpeechToTextService;