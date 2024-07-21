import React, { useState, useRef } from 'react';
// import './PanZoomImage.css';

export const PanZoomImage = ({ imageUrl }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // const [start, setStart] = useState(null);
    const containerRef = useRef(null);
    var startval = null;


    const handleMouseDown = (e) => {
        // setStart({
        //     x: e.clientX - position.x,
        //     y: e.clientY - position.y
        // });
        startval = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
        containerRef.current.addEventListener('mousemove', handleMouseMove);
        containerRef.current.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (startval) {
            setPosition({
                x: e.clientX - startval.x,
                y: e.clientY - startval.y
            });
        }
    };

    const handleMouseUp = () => {
        // setStart(null);
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseup', handleMouseUp);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 0.02;
        const newScale = Math.max(1, Math.min(10, scale + e.deltaY * -zoomFactor));
        setScale(newScale);
    };

    return (
        <div
            ref={containerRef}
            className="pan-zoom-container"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onDrag
            style={{
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
                height: '100%',
                cursor: startval ? 'grabbing' : 'grab',
                userSelect: 'none'
            }}
        >
            <img
                src={imageUrl}
                alt="Pan and Zoom"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transition: 'transform 0.1s ease',
                    transformOrigin: '50% 50%',
                    pointerEvents: 'none',

                }}
            />
        </div>
    );
};

export default PanZoomImage;
