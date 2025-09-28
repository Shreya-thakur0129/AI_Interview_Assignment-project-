import React, { useState } from 'react';
import { InterviewProvider } from './context/InterviewContext';
import { IntervieweeTab } from './components/IntervieweeTab';
import { InterviewerTab } from './components/InterviewerTab';
import { MessageSquare, Users, Sparkles } from 'lucide-react';
import { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('interviewee');

  return (
    <InterviewProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">AI Interview</span>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('interviewee')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'interviewee'
                      ? 'bg-white text-blue-600 shadow-sm transform scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Interviewee</span>
                </button>
                <button
                  onClick={() => setActiveTab('interviewer')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'interviewer'
                      ? 'bg-white text-purple-600 shadow-sm transform scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Interviewer</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Tab Content */}
        <main className="transition-all duration-300">
          {activeTab === 'interviewee' ? <IntervieweeTab /> : <InterviewerTab />}
        </main>
      </div>
    </InterviewProvider>
  );
}

export default App;