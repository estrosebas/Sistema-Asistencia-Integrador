import React, { useEffect, useRef } from 'react';
import './Bubbles.css';

const Bubbles: React.FC = () => {
  const bubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bubblesRef.current) {
      const bubbles = bubblesRef.current.children;
      Array.from(bubbles).forEach((bubble) => {
        const randomLeft = Math.floor(Math.random() * 100);
        (bubble as HTMLElement).style.left = `${randomLeft}%`;
      });
    }
  }, []);

  return (
    <div className="bubble-container">
      <div className="bubbles" ref={bubblesRef}>
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} style={{ '--i': i + 10 } as React.CSSProperties}></span>
        ))}
      </div>
    </div>
  );
};

export default Bubbles;
