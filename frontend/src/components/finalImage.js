import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import './CoolImage.css';

const CoolImage = ({ imageUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'cool-image.jpg'; // You can customize the filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cool-image-container">
      <div className={`cool-image-wrapper ${isLoaded ? 'loaded' : ''}`}>
        <img
          src={imageUrl}
          alt="Cool animated"
          onLoad={() => setIsLoaded(true)}
          className="cool-image"
        />
      </div>
      <div className="cool-image-overlay">
        <span className="cool-image-text">Final Image</span>
      </div>
      <button className="cool-image-download" onClick={handleDownload}>
        <FaDownload /> Download
      </button>
    </div>
  );
};

export default CoolImage;
