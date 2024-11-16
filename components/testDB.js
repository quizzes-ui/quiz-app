'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function TestDB() {
  const [dbStatus, setDbStatus] = useState('Checking connection...')

  useEffect(() => {
    const supabaseUrl = "https://kmnayihvsegmrppiuphc.supabase.co"
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmF5aWh2c2VnbXJwcGl1cGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzEzODIsImV4cCI6MjA0NzM0NzM4Mn0.ScJsOY6aH0NEorfkUU29L-2fGlc9QQSRS8f6uHU_5hg"

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    async function testConnection() {
      try {
        const { data, error } = await supabase.from('quizzes').select('count', { count: 'exact', head: true })
        
        if (error) throw error

        setDbStatus('Connected successfully')
        console.log('Connection successful:', data)
      } catch (error) {
        console.error('Error connecting to the database:', error)
        setDbStatus('Failed to connect')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
      <p className="mb-2">Status: <span className={dbStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>{dbStatus}</span></p>
    </div>
  )
}