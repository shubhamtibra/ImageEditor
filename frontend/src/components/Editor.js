import React, { useEffect, useState, useRef } from 'react';
import { FaUndo, FaCheck, FaCrop, FaTimes } from 'react-icons/fa';
import './Editor.css';
import Canvas from './Canvas';

function Editor({ upstreamPreviewName, handleEdit, imageObject}) {
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fileType, setFileType] = useState('jpg');
  const [croppingStatus, setCroppingStatus] = useState("not-cropping");
  const [cropRect, setCropRect] = useState(null);
  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };
  const handleCropClick = () => {
    if (croppingStatus == "not-cropping") {
        setCroppingStatus("cropping")
    }
    if (croppingStatus == "area-selected") {
        handleEdit(saturation/100, brightness/100, contrast/100, rotation, fileType, cropRect)
    }
    if (croppingStatus == "cropping") {
        setCroppingStatus("not-cropping")
    }
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
    handleEdit(saturation/100, brightness/100, contrast/100, rotation, fileType, cropRect)
  };

  return (
    <div className="editor-container">
    <div className={`canvas-container ${croppingStatus == "cropping" ? 'cropping' : ''}`}>
      <Canvas 
        imageObject={imageObject}
        cropingStatus={croppingStatus}
        setCropingStatus={setCroppingStatus}
        setCropRect={setCropRect}
      />
      {croppingStatus == "cropping" && <div className="crop-guide">Select area to crop</div>}
      </div>
      <div className="controls-container">
        {renderSlider('Saturation', saturation, setSaturation)}
        {renderSlider('Brightness', brightness, setBrightness)}
        {renderSlider('Contrast', contrast, setContrast)}
        <div className="button-group">
          <button 
            className={`editor-button crop-button ${croppingStatus == "cropping" ? 'active' : ''}`} 
            onClick={handleCropClick}
          >
            {croppingStatus == "not-cropping" ? <><FaCrop /> Crop</> : (croppingStatus == "area-selected" ? "Crop Selection" : <><FaTimes /> Cancel Crop</>) }
          </button>
          <button className="editor-button rotate-button" onClick={handleRotate}>
            <FaUndo /> Rotate
          </button>
          <div className="file-type-selector">
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