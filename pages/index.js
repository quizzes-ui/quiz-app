import React from 'react';
import Quiz from '../components/Quiz';

const Home = () => {
  return (
    <div>
      <TestDB />
      <Quiz />
      <div className="version-tag">Version 3.3</div>
    </div>
    
  );
};

export default Home;

