import React, { useState } from 'react';
import Quiz from '../components/Quiz';

const Home = () => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testBlobUpload = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/upload', { method: 'POST' });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        setUrl(data.url);
      } else {
        throw new Error('No URL returned from API');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Quiz />
      <div className="version-tag">Version 3.5</div>

      {/* Button to trigger the blob upload */}
      <button onClick={testBlobUpload} disabled={loading}>
        {loading ? "Uploading..." : "Test Blob Upload"}
      </button>

      {/* Display results */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {url && (
        <p>
          File uploaded: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </p>
      )}
    </div>
  );
};

export default Home;
