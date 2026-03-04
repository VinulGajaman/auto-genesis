import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1200);
    const remove = setTimeout(() => { setVisible(false); onComplete && onComplete(); }, 1700);
    return () => { clearTimeout(timer); clearTimeout(remove); };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`} role="status" aria-label="Loading">
      <div className="loading-logo">AUTO<span>GENESIS</span></div>
      <div className="loading-text">Loading Passport Data...</div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill"></div>
      </div>
    </div>
  );
}
