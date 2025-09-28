import React from 'react';
import { User, Mail, Phone, Calendar, Clock, Trophy, FileText, MessageSquare } from 'lucide-react';
import { Candidate } from '../types';
import { ChatInterface } from './ChatInterface';

interface CandidateDetailProps {
  candidate: Candidate;
}

export function CandidateDetail({ candidate }: CandidateDetailProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Candidate Profile */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Candidate Profile</h2>
          {candidate.interviewCompleted && (
            <div className={`px-4 py-2 rounded-full border-2 ${getScoreColor(candidate.finalScore)}`}>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span className="text-xl font-bold">{candidate.finalScore}/100</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{candidate.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">{candidate.email}</p>
              </div>
            </div>
            
            {candidate.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-900">{candidate.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Interview Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(candidate.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {candidate.completedAt && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Completion Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(candidate.completedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Questions Answered</p>
                <p className="text-lg font-semibold text-gray-900">
                  {candidate.answers.length} / 6
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {candidate.interviewCompleted && candidate.aiSummary && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            AI-Generated Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{candidate.aiSummary}</p>
        </div>
      )}

      {/* Question Responses */}
      {candidate.answers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Responses</h3>
          <div className="space-y-6">
            {candidate.answers.map((answer, index) => (
              <div key={answer.questionId} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {answer.questionId}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        answer.questionId <= 2 ? 'easy' : answer.questionId <= 4 ? 'medium' : 'hard'
                      )}`}>
                        {answer.questionId <= 2 ? 'Easy' : answer.questionId <= 4 ? 'Medium' : 'Hard'}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{answer.question}</h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full border ${getScoreColor(answer.score)}`}>
                    <span className="text-sm font-bold">{answer.score}/100</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{answer.answer || 'No answer provided'}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Time spent: {formatTime(answer.timeSpent)} / {formatTime(answer.maxTime)}</span>
                  <span>{answer.feedback}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}