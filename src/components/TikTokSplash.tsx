import { useEffect, useState } from 'react';

export default function TikTokSplash() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Hide splash after 1 second smoothly
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="ttSplash"
      className={`tt-splash ${fadeOut ? 'hidden' : ''}`}
      style={{
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
        opacity: fadeOut ? 0 : 1,
        visibility: fadeOut ? 'hidden' : 'visible',
      }}
    >
      <div className="tt-loader">
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
