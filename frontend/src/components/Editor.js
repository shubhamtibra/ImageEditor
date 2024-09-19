import React, { useState } from 'react';
import { FaUndo, FaCheck } from 'react-icons/fa';
import './Editor.css';

function Editor({ upstreamPreviewName, handleEdit }) {
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fileType, setFileType] = useState('jpg');

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const imageStyle = {
    filter: `saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`,
    transform: `rotate(${rotation}deg)`,
    transition: 'all 0.3s ease',
  };

  const renderSlider = (label, value, setValue, min = 0, max = 200) => (
    <div className="slider-container">
      <label htmlFor={label.toLowerCase()}>{label}</label>
      <input
        type="range"
        id={label.toLowerCase()}
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <span className="slider-value">{value}%</span>
    </div>
  );

  const handleProcessImage = async () => {
    handleEdit(saturation/100, brightness/100, contrast/100, rotation, fileType)
  };

  return (
    <div className="editor-container">
      <div className="image-container">
        {upstreamPreviewName && (
          <img
            id="previewImage"
            src={`http://localhost:10000/uploads/${upstreamPreviewName}`}
            alt="Preview"
            style={imageStyle}
          />
        )}
      </div>
      <div className="controls-container">
        {renderSlider('Saturation', saturation, setSaturation)}
        {renderSlider('Brightness', brightness, setBrightness)}
        {renderSlider('Contrast', contrast, setContrast)}
        <div className="button-group">
          <button className="rotate-button" onClick={handleRotate}>
            <FaUndo /> Rotate
          </button>
          <div className="file-type-selector">
            <label htmlFor="file-type">Convert to:</label>
            <select
              id="file-type"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="gif">GIF</option>
            </select>
          </div>
        </div>
        <button className="process-button" onClick={handleProcessImage}>
          <FaCheck /> Process Image
        </button>
      </div>
    </div>
  );
}

export default Editor;