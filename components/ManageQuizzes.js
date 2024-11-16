import { useState } from 'react'
import { UploadIcon, Trash2Icon } from 'lucide-react'

const ManageQuizzes = ({ onClose, onQuizActivated, quizzes, setQuizzes, orderModes, setOrderModes }) => {
  const [uploadError, setUploadError] = useState('')

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
          const newQuizzes = [newQuiz, ...updatedQuizzes]
          localStorage.setItem('quizData', JSON.stringify(newQuizzes))
          return newQuizzes
        })

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
      
      setOrderModes(prev => {
        const newModes = { ...prev }
        delete newModes[quizId]
        return newModes
      })

      localStorage.setItem('quizData', JSON.stringify(updatedQuizzes))
      return updatedQuizzes
    })
  }

  const handleDeactivate = () => {
    setQuizzes(prevQuizzes => {
      const updatedQuizzes = prevQuizzes.map(quiz => ({
        ...quiz,
        isActive: false
      }))
      localStorage.setItem('quizData', JSON.stringify(updatedQuizzes))
      return updatedQuizzes
    })
    onQuizActivated(null, 'random')
  }

  const handleActivate = (quiz) => {
    setQuizzes(prevQuizzes => {
      const updatedQuizzes = prevQuizzes.map(q => ({
        ...q,
        isActive: q.id === quiz.id
      }))
      localStorage.setItem('quizData', JSON.stringify(updatedQuizzes))
      return updatedQuizzes
    })
    onQuizActivated(quiz.data, orderModes[quiz.id] || 'random')
  }

  return (
    <div className="manage-quizzes-overlay">
      <div className="manage-quizzes-modal">
        <h2>Manage Quizzes</h2>
        <div className="quiz-list">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-item">
              <span>{quiz.title}</span>
              <div className="quiz-actions">
                <button
                  onClick={() => handleActivate(quiz)}
                  className={`activate-button ${quiz.isActive ? 'active' : ''}`}
                >
                  {quiz.isActive ? 'Active' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(quiz.id)} className="delete-button">
                  <Trash2Icon size={16} />
                </button>
              </div>
            </div>
          ))}
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