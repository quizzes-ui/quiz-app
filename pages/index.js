import React from 'react';
import Quiz from '../components/Quiz';
import TestDB from '../components/TestDB';

const Home = () => {
  return (
    <div>
      <TestDB />
      <Quiz />
    </div>
  );
};

export default Home;

