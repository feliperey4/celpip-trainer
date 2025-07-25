import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Mic, Play, Volume2 } from 'lucide-react';
import { speakingApi, SpeakingTask1 as SpeakingTask1Data, SpeakingTask1Score } from '../services/api';
import AudioRecordingService, { RecordingState } from '../services/audioRecording';
import AudioPlaybackService from '../services/audioPlayback';

interface SpeakingTask1Props {
  onBackToDashboard: () => void;
}

interface TimerState {
  phase: 'preparation' | 'speaking' | 'completed';
  timeRemaining: number;
  isActive: boolean;
}

interface MicrophoneState {
  hasPermission: boolean;
  isRequesting: boolean;
  error?: string;
}

const SpeakingTask1: React.FC<SpeakingTask1Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<SpeakingTask1Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'instructions' | 'preparation' | 'speaking' | 'review' | 'results'>('instructions');
  
  // Timer state
  const [timer, setTimer] = useState<TimerState>({
    phase: 'preparation',
    timeRemaining: 30,
    isActive: false
  });
  
  // Recording state
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0
  });
  
  // Microphone state
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>({
    hasPermission: false,
    isRequesting: false
  });
  
  // Results state
  const [score, setScore] = useState<SpeakingTask1Score | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Services
  const audioRecordingService = useRef<AudioRecordingService | null>(null);
  const audioPlaybackService = useRef<AudioPlaybackService | null>(null);
  
  // Timer interval
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Load task on component mount
  useEffect(() => {
    loadTask();
    return () => {
      cleanup();
    };
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (timer.isActive && timer.timeRemaining > 0) {
      timerInterval.current = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      
      if (timer.isActive && timer.timeRemaining === 0) {
        handleTimerExpired();
      }
    }
    
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [timer.isActive, timer.timeRemaining]);
  
  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await speakingApi.generateTask1();
      
      if (response.success && response.task) {
        setTask(response.task);
        setTimer({
          phase: 'preparation',
          timeRemaining: response.task.instructions.preparation_time_seconds,
          isActive: false
        });
      } else {
        setError(response.error_message || 'Failed to load speaking task');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const requestMicrophonePermission = async () => {
    try {
      setMicrophoneState({
        hasPermission: false,
        isRequesting: true
      });
      
      if (!audioRecordingService.current) {
        audioRecordingService.current = new AudioRecordingService();
        setupRecordingService();
      }
      
      const hasPermission = await audioRecordingService.current.requestPermission();
      
      setMicrophoneState({
        hasPermission,
        isRequesting: false,
        error: hasPermission ? undefined : 'Microphone permission denied'
      });
      
      return hasPermission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request microphone permission';
      setMicrophoneState({
        hasPermission: false,
        isRequesting: false,
        error: errorMessage
      });
      return false;
    }
  };
  
  const setupRecordingService = () => {
    if (!audioRecordingService.current) return;
    
    audioRecordingService.current.onStateChange = (state) => {
      setRecordingState(state);
    };
    
    audioRecordingService.current.onError = (error) => {
      setError(`Recording error: ${error}`);
    };
  };
  
  const startPreparationPhase = async () => {
    if (!microphoneState.hasPermission) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;
    }
    
    setCurrentPhase('preparation');
    setTimer({
      phase: 'preparation',
      timeRemaining: task!.instructions.preparation_time_seconds || 30,
      isActive: true
    });
  };
  
  const startSpeakingPhase = async () => {
    if (!audioRecordingService.current) return;
    
    const started = await audioRecordingService.current.startRecording();
    if (!started) {
      setError('Failed to start recording');
      return;
    }
    
    setCurrentPhase('speaking');
    setTimer({
      phase: 'speaking',
      timeRemaining: task!.instructions.speaking_time_seconds,
      isActive: true
    });
  };
  
  const stopSpeakingPhase = async () => {
    if (!audioRecordingService.current) return;
    
    setTimer(prev => ({ ...prev, isActive: false }));
    
    const result = await audioRecordingService.current.stopRecording();
    if (result.success && result.audioData) {
      setAudioData(result.audioData);
      setCurrentPhase('review');
    } else {
      setError(result.error || 'Failed to stop recording');
    }
  };
  
  const handleTimerExpired = () => {
    if (timer.phase === 'preparation') {
      startSpeakingPhase();
    } else if (timer.phase === 'speaking') {
      stopSpeakingPhase();
    }
  };
  
  const submitForScoring = async () => {
    if (!task || !audioData) return;
    
    try {
      setSubmissionLoading(true);
      setError(null);
      
      const submission = {
        task_id: task.task_id,
        audio: {
          audio_data: audioData,
          audio_format: 'webm',
          duration_seconds: recordingState.duration
        },
        task_context: task,
        preparation_time_used: task.instructions.preparation_time_seconds - (timer.phase === 'preparation' ? timer.timeRemaining : 0),
        speaking_time_used: recordingState.duration
      };
      
      const response = await speakingApi.scoreTask1(submission);
      
      if (response.success && response.score) {
        setScore(response.score);
        setShowResults(true);
      } else {
        setError(response.error_message || 'Failed to score submission');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Error scoring submission:', err);
    } finally {
      setSubmissionLoading(false);
    }
  };
  
  const playbackAudio = async () => {
    if (!audioData) return;
    
    try {
      if (!audioPlaybackService.current) {
        audioPlaybackService.current = new AudioPlaybackService();
      }
      
      await audioPlaybackService.current.loadAudio(audioData);
      await audioPlaybackService.current.play();
    } catch (err) {
      setError(`Playback error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  const cleanup = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    if (audioRecordingService.current) {
      audioRecordingService.current.dispose();
    }
    
    if (audioPlaybackService.current) {
      audioPlaybackService.current.dispose();
    }
  };

  const handleRestart = () => {
    setCurrentPhase('instructions');
    setShowResults(false);
    setScore(null);
    setAudioData(null);
    setError(null);
    setTimer({
      phase: 'preparation',
      timeRemaining: task?.instructions.preparation_time_seconds || 30,
      isActive: false
    });
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioLevel: 0
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen celpip-gradient-bg flex items-center justify-center">
        <div className="celpip-card p-8 text-center animate-fade-in max-w-md">
          <div className="bg-green-50 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Speaking Task 1</h2>
          <p className="text-gray-600 leading-relaxed text-left">Generating your personalized CELPIP speaking test with authentic Canadian scenarios</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen celpip-gradient-bg flex items-center justify-center">
        <div className="celpip-card p-8 text-center max-w-md animate-fade-in">
          <div className="bg-red-50 p-4 rounded-full w-fit mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Connection Error</h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-left">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadTask}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Try Again
            </button>
            <button
              onClick={onBackToDashboard}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) return null;

  if (showResults && score) {
    return (
      <div className="min-h-screen celpip-gradient-bg py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="celpip-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="bg-green-50 p-4 rounded-full w-fit mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">Excellent Work!</h1>
              <p className="text-lg text-gray-600 text-left">Your CELPIP Speaking Task 1 Results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform hover:scale-105 transition-all">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {score.scores.overall_score.toFixed(1)}
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-1">{score.scores.overall_score.toFixed(1)}/12.0</h3>
                <p className="text-gray-700 font-medium text-left">Overall Score</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 transform hover:scale-105 transition-all">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  C
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-1">{score.scores.content_score.toFixed(1)}/12.0</h3>
                <p className="text-gray-700 font-medium text-left">Content</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 transform hover:scale-105 transition-all">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  V
                </div>
                <h3 className="text-2xl font-bold text-purple-600 mb-1">{score.scores.vocabulary_score.toFixed(1)}/12.0</h3>
                <p className="text-gray-700 font-medium text-left">Vocabulary</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 transform hover:scale-105 transition-all">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  L
                </div>
                <h3 className="text-2xl font-bold text-orange-600 mb-1">{score.scores.language_use_score.toFixed(1)}/12.0</h3>
                <p className="text-gray-700 font-medium text-left">Language Use</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  {score.feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700 text-left">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  {score.feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-gray-700 text-left">
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Specific Suggestions
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  {score.feedback.specific_suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 text-left">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {score.transcript && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Mic className="w-5 h-5 mr-2" />
                    Transcript
                  </h3>
                  <div className="bg-white p-4 rounded-lg border italic text-gray-700 leading-relaxed text-left">
                    "{score.transcript}"
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Try Another Task
              </button>
              <button
                onClick={onBackToDashboard}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen celpip-gradient-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="celpip-card p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">CELPIP Speaking Task 1</h1>
              <p className="text-gray-600 text-left">Giving Advice</p>
            </div>
            <button
              onClick={onBackToDashboard}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {currentPhase === 'instructions' ? 'Instructions' :
                 currentPhase === 'preparation' ? 'Preparation' :
                 currentPhase === 'speaking' ? 'Speaking' :
                 currentPhase === 'review' ? 'Review' : 'Complete'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${
                    currentPhase === 'instructions' ? 20 :
                    currentPhase === 'preparation' ? 40 :
                    currentPhase === 'speaking' ? 60 :
                    currentPhase === 'review' ? 80 : 100
                  }%` 
                }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          {timer.isActive && (
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${
                timer.timeRemaining <= 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                <Clock className="w-8 h-8 mr-2" />
                {formatTime(timer.timeRemaining)}
              </div>
              <p className="text-gray-600 mt-2 text-left">
                {timer.phase === 'preparation' ? 'Preparation Time' : 'Speaking Time'}
              </p>
            </div>
          )}

          {/* Content based on current phase */}
          {currentPhase === 'instructions' && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">{task.scenario.title}</h3>
                <div className="space-y-3 text-gray-700 text-left">
                  <p><strong>Situation:</strong> {task.scenario.situation}</p>
                  <p><strong>Context:</strong> {task.scenario.context}</p>
                  <p><strong>Person:</strong> {task.scenario.person_description}</p>
                  <p><strong>Topic:</strong> {task.scenario.advice_topic}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Instructions</h3>
                <p className="text-gray-700 mb-4 text-left">{task.instructions.task_description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center p-3 bg-white rounded-lg border">
                    <Clock className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 text-left">Preparation Time</p>
                      <p className="text-lg font-bold text-blue-600">{task.instructions.preparation_time_seconds}s</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border">
                    <Mic className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 text-left">Speaking Time</p>
                      <p className="text-lg font-bold text-green-600">{task.instructions.speaking_time_seconds}s</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-2 text-left">You will be evaluated on:</h4>
                  <ul className="space-y-1">
                    {task.instructions.evaluation_criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-left">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {task.instructions.tips.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-left">Tips for Success:</h4>
                    <ul className="space-y-1">
                      {task.instructions.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-left">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  Microphone Check
                </h3>
                {!microphoneState.hasPermission && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4 text-left">Please allow microphone access to continue.</p>
                    <button 
                      onClick={requestMicrophonePermission}
                      disabled={microphoneState.isRequesting}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed"
                    >
                      {microphoneState.isRequesting ? 'Requesting...' : 'Allow Microphone'}
                    </button>
                    {microphoneState.error && (
                      <p className="text-red-600 mt-2 text-left">{microphoneState.error}</p>
                    )}
                  </div>
                )}
                
                {microphoneState.hasPermission && (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-green-600 font-medium mb-4 text-left">✓ Microphone ready</p>
                    <button 
                      onClick={startPreparationPhase} 
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Start Preparation
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentPhase === 'preparation' && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">Remember the Scenario</h3>
                <p className="text-lg font-medium text-gray-800 mb-2 text-left">{task.scenario.title}</p>
                <p className="text-gray-700 text-left">{task.scenario.situation}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Preparation Notes</h3>
                <p className="text-gray-700 mb-4 text-left">Use this time to think about:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">What advice you want to give</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Why this advice would be helpful</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Examples or personal experiences to share</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">How to structure your response</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button 
                  onClick={startSpeakingPhase} 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Speaking Now
                </button>
                <p className="text-gray-500 mt-2 text-left">Or wait for the timer to automatically start recording</p>
              </div>
            </div>
          )}

          {currentPhase === 'speaking' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <Mic className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-xl font-bold text-red-600 mb-2">Recording in progress...</p>
                <p className="text-gray-600 text-left">Speak clearly and naturally</p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-2">{task.scenario.title}</h3>
                <p className="text-gray-700 text-left">{task.scenario.situation}</p>
              </div>

              <div className="text-center">
                <button 
                  onClick={stopSpeakingPhase} 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Stop Recording
                </button>
                <p className="text-gray-500 mt-2 text-left">Or recording will stop automatically when time expires</p>
              </div>

              {recordingState.duration > 0 && (
                <div className="bg-white p-4 rounded-lg border text-center">
                  <p className="text-gray-700 text-left">Recording duration: {formatTime(Math.floor(recordingState.duration))}</p>
                </div>
              )}
            </div>
          )}

          {currentPhase === 'review' && (
            <div className="space-y-6">
              {submissionLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                    <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Scoring Your Response</h3>
                    <p className="text-gray-600">Please wait while we analyze your speaking performance...</p>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-4">
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Review Your Response</h3>
                <p className="text-gray-600 text-left">Listen to your recording and then submit for scoring</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-center space-y-4">
                  <button 
                    onClick={playbackAudio} 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Play Recording
                  </button>
                  <p className="text-gray-600 text-left">Duration: {formatTime(Math.floor(recordingState.duration))}</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <button 
                  onClick={submitForScoring} 
                  disabled={submissionLoading} 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {submissionLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin inline mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Scoring'
                  )}
                </button>
                <div>
                  <button 
                    onClick={handleRestart} 
                    className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Restart Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingTask1;