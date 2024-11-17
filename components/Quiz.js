'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import Header from './Header'
import Question from './Question'
import ManageQuizzes from './ManageQuizzes'

function QuizComplete({ correctAnswers, totalQuestions, wrongAnswers }) {
  const normalizedScore = (correctAnswers / totalQuestions) * 20

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        window.location.reload()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

  return (
    <div className="complete-container">
      <h2 className="quiz-complete-text">Quiz Complete!</h2>
      <p className="final-score">{normalizedScore.toFixed(1)} / 20</p>
      <p className="raw-score">{correctAnswers} out of {totalQuestions} correct</p>
      {wrongAnswers.length > 0 && (
        <div className="wrong-answers-table">
          <h3>Questions Answered Incorrectly:</h3>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {wrongAnswers.map((item, index) => (
                <tr key={index}>
                  <td>{item.question}</td>
                  <td className="wrong-answer">{item.userAnswer}</td>
                  <td className="correct-answer">{item.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={() => window.location.reload()} className="quiz-button">
        Try Again
      </button>
    </div>
  )
}

export default function Quiz() {
  const CORRECT_ANSWER_DELAY = 1000
  const LOCAL_STORAGE_KEY = 'quizData'

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showJustification, setShowJustification] = useState(false)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [quizData, setQuizData] = useState(null)
  const [showManageQuizzes, setShowManageQuizzes] = useState(false)
  const [randomizedQuestions, setRandomizedQuestions] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizzes, setQuizzes] = useLocalStorage(LOCAL_STORAGE_KEY, [])
  const [orderModes, setOrderModes] = useState({})
  const [wrongAnswers, setWrongAnswers] = useState([])

  useEffect(() => {
    const modes = {}
    quizzes.forEach(quiz => {
      modes[quiz.id] = 'random'
    })
    setOrderModes(modes)
  }, [quizzes])

  useEffect(() => {
    const activeQuiz = quizzes.find(quiz => quiz.isActive)
    if (activeQuiz) {
      const quizWithId = {
        ...activeQuiz.data,
        id: activeQuiz.id
      }
      setQuizData(quizWithId)
      setOrderModes(prev => ({
        ...prev,
        [activeQuiz.id]: activeQuiz.orderMode || 'random'
      }))
    } else {
      setQuizData(null)
      setOrderModes({})
    }
  }, [quizzes])

  useEffect(() => {
    if (quizData && quizData.questions) {
      const currentQuestions = [...quizData.questions]
      const mode = quizData.id && orderModes[quizData.id] ? orderModes[quizData.id] : 'random'
      
      setRandomizedQuestions(mode === 'random' ? 
        currentQuestions.sort(() => Math.random() - 0.5) : 
        currentQuestions
      )
    } else {
      setRandomizedQuestions([])
    }
  }, [quizData, orderModes])

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowJustification(false)
    } else {
      setIsQuizComplete(true)
    }
  }, [currentQuestionIndex, randomizedQuestions.length])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && showJustification && selectedAnswer !== randomizedQuestions[currentQuestionIndex].correctAnswer) {
        goToNextQuestion()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [showJustification, selectedAnswer, currentQuestionIndex, randomizedQuestions, goToNextQuestion])

  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer)
    setShowJustification(true)
    if (answer === randomizedQuestions[currentQuestionIndex].correctAnswer) {
      setCorrectAnswers(prev => prev + 1)
      setTimeout(goToNextQuestion, CORRECT_ANSWER_DELAY)
    } else {
      setWrongAnswers(prev => [
        ...prev,
        {
          question: randomizedQuestions[currentQuestionIndex].texte,
          userAnswer: randomizedQuestions[currentQuestionIndex][`answer${answer}`],
          correctAnswer: randomizedQuestions[currentQuestionIndex][`answer${randomizedQuestions[currentQuestionIndex].correctAnswer}`]
        }
      ])
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowJustification(false)
    setIsQuizComplete(false)
    setCorrectAnswers(0)
    setWrongAnswers([])
    
    if (quizData && quizData.questions) {
      const currentQuestions = [...quizData.questions]
      const mode = quizData.id && orderModes[quizData.id] ? orderModes[quizData.id] : 'random'
      
      setRandomizedQuestions(mode === 'random' ? 
        currentQuestions.sort(() => Math.random() - 0.5) : 
        currentQuestions
      )
    }
  }

  const handleQuizActivated = (quizData, orderMode) => {
    if (!quizData) {
      setQuizData(null)
      setRandomizedQuestions([])
      return
    }
    
    setQuizData(quizData)
    setOrderModes(prev => ({
      ...prev,
      [quizData.id]: orderMode || 'random'
    }))
    
    handleRestart()
  }

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
          totalQuestions={randomizedQuestions.length}
          wrongAnswers={wrongAnswers}
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
      <div className="version-tag">Version 3.3</div>
    </div>
  )
}