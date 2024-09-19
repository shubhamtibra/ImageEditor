import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const [previewUrl, setPreviewUrl] = useState('');
  const imageInputRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', imageInputRef.current.files[0]);

    try {
      const response = await fetch('http://localhost:10000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const result = await response.json();
      setPreviewUrl(result.previewUrl);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="App">
      <form id="uploadForm" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="image" id="imageInput" ref={imageInputRef} />
        <button type="submit">Upload</button>
      </form>
      {previewUrl && (
        <img id="previewImage" src={previewUrl} alt="Preview" style={{ display: 'block' }} />
      )}
    </div>
  );
}

export default App;
