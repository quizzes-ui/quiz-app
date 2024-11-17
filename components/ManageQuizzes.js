'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { UploadIcon } from './Icons'

const ManageQuizzes = ({ onClose, onQuizActivated, quizzes, setQuizzes, orderModes, setOrderModes }) => {
  const [uploadError, setUploadError] = useState('')
  const [dbQuizzes, setDbQuizzes] = useState([])

  // Ensure quizzes is always an array
  const safeQuizzes = Array.isArray(quizzes) ? quizzes : []

  useEffect(() => {
    console.log('ManageQuizzes component mounted')
    const supabaseUrl = "https://kmnayihvsegmrppiuphc.supabase.co"
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmF5aWh2c2VnbXJwcGl1cGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzEzODIsImV4cCI6MjA0NzM0NzM4Mn0.ScJsOY6aH0NEorfkUU29L-2fGlc9QQSRS8f6uHU_5hg"
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    async function fetchDbQuizzes() {
      try {
        console.log('Attempting to fetch quizzes from database...')
        const { data, error } = await supabase
          .from('question-files')
          .select('id, name, content')
          .not('content', 'is', null)
          .filter('content', 'neq', '{}')

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        console.log('Fetched data:', data)

        if (!data || data.length === 0) {
          console.log('No quizzes found in the database')
          setDbQuizzes([])
          return
        }

        const formattedDbQuizzes = data.map(quiz => {
          try {
            const parsedContent = typeof quiz.content === 'string' ? JSON.parse(quiz.content) : quiz.content
            return {
              id: quiz.id,
              title: quiz.name,
              data: parsedContent,
              isActive: false,
              isFromDb: true
            }
          } catch (parseError) {
            console.error(`Error parsing quiz content for quiz ${quiz.id}:`, parseError)
            return null
          }
        }).filter(quiz => quiz !== null)

        console.log('Formatted quizzes:', formattedDbQuizzes)

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
        setUploadError(`Failed to fetch quizzes from database: ${error.message}`)
      }
    }

    fetchDbQuizzes()
  }, [setOrderModes])

  // ... rest of the component code ...

  return (
    // ... JSX remains the same ...
  )
}

export default ManageQuizzes