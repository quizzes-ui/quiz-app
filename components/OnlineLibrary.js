import React, { useState, useRef, useEffect } from 'react';
import { balanceCorrectAnswers } from '../utils/quizUtils';
import { TrashIcon, InfoIcon, CheckIcon } from './Icons';
import UploadButton from './UploadButton';
import supabase from '../utils/supabaseClient';

const OnlineLibrary = ({ onClose, onQuizActivated }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const fileInputRef = useRef(null);

  const removeQuestion = async (quizId, questionId) => {
    try {
      // Find the quiz
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return;
      
      // Clone the quiz data and remove the question
      const updatedQuizData = { ...quiz.data };
      updatedQuizData.questions = updatedQuizData.questions.filter(q => q.id !== questionId);
      
      // Update the quiz in Supabase
      const { error } = await supabase
        .from('quizzes')
        .update({ data: updatedQuizData })
        .eq('id', quizId);
        
      if (error) {
        console.error('Error updating quiz:', error);
        return;
      }
      
      // Update local state
      setQuizzes(prevQuizzes => {
        return prevQuizzes.map(q => {
          if (q.id === quizId) {
            return { ...q, data: updatedQuizData };
          }
          return q;
        });
      });
      
      // If we're viewing this quiz, update the selectedQuiz state
      if (selectedQuiz && selectedQuiz.id === quizId) {
        setSelectedQuiz({
          ...selectedQuiz,
          data: updatedQuizData
        });
      }
      
      // If the quiz is active, update the active quiz
      if (quiz.is_active) {
        const activeQuizzes = quizzes.filter(q => q.is_active);
        
        if (activeQuizzes.length === 1) {
          // Only this quiz is active, update it
          onQuizActivated(updatedQuizData);
        } else if (activeQuizzes.length > 1) {
          // Multiple quizzes are active, update the combined quiz
          const combinedQuestions = [];
          activeQuizzes.forEach(activeQuiz => {
            if (activeQuiz.id === quizId) {
              // For the quiz we're modifying, use updated questions
              combinedQuestions.push(...updatedQuizData.questions);
            } else {
              // For other quizzes, include all questions
              combinedQuestions.push(...activeQuiz.data.questions);
            }
          });
          
          onQuizActivated({
            title: "Combo Quiz",
            questions: combinedQuestions
          });
        }
      }
    } catch (error) {
      console.error('Error removing question:', error);
    }
  };

  // Fetch quizzes from Supabase when component mounts
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching quizzes:', error);
        return;
      }
      
      setQuizzes(data || []);
    } catch (error) {
      console.error('Unexpected error fetching quizzes:', error);
    } finally {
      setIsLoading(false);
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
    if (!file) return;

    setIsUploading(true);
    try {
      // Read file content
      const fileContent = await file.text();
      
      // Parse JSON without validation
      let parsedData = JSON.parse(fileContent);
      
      // Add IDs to questions if they don't have them
      parsedData = addIdsToQuestions(parsedData);
      
      // Balance the correct answers distribution
      parsedData = balanceCorrectAnswers(parsedData);

      // Create the new quiz object
      const newQuiz = {
        title: parsedData.title || 'Untitled Quiz',
        data: parsedData,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('quizzes')
        .insert(newQuiz)
        .select()
        .single();
      
      if (error) {
        console.error('Error uploading quiz:', error);
        return;
      }
      
      // Update other quizzes to be inactive if this one is active
      if (data.is_active) {
        await supabase
          .from('quizzes')
          .update({ is_active: false })
          .neq('id', data.id);
      }
      
      // Refresh quizzes to get the updated list
      await fetchQuizzes();
      
      // Activate the new quiz
      onQuizActivated(parsedData);
    } catch (error) {
      console.error('File processing error:', error);
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDelete = async (quizId) => {
    if (quizToDelete === quizId) {
      // Second click - confirm deletion
      setIsDeleting(true);
      try {
        // Find if the quiz to delete is active
        const quizToDeleteItem = quizzes.find(q => q.id === quizId);
        const wasActive = quizToDeleteItem?.is_active;
        
        // Delete the quiz
        const { error } = await supabase
          .from('quizzes')
          .delete()
          .eq('id', quizId);
        
        if (error) {
          console.error('Error deleting quiz:', error);
          return;
        }
        
        // If deleted quiz was active, need to update active status
        if (wasActive) {
          // Get the updated list after deletion
          await fetchQuizzes();
          const remainingQuizzes = quizzes.filter(q => q.id !== quizId);
          
          if (remainingQuizzes.length > 0) {
            // Activate the first quiz
            const firstQuiz = remainingQuizzes[0];
            await supabase
              .from('quizzes')
              .update({ is_active: true })
              .eq('id', firstQuiz.id);
            
            onQuizActivated(firstQuiz.data);
          } else {
            onQuizActivated(null);
          }
        }
        
        // Refresh quizzes to get the updated list
        await fetchQuizzes();
      } catch (error) {
        console.error('Unexpected error deleting quiz:', error);
      } finally {
        setIsDeleting(false);
        setQuizToDelete(null);
      }
    } else {
      // First click - set quiz to be deleted
      setQuizToDelete(quizId);
      
      // Auto-reset the delete state after a timeout
      setTimeout(() => {
        setQuizToDelete(prevId => prevId === quizId ? null : prevId);
      }, 3000);
    }
  };

  const handleToggleActive = async (quizId) => {
    try {
      // Set loading state for this row
      setToggleLoadingId(quizId);
      
      // Find the quiz being toggled
      const quizToToggle = quizzes.find(q => q.id === quizId);
      
      if (!quizToToggle) {
        setToggleLoadingId(null);
        return;
      }
      
      // New active state is the opposite of current
      const newActiveState = !quizToToggle.is_active;
      
      // Optimistically update the UI first
      const updatedQuizzes = quizzes.map(quiz => {
        if (quiz.id === quizId) {
          return {
            ...quiz,
            is_active: newActiveState
          };
        }
        return quiz;
      });
      
      setQuizzes(updatedQuizzes);
      
      // Update the quiz's active state in the database
      await supabase
        .from('quizzes')
        .update({ is_active: newActiveState })
        .eq('id', quizId);
      
      // Calculate active quizzes based on the updated state, not the old state
      const activeQuizzes = updatedQuizzes.filter(quiz => quiz.is_active);
      
      // If no active quizzes, deactivate all
      if (activeQuizzes.length === 0) {
        onQuizActivated(null);
        setToggleLoadingId(null);
        return;
      }
      
      // If only one quiz is active, use its data directly
      if (activeQuizzes.length === 1) {
        onQuizActivated(activeQuizzes[0].data);
        setToggleLoadingId(null);
        return;
      }
      
      // If multiple quizzes are active, combine their questions
      const combinedQuestions = [];
      activeQuizzes.forEach(quiz => {
        if (quiz.data && quiz.data.questions && Array.isArray(quiz.data.questions)) {
          combinedQuestions.push(...quiz.data.questions);
        }
      });
      
      // Create a combined quiz with all questions
      const combinedQuiz = {
        title: "Combo Quiz",
        questions: combinedQuestions
      };
      
      onQuizActivated(combinedQuiz);
      
      // Always clear loading state at the end
      setToggleLoadingId(null);
    } catch (error) {
      console.error('Error toggling quiz active state:', error);
      
      // On error, revert back to original data
      fetchQuizzes();
      setToggleLoadingId(null);
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
  
  const getTotalQuestionCount = () => {
    const activeQuizzes = quizzes.filter(quiz => quiz?.is_active);
    let totalQuestions = 0;
    
    activeQuizzes.forEach(quiz => {
      if (quiz?.data?.questions?.length) {
        totalQuestions += quiz.data.questions.length;
      }
    });
    
    return totalQuestions;
  };

  return (
    <div className="manage-quizzes-overlay">
      <div className="manage-quizzes-container">
        <div className="manage-quizzes-header">
          <h2>Online Quiz Library</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="upload-section">
          <div className="upload-buttons-container">
            <div className="start-quiz-container">
              {getTotalQuestionCount() > 0 && (
                <button 
                  onClick={() => {
                    onClose();
                  }} 
                  className="start-quiz-button"
                  disabled={isLoading || isUploading || isDeleting}
                >
                  Start {getTotalQuestionCount()} questions quiz
                </button>
              )}
            </div>
            <UploadButton 
              onFileSelect={handleFileUpload}
              id="online-quiz-file-input"
              disabled={isUploading}
              isUploading={isUploading}
            />
          </div>
        </div>

        <div className="quizzes-list">
          {isLoading ? (
            <div className="loading-container-small">
              <div className="loading-spinner"></div>
              <p>Loading quizzes...</p>
            </div>
          ) : !quizzes || quizzes.length === 0 ? (
            <p className="no-quizzes-message">No question files are loaded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th className="questions-count-header-left">Questions</th>
                  <th className="actions-header"></th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => quiz && (
                  <tr key={quiz.id} className={quiz.is_active ? 'active-row' : ''}>
                    <td className="quiz-title-cell">{quiz.title}</td>
                    <td className="questions-count-cell-left">{quiz.data?.questions?.length || 0}</td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <div className="checkbox-container">
                          {toggleLoadingId === quiz.id ? (
                            <div className="spinner-tiny checkbox-spinner"></div>
                          ) : (
                            <input 
                              type="checkbox" 
                              id={`quiz-active-${quiz.id}`}
                              checked={quiz.is_active || false}
                              onChange={() => handleToggleActive(quiz.id)}
                              className="quiz-active-checkbox"
                              disabled={isLoading || isUploading || isDeleting || toggleLoadingId !== null}
                            />
                          )}
                        </div>
                        <button
                          onClick={() => viewQuizDetails(quiz)}
                          className="info-button-icon"
                          title="View quiz details"
                          disabled={isLoading || isUploading || isDeleting}
                        >
                          <InfoIcon />
                        </button>
                        <button 
                          onClick={() => handleDelete(quiz.id)}
                          className="delete-button-icon"
                          title={quizToDelete === quiz.id ? "Click again to confirm deletion" : "Delete quiz"}
                          disabled={isLoading || isUploading || isDeleting}
                        >
                          {quizToDelete === quiz.id ? <CheckIcon className="check-icon" /> : <TrashIcon />}
                          {isDeleting && quizToDelete === quiz.id && (
                            <div className="spinner-tiny"></div>
                          )}
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
                <p><strong>Date Added:</strong> {selectedQuiz.created_at ? formatDate(selectedQuiz.created_at) : 'N/A'}</p>
                <p><span className={selectedQuiz.is_active ? "status-active" : "status-inactive"}>{selectedQuiz.is_active ? "Active" : "Inactive"}</span></p>
              </div>
              <div className="quiz-questions-preview">
                <h4>Questions:</h4>
                <div className="questions-preview-list">
                  {selectedQuiz.data?.questions?.map((question, index) => (
                      <div key={`preview-${index}`} className="question-preview-item">
                        <div className="question-preview-header">
                          <p className="question-preview-text"><strong>Q{index + 1}:</strong> {question.texte}</p>
                          <button 
                            onClick={() => removeQuestion(selectedQuiz.id, question.id)}
                            className="delete-question-button-inline"
                            title="Remove this question"
                          >
                            <TrashIcon />
                          </button>
                        </div>
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
                onClick={async () => {
                  closeQuizDetails();
                  
                  // Set only this quiz to active
                  await supabase
                    .from('quizzes')
                    .update({ is_active: false })
                    .neq('id', selectedQuiz.id);
                  
                  await supabase
                    .from('quizzes')
                    .update({ is_active: true })
                    .eq('id', selectedQuiz.id);
                  
                  // Activate this quiz
                  onQuizActivated(selectedQuiz.data);
                  onClose();
                }} 
                className="start-quiz-button"
              >
                Start {selectedQuiz.data?.questions?.length || 0} questions quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineLibrary;