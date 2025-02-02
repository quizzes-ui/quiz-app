import React from 'react';
import Quiz from '../components/Quiz';
import { put } from "@vercel/blob";




const Home = () => {

  const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
  
  return (
    <div>
      <Quiz />
      <div className="version-tag">Version 3.5</div>
    </div>
  );
};

export default Home;
