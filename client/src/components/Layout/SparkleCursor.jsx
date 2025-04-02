import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { useTheme } from '@emotion/react';
import SparklesAnimation from '../../assets/Sparkles.json';

const SparkleCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(true);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SparklesAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-50"
      style={{
        left: cursorPos.x,
        top: cursorPos.y,
        transform: 'translate(-50%, -50%)',
        opacity: isVisible ? 1 : 0,
        width: '40px',
        height: '40px',
      }}
    >
      <Lottie
        options={defaultOptions}
        isClickToPauseDisabled={true}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default SparkleCursor;