import React, { useState, useEffect, useCallback } from 'react';
import ManageQuizzes from './ManageQuizzes';
import MenuDropdown from './MenuDropdown';
import ManageDB from './ManageDB';
import { CheckIcon, XIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';

const CORRECT_ANSWER_DELAY = 1000;
const LOCAL_STORAGE_KEY = 'quizData';

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showJustification, setShowJustification] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [showManageQuizzes, setShowManageQuizzes] = useState(false);
  const [showManageDB, setShowManageDB] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizzes, setQuizzes] = useLocalStorage(LOCAL_STORAGE_KEY, []);
  const [orderModes, setOrderModes] = useState({});

  useEffect(() => {
    const modes = {};
    quizzes.forEach(quiz => {
      modes[quiz.id] = 'random';
    });
    setOrderModes(modes);
  }, [quizzes]);

  const handleQuizActivated = useCallback((activatedQuiz) => {
    setQuizData(activatedQuiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowJustification(false);
    setIsQuizComplete(false);
    setCorrectAnswers(0);
    
    const mode = orderModes[activatedQuiz.id] || 'random';
    let questions = [...activatedQuiz.questions];
    
    if (mode === 'random') {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    } else if (mode === 'alphabetical') {
      questions.sort((a, b) => a.texte.localeCompare(b.texte));
    }
    
    setRandomizedQuestions(questions);
  }, [orderModes]);

  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer);
    const currentQuestion = randomizedQuestions[currentQuestionIndex];
    
    if (answer === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      setTimeout(() => {
        goToNextQuestion();
      }, CORRECT_ANSWER_DELAY);
    } else {
      setShowJustification(true);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowJustification(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    handleQuizActivated(quizData);
  };

  const handleManageDB = () => {
    setShowManageDB(true);
  };

  return (
    <div className="quiz-container">
      <Header 
        title={quizData?.title || "Quiz App"}
        onRestartQuiz={handleRestart}
        onManageQuizzes={() => setShowManageQuizzes(true)}
        onManageDB={handleManageDB}
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
      {showManageDB && (
        <ManageDB
          onClose={() => setShowManageDB(false)}
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
          totalQuestions={randomizedQuestions.length}
        />
      ) : (
        <>
          <Question 
            question={randomizedQuestions[currentQuestionIndex]} 
            onAnswerSubmit={handleAnswerSubmit}
            selectedAnswer={selectedAnswer}
            showJustification={showJustification}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={randomizedQuestions.length}
          />
          {showJustification && selectedAnswer !== randomizedQuestions[currentQuestionIndex].correctAnswer && (
            <button
              onClick={goToNextQuestion}
              className="quiz-button"
            >
              {currentQuestionIndex === randomizedQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </>
      )}
      <div className="version-tag">Version 1.9</div>
    </div>
  );
}

function Header({ 
  title,
  onRestartQuiz,
  onManageQuizzes,
  onManageDB,
  orderModes,
  setOrderModes
}) {
  return (
    <div className="quiz-header-container">
      <h1 className="quiz-header">{title}</h1>
      <MenuDropdown 
        onRestartQuiz={onRestartQuiz}
        onManageQuizzes={onManageQuizzes}
        onManageDB={onManageDB}
        orderModes={orderModes}
        setOrderModes={setOrderModes}
      />
    </div>
  );
}

function Question({ question, onAnswerSubmit, selectedAnswer, showJustification, currentQuestionIndex, totalQuestions }) {
  if (!question) return null;

  const handleAnswerSelect = (answer) => {
    if (!selectedAnswer && !showJustification) {
      onAnswerSubmit(answer);
    }
  };

  return (
    <div className="question-container">
      <div className="progress-header">
        <h3>Question {currentQuestionIndex + 1} of {totalQuestions}</h3>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
      <h2>{question.texte}</h2>
      <div className="options-container">
        <label 
          className={`option-label ${selectedAnswer === 'A' ? 
            (question.correctAnswer === 'A' ? 'selected correct' : 'selected incorrect') : 
            (showJustification && question.correctAnswer === 'A' ? 'correct-answer' : '')} 
            ${showJustification ? 'disabled' : ''}`}
        >
          <input
            type="radio"
            name="answer"
            value="A"
            className="radio-input"
            onChange={() => handleAnswerSelect('A')}
            checked={selectedAnswer === 'A'}
          />
          <span className="option-text">{question.answerA}</span>
        </label>

        <label 
          className={`option-label ${selectedAnswer === 'B' ? 
            (question.correctAnswer === 'B' ? 'selected correct' : 'selected incorrect') : 
            (showJustification && question.correctAnswer === 'B' ? 'correct-answer' : '')} 
            ${showJustification ? 'disabled' : ''}`}
        >
          <input
            type="radio"
            name="answer"
            value="B"
            className="radio-input"
            onChange={() => handleAnswerSelect('B')}
            checked={selectedAnswer === 'B'}
          />
          <span className="option-text">{question.answerB}</span>
        </label>

        <label 
          className={`option-label ${selectedAnswer === 'C' ? 
            (question.correctAnswer === 'C' ? 'selected correct' : 'selected incorrect') : 
            (showJustification && question.correctAnswer === 'C' ? 'correct-answer' : '')} 
            ${showJustification ? 'disabled' : ''}`}
        >
          <input
            type="radio"
            name="answer"
            value="C"
            className="radio-input"
            onChange={() => handleAnswerSelect('C')}
            checked={selectedAnswer === 'C'}
          />
          <span className="option-text">{question.answerC}</span>
        </label>
      </div>

      {showJustification && (
        <div className={`justification ${selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
          <div className="feedback-with-icon">
            {selectedAnswer === question.correctAnswer ? <CheckIcon /> : <XIcon />}
            <p className="answer-feedback">
              {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
            </p>
          </div>
          {selectedAnswer !== question.correctAnswer && <p>{question.justification}</p>}
        </div>
      )}
    </div>
  );
}

function QuizComplete({ correctAnswers, totalQuestions }) {
  const normalizedScore = (correctAnswers / totalQuestions) * 20;

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
      <p className="raw-score">{correctAnswers} out of {totalQuestions} correct</p>
      <button onClick={() => window.location.reload()} className="quiz-button">
        Try Again
      </button>
    </div>
  );
}