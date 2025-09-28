import React from 'react';
import { X, Play, RotateCcw } from 'lucide-react';
import { Candidate } from '../types';

interface WelcomeBackModalProps {
  candidate: Candidate;
  onResume: () => void;
  onRestart: () => void;
  onClose: () => void;
}

export function WelcomeBackModal({ candidate, onResume, onRestart, onClose }: WelcomeBackModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Welcome Back!</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Hi <span className="font-semibold">{candidate.name}</span>, 
            we found an incomplete interview session. You were on question {candidate.currentQuestion + 1} of 6.
          </p>
          <p className="text-sm text-gray-500">
            Would you like to continue where you left off or start a new interview?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center transform hover:scale-105"
          >
            <Play className="w-4 h-4 mr-2" />
            Resume Interview
          </button>
          
          <button
            onClick={onRestart}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}