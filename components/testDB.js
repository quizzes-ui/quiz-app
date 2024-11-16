'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function TestDB() {
  const [dbStatus, setDbStatus] = useState('Checking connection...')

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    async function testConnection() {
      try {
        const { data, error } = await supabase.rpc('ping')
        
        if (error) throw error

        setDbStatus('Connected successfully')
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