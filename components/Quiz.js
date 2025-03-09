// components/Quiz.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ManageQuizzes from './ManageQuizzes';
import MenuDropdown from './MenuDropdown';
import { CheckIcon, XIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';
import { shuffleArray } from './utils';

function Question({ question, onAnswerSubmit, selectedAnswer, showJustification, currentQuestionIndex, initialQuestionCount, isInRepeatPhase }) {
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const questionRef = useRef(null);

  useEffect(() => {
    const options = ['A', 'B', 'C'];
    setShuffledOptions(shuffleArray(options));
    
    // Scroll to the question when a new one is loaded
    if (questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [question]);

  if (!question) return null;

  const handleAnswerSelect = (answer) => {
    if (!selectedAnswer && !showJustification) {
      onAnswerSubmit(answer);
    }
  };

  return (
    <div className="question-container" ref={questionRef}>
      <div className="progress-header">
        {isInRepeatPhase ? (
          <h3>Learn from your errors - {currentQuestionIndex + 1} of {isInRepeatPhase ? questionsToRepeat?.length : initialQuestionCount}</h3>
        ) : (
          <h3>Question {Math.min(currentQuestionIndex + 1, initialQuestionCount)} of {initialQuestionCount}</h3>
        )}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((Math.min(currentQuestionIndex + 1, initialQuestionCount)) / initialQuestionCount) * 100}%` }}
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
        <div className={`justification ${selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
          <div className="feedback-with-icon">
            {selectedAnswer === question.correctAnswer ? <CheckIcon /> : <XIcon />}
            <p className="answer-feedback">
              {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
            </p>
          </div>
          <p className="justification-text">{question.justification}</p>
        </div>
      )}
    </div>
  );
}

function Header({ 
  title,
  onRestartQuiz,
  onManageQuizzes,
  orderModes,
  setOrderModes,
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
        orderModes={orderModes}
        setOrderModes={setOrderModes}
      />
    </div>
  );
}

function QuizComplete({ correctAnswers, initialQuestionCount, onRestartQuiz }) {
  const normalizedScore = (correctAnswers / initialQuestionCount) * 20;
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

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        onRestartQuiz();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [onRestartQuiz]);

  return (
    <div className="complete-container">
      <h2 className="quiz-complete-text">Quiz Complete!</h2>
      <p className="score-message">{scoreMessage}</p>
      <p className="final-score">{normalizedScore.toFixed(1)} / 20</p>
      <p className="raw-score">{correctAnswers} out of {initialQuestionCount} correct</p>
      <div className="quiz-complete-buttons">
        <button onClick={onRestartQuiz} className="quiz-button">
          Try Again
        </button>
        <button onClick={() => window.location.reload()} className="quiz-button secondary">
          New Quiz
        </button>
      </div>
    </div>
  );
}

export default function Quiz() {
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
  const [orderModes, setOrderModes] = useState({});
  const [questionsToRepeat, setQuestionsToRepeat] = useState([]);
  const [isInRepeatPhase, setIsInRepeatPhase] = useState(false);
  const [initialQuestionCount, setInitialQuestionCount] = useState(0);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeCompleted, setTimeCompleted] = useState(null);

  // Timer for tracking quiz duration
  useEffect(() => {
    if (quizData && randomizedQuestions.length > 0 && !timeStarted) {
      setTimeStarted(new Date());
    }
    
    if (isQuizComplete && timeStarted && !timeCompleted) {
      setTimeCompleted(new Date());
    }
  }, [quizData, randomizedQuestions, isQuizComplete, timeStarted, timeCompleted]);

  useEffect(() => {
    const modes = {};
    quizzes.forEach(quiz => {
      modes[quiz.id] = 'random';
    });
    setOrderModes(modes);
  }, [quizzes]);

  useEffect(() => {
    const activeQuiz = quizzes.find(quiz => quiz.isActive);
    if (activeQuiz) {
      const quizWithId = {
        ...activeQuiz.data,
        id: activeQuiz.id
      };
      setQuizData(quizWithId);
      setOrderModes(prev => ({
        ...prev,
        [activeQuiz.id]: activeQuiz.orderMode || 'random'
      }));
    } else {
      setQuizData(null);
      setOrderModes({});
    }
  }, [quizzes]);

  useEffect(() => {
    if (quizData && quizData.questions) {
      const currentQuestions = [...quizData.questions];
      const mode = quizData.id && orderModes[quizData.id] ? orderModes[quizData.id] : 'random';
      
      const randomized = mode === 'random' ? 
        currentQuestions.sort(() => Math.random() - 0.5) : 
        currentQuestions;
      
      setRandomizedQuestions(randomized);
      setInitialQuestionCount(randomized.length);
    } else {
      setRandomizedQuestions([]);
      setInitialQuestionCount(0);
    }
  }, [quizData, orderModes]);

  const goToNextQuestion = useCallback(() => {
    if (!isInRepeatPhase && currentQuestionIndex < randomizedQuestions.length - 1) {
      // Still in the initial phase and not at the last question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (!isInRepeatPhase && currentQuestionIndex === randomizedQuestions.length - 1) {
      // Just finished the initial phase
      if (questionsToRepeat.length > 0) {
        // There are questions to repeat
        setIsInRepeatPhase(true);
        setCurrentQuestionIndex(0);
      } else {
        // No questions to repeat, finish the quiz
        setIsQuizComplete(true);
      }
    } else if (isInRepeatPhase && currentQuestionIndex < questionsToRepeat.length - 1) {
      // In repeat phase and not at the last repeated question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finished all questions including repeats
      setIsQuizComplete(true);
    }
    setSelectedAnswer('');
    setShowJustification(false);
  }, [currentQuestionIndex, randomizedQuestions.length, isInRepeatPhase, questionsToRepeat.length]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // If Enter key is pressed when showing justification for incorrect answer, go to next question
      if (event.key === 'Enter' && showJustification) {
        const currentQuestion = isInRepeatPhase 
          ? questionsToRepeat[currentQuestionIndex] 
          : randomizedQuestions[currentQuestionIndex];
          
        if (selectedAnswer !== currentQuestion?.correctAnswer) {
          goToNextQuestion();
        }
      } 
      // Allow selecting answers using A, B, C keys when not showing justification
      else if (!showJustification && ['a', 'b', 'c'].includes(event.key.toLowerCase())) {
        const option = event.key.toUpperCase();
        handleAnswerSubmit(option);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showJustification, selectedAnswer, currentQuestionIndex, randomizedQuestions, questionsToRepeat, isInRepeatPhase, goToNextQuestion]);

  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer);
    setShowJustification(true);
    
    const currentQuestion = isInRepeatPhase 
      ? questionsToRepeat[currentQuestionIndex] 
      : randomizedQuestions[currentQuestionIndex];
      
    if (answer === currentQuestion.correctAnswer) {
      if (!isInRepeatPhase) {
        setCorrectAnswers(prev => prev + 1);
      }
      setTimeout(goToNextQuestion, CORRECT_ANSWER_DELAY);
    } else {
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
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowJustification(false);
    setIsQuizComplete(false);
    setCorrectAnswers(0);
    setQuestionsToRepeat([]);
    setIsInRepeatPhase(false);
    setTimeStarted(new Date());
    setTimeCompleted(null);
    
    if (quizData && quizData.questions) {
      const currentQuestions = [...quizData.questions];
      const mode = quizData.id && orderModes[quizData.id] ? orderModes[quizData.id] : 'random';
      
      setRandomizedQuestions(mode === 'random' ? 
        shuffleArray(currentQuestions) : 
        currentQuestions
      );
    }
  };

  const handleQuizActivated = (quizData, orderMode) => {
    if (!quizData) {
      setQuizData(null);
      setRandomizedQuestions([]);
      return;
    }
    
    setQuizData(quizData);
    setOrderModes(prev => ({
      ...prev,
      [quizData.id]: orderMode || 'random'
    }));
    
    handleRestart();
  };

  const isQuizInProgress = quizData && !isQuizComplete;

  return (
    <div className="quiz-container">
      <Header 
        title={quizData?.title || "Quiz App"}
        onRestartQuiz={handleRestart}
        onManageQuizzes={() => setShowManageQuizzes(true)}
        orderModes={orderModes}
        setOrderModes={setOrderModes}
        correctAnswers={correctAnswers}
        initialQuestionCount={initialQuestionCount}
        isQuizInProgress={isQuizInProgress}
      />
      {showManageQuizzes && (
        <ManageQuizzes
          onClose={() => setShowManageQuizzes(false)}
          onQuizActivated={handleQuizActivated}
          quizzes={quizzes}
          setQuizzes={setQuizzes}
          orderModes={orderModes}
          setOrderModes={setOrderModes}
        />
      )}
      {!quizData ? (
        <div className="empty-state">
          <p>No questions loaded. Please upload a question file to start.</p>
          <button 
            onClick={() => setShowManageQuizzes(true)}
            className="quiz-button"
          >
            Upload Questions
          </button>
        </div>
      ) : !randomizedQuestions.length ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading questions...</p>
        </div>
      ) : isQuizComplete ? (
        <QuizComplete 
          correctAnswers={correctAnswers}
          initialQuestionCount={initialQuestionCount}
          onRestartQuiz={handleRestart}
        />
      ) : (
        <>
          <Question 
            question={isInRepeatPhase ? questionsToRepeat[currentQuestionIndex] : randomizedQuestions[currentQuestionIndex]} 
            onAnswerSubmit={handleAnswerSubmit}
            selectedAnswer={selectedAnswer}
            showJustification={showJustification}
            currentQuestionIndex={isInRepeatPhase ? initialQuestionCount + currentQuestionIndex : currentQuestionIndex}
            initialQuestionCount={initialQuestionCount}
            isInRepeatPhase={isInRepeatPhase}
          />
          {showJustification && selectedAnswer !== (isInRepeatPhase ? questionsToRepeat[currentQuestionIndex].correctAnswer : randomizedQuestions[currentQuestionIndex].correctAnswer) && (
            <button
              onClick={goToNextQuestion}
              className="quiz-button next-question"
            >
              {(isInRepeatPhase && currentQuestionIndex === questionsToRepeat.length - 1) ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
          
          <div className="quiz-keyboard-shortcuts">
            <p>Keyboard shortcuts: Press A, B, C to select answers | Press Enter to continue</p>
          </div>
        </>
      )}
    </div>
  );
}