import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Loader, PenTool, FileText, Send, Target, Star, TrendingUp, BookOpen, Award } from 'lucide-react';
import { writingApi, WritingTask1 as WritingTask1Type, WritingTask1Review } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WritingTask1Props {
  onBackToDashboard: () => void;
}

const WritingTask1: React.FC<WritingTask1Props> = ({ onBackToDashboard }) => {
  const [task, setTask] = useState<WritingTask1Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userText, setUserText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(27 * 60); // 27 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [review, setReview] = useState<WritingTask1Review | null>(null);
  const [reviewing, setReviewing] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isCompleted]);

  // Load task on component mount
  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await writingApi.generateTask1();
      
      if (response.success && response.task) {
        setTask(response.task);
        setTimeRemaining(response.task.time_limit_minutes * 60);
        setUserText(''); // Reset user text
        setIsCompleted(false);
        setShowResults(false);
        setReview(null); // Reset review
        setReviewing(false); // Reset reviewing state
      } else {
        setError(response.error_message || 'Failed to load writing task');
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

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!task || !userText.trim()) return;
    
    setIsCompleted(true);
    setReviewing(true);
    
    try {
      const reviewResponse = await writingApi.reviewTask1({
        task_id: task.task_id,
        user_text: userText,
        scenario: task.scenario
      });
      
      if (reviewResponse.success && reviewResponse.review) {
        setReview(reviewResponse.review);
        setShowResults(true);
      } else {
        setError(reviewResponse.error_message || 'Failed to review your submission');
      }
    } catch (err) {
      setError('Failed to review your submission. Please try again.');
      console.error('Error reviewing submission:', err);
    } finally {
      setReviewing(false);
    }
  };

  const getWordCount = () => {
    return userText.trim() ? userText.trim().split(/\s+/).length : 0;
  };

  const isWordCountValid = () => {
    const wordCount = getWordCount();
    return task ? wordCount >= task.word_count_min && wordCount <= task.word_count_max : false;
  };

  const getWordCountStatus = () => {
    if (!task) return 'text-gray-600';
    const wordCount = getWordCount();
    if (wordCount < task.word_count_min) return 'text-red-600';
    if (wordCount > task.word_count_max) return 'text-red-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen celpip-gradient-bg flex items-center justify-center">
        <div className="celpip-card p-8 text-center animate-fade-in max-w-md">
          <div className="bg-purple-50 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Writing Task 1</h2>
          <p className="text-gray-600 leading-relaxed">Generating your personalized CELPIP writing scenario with authentic Canadian content</p>
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

  if (reviewing) {
    return (
      <div className="min-h-screen celpip-gradient-bg flex items-center justify-center">
        <div className="celpip-card p-8 text-center animate-fade-in max-w-md">
          <div className="bg-blue-50 p-4 rounded-full w-fit mx-auto mb-6">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Reviewing Your Submission</h2>
          <p className="text-gray-600 leading-relaxed">Our AI expert is analyzing your writing using official CELPIP criteria...</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (showResults && review) {
    const getScoreColor = (score: number) => {
      if (score >= 10) return 'text-green-600';
      if (score >= 7) return 'text-blue-600';
      if (score >= 5) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
      if (score >= 10) return 'bg-green-500';
      if (score >= 7) return 'bg-blue-500';
      if (score >= 5) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    const getScoreLabel = (score: number) => {
      if (score >= 11) return 'Excellent';
      if (score >= 9) return 'Very Good';
      if (score >= 7) return 'Good';
      if (score >= 5) return 'Adequate';
      if (score >= 3) return 'Developing';
      return 'Inadequate';
    };

    return (
      <div className="min-h-screen celpip-gradient-bg py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="celpip-card p-8 animate-fade-in">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-full w-fit mx-auto mb-6">
                <Award className="w-16 h-16 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">CELPIP Writing Assessment</h1>
              <p className="text-lg text-gray-600">Comprehensive Analysis & Feedback</p>
            </div>

            {/* Overall Score Section */}
            <div className="text-left grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="col-span-1 md:col-span-2 text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className={`text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold ${getScoreBgColor(review.overall_score)}`}>
                  {review.overall_score}
                </div>
                <h3 className={`text-4xl font-bold mb-2 ${getScoreColor(review.overall_score)}`}>
                  {review.overall_score}/12
                </h3>
                <p className="text-xl font-semibold text-gray-800 mb-1">{getScoreLabel(review.overall_score)}</p>
                <p className="text-gray-600">Overall CELPIP Score</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className={`text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold ${review.is_word_count_appropriate ? 'bg-green-500' : 'bg-red-500'}`}>
                  {review.word_count}
                </div>
                <h3 className={`text-2xl font-bold mb-1 ${review.is_word_count_appropriate ? 'text-green-600' : 'text-red-600'}`}>
                  {review.word_count}
                </h3>
                <p className="text-gray-700 font-medium">Words</p>
                <p className="text-sm text-gray-500">Target: 150-200</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  ★
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-1">{review.key_achievements.length}</h3>
                <p className="text-gray-700 font-medium">Key Strengths</p>
              </div>
            </div>

            {/* Detailed Scores Section */}
            <div className="text_left grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { name: 'Content & Coherence', data: review.content_coherence, icon: <BookOpen className="w-6 h-6" /> },
                { name: 'Vocabulary', data: review.vocabulary, icon: <FileText className="w-6 h-6" /> },
                { name: 'Readability', data: review.readability, icon: <TrendingUp className="w-6 h-6" /> },
                { name: 'Task Fulfillment', data: review.task_fulfillment, icon: <Target className="w-6 h-6" /> }
              ].map((criterion, index) => (
                <div key={index} className="celpip-question-card p-6 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        {criterion.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{criterion.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(criterion.data.score)}`}>
                        {criterion.data.score}/12
                      </div>
                      <div className="text-sm text-gray-500">{getScoreLabel(criterion.data.score)}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{criterion.data.feedback}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Strengths:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {criterion.data.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Areas to Improve:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {criterion.data.areas_for_improvement.map((area, i) => (
                          <li key={i} className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Feedback Section */}
            <div className="text-left space-y-6 mb-8">
              <div className="celpip-question-card p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Overall Feedback</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.overall_feedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="celpip-question-card p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-50 p-2 rounded-lg mr-3">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Key Achievements</h3>
                  </div>
                  <ul className="space-y-2">
                    {review.key_achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="celpip-question-card p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-50 p-2 rounded-lg mr-3">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Priority Improvements</h3>
                  </div>
                  <ul className="space-y-2">
                    {review.priority_improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="celpip-question-card p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-50 p-2 rounded-lg mr-3">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Improvement Strategies</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {review.improvement_strategies.map((strategy, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-2">
                          {i + 1}
                        </div>
                        <span className="font-medium text-gray-800">Strategy {i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{strategy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-5">
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
                  <PenTool className="w-5 h-5 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">CELPIP Writing Task 1</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="bg-gray-50 px-3 sm:px-4 py-2 rounded-lg border">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                  <span className={`font-mono text-sm sm:text-lg font-bold ${
                    timeRemaining < 300 ? 'celpip-timer-warning' : 'text-gray-700'
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">Time Left</p>
              </div>
              
              <div className="bg-purple-50 px-3 sm:px-4 py-2 rounded-lg border border-purple-200">
                <div className={`text-sm sm:text-lg font-bold ${getWordCountStatus()}`}>
                  {getWordCount()}/{task.word_count_min}-{task.word_count_max}
                </div>
                <p className="text-xs text-purple-600 text-center">Words</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Task Instructions - 2/5 width */}
          <div className="lg:col-span-2 celpip-card p-4 md:p-6 lg:p-8 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Writing Scenario</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-blue-800 mb-2">{task.scenario.title}</h3>
                <div className="text-gray-700 leading-relaxed markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {task.scenario.context}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Task Details:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Recipient:</span>
                      <p className="text-gray-800">{task.scenario.recipient}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Purpose:</span>
                      <p className="text-gray-800">{task.scenario.purpose}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Tone:</span>
                      <p className="text-gray-800">{task.scenario.tone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Relationship:</span>
                      <p className="text-gray-800">{task.scenario.relationship}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Key Points to Address:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {task.scenario.key_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
                  <p className="text-sm text-gray-700">{task.instructions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Writing Area - 3/5 width */}
          <div className="lg:col-span-3 celpip-card p-4 md:p-6 lg:p-8 animate-fade-in" style={{animationDelay: '200ms'}}>
            <div className="flex items-center mb-6">
              <div className="bg-purple-50 p-2 rounded-lg mr-3">
                <PenTool className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Your Email Response</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Word Count:</span>
                  <span className={`font-semibold ${getWordCountStatus()}`}>
                    {getWordCount()}/{task.word_count_min}-{task.word_count_max}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Time: {formatTime(timeRemaining)}
                </div>
              </div>

              <textarea
                value={userText}
                onChange={handleTextChange}
                placeholder="Write your email response here..."
                className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-gray-700 leading-relaxed"
                disabled={isCompleted}
              />

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {isWordCountValid() ? (
                    <span className="text-green-600">✓ Word count is within range</span>
                  ) : (
                    <span className="text-red-600">⚠ Word count must be between {task.word_count_min}-{task.word_count_max} words</span>
                  )}
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={!userText.trim()}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingTask1;