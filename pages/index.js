import React from 'react';
import Quiz from '../components/Quiz';
import testDB from '../components/testDB';

const Home = () => {
  return (
    <div>
      <testDB />
      <Quiz />
      <div className="version-tag">Version 3.4</div>
    </div>
    
  );
};

export default Home;

