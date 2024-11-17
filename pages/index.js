import React from 'react';
import Quiz from '../components/Quiz';
import TestDB from '../components/testDB';
import QuestionsDB from '../components/questionsDB';


const Home = () => {
  return (
    <div>
      <Quiz />
      <div className="version-tag">Version 3.1</div>
    </div>
    
  );
};

export default Home;

