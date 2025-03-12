/**
 * Utility functions for quiz data processing
 */

/**
 * Function to balance the distribution of correct answers in a quiz
 * Ensures roughly equal distribution of A, B, and C as correct answers
 * @param {Object} quizData - The quiz data loaded from JSON
 * @returns {Object} - The quiz data with balanced answer distribution
 */
export const balanceCorrectAnswers = (quizData) => {
  // Clone the quiz data to avoid mutating the original
  const balancedQuizData = JSON.parse(JSON.stringify(quizData));
  
  if (!balancedQuizData.questions || !Array.isArray(balancedQuizData.questions) || balancedQuizData.questions.length === 0) {
    return balancedQuizData; // Return as is if no questions
  }
  
  const totalQuestions = balancedQuizData.questions.length;
  
  // Calculate ideal distribution (approx equal thirds)
  const idealPerOption = Math.floor(totalQuestions / 3);
  
  // Target counts for each answer option
  let targetCounts = {
    'A': idealPerOption,
    'B': idealPerOption,
    'C': totalQuestions - (idealPerOption * 2) // Remainder to C to ensure total adds up
  };
  
  // First pass: count existing correct answers
  let currentCounts = { 'A': 0, 'B': 0, 'C': 0 };
  balancedQuizData.questions.forEach(question => {
    if (question.correctAnswer && ['A', 'B', 'C'].includes(question.correctAnswer)) {
      currentCounts[question.correctAnswer]++;
    }
  });
  
  // If we already have a good distribution (within ±1 of ideal), return as is
  if (Math.abs(currentCounts.A - targetCounts.A) <= 1 &&
      Math.abs(currentCounts.B - targetCounts.B) <= 1 &&
      Math.abs(currentCounts.C - targetCounts.C) <= 1) {
    console.log("Answer distribution already balanced.");
    return balancedQuizData;
  }
  
  console.log("Original answer distribution:", currentCounts);
  
  // Second pass: adjust answers to balance the distribution
  for (let i = 0; i < balancedQuizData.questions.length; i++) {
    const question = balancedQuizData.questions[i];
    const currentAnswer = question.correctAnswer;
    
    // Skip if the answer is not A, B, or C
    if (!['A', 'B', 'C'].includes(currentAnswer)) continue;
    
    // Calculate which options are over their target count
    const overAllocated = Object.keys(currentCounts).filter(
      option => currentCounts[option] > targetCounts[option]
    );
    
    // Calculate which options are under their target count
    const underAllocated = Object.keys(currentCounts).filter(
      option => currentCounts[option] < targetCounts[option]
    );
    
    // Only re-assign if current answer is over-allocated and there are under-allocated options
    if (overAllocated.includes(currentAnswer) && underAllocated.length > 0) {
      // Choose a random under-allocated option
      const newAnswer = underAllocated[Math.floor(Math.random() * underAllocated.length)];
      
      if (newAnswer !== currentAnswer) {
        // Reassign the content accordingly
        rotateAnswerContent(question, currentAnswer, newAnswer);
        
        // Update counts
        currentCounts[currentAnswer]--;
        currentCounts[newAnswer]++;
      }
    }
  }
  
  console.log("Balanced answer distribution:", currentCounts);
  return balancedQuizData;
};

/**
 * Rotates the answer content to match the new correct answer
 * @param {Object} question - The question object
 * @param {string} oldAnswer - The current correct answer (A, B, or C)
 * @param {string} newAnswer - The new correct answer (A, B, or C)
 */
const rotateAnswerContent = (question, oldAnswer, newAnswer) => {
  // Save the content of the answers
  const oldCorrectContent = question[`answer${oldAnswer}`];
  const newCorrectContent = question[`answer${newAnswer}`];
  
  // Swap the content
  question[`answer${newAnswer}`] = oldCorrectContent;
  question[`answer${oldAnswer}`] = newCorrectContent;
  
  // Update the correct answer marker
  question.correctAnswer = newAnswer;
};
