import React, { useState } from 'react';
import { TrashIcon, UploadIcon } from './Icons';

const ManageQuizzes = ({ onClose, onQuizActivated, quizzes, setQuizzes, orderModes, setOrderModes }) => {
  const [uploadError, setUploadError] = useState('');

  const validateQuestionsFormat = (data) => {
    try {
      if (!data.title || !Array.isArray(data.questions)) {
        throw new Error('File must contain a title and questions array');
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
    const file = event.target.files[0];
    setUploadError('');

    if (!file) return;

    if (file.type !== 'application/json') {
      setUploadError('Please upload a JSON file');
      return;
    }

    try {
      const fileContent = await file.text();
      const parsedData = JSON.parse(fileContent);

      if (validateQuestionsFormat(parsedData)) {
        const existingQuiz = quizzes.find(quiz => quiz.title === parsedData.title);
        
        if (existingQuiz) {
          setUploadError('A quiz with this title already exists');
          return;
        }

        const newQuiz = {
          id: Date.now().toString(),
          title: parsedData.title,
          data: parsedData,
          isActive: true
        };
        
        setQuizzes(prevQuizzes => {
          const updatedQuizzes = prevQuizzes.map(quiz => ({
            ...quiz,
            isActive: false
          }));
          return [newQuiz, ...updatedQuizzes];
        });

        setOrderModes(prev => ({
          ...prev,
          [newQuiz.id]: 'random'
        }));
        
        onQuizActivated(parsedData);
      }
    } catch (error) {
      setUploadError('Invalid JSON file format');
    }

    event.target.value = '';
  };

  const handleDelete = (quizId) => {
    setQuizzes(prevQuizzes => {
      const updatedQuizzes = prevQuizzes.filter(quiz => quiz.id !== quizId);
      if (quizzes.find(q => q.id === quizId)?.isActive && updatedQuizzes.length > 0) {
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
  };

  const handleDeactivate = () => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => ({
        ...quiz,
        isActive: false
      }))
    );
    onQuizActivated(null, 'random');
  };

  const handleActivate = (quizId) => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => ({
        ...quiz,
        isActive: quiz.id === quizId
      }))
    );
    const activatedQuiz = quizzes.find(quiz => quiz.id === quizId);
    onQuizActivated(activatedQuiz.data, orderModes[quiz.id] || 'random');
  };

  const toggleOrderMode = (quizId) => {
    setOrderModes(prev => ({
      ...prev,
      [quizId]: prev[quizId] === 'random' ? 'sequential' : 'random'
    }));
    const updatedQuiz = quizzes.find(quiz => quiz.id === quizId);
    if (updatedQuiz.isActive) {
      onQuizActivated(updatedQuiz.data, orderModes[quiz.id] === 'random' ? 'sequential' : 'random');
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
          <div className="upload-buttons-container">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              id="quiz-file-input"
              className="file-input"
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
          {quizzes.length === 0 ? (
            <p className="no-quizzes-message">No question files are loaded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th className="questions-count-header">Questions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => (
                  <tr key={quiz.id} className={quiz.isActive ? 'active-row' : ''}>
                    <td className="quiz-title-cell">{quiz.title}</td>
                    <td className="questions-count-cell">{quiz.data.questions.length}</td>
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
    </div>
  );
};

export default ManageQuizzes;

