import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { InterviewState, Candidate, Answer, Question, ChatMessage } from '../types';
import { mockQuestions } from '../data/questions';
import { generateAIScore, generateAISummary } from '../utils/aiMock';

interface InterviewContextType {
  state: InterviewState;
  startInterview: (candidate: Candidate) => void;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  completeInterview: () => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateCandidate: (updates: Partial<Candidate>) => void;
  setCurrentCandidate: (candidate: Candidate | null) => void;
  resumeInterview: () => void;
}

type Action =
  | { type: 'START_INTERVIEW'; payload: Candidate }
  | { type: 'SUBMIT_ANSWER'; payload: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_INTERVIEW' }
  | { type: 'ADD_CHAT_MESSAGE'; payload: Omit<ChatMessage, 'id' | 'timestamp'> }
  | { type: 'UPDATE_CANDIDATE'; payload: Partial<Candidate> }
  | { type: 'SET_CURRENT_CANDIDATE'; payload: Candidate | null }
  | { type: 'SET_TIME_REMAINING'; payload: number }
  | { type: 'LOAD_STATE'; payload: InterviewState }
  | { type: 'RESUME_INTERVIEW' };

const initialState: InterviewState = {
  currentCandidate: null,
  candidates: [],
  isInterviewActive: false,
  timeRemaining: 0,
  currentQuestion: null,
  chatHistory: []
};

function interviewReducer(state: InterviewState, action: Action): InterviewState {
  switch (action.type) {
    case 'START_INTERVIEW': {
      const candidate = { ...action.payload, interviewStarted: true };
      const updatedCandidates = state.candidates.some(c => c.id === candidate.id)
        ? state.candidates.map(c => c.id === candidate.id ? candidate : c)
        : [...state.candidates, candidate];
      
      return {
        ...state,
        currentCandidate: candidate,
        candidates: updatedCandidates,
        isInterviewActive: true,
        currentQuestion: mockQuestions[0],
        timeRemaining: mockQuestions[0].maxTime,
        chatHistory: [
          ...state.chatHistory,
          {
            id: Date.now().toString(),
            type: 'system',
            content: 'Interview started. Good luck!',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }
    
    case 'SUBMIT_ANSWER': {
      if (!state.currentCandidate || !state.currentQuestion) return state;
      
      const timeSpent = state.currentQuestion.maxTime - state.timeRemaining;
      const score = generateAIScore(action.payload, state.currentQuestion.difficulty);
      
      const answer: Answer = {
        questionId: state.currentQuestion.id,
        question: state.currentQuestion.text,
        answer: action.payload,
        timeSpent,
        maxTime: state.currentQuestion.maxTime,
        score,
        feedback: `Score: ${score}/100. ${score >= 80 ? 'Excellent answer!' : score >= 60 ? 'Good answer.' : 'Needs improvement.'}`,
        timestamp: new Date().toISOString()
      };
      
      const updatedCandidate = {
        ...state.currentCandidate,
        answers: [...state.currentCandidate.answers, answer]
      };
      
      const updatedCandidates = state.candidates.map(c =>
        c.id === updatedCandidate.id ? updatedCandidate : c
      );
      
      return {
        ...state,
        currentCandidate: updatedCandidate,
        candidates: updatedCandidates,
        chatHistory: [
          ...state.chatHistory,
          {
            id: Date.now().toString(),
            type: 'user',
            content: action.payload,
            timestamp: new Date().toISOString()
          }
        ]
      };
    }
    
    case 'NEXT_QUESTION': {
      if (!state.currentCandidate) return state;
      
      const nextQuestionIndex = state.currentCandidate.currentQuestion;
      const nextQuestion = mockQuestions[nextQuestionIndex];
      
      if (!nextQuestion) {
        return { ...state, currentQuestion: null };
      }
      
      const updatedCandidate = {
        ...state.currentCandidate,
        currentQuestion: nextQuestionIndex + 1
      };
      
      const updatedCandidates = state.candidates.map(c =>
        c.id === updatedCandidate.id ? updatedCandidate : c
      );
      
      return {
        ...state,
        currentCandidate: updatedCandidate,
        candidates: updatedCandidates,
        currentQuestion: nextQuestion,
        timeRemaining: nextQuestion.maxTime,
        chatHistory: [
          ...state.chatHistory,
          {
            id: Date.now().toString(),
            type: 'bot',
            content: `Question ${nextQuestion.id}: ${nextQuestion.text}`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    }
    
    case 'COMPLETE_INTERVIEW': {
      if (!state.currentCandidate) return state;
      
      const avgScore = state.currentCandidate.answers.length > 0
        ? Math.round(state.currentCandidate.answers.reduce((sum, answer) => sum + answer.score, 0) / state.currentCandidate.answers.length)
        : 0;
      
      const aiSummary = generateAISummary(state.currentCandidate.answers, avgScore);
      
      const completedCandidate = {
        ...state.currentCandidate,
        interviewCompleted: true,
        finalScore: avgScore,
        aiSummary,
        completedAt: new Date().toISOString()
      };
      
      const updatedCandidates = state.candidates.map(c =>
        c.id === completedCandidate.id ? completedCandidate : c
      );
      
      return {
        ...state,
        currentCandidate: completedCandidate,
        candidates: updatedCandidates,
        isInterviewActive: false,
        currentQuestion: null,
        chatHistory: [
          ...state.chatHistory,
          {
            id: Date.now().toString(),
            type: 'system',
            content: `Interview completed! Your final score is ${avgScore}/100.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    }
    
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [
          ...state.chatHistory,
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
          }
        ]
      };
    
    case 'UPDATE_CANDIDATE': {
      if (!state.currentCandidate) return state;
      
      const updatedCandidate = { ...state.currentCandidate, ...action.payload };
      const updatedCandidates = state.candidates.map(c =>
        c.id === updatedCandidate.id ? updatedCandidate : c
      );
      
      return {
        ...state,
        currentCandidate: updatedCandidate,
        candidates: updatedCandidates
      };
    }
    
    case 'SET_CURRENT_CANDIDATE':
      return {
        ...state,
        currentCandidate: action.payload
      };
    
    case 'SET_TIME_REMAINING':
      return {
        ...state,
        timeRemaining: action.payload
      };
    
    case 'LOAD_STATE':
      return action.payload;
    
    case 'RESUME_INTERVIEW': {
      if (!state.currentCandidate || !state.currentCandidate.interviewStarted) return state;
      
      const currentQuestionIndex = state.currentCandidate.currentQuestion;
      const currentQuestion = mockQuestions[currentQuestionIndex];
      
      return {
        ...state,
        isInterviewActive: true,
        currentQuestion,
        timeRemaining: currentQuestion?.maxTime || 0
      };
    }
    
    default:
      return state;
  }
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('interviewState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('interviewState', JSON.stringify(state));
  }, [state]);

  const startInterview = (candidate: Candidate) => {
    dispatch({ type: 'START_INTERVIEW', payload: candidate });
  };

  const submitAnswer = (answer: string) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const completeInterview = () => {
    dispatch({ type: 'COMPLETE_INTERVIEW' });
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
  };

  const updateCandidate = (updates: Partial<Candidate>) => {
    dispatch({ type: 'UPDATE_CANDIDATE', payload: updates });
  };

  const setCurrentCandidate = (candidate: Candidate | null) => {
    dispatch({ type: 'SET_CURRENT_CANDIDATE', payload: candidate });
  };

  const resumeInterview = () => {
    dispatch({ type: 'RESUME_INTERVIEW' });
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isInterviewActive && state.timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'SET_TIME_REMAINING', payload: state.timeRemaining - 1 });
      }, 1000);
    } else if (state.isInterviewActive && state.timeRemaining === 0) {
      // Auto-submit empty answer when time runs out
      submitAnswer('');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isInterviewActive, state.timeRemaining]);

  return (
    <InterviewContext.Provider value={{
      state,
      startInterview,
      submitAnswer,
      nextQuestion,
      completeInterview,
      addChatMessage,
      updateCandidate,
      setCurrentCandidate,
      resumeInterview
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}