'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function TestDB() {
  const [dbStatus, setDbStatus] = useState('Checking connection...')
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    async function fetchQuizzes() {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('id, createdAt, question_file_name')
          .order('createdAt', { ascending: false })
          .limit(10)

        if (error) throw error

        setDbStatus('Connected successfully')
        setQuizzes(data)
      } catch (error) {
        console.error('Error connecting to the database:', error)
        setDbStatus('Failed to connect')
      }
    }

    fetchQuizzes()
  }, [])

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
      <p className="mb-4">Status: <span className={dbStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>{dbStatus}</span></p>
      
      {quizzes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Created At</th>
                <th className="py-2 px-4 border-b text-left">Question File Name</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td className="py-2 px-4 border-b">{quiz.id}</td>
                  <td className="py-2 px-4 border-b">{new Date(quiz.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{quiz.question_file_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}