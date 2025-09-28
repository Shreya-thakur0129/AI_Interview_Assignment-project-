import { Question } from '../types';

export const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the difference between let, const, and var in JavaScript?",
    difficulty: 'easy',
    maxTime: 20,
    category: 'JavaScript Fundamentals'
  },
  {
    id: 2,
    text: "Explain the concept of React components and JSX.",
    difficulty: 'easy',
    maxTime: 20,
    category: 'React Basics'
  },
  {
    id: 3,
    text: "How does async/await work in JavaScript? Provide an example with error handling.",
    difficulty: 'medium',
    maxTime: 60,
    category: 'JavaScript Advanced'
  },
  {
    id: 4,
    text: "Explain React Hooks (useState, useEffect) and provide a practical example.",
    difficulty: 'medium',
    maxTime: 60,
    category: 'React Intermediate'
  },
  {
    id: 5,
    text: "Design and implement a RESTful API for a blog system with proper authentication and authorization.",
    difficulty: 'hard',
    maxTime: 120,
    category: 'Backend Architecture'
  },
  {
    id: 6,
    text: "Optimize a React application for performance. Discuss techniques like lazy loading, memoization, and bundle splitting.",
    difficulty: 'hard',
    maxTime: 120,
    category: 'React Advanced'
  }
];