import { useState } from 'react';
import { DESCR_IMAGES } from '../data';

export default function ProductDetails() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <section className="pd bg-white p-4 rounded-lg shadow-sm border border-zinc-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-800 mb-4 border-b border-zinc-100 pb-2">Descrição</h2>

        {/* Categoria Breadcrumbs row */}
        <div className="flex items-start py-2.5 border-b border-dotted border-zinc-200 text-xs">
          <div className="w-[35%] text-zinc-400 font-normal">Categoria</div>
          <div className="w-[65%] flex flex-wrap items-center gap-1 text-[#05a] font-medium">
            <span>Shopee</span>
            <svg width="6" height="10" viewBox="0 0 6 10" className="text-zinc-300 mx-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 9l4-4-4-4" />
            </svg>
            <span>Roupas Femininas</span>
            <svg width="6" height="10" viewBox="0 0 6 10" className="text-zinc-300 mx-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 9l4-4-4-4" />
            </svg>
            <span>Calças e Leggings</span>
            <svg width="6" height="10" viewBox="0 0 6 10" className="text-zinc-300 mx-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 9l4-4-4-4" />
            </svg>
            <span className="text-zinc-800 font-normal">Leggings e Treggings</span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="text-xs">
          {[
            { key: 'Estoque Promocional', val: 'Estoque disponível' },
            { key: 'Estoque Total', val: 'Estoque disponível' },
            { key: 'Estampa', val: 'Lisa' },
            { key: 'Estilo', val: 'Básico' },
            { key: 'Pequeno', val: 'Não' },
            { key: 'País de Origem', val: 'Brasil' },
            { key: 'Altura da Cintura', val: 'Cintura Alta' },
            { key: 'Tipos de ajuste de calças', val: 'Fit e Flare' },
            { key: 'Plus Size', val: 'Não' },
            { key: 'Estações do ano', val: 'Inverno' },
            { key: 'Comprimento de calças', val: 'Comprimento longo' },
            { key: 'Material', val: 'Suplex' },
            { key: 'Envio de', val: 'São Paulo' },
          ].map((spec, index) => (
            <div key={index} className="flex items-center py-2.5 border-b border-dotted border-zinc-200">
              <div className="w-[35%] text-zinc-400 font-normal">{spec.key}</div>
              <div className="w-[65%] text-zinc-800 font-normal">{spec.val}</div>
            </div>
          ))}
        </div>

        <div className="my-6 border-t border-zinc-100"></div>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-800 mb-3">Descrição do Produto</h2>
        <div className="pd-desc-text text-xs text-zinc-600 leading-relaxed space-y-2">
          <p>Kit 3 Calça Legging Flare Flanelada Leg Boca De Sino Bailarina Grossa Zero Transparência Peluciada com envio imediato.</p>
          
          <h3 className="font-bold text-zinc-800 mt-4 mb-2">CARACTERÍSTICAS</h3>
          <div className="flex gap-2">
            <span className="text-orange-500">•</span>
            <span><strong>Zero Transparência:</strong> Tecido grosso que garante conforto e segurança durante o uso.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-500">•</span>
            <span><strong>Flanelada/Peluciada:</strong> Perfeita para os dias mais frios, mantendo você aquecida e confortável.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-500">•</span>
            <span><strong>Modelagem Flare Boca de Sino:</strong> Valoriza o corpo e combina com diversos looks e ocasiões.</span>
          </div>

          <p className="pt-3">Garanta a sua calça legging de alta qualidade e com modelagem exclusiva. O estoque é limitado e enviamos assim que a compra for aprovada!</p>
          <p className="pt-1"><strong>Garantia do vendedor:</strong> 30 dias</p>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DESCR_IMAGES.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Descrição ${idx + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          ))}
        </div>
      </section>

      {/* Medidas do produto Section */}
      <section className="bg-white p-4 rounded-lg shadow-sm border border-zinc-100 mt-4 mx-0">
        <h2 className="text-sm font-semibold text-zinc-800 mb-3">Medidas do produto</h2>

        {/* Ruler Action Box */}
        <div className="flex items-center justify-between border border-orange-200 bg-orange-50/50 rounded-md p-3.5 mb-4 hover:bg-orange-50 transition cursor-pointer">
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ee4d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 19H19" />
              <path d="M5 19v-4" />
              <path d="M9 19v-2" />
              <path d="M13 19v-4" />
              <path d="M17 19v-2" />
              <path d="M21 19V5H3v14h18z" />
            </svg>
            <span className="text-xs font-semibold text-[#ee4d2d]">Descubra seu tamanho</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#ee4d2d] font-normal">Inserir Medidas</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ee4d2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-hidden border border-zinc-100 rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-[11px] text-zinc-500">
                <th className="py-2.5 px-3 font-medium text-zinc-600">Tamanho (BR)</th>
                <th className="py-2.5 px-3 font-medium text-zinc-600 text-center">Cintura (cm)</th>
                <th className="py-2.5 px-3 font-medium text-zinc-600 text-center">Quadril (cm)</th>
                <th className="py-2.5 px-3 font-medium text-zinc-600 text-right">Comprimento Inferior (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {[
                { size: 'PP', waist: '58-62', hip: '70', length: '90' },
                { size: 'P', waist: '62-66', hip: '74', length: '91' },
                { size: 'M', waist: '66-70', hip: '78', length: '92' },
                { size: 'G', waist: '70-74', hip: '82', length: '93' },
                { size: 'GG', waist: '82-86', hip: '94', length: '104' },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-zinc-50/50 transition">
                  <td className="py-3 px-3 font-semibold text-zinc-800">{row.size}</td>
                  <td className="py-3 px-3 text-center">{row.waist}</td>
                  <td className="py-3 px-3 text-center">{row.hip}</td>
                  <td className="py-3 px-3 text-right font-medium text-zinc-800">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="pd-terms">
        <button className="pd-terms-btn" type="button" onClick={() => setShowTerms(!showTerms)}>
          Termos de Uso {showTerms ? '▲' : '▼'}
        </button>
        {showTerms && (
          <div className="text-xs text-slate-500 bg-slate-50 p-4 border border-slate-100 rounded-lg mx-4 mt-2 leading-relaxed">
            <p className="mb-2"><strong>1. Aceitação dos Termos</strong> - Ao adquirir os produtos exibidos nesta oferta especial promovida para o Mês do Consumidor, o cliente declara estar ciente de todas as regras descritas nestes termos técnicos comerciais.</p>
            <p className="mb-2"><strong>2. Prazos e Logística</strong> - O tempo médio de transporte para as capitais é de 5 a 12 dias úteis, operando em parceira com transportadoras terceirizadas de credibilidade nacional e os Correios.</p>
            <p className="mb-2"><strong>3. Trocas e Devoluções</strong> - O cliente possui até 7 dias corridos a partir da data de recepção física para formalizar o arrependimento do pedido, tendo direito à devolução gratuita sob o amparo da legislação de proteção ao consumidor.</p>
            <p><strong>4. Garantia Integral</strong> - O produto é segurado contra defeitos intrínsecos de manufatura pelo prazo expressivo de 2 anos (24 meses).</p>
          </div>
        )}
      </div>
    </>
  );
}
