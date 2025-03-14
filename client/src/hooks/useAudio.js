import { useState, useEffect } from 'react';

export const useAudio = (url, initialMuted = true) => {
  const [audio] = useState(() => {
    const a = new Audio(url);
    a.muted = initialMuted;
    a.loop = true;
    return a;
  });

  const [isMuted, setIsMuted] = useState(initialMuted);

  useEffect(() => {
    const handleFirstPlay = () => {
      audio
        .play()
        .then(() => {
          document.removeEventListener('click', handleFirstPlay);
        })
        .catch((error) => {
          console.log('Still unable to play:', error);
        });
    };

    // Try to play the audio immediately.
    audio.play().catch((error) => {
      console.log('Autoplay blocked, waiting for user interaction.');
      document.addEventListener('click', handleFirstPlay);
    });

    return () => {
      audio.pause();
      document.removeEventListener('click', handleFirstPlay);
    };
  }, [audio]);

  useEffect(() => {
    audio.muted = isMuted;
  }, [isMuted, audio]);

  const toggleMute = () => setIsMuted(!isMuted);

  return [isMuted, toggleMute];
};
