import { Answer } from '../types';

export function generateAIScore(answer: string, difficulty: 'easy' | 'medium' | 'hard'): number {
  // Mock AI scoring based on answer length and difficulty
  if (!answer || answer.trim().length === 0) return 0;
  
  const baseScore = Math.min(answer.length * 2, 100);
  const difficultyMultiplier = {
    easy: 0.8,
    medium: 0.9,
    hard: 1.0
  };
  
  const keywords = ['function', 'component', 'async', 'await', 'react', 'javascript', 'api', 'performance', 'optimization'];
  const keywordCount = keywords.filter(keyword => answer.toLowerCase().includes(keyword)).length;
  const keywordBonus = Math.min(keywordCount * 10, 30);
  
  const finalScore = Math.min(Math.round((baseScore * difficultyMultiplier[difficulty]) + keywordBonus), 100);
  return Math.max(finalScore, 10); // Minimum score of 10 for any attempt
}

export function generateAISummary(answers: Answer[], finalScore: number): string {
  const totalQuestions = 6;
  const completedQuestions = answers.length;
  
  if (completedQuestions === 0) {
    return "Candidate did not complete any questions during the interview.";
  }
  
  const easyQuestions = answers.filter(a => a.questionId <= 2);
  const mediumQuestions = answers.filter(a => a.questionId >= 3 && a.questionId <= 4);
  const hardQuestions = answers.filter(a => a.questionId >= 5);
  
  const avgEasyScore = easyQuestions.length > 0 ? easyQuestions.reduce((sum, a) => sum + a.score, 0) / easyQuestions.length : 0;
  const avgMediumScore = mediumQuestions.length > 0 ? mediumQuestions.reduce((sum, a) => sum + a.score, 0) / mediumQuestions.length : 0;
  const avgHardScore = hardQuestions.length > 0 ? hardQuestions.reduce((sum, a) => sum + a.score, 0) / hardQuestions.length : 0;
  
  let summary = `Candidate completed ${completedQuestions}/${totalQuestions} questions with an overall score of ${finalScore}/100. `;
  
  if (finalScore >= 80) {
    summary += "Excellent performance with strong technical knowledge demonstrated across all difficulty levels. ";
  } else if (finalScore >= 60) {
    summary += "Good performance with solid understanding of fundamental concepts. ";
  } else if (finalScore >= 40) {
    summary += "Average performance with room for improvement in technical depth. ";
  } else {
    summary += "Below average performance indicating need for significant skill development. ";
  }
  
  if (avgEasyScore > 0) {
    summary += `Basic concepts: ${Math.round(avgEasyScore)}/100. `;
  }
  if (avgMediumScore > 0) {
    summary += `Intermediate skills: ${Math.round(avgMediumScore)}/100. `;
  }
  if (avgHardScore > 0) {
    summary += `Advanced topics: ${Math.round(avgHardScore)}/100. `;
  }
  
  const avgTimeUsage = answers.reduce((sum, a) => sum + (a.timeSpent / a.maxTime), 0) / answers.length;
  if (avgTimeUsage > 0.8) {
    summary += "Shows thorough consideration of problems with detailed responses.";
  } else if (avgTimeUsage < 0.3) {
    summary += "Quick response times but may benefit from more detailed explanations.";
  } else {
    summary += "Good balance of thoughtful responses and time management.";
  }
  
  return summary;
}