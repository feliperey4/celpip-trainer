import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Mic, Play } from 'lucide-react';
import { speakingApi, SpeakingTask6 as SpeakingTask6Data, SpeakingTask6Score } from '../services/api';
import AudioRecordingService, { RecordingState } from '../services/audioRecording';
import AudioPlaybackService from '../services/audioPlayback';

interface SpeakingTask6Props {
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

const SpeakingTask6: React.FC<SpeakingTask6Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<SpeakingTask6Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'instructions' | 'preparation' | 'speaking' | 'review' | 'results'>('instructions');
  
  // Timer state
  const [timer, setTimer] = useState<TimerState>({
    phase: 'preparation',
    timeRemaining: 60,
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
  const [score, setScore] = useState<SpeakingTask6Score | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  
  // Communication option selection state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isActive, timer.timeRemaining]);
  
  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await speakingApi.generateTask6();
      
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
        timeRemaining: 60,
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
    if (!selectedOption) {
      setError('Please select your communication option before starting preparation.');
      return;
    }
    
    try {
      await requestMicrophonePermission();
      setCurrentPhase('preparation');
      setTimer({
        phase: 'preparation',
        timeRemaining: 60,
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
      
      setTimeout(() => clearInterval(stateInterval), 60000);
      
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
        chosen_option: selectedOption || undefined,
        preparation_time_used: 60,
        speaking_time_used: recordingState.duration,
        submission_timestamp: new Date().toISOString()
      };
      
      const response = await speakingApi.scoreTask6(submission);
      
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
          <div className="bg-indigo-50 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Speaking Task 6</h2>
          <p className="text-gray-600 leading-relaxed text-left">Generating your personalized CELPIP speaking test with challenging interpersonal scenarios</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
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
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="celpip-card p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">CELPIP Speaking Task 6</h1>
              <p className="text-gray-600 text-left">Dealing with Difficult Situations</p>
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
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
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
                timer.timeRemaining <= 10 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
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
          {currentPhase === 'instructions' && task && (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">{task.scenario.title}</h3>
                <div className="space-y-3 text-gray-700 text-left">
                  <p><strong>Situation:</strong> {task.scenario.situation_description}</p>
                  <p><strong>Context:</strong> {task.scenario.context}</p>
                  <p><strong>Why This Is Difficult:</strong> {task.scenario.dilemma_explanation}</p>
                  <p><strong>Relationship Context:</strong> {task.scenario.relationship_context}</p>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">Your Communication Options</h3>
                <p className="text-gray-700 mb-4 text-left">Choose one option and explain your choice:</p>
                <div className="space-y-3">
                  {task.scenario.communication_options.map((option, index) => (
                    <label key={index} className="flex items-start cursor-pointer p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="option"
                        value={option}
                        checked={selectedOption === option}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="mr-3 mt-1"
                      />
                      <span className="text-gray-700 text-left">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Instructions</h3>
                <p className="text-gray-700 mb-4 text-left">{task.instructions.task_description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center p-3 bg-white rounded-lg border">
                    <Clock className="w-5 h-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 text-left">Preparation Time</p>
                      <p className="text-lg font-bold text-indigo-600">{task.instructions.preparation_time_seconds}s</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border">
                    <Mic className="w-5 h-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 text-left">Speaking Time</p>
                      <p className="text-lg font-bold text-indigo-600">{task.instructions.speaking_time_seconds}s</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-2 text-left">You will be evaluated on:</h4>
                  <ul className="space-y-1">
                    {task.instructions.evaluation_criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
                      onClick={startPreparation}
                      disabled={!selectedOption || microphoneState.isRequesting}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-indigo-400 disabled:to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed"
                    >
                      {microphoneState.isRequesting ? 'Requesting...' : (!selectedOption ? 'Select an Option First' : 'Allow Microphone & Start')}
                    </button>
                    {microphoneState.error && (
                      <p className="text-red-600 mt-2 text-left">{microphoneState.error}</p>
                    )}
                  </div>
                )}
                
                {microphoneState.hasPermission && (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-indigo-600 font-medium mb-4 text-left">✓ Microphone ready</p>
                    <button 
                      onClick={startPreparation} 
                      disabled={!selectedOption}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-indigo-400 disabled:to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed"
                    >
                      {!selectedOption ? 'Select an Option First' : 'Start Preparation'}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-600 text-left">{error}</p>
                </div>
              )}
            </div>
          )}
        
          {/* Preparation Phase */}
          {currentPhase === 'preparation' && task && (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">Remember the Scenario</h3>
                <p className="text-lg font-medium text-gray-800 mb-2 text-left">{task.scenario.title}</p>
                <p className="text-gray-700 text-left">{task.scenario.situation_description}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">Your Selected Option</h3>
                <p className="text-gray-700 font-medium text-left">{selectedOption}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Preparation Notes</h3>
                <p className="text-gray-700 mb-4 text-left">Use this time to think about:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Why you chose this communication option</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">How to use diplomatic and empathetic language</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Consider the feelings of all parties involved</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-left">Specific details about what you would say</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        
          {/* Speaking Phase */}
          {currentPhase === 'speaking' && task && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <Mic className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-xl font-bold text-red-600 mb-2">Recording in progress...</p>
                <p className="text-gray-600 text-left">Explain your chosen communication approach</p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">{task.scenario.title}</h3>
                <p className="text-gray-700 text-left">{task.scenario.situation_description}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-2">Your Selected Option</h3>
                <p className="text-gray-700 text-left">{selectedOption}</p>
              </div>
            </div>
          )}
        
          {/* Review Phase */}
          {currentPhase === 'review' && task && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recording Summary</h3>
                <div className="space-y-2 text-left">
                  <p className="text-gray-700"><strong>Duration:</strong> {formatTime(recordingState.duration)}</p>
                  <p className="text-gray-700"><strong>Selected Option:</strong> {selectedOption}</p>
                </div>
              </div>
              
              {audioData && (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                  <h3 className="text-xl font-bold text-indigo-800 mb-4">Listen to Your Response</h3>
                  <button
                    onClick={playRecording}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Play Recording
                  </button>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-600 text-left">{error}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={submitTask}
                  disabled={submissionLoading}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-indigo-400 disabled:to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center"
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
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Try Another Task
                </button>
              </div>
            </div>
          )}
        
          {/* Results Phase */}
          {currentPhase === 'results' && score && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`inline-block p-6 rounded-lg border-2 ${getScoreBackground(score.scores.overall_score)}`}>
                  <div className={`text-4xl font-bold ${getScoreColor(score.scores.overall_score)}`}>
                    {score.scores.overall_score}/12
                  </div>
                  <p className="text-gray-600 mt-2">Overall Score</p>
                </div>
              </div>
              
              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 text-left">Content</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.content_score)}`}>
                    {score.scores.content_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 text-left">Vocabulary</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.vocabulary_score)}`}>
                    {score.scores.vocabulary_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 text-left">Language Use</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.language_use_score)}`}>
                    {score.scores.language_use_score}/12
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 text-left">Task Fulfillment</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(score.scores.task_fulfillment_score)}`}>
                    {score.scores.task_fulfillment_score}/12
                  </div>
                </div>
              </div>
              
              {/* Feedback */}
              <div className="space-y-6">
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
                    <Mic className="w-5 h-5 mr-2" />
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

                {score.feedback.pronunciation_notes && (
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-xl font-bold text-orange-800 mb-4">Pronunciation Notes</h3>
                    <p className="text-gray-700 text-left">{score.feedback.pronunciation_notes}</p>
                  </div>
                )}
                
                {score.feedback.fluency_notes && (
                  <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                    <h3 className="text-xl font-bold text-pink-800 mb-4">Communication Notes</h3>
                    <p className="text-gray-700 text-left">{score.feedback.fluency_notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={loadTask}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingTask6;