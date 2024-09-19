import React, { useRef, useState } from 'react';
import UploadImage from './components/uploadImage';
import Editor from './components/Editor.js';
import './App.css';
import CoolImage from './components/finalImage.js';

function App() {
  const [upstreamImageName, setUpstreamImageName] = useState("");
  const [upstreamPreviewName, setUpstreamPreviewName] = useState("");
  const [finalImageUrl, setFinalImageUrl] = useState("");
  const handleSubmit = async (selectedFile) => {
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await fetch("http://localhost:10000/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      const result = await response.json();
      setUpstreamImageName(result.filename);
      setUpstreamPreviewName(result.previewFilename);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = async (saturation, brightness, contrast, rotation, fileType) => {
    const imageData = {
      filename: upstreamImageName,
      saturation,
      brightness,
      contrast,
      rotation,
      fileType
    };
    try {
      const response = await fetch('http://localhost:10000/api/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      const result = await response.json();
      setFinalImageUrl(result.url);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Upload and Editor</h1>
      </header>
      <main className="App-main">
        { finalImageUrl ? <CoolImage imageUrl={finalImageUrl}/> : upstreamPreviewName ? <Editor upstreamPreviewName={upstreamPreviewName} handleEdit={handleEdit}/> : <UploadImage handleSubmit={handleSubmit}/> }
      </main>
    </div>
  );
}

export default App;
