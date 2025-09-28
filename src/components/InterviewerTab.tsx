import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { CandidateList } from './CandidateList';
import { CandidateDetail } from './CandidateDetail';
import { Users, BarChart3, TrendingUp, Clock } from 'lucide-react';

export function InterviewerTab() {
  const { state } = useInterview();
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const completedCandidates = state.candidates.filter(c => c.interviewCompleted);
  const avgScore = completedCandidates.length > 0
    ? Math.round(completedCandidates.reduce((sum, c) => sum + c.finalScore, 0) / completedCandidates.length)
    : 0;
  const inProgress = state.candidates.filter(c => c.interviewStarted && !c.interviewCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interviewer Dashboard</h1>
          <p className="text-xl text-gray-600">Manage and review candidate interviews</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Candidates</p>
                <p className="text-3xl font-bold text-gray-900">{state.candidates.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedCandidates.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-purple-600">{avgScore}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate List */}
          <div className="lg:col-span-1">
            <CandidateList
              candidates={state.candidates}
              onSelectCandidate={setSelectedCandidate}
              selectedCandidate={selectedCandidate}
            />
          </div>

          {/* Candidate Detail */}
          <div className="lg:col-span-2">
            {selectedCandidate ? (
              <CandidateDetail candidate={selectedCandidate} />
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Candidate
                </h3>
                <p className="text-gray-600">
                  Choose a candidate from the list to view their detailed interview results and responses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}