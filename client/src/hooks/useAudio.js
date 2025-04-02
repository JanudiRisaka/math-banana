import { useState, useEffect, useRef } from 'react';

export const useAudio = (url, initialMuted = true) => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Create audio element only once
  useEffect(() => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.muted = initialMuted;
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => {
      setIsReady(true);
    });

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [url]);

  // Track user interaction with the document
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    // Add multiple interaction event listeners
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // Handle playback based on state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    // Only attempt to play if the user has interacted and audio isn't muted
    if (hasInteracted && !isMuted) {
      audio.muted = false; // Ensure not muted
      const playPromise = audio.play();

      // Handle play promise to avoid uncaught promise errors
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch(error => {
            console.log('Playback prevented:', error);
            // Don't show errors to users in production
            if (process.env.NODE_ENV !== 'production') {
              console.warn('Audio playback failed:', error);
            }
          });
      }
    } else {
      audio.pause();
    }

    // Always update muted status
    audio.muted = isMuted;
  }, [isMuted, hasInteracted, isReady]);

  const toggleMute = () => setIsMuted(!isMuted);

  return [isMuted, toggleMute];
};