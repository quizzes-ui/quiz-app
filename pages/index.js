import React from 'react';
import Quiz from '../components/Quiz';
import { put } from "@vercel/blob";




const Home = () => {
  return (
    <div>
      const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
      <Quiz />
      <div className="version-tag">Version 3.5</div>
    </div>
  );
};

export default Home;
