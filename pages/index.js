import React from 'react';
import Quiz from '../components/Quiz';
import DatabaseDisplay from '../components/DatabaseDisplay';

const Home = () => {
  return (
    <div>
      <DatabaseDisplay />
      <Quiz />
    </div>
  );
};

export default Home;