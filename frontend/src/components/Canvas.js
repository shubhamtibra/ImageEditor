function Canvas (props, ref) {
    const canvasRef = useRef();
    const handMouseDown = (e) => {
        
    }
    return (
        <canvas class="my-canvas" ref={canvasRef} onMouseDown={handMouseDown} onMouseUp={handleMouseUp}>
        <p>Add suitable fallback here.</p>
    </canvas>)
}