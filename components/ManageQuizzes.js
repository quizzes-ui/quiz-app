import React, { useState, useRef } from 'react';
import { TrashIcon, UploadIcon, InfoIcon } from './Icons';

const ManageQuizzes = ({ onClose, onQuizActivated, quizzes = [], setQuizzes, orderModes = {}, setOrderModes }) => {
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const fileInputRef = useRef(null);

  const validateQuestionsFormat = (data) => {
    try {
      if (!data.title || !Array.isArray(data.questions)) {
        throw new Error('File must contain a title and questions array');
      }

      if (data.questions.length === 0) {
        throw new Error('Questions array cannot be empty');
      }

      data.questions.forEach((question, index) => {
        if (!question.id || 
            !question.texte || 
            !question.answerA ||
            !question.answerB ||
            !question.answerC ||
            !question.correctAnswer ||
            !question.justification) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }

        if (!['A', 'B', 'C'].includes(question.correctAnswer)) {
          throw new Error(`Question ${index + 1} has invalid correct answer`);
        }
      });

      return true;
    } catch (error) {
      setUploadError(error.message);
      return false;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    setUploadError('');
    setUploadSuccess('');

    if (!file) return;

    if (file.type !== 'application/json') {
      setUploadError('Please upload a JSON file');
      return;
    }

    try {
      const fileContent = await file.text();
      const parsedData = JSON.parse(fileContent);

      if (validateQuestionsFormat(parsedData)) {
        const existingQuiz = quizzes.find(quiz => quiz?.title === parsedData.title);
        
        if (existingQuiz) {
          setUploadError('A quiz with this title already exists');
          return;
        }

        const newQuiz = {
          id: Date.now().toString(),
          title: parsedData.title,
          data: parsedData,
          isActive: true,
          dateAdded: new Date().toISOString()
        };
        
        setQuizzes(prevQuizzes => {
          const updatedQuizzes = (prevQuizzes || []).map(quiz => 
            quiz ? {
              ...quiz,
              isActive: false
            } : null
          ).filter(Boolean);
          
          return [newQuiz, ...updatedQuizzes];
        });

        setOrderModes(prev => ({
          ...prev,
          [newQuiz.id]: 'random'
        }));
        
        onQuizActivated(parsedData);
        setUploadSuccess(`Successfully uploaded "${parsedData.title}" with ${parsedData.questions.length} questions`);
      }
    } catch (error) {
      setUploadError('Invalid JSON file format');
      console.error('Parse error:', error);
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDelete = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(prevQuizzes => {
        const updatedQuizzes = (prevQuizzes || []).filter(quiz => quiz?.id !== quizId);
        const activeQuizWasDeleted = quizzes.find(q => q?.id === quizId)?.isActive;
        
        if (activeQuizWasDeleted && updatedQuizzes.length > 0) {
          updatedQuizzes[0].isActive = true;
          onQuizActivated(updatedQuizzes[0].data, orderModes[updatedQuizzes[0].id] || 'random');
        } else if (updatedQuizzes.length === 0) {
          onQuizActivated(null);
        }
        
        setOrderModes(prev => {
          const newModes = { ...prev };
          delete newModes[quizId];
          return newModes;
        });

        return updatedQuizzes;
      });
    }
  };

  const handleDeactivate = () => {
    setQuizzes(prevQuizzes => 
      (prevQuizzes || []).map(quiz => 
        quiz ? {
          ...quiz,
          isActive: false
        } : null
      ).filter(Boolean)
    );
    onQuizActivated(null, 'random');
  };

  const handleActivate = (quizId) => {
    setQuizzes(prevQuizzes => 
      (prevQuizzes || []).map(quiz => 
        quiz ? {
          ...quiz,
          isActive: quiz.id === quizId
        } : null
      ).filter(Boolean)
    );
    
    const activatedQuiz = quizzes.find(quiz => quiz?.id === quizId);
    if (activatedQuiz?.data) {
      onQuizActivated(activatedQuiz.data, orderModes[quizId] || 'random');
    }
  };

  const toggleOrderMode = (quizId) => {
    setOrderModes(prev => ({
      ...prev,
      [quizId]: prev[quizId] === 'random' ? 'sequential' : 'random'
    }));
    
    const updatedQuiz = quizzes.find(quiz => quiz?.id === quizId);
    if (updatedQuiz?.isActive && updatedQuiz?.data) {
      onQuizActivated(updatedQuiz.data, orderModes[quizId] === 'random' ? 'sequential' : 'random');
    }
  };
  
  const viewQuizDetails = (quiz) => {
    if (quiz) {
      setSelectedQuiz(quiz);
      setShowQuizDetails(true);
    }
  };
  
  const closeQuizDetails = () => {
    setShowQuizDetails(false);
    setSelectedQuiz(null);
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <div className="manage-quizzes-overlay">
      <div className="manage-quizzes-container">
        <div className="manage-quizzes-header">
          <h2>Manage Quizzes</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="upload-section">
          {uploadError && <p className="upload-error">{uploadError}</p>}
          {uploadSuccess && <p className="upload-success">{uploadSuccess}</p>}
          <div className="upload-buttons-container">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              id="quiz-file-input"
              className="file-input"
              ref={fileInputRef}
            />
            <label htmlFor="quiz-file-input" className="upload-button upload-orange">
              <UploadIcon />
              <span>Upload New Questions</span>
            </label>
            <button onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }} className="upload-button upload-blue">
              <span>Browse Files</span>
            </button>
            <button onClick={onClose} className="upload-button upload-green">
              Start Quiz
            </button>
          </div>
        </div>

        <div className="quizzes-list">
          {!quizzes || quizzes.length === 0 ? (
            <p className="no-quizzes-message">No question files are loaded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th className="questions-count-header">Questions</th>
                  <th className="date-added-header">Date Added</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => quiz && (
                  <tr key={quiz.id} className={quiz.isActive ? 'active-row' : ''}>
                    <td className="quiz-title-cell">{quiz.title}</td>
                    <td className="questions-count-cell">{quiz.data?.questions?.length || 0}</td>
                    <td className="date-added-cell">{quiz.dateAdded ? formatDate(quiz.dateAdded) : 'N/A'}</td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          onClick={() => quiz.isActive ? handleDeactivate() : handleActivate(quiz.id)}
                          className={`activate-button ${quiz.isActive ? 'active' : 'inactive'}`}
                        >
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button 
                          onClick={() => toggleOrderMode(quiz.id)}
                          className={`order-button ${orderModes[quiz.id]}`}
                          disabled={!quiz.isActive}
                        >
                          {orderModes[quiz.id] === 'random' ? 'Random' : 'Sequential'}
                        </button>
                        <button
                          onClick={() => viewQuizDetails(quiz)}
                          className="info-button-icon"
                          title="View quiz details"
                        >
                          <InfoIcon />
                        </button>
                        <button 
                          onClick={() => handleDelete(quiz.id)}
                          className="delete-button-icon"
                          title="Delete quiz"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {showQuizDetails && selectedQuiz && (
        <div className="quiz-details-overlay">
          <div className="quiz-details-container">
            <div className="quiz-details-header">
              <h3>{selectedQuiz.title}</h3>
              <button className="close-button" onClick={closeQuizDetails}>
                &times;
              </button>
            </div>
            <div className="quiz-details-content">
              <div className="quiz-details-summary">
                <p><strong>Total Questions:</strong> {selectedQuiz.data?.questions?.length || 0}</p>
                <p><strong>Date Added:</strong> {selectedQuiz.dateAdded ? formatDate(selectedQuiz.dateAdded) : 'N/A'}</p>
                <p><strong>Quiz Status:</strong> {selectedQuiz.isActive ? 'Active' : 'Inactive'}</p>
                <p><strong>Question Order:</strong> {orderModes[selectedQuiz.id] === 'random' ? 'Random' : 'Sequential'}</p>
              </div>
              <div className="quiz-questions-preview">
                <h4>Questions Preview:</h4>
                <div className="questions-preview-list">
                  {selectedQuiz.data?.questions?.slice(0, 5).map((question, index) => (
                    <div key={question.id} className="question-preview-item">
                      <p className="question-preview-text"><strong>Q{index + 1}:</strong> {question.texte}</p>
                      <div className="question-preview-answers">
                        <p className={question.correctAnswer === 'A' ? 'correct-answer' : ''}>A: {question.answerA}</p>
                        <p className={question.correctAnswer === 'B' ? 'correct-answer' : ''}>B: {question.answerB}</p>
                        <p className={question.correctAnswer === 'C' ? 'correct-answer' : ''}>C: {question.answerC}</p>
                      </div>
                    </div>
                  ))}
                  {selectedQuiz.data?.questions?.length > 5 && (
                    <p className="more-questions-note">
                      ...and {selectedQuiz.data.questions.length - 5} more questions
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="quiz-details-actions">
              <button 
                onClick={() => {
                  closeQuizDetails();
                  if (!selectedQuiz.isActive) {
                    handleActivate(selectedQuiz.id);
                  }
                  onClose();
                }} 
                className="quiz-button"
              >
                Start This Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;