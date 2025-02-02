import React from 'react';
import Quiz from '../components/Quiz';
import DBconnect from '../components/DBconnect';

const Home = () => {
  return (
    <div>
      <DBconnect />
      //<Quiz />
      <div className="version-tag">Version 3.5</div>
    </div>
  );
};

export default Home;
