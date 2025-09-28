import React, { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { ResumeUpload } from './ResumeUpload';
import { DataCollection } from './DataCollection';
import { InterviewQuestion } from './InterviewQuestion';
import { ChatInterface } from './ChatInterface';
import { WelcomeBackModal } from './WelcomeBackModal';
import { Candidate } from '../types';
import { CheckCircle, Trophy } from 'lucide-react';

export function IntervieweeTab() {
  const { state, startInterview, submitAnswer, nextQuestion, completeInterview, addChatMessage, resumeInterview, setCurrentCandidate } = useInterview();
  const [step, setStep] = useState<'upload' | 'collect' | 'interview' | 'completed'>('upload');
  const [candidateData, setCandidateData] = useState<Partial<Candidate>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check for incomplete interviews on load
    if (state.currentCandidate && state.currentCandidate.interviewStarted && !state.currentCandidate.interviewCompleted) {
      setShowWelcomeModal(true);
    }
  }, []);

  useEffect(() => {
    if (state.currentCandidate?.interviewCompleted) {
      setStep('completed');
    } else if (state.isInterviewActive && state.currentQuestion) {
      setStep('interview');
    }
  }, [state.currentCandidate, state.isInterviewActive, state.currentQuestion]);

  const handleResumeUpload = (data: any) => {
    const missing = [];
    if (!data.name) missing.push('name');
    if (!data.email) missing.push('email');
    if (!data.phone) missing.push('phone');

    setCandidateData(data);

    if (missing.length > 0) {
      setMissingFields(missing);
      setStep('collect');
      addChatMessage({
        type: 'bot',
        content: `I've processed your resume, but I need some additional information before we can start the interview.`
      });
    } else {
      startInterviewProcess(data);
    }
  };

  const handleDataCollection = (additionalData: any) => {
    const completeData = { ...candidateData, ...additionalData };
    startInterviewProcess(completeData);
  };

  const startInterviewProcess = (data: any) => {
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      resumeFile: data.file,
      interviewStarted: false,
      interviewCompleted: false,
      currentQuestion: 0,
      answers: [],
      finalScore: 0,
      aiSummary: '',
      createdAt: new Date().toISOString()
    };

    addChatMessage({
      type: 'bot',
      content: `Perfect! Hi ${newCandidate.name}, I'm your AI interview assistant. We'll be conducting a technical interview with 6 questions across different difficulty levels. Are you ready to begin?`
    });

    startInterview(newCandidate);
    setStep('interview');
  };

  const handleAnswerSubmit = (answer: string) => {
    submitAnswer(answer);
    
    if (state.currentCandidate && state.currentCandidate.currentQuestion < 5) {
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      setTimeout(() => {
        completeInterview();
      }, 1000);
    }
  };

  const handleResumeInterview = () => {
    resumeInterview();
    setShowWelcomeModal(false);
    setStep('interview');
  };

  const handleRestartInterview = () => {
    setCurrentCandidate(null);
    setShowWelcomeModal(false);
    setStep('upload');
    setCandidateData({});
  };

  const startNewSession = () => {
    setCurrentCandidate(null);
    setStep('upload');
    setCandidateData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {showWelcomeModal && state.currentCandidate && (
        <WelcomeBackModal
          candidate={state.currentCandidate}
          onResume={handleResumeInterview}
          onRestart={handleRestartInterview}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Interview Assistant
              </h1>
              <p className="text-xl text-gray-600">
                Upload your resume to get started with your technical interview
              </p>
            </div>
            <ResumeUpload onDataExtracted={handleResumeUpload} />
          </div>
        )}

        {step === 'collect' && (
          <div className="max-w-2xl mx-auto">
            <DataCollection
              missingFields={missingFields}
              onDataProvided={handleDataCollection}
            />
          </div>
        )}

        {step === 'interview' && state.currentQuestion && (
          <div className="max-w-6xl mx-auto">
            <InterviewQuestion
              question={state.currentQuestion}
              timeRemaining={state.timeRemaining}
              onSubmit={handleAnswerSubmit}
              questionNumber={state.currentQuestion.id}
              totalQuestions={6}
            />
          </div>
        )}

        {step === 'completed' && state.currentCandidate && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Interview Completed!
              </h2>
              
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                  <Trophy className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {state.currentCandidate.finalScore}/100
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {state.currentCandidate.aiSummary}
              </p>
              
              <button
                onClick={startNewSession}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Start New Interview
              </button>
            </div>
          </div>
        )}

        {/* Chat Interface - Always visible when not on upload step */}
        {step !== 'upload' && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Chat</h3>
              <div className="max-h-64 overflow-y-auto">
                <ChatInterface messages={state.chatHistory} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}