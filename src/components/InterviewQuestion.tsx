import React, { useState, useEffect } from 'react';
import { Clock, Send, AlertTriangle } from 'lucide-react';
import { Question } from '../types';

interface InterviewQuestionProps {
  question: Question;
  timeRemaining: number;
  onSubmit: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function InterviewQuestion({ 
  question, 
  timeRemaining, 
  onSubmit, 
  questionNumber, 
  totalQuestions 
}: InterviewQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((question.maxTime - timeRemaining) / question.maxTime) * 100;
  const isTimeRunningOut = timeRemaining <= 10;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Simulate brief processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(answer);
    setAnswer('');
    setIsSubmitting(false);
  };

  useEffect(() => {
    // Auto-submit when time runs out
    if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
          isTimeRunningOut ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        } transition-colors`}>
          <Clock className="w-4 h-4" />
          <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
          {isTimeRunningOut && <AlertTriangle className="w-4 h-4 animate-pulse" />}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              isTimeRunningOut ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Started</span>
          <span>Time Remaining: {formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.text}</h3>
        <p className="text-sm text-gray-600">Category: {question.category}</p>
      </div>

      {/* Answer Input */}
      <div className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          placeholder="Type your answer here..."
          disabled={isSubmitting || timeRemaining === 0}
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {answer.length} characters
          </span>
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting || timeRemaining === 0}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center transform hover:scale-105"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
}