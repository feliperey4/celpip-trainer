// Text-to-Speech service for CELPIP Listening Part 1
export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  lang?: string;
}

export interface TTSCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
  onProgress?: (progress: number) => void;
}

export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private progressInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }
    
    this.synth = window.speechSynthesis;
    this.initializeVoices();
  }

  private async initializeVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth.getVoices();
        this.isInitialized = true;
        resolve();
      };

      // Load voices immediately if available
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0) {
        this.isInitialized = true;
        resolve();
        return;
      }

      // Wait for voices to load (Chrome behavior)
      if (typeof this.synth.onvoiceschanged !== 'undefined') {
        this.synth.onvoiceschanged = () => {
          loadVoices();
          this.synth.onvoiceschanged = null;
        };
      } else {
        // Fallback for older browsers
        setTimeout(loadVoices, 100);
      }
    });
  }

  public async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isInitialized) {
      await this.initializeVoices();
    }
    return this.voices;
  }

  public async getCanadianVoices(): Promise<SpeechSynthesisVoice[]> {
    const voices = await this.getVoices();
    return voices.filter(voice => 
      voice.lang.startsWith('en-') && 
      (voice.name.toLowerCase().includes('canada') || 
       voice.name.toLowerCase().includes('canadian') ||
       voice.lang === 'en-CA')
    );
  }

  public async getEnglishVoices(): Promise<SpeechSynthesisVoice[]> {
    const voices = await this.getVoices();
    return voices.filter(voice => voice.lang.startsWith('en-'));
  }

  public async selectBestVoice(preferFemale: boolean = false): Promise<SpeechSynthesisVoice | null> {
    // Try to get Canadian voices first
    let voices = await this.getCanadianVoices();
    
    // Fallback to English voices if no Canadian voices
    if (voices.length === 0) {
      voices = await this.getEnglishVoices();
    }
    
    // Fallback to any voice if no English voices
    if (voices.length === 0) {
      voices = await this.getVoices();
    }

    if (voices.length === 0) return null;

    // Filter by gender preference if specified
    if (preferFemale) {
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('aria') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('heather')
      );
      if (femaleVoices.length > 0) {
        return femaleVoices[0];
      }
    } else {
      const maleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('male') ||
        voice.name.toLowerCase().includes('man') ||
        voice.name.toLowerCase().includes('david') ||
        voice.name.toLowerCase().includes('mark') ||
        voice.name.toLowerCase().includes('richard')
      );
      if (maleVoices.length > 0) {
        return maleVoices[0];
      }
    }

    // Return first available voice as fallback
    return voices[0];
  }

  public speak(
    text: string, 
    options: TTSOptions = {}, 
    callbacks: TTSCallbacks = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any current speech
      this.stop();

      // Clean and prepare text for speech
      const cleanText = this.preprocessText(text);
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Set options
      utterance.rate = options.rate ?? 0.9; // Slightly slower for clarity
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 0.8;
      utterance.lang = options.lang ?? 'en-CA';
      
      if (options.voice) {
        utterance.voice = options.voice;
      }

      // Set up event handlers
      utterance.onstart = () => {
        this.startProgressTracking(utterance, callbacks.onProgress);
        callbacks.onStart?.();
      };

      utterance.onend = () => {
        this.stopProgressTracking();
        this.currentUtterance = null;
        callbacks.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        this.stopProgressTracking();
        this.currentUtterance = null;
        callbacks.onError?.(event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      utterance.onpause = () => {
        callbacks.onPause?.();
      };

      utterance.onresume = () => {
        callbacks.onResume?.();
      };

      // Store current utterance and speak
      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  public pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    this.stopProgressTracking();
    this.synth.cancel();
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.synth.speaking;
  }

  public isPaused(): boolean {
    return this.synth.paused;
  }

  private preprocessText(text: string): string {
    // Remove speaker labels and clean text for better TTS
    let cleanText = text
      // Remove all speaker labels (including "Speaker A:", "Speaker B:", etc.)
      .replace(/^(Speaker [AB]:|Male:|Female:|Customer:|Representative:|Service Agent:|Information Clerk:|Client:|Visitor:|\w+:)/gim, '')
      // Also remove speaker labels that appear mid-line or after line breaks
      .replace(/(^|\n)(Speaker [AB]:|Male:|Female:|Customer:|Representative:|Service Agent:|Information Clerk:|Client:|Visitor:|\w+:)/gim, '$1')
      .replace(/\[.*?\]/g, '') // Remove stage directions
      .replace(/\(.*?\)/g, '') // Remove parenthetical comments
      .replace(/["'"'"]/g, '') // Remove all types of quotes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Add natural pauses
    cleanText = cleanText
      .replace(/\./g, '. ') // Pause after periods
      .replace(/,/g, ', ') // Pause after commas
      .replace(/\?/g, '? ') // Pause after questions
      .replace(/!/g, '! ') // Pause after exclamations
      .replace(/;/g, '; ') // Pause after semicolons
      .replace(/:/g, ': ') // Pause after colons
      .replace(/\s+/g, ' ') // Clean up multiple spaces
      .trim();

    return cleanText;
  }

  private startProgressTracking(
    utterance: SpeechSynthesisUtterance, 
    onProgress?: (progress: number) => void
  ): void {
    if (!onProgress) return;

    const text = utterance.text;
    const totalLength = text.length;
    let currentPosition = 0;

    // Estimate progress based on speech rate and time
    const estimatedDuration = (totalLength / (utterance.rate * 15)) * 1000; // Rough estimation
    const updateInterval = 100; // Update every 100ms
    
    this.progressInterval = setInterval(() => {
      if (!this.synth.speaking) {
        this.stopProgressTracking();
        return;
      }

      currentPosition += (totalLength / estimatedDuration) * updateInterval;
      const progress = Math.min(currentPosition / totalLength, 1);
      onProgress(progress);

      if (progress >= 1) {
        this.stopProgressTracking();
      }
    }, updateInterval);
  }

  private stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // Parse conversation transcript and speak with different voices
  public async speakConversation(
    transcript: string,
    options: {
      femaleVoice?: SpeechSynthesisVoice;
      maleVoice?: SpeechSynthesisVoice;
      pauseBetweenSpeakers?: number;
    } = {},
    callbacks: TTSCallbacks = {}
  ): Promise<void> {
    const lines = transcript.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Determine speaker and voice
      const isFemale = this.detectFemaleSpeaker(line);
      const voice = isFemale ? 
        (options.femaleVoice || await this.selectBestVoice(true)) :
        (options.maleVoice || await this.selectBestVoice(false));

      // Speak the line
      await this.speak(line, { 
        voice: voice || undefined,
        rate: 0.9,
        pitch: isFemale ? 1.1 : 0.9 // Slightly higher pitch for female voice
      }, callbacks);

      // Add pause between speakers
      if (i < lines.length - 1 && options.pauseBetweenSpeakers) {
        await new Promise(resolve => setTimeout(resolve, options.pauseBetweenSpeakers));
      }
    }
  }

  private detectFemaleSpeaker(line: string): boolean {
    const femaleKeywords = [
      'customer', 'visitor', 'client', 'woman', 'female', 'speaker a', 
      'she', 'her', 'ms.', 'mrs.', 'miss'
    ];
    const maleKeywords = [
      'representative', 'agent', 'clerk', 'officer', 'man', 'male', 'speaker b',
      'he', 'him', 'mr.', 'sir'
    ];
    
    const lowerLine = line.toLowerCase();
    
    // Check for explicit female indicators
    if (femaleKeywords.some(keyword => lowerLine.includes(keyword))) {
      return true;
    }
    
    // Check for explicit male indicators
    if (maleKeywords.some(keyword => lowerLine.includes(keyword))) {
      return false;
    }
    
    // Default assumption - could be made more sophisticated
    return true; // Default to female voice for first speaker
  }
}

// Create a singleton instance
export const ttsService = new TextToSpeechService();