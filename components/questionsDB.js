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
          .select('id, name')
        
        if (error) throw error

        if (data && data.length > 0) {
          setQuestions(data)
          setDbStatus('Questions fetched successfully')
          console.log('Fetched questions:', data)
        } else {
          setDbStatus('No questions found in the database')
          console.log('No questions found')
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        setDbStatus(`Failed to fetch questions: ${error.message}`)
      }
    }

    fetchQuestions()
  }, [])

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
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? (
              questions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{question.id}</td>
                  <td className="py-2 px-4 border-b">{question.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-2 px-4 border-b text-center">No questions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Debug Information:</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify({ dbStatus, questions }, null, 2)}
        </pre>
      </div>
    </div>
  )
}