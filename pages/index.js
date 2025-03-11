import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import ManageQuizzes from '../components/ManageQuizzes';
import LibraryDB from '../components/LibraryDB';

const Home = () => {
  const [showManageQuizzes, setShowManageQuizzes] = useState(false);
  const [showLibraryDB, setShowLibraryDB] = useState(false);
  const [quizData, setQuizData] = useState(null);
  
  const handleQuizActivated = (data) => {
    setQuizData(data);
  };
  
  return (
    <div>
      <Quiz 
        initialQuizData={quizData} 
        onManageQuizzes={() => setShowManageQuizzes(true)}
        onLibraryDB={() => setShowLibraryDB(true)}
      />
      
      {showManageQuizzes && (
        <ManageQuizzes 
          onClose={() => setShowManageQuizzes(false)}
          onQuizActivated={handleQuizActivated}
        />
      )}
      
      {showLibraryDB && (
        <LibraryDB 
          onClose={() => setShowLibraryDB(false)}
          onQuizActivated={handleQuizActivated}
        />
      )}
      
      <div className="version-tag">Version 3.9</div>
    </div>
  );
};

export default Home;
