import React from 'react';
import Quiz from '../components/Quiz';
import TestDB from './components/TestDB';

const Home = () => {
  return (
    <div>
      <TestDB />
      <Quiz />
    </div>
  );
};

export default Home;



import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Quiz from './components/Quiz';
import TestDB from './components/TestDB';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TestDB />
    <Quiz />
  </React.StrictMode>