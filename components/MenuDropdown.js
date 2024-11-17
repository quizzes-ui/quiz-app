import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, UploadIcon, RestartIcon, DatabaseIcon } from './Icons';

function MenuDropdown({ 
  isUsingCustomQuestions, 
  onResetToDefault, 
  onRestartQuiz,
  uploadError,
  uploadSuccess,
  onManageQuizzes,
  orderModes,
  setOrderModes,
  onManageDB // Add this new prop
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

          {/* Add the new Manage Database option */}
          <div className="menu-item">
            <button onClick={() => {
              onManageDB();
              setIsOpen(false);
            }} className="manage-db-button">
              <DatabaseIcon /> {/* You'll need to create this icon */}
              <span>Manage Database</span>
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
              <RestartIcon />
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