import React, { useEffect, useState } from 'react';
import Quiz from '../components/Quiz';
import { put } from "@vercel/blob";

const Home = () => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const uploadFile = async () => {
      try {
        const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
        setUrl(url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    uploadFile();
  }, []);

  return (
    <div>
      <Quiz />
      
      <div className="version-tag">Version 3.5</div>
      {url && <p>File uploaded: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>}
    </div>
  );
};

export default Home;
