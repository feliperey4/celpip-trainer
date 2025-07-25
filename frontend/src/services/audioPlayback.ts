/**
 * Audio Playback Service for CELPIP Speaking Tasks
 * 
 * This service handles audio playback for recorded audio submissions
 * with proper controls and state management.
 */

export interface AudioPlaybackConfig {
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  buffered: number;
  error?: string;
}

export interface AudioVisualizationData {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  averageLevel: number;
}

export class AudioPlaybackService {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private animationFrame: number | null = null;

  // Event callbacks
  public onStateChange?: (state: PlaybackState) => void;
  public onTimeUpdate?: (currentTime: number, duration: number) => void;
  public onVisualization?: (data: AudioVisualizationData) => void;
  public onError?: (error: string) => void;

  constructor(private config: AudioPlaybackConfig = {}) {
    this.audio = new Audio();
    this.setupAudio();
  }

  /**
   * Setup audio element with configuration and event handlers
   */
  private setupAudio(): void {
    // Apply configuration
    this.audio.volume = this.config.volume ?? 1.0;
    this.audio.playbackRate = this.config.playbackRate ?? 1.0;
    this.audio.loop = this.config.loop ?? false;
    this.audio.preload = this.config.preload ?? 'metadata';

    // Set up event handlers
    this.audio.addEventListener('loadstart', () => this.notifyStateChange());
    this.audio.addEventListener('loadedmetadata', () => this.notifyStateChange());
    this.audio.addEventListener('loadeddata', () => this.notifyStateChange());
    this.audio.addEventListener('canplay', () => this.notifyStateChange());
    this.audio.addEventListener('canplaythrough', () => this.notifyStateChange());
    
    this.audio.addEventListener('play', () => {
      this.startVisualization();
      this.notifyStateChange();
    });
    
    this.audio.addEventListener('pause', () => {
      this.stopVisualization();
      this.notifyStateChange();
    });
    
    this.audio.addEventListener('ended', () => {
      this.stopVisualization();
      this.notifyStateChange();
    });
    
    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdate?.(this.audio.currentTime, this.audio.duration);
      this.notifyStateChange();
    });
    
    this.audio.addEventListener('error', (event) => {
      const error = this.getAudioError();
      if (error) {
        this.onError?.(error);
      }
      this.notifyStateChange();
    });
    
    this.audio.addEventListener('progress', () => this.notifyStateChange());
    this.audio.addEventListener('volumechange', () => this.notifyStateChange());
    this.audio.addEventListener('ratechange', () => this.notifyStateChange());
  }

  /**
   * Load audio from various sources
   */
  async loadAudio(source: string | Blob | File): Promise<boolean> {
    try {
      let audioUrl: string;

      if (typeof source === 'string') {
        // Base64 data or URL
        if (source.startsWith('data:') || source.startsWith('http')) {
          audioUrl = source;
        } else {
          // Assume base64 data
          audioUrl = `data:audio/webm;base64,${source}`;
        }
      } else {
        // Blob or File
        audioUrl = URL.createObjectURL(source);
      }

      this.audio.src = audioUrl;
      
      // Wait for metadata to load
      await new Promise<void>((resolve, reject) => {
        const onLoadedMetadata = () => {
          this.audio.removeEventListener('loadedmetadata', onLoadedMetadata);
          this.audio.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = () => {
          this.audio.removeEventListener('loadedmetadata', onLoadedMetadata);
          this.audio.removeEventListener('error', onError);
          reject(new Error('Failed to load audio'));
        };
        
        this.audio.addEventListener('loadedmetadata', onLoadedMetadata);
        this.audio.addEventListener('error', onError);
      });

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.onError?.(`Failed to load audio: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Play audio
   */
  async play(): Promise<boolean> {
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.onError?.(`Failed to play audio: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Pause audio
   */
  pause(): void {
    this.audio.pause();
  }

  /**
   * Stop audio (pause and reset to beginning)
   */
  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  /**
   * Seek to specific time
   */
  seekTo(time: number): void {
    if (time >= 0 && time <= this.audio.duration) {
      this.audio.currentTime = time;
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: number): void {
    this.audio.playbackRate = Math.max(0.25, Math.min(4, rate));
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState {
    const buffered = this.audio.buffered.length > 0 
      ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration 
      : 0;

    return {
      isPlaying: !this.audio.paused && !this.audio.ended,
      isPaused: this.audio.paused && this.audio.currentTime > 0,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      volume: this.audio.volume,
      playbackRate: this.audio.playbackRate,
      buffered,
      error: this.getAudioError()
    };
  }

  /**
   * Initialize audio visualization
   */
  private initializeVisualization(): void {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.source = this.audioContext.createMediaElementSource(this.audio);
      
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (error) {
      console.warn('Audio visualization not available:', error);
    }
  }

  /**
   * Start visualization updates
   */
  private startVisualization(): void {
    if (!this.analyser || !this.onVisualization) return;

    this.initializeVisualization();
    
    const bufferLength = this.analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);
    
    const updateVisualization = () => {
      if (!this.audio.paused && !this.audio.ended) {
        this.analyser!.getByteFrequencyData(frequencyData);
        this.analyser!.getByteTimeDomainData(timeData);
        
        // Calculate average level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += frequencyData[i];
        }
        const averageLevel = sum / bufferLength / 255;
        
        this.onVisualization?.({
          frequencyData: frequencyData.slice(),
          timeData: timeData.slice(),
          averageLevel
        });
        
        this.animationFrame = requestAnimationFrame(updateVisualization);
      }
    };
    
    updateVisualization();
  }

  /**
   * Stop visualization updates
   */
  private stopVisualization(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Get audio error message
   */
  private getAudioError(): string | undefined {
    const error = this.audio.error;
    if (!error) return undefined;

    const errorMessages: { [key: number]: string } = {
      1: 'Audio loading was aborted',
      2: 'Network error occurred while loading audio',
      3: 'Audio decoding failed',
      4: 'Audio format is not supported'
    };

    return errorMessages[error.code] || `Unknown audio error (code: ${error.code})`;
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
    this.stop();
    this.stopVisualization();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.audio.src) {
      URL.revokeObjectURL(this.audio.src);
    }
    
    this.audio.removeEventListener('loadstart', this.notifyStateChange);
    this.audio.removeEventListener('loadedmetadata', this.notifyStateChange);
    // ... remove other event listeners
  }
}

/**
 * Utility function to create audio playback from base64 data
 */
export async function createAudioPlayer(
  audioData: string,
  config: AudioPlaybackConfig = {}
): Promise<AudioPlaybackService> {
  const player = new AudioPlaybackService(config);
  await player.loadAudio(audioData);
  return player;
}

/**
 * Utility function to get audio duration from base64 data
 */
export function getAudioDuration(audioData: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
    
    audio.onerror = () => {
      reject(new Error('Failed to load audio for duration calculation'));
      URL.revokeObjectURL(audio.src);
    };
    
    const audioUrl = audioData.startsWith('data:') 
      ? audioData 
      : `data:audio/webm;base64,${audioData}`;
    
    audio.src = audioUrl;
  });
}

export default AudioPlaybackService;