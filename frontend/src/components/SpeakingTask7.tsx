import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Mic, Play } from 'lucide-react';
import { speakingApi, SpeakingTask7 as SpeakingTask7Data, SpeakingTask7Score } from '../services/api';
import AudioRecordingService, { RecordingState } from '../services/audioRecording';
import AudioPlaybackService from '../services/audioPlayback';

interface SpeakingTask7Props {
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

const SpeakingTask7: React.FC<SpeakingTask7Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<SpeakingTask7Data | null>(null);
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
  const [score, setScore] = useState<SpeakingTask7Score | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  
  // Opinion selection state
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  
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
      
      const response = await speakingApi.generateTask7();
      
      if (response.success && response.task) {
        setTask(response.task);
      } else {
        setError(response.error_message || 'Failed to load task');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
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
  
  const handleTimerExpired = () => {
    if (timer.phase === 'preparation') {
      // Move to speaking phase
      setCurrentPhase('speaking');
      setTimer({
        phase: 'speaking',
        timeRemaining: 90,
        isActive: true
      });
      startRecording();
    } else if (timer.phase === 'speaking') {
      // End speaking phase
      setCurrentPhase('review');
      setTimer(prev => ({ ...prev, phase: 'completed', isActive: false }));
      stopRecording();
    }
  };
  
  const startPreparation = async () => {
    if (!selectedPosition) {
      setError('Please select your position before starting preparation.');
      return;
    }
    
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
    if (!audioRecordingService.current) {
      audioRecordingService.current = new AudioRecordingService();
    }
    
    try {
      await audioRecordingService.current.startRecording();
      
      // Update recording state
      const updateRecordingState = () => {
        if (audioRecordingService.current) {
          setRecordingState(audioRecordingService.current.getState());
        }
      };
      
      const stateInterval = setInterval(updateRecordingState, 100);
      
      // Store interval reference for cleanup
      audioRecordingService.current.onStateChange = updateRecordingState;
      
      setTimeout(() => clearInterval(stateInterval), 90000);
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording');
    }
  };
  
  const stopRecording = async () => {
    if (audioRecordingService.current) {
      try {
        const result = await audioRecordingService.current.stopRecording();
        
        if (result.success && result.audioData) {
          // Use the already base64-encoded data
          setAudioData(result.audioData);
        } else if (result.success && result.audioBlob) {
          // Convert blob to base64
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const base64Data = base64.split(',')[1];
            setAudioData(base64Data);
          };
          reader.readAsDataURL(result.audioBlob);
        } else {
          setError(result.error || 'Failed to stop recording');
        }
        
      } catch (err) {
        console.error('Failed to stop recording:', err);
        setError('Failed to stop recording');
      }
    }
  };
  
  const submitTask = async () => {
    if (!task || !audioData) {
      setError('No audio data available');
      return;
    }
    
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
        chosen_position: selectedPosition || undefined,
        preparation_time_used: 30,
        speaking_time_used: recordingState.duration,
        submission_timestamp: new Date().toISOString()
      };
      
      const response = await speakingApi.scoreTask7(submission);
      
      if (response.success && response.score) {
        setScore(response.score);
        setCurrentPhase('results');
      } else {
        setError(response.error_message || 'Failed to score task');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error submitting task:', err);
    } finally {
      setSubmissionLoading(false);
    }
  };
  
  const playRecording = async () => {
    if (audioData && !audioPlaybackService.current) {
      audioPlaybackService.current = new AudioPlaybackService();
      
      try {
        // Load the audio data and play it
        await audioPlaybackService.current.loadAudio(audioData);
        await audioPlaybackService.current.play();
      } catch (err) {
        console.error('Failed to play recording:', err);
        setError('Failed to play recording');
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 10) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreBackground = (score: number) => {
    if (score >= 10) return 'bg-green-100 border-green-300';
    if (score >= 7) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen celpip-gradient-bg flex items-center justify-center">
        <div className="celpip-card p-8 text-center animate-fade-in max-w-md">
          <div className="bg-blue-50 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Speaking Task 7</h2>
          <p className="text-gray-600 leading-relaxed text-left">Generating your personalized CELPIP speaking test with thought-provoking opinion topics</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && !task) {
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBackToDashboard}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Speaking Task 7</h1>
                <p className="text-gray-600">Expressing Opinions</p>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">30s prep + 90s speak</span>
            </div>
          </div>
        </div>
        
        {/* Instructions Phase */}
        {currentPhase === 'instructions' && task && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Task Instructions</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Topic:</h3>
                <p className="text-gray-700 text-left">{task.scenario.topic_statement}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Context:</h3>
                <p className="text-gray-700 text-left">{task.scenario.context}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Your Position:</h3>
                <p className="text-gray-700 mb-3 text-left">Choose your position and prepare to defend it with 2-3 strong arguments:</p>
                <div className="space-y-2">
                  {task.scenario.position_options.map((option, index) => (
                    <label key={index} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="position"
                        value={option}
                        checked={selectedPosition === option}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700 text-left">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Tips:</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                  {task.instructions.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Things to Consider:</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-700">
                  {task.scenario.considerations.map((consideration, index) => (
                    <li key={index}>{consideration}</li>
                  ))}
                </ul>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              <button
                onClick={startPreparation}
                disabled={!selectedPosition || microphoneState.isRequesting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Preparation Phase</h2>
                <p className="text-lg text-left">Use this time to organize your thoughts and prepare your arguments</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatTime(timer.timeRemaining)}
                </div>
                <p className="text-gray-600 text-left">Time remaining</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold text-blue-800 mb-2">Topic Statement:</h3>
                <p className="text-gray-700 text-lg font-medium text-left">{task.scenario.topic_statement}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold text-green-800 mb-2">Your Selected Position:</h3>
                <p className="text-gray-700 text-lg font-medium text-left">{selectedPosition}</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold text-yellow-800 mb-2">Quick Reminders:</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Prepare 2-3 strong supporting arguments</li>
                  <li>Think of personal examples or general knowledge</li>
                  <li>Use phrases like "I believe", "In my opinion", "I think"</li>
                  <li>Consider potential counterarguments</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Speaking Phase */}
        {currentPhase === 'speaking' && task && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center">
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Speaking Phase</h2>
                <p className="text-lg text-left">Express your opinion clearly with supporting arguments</p>
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
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Speaking on:</h3>
                <p className="text-gray-700 text-left">{task.scenario.topic_statement}</p>
                <p className="text-blue-600 font-medium mt-2 text-left">Your position: {selectedPosition}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Phase */}
        {currentPhase === 'review' && task && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Review Your Response</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Recording Summary:</h3>
                <p className="text-gray-700 text-left">Duration: {formatTime(recordingState.duration)}</p>
                <p className="text-gray-700 text-left">Position: {selectedPosition}</p>
              </div>
              
              {audioData && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Listen to Your Response:</h3>
                  <button
                    onClick={playRecording}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Recording
                  </button>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={submitTask}
                  disabled={submissionLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  onClick={loadTask}
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Results</h2>
            
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`inline-block p-6 rounded-lg border-2 ${getScoreBackground(score.scores.overall_score)}`}>
                  <div className={`text-4xl font-bold ${getScoreColor(score.scores.overall_score)}`}>
                    {score.scores.overall_score}/12
                  </div>
                  <p className="text-gray-600 mt-2 text-left">Overall Score</p>
                </div>
              </div>
              
              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Content</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.content_score)}`}>
                    {score.scores.content_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Vocabulary</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.vocabulary_score)}`}>
                    {score.scores.vocabulary_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Language Use</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.language_use_score)}`}>
                    {score.scores.language_use_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Task Fulfillment</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.task_fulfillment_score)}`}>
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
              
              {score.feedback.pronunciation_notes && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Pronunciation Notes</h3>
                  <p className="text-gray-700 text-left">{score.feedback.pronunciation_notes}</p>
                </div>
              )}
              
              {score.feedback.fluency_notes && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Fluency Notes</h3>
                  <p className="text-gray-700 text-left">{score.feedback.fluency_notes}</p>
                </div>
              )}
              
              {/* Transcript */}
              {score.transcript && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Your Response Transcript</h3>
                  <p className="text-gray-700 italic text-left">"{score.transcript}"</p>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={loadTask}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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

export default SpeakingTask7;