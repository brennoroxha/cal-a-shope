export default function CustomerProtection() {
  return (
    <>
      <section className="cp">
        <div className="cp-head">
          <div className="cp-head-l">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z" />
            </svg>
            Proteção do cliente
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div className="cp-grid">
          <div className="cp-item"><span>✓</span><span>Devolução gratuita</span></div>
          <div className="cp-item"><span>✓</span><span>Reembolso automático por danos</span></div>
          <div className="cp-item"><span>✓</span><span>Pagamento seguro</span></div>
          <div className="cp-item"><span>✓</span><span>Cupom por atraso na coleta</span></div>
        </div>
      </section>

      <div className="sep"></div>
    </>
  );
}
