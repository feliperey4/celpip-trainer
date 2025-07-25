import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, Headphones, Volume2, Play, Pause, Square, BookOpen } from 'lucide-react';
import { listeningApi, ListeningPart3 as ListeningPart3Type } from '../services/api';
import { ttsService } from '../services/textToSpeech';

interface ListeningPart3Props {
  onBackToDashboard: () => void;
}

interface UserAnswers {
  [questionId: string]: string;
}

const ListeningPart3: React.FC<ListeningPart3Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<ListeningPart3Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [ttsSupported, setTtsSupported] = useState(true);
  
  // Sequential flow state
  const [currentPhase, setCurrentPhase] = useState<'conversation' | 'questions'>('conversation');
  const [hasPlayedConversation, setHasPlayedConversation] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [conversationCompleted, setConversationCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, isCompleted]);

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
      const response = await listeningApi.generatePart3();
      
      if (response.success && response.task) {
        setTask(response.task);
        setTimeRemaining(response.task.time_limit_minutes * 60);
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

  const playConversation = async () => {
    if (!task || !ttsSupported) return;
    
    try {
      setIsPlaying(true);
      setIsPaused(false);
      setPlaybackProgress(0);
      
      await ttsService.speak(task.conversation.transcript, {
        rate: 0.9,
        pitch: 1.0,
        volume: 0.8
      }, {
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          setHasPlayedConversation(true);
          setConversationCompleted(true);
        },
        onError: (error) => {
          console.error('TTS Error:', error);
          setIsPlaying(false);
        },
        onProgress: (progress) => setPlaybackProgress(progress)
      });
    } catch (error) {
      console.error('Error playing conversation:', error);
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
      playConversation();
    }
  };

  const proceedToQuestions = () => {
    if (hasPlayedConversation) {
      setCurrentPhase('questions');
    }
  };

  const speakQuestion = async (questionText: string) => {
    if (!ttsSupported) return;
    
    try {
      ttsService.stop();
      await ttsService.speak(questionText, {
        rate: 0.8,
        pitch: 1.0,
        volume: 0.9
      }, {
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: (error) => {
          console.error('TTS Error:', error);
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error speaking question:', error);
      setIsPlaying(false);
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
            Generating Listening Part 3
          </h2>
          <p className="text-gray-600 text-center">
            Creating an informational conversation for you...
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
                  CELPIP Listening Part 3
                </h1>
                <p className="text-gray-600">Listening for Information</p>
              </div>
              <div className="ml-6 flex items-center">
                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {task.difficulty_level.charAt(0).toUpperCase() + task.difficulty_level.slice(1)} Level
                </span>
                {!ttsSupported && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    TTS Not Supported
                  </span>
                )}
              </div>
              
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                timeRemaining <= 120 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Volume2 className="w-4 h-4 text-gray-600 mr-1" />
                <span className="text-sm text-gray-600">
                  1 Informational Conversation
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-gray-600 mr-1" />
                <span className="text-sm text-gray-600">
                  {getAnsweredCount()} / {task.questions.length} Questions
                </span>
              </div>
            </div>
            
            {!showResults && (
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
                    
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optionIndex) => {
                        const optionLetter = String.fromCharCode(65 + optionIndex);
                        const isUserAnswer = userAnswer === optionLetter;
                        const isCorrectAnswer = question.correct_answer === optionLetter;
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded ${
                              isCorrectAnswer ? 'bg-green-100 border-2 border-green-300' :
                              isUserAnswer ? 'bg-red-100 border-2 border-red-300' :
                              'bg-white border border-gray-200'
                            }`}
                          >
                            {option}
                          </div>
                        );
                      })}
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
            {/* Conversation Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Informational Interview
                </h3>
                
                <div className="space-y-4">
                  <div className={`border rounded-lg p-4 transition-all ${
                    hasPlayedConversation ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {task.conversation.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {hasPlayedConversation && (
                          <div className="flex items-center text-green-600 text-xs">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Played
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
                              disabled={!ttsSupported || hasPlayedConversation}
                              className={`p-2 rounded-full transition-colors ${
                                !ttsSupported || hasPlayedConversation
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-blue-600 hover:bg-blue-700'
                              } text-white`}
                              title={
                                !ttsSupported ? 'Text-to-Speech not supported' : 
                                hasPlayedConversation ? 'Already played - can only listen once' :
                                'Play conversation'
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
                      <div>Duration: {task.conversation.duration_seconds}s</div>
                      <div>Speakers: {task.conversation.speakers.join(', ')}</div>
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
                      Audio Controls
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
                        Playing Informational Interview
                      </span>
                    </div>
                  </div>
                )}

                {/* TTS Instructions */}
                {ttsSupported && !isPlaying && !isPaused && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <Headphones className="w-4 h-4 mr-2" />
                      Test Instructions
                    </h4>
                    <div className="text-sm text-green-700 space-y-2">
                      <p>• Listen to the informational conversation carefully</p>
                      <p>• You can only listen to it ONCE</p>
                      <p>• Answer 6 questions after the conversation</p>
                      <p>• Questions can be read aloud by clicking 🔊</p>
                    </div>
                  </div>
                )}

                {/* TTS Not Supported Warning */}
                {!ttsSupported && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Audio Not Available
                    </h4>
                    <p className="text-sm text-orange-700">
                      Text-to-Speech is not supported in your browser. You can still read the conversation transcript 
                      in the development view and complete the questions. For the best experience, use Chrome, Firefox, 
                      Safari, or Edge.
                    </p>
                  </div>
                )}

                {/* Current conversation details */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Audio Description</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {task.conversation.audio_description}
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 mb-2">Scenario</h4>
                  <p className="text-sm text-gray-700">
                    {task.conversation.scenario}
                  </p>

                  {/* Show transcript for debugging/development (remove in production) */}
                  {(process.env.NODE_ENV === 'development' || !ttsSupported) && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Transcript {process.env.NODE_ENV === 'development' ? '(Dev Mode)' : '(Audio Alternative)'}
                      </h4>
                      <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
                        <div className="tts-transcript text-gray-700">
                          {task.conversation.transcript}
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
                {currentPhase === 'conversation' || isPlaying || !hasPlayedConversation ? (
                  // Conversation Phase Instructions
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="bg-blue-50 p-4 rounded-full w-fit mx-auto mb-4">
                        <BookOpen className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Listen to the Informational Interview
                      </h3>
                      <p className="text-gray-600">
                        {isPlaying ? 'Listening to conversation...' : 
                         hasPlayedConversation ? 'Conversation completed!' : 
                         'Click the play button to hear the informational conversation. You can only listen once!'}
                      </p>
                    </div>
                    
                    {isPlaying ? (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-center mb-2">
                          <Volume2 className="w-6 h-6 text-yellow-600 mr-2" />
                          <span className="text-yellow-800 font-medium">
                            Playing Informational Interview...
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Listen carefully - you can only hear this once!
                        </p>
                      </div>
                    ) : hasPlayedConversation ? (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-800 font-medium mb-4">
                          Conversation completed! Now answer the questions.
                        </p>
                        <button
                          onClick={proceedToQuestions}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          View Questions
                        </button>
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-800 mb-4">
                          Press play to begin the informational interview.
                        </p>
                        <p className="text-sm text-blue-600">
                          Remember: You can only listen to the conversation once during the test.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Questions Phase
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        Questions for Informational Interview
                      </h3>
                      {ttsSupported && (
                        <div className="text-sm text-gray-600">
                          <Volume2 className="w-4 h-4 inline mr-1" />
                          Click 🔊 to hear each question
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {task.questions.map((question, index) => (
                        <div
                          key={question.question_id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                  {index + 1}
                                </div>
                                <span className="text-sm text-gray-600">Question {index + 1}</span>
                              </div>
                              {ttsSupported && (
                                <button
                                  onClick={() => speakQuestion(question.question_text)}
                                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                                  title="Listen to question"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Show options */}
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => {
                              const optionLetter = String.fromCharCode(65 + optionIndex);
                              const isSelected = userAnswers[question.question_id] === optionLetter;
                              
                              return (
                                <label
                                  key={optionIndex}
                                  className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'border-blue-400 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={question.question_id}
                                    value={optionLetter}
                                    checked={isSelected}
                                    onChange={() => handleAnswerSelect(question.question_id, optionLetter)}
                                    className="mt-1 mr-3"
                                  />
                                  <span className="flex-1 text-gray-700">{option}</span>
                                </label>
                              );
                            })}
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

export default ListeningPart3;