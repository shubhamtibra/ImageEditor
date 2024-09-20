import React, { useEffect, useState, useRef } from 'react';
import { FaUndo, FaCheck } from 'react-icons/fa';
import './Editor.css';

function Editor({ upstreamPreviewName, handleEdit, imageObject}) {
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fileType, setFileType] = useState('jpg');
  const [canvasKey, setCanvasKey] = useState(0);
  const canvasRef = useRef()
  let isMouseDown = useRef(false)
  let initialMousePos = useRef({x: 0, y: 0})
  useEffect(() => {
    const canvasContext = canvasRef.current.getContext('2d')
    canvasContext.drawImage(imageObject, 0, 0);
  }, [imageObject, canvasKey]);

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const imageStyle = {
    filter: `saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`,
    transform: `rotate(${rotation}deg)`,
    transition: 'all 0.3s ease',
  };

  const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }
  const handleMouseDown = (e) => {
    setCanvasKey(canvasKey => canvasKey + 1);
    isMouseDown.current = true
    initialMousePos.current = getMousePos(canvasRef.current, e)
    console.log("mouse down", initialMousePos)
  }

  const handleMouseUp = (e) => {
    isMouseDown.current = false
  }

  const handleMouseMove = (e) => {
    if (isMouseDown.current) {
        const canvas = canvasRef.current
        const mousePos = getMousePos(canvas, e)
        console.log("mouse pos", mousePos)
        const canvasContext = canvasRef.current.getContext('2d')
        canvasContext.strokeStyle = "rgb(255 255 255)"
        canvasContext.strokeRect(initialMousePos.current.x, initialMousePos.current.y, mousePos.x-initialMousePos.current.x, mousePos.y-initialMousePos.current.y)
    }
  }

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
        <canvas key={canvasKey} ref={canvasRef} width={imageObject.width} height={imageObject.height} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} />


      {/* <div className="image-container">
        {upstreamPreviewName && (
          <img
            id="previewImage"
            src={`http://localhost:10000/uploads/${upstreamPreviewName}`}
            alt="Preview"
            style={imageStyle}
          />
        )}
      </div> */}
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