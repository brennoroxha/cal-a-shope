import { useState } from 'react';
import TikTokSplash from './components/TikTokSplash';
import Header from './components/Header';
import ImageCarousel from './components/ImageCarousel';
import ProductInfo from './components/ProductInfo';
import StoreInfo from './components/StoreInfo';
import ReviewsList from './components/ReviewsList';
import ProductDetails from './components/ProductDetails';
import BottomBar from './components/BottomBar';
import Modal from './components/Modal';
import Checkout from './components/Checkout';

export default function App() {
  const [view, setView] = useState<'landing' | 'checkout'>('landing');
  const [activeModal, setActiveModal] = useState<'visit' | 'chat' | 'rev' | null>(null);

  const handleOpenModal = (type: 'visit' | 'chat' | 'rev') => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleOpenCheckout = () => {
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'checkout') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-950 selection:bg-[#ee4d2d]/20 selection:text-[#ee4d2d]">
        <TikTokSplash />
        <Checkout onBackToProduct={() => setView('landing')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#ee4d2d]/20 selection:text-[#ee4d2d]">
      {/* TikTok Loading Splash Indicator */}
      <TikTokSplash />

      {/* Header Bar */}
      <Header
        onBackClick={() => {
          // Simulated navigation back action
          window.history.back();
        }}
        onCartClick={handleOpenCheckout}
      />

      {/* Main product canvas */}
      <main className="pb-24">
        {/* Photo Gallery Carousel */}
        <ImageCarousel />

        {/* Item Title, Statistics & Estimates */}
        <ProductInfo />

        {/* Seller Info Profile */}
        <StoreInfo onVisitarClick={() => handleOpenModal('visit')} />

        {/* In-depth details, spec table, lists & measurements */}
        <ProductDetails />

        {/* Customer testimonies and ratings summary */}
        <ReviewsList onLearnMoreReviews={() => handleOpenModal('rev')} />
      </main>

      {/* Sticky Bottom Actions Bar */}
      <BottomBar
        onChatClick={() => handleOpenModal('chat')}
        onStoreClick={() => handleOpenModal('visit')}
        onCheckoutClick={handleOpenCheckout}
      />

      {/* Lazy overlays modals details system */}
      {activeModal && (
        <Modal
          type={activeModal}
          onClose={handleCloseModal}
          onNavigateToBuy={handleOpenCheckout}
        />
      )}
    </div>
  );
}
