  const handleOpenFileInput = (type) => {
    // type can be 'local' or 'db'
    const inputId = type === 'db' ? 'quiz-file-input-db' : 'quiz-file-input';
    const input = document.getElementById(inputId);
    if (input) {
      input.click();
    }
  };// components/Quiz.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ManageQuizzes from './ManageQuizzes';
import MenuDropdown from './MenuDropdown';
import { FeedbackCheckIcon, XIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';
import { shuffleArray } from './utils';

function Question({ question, onAnswerSubmit, selectedAnswer, showJustification, currentQuestionIndex, initialQuestionCount, isInRepeatPhase, questionsToRepeat }) {
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const questionRef = useRef(null);

  useEffect(() => {
    if (question) {
      const options = ['A', 'B', 'C'];
      setShuffledOptions(shuffleArray(options));
      
      // Scroll to the question when a new one is loaded
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [question]);

  if (!question) return null;

  const handleAnswerSelect = (answer) => {
    if (!selectedAnswer && !showJustification) {
      onAnswerSubmit(answer);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="question-container" ref={questionRef}>
      <div className="progress-header">
        {isInRepeatPhase ? (
          <h3>Learn from your errors - {currentQuestionIndex + 1} of {questionsToRepeat?.length || 0}</h3>
        ) : (
          <h3>Question {Math.min(currentQuestionIndex + 1, initialQuestionCount)} of {initialQuestionCount}</h3>
        )}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: isInRepeatPhase 
              ? `${((currentQuestionIndex + 1) / (questionsToRepeat?.length || 1)) * 100}%`
              : `${((Math.min(currentQuestionIndex + 1, initialQuestionCount)) / initialQuestionCount) * 100}%` 
            }}
          />
        </div>
      </div>
      <h2>{question.texte}</h2>
      <div className="options-container">
        {shuffledOptions.map((option) => (
          <label 
            key={option}
            className={`option-label ${selectedAnswer === option ? 
              (question.correctAnswer === option ? 'selected correct' : 'selected incorrect') : 
              (showJustification && question.correctAnswer === option ? 'correct-answer' : '')} 
              ${showJustification ? 'disabled' : ''}`}
            onClick={() => handleAnswerSelect(option)}
          >
            <input
              type="radio"
              name="answer"
              value={option}
              className="radio-input"
              onChange={() => {}}
              checked={selectedAnswer === option}
              disabled={showJustification}
            />
            <span className="option-letter">{option}</span>
            <span className="option-text">{question[`answer${option}`]}</span>
          </label>
        ))}
      </div>
      {showJustification && (
        <div className={`justification ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-with-icon">
            {isCorrect ? <FeedbackCheckIcon /> : <XIcon />}
            <p className="answer-feedback">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
          </div>
          {/* Only show justification text for incorrect answers */}
          {!isCorrect && <p className="justification-text">{question.justification}</p>}
        </div>
      )}
    </div>
  );
}

function Header({ 
  title,
  onRestartQuiz,
  onManageQuizzes,
  onLibraryDB,
  correctAnswers,
  initialQuestionCount,
  isQuizInProgress
}) {
  return (
    <div className="quiz-header-container">
      <div className="quiz-header-left">
        <h1 className="quiz-header">{title}</h1>
        {isQuizInProgress && initialQuestionCount > 0 && (
          <div className="live-score">
            Score: {correctAnswers} / {initialQuestionCount}
          </div>
        )}
      </div>
      <MenuDropdown 
        onRestartQuiz={onRestartQuiz}
        onManageQuizzes={onManageQuizzes}
        onLibraryDB={onLibraryDB}
      />
    </div>
  );
}

function QuizComplete({ correctAnswers, initialQuestionCount, onRestartQuiz, onManageQuizzes }) {
  const normalizedScore = initialQuestionCount > 0 ? (correctAnswers / initialQuestionCount) * 20 : 0;
  let scoreMessage = '';
  
  if (normalizedScore >= 16) {
    scoreMessage = 'Excellent job!';
  } else if (normalizedScore >= 12) {
    scoreMessage = 'Good work!';
  } else if (normalizedScore >= 8) {
    scoreMessage = 'Nice effort!';
  } else {
    scoreMessage = 'Keep practicing!';
  }

  return (
    <div className="complete-container">
      <h2 className="quiz-complete-text">Quiz Complete!</h2>
      <p className="score-message">{scoreMessage}</p>
      <p className="final-score">{normalizedScore.toFixed(1)} / 20</p>
      <p className="raw-score">{correctAnswers} out of {initialQuestionCount} correct</p>
      <div className="quiz-complete-buttons">
        <button onClick={onRestartQuiz} className="quiz-button">
          Restart Quiz
        </button>
        <button onClick={onManageQuizzes} className="quiz-button secondary">
          New Quiz
        </button>
      </div>
    </div>
  );
}

export default function Quiz({ initialQuizData = null, onManageQuizzes, onLibraryDB, dataSource = 'local' }) {
  const CORRECT_ANSWER_DELAY = 1000;
  const LOCAL_STORAGE_KEY = 'quizData';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showJustification, setShowJustification] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [showManageQuizzes, setShowManageQuizzes] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizzes, setQuizzes] = useLocalStorage(LOCAL_STORAGE_KEY, []);
  const [questionsToRepeat, setQuestionsToRepeat] = useState([]);
  const [isInRepeatPhase, setIsInRepeatPhase] = useState(false);
  const [initialQuestionCount, setInitialQuestionCount] = useState(0);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeCompleted, setTimeCompleted] = useState(null);

  // Effect to handle initialQuizData when provided
  useEffect(() => {
    if (initialQuizData) {
      setQuizData(initialQuizData);
    }
  }, [initialQuizData]);

  // Generate a unique key for questions that don't have an ID
  const getQuestionKey = useCallback((question, index) => {
    return question.id || `q-${index}-${question.texte?.slice(0, 10)?.replace(/\s+/g, '-')}`;
  }, []);

  // Timer for tracking quiz duration
  useEffect(() => {
    if (quizData && randomizedQuestions.length > 0 && !timeStarted) {
      setTimeStarted(new Date());
    }
    
    if (isQuizComplete && timeStarted && !timeCompleted) {
      setTimeCompleted(new Date());
    }
  }, [quizData, randomizedQuestions.length, isQuizComplete, timeStarted, timeCompleted]);

  // Set active quiz data when quizzes change
  useEffect(() => {
    if (!quizzes || quizzes.length === 0) {
      return; // Don't clear quizData if we have initialQuizData
    }
    
    const activeQuizzes = quizzes.filter(quiz => quiz?.isActive);
    
    if (activeQuizzes.length === 0) {
      return; // Don't clear quizData if we have initialQuizData
    }
    
    if (activeQuizzes.length === 1) {
      // Single quiz activated
      const activeQuiz = activeQuizzes[0];
      if (activeQuiz && activeQuiz.data) {
        const quizWithId = {
          ...activeQuiz.data,
          id: activeQuiz.id
        };
        setQuizData(quizWithId);
      }
    } else {
      // Multiple quizzes activated
      const combinedQuestions = [];
      activeQuizzes.forEach(quiz => {
        if (quiz.data && quiz.data.questions && Array.isArray(quiz.data.questions)) {
          combinedQuestions.push(...quiz.data.questions);
        }
      });
      
      setQuizData({
        title: "Combo Quiz",
        questions: combinedQuestions
      });
    }
  }, [quizzes]);

  // Randomize questions when quiz data changes
  useEffect(() => {
    if (quizData && quizData.questions && quizData.questions.length > 0) {
      const currentQuestions = [...quizData.questions];
      // Always randomize questions
      const randomized = shuffleArray([...currentQuestions]);
      
      setRandomizedQuestions(randomized);
      setInitialQuestionCount(randomized.length);
    } else {
      setRandomizedQuestions([]);
      setInitialQuestionCount(0);
    }
  }, [quizData]);

  const goToNextQuestion = useCallback(() => {
    if (!randomizedQuestions || randomizedQuestions.length === 0) {
      return;
    }
    
    if (!isInRepeatPhase && currentQuestionIndex < randomizedQuestions.length - 1) {
      // Still in the initial phase and not at the last question
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else if (!isInRepeatPhase && currentQuestionIndex === randomizedQuestions.length - 1) {
      // Just finished the initial phase
      if (questionsToRepeat && questionsToRepeat.length > 0) {
        // There are questions to repeat
        setIsInRepeatPhase(true);
        setCurrentQuestionIndex(0);
      } else {
        // No questions to repeat, finish the quiz
        setIsQuizComplete(true);
      }
    } else if (isInRepeatPhase && questionsToRepeat && currentQuestionIndex < questionsToRepeat.length - 1) {
      // In repeat phase and not at the last repeated question
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Finished all questions including repeats
      setIsQuizComplete(true);
    }
    setSelectedAnswer('');
    setShowJustification(false);
  }, [currentQuestionIndex, randomizedQuestions, isInRepeatPhase, questionsToRepeat]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!randomizedQuestions || randomizedQuestions.length === 0) {
        return;
      }
      
      // If Enter key is pressed when showing justification for incorrect answer, go to next question
      if (event.key === 'Enter' && showJustification) {
        const currentQuestion = isInRepeatPhase && questionsToRepeat && questionsToRepeat.length > 0
          ? questionsToRepeat[currentQuestionIndex] 
          : randomizedQuestions[currentQuestionIndex];
          
        if (currentQuestion && selectedAnswer !== currentQuestion.correctAnswer) {
          goToNextQuestion();
        }
      } 
      // Allow selecting answers using A, B, C keys when not showing justification
      else if (!showJustification && ['a', 'b', 'c'].includes(event.key.toLowerCase())) {
        const option = event.key.toUpperCase();
        
        // Create a local handleKeyboardAnswerSelect function
        const currentQuestion = isInRepeatPhase && questionsToRepeat && questionsToRepeat.length > 0
          ? questionsToRepeat[currentQuestionIndex] 
          : randomizedQuestions[currentQuestionIndex];
          
        if (currentQuestion) {
          setSelectedAnswer(option);
          setShowJustification(true);
          
          if (option === currentQuestion.correctAnswer) {
            if (!isInRepeatPhase) {
              setCorrectAnswers(prev => prev + 1);
            }
            setTimeout(goToNextQuestion, CORRECT_ANSWER_DELAY);
          } else {
            if (!isInRepeatPhase) {
              const wrongQuestion = {
                ...currentQuestion,
                userAnswer: option
              };
              setQuestionsToRepeat(prev => [...prev, wrongQuestion]);
            }
          }
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showJustification, selectedAnswer, currentQuestionIndex, randomizedQuestions, questionsToRepeat, isInRepeatPhase, goToNextQuestion, CORRECT_ANSWER_DELAY]);

  // Handle answer submission
  const handleAnswerSubmit = useCallback((answer) => {
    if (!randomizedQuestions || randomizedQuestions.length === 0) {
      return;
    }
    
    setSelectedAnswer(answer);
    setShowJustification(true);
    
    const currentQuestion = isInRepeatPhase && questionsToRepeat && questionsToRepeat.length > 0
      ? questionsToRepeat[currentQuestionIndex] 
      : randomizedQuestions[currentQuestionIndex];
      
    if (currentQuestion && answer === currentQuestion.correctAnswer) {
      if (!isInRepeatPhase) {
        setCorrectAnswers(prev => prev + 1);
      }
      setTimeout(goToNextQuestion, CORRECT_ANSWER_DELAY);
    } else if (currentQuestion) {
      if (!isInRepeatPhase) {
        const wrongQuestion = {
          ...currentQuestion,
          userAnswer: answer
        };
        setQuestionsToRepeat(prev => [...prev, wrongQuestion]);
      }
      // Remove the automatic transition for wrong answers
      // The "Next Question" button will handle this case
    }
  }, [isInRepeatPhase, questionsToRepeat, currentQuestionIndex, randomizedQuestions, goToNextQuestion, CORRECT_ANSWER_DELAY]);

  // Restart the quiz
  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowJustification(false);
    setIsQuizComplete(false);
    setCorrectAnswers(0);
    setQuestionsToRepeat([]);
    setIsInRepeatPhase(false);
    setTimeStarted(new Date());
    setTimeCompleted(null);
    
    if (quizData && quizData.questions && quizData.questions.length > 0) {
      const currentQuestions = [...quizData.questions];
      // Always shuffle questions
      setRandomizedQuestions(shuffleArray([...currentQuestions]));
    }
  }, [quizData]);

  // Activate a quiz
  const handleQuizActivated = useCallback((newQuizData) => {
    if (!newQuizData) {
      setQuizData(null);
      setRandomizedQuestions([]);
      return;
    }
    
    setQuizData(newQuizData);
    
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowJustification(false);
    setIsQuizComplete(false);
    setCorrectAnswers(0);
    setQuestionsToRepeat([]);
    setIsInRepeatPhase(false);
    setTimeStarted(new Date());
    setTimeCompleted(null);
    
    if (newQuizData.questions && newQuizData.questions.length > 0) {
      // Always shuffle questions
      const randomized = shuffleArray([...newQuizData.questions]);
      
      setRandomizedQuestions(randomized);
      setInitialQuestionCount(randomized.length);
    } else {
      setRandomizedQuestions([]);
      setInitialQuestionCount(0);
    }
  }, []);

  const isQuizInProgress = quizData && !isQuizComplete;

  const currentQuestion = React.useMemo(() => {
    if (!randomizedQuestions || randomizedQuestions.length === 0) {
      return null;
    }
    
    return isInRepeatPhase && questionsToRepeat && questionsToRepeat.length > 0
      ? questionsToRepeat[currentQuestionIndex]
      : randomizedQuestions[currentQuestionIndex];
  }, [isInRepeatPhase, questionsToRepeat, currentQuestionIndex, randomizedQuestions]);

  return (
    <div className="quiz-container">
      <Header 
        title={quizData?.title || "Quiz App"}
        onRestartQuiz={handleRestart}
        onManageQuizzes={onManageQuizzes}
        onLibraryDB={onLibraryDB}
        correctAnswers={correctAnswers}
        initialQuestionCount={initialQuestionCount}
        isQuizInProgress={isQuizInProgress}
      />
      {!quizData ? (
        <div className="empty-state">
          <p>No questions loaded. Please choose a library to upload questions.</p>
          <div className="empty-state-buttons">
            <button 
              onClick={onManageQuizzes}
              className="quiz-button"
              title="Uses browser's local storage - works offline"
            >
              Local Library
            </button>
            <button 
              onClick={onLibraryDB}
              className="quiz-button secondary"
              title="Uses online database - works across devices"
            >
              Online Library
            </button>
          </div>
          <div className="source-note">
            {dataSource === 'local' ? 
              "Using local storage - quizzes are saved in your browser" : 
              "Using online database - quizzes are saved in the cloud"}
          </div>
        </div>
      ) : !randomizedQuestions || randomizedQuestions.length === 0 ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading questions...</p>
        </div>
      ) : isQuizComplete ? (
        <QuizComplete 
          correctAnswers={correctAnswers}
          initialQuestionCount={initialQuestionCount}
          onRestartQuiz={handleRestart}
          onManageQuizzes={onManageQuizzes}
        />
      ) : (
        <>
          {currentQuestion && (
            <Question 
              question={currentQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              selectedAnswer={selectedAnswer}
              showJustification={showJustification}
              currentQuestionIndex={currentQuestionIndex}
              initialQuestionCount={initialQuestionCount}
              isInRepeatPhase={isInRepeatPhase}
              questionsToRepeat={questionsToRepeat}
            />
          )}
          
          {showJustification && currentQuestion && selectedAnswer !== currentQuestion.correctAnswer && (
            <button
              onClick={goToNextQuestion}
              className="quiz-button next-question"
            >
              {(isInRepeatPhase && questionsToRepeat && currentQuestionIndex === questionsToRepeat.length - 1) 
                ? 'Finish Quiz' 
                : 'Next Question'
              }
            </button>
          )}
        </>
      )}
    </div>
  );
}