import React, { useRef, useState } from 'react';
import UploadImage from './components/uploadImage';
import Editor from './components/Editor.js';
import './App.css';
import CoolImage from './components/finalImage.js';

function App() {
  const [upstreamImageName, setUpstreamImageName] = useState("");
  const [upstreamPreviewName, setUpstreamPreviewName] = useState("");
  const [finalImageUrl, setFinalImageUrl] = useState("");
  const [previewImageObject, setPreviewImageObject] = useState(null);
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
      let image = new Image()
      image.src = `http://localhost:10000/uploads/${result.previewFilename}`
      setUpstreamPreviewName(result.previewFilename);
      image.onload = () => {
        setPreviewImageObject(image)
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = async (saturation, brightness, contrast, rotation, fileType, cropRect) => {
    const imageData = {
      filename: upstreamImageName,
      saturation,
      brightness,
      contrast,
      rotation,
      fileType,
      cropRect
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
        {finalImageUrl ? <CoolImage imageUrl={finalImageUrl}/> : previewImageObject ? <Editor upstreamPreviewName={upstreamPreviewName} handleEdit={handleEdit} imageObject={previewImageObject}/> : <UploadImage handleSubmit={handleSubmit}/> }
      </main>
    </div>
  );
}

export default App;
