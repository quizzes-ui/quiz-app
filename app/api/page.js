import React, { useState, useRef } from 'react';
import Quiz from '../../components/Quiz';

export default function Home() {
  const inputFileRef = useRef(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!inputFileRef.current?.files.length) {
      setError("No file selected");
      return;
    }

    const file = inputFileRef.current.files[0];
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      setBlobUrl(data.url);
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

      <form onSubmit={handleUpload}>
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {blobUrl && (
        <p>
          File uploaded: <a href={blobUrl} target="_blank" rel="noopener noreferrer">{blobUrl}</a>
        </p>
      )}
    </div>
  );
}
