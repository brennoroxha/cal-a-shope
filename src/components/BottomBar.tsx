import { STORE_DATA } from '../data';

interface BottomBarProps {
  onChatClick?: () => void;
  onStoreClick?: () => void;
  onCheckoutClick?: () => void;
}

export default function BottomBar({
  onChatClick,
  onStoreClick,
  onCheckoutClick,
}: BottomBarProps) {
  return (
    <nav className="bb">
      <div className="product-bottom-panel">
        {/* Conversar agora */}
        <div
          className="product-bottom-panel__chat-now"
          data-testid="shop_chat_now_button_pdp"
          onClick={onChatClick}
          role="button"
          tabIndex={0}
        >
          <div className="product-bottom-panel__chat-now-inner-container">
            <svg
              viewBox="0 0 15 15"
              data-testid="stardust-icon-web-chat"
              role="img"
              className="stardust-icon stardust-icon-web-chat product-bottom-panel__chat-now-icon"
            >
              <g stroke="none" fill="currentColor">
                <path d="m11.2 4.1c-1.1-1.3-3-2.2-5-2.2-3.4 0-6.2 2.3-6.2 5.2 0 1.7.9 3.2 2.4 4.2l-.7 1.4s-.2.4.1.6c.3.3 1.1-.1 1.1-.1l2.4-.9c.3.1.6.1.9.1.7 0 1.5-.1 2.1-.3.5.2 1 .2 1.6.2h.6l2.1 1.5c.6.4.8.1.8-.4v-2.2c.9-.8 1.5-1.8 1.5-3 0-2-1.6-3.6-3.7-4.1zm-5.6 7.3h-.5-.2l-1.8.7.5-1.1-.7-.5c-1.3-.8-2-2-2-3.4 0-2.3 2.3-4.2 5.2-4.2 2.8 0 5.2 1.9 5.2 4.2s-2.4 4.3-5.2 4.3c-.2 0-.4 0-.5 0zm6.8-.8v1.2c0 .6-.1.4-.4.2l-1-.8c-.4.1-.8.1-1.2.1 1.5-1 2.5-2.5 2.5-4.2 0-.6-.1-1.1-.3-1.7 1.2.6 1.9 1.6 1.9 2.7 0 1-.5 1.9-1.5 2.5z"></path>
                <circle cx="3.1" cy="7.1" r=".8"></circle>
                <circle cx="9.1" cy="7.1" r=".8"></circle>
                <circle cx="6.1" cy="7.1" r=".8"></circle>
              </g>
            </svg>
            <div className="product-bottom-panel__chat-now-text" data-cy="label_chat_to_offer_pdp">Conversar agora</div>
          </div>
        </div>

        {/* Separator line */}
        <div className="product-bottom-panel__separator">
          <div className="product-bottom-panel__separator-real"></div>
        </div>

        {/* Carrinho & Compre agora buttons container */}
        <div className="product-cart-and-buy-buttons">
          {/* Adicionar ao carrinho */}
          <div
            className="product-bottom-panel__add-to-cart"
            data-testid="add-to-cart-button"
            onClick={onCheckoutClick}
            role="button"
            tabIndex={0}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              width="24"
              height="24"
              className="product-bottom-panel__add-to-cart-icon"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.713 2.75H0v-1.5h4.849l.154.547L6.115 5.75H23a.75.75 0 01.721.956l-3 10.5a.75.75 0 01-.721.544H8.5a.75.75 0 01-.722-.547L3.713 2.75zm2.824 4.5l2.531 9h10.366l2.572-9H6.536zM11 20.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm9 0a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm-6.25-12.5h1.5V11h3v1.5h-3v2.75h-1.5V12.5h-3V11h3V8.25z"
                fill="currentColor"
              ></path>
            </svg>
            <div className="product-bottom-panel__add-to-cart-text">
              <span>Adicionar ao carrinho</span>
            </div>
          </div>

          {/* Compre agora */}
          <div
            className="product-bottom-panel__buy-now"
            data-testid="buy-now-button"
            onClick={onCheckoutClick}
            role="button"
            tabIndex={0}
          >
            <span>Compre agora</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

