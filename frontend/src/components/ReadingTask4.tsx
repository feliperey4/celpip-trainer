import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, BookOpen, MessageSquare } from 'lucide-react';
import { readingApi, ReadingTask4 as ReadingTask4Type } from '../services/api';

interface ReadingTask4Props {
  onBackToDashboard: () => void;
}

interface UserAnswers {
  [questionId: string]: string;
}

const ReadingTask4: React.FC<ReadingTask4Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<ReadingTask4Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(13 * 60); // 13 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await readingApi.generateTask4();
      
      if (response.success && response.task) {
        setTask(response.task);
        setTimeRemaining(response.task.time_limit_minutes * 60);
      } else {
        setError(response.error_message || 'Failed to load reading task');
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

  const handleSubmit = () => {
    setIsCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!task) return { correct: 0, total: 0, percentage: 0 };
    
    let correct = 0;
    task.questions.forEach(question => {
      if (userAnswers[question.question_id] === question.correct_answer) {
        correct++;
      }
    });
    
    const total = task.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    return { correct, total, percentage };
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  const getArticleQuestions = () => {
    return task?.questions.filter(q => q.question_type === 'article') || [];
  };

  const getCommentQuestions = () => {
    return task?.questions.filter(q => q.question_type === 'comment').sort((a, b) => {
      return (a.blank_position || 0) - (b.blank_position || 0);
    }) || [];
  };

  // Helper function to render comment with blanks (unused but kept for potential future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderCommentWithBlanks = () => {
    if (!task) return '';
    
    let commentContent = task.passage.comment_content;
    const commentQuestions = getCommentQuestions();
    
    // Replace blanks with dropdowns
    commentQuestions.forEach((question, index) => {
      const blankPattern = new RegExp(`_____(${question.blank_position})`, 'g');
      const dropdownHtml = `<select data-question-id="${question.question_id}" class="comment-dropdown">
        <option value="">Select...</option>
        ${question.options?.map(option => `<option value="${option.charAt(0)}">${option}</option>`).join('')}
      </select>`;
      commentContent = commentContent.replace(blankPattern, dropdownHtml);
    });
    
    return commentContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen celpip-gradient-bg flex items-center justify-center">
        <div className="celpip-card p-8 text-center animate-fade-in max-w-md">
          <div className="bg-purple-50 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Reading Task 4</h2>
          <p className="text-gray-600 leading-relaxed">Generating your viewpoints article with authentic CELPIP format</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '80%'}}></div>
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
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadTask}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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

  const score = calculateScore();
  const articleQuestions = getArticleQuestions();
  const commentQuestions = getCommentQuestions();

  if (showResults) {
    return (
      <div className="min-h-screen celpip-gradient-bg py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="celpip-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="bg-green-50 p-4 rounded-full w-fit mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">Excellent Analysis!</h1>
              <p className="text-lg text-gray-600">Your CELPIP Reading Task 4 Results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 transform hover:scale-105 transition-all">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {score.correct}
                </div>
                <h3 className="text-3xl font-bold text-purple-600 mb-1">{score.correct}/{score.total}</h3>
                <p className="text-gray-700 font-medium">Questions Correct</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 transform hover:scale-105 transition-all">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  %
                </div>
                <h3 className="text-3xl font-bold text-green-600 mb-1">{score.percentage}%</h3>
                <p className="text-gray-700 font-medium">Overall Score</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform hover:scale-105 transition-all">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  🗣️
                </div>
                <h3 className="text-3xl font-bold text-blue-600 mb-1">{task.difficulty_level}</h3>
                <p className="text-gray-700 font-medium">Difficulty Level</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Detailed Review</h2>
              </div>
              {task.questions.map((question, index) => {
                const userAnswer = userAnswers[question.question_id];
                const isCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div key={question.question_id} className="celpip-question-card p-6 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">
                        {question.question_type === 'article' ? 'Article' : 'Comment'} Question {index + 1}
                      </h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{question.question_text}</p>
                    <p className="text-sm text-gray-600">
                      Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {userAnswer || 'Not answered'}
                      </span>
                    </p>
                    <p className="text-sm text-green-600">
                      Correct answer: {question.correct_answer}
                    </p>
                    {question.explanation && (
                      <p className="text-sm text-gray-500 mt-1">{question.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={loadTask}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Try Another Task
              </button>
              <button
                onClick={onBackToDashboard}
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen celpip-gradient-bg">
      {/* Header */}
      <div className="celpip-card mx-4 mt-4 border-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={onBackToDashboard}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                <div className="bg-gray-100 p-2 rounded-lg mr-2">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Dashboard
              </button>
              <div className="flex items-center">
                <div className="bg-purple-50 p-2 rounded-lg mr-3">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">CELPIP Reading Task 4</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="bg-gray-50 px-3 sm:px-4 py-2 rounded-lg border">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                  <span className={`font-mono text-sm sm:text-lg font-bold ${
                    timeRemaining < 120 ? 'celpip-timer-warning' : 'text-gray-700'
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">Time Left</p>
              </div>
              
              <div className="bg-purple-50 px-3 sm:px-4 py-2 rounded-lg border border-purple-200">
                <div className="text-sm sm:text-lg font-bold text-purple-600">
                  {getAnsweredCount()}/{task.questions.length}
                </div>
                <p className="text-xs text-purple-600 text-center">Answered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Article and Comment - 3/5 width */}
          <div className="lg:col-span-3 space-y-6">
            {/* News Article */}
            <div className="celpip-card p-4 md:p-6 lg:p-8 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{task.passage.title}</h2>
              </div>
              
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg border-l-4 border-blue-400 overflow-y-auto max-h-[400px]">
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed text-left whitespace-pre-wrap">
                    {task.passage.article_content}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded mr-3">
                  News Article
                </span>
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {task.passage.topic}
                </span>
              </div>
            </div>

            {/* Reader's Comment */}
            <div className="celpip-card p-4 md:p-6 lg:p-8 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="bg-orange-50 p-2 rounded-lg mr-3">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Reader's Comment</h2>
              </div>
              
              <div className="bg-orange-50 p-4 md:p-6 rounded-lg border-l-4 border-orange-400">
                <div className="text-gray-700 leading-relaxed text-left">
                  {(() => {
                    let commentContent = task.passage.comment_content;
                    
                    // Replace each blank with a dropdown
                    commentQuestions.forEach((question) => {
                      const blankPattern = new RegExp(`_____(${question.blank_position})`, 'g');
                      const dropdownId = `dropdown-${question.question_id}`;
                      commentContent = commentContent.replace(blankPattern, `__DROPDOWN_${dropdownId}__`);
                    });
                    
                    // Split by dropdown markers and render
                    const parts = commentContent.split(/__DROPDOWN_(.+?)__/);
                    
                    return parts.map((part, index) => {
                      if (part.startsWith('dropdown-')) {
                        const questionId = part.substring(9); // Remove 'dropdown-' prefix
                        const question = commentQuestions.find(q => q.question_id === questionId);
                        if (!question) return null;
                        
                        return (
                          <select
                            key={index}
                            value={userAnswers[question.question_id] || ''}
                            onChange={(e) => handleAnswerSelect(question.question_id, e.target.value)}
                            className="mx-1 px-2 py-1 border-2 rounded border-orange-300 bg-white font-medium text-orange-800 text-sm"
                          >
                            <option value="">___({question.blank_position})</option>
                            {question.options?.map(option => (
                              <option key={option} value={option.charAt(0)}>
                                {option}
                              </option>
                            ))}
                          </select>
                        );
                      }
                      return <span key={index}>{part}</span>;
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Questions - 2/5 width */}
          <div className="text-left lg:col-span-2 celpip-card p-4 md:p-6 lg:p-8 animate-fade-in" style={{animationDelay: '200ms'}}>
            <div className="flex items-center mb-6">
              <div className="bg-purple-50 p-2 rounded-lg mr-3">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Reading for Viewpoints
              </h2>
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                <p className="text-sm text-blue-700">
                  Answer all questions about the article viewpoints and complete the reader's comment using the dropdowns.
                </p>
              </div>
              
              {/* Questions Section */}
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {/* Article Questions (1-5) */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-800">Article Questions (1-5)</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {articleQuestions.map((question, index) => (
                      <div key={question.question_id} className="border border-blue-300 rounded-lg p-3 bg-white">
                        <div className="flex items-start mb-3">
                          <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 text-sm font-medium leading-relaxed">
                              {question.question_text}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-9">
                          <select
                            value={userAnswers[question.question_id] || ''}
                            onChange={(e) => handleAnswerSelect(question.question_id, e.target.value)}
                            className={`w-full p-3 border-2 rounded-lg font-medium transition-all ${
                              userAnswers[question.question_id]
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400 text-gray-700'
                            }`}
                          >
                            <option value="">Select answer...</option>
                            {question.options?.map(option => (
                              <option key={option} value={option.charAt(0)}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comment Questions (6-10) */}
                <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <MessageSquare className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-800">Comment Questions (6-10)</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {commentQuestions.map((question, index) => (
                      <div key={question.question_id} className="border border-orange-300 rounded-lg p-3 bg-white">
                        <div className="flex items-start mb-3">
                          <div className="bg-orange-100 text-orange-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                            {articleQuestions.length + index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 mr-2">
                                Blank {question.blank_position}
                              </span>
                            </div>
                            <p className="text-gray-800 text-sm font-medium leading-relaxed">
                              {question.question_text}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-9">
                          <select
                            value={userAnswers[question.question_id] || ''}
                            onChange={(e) => handleAnswerSelect(question.question_id, e.target.value)}
                            className={`w-full p-3 border-2 rounded-lg font-medium transition-all ${
                              userAnswers[question.question_id]
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-300 hover:border-orange-400 text-gray-700'
                            }`}
                          >
                            <option value="">Select option for blank {question.blank_position}...</option>
                            {question.options?.map(option => (
                              <option key={option} value={option.charAt(0)}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-600">
                    Progress: <span className="font-semibold text-purple-600">{getAnsweredCount()}/{task.questions.length}</span> answered
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(getAnsweredCount() / task.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={getAnsweredCount() < task.questions.length}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {getAnsweredCount() < task.questions.length
                  ? `Answer ${task.questions.length - getAnsweredCount()} more questions to submit`
                  : '🎯 Submit Test'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTask4;