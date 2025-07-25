import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, BookOpen } from 'lucide-react';
import { readingApi, ReadingTask2 as ReadingTask2Type } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReadingTask2Props {
  onBackToDashboard: () => void;
}

interface UserAnswers {
  [questionId: string]: string;
}

const ReadingTask2: React.FC<ReadingTask2Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<ReadingTask2Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(9 * 60); // 9 minutes in seconds
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
      const response = await readingApi.generateTask2();
      
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

  if (loading) {
    return (
      <div className="min-h-screen celpip-gradient-bg flex items-center justify-center">
        <div className="celpip-card p-8 text-center animate-fade-in max-w-md">
          <div className="bg-purple-50 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Reading Task 2</h2>
          <p className="text-gray-600 leading-relaxed">Generating your diagram and email completion task with authentic CELPIP format</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
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

  if (showResults) {
    return (
      <div className="min-h-screen celpip-gradient-bg py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="celpip-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="bg-green-50 p-4 rounded-full w-fit mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">Excellent Work!</h1>
              <p className="text-lg text-gray-600">Your CELPIP Reading Task 2 Results</p>
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
                  ⭐
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
                      <h3 className="font-medium">Question {index + 1}</h3>
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
                <h1 className="text-2xl font-bold text-gray-800">CELPIP Reading Task 2</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Passage */}
          <div className="lg:col-span-2 celpip-card p-4 md:p-6 lg:p-8 animate-fade-in">
            {/* Diagram Section */}
            {task.diagram_description && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Diagram Information</h3>
                </div>
                <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-200">
                  <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {task.diagram_description}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Email Section */}
            <div className="flex items-center mb-6">
              <div className="bg-purple-50 p-2 rounded-lg mr-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{task.passage.title}</h2>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base md:text-lg bg-gray-50 p-4 md:p-6 rounded-lg border-l-4 border-purple-400 text-left min-h-64 overflow-y-auto">
                {task.passage.content.replace(/____(\d+)____/g, '____')}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded mr-3">
                {task.passage.word_count} words
              </span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {task.passage.topic}
              </span>
            </div>
          </div>

          {/* Questions */}
          <div className="text-left celpip-card p-4 md:p-6 lg:p-8 animate-fade-in" style={{animationDelay: '200ms'}}>
            <div className="flex items-center mb-6">
              <div className="bg-purple-50 p-2 rounded-lg mr-3">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Questions ({task.questions.length} questions)
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              {task.questions.map((question, index) => (
                <div key={question.question_id} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-start mb-3">
                    <div className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 mr-2">
                          Multiple Choice
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
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-purple-400'
                      }`}
                    >
                      <option value="" disabled>
                        Select your answer...
                      </option>
                      {question.options.map(option => {
                        const optionLetter = option.split('.')[0];
                        return (
                          <option key={option} value={optionLetter}>
                            {option}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              ))}
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
  );
};

export default ReadingTask2;