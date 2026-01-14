
import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_IDLE_TIMEOUT = 3000;

export const useIdleTimer = (isExpanded: boolean, timeout: number = DEFAULT_IDLE_TIMEOUT) => {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    
    setIsIdle(false);

    if (!isExpanded) {
      idleTimerRef.current = window.setTimeout(() => {
        setIsIdle(true);
      }, timeout);
    }
  }, [isExpanded, timeout]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'touchmove', 'scroll', 'wheel'];
    
    const handleActivity = () => resetIdleTimer();
    const handleSleep = () => setIsIdle(true);

    events.forEach(evt => window.addEventListener(evt, handleActivity, { passive: true }));
    window.addEventListener('blur', handleSleep);
    window.addEventListener('focus', handleActivity);
    
    resetIdleTimer();

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleActivity));
      window.removeEventListener('blur', handleSleep);
      window.removeEventListener('focus', handleActivity);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  return { isIdle, resetIdleTimer };
};
