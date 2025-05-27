import React, { useState, useRef, useEffect } from 'react';
import './ChargeButton.css';

interface ChargeButtonProps {
  onConnect: () => void;
  buttonText: string;
  reset?: boolean;
}

interface Position {
  x: number;
  y: number;
}

const ChargeButton: React.FC<ChargeButtonProps> = ({ onConnect, buttonText, reset = false }) => {
  const [isDraggingPositive, setIsDraggingPositive] = useState(false);
  const [isDraggingNegative, setIsDraggingNegative] = useState(false);
  const [positivePosition, setPositivePosition] = useState<Position>({ x: 0, y: 0 });
  const [negativePosition, setNegativePosition] = useState<Position>({ x: 0, y: 0 });
  const [isConnected, setIsConnected] = useState(false);
  
  const positiveRef = useRef<HTMLDivElement>(null);
  const negativeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 });

  // Reset effect
  useEffect(() => {
    if (reset) {
      setIsConnected(false);
      setPositivePosition({ x: 0, y: 0 });
      setNegativePosition({ x: 0, y: 0 });
    }
  }, [reset]);

  const handleMouseDown = (e: React.MouseEvent, isPositive: boolean) => {
    if (isPositive) {
      setIsDraggingPositive(true);
      dragRef.current = {
        startX: e.pageX - positivePosition.x,
        startY: e.pageY - positivePosition.y
      };
    } else {
      setIsDraggingNegative(true);
      dragRef.current = {
        startX: e.pageX - negativePosition.x,
        startY: e.pageY - negativePosition.y
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingPositive && !isDraggingNegative) return;

    const newX = e.pageX - dragRef.current.startX;
    const newY = e.pageY - dragRef.current.startY;

    if (isDraggingPositive) {
      setPositivePosition({ x: newX, y: newY });
    } else {
      setNegativePosition({ x: newX, y: newY });
    }

    // Check for connection
    if (positiveRef.current && negativeRef.current) {
      const posRect = positiveRef.current.getBoundingClientRect();
      const negRect = negativeRef.current.getBoundingClientRect();
      
      const distance = Math.sqrt(
        Math.pow(posRect.left - negRect.left, 2) + 
        Math.pow(posRect.top - negRect.top, 2)
      );

      if (distance < 50 && !isConnected) { // 50px threshold for connection
        setIsConnected(true);
        onConnect();
      }
    }
  };

  const handleMouseUp = () => {
    if (isDraggingPositive) {
      setIsDraggingPositive(false);
      if (!isConnected) {
        setPositivePosition({ x: 0, y: 0 });
      }
    }
    if (isDraggingNegative) {
      setIsDraggingNegative(false);
      if (!isConnected) {
        setNegativePosition({ x: 0, y: 0 });
      }
    }
  };

  useEffect(() => {
    if (isDraggingPositive || isDraggingNegative) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPositive, isDraggingNegative]);

  return (
    <div className="charge-button-container">
      <div 
        className={`charge-button ${isConnected ? 'connected' : ''}`}
      >
        <div className="button-text">{buttonText}</div>
        <div 
          ref={positiveRef}
          className="charge positive"
          onMouseDown={(e) => handleMouseDown(e, true)}
          style={{
            cursor: isDraggingPositive ? 'grabbing' : 'grab',
            transform: `translate(${positivePosition.x}px, ${positivePosition.y}px)`,
          }}
        >
          +
        </div>
        <div 
          ref={negativeRef}
          className="charge negative"
          onMouseDown={(e) => handleMouseDown(e, false)}
          style={{
            cursor: isDraggingNegative ? 'grabbing' : 'grab',
            transform: `translate(${negativePosition.x}px, ${negativePosition.y}px)`,
          }}
        >
          −
        </div>
      </div>
    </div>
  );
};

export default ChargeButton; 