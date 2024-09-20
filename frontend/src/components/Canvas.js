import React, { useEffect, useState, useRef } from 'react';
import { FaUndo, FaCheck } from 'react-icons/fa';
import './Editor.css';

export default function Canvas ({imageObject, cropingStatus, setCropingStatus, setCropRect}) {
    const [canvasKey, setCanvasKey] = useState(0);
    const canvasRef = useRef();
    let isMouseDown = useRef(false);
    let initialMousePos = useRef({x: 0, y: 0});
    useEffect(() => {
      const canvasContext = canvasRef.current.getContext('2d')
      canvasContext.drawImage(imageObject, 0, 0);
    }, [imageObject, canvasKey]);
    const getMousePos = (canvas, evt) => {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
      }
      const handleMouseDown = (e) => {
            setCropingStatus(status => {
                if (status == 'area-selected') {
                    return "not-cropping"
                }
                return status
            })
            setCanvasKey(canvasKey => canvasKey + 1);
            isMouseDown.current = true
            initialMousePos.current = getMousePos(canvasRef.current, e)
            console.log("mouse down", initialMousePos)
        
      }
    
      const handleMouseUp = (e) => {
        if (isMouseDown.current) {
            isMouseDown.current = false;
            const finalMousePos = getMousePos(canvasRef.current, e);
            drawImage();
            drawSelectionRect(finalMousePos);
            setCropRect({
                left: Math.round(Math.min(initialMousePos.current.x, finalMousePos.x)),
                top: Math.round(Math.min(initialMousePos.current.y, finalMousePos.y)),
                width: Math.round(Math.abs(initialMousePos.current.x - finalMousePos.x)),
                height: Math.round(Math.abs(finalMousePos.y - initialMousePos.current.y))
            });
          }
      }

      const handleMouseMove = (e) => {
        if (isMouseDown.current) {
            setCropingStatus("area-selected");
            const canvas = canvasRef.current
            const mousePos = getMousePos(canvas, e)
            console.log("mouse pos", mousePos)
            drawImage();
            drawSelectionRect(mousePos);
            setCropRect({
                left: Math.round(Math.min(initialMousePos.current.x, mousePos.x)),
                top: Math.round(Math.min(initialMousePos.current.y, mousePos.y)),
                width: Math.round(Math.abs(initialMousePos.current.x - mousePos.x)),
                height: Math.round(Math.abs(mousePos.y - initialMousePos.current.y))
            });
        }
      }
    
      const drawImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageObject, 0, 0);
      }
    
      const drawSelectionRect = (mousePos) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(0, 120, 255, 0.2)";
        ctx.strokeStyle = "rgba(0, 120, 255, 0.5)";
        const width = mousePos.x - initialMousePos.current.x;
        const height = mousePos.y - initialMousePos.current.y;
        ctx.fillRect(initialMousePos.current.x, initialMousePos.current.y, width, height);
        ctx.strokeRect(initialMousePos.current.x, initialMousePos.current.y, width, height);
      }  
    return  ( 
        <canvas style={{width: "100%"}} ref={canvasRef} width={imageObject.width} height={imageObject.height} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} />
)}