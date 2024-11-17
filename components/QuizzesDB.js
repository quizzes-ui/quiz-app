'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UploadIcon } from './Icons';

const QuizzesDB = ({ onClose, onQuizActivated, quizzes, setQuizzes, orderModes, setOrderModes }) => {
  const [uploadError, setUploadError] = useState('');
  const [dbQuizzes, setDbQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const supabaseUrl = "https://kmnayihvsegmrppiuphc.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmF5aWh2c2VnbXJwcGl1cGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzEzODIsImV4cCI6MjA0NzM0NzM4Mn0.ScJsOY6aH0NEorfkUU29L-2fGlc9QQSRS8f6uHU_5hg";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('question-files')
        .select('name, content');
      
      if (error) throw error;

      const formattedQuizzes = data.map(item => ({
        id: item.name,
        title: JSON.parse(item.content).title,
        data: JSON.parse(item.content),
        isActive: false
      }));

      setDbQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setUploadError('Failed to fetch quizzes from the database');
    }
  };

  const handleActivate = (quizId) => {
    const updatedQuizzes = dbQuizzes.map(quiz => ({
      ...quiz,
      isActive: quiz.id === quizId
    }));
    setDbQuizzes(updatedQuizzes);
    const activatedQuiz = updatedQuizzes.find(quiz => quiz.id === quizId);
    onQuizActivated(activatedQuiz.data, orderModes[activatedQuiz.id] || 'random');
  };

  const handleDeactivate = () => {
    const updatedQuizzes = dbQuizzes.map(quiz => ({
      ...quiz,
      isActive: false
    }));
    setDbQuizzes(updatedQuizzes);
    onQuizActivated(null, 'random');
  };

  const toggleOrderMode = (quizId) => {
    setOrderModes(prev => ({
      ...prev,
      [quizId]: prev[quizId] === 'random' ? 'sequential' : 'random'
    }));
  };

  return (
    <div className="manage-quizzes-overlay">
      <div className="manage-quizzes-container">
        <h2>Manage Quizzes</h2>
        <div className="quizzes-list">
          {dbQuizzes.length === 0 ? (
            <p className="no-quizzes-message">No question files are loaded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th className="order-header">Order</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dbQuizzes.map(quiz => (
                  <tr key={quiz.id} className={quiz.isActive ? 'active-row' : ''}>
                    <td className="quiz-title-cell">{quiz.title}</td>
                    <td className="order-cell">
                      <button 
                        onClick={() => toggleOrderMode(quiz.id)}
                        className={`order-button ${orderModes[quiz.id] || 'random'}`}
                      >
                        {orderModes[quiz.id] === 'sequential' ? 'Sequential' : 'Random'}
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
            <button onClick={onClose} className="upload-button upload-green">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesDB;