import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, UploadIcon, RestartIcon } from './Icons';

function MenuDropdown({ 
  isUsingCustomQuestions, 
  onResetToDefault, 
  onRestartQuiz,
  uploadError,
  uploadSuccess,
  onManageQuizzes,
  orderModes,
  setOrderModes
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <button 
        className="menu-trigger-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <MenuIcon />
      </button>

      {isOpen && (
        <div className="menu-dropdown">
          <div className="menu-item">
            <button onClick={() => {
              onManageQuizzes();
              setIsOpen(false);
            }} className="manage-quizzes-button">
              <UploadIcon />
              <span>Manage Quizzes</span>
            </button>
          </div>

          {isUsingCustomQuestions && (
            <div className="menu-item">
              <button 
                className="reset-questions-button"
                onClick={onResetToDefault}
              >
                Reset to Default
              </button>
            </div>
          )}

          <div className="menu-item">
            <button 
              onClick={() => {
                onRestartQuiz();
                setIsOpen(false);
              }} 
              className="restart-button" 
              title="Restart Quiz"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                className="restart-icon"
              >
                <path 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Restart Quiz</span>
            </button>
          </div>

          {(uploadError || uploadSuccess) && (
            <div className="menu-item menu-messages">
              {uploadError && <p className="upload-error">{uploadError}</p>}
              {uploadSuccess && <p className="upload-success">{uploadSuccess}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuDropdown;