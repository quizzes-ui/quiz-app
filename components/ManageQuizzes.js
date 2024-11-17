'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { UploadIcon } from 'lucide-react'

const ManageQuizzes = ({ onClose, onQuizActivated, quizzes, setQuizzes, orderModes, setOrderModes }) => {
  const [uploadError, setUploadError] = useState('')
  const [dbQuizzes, setDbQuizzes] = useState([])

  useEffect(() => {
    const supabaseUrl = "https://kmnayihvsegmrppiuphc.supabase.co"
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmF5aWh2c2VnbXJwcGl1cGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzEzODIsImV4cCI6MjA0NzM0NzM4Mn0.ScJsOY6aH0NEorfkUU29L-2fGlc9QQSRS8f6uHU_5hg"
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    async function fetchDbQuizzes() {
      try {
        const { data, error } = await supabase
          .from('question-files')
          .select('id, name, content')
          .not('content', 'is', null)
          .not('content', 'eq', '')

        if (error) throw error

        const formattedDbQuizzes = data.map(quiz => ({
          id: quiz.id,
          title: quiz.name,
          data: JSON.parse(quiz.content),
          isActive: false,
          isFromDb: true
        }))

        setDbQuizzes(formattedDbQuizzes)
        
        // Initialize order modes for new quizzes
        setOrderModes(prev => {
          const newModes = { ...prev }
          formattedDbQuizzes.forEach(quiz => {
            if (!newModes[quiz.id]) {
              newModes[quiz.id] = 'random'
            }
          })
          return newModes
        })

      } catch (error) {
        console.error('Error fetching DB quizzes:', error)
        setUploadError('Failed to fetch quizzes from database')
      }
    }

    fetchDbQuizzes()
  }, [setOrderModes])

  const validateQuestionsFormat = (data) => {
    try {
      if (!data.title || !Array.isArray(data.questions)) {
        throw new Error('File must contain a title and questions array')
      }

      data.questions.forEach((question, index) => {
        if (!question.id || 
            !question.texte || 
            !question.answerA ||
            !question.answerB ||
            !question.answerC ||
            !question.correctAnswer ||
            !question.justification) {
          throw new Error(`Question ${index + 1} is missing required fields`)
        }

        if (!['A', 'B', 'C'].includes(question.correctAnswer)) {
          throw new Error(`Question ${index + 1} has invalid correct answer`)
        }
      })

      return true
    } catch (error) {
      setUploadError(error.message)
      return false
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    setUploadError('')

    if (!file) return

    if (file.type !== 'application/json') {
      setUploadError('Please upload a JSON file')
      return
    }

    try {
      const fileContent = await file.text()
      const parsedData = JSON.parse(fileContent)

      if (validateQuestionsFormat(parsedData)) {
        const existingQuiz = quizzes.find(quiz => quiz.title === parsedData.title)
        
        if (existingQuiz) {
          setUploadError('A quiz with this title already exists')
          return
        }

        const newQuiz = {
          id: Date.now().toString(),
          title: parsedData.title,
          data: parsedData,
          isActive: true
        }
        
        setQuizzes(prevQuizzes => {
          const updatedQuizzes = prevQuizzes.map(quiz => ({
            ...quiz,
            isActive: false
          }))
          return [newQuiz, ...updatedQuizzes]
        })

        // Initialize order mode for new quiz
        setOrderModes(prev => ({
          ...prev,
          [newQuiz.id]: 'random'
        }))
        
        onQuizActivated(parsedData)
      }
    } catch (error) {
      setUploadError('Invalid JSON file format')
    }

    event.target.value = ''
  }

  const handleDelete = (quizId) => {
    setQuizzes(prevQuizzes => {
      const updatedQuizzes = prevQuizzes.filter(quiz => quiz.id !== quizId)
      if (quizzes.find(q => q.id === quizId)?.isActive && updatedQuizzes.length > 0) {
        updatedQuizzes[0].isActive = true
        onQuizActivated(updatedQuizzes[0].data, orderModes[updatedQuizzes[0].id] || 'random')
      } else if (updatedQuizzes.length === 0) {
        onQuizActivated(null)
      }
      
      // Update the orderModes state
      setOrderModes(prev => {
        const newModes = { ...prev }
        delete newModes[quizId]
        return newModes
      })

      return updatedQuizzes
    })
  }

  const handleDeactivate = () => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => ({
        ...quiz,
        isActive: false
      }))
    )
    setDbQuizzes(prevDbQuizzes =>
      prevDbQuizzes.map(quiz => ({
        ...quiz,
        isActive: false
      }))
    )
    onQuizActivated(null, 'random')
  }

  const toggleOrderMode = (quizId) => {
    const newMode = orderModes[quizId] === 'random' ? 'sequential' : 'random'
    setOrderModes(prev => ({
      ...prev,
      [quizId]: newMode
    }))
    
    const activeQuiz = [...quizzes, ...dbQuizzes].find(quiz => quiz.id === quizId && quiz.isActive)
    if (activeQuiz) {
      const quizWithId = {
        ...activeQuiz.data,
        id: activeQuiz.id
      }
      onQuizActivated(quizWithId, newMode)
    }
  }

  const handleActivate = (quizId) => {
    const allQuizzes = [...quizzes, ...dbQuizzes]
    const updatedQuizzes = allQuizzes.map(quiz => ({
      ...quiz,
      isActive: quiz.id === quizId
    }))
    
    const activeQuiz = updatedQuizzes.find(q => q.id === quizId)
    if (activeQuiz) {
      const quizWithId = {
        ...activeQuiz.data,
        id: activeQuiz.id
      }
      onQuizActivated(quizWithId, orderModes[quizId] || 'random')
    }

    setQuizzes(updatedQuizzes.filter(quiz => !quiz.isFromDb))
    setDbQuizzes(updatedQuizzes.filter(quiz => quiz.isFromDb))
  }

  const allQuizzes = [...quizzes, ...dbQuizzes]

  return (
    <div className="manage-quizzes-overlay">
      <div className="manage-quizzes-container">
        <div className="manage-quizzes-header">
          <h2>Manage Quizzes</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="quizzes-list">
          {allQuizzes.length === 0 ? (
            <p className="no-quizzes-message">No question files are loaded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th className="questions-count-header">Questions</th>
                  <th className="order-header">Order</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allQuizzes.map(quiz => (
                  <tr key={quiz.id} className={quiz.isActive ? 'active-row' : ''}>
                    <td className="quiz-title-cell">{quiz.title}</td>
                    <td className="questions-count-cell">{quiz.data.questions.length}</td>
                    <td className="order-cell">
                      <button 
                        onClick={() => toggleOrderMode(quiz.id)}
                        className={`order-button ${orderModes[quiz.id]}`}
                      >
                        {orderModes[quiz.id] === 'random' ? 'Random' : 'Sequential'}
                      </button>
                    </td>
                    <td className="quiz-actions-cell">
                      {quiz.isActive ? (
                        <button 
                          onClick={handleDeactivate}
                          className="activate-button active"
                        >
                          Active
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivate(quiz.id)}
                          className="activate-button inactive"
                        >
                          Inactive
                        </button>
                      )}
                      {!quiz.isFromDb && (
                        <button 
                          onClick={() => handleDelete(quiz.id)}
                          className="delete-button-icon"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="upload-section">
          {uploadError && <p className="upload-error">{uploadError}</p>}
          <div className="upload-buttons-container">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              id="quiz-file-input"
              className="file-input"
            />
            <label htmlFor="quiz-file-input" className="upload-button upload-orange">
              <UploadIcon />
              <span>Upload New Questions</span>
            </label>
            <button onClick={onClose} className="upload-button upload-green">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageQuizzes