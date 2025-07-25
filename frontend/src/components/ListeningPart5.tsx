import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Volume2, Play, Pause, Square, Video, Users } from 'lucide-react';
import { listeningApi, ListeningPart5 as ListeningPart5Type } from '../services/api';
import { ttsService } from '../services/textToSpeech';

interface ListeningPart5Props {
  onBackToDashboard: () => void;
}

interface UserAnswers {
  [questionId: string]: string;
}

const ListeningPart5: React.FC<ListeningPart5Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<ListeningPart5Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(4 * 60); // 4 minutes for questions
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [ttsSupported, setTtsSupported] = useState(true);
  
  // Sequential flow state
  const [currentPhase, setCurrentPhase] = useState<'video' | 'questions'>('video');
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [videoCompleted, setVideoCompleted] = useState(false);

  // Timer effect - only starts after video is watched
  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted && hasWatchedVideo && currentPhase === 'questions') {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && hasWatchedVideo) {
      handleSubmit();
    }
  }, [timeRemaining, isCompleted, hasWatchedVideo, currentPhase]);

  // Load task on component mount
  useEffect(() => {
    loadTask();
  }, []);

  // Check TTS support on component mount
  useEffect(() => {
    const checkTTSSupport = () => {
      try {
        if (!('speechSynthesis' in window)) {
          setTtsSupported(false);
          console.warn('Text-to-Speech not supported in this browser');
        }
      } catch (error) {
        setTtsSupported(false);
        console.error('Error checking TTS support:', error);
      }
    };
    
    checkTTSSupport();
  }, []);

  // Cleanup TTS on component unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listeningApi.generatePart5();
      
      if (response.success && response.task) {
        setTask(response.task);
        // Timer starts only when questions phase begins
      } else {
        setError(response.error_message || 'Failed to load listening task');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    if (!task) return { correct: 0, total: 0, percentage: 0 };
    
    const correct = task.questions.filter(question => 
      userAnswers[question.question_id] === question.correct_answer
    ).length;
    
    const total = task.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { correct, total, percentage };
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  const handleSubmit = () => {
    setIsCompleted(true);
    setShowResults(true);
    ttsService.stop();
  };

  const playVideoDiscussion = async () => {
    if (!task || !ttsSupported) return;
    
    try {
      setIsPlaying(true);
      setIsPaused(false);
      setPlaybackProgress(0);
      
      await ttsService.speak(task.discussion.transcript, {
        rate: 0.9,
        pitch: 1.0,
        volume: 0.8
      }, {
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          setHasWatchedVideo(true);
          setVideoCompleted(true);
        },
        onError: (error) => {
          console.error('TTS Error:', error);
          setIsPlaying(false);
        },
        onProgress: (progress) => setPlaybackProgress(progress)
      });
    } catch (error) {
      console.error('Error playing video discussion:', error);
      setIsPlaying(false);
    }
  };

  const pausePlayback = () => {
    if (ttsService.isSpeaking()) {
      ttsService.pause();
      setIsPaused(true);
    }
  };

  const resumePlayback = () => {
    if (ttsService.isPaused()) {
      ttsService.resume();
      setIsPaused(false);
    }
  };

  const stopPlayback = () => {
    ttsService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setPlaybackProgress(0);
  };

  const togglePlayback = () => {
    if (isPaused) {
      resumePlayback();
    } else if (isPlaying) {
      pausePlayback();
    } else {
      playVideoDiscussion();
    }
  };

  const proceedToQuestions = () => {
    if (hasWatchedVideo) {
      setCurrentPhase('questions');
      setTimeRemaining(4 * 60); // Start 4-minute timer for questions
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            Generating Listening Part 5
          </h2>
          <p className="text-gray-600 text-center">
            Creating a professional discussion for you...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            Error Loading Task
          </h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={loadTask}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onBackToDashboard}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            No Task Available
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Unable to load the listening task. Please try again.
          </p>
          <button
            onClick={onBackToDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={onBackToDashboard}
                className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  CELPIP Listening Part 5
                </h1>
                <p className="text-gray-600">Listening to a Discussion</p>
              </div>
              <div className="ml-6 flex items-center">
                <Video className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {task.difficulty_level.charAt(0).toUpperCase() + task.difficulty_level.slice(1)} Level
                </span>
                {!ttsSupported && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    TTS Not Supported
                  </span>
                )}
              </div>
              
              {currentPhase === 'questions' && (
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  timeRemaining <= 120 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Volume2 className="w-4 h-4 text-gray-600 mr-1" />
                <span className="text-sm text-gray-600">
                  1 Video Discussion
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-600 mr-1" />
                <span className="text-sm text-gray-600">
                  {task.discussion.speakers.length} Speakers
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-gray-600 mr-1" />
                <span className="text-sm text-gray-600">
                  {getAnsweredCount()} / {task.questions.length} Questions
                </span>
              </div>
            </div>
            
            {!showResults && currentPhase === 'questions' && (
              <button
                onClick={handleSubmit}
                disabled={getAnsweredCount() === 0}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  getAnsweredCount() > 0
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Test
              </button>
            )}
          </div>
        </div>

        {showResults ? (
          // Results section
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Listening Test Complete!
              </h2>
              
              {(() => {
                const score = calculateScore();
                return (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {score.percentage}%
                    </div>
                    <div className="text-lg text-gray-600">
                      {score.correct} out of {score.total} questions correct
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Question Review
              </h3>
              
              {task.questions.map((question, index) => {
                const userAnswer = userAnswers[question.question_id];
                const isCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div
                    key={question.question_id}
                    className={`border rounded-lg p-4 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 
                      userAnswer ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Question {index + 1}
                        </p>
                        <p className="font-medium text-gray-800">
                          {question.question_text}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' :
                        userAnswer ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isCorrect ? 'Correct' : userAnswer ? 'Incorrect' : 'Not Answered'}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Your answer:</p>
                      <div className={`p-3 rounded-lg border-2 ${
                        isCorrect ? 'bg-green-100 border-green-300' :
                        userAnswer ? 'bg-red-100 border-red-300' :
                        'bg-gray-100 border-gray-300'
                      }`}>
                        {userAnswer ? (
                          <span className="font-medium">
                            {userAnswer}) {question.options[question.options.findIndex((_, i) => 
                              String.fromCharCode(65 + i) === userAnswer
                            )]}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">No answer selected</span>
                        )}
                      </div>
                      
                      {!isCorrect && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Correct answer:</p>
                          <div className="p-3 rounded-lg bg-green-100 border-2 border-green-300">
                            <span className="font-medium">
                              {question.correct_answer}) {question.options[question.options.findIndex((_, i) => 
                                String.fromCharCode(65 + i) === question.correct_answer
                              )]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={onBackToDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          // Main test interface
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Discussion Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2 text-blue-600" />
                  Professional Discussion
                </h3>
                
                <div className="space-y-4">
                  <div className={`border rounded-lg p-4 transition-all ${
                    hasWatchedVideo ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {task.discussion.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {hasWatchedVideo && (
                          <div className="flex items-center text-green-600 text-xs">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Watched
                          </div>
                        )}
                        
                        {ttsSupported && (
                          <>
                            {isPlaying && (
                              <button
                                onClick={stopPlayback}
                                className="p-1 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                                title="Stop"
                              >
                                <Square className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={togglePlayback}
                              disabled={!ttsSupported || hasWatchedVideo}
                              className={`p-2 rounded-full transition-colors ${
                                !ttsSupported || hasWatchedVideo
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-blue-600 hover:bg-blue-700'
                              } text-white`}
                              title={
                                !ttsSupported ? 'Text-to-Speech not supported' : 
                                hasWatchedVideo ? 'Already watched - can only view once' :
                                'Play video discussion'
                              }
                            >
                              {isPlaying && !isPaused ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      <div>Duration: {task.discussion.duration_seconds}s</div>
                      <div>Setting: {task.discussion.setting}</div>
                      <div>Speakers: {task.discussion.speakers.join(', ')}</div>
                    </div>
                    
                    {(isPlaying || isPaused) && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all"
                            style={{ 
                              width: `${playbackProgress * 100}%` 
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                          <span>
                            {isPaused ? 'Paused' : isPlaying ? 'Playing...' : 'Ready'}
                          </span>
                          <span>
                            {Math.round(playbackProgress * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Global Audio Controls */}
                {ttsSupported && (isPlaying || isPaused) && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Video Controls
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (isPaused) {
                            resumePlayback();
                          } else {
                            pausePlayback();
                          }
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                      >
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        onClick={stopPlayback}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        Stop
                      </button>
                      <span className="text-sm text-blue-700 ml-2">
                        Playing Discussion
                      </span>
                    </div>
                  </div>
                )}

                {/* TTS Instructions */}
                {ttsSupported && !isPlaying && !isPaused && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <Video className="w-4 h-4 mr-2" />
                      Test Instructions
                    </h4>
                    <div className="text-sm text-green-700 space-y-2">
                      <p>• Watch the professional discussion carefully</p>
                      <p>• You can only watch it ONCE</p>
                      <p>• Answer 8 questions after the video</p>
                      <p>• You have 4 minutes to complete the questions</p>
                    </div>
                  </div>
                )}

                {/* TTS Not Supported Warning */}
                {!ttsSupported && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Video Not Available
                    </h4>
                    <p className="text-sm text-orange-700">
                      Video simulation is not supported in your browser. You can still read the discussion transcript 
                      in the development view and complete the questions. For the best experience, use Chrome, Firefox, 
                      Safari, or Edge.
                    </p>
                  </div>
                )}

                {/* Current discussion details */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Discussion Details</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {task.discussion.video_description}
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 mb-2">Key Points</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {task.discussion.key_points.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Show transcript for debugging/development (remove in production) */}
                  {(process.env.NODE_ENV === 'development' || !ttsSupported) && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Discussion Transcript {process.env.NODE_ENV === 'development' ? '(Dev Mode)' : '(Video Alternative)'}
                      </h4>
                      <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                        <div className="tts-transcript text-gray-700 whitespace-pre-line">
                          {task.discussion.transcript}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {currentPhase === 'video' || isPlaying || !hasWatchedVideo ? (
                  // Video Phase Instructions
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="bg-blue-50 p-4 rounded-full w-fit mx-auto mb-4">
                        <Video className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Watch the Professional Discussion
                      </h3>
                      <p className="text-gray-600">
                        {isPlaying ? 'Watching discussion video...' : 
                         hasWatchedVideo ? 'Discussion completed!' : 
                         'Click the play button to watch the professional discussion. You can only watch once!'}
                      </p>
                    </div>
                    
                    {isPlaying ? (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-center mb-2">
                          <Volume2 className="w-6 h-6 text-yellow-600 mr-2" />
                          <span className="text-yellow-800 font-medium">
                            Watching Professional Discussion...
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Listen carefully to all speakers - you can only watch this once!
                        </p>
                      </div>
                    ) : hasWatchedVideo ? (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-800 font-medium mb-4">
                          Discussion completed! Now answer the questions.
                        </p>
                        <button
                          onClick={proceedToQuestions}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Start Questions
                        </button>
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-800 mb-4">
                          Press play to begin the professional discussion video.
                        </p>
                        <p className="text-sm text-blue-600">
                          Remember: You can only watch the video once during the test.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Questions Phase
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        Questions for Discussion
                      </h3>
                      <div className="text-sm text-gray-600">
                        Select your answers from the dropdown menus
                      </div>
                    </div>
                    
                    <div className="text-left space-y-6">
                      {task.questions.map((question, index) => (
                        <div
                          key={question.question_id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="mb-4">
                            <div className="flex items-center mb-3">
                              <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                {index + 1}
                              </div>
                              <span className="text-sm text-gray-600">Question {index + 1}</span>
                            </div>
                            
                            {/* Display question text */}
                            <div className="mb-4">
                              <p className="text-gray-800 font-medium">
                                {question.question_text}
                              </p>
                            </div>
                          </div>
                          
                          {/* Dropdown for options */}
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select your answer:
                            </label>
                            <select
                              value={userAnswers[question.question_id] || ''}
                              onChange={(e) => handleAnswerSelect(question.question_id, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                              <option value="">-- Select an option --</option>
                              {question.options.map((option, optionIndex) => {
                                const optionLetter = String.fromCharCode(65 + optionIndex);
                                return (
                                  <option key={optionIndex} value={optionLetter}>
                                    {optionLetter}) {option}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningPart5;