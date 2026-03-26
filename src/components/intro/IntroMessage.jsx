import React, { forwardRef, useEffect, useState } from 'react';
import './IntroMessage.css';

const INTRO_TEXT = [
  "Hey, I'm a software engineer.",
  "I build web applications that are functional, beautiful, and user-friendly.",
];

const IntroMessage = forwardRef(function IntroMessage({ visible, onComplete }, ref) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setCurrentText('');
    setCurrentIndex(0);
    setIsTyping(true);
    setHasCompleted(false);
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    let i = 0;
    setCurrentText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      setCurrentText(INTRO_TEXT[currentIndex].slice(0, i + 1));
      i++;

      if (i >= INTRO_TEXT[currentIndex].length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [currentIndex, visible]);

  useEffect(() => {
    if (!visible || isTyping || hasCompleted) return undefined;

    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev >= INTRO_TEXT.length - 1) {
          setHasCompleted(true);
          if (onComplete) onComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 1800);

    return () => clearTimeout(timeout);
  }, [isTyping, visible, hasCompleted, onComplete]);

  if (!visible) return null;

  return (
    <div ref={ref} className="intro-message" role="status" aria-live="polite">
      <p>
        {currentText}
        <span className={`typing-cursor ${isTyping ? 'is-typing' : ''}`}>|</span>
      </p>
    </div>
  );
});

export default IntroMessage;
