import React, { useState, useRef } from 'react';
import { TrashIcon, UploadIcon, InfoIcon, CheckIcon } from './Icons';

const ManageQuizzes = ({ onClose, onQuizActivated, quizzes = [], setQuizzes, orderModes = {}, setOrderModes }) => {
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
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
        if (!question.texte || 
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

  const addIdsToQuestions = (data) => {
    // Clone the data to avoid mutating the original
    const processedData = { ...data };
    
    // Add IDs to questions if they don't have one
    if (processedData.questions && Array.isArray(processedData.questions)) {
      processedData.questions = processedData.questions.map((question, index) => {
        // If question doesn't have an ID, add one
        if (!question.id) {
          return {
            ...question,
            id: `q-${Date.now()}-${index}`  // Create a unique ID using timestamp and index
          };
        }
        return question;
      });
    }
    
    return processedData;
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
      // Read file content
      const fileContent = await file.text();
      
      // Try to parse JSON, with a more lenient approach
      let parsedData;
      try {
        parsedData = JSON.parse(fileContent);
      } catch (jsonError) {
        console.warn('JSON parse error, attempting to clean up the content...', jsonError);
        
        // Try to fix common JSON issues - simplified approach
        try {
          // Attempt to manually extract title and questions
          const cleanedContent = fileContent
            .replace(/[\u2018\u2019]/g, "'") // Replace curly quotes
            .replace(/[\u201C\u201D]/g, '"'); // Replace curly double quotes
          
          parsedData = JSON.parse(cleanedContent);
        } catch (secondError) {
          // If we still can't parse it, show the error
          console.error('Failed to parse JSON after cleanup:', secondError);
          setUploadError('Unable to parse the JSON file. Please check the format.');
          return;
        }
      }

      // Validate required structure but be more lenient
      if (!parsedData.title || !Array.isArray(parsedData.questions)) {
        setUploadError('File must contain a title and questions array');
        return;
      }
      
      if (parsedData.questions.length === 0) {
        setUploadError('Questions array cannot be empty');
        return;
      }
      
      // Check if questions have the minimum required structure
      let hasInvalidQuestions = false;
      let errorMsg = '';
      
      parsedData.questions.forEach((question, index) => {
        if (!question.texte || 
            !question.answerA ||
            !question.answerB ||
            !question.answerC ||
            !question.correctAnswer ||
            !question.justification) {
          hasInvalidQuestions = true;
          errorMsg = `Question ${index + 1} is missing required fields`;
        }

        if (!['A', 'B', 'C'].includes(question.correctAnswer)) {
          hasInvalidQuestions = true;
          errorMsg = `Question ${index + 1} has invalid correct answer`;
        }
      });
      
      if (hasInvalidQuestions) {
        setUploadError(errorMsg);
        return;
      }

      // If we got this far, the structure is good enough
      // Add IDs to questions if they don't have them
      parsedData = addIdsToQuestions(parsedData);
      
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
    } catch (error) {
      // Only log the error but don't show it to the user if we've gotten this far
      console.error('File processing error:', error);
      
      // Try to continue with what we have if possible
      try {
        // If we can extract a title and at least one valid question, try to proceed
        if (parsedData && parsedData.title && Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
          parsedData = addIdsToQuestions(parsedData);
          
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
          return;
        }
      } catch (recoveryError) {
        console.error('Could not recover from error:', recoveryError);
      }
      
      // Only show error to user if we couldn't recover
      setUploadError('Error processing the file. Please check the format.');
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDelete = (quizId) => {
    if (quizToDelete === quizId) {
      // Second click - confirm deletion
      setQuizzes(prevQuizzes => {
        const updatedQuizzes = (prevQuizzes || []).filter(quiz => quiz?.id !== quizId);
        const activeQuizWasDeleted = quizzes.find(q => q?.id === quizId)?.isActive;
        
        if (activeQuizWasDeleted && updatedQuizzes.length > 0) {
          updatedQuizzes[0].isActive = true;
          onQuizActivated(updatedQuizzes[0].data);
        } else if (updatedQuizzes.length === 0) {
          onQuizActivated(null);
        }
        
        return updatedQuizzes;
      });
      setQuizToDelete(null);
    } else {
      // First click - set quiz to be deleted
      setQuizToDelete(quizId);
      
      // Auto-reset the delete state after a timeout
      setTimeout(() => {
        setQuizToDelete(prevId => prevId === quizId ? null : prevId);
      }, 3000);
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
    onQuizActivated(null);
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
      onQuizActivated(activatedQuiz.data);
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
                          onClick={() => viewQuizDetails(quiz)}
                          className="info-button-icon"
                          title="View quiz details"
                        >
                          <InfoIcon />
                        </button>
                        <button 
                          onClick={() => handleDelete(quiz.id)}
                          className="delete-button-icon"
                          title={quizToDelete === quiz.id ? "Click again to confirm deletion" : "Delete quiz"}
                        >
                          {quizToDelete === quiz.id ? <CheckIcon /> : <TrashIcon />}
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
              </div>
              <div className="quiz-questions-preview">
                <h4>Questions:</h4>
                <div className="questions-preview-list">
                  {selectedQuiz.data?.questions?.map((question, index) => (
                    <div key={`preview-${index}`} className="question-preview-item">
                      <p className="question-preview-text"><strong>Q{index + 1}:</strong> {question.texte}</p>
                      <div className="question-preview-answers">
                        <p className={question.correctAnswer === 'A' ? 'correct-answer' : ''}>A: {question.answerA}</p>
                        <p className={question.correctAnswer === 'B' ? 'correct-answer' : ''}>B: {question.answerB}</p>
                        <p className={question.correctAnswer === 'C' ? 'correct-answer' : ''}>C: {question.answerC}</p>
                      </div>
                    </div>
                  ))}
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