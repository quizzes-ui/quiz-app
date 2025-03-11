import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import ManageQuizzes from '../components/ManageQuizzes';
import LibraryDB from '../components/LibraryDB';

const Home = () => {
  // State for showing different library windows
  const [showLocalLibrary, setShowLocalLibrary] = useState(false);
  const [showOnlineLibrary, setShowOnlineLibrary] = useState(false);
  
  // State for active quiz data
  const [quizData, setQuizData] = useState(null);
  const [dataSource, setDataSource] = useState('local'); // Track data source: 'local' or 'online'
  
  // Handle quiz activation from either source
  const handleLocalQuizActivated = (data) => {
    setQuizData(data);
    setDataSource('local');
  };
  
  const handleOnlineQuizActivated = (data) => {
    setQuizData(data);
    setDataSource('online');
  };
  
  return (
    <div>
      {/* Main Quiz component */}
      <Quiz 
        initialQuizData={quizData} 
        onManageQuizzes={() => {
          setShowLocalLibrary(true);
          setShowOnlineLibrary(false);
        }}
        onLibraryDB={() => {
          setShowOnlineLibrary(true);
          setShowLocalLibrary(false);
        }}
        dataSource={dataSource}
      />
      
      {/* Local Library (original working version) */}
      {showLocalLibrary && (
        <ManageQuizzes 
          onClose={() => setShowLocalLibrary(false)}
          onQuizActivated={handleLocalQuizActivated}
        />
      )}
      
      {/* Online Library (Supabase version) */}
      {showOnlineLibrary && (
        <LibraryDB 
          onClose={() => setShowOnlineLibrary(false)}
          onQuizActivated={handleOnlineQuizActivated}
        />
      )}
      
      <div className="version-tag">Version 3.10</div>
    </div>
  );
};

export default Home;