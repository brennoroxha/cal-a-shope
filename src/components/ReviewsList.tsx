import { useState } from 'react';
import { REVIEWS, getReviewDateString } from '../data';

interface ReviewsListProps {
  onLearnMoreReviews?: () => void;
}

export default function ReviewsList({ onLearnMoreReviews }: ReviewsListProps) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Show the first 5 reviews by default. Clicking "Ver mais" opens the full modal pop-up
  const initialReviews = REVIEWS.slice(0, 6);

  return (
    <>
      <section className="rv">
        <div className="rv-head">
          <h2 className="rv-title">
            Avaliações dos clientes <span className="rv-title-count">(14,9 mil)</span>
          </h2>
          <button
            className="rv-vermais"
            type="button"
            id="btnReviewMore"
            onClick={onLearnMoreReviews}
          >
            Ver mais
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="rv-rating-row">
          <span className="rv-rating">4.9</span>
          <span className="rv-rating-of">/ 5</span>
          <div className="rv-stars-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {initialReviews.map((rev) => (
            <article key={rev.index} className="rv-item p-1 border-b border-zinc-100 last:border-b-0 pb-3">
              <div className="flex gap-3">
                <img
                  className="rv-avatar w-8 h-8 rounded-full object-cover flex-shrink-0 bg-zinc-100"
                  src={rev.avatar}
                  alt={rev.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.outerHTML = `<div class="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 font-bold text-xs flex items-center justify-center flex-shrink-0">${rev.name.substring(0, 2).toUpperCase()}</div>`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-zinc-800">{rev.name}</div>
                  <div className="flex gap-0.5 text-[#ee4d2d] my-1">
                    {Array.from({ length: rev.stars }).map((_, i) => (
                      <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-400 mb-2">{getReviewDateString(rev.index)}</div>
                  <div className="text-[13px] text-zinc-800 leading-relaxed max-w-full break-words">
                    {rev.text}
                  </div>
                  {rev.images && rev.images.length > 0 && (
                    <div className="rv-photos mt-2 flex gap-1.5 flex-wrap">
                      {rev.images.map((imgUrl, imgIdx) => (
                        <img
                          key={imgIdx}
                          className="rv-photo w-16 h-16 rounded object-cover cursor-zoom-in border border-zinc-100"
                          src={imgUrl}
                          alt="Testimony thumbnail"
                          referrerPolicy="no-referrer"
                          onClick={() => setLightboxImg(imgUrl)}
                        />
                      ))}
                    </div>
                  )}
                  {/* Shopee action section: Helpful thumb and menu */}
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] mt-3.5 pt-1">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#ee4d2d] transition duration-150">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      <span className="font-medium">{14 + (rev.index * 7) % 65}</span>
                    </div>
                    <button type="button" className="text-zinc-300 hover:text-zinc-500 p-1" aria-label="Opções">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="1.2" />
                        <circle cx="12" cy="5" r="1.2" />
                        <circle cx="12" cy="19" r="1.2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="sep"></div>

      {/* Lightbox Preview */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition duration-150"
            onClick={() => setLightboxImg(null)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={lightboxImg}
            alt="Review zoom"
            className="max-w-full max-h-[85vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
