import { useEffect, useState } from 'react';
import { STORE_DATA, INSTANT_CHAT_MESSAGES, EXTRA_REVIEWS, getReviewDateString } from '../data';

interface ModalProps {
  type: 'visit' | 'chat' | 'rev' | null;
  onClose: () => void;
  onNavigateToBuy?: () => void;
}

export default function Modal({ type, onClose, onNavigateToBuy }: ModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (type) {
      // Small trigger delay for slide animations
      const t = setTimeout(() => setShow(true), 24);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
      };
    } else {
      setShow(false);
    }
  }, [type]);

  if (!type) return null;

  const handleBackdropClick = () => {
    setShow(false);
    setTimeout(onClose, 250); // wait for fade trans style before unhooking DOM
  };

  const renderContent = () => {
    switch (type) {
      case 'visit':
        return (
          <>
            <div className="cfx-store-row">
              <div className="cfx-store-logo">G</div>
              <div style={{ flex: 1 }}>
                <div className="cfx-store-name">
                  Garimpo Brasil{' '}
                  <svg style={{ verticalAlign: '-3px', display: 'inline-block', marginLeft: '4px' }} width="14" height="14" viewBox="0 0 50 50">
                    <polygon fill="hsl(211,90%,56%)" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884" />
                    <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926" />
                  </svg>
                </div>
                <div className="cfx-store-meta">Loja oficial · 4.9 ★ · Brasil</div>
              </div>
            </div>
            <div className="cfx-store-stat">
              <div>
                <strong>128.4K</strong>
                <span>Vendidos</span>
              </div>
              <div>
                <strong>4.9</strong>
                <span>Avaliação</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>Resposta</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginTop: '12px' }}>
              Loja verificada com mais de 128 mil produtos vendidos. Frete rápido para todo o Brasil, garantia de 30 dias e atendimento direto pelo chat.
            </p>
            <button
              onClick={() => {
                handleBackdropClick();
                if (onNavigateToBuy) onNavigateToBuy();
              }}
              className="w-full mt-4 p-[13px] bg-[#ee4d2d] text-white border-none rounded-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#ff7337] active:scale-[0.98] transition-all"
            >
              Ver produto em destaque
            </button>
          </>
        );
      case 'chat':
        return (
          <>
            <div className="cfx-chat-msg">
              {INSTANT_CHAT_MESSAGES.map((msg) => (
                <div key={msg.id} className="contents">
                  {msg.sender === 'them' && msg.id === '1' && (
                    <span className="cfx-chat-time">{msg.time}</span>
                  )}
                  {msg.sender === 'me' && msg.id === '3' && (
                    <span className="cfx-chat-time">{msg.time}</span>
                  )}
                  <div className={`cfx-chat-bubble ${msg.sender === 'me' ? 'cfx-chat-me' : 'cfx-chat-them'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '8px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
              Para responder, finalize sua compra e fale com o vendedor pelo TikTok Shop.
            </div>
          </>
        );
      case 'rev':
        return (
          <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
            {EXTRA_REVIEWS.map((rev, idx) => (
              <div key={idx} className="cfx-rev-extra border-b border-zinc-100 last:border-b-0 pb-3 flex gap-3">
                <img
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-zinc-100"
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(rev.name)}`}
                  alt={rev.name}
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[13px] font-medium text-zinc-800">{rev.name}</div>
                  <div className="flex gap-0.5 text-[#ee4d2d] my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-400 mb-1.5">{getReviewDateString(idx + 10)}</div>
                  <div className="text-[13px] text-zinc-800 leading-relaxed max-w-full break-words">
                    {rev.text}
                  </div>
                </div>
              </div>
            ))}
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '14px' }}>
              14.9 mil avaliações · 4.9 ★ médio
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    if (type === 'visit') return 'Garimpo Brasil';
    if (type === 'chat') return 'Chat com a loja';
    return 'Mais avaliações';
  };

  return (
    <>
      <div
        className={`cfx-mdl-bd ${show ? 'show' : ''}`}
        id={`${type}-bd`}
        style={{ display: 'block' }}
        onClick={handleBackdropClick}
      ></div>
      <div
        className={`cfx-mdl ${show ? 'show' : ''}`}
        id={type}
        style={{ display: 'block' }}
      >
        <div className="cfx-mdl-hdr">
          <div className="cfx-mdl-title">{getTitle()}</div>
          <button className="cfx-mdl-close" type="button" aria-label="Fechar" onClick={handleBackdropClick}>
            <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="cfx-mdl-body">{renderContent()}</div>
      </div>
    </>
  );
}
