'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function QuestionsDB() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabaseUrl = "https://kmnayihvsegmrppiuphc.supabase.co"
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmF5aWh2c2VnbXJwcGl1cGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzEzODIsImV4cCI6MjA0NzM0NzM4Mn0.ScJsOY6aH0NEorfkUU29L-2fGlc9QQSRS8f6uHU_5hg"

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    async function fetchQuestions() {
      try {
        const { data, error } = await supabase
          .from('question-files')
          .select('id, name')

        if (error) throw error

        setQuestions(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching questions:', error)
        setError('Failed to fetch questions')
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Questions Database</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Question File Name</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{question.id}</td>
                <td className="px-4 py-2">{question.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}