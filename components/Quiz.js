// components/Quiz.js

import React, { useState, useEffect, useCallback } from 'react';
import ManageQuizzes from './ManageQuizzes';
import MenuDropdown from './MenuDropdown';
import { CheckIcon, XIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';


function Question({ question, onAnswerSubmit, selectedAnswer, showJustification, currentQuestionIndex, initialQuestionCount }) {
  if (!question) return null;

  const handleAnswerSelect = (answer) => {
    if (!selectedAnswer && !showJustification) {
      onAnswerSubmit(answer);
    }
  };

  return (
    <div className="question-container">
      <div className="progress-header">
        <h3>Question {Math.min(currentQuestionIndex + 1, initialQuestionCount)} of {initialQuestionCount}</h3>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((Math.min(currentQuestionIndex + 1, initialQuestionCount)) / initialQuestionCount) * 100}%` }}
          />
        </div>
      </div>
      {/* Rest of the Question component remains the same */}
    </div>
  );
}

function Header({ 
  title,
  onRestartQuiz,
  onManageQuizzes,
  orderModes,
  setOrderModes
}) {
  return (
    <div className="quiz-header-container">
      <h1 className="quiz-header">{title}</h1>
      <MenuDropdown 
        onRestartQuiz={onRestartQuiz}
        onManageQuizzes={onManageQuizzes}
        orderModes={orderModes}
        setOrderModes={setOrderModes}
      />
    </div>
  );
}

function QuizComplete({ correctAnswers, initialQuestionCount }) {
  const normalizedScore = (correctAnswers / initialQuestionCount) * 20;

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        window.location.reload();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <div className="complete-container">
      <h2 className="quiz-complete-text">Quiz Complete!</h2>
      <p className="final-score">{normalizedScore.toFixed(1)} / 20</p>
      <p className="raw-score">{correctAnswers} out of {initialQuestionCount} correct</p>
      <button onClick={() => window.location.reload()} className="quiz-button">
        Try Again
      </button>
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
      setInitialQuestionCount(randomized.length);  // Add this line
    } else {
      setRandomizedQuestions([]);
      setInitialQuestionCount(0);  // Add this line
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
      if (event.key === 'Enter' && showJustification && selectedAnswer !== randomizedQuestions[currentQuestionIndex].correctAnswer) {
        goToNextQuestion();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showJustification, selectedAnswer, currentQuestionIndex, randomizedQuestions, goToNextQuestion]);

  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer);
    setShowJustification(true);
    if (answer === randomizedQuestions[currentQuestionIndex].correctAnswer) {
      if (!isInRepeatPhase) {
        setCorrectAnswers(prev => prev + 1);
      }
      setTimeout(goToNextQuestion, CORRECT_ANSWER_DELAY);
    } else {
      const wrongQuestion = {
        ...randomizedQuestions[currentQuestionIndex],
        userAnswer: answer
      };
      setQuestionsToRepeat(prev => [...prev, wrongQuestion]);
    }
  };


  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowJustification(false);
    setIsQuizComplete(false);
    setCorrectAnswers(0);
    
    if (quizData && quizData.questions) {
      const currentQuestions = [...quizData.questions];
      const mode = quizData.id && orderModes[quizData.id] ? orderModes[quizData.id] : 'random';
      
      setRandomizedQuestions(mode === 'random' ? 
        currentQuestions.sort(() => Math.random() - 0.5) : 
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


  return (
    <div className="quiz-container">
      <Header 
        title={quizData?.title || "Quiz App"}
        onRestartQuiz={handleRestart}
        onManageQuizzes={() => setShowManageQuizzes(true)}
        orderModes={orderModes}
        setOrderModes={setOrderModes}
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
        <div>Loading...</div>
      ) : isQuizComplete ? (
        <QuizComplete 
          correctAnswers={correctAnswers}
          initialQuestionCount={initialQuestionCount}
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
          />
          {showJustification && (
            <button
              onClick={goToNextQuestion}
              className="quiz-button"
            >
              {(!isInRepeatPhase && currentQuestionIndex === randomizedQuestions.length - 1 && questionsToRepeat.length === 0) || 
               (isInRepeatPhase && currentQuestionIndex === questionsToRepeat.length - 1) ? 
                'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </>
      )}
    </div>
  );
}