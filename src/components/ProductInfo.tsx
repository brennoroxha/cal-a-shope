import { useState } from 'react';

export default function ProductInfo() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <section className="pi bg-white px-3.5 py-3 select-none">
      {/* ROW 1: Price range & sold count & wishlist */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline flex-wrap gap-x-2">
          {/* Main Price Range */}
          <span className="text-[21px] font-semibold text-[#ee4d2d] leading-none">
            R$33,90 - R$33,97
          </span>
          {/* Original crossed-out price */}
          <span className="text-xs text-zinc-400 line-through">
            R$109,99
          </span>
          {/* Discount Badge */}
          <span className="text-[10px] font-bold text-[#ee4d2d] bg-[#ffeae6] px-1 py-0.5 rounded-[2.5px] leading-none">
            -69%
          </span>
        </div>

        {/* Right side alignment: sold and heart */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-zinc-500 text-[11px] gap-0.5">
            <span>70mil+ Vendidos</span>
            <svg
              className="w-3.5 h-3.5 text-zinc-400 cursor-pointer"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          
          <div className="w-[1px] h-3 bg-zinc-200 mx-0.5"></div>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className="text-zinc-400 hover:text-red-500 active:scale-90 transition p-0.5 flex items-center justify-center cursor-pointer"
            aria-label="Curtir produto"
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'fill-red-500 stroke-red-500 text-red-500' : 'text-zinc-400'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ROW 2: Installments */}
      <div className="flex items-center justify-between mt-2 text-xs text-zinc-600 leading-none">
        <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-800">
          <span className="text-zinc-800">Em até 6x R$6,32</span>
          <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      {/* ROW 3: Indicado badge & Product Title */}
      <div className="mt-3">
        <h1 className="text-[14px] text-zinc-800 font-medium leading-[1.4] tracking-tight">
          <span className="inline-block bg-[#ee4d2d] text-white text-[10px] font-bold px-1 py-0.5 rounded-[2px] mr-1.5 leading-none align-middle relative -top-[1px]">
            Indicado
          </span>
          Kit 3 Calça Legging Flare Flanelada Leg Boca De Sino Bailarina Grossa Zero Transparência Peluciada
        </h1>
      </div>

      {/* Divider line */}
      <div className="w-full h-[1px] bg-zinc-100 my-3"></div>

      {/* ROW 4: Shipping info */}
      <div className="flex items-center justify-between cursor-pointer hover:opacity-90 active:opacity-80 transition py-0.5">
        <div className="flex items-center gap-2">
          {/* Truck icon in #00bfa5 */}
          <svg className="w-[18px] h-[18px] text-[#00bfa5] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center flex-wrap gap-x-1.5">
              <span className="text-[#00bfa5] font-semibold">Frete grátis</span>
              <span className="text-zinc-500 font-normal">
                Receba {(() => {
                  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
                  const today = new Date();
                  const startDate = new Date(today);
                  startDate.setDate(today.getDate() + 3);
                  const endDate = new Date(today);
                  endDate.setDate(today.getDate() + 5);
                  return `${startDate.getDate()} de ${months[startDate.getMonth()]} até ${endDate.getDate()} de ${months[endDate.getMonth()]}`;
                })()}
              </span>
            </div>
            <div className="text-zinc-400 text-[11px] flex items-center gap-1.5">
              <span className="line-through">Frete: R$7,18</span>
              <span className="text-zinc-500">R$0,00 com cupom</span>
            </div>
          </div>
        </div>

        <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </section>
  );
}
