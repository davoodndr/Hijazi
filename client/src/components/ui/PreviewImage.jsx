// PreviewImage.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const portalRoot = document.getElementById('portal');

const PreviewImage = ({thumbClass, src, alt = 'Image', zoom = '125%' }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setShowPreview(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (showPreview) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <>
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden ${thumbClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      </div>

      {/* Portal: Hover Preview */}
      {showPreview &&
        ReactDOM.createPortal(
          <div
            className="absolute z-[9999] pointer-events-none"
            style={{
              top: position.y - 170,
              left: position.x + 10,
            }}
          >
            <div
              className="w-40 h-40 rounded-lg border-4 border-white outline outline-gray-400 bg-white overflow-hidden
              animate-zoomFadeIn"
              style={{
                transform: `scale(${zoom})`, //not working
                transition: 'transform 0.2s ease-in-out',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.4) 0px 3px 7px -3px'
              }}
            >
              <img src={src} alt={alt} className="object-cover w-full h-full" />
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
};

export default PreviewImage;
