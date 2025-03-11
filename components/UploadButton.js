import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

const UploadButton = ({ onFileSelect, disabled = false, id = "quiz-file-input", isUploading = false }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-button-container">
      <button 
        onClick={handleButtonClick}
        className={`upload-icon-button ${isUploading ? 'uploading' : ''}`}
        disabled={disabled}
        type="button"
        title="Upload New Quiz"
      >
        {isUploading ? (
          <div className="spinner-small"></div>
        ) : (
          <UploadIcon />
        )}
      </button>
      <input
        type="file"
        accept=".json"
        onChange={onFileSelect}
        id={id}
        className="file-input"
        ref={fileInputRef}
        disabled={disabled}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadButton;
