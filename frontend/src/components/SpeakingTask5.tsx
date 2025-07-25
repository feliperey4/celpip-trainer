import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Play, Mic, Check, X } from 'lucide-react';
import { speakingApi, SpeakingTask5 as SpeakingTask5Data, SpeakingTask5Score } from '../services/api';
import AudioRecordingService, { RecordingState } from '../services/audioRecording';
import AudioPlaybackService from '../services/audioPlayback';

interface SpeakingTask5Props {
  onBackToDashboard: () => void;
}

interface TimerState {
  phase: 'selection' | 'preparation' | 'speaking' | 'completed';
  timeRemaining: number;
  isActive: boolean;
}

interface MicrophoneState {
  hasPermission: boolean;
  isRequesting: boolean;
  error?: string;
}

const SpeakingTask5: React.FC<SpeakingTask5Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<SpeakingTask5Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'instructions' | 'selection' | 'preparation' | 'speaking' | 'review' | 'results'>('instructions');
  
  // Task 5 specific state
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [selectionTimeUsed, setSelectionTimeUsed] = useState<number>(0);
  const [preparationTimeUsed, setPreparationTimeUsed] = useState<number>(0);
  
  // Timer state
  const [timer, setTimer] = useState<TimerState>({
    phase: 'selection',
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
  const [score, setScore] = useState<SpeakingTask5Score | null>(null);
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
        const response = await speakingApi.generateTask5();
        
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
    if (timer.phase === 'selection') {
      // Move to preparation phase
      setSelectionTimeUsed(60);
      setCurrentPhase('preparation');
      setTimer({
        phase: 'preparation',
        timeRemaining: 60,
        isActive: true
      });
    } else if (timer.phase === 'preparation') {
      // Move to speaking phase
      setPreparationTimeUsed(60);
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
  
  const startSelection = async () => {
    try {
      await requestMicrophonePermission();
      setCurrentPhase('selection');
      setTimer({
        phase: 'selection',
        timeRemaining: 60,
        isActive: true
      });
    } catch (err) {
      setError('Microphone permission required to continue');
    }
  };
  
  const confirmSelection = () => {
    if (!selectedOption) {
      setError('Please select an option before continuing');
      return;
    }
    
    // Record selection time used
    const timeUsed = 60 - timer.timeRemaining;
    setSelectionTimeUsed(timeUsed);
    
    // Move to preparation phase
    setCurrentPhase('preparation');
    setTimer({
      phase: 'preparation',
      timeRemaining: 60,
      isActive: true
    });
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
    if (!task || !recordedAudioBlob || !selectedOption) {
      setSubmissionError('Missing required data for submission');
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
          selected_option: selectedOption,
          audio: {
            audio_data: audioData,
            audio_format: 'webm',
            duration_seconds: recordingState.duration
          },
          task_context: task,
          selection_time_used: selectionTimeUsed,
          preparation_time_used: preparationTimeUsed,
          speaking_time_used: recordingState.duration,
          submission_timestamp: new Date().toISOString()
        };
        
        try {
          const response = await speakingApi.scoreTask5(submission);
          
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Speaking Task 5</h2>
          <p className="text-gray-600 text-left">Generating your personalized CELPIP speaking test with comparison scenarios</p>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
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
                <h1 className="text-2xl font-bold text-gray-800">Speaking Task 5</h1>
                <p className="text-gray-600">Comparing and Persuading</p>
              </div>
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">60s select + 60s prep + 60s speak</span>
            </div>
          </div>
        </div>
        
        {/* Instructions Phase */}
        {currentPhase === 'instructions' && task && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Task Instructions</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Your Task:</h3>
                <p className="text-gray-700 text-left">{task.instructions.task_description}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Scenario:</h3>
                <p className="text-gray-700 text-left">{task.scenario.context}</p>
                <p className="text-gray-700 text-left mt-2">
                  <strong>Decision Maker:</strong> {task.scenario.decision_maker}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Three Phases:</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                    <span className="text-gray-700">Selection: 60 seconds to choose your option</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                    <span className="text-gray-700">Preparation: 60 seconds to prepare your arguments</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                    <span className="text-gray-700">Speaking: 60 seconds to persuade and compare</span>
                  </div>
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
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-600 text-left">{error}</p>
                </div>
              )}
              
              <button
                onClick={startSelection}
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
                    Start Selection Phase
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Selection Phase */}
        {currentPhase === 'selection' && task && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="text-center mb-6">
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Selection Phase</h2>
                <p className="text-lg text-left">Choose the option you want to recommend and persuade about</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatTime(timer.timeRemaining)}
                </div>
                <p className="text-gray-600 text-left">Time remaining</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Option A */}
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOption === 'A' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption('A')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Option A</h3>
                  {selectedOption === 'A' && (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {task.option_a_image && (
                  <div className="mb-4">
                    <img 
                      src={`data:image/png;base64,${task.option_a_image}`}
                      alt="Option A"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <h4 className="font-semibold text-gray-800 mb-2">{task.scenario.option_a.title}</h4>
                <p className="text-gray-600 text-sm mb-3 text-left">{task.scenario.option_a.description}</p>
                
                {task.scenario.option_a.price && (
                  <p className="text-purple-600 font-bold mb-2">{task.scenario.option_a.price}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-1">Pros:</h5>
                    <ul className="text-left list-disc list-inside space-y-1 text-gray-600">
                      {task.scenario.option_a.pros.slice(0, 3).map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-700 mb-1">Cons:</h5>
                    <ul className="text-left list-disc list-inside space-y-1 text-gray-600">
                      {task.scenario.option_a.cons.slice(0, 3).map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Option B */}
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOption === 'B' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption('B')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Option B</h3>
                  {selectedOption === 'B' && (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {task.option_b_image && (
                  <div className="mb-4">
                    <img 
                      src={`data:image/png;base64,${task.option_b_image}`}
                      alt="Option B"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <h4 className="font-semibold text-gray-800 mb-2">{task.scenario.option_b.title}</h4>
                <p className="text-gray-600 text-sm mb-3 text-left">{task.scenario.option_b.description}</p>
                
                {task.scenario.option_b.price && (
                  <p className="text-purple-600 font-bold mb-2">{task.scenario.option_b.price}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-1">Pros:</h5>
                    <ul className="text-left list-disc list-inside space-y-1 text-gray-600">
                      {task.scenario.option_b.pros.slice(0, 3).map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-700 mb-1">Cons:</h5>
                    <ul className="text-left list-disc list-inside space-y-1 text-gray-600">
                      {task.scenario.option_b.cons.slice(0, 3).map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={confirmSelection}
                disabled={!selectedOption}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Selection and Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Preparation Phase */}
        {currentPhase === 'preparation' && task && selectedOption && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Preparation Phase</h2>
                <p className="text-lg text-left">Prepare your persuasive arguments for Option {selectedOption}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatTime(timer.timeRemaining)}
                </div>
                <p className="text-gray-600 text-left">Time remaining</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-4">Your Selected Option: {selectedOption}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {selectedOption === 'A' ? task.scenario.option_a.title : task.scenario.option_b.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 text-left">
                      {selectedOption === 'A' ? task.scenario.option_a.description : task.scenario.option_b.description}
                    </p>
                    
                    <div className="text-sm text-left">
                      <h5 className="font-semibold text-green-700 mb-2">Key Arguments:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {(selectedOption === 'A' ? task.scenario.option_a.pros : task.scenario.option_b.pros).map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-2">Think about:</h5>
                    <ul className="text-left list-disc list-inside space-y-1 text-gray-600 text-sm">
                      <li>Why this option is better than the other</li>
                      <li>How it meets the decision maker's needs</li>
                      <li>What specific benefits it offers</li>
                      <li>How to address potential concerns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Speaking Phase */}
        {currentPhase === 'speaking' && task && selectedOption && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="text-center">
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Speaking Phase</h2>
                <p className="text-lg text-left">Persuade the decision maker to choose Option {selectedOption}</p>
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
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Remember to:</h3>
                <ul className="text-left list-disc list-inside space-y-1 text-gray-600 text-sm">
                  <li>Compare both options fairly</li>
                  <li>Explain why your choice is better</li>
                  <li>Use persuasive language</li>
                  <li>Address the decision maker directly</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Phase */}
        {currentPhase === 'review' && task && selectedOption && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Review Your Response</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Task Summary:</h3>
                <p className="text-gray-700 text-left">Selected Option: {selectedOption}</p>
                <p className="text-gray-700 text-left">Speaking Duration: {formatTime(recordingState.duration)}</p>
                <p className="text-gray-700 text-left">Task: Comparing and persuading about your chosen option</p>
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
              
              {/* Task 5 Specific Analysis */}
              {score.selected_option_analysis && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Option Selection Analysis</h3>
                  <p className="text-gray-700 text-left">{score.selected_option_analysis}</p>
                </div>
              )}
              
              {score.persuasion_effectiveness && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Persuasion Effectiveness</h3>
                  <p className="text-gray-700 text-left">{score.persuasion_effectiveness}</p>
                </div>
              )}
              
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

export default SpeakingTask5;