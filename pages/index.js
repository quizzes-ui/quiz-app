import React, { useEffect, useState } from 'react';
import Quiz from '../components/Quiz';

const Home = () => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const uploadFile = async () => {
      try {
        const response = await fetch('/api/upload', { method: 'POST' });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.url) {
          setUrl(data.url);
        } else {
          console.error('Upload failed: No URL returned from API');
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    };

    uploadFile();
  }, []);

  return (
    <div>
      <Quiz />

      <div className="version-tag">Version 3.5</div>
      
      {url && (
        <p>
          File uploaded: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </p>
      )}
    </div>
  );
};

export default Home;
