export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeFile?: File;
  interviewStarted: boolean;
  interviewCompleted: boolean;
  currentQuestion: number;
  answers: Answer[];
  finalScore: number;
  aiSummary: string;
  createdAt: string;
  completedAt?: string;
}

export interface Answer {
  questionId: number;
  question: string;
  answer: string;
  timeSpent: number;
  maxTime: number;
  score: number;
  feedback: string;
  timestamp: string;
}

export interface Question {
  id: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  maxTime: number;
  category: string;
}

export interface InterviewState {
  currentCandidate: Candidate | null;
  candidates: Candidate[];
  isInterviewActive: boolean;
  timeRemaining: number;
  currentQuestion: Question | null;
  chatHistory: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: string;
}

export type TabType = 'interviewee' | 'interviewer';