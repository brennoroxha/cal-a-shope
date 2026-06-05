import { useEffect, useState } from 'react';

export default function PriceBanner() {
  const [seconds, setSeconds] = useState(507); // 8 minutes 27 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 507)); // Auto-reset at 0 for a continuous countdown feeling
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatMinutes = () => {
    const m = Math.floor(seconds / 60);
    return String(m).padStart(2, '0');
  };

  const formatSeconds = () => {
    const s = seconds % 60;
    return String(s).padStart(2, '0');
  };

  return (
    <section className="pb">
      <div className="pb-left">
        <div className="pb-row">
          <span className="pb-discount">-40%</span>
          <span className="pb-amount">R$ 59,90</span>
        </div>
        <div className="pb-original">R$ 99,90</div>
      </div>
      <div className="pb-right">
        <div className="pb-flash">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>Oferta Relâmpago</span>
        </div>
        <div className="pb-time">
          Termina em <strong>00:<span>{formatMinutes()}</span>:<span>{formatSeconds()}</span></strong>
        </div>
      </div>
    </section>
  );
}
