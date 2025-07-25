import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Play, Mic } from 'lucide-react';
import { speakingApi, SpeakingTask4 as SpeakingTask4Data, SpeakingTask4Score } from '../services/api';
import AudioRecordingService, { RecordingState } from '../services/audioRecording';
import AudioPlaybackService from '../services/audioPlayback';

interface SpeakingTask4Props {
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

const SpeakingTask4: React.FC<SpeakingTask4Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<SpeakingTask4Data | null>(null);
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
  const [score, setScore] = useState<SpeakingTask4Score | null>(null);
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
        const response = await speakingApi.generateTask4();
        
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
      if (recordingService.current) {
        recordingService.current.dispose();
      }
      if (playbackService.current) {
        playbackService.current.dispose();
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
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
  
  const handleTimerExpired = async () => {
    if (timer.phase === 'preparation') {
      // Move to speaking phase
      setCurrentPhase('speaking');
      setTimer({
        phase: 'speaking',
        timeRemaining: 60,
        isActive: true
      });
      
      // Start recording
      await startRecording();
    } else if (timer.phase === 'speaking') {
      // End speaking phase
      setCurrentPhase('review');
      setTimer(prev => ({ ...prev, phase: 'completed', isActive: false }));
      
      // Stop recording
      await stopRecording();
    }
  };
  
  const startPreparation = async () => {
    try {
      await requestMicrophonePermission();
      setCurrentPhase('preparation');
      setTimer({
        phase: 'preparation',
        timeRemaining: 30,
        isActive: true
      });
    } catch (err) {
      setError('Microphone permission required to continue');
    }
  };
  
  const requestMicrophonePermission = async () => {
    setMicrophoneState(prev => ({ ...prev, isRequesting: true }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      setMicrophoneState({
        hasPermission: true,
        isRequesting: false
      });
    } catch (err) {
      setMicrophoneState({
        hasPermission: false,
        isRequesting: false,
        error: 'Microphone permission denied'
      });
      throw err;
    }
  };
  
  const startRecording = async () => {
    if (!recordingService.current) return;
    
    try {
      await recordingService.current.startRecording();
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  };
  
  const stopRecording = async () => {
    if (!recordingService.current) return;
    
    try {
      const result = await recordingService.current.stopRecording();
      if (result.success && result.audioBlob) {
        setRecordedAudioBlob(result.audioBlob);
      }
    } catch (err) {
      setError('Failed to stop recording');
      console.error('Recording error:', err);
    }
  };
  
  const playRecording = async () => {
    if (!recordedAudioBlob || !playbackService.current) return;
    
    try {
      setIsPlayingRecording(true);
      await playbackService.current.loadAudio(recordedAudioBlob);
      await playbackService.current.play();
    } catch (err) {
      setError('Failed to play recording');
      console.error('Playback error:', err);
    } finally {
      setIsPlayingRecording(false);
    }
  };
  
  const submitTask = async () => {
    if (!task || !recordedAudioBlob) {
      setSubmissionError('No recording available to submit');
      return;
    }
    
    try {
      setSubmissionLoading(true);
      setSubmissionError(null);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const audioData = base64Data.split(',')[1];
        
        const submission = {
          task_id: task.task_id,
          audio: {
            audio_data: audioData,
            audio_format: 'webm',
            duration_seconds: recordingState.duration
          },
          task_context: task,
          preparation_time_used: 30,
          speaking_time_used: recordingState.duration,
          submission_timestamp: new Date().toISOString()
        };
        
        try {
          const response = await speakingApi.scoreTask4(submission);
          
          if (response.success && response.score) {
            setScore(response.score);
            setCurrentPhase('results');
          } else {
            setSubmissionError(response.error_message || 'Failed to score task');
          }
        } catch (err) {
          setSubmissionError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
          setSubmissionLoading(false);
        }
      };
      
      reader.readAsDataURL(recordedAudioBlob);
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'Unknown error occurred');
      setSubmissionLoading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Speaking Task 4</h2>
          <p className="text-gray-600 text-left">Generating your personalized CELPIP speaking test with prediction scenarios</p>
        </div>
      </div>
    );
  }
  
  if (error && !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Connection Error</h2>
          <p className="text-gray-600 mb-8 text-left">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onBackToDashboard}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBackToDashboard}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Speaking Task 4</h1>
                <p className="text-gray-600">Making Predictions</p>
              </div>
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">30s prep + 60s speak</span>
            </div>
          </div>
        </div>
        
        {/* Instructions Phase */}
        {currentPhase === 'instructions' && task && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Task Instructions</h2>
            <div className="space-y-4">
              {/* Scene Image */}
              {task.scene_image && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Scene Image:</h3>
                  <div className="flex justify-center">
                    <img 
                      src={`data:image/png;base64,${task.scene_image}`}
                      alt="Scene for making predictions"
                      className="w-full max-w-2xl h-48 sm:h-56 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Scene Description:</h3>
                <p className="text-gray-700 text-left">{task.scenario.scene_description}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Current Situation:</h3>
                <p className="text-gray-700 text-left">{task.scenario.current_situation}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Your Task:</h3>
                <p className="text-gray-700 text-left">{task.instructions.task_description}</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Tips:</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                  {task.instructions.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Key Characters:</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                  {task.scenario.key_characters.map((character, index) => (
                    <li key={index}>{character}</li>
                  ))}
                </ul>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-600 text-left">{error}</p>
                </div>
              )}
              
              <button
                onClick={startPreparation}
                disabled={microphoneState.isRequesting}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {microphoneState.isRequesting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Requesting Microphone...
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start Preparation Phase
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Preparation Phase */}
        {currentPhase === 'preparation' && task && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="text-center">
              <div className="bg-purple-100 text-purple-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Preparation Phase</h2>
                <p className="text-lg text-left">Analyze the scene and think about what will happen next</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {formatTime(timer.timeRemaining)}
                </div>
                <p className="text-gray-600 text-left">Time remaining</p>
              </div>
              
              {/* Scene Image */}
              {task.scene_image && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Scene Image:</h3>
                  <div className="flex justify-center">
                    <img 
                      src={`data:image/png;base64,${task.scene_image}`}
                      alt="Scene for making predictions"
                      className="w-full max-w-xl h-40 sm:h-44 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Scene to Predict:</h3>
                <p className="text-gray-700 text-left">{task.scenario.scene_description}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Prediction Elements to Consider:</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                  {task.scenario.prediction_elements.map((element, index) => (
                    <li key={index}>{element}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Speaking Phase */}
        {currentPhase === 'speaking' && task && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="text-center">
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Speaking Phase</h2>
                <p className="text-lg text-left">Make your predictions about what will happen next</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-500 w-4 h-4 rounded-full animate-pulse mr-3"></div>
                  <span className="text-lg font-semibold text-red-600">RECORDING</span>
                </div>
                
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {formatTime(timer.timeRemaining)}
                </div>
                <p className="text-gray-600 text-left">Time remaining</p>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Duration: {formatTime(recordingState.duration)}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${Math.min(recordingState.audioLevel * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Scene Image */}
              {task.scene_image && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Scene Image:</h3>
                  <div className="flex justify-center">
                    <img 
                      src={`data:image/png;base64,${task.scene_image}`}
                      alt="Scene for making predictions"
                      className="w-full max-w-lg h-36 sm:h-40 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Making Predictions About:</h3>
                <p className="text-gray-700 text-left">{task.scenario.scene_description}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Phase */}
        {currentPhase === 'review' && task && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Review Your Response</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Recording Summary:</h3>
                <p className="text-gray-700 text-left">Duration: {formatTime(recordingState.duration)}</p>
                <p className="text-gray-700 text-left">Task: Making predictions about the scene</p>
              </div>
              
              {recordedAudioBlob && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Listen to Your Response:</h3>
                  <button
                    onClick={playRecording}
                    disabled={isPlayingRecording}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isPlayingRecording ? 'Playing...' : 'Play Recording'}
                  </button>
                </div>
              )}
              
              {submissionError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-600 text-left">{submissionError}</p>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={submitTask}
                  disabled={submissionLoading}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submissionLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit for Scoring
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Phase */}
        {currentPhase === 'results' && score && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Results</h2>
            
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="bg-purple-100 border-2 border-purple-300 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600">
                    {score.scores.overall_score}/12
                  </div>
                  <p className="text-gray-600 mt-2 text-left">Overall Score</p>
                </div>
              </div>
              
              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Content</h3>
                  <div className="text-2xl font-bold text-purple-600">
                    {score.scores.content_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Vocabulary</h3>
                  <div className="text-2xl font-bold text-purple-600">
                    {score.scores.vocabulary_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Language Use</h3>
                  <div className="text-2xl font-bold text-purple-600">
                    {score.scores.language_use_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Task Fulfillment</h3>
                  <div className="text-2xl font-bold text-purple-600">
                    {score.scores.task_fulfillment_score}/12
                  </div>
                </div>
              </div>
              
              {/* Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
                  <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                    {score.feedback.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Areas for Improvement</h3>
                  <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                    {score.feedback.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Specific Suggestions</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                  {score.feedback.specific_suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              {/* Transcript */}
              {score.transcript && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Your Response Transcript</h3>
                  <p className="text-gray-700 italic text-left">"{score.transcript}"</p>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Practice Again
                </button>
                
                <button
                  onClick={onBackToDashboard}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingTask4;