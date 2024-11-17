'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { UploadIcon } from './Icons'  // Import from local Icons.js file

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

  // ... (rest of the component code remains unchanged)

  return (
    <div className="manage-quizzes-overlay">
      <div className="manage-quizzes-container">
        {/* ... (rest of the JSX remains unchanged) */}
        
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