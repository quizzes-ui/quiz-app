import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, RestartIcon, LibraryIcon } from './Icons';

function MenuDropdown({ 
  onRestartQuiz,
  onOnlineLibrary
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
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

  const toggleInfo = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

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
              onOnlineLibrary();
              setIsOpen(false);
            }} className="online-library-button">
              <LibraryIcon />
              <span>Questions Library</span>
            </button>
          </div>


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

          <div className="menu-item">
            <button 
              onClick={toggleInfo} 
              className="keyboard-shortcuts-button"
            >
              <span>Keyboard Shortcuts</span>
            </button>
          </div>

          {showInfo && (
            <div className="menu-info">
              <h4>Keyboard Shortcuts</h4>
              <ul className="shortcuts-list">
                <li><strong>A, B, C</strong> - Select answer</li>
                <li><strong>Enter</strong> - Next question</li>
                <li><strong>Space</strong> - Start quiz</li>
                <li><strong>R</strong> - Restart quiz</li>
              </ul>
            </div>
          )}


        </div>
      )}
    </div>
  );
}

export default MenuDropdown;