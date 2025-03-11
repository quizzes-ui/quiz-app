import React from 'react';
import Quiz from '../components/Quiz';

const Home = () => {
  return (
    <div>
      <Quiz />
      <div className="version-tag">Version 3.18</div>
    </div>
  );
};

export default Home;