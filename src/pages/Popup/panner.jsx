import React, { useState, useRef } from 'react';
// import './PanZoomImage.css';

export const PanZoomImage = ({ imageUrl, elements }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    var startval = useRef(null);
    var imgRef = useRef(null);


    const handleMouseDown = (e) => {
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
        if (e.deltaY < 0) {
            // zoom in  
            // adjust the position of the image to zoom in the center of the mouse
            const mouseX = e.clientX
            const mouseY = e.clientY
            const img = imgRef.current
            const rect = img.getBoundingClientRect()
            const xPercent = mouseX / rect.width
            const yPercent = mouseY / rect.height
            const newScale = Math.max(1, Math.min(10, scale + e.deltaY * -zoomFactor));
            setPosition({
                x: position.x - (rect.width * (newScale - scale) * xPercent),
                y: position.y - (rect.height * (newScale - scale) * yPercent)
            })
            // setScale(newScale);
            console.log("xPercent", xPercent, "yPercent", yPercent)
        }
        else {
            // zoom out
            const mouseX = e.clientX
            const mouseY = e.clientY
            const img = imgRef.current
            const rect = img.getBoundingClientRect()
            const xPercent = mouseX / rect.width
            const yPercent = mouseX / rect.height
            const newScale = Math.max(1, Math.min(10, scale + e.deltaY * -zoomFactor));
            setPosition({
                x: position.x * newScale / scale,
                y: position.y * newScale / scale
            })
            // setScale(newScale);
            console.log("xPercent", xPercent, "yPercent", yPercent)
        }
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
            <div ref={imgRef}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transition: 'transform 0.1s ease',
                    transformOrigin: `0% 0%`,
                    pointerEvents: 'none',

                }}>
                {
                    elements.map((element) => {
                        const scaleValue = 1 / scale;
                        return <div style={{ position: 'absolute', left: element.x + "%", top: element.y + "%", zIndex: 100, transform: `scale(${scaleValue})` }}>{element.item}</div>
                    })
                }
                <img
                    src={imageUrl}
                    style={{
                        transform: ``,
                    }}

                    alt="Pan and Zoom"

                />
            </div>
        </div>
    );
};

export default PanZoomImage;
