import React from 'react';
import Quiz from '../components/Quiz';
import TestDB from '../components/testDB';

const Home = () => {
  return (
    <div>
      <TestDB />
      <Quiz />
      <div className="version-tag">Version 3.1</div>
    </div>
    
  );
};

export default Home;

