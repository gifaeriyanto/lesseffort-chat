import React, { useEffect, useState } from 'react';

export const TypingDots: React.FC = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        const numDots = (prevDots.length % 3) + 1;
        return '.'.repeat(numDots);
      });
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return <span>{dots}</span>;
};
