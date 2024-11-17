import React from 'react';
import Quiz from '../components/Quiz';
import TestDB from '../components/testDB';
import TestDB from '../components/questionsDB';


const Home = () => {
  return (
    <div>
      <QuestionsDB />
      <Quiz />
      <div className="version-tag">Version 3.1</div>
    </div>
    
  );
};

export default Home;

