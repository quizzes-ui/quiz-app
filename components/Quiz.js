import React, { useState, useEffect, useCallback } from 'react'
import { loadDefaultQuestions } from '../utils/loadDefaultQuestions'
import QuizComplete from './QuizComplete'
import ManageQuizzes from './ManageQuizzes'

const LOCAL_STORAGE_KEY = 'quizData'

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([])
  const [quizData, setQuizData] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showJustification, setShowJustification] = useState(false)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [showManageQuizzes, setShowManageQuizzes] = useState(false)
  const [randomizedQuestions, setRandomizedQuestions] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [orderModes, setOrderModes] = useState({})

  useEffect(() => {
    const storedQuizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    if (storedQuizzes.length === 0) {
      const defaultQuizzes = loadDefaultQuestions()
      setQuizzes(defaultQuizzes)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultQuizzes))
    } else {
      setQuizzes(storedQuizzes)
    }
  }, [])

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
      setTimeout(goToNextQuestion, 1000)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowJustification(false)
    setIsQuizComplete(false)
    setCorrectAnswers(0)
    
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
      <h1 className="quiz-header">{quizData?.title || "Quiz App"}</h1>
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
      <div className="version-tag">Version 2.6</div>
    </div>
  )
}