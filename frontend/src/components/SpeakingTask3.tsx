import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Play, Volume2, Mic } from 'lucide-react';
import { speakingApi, SpeakingTask3 as SpeakingTask3Data, SpeakingTask3Score } from '../services/api';
import AudioRecordingService, { RecordingState } from '../services/audioRecording';
import AudioPlaybackService from '../services/audioPlayback';

interface SpeakingTask3Props {
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

const SpeakingTask3: React.FC<SpeakingTask3Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<SpeakingTask3Data | null>(null);
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
  const [score, setScore] = useState<SpeakingTask3Score | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Audio services
  const recordingService = useRef<AudioRecordingService | null>(null);
  const playbackService = useRef<AudioPlaybackService | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  
  // Timer interval
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Load task on component mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await speakingApi.generateTask3();
        
        if (response.success && response.task) {
          setTask(response.task);
        } else {
          setError(response.error_message || 'Failed to generate task');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, []);
  
  // Initialize audio services
  useEffect(() => {
    recordingService.current = new AudioRecordingService();
    playbackService.current = new AudioPlaybackService();
    
    // Setup recording service callbacks
    if (recordingService.current) {
      recordingService.current.onStateChange = (state) => {
        setRecordingState(state);
      };
      
      recordingService.current.onError = (error) => {
        setError(`Recording error: ${error}`);
      };
    }
    
    return () => {
      recordingService.current?.dispose();
      playbackService.current?.dispose();
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
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleTimerExpired = () => {
    if (timer.phase === 'preparation') {
      startSpeakingPhase();
    } else if (timer.phase === 'speaking') {
      handleStopRecording();
    }
  };
  
  const requestMicrophonePermission = async () => {
    try {
      setMicrophoneState({
        hasPermission: false,
        isRequesting: true
      });
      
      if (!recordingService.current) {
        recordingService.current = new AudioRecordingService();
        // Setup recording service callbacks
        recordingService.current.onStateChange = (state) => {
          setRecordingState(state);
        };
        
        recordingService.current.onError = (error) => {
          setError(`Recording error: ${error}`);
        };
      }
      
      const hasPermission = await recordingService.current.requestPermission();
      
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
  
  const startPreparationPhase = async () => {
    if (!microphoneState.hasPermission) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;
    }
    
    setCurrentPhase('preparation');
    setTimer({
      phase: 'preparation',
      timeRemaining: 30,
      isActive: true
    });
  };
  
  const startSpeakingPhase = async () => {
    setCurrentPhase('speaking');
    setTimer({
      phase: 'speaking',
      timeRemaining: 60,
      isActive: true
    });
    
    // Start recording
    try {
      await recordingService.current?.startRecording();
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording. Please check your microphone.');
    }
  };
  
  const handleStopRecording = async () => {
    try {
      const result = await recordingService.current?.stopRecording();
      if (result && result.success && result.audioBlob) {
        setRecordedAudioBlob(result.audioBlob);
      } else {
        setError(result?.error || 'Failed to stop recording');
      }
      
      setTimer({
        phase: 'completed',
        timeRemaining: 0,
        isActive: false
      });
      
      setCurrentPhase('review');
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError('Failed to stop recording');
    }
  };
  
  const playRecordedAudio = async () => {
    if (!recordedAudioBlob || !playbackService.current) return;
    
    try {
      setIsPlayingRecording(true);
      await playbackService.current.loadAudio(recordedAudioBlob);
      await playbackService.current.play();
      setIsPlayingRecording(false);
    } catch (err) {
      console.error('Failed to play recording:', err);
      setIsPlayingRecording(false);
    }
  };
  
  const submitRecording = async () => {
    if (!recordedAudioBlob || !task) return;
    
    setSubmissionLoading(true);
    setSubmissionError(null);
    
    try {
      const response = await speakingApi.scoreTask3({
        task_id: task.task_id,
        audio: {
          audio_data: await convertBlobToBase64(recordedAudioBlob),
          audio_format: 'webm',
          duration_seconds: recordingState.duration
        },
        task_context: task,
        preparation_time_used: 30,
        speaking_time_used: recordingState.duration
      });
      
      if (response.success && response.score) {
        setScore(response.score);
        setCurrentPhase('results');
      } else {
        setSubmissionError(response.error_message || 'Failed to score recording');
      }
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'Failed to submit recording');
    } finally {
      setSubmissionLoading(false);
    }
  };
  
  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const retryTask = () => {
    setCurrentPhase('instructions');
    setTask(null);
    setScore(null);
    setRecordedAudioBlob(null);
    setError(null);
    setSubmissionError(null);
    setTimer({
      phase: 'preparation',
      timeRemaining: 30,
      isActive: false
    });
    
    // Reload task
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await speakingApi.generateTask3();
        if (response.success && response.task) {
          setTask(response.task);
        } else {
          setError(response.error_message || 'Failed to generate task');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen celpip-gradient-bg p-4 flex items-center justify-center">
        <div className="celpip-card p-8 text-center">
          <Loader className="animate-spin mx-auto mb-4 h-8 w-8 text-orange-500" />
          <p className="text-gray-600 text-center">Generating your speaking task...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen celpip-gradient-bg p-4 flex items-center justify-center">
        <div className="celpip-card p-8 text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <div className="space-y-2">
            <button
              onClick={retryTask}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Try Again
            </button>
            <button
              onClick={onBackToDashboard}
              className="w-full text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="min-h-screen celpip-gradient-bg p-4 flex items-center justify-center">
        <div className="celpip-card p-8 text-center">
          <p className="text-gray-600 text-center">No task available</p>
        </div>
      </div>
    );
  }

  if (currentPhase === 'results' && score) {
    return (
      <div className="min-h-screen celpip-gradient-bg py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="celpip-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="bg-orange-50 p-4 rounded-full w-fit mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-orange-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">Excellent Work!</h1>
              <p className="text-lg text-gray-600 text-left">Your CELPIP Speaking Task 3 Results</p>
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
                  T
                </div>
                <h3 className="text-2xl font-bold text-orange-600 mb-1">{score.scores.task_fulfillment_score.toFixed(1)}/12.0</h3>
                <p className="text-gray-700 font-medium text-left">Task Fulfillment</p>
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
                onClick={retryTask}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">CELPIP Speaking Task 3</h1>
            <p className="text-gray-600 text-left">Describing a Scene</p>
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
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${
                  currentPhase === 'instructions' ? 20 :
                  currentPhase === 'preparation' ? 40 :
                  currentPhase === 'speaking' ? 60 :
                  currentPhase === 'review' ? 80 : 100
                }%` 
              }}
            />
          </div>
        </div>

        {/* Timer */}
        {timer.isActive && (
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${
              timer.timeRemaining <= 10 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
            }`}>
              <Clock className="w-8 h-8 mr-2" />
              {formatTime(timer.timeRemaining)}
            </div>
            <p className="text-gray-600 mt-2 text-left">
              {timer.phase === 'preparation' ? 'Preparation Time' : 'Speaking Time'}
            </p>
          </div>
        )}
        
          {/* Instructions Phase */}
          {currentPhase === 'instructions' && (
            <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Task 3: Describing a Scene</h2>
              <p className="text-left text-gray-600 text-lg leading-relaxed">
                You will look at a picture and describe what you see. Speak as if you are describing the scene to someone who cannot see the picture.
              </p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-orange-800 mb-3">Task Instructions:</h3>
              <ul className="space-y-2 text-orange-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Preparation time:</strong> 30 seconds to observe the scene and take notes
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Speaking time:</strong> 60 seconds to describe the scene
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <strong>Goal:</strong> Describe the scene so someone who can't see it can visualize it
                </li>
              </ul>
            </div>
            
            <div className="text-left grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">What to Include:</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {task.instructions.evaluation_criteria.map((criterion, index) => (
                      <li>{criterion}</li>
                    ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Tips for Success:</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {task.instructions.tips.map((criterion, index) => (
                      <li>{criterion}</li>
                    ))}
                </ul>
              </div>
            </div>
            
            {/* Microphone Permission */}
            {!microphoneState.hasPermission && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Microphone Access Required</h4>
                <p className="text-blue-700 mb-4 text-left">
                  This task requires microphone access to record your response.
                </p>
                {microphoneState.error && (
                  <p className="text-red-600 text-sm mb-4 text-left">{microphoneState.error}</p>
                )}
                <button
                  onClick={requestMicrophonePermission}
                  disabled={microphoneState.isRequesting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {microphoneState.isRequesting ? 'Requesting...' : 'Allow Microphone'}
                </button>
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={startPreparationPhase}
                disabled={!microphoneState.hasPermission}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed"
              >
                Begin Task
              </button>
            </div>
            </div>
          )}
        
          {/* Preparation Phase */}
          {currentPhase === 'preparation' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Preparation Time</h2>
                <p className="text-gray-600">Study the scene and take notes. You have 30 seconds.</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-4">{task.scenario.title}</h3>
                
                {/* Display the generated scene image */}
                {task.scene_image ? (
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <h4 className="font-medium text-gray-700 mb-3">Scene to Describe:</h4>
                    <div className="flex justify-center">
                      <img 
                        src={`data:image/jpeg;base64,${task.scene_image}`}
                        alt={task.scenario.title}
                        className="max-w-full h-auto rounded-lg shadow-md border"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-3">Scene Description:</h4>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-left">
                      {task.scenario.scene_description}
                    </p>
                  </div>
                )}
                
                {task.scenario.key_elements && task.scenario.key_elements.length > 0 && (
                  <div className="mt-4 bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">Key Elements to Notice:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      {task.scenario.key_elements.map((element, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="text-left">{element}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Preparation Notes</h3>
                <p className="text-gray-700 mb-4 text-left">Use this time to think about:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">The overall scene and setting</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Key people, objects, and activities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Spatial relationships and layout</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Colors, emotions, and atmosphere</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button 
                  onClick={startSpeakingPhase} 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Speaking Now
                </button>
                <p className="text-gray-500 mt-2 text-left">Or wait for the timer to automatically start recording</p>
              </div>
            </div>
          )}
        
          {/* Speaking Phase */}
          {currentPhase === 'speaking' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <Mic className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-xl font-bold text-red-600 mb-2">Recording in progress...</p>
                <p className="text-gray-600 text-left">Describe the scene clearly and naturally</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-2">{task.scenario.title}</h3>
                
                {/* Show the image during speaking phase for reference */}
                {task.scene_image ? (
                  <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                    <div className="flex justify-center">
                      <img 
                        src={`data:image/jpeg;base64,${task.scene_image}`}
                        alt={task.scenario.title}
                        className="max-w-full h-auto rounded-lg border"
                        style={{ maxHeight: '250px' }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-left mb-3">{task.scenario.scene_description}</p>
                )}
                
                {task.scenario.spatial_layout && (
                  <p className="text-orange-600 text-sm text-left">
                    <strong>Layout:</strong> {task.scenario.spatial_layout}
                  </p>
                )}
              </div>

              <div className="text-center">
                <button 
                  onClick={handleStopRecording} 
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

              {/* Audio Level Indicator */}
              {recordingState.audioLevel > 0 && (
                <div className="bg-white p-4 rounded-lg border">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${Math.min(recordingState.audioLevel * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">Audio Level</p>
                </div>
              )}
            </div>
          )}
        
          {/* Review Phase */}
          {currentPhase === 'review' && (
            <div className="space-y-6">
              {submissionLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                    <Loader className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Scoring Your Response</h3>
                    <p className="text-gray-600">Please wait while we analyze your speaking performance...</p>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-orange-100 rounded-full mb-4">
                  <Play className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Review Your Response</h3>
                <p className="text-gray-600 text-left">Listen to your recording and then submit for scoring</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-center space-y-4">
                  <button 
                    onClick={playRecordedAudio} 
                    disabled={isPlayingRecording}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed"
                  >
                    {isPlayingRecording ? (
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4" />
                        <span>Playing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Play Recording</span>
                      </div>
                    )}
                  </button>
                  <p className="text-gray-600 text-left">Duration: {formatTime(Math.floor(recordingState.duration))}</p>
                </div>
              </div>

              {submissionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-left">{submissionError}</p>
                </div>
              )}

              <div className="text-center space-y-4">
                <button 
                  onClick={submitRecording} 
                  disabled={submissionLoading || !recordedAudioBlob} 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed"
                >
                  {submissionLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit for Scoring'
                  )}
                </button>
                <div>
                  <button 
                    onClick={retryTask} 
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

export default SpeakingTask3;