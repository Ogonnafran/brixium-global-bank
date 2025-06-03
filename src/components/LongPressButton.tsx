
import React, { useState, useRef, useCallback } from 'react';

interface LongPressButtonProps {
  children: React.ReactNode;
  onLongPress: () => void;
  onClick?: () => void;
  className?: string;
  longPressDuration?: number;
}

const LongPressButton: React.FC<LongPressButtonProps> = ({
  children,
  onLongPress,
  onClick,
  className = '',
  longPressDuration = 500,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleStart = useCallback(() => {
    setIsPressed(true);
    isLongPress.current = false;
    
    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, longPressDuration);
  }, [onLongPress, longPressDuration]);

  const handleEnd = useCallback(() => {
    setIsPressed(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // If it wasn't a long press and we have an onClick handler, call it
    if (!isLongPress.current && onClick) {
      onClick();
    }
  }, [onClick]);

  const handleCancel = useCallback(() => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <button
      className={className}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleCancel}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleCancel}
    >
      {children}
    </button>
  );
};

export default LongPressButton;
