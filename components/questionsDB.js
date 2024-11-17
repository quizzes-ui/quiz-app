'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function QuestionsDB() {
  const [questions, setQuestions] = useState([])
  const [dbStatus, setDbStatus] = useState('Fetching questions...')

  useEffect(() => {
    const supabaseUrl = "https://kmnayihvsegmrppiuphc.supabase.co"
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmF5aWh2c2VnbXJwcGl1cGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzEzODIsImV4cCI6MjA0NzM0NzM4Mn0.ScJsOY6aH0NEorfkUU29L-2fGlc9QQSRS8f6uHU_5hg"

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    async function fetchQuestions() {
      try {
        const { data, error } = await supabase
          .from('question-files')
          .select('id, name, created_at, content')
        
        if (error) throw error

        if (data && data.length > 0) {
          setQuestions(data)
          setDbStatus('Questions fetched successfully')
        } else {
          setDbStatus('No questions found in the database')
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        setDbStatus(`Failed to fetch questions: ${error.message}`)
      }
    }

    fetchQuestions()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatContent = (content) => {
    if (!content) return 'No content available'

    if (typeof content === 'string') {
      try {
        content = JSON.parse(content)
      } catch (e) {
        return 'Invalid JSON'
      }
    }

    if (typeof content !== 'object' || content === null) {
      return 'Invalid content format'
    }

    const title = content.title || 'Untitled'
    const questionCount = Array.isArray(content.questions) ? content.questions.length : 0

    return `${title} (${questionCount} questions)`
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Questions Database</h2>
      <p className="mb-4">Status: <span className={dbStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>{dbStatus}</span></p>
      <p className="mb-4">Number of questions: {questions.length}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Question File Name</th>
              <th className="py-2 px-4 border-b text-left">Created At</th>
              <th className="py-2 px-4 border-b text-left">Content Preview</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? (
              questions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{question.id}</td>
                  <td className="py-2 px-4 border-b">{question.name}</td>
                  <td className="py-2 px-4 border-b">{formatDate(question.created_at)}</td>
                  <td className="py-2 px-4 border-b">{formatContent(question.content)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 border-b text-center">No questions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}