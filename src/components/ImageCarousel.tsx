import { useRef, useState, useEffect } from 'react';
import { PRODUCT_IMAGES } from '../data';

export default function ImageCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = PRODUCT_IMAGES.length;

  const handleScroll = () => {
    if (trackRef.current) {
      const { scrollLeft, clientWidth } = trackRef.current;
      if (clientWidth > 0) {
        const index = Math.round(scrollLeft / clientWidth);
        if (index !== activeIndex && index >= 0 && index < totalSlides) {
          setActiveIndex(index);
        }
      }
    }
  };

  const setSlideIndex = (index: number) => {
    if (index < 0 || index >= totalSlides) return;
    if (trackRef.current) {
      const clientWidth = trackRef.current.clientWidth;
      trackRef.current.scrollTo({
        left: clientWidth * index,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  // Add event listener to scroll to ensure accurate tracking
  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (track) {
        track.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeIndex]);

  return (
    <section className="car" id="carousel">
      <div className="car-track no-scrollbar" ref={trackRef}>
        <div className="row">
          {PRODUCT_IMAGES.map((img, idx) => (
            <div key={idx} className="car-slide">
              <div className="car-slide-inner">
                <img
                  src={img}
                  alt={`Calça ${idx + 1}`}
                  width="700"
                  height="700"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="car-counter">
        <span id="carCur">{activeIndex + 1}</span>/<span id="carTotal">{totalSlides}</span>
      </div>
      <button
        className={`car-arrow left ${activeIndex === 0 ? 'hidden' : ''}`}
        id="carPrev"
        aria-label="Anterior"
        onClick={() => setSlideIndex(activeIndex - 1)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className={`car-arrow right ${activeIndex === totalSlides - 1 ? 'hidden' : ''}`}
        id="carNext"
        aria-label="Próxima"
        onClick={() => setSlideIndex(activeIndex + 1)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  );
}
