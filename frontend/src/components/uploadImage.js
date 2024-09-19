import React, { useState } from "react";
import "./uploadImage.css";

export default function UploadImage({handleSubmit}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLocalPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-container">
      <form
        className="upload-form"
        id="uploadForm"
        onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(selectedFile);
        }}
        encType="multipart/form-data"
      >
        <div className="file-input-wrapper">
          <input 
            type="file" 
            name="image" 
            id="imageInput" 
            onChange={handleFileChange}
            accept="image/*" 
          />
          <label htmlFor="imageInput" className="file-input-label">
            {selectedFile ? (
              localPreviewUrl ? (
                <img src={localPreviewUrl} alt="Preview" className="image-preview" />
              ) : (
                <span className="file-name">{selectedFile.name}</span>
              )
            ) : (
              <span>Choose an image or drag it here</span>
            )}
          </label>
        </div>
        <button type="submit" className="upload-button" disabled={!selectedFile}>
          Upload
        </button>
      </form>
    </div>
  );
}