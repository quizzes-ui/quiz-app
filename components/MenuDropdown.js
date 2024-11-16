import { useState, useEffect, useRef } from 'react'
import { MenuIcon, UploadIcon, RefreshCwIcon } from 'lucide-react'

function MenuDropdown({ 
  onRestartQuiz,
  uploadError,
  uploadSuccess,
  onManageQuizzes,
  orderModes,
  setOrderModes
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOrderModeChange = (quizId, mode) => {
    setOrderModes(prev => ({
      ...prev,
      [quizId]: mode
    }))
  }

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
            <button 
              onClick={() => {
                onRestartQuiz()
                setIsOpen(false)
              }} 
              className="restart-button" 
              title="Restart Quiz"
            >
              <RefreshCwIcon className="restart-icon" />
              <span>Restart Quiz</span>
            </button>
          </div>
          <div className="menu-item">
            <button onClick={() => {
              onManageQuizzes()
              setIsOpen(false)
            }} className="manage-quizzes-button">
              <UploadIcon />
              <span>Manage Quizzes</span>
            </button>
          </div>
          {Object.entries(orderModes).map(([quizId, mode]) => (
            <div key={quizId} className="menu-item">
              <span>Quiz {quizId} Order:</span>
              <select 
                value={mode} 
                onChange={(e) => handleOrderModeChange(quizId, e.target.value)}
                className="order-mode-select"
              >
                <option value="random">Random</option>
                <option value="sequential">Sequential</option>
              </select>
            </div>
          ))}
          {(uploadError || uploadSuccess) && (
            <div className="menu-item menu-messages">
              {uploadError && <p className="upload-error">{uploadError}</p>}
              {uploadSuccess && <p className="upload-success">{uploadSuccess}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MenuDropdown