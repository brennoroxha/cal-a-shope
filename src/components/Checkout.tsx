import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PRODUCT_IMAGES } from '../data';

interface CheckoutProps {
  onBackToProduct: () => void;
}

interface AddressData {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface UserData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export default function Checkout({ onBackToProduct }: CheckoutProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping/User Info, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressData>({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [user, setUser] = useState<UserData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [installments, setInstallments] = useState('1');

  const [shippingMethod, setShippingMethod] = useState<'frete-gratis' | 'express'>('frete-gratis');
  const [cepLoading, setCepLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pix dynamic variables
  const [pixTime, setPixTime] = useState(300); // 5 minutes code verification
  const [copied, setCopied] = useState(false);
  const [pixStatus, setPixStatus] = useState<'waiting' | 'approved'>('waiting');
  const [pixCopyPaste, setPixCopyPaste] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [apiError, setApiError] = useState('');

  const productPrice = 59.90;
  const shippingFee = shippingMethod === 'express' ? 14.90 : 0.00;
  const totalPrice = productPrice + shippingFee;

  // Format inputs as user types
  const formatCPF = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
  };

  const formatCEP = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)}-${raw.slice(5, 8)}`;
  };

  const formatExpiry = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 2) return raw;
    return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
  };

  const formatCardNumber = (value: string) => {
    const raw = value.replace(/\D/g, '');
    const chunks = [];
    for (let i = 0; i < raw.length; i += 4) {
      chunks.push(raw.slice(i, i + 4));
    }
    return chunks.join(' ').slice(0, 19);
  };

  // Real API viacep call as requested
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setAddress(prev => ({ ...prev, cep: formatted }));

    const rawCep = formatted.replace(/\D/g, '');
    if (rawCep.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || ''
          }));
          setErrors(prev => {
            const copy = { ...prev };
            delete copy.cep;
            return copy;
          });
        } else {
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
        }
      } catch (err) {
        console.error("Erro viacep lookup:", err);
      } finally {
        setCepLoading(false);
      }
    }
  };

  // Helper to validate Brazilian CPF
  const validateCPF = (cpfValue: string) => {
    const cleanCpf = cpfValue.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i), 10) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleanCpf.charAt(9), 10)) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i), 10) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleanCpf.charAt(10), 10)) return false;

    return true;
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!user.nome.trim()) {
      newErrors.nome = 'Insira seu nome completo';
    } else if (user.nome.trim().split(' ').length < 2) {
      newErrors.nome = 'Insira sobrenome também';
    }

    if (!validateCPF(user.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    const cleanPhone = user.telefone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      newErrors.telefone = 'Celular inválido (deve conter DDD + número)';
    }

    if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'E-mail inválido';
    }

    if (address.cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = 'CEP inválido';
    } else if (errors.cep) {
      newErrors.cep = errors.cep;
    }

    if (!address.rua.trim()) newErrors.rua = 'Campo obrigatório';
    if (!address.numero.trim()) newErrors.numero = 'Campo obrigatório';
    if (!address.bairro.trim()) newErrors.bairro = 'Campo obrigatório';
    if (!address.cidade.trim()) newErrors.cidade = 'Campo obrigatório';
    if (!address.estado.trim()) newErrors.estado = 'Necessário';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        setApiError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Step 2 Submission - Integrates with our custom backend which proxies KlivoPay API
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (paymentMethod === 'card') {
      const cardErrors: Record<string, string> = {};
      if (cardNumber.replace(/\D/g, '').length < 15) cardErrors.cardNumber = 'Número do cartão inválido';
      if (!cardName.trim()) cardErrors.cardName = 'Insira o nome impresso';
      if (cardExpiry.length < 5) cardErrors.cardExpiry = 'Validade incorreta';
      if (cardCVV.length < 3) cardErrors.cardCVV = 'CVV inválido';

      if (Object.keys(cardErrors).length > 0) {
        setErrors(cardErrors);
        return;
      }
    }

    setLoading(true);

    try {
      const centsAmount = Math.round(totalPrice * 100);

      // We make a call to our server proxy to avoid leaking the private key on the frontend
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: centsAmount,
          payment_method: paymentMethod,
          name: user.nome,
          email: user.email,
          phone: user.telefone,
          cpf: user.cpf,
          installments: paymentMethod === 'card' ? installments : undefined
        })
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        throw new Error(responseData.error || "Houve um problema de conexão com o gateway de pagamento KlivoPay.");
      }

      const transactionData = responseData.data;

      // Update payment dynamic references
      if (transactionData.pix_copy_paste) {
        setPixCopyPaste(transactionData.pix_copy_paste);
      }
      if (transactionData.hash) {
        setTransactionHash(transactionData.hash);
      }

      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Payment Submission Error:", err);
      setApiError(err.message || "Erro inesperado ao criar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  // Pix timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && paymentMethod === 'pix' && pixTime > 0) {
      interval = setInterval(() => {
        setPixTime(p => p - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, paymentMethod, pixTime]);

  // Polling for Pix payment status from KlivoPay
  useEffect(() => {
    let statusInterval: NodeJS.Timeout;
    if (step === 3 && paymentMethod === 'pix' && transactionHash && pixStatus === 'waiting') {
      const checkStatus = async () => {
        try {
          const res = await fetch(`/api/pay/status/${transactionHash}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data && data.data.status === 'paid') {
              setPixStatus('approved');
            }
          }
        } catch (e) {
          console.error("Poller error:", e);
        }
      };

      // Poll every 3 seconds
      statusInterval = setInterval(checkStatus, 3000);
      checkStatus(); // run immediately
    }
    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [step, paymentMethod, transactionHash, pixStatus]);

  const copyPixCode = () => {
    const rawPixCode = pixCopyPaste || "00020101021226950014br.gov.bcb.pix2573pay.finalizeoficiall.com/calca-legging520400005303986540559.905802BR5915Ditalia Oficial6009Sao Paulo62070503***63047C2F";
    navigator.clipboard.writeText(rawPixCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Format timer
  const formatPixTimer = () => {
    const min = Math.floor(pixTime / 60);
    const secs = pixTime % 60;
    return `${String(min).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-lg border-x border-slate-100">
      {/* Checkout Navbar */}
      <header className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between z-40">
        <button
          onClick={step === 2 ? () => setStep(1) : onBackToProduct}
          className="p-1 -ml-1 text-slate-500 hover:text-slate-800 transition duration-150"
          disabled={step === 3}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="flex items-center space-x-1 ml-2">
          {/* Simulated official TikTok Shop Lock */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[14px] font-bold text-slate-800">Finalizar Compra</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-1.5 py-0.5 rounded border border-emerald-100 ml-1">Seguro</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">Step {step}/3</div>
      </header>

      {/* Main Container */}
      <div className="flex-1 pb-24">
        
        {/* Horizontal progress steps indicators */}
        {step !== 3 && (
          <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 text-xs">
            <div className="flex items-center space-x-1">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono ${step === 1 ? 'bg-[#ee4d2d] text-white' : 'bg-emerald-500 text-white'}`}>
                {step === 1 ? '1' : '✓'}
              </span>
              <span className={step === 1 ? 'font-bold text-slate-800' : 'text-slate-400'}>Entrega</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-100 mx-3"></div>
            <div className="flex items-center space-x-1">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono ${step === 2 ? 'bg-[#ee4d2d] text-white' : 'bg-slate-200 text-slate-500'}`}>
                2
              </span>
              <span className={step === 2 ? 'font-bold text-slate-800' : 'text-slate-400'}>Pagamento</span>
            </div>
          </div>
        )}

        {/* STEP 1: Personal Data & Shipping Input */}
        {step === 1 && (
          <div className="p-4 space-y-4 animate-fade-in">
            {/* Order Review Snippet */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex space-x-3">
              <img
                src={PRODUCT_IMAGES[0]}
                alt="Product visual"
                className="w-16 h-16 object-cover rounded-lg border border-slate-100"
              />
              <div className="flex-1 text-slate-800">
                <div className="text-xs font-semibold text-slate-500 line-clamp-1">Item de Compra</div>
                <div className="text-sm font-bold line-clamp-1">Calça Legging Flare Flanelada</div>
                <div className="text-[11px] text-[#ee4d2d] font-semibold">Mês do Consumidor - Frete Grátis</div>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-sm font-extrabold text-slate-800">R$ 59,90</span>
                  <span className="text-[11px] line-through text-slate-400">R$ 99,90</span>
                </div>
              </div>
            </div>

            {/* Form Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 pl-1">Informações Pessoais</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.nome ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-slate-200 focus:ring-[#ee4d2d] focus:border-[#ee4d2d]'}`}
                    value={user.nome}
                    onChange={(e) => setUser(p => ({ ...p, nome: e.target.value }))}
                  />
                  {errors.nome && <span className="text-[11px] text-red-500 pl-1">{errors.nome}</span>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">CPF</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.cpf ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-slate-200 focus:ring-[#ee4d2d] focus:border-[#ee4d2d]'}`}
                      value={user.cpf}
                      onChange={(e) => setUser(p => ({ ...p, cpf: formatCPF(e.target.value) }))}
                    />
                    {errors.cpf && <span className="text-[11px] text-red-500 pl-1">{errors.cpf}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Celular / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.telefone ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-slate-200 focus:ring-[#ee4d2d] focus:border-[#ee4d2d]'}`}
                      value={user.telefone}
                      onChange={(e) => setUser(p => ({ ...p, telefone: formatPhone(e.target.value) }))}
                    />
                    {errors.telefone && <span className="text-[11px] text-red-500 pl-1">{errors.telefone}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">E-mail para Confirmação</label>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    autoComplete="email"
                    className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.email ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-slate-200 focus:ring-[#ee4d2d] focus:border-[#ee4d2d]'}`}
                    value={user.email}
                    onChange={(e) => setUser(p => ({ ...p, email: e.target.value }))}
                  />
                  {errors.email && <span className="text-[11px] text-red-500 pl-1">{errors.email}</span>}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 pl-1 pt-1">Endereço de Entrega</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 font-sans">CEP</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="00000-000"
                        className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.cep ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-slate-200 focus:ring-[#ee4d2d] focus:border-[#ee4d2d]'}`}
                        value={address.cep}
                        onChange={handleCepChange}
                        maxLength={9}
                      />
                      {cepLoading && (
                        <span className="absolute right-2.5 top-3 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ee4d2d] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ee4d2d]"></span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 pb-2">
                    Buscando CEP automaticamente
                  </div>
                </div>
                {errors.cep && <span className="text-[11px] text-red-500 pl-1 block -mt-2">{errors.cep}</span>}

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Rua / Logradouro</label>
                  <input
                    type="text"
                    placeholder="Nome da rua ou avenida"
                    className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.rua ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-[#ee4d2d]'}`}
                    value={address.rua}
                    onChange={(e) => setAddress(p => ({ ...p, rua: e.target.value }))}
                  />
                  {errors.rua && <span className="text-[11px] text-red-500 pl-1">{errors.rua}</span>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Número</label>
                    <input
                      type="text"
                      placeholder="Nº ou S/N"
                      className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.numero ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : 'border-slate-200 focus:ring-[#ee4d2d]'}`}
                      value={address.numero}
                      onChange={(e) => setAddress(p => ({ ...p, numero: e.target.value }))}
                    />
                    {errors.numero && <span className="text-[11px] text-red-500 pl-1">{errors.numero}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto, Casa, Bloco"
                      className="w-full p-2.5 border border-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
                      value={address.complemento}
                      onChange={(e) => setAddress(p => ({ ...p, complemento: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Bairro</label>
                  <input
                    type="text"
                    placeholder="Bairro"
                    className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.bairro ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-[#ee4d2d]'}`}
                    value={address.bairro}
                    onChange={(e) => setAddress(p => ({ ...p, bairro: e.target.value }))}
                  />
                  {errors.bairro && <span className="text-[11px] text-red-500 pl-1">{errors.bairro}</span>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cidade</label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none focus:ring-1 ${errors.cidade ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-[#ee4d2d]'}`}
                      value={address.cidade}
                      onChange={(e) => setAddress(p => ({ ...p, cidade: e.target.value }))}
                    />
                    {errors.cidade && <span className="text-[11px] text-red-500 pl-1">{errors.cidade}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Estado</label>
                    <input
                      type="text"
                      placeholder="UF"
                      maxLength={2}
                      className={`w-full p-2.5 border text-sm rounded-lg focus:outline-none text-center focus:ring-1 ${errors.estado ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-[#ee4d2d]'}`}
                      value={address.estado}
                      onChange={(e) => setAddress(p => ({ ...p, estado: e.target.value.toUpperCase() }))}
                    />
                    {errors.estado && <span className="text-[11px] text-red-500 pl-1">{errors.estado}</span>}
                  </div>
                </div>
              </div>

              {/* Shipping Delivery selection */}
              <h3 className="text-sm font-bold text-slate-800 pl-1 pt-1">Método de Envio</h3>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden分">
                <div
                  onClick={() => setShippingMethod('frete-gratis')}
                  className={`p-3.5 flex items-center justify-between border-b border-slate-100 cursor-pointer transition ${shippingMethod === 'frete-gratis' ? 'bg-slate-50/50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 id-radio h-4 rounded-full border flex items-center justify-center ${shippingMethod === 'frete-gratis' ? 'border-[#ee4d2d]' : 'border-slate-300'}`}>
                      {shippingMethod === 'frete-gratis' && <div className="w-2 h-2 rounded-full bg-[#ee4d2d]"></div>}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Correios / Transportadora</div>
                      <div className="text-[11px] text-slate-400">Entrega padrão segura correios</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Grátis</span>
                </div>

                <div
                  onClick={() => setShippingMethod('express')}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition ${shippingMethod === 'express' ? 'bg-slate-50/50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 id-radio h-4 rounded-full border flex items-center justify-center ${shippingMethod === 'express' ? 'border-[#ee4d2d]' : 'border-slate-300'}`}>
                      {shippingMethod === 'express' && <div className="w-2 h-2 rounded-full bg-[#ee4d2d]"></div>}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Entrega Prioritária (Sedex Express)</div>
                      <div className="text-[11px] text-slate-400">Entrega de 3 a 7 dias úteis</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">R$ 14,90</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Selection of Payment Methods */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="p-4 space-y-4 animate-fade-in">
            {/* Quick summary check */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-xs space-y-1.5 text-slate-500">
              <div className="flex justify-between">
                <span>Cliente</span>
                <span className="font-bold text-slate-700">{user.nome}</span>
              </div>
              <div className="flex justify-between">
                <span>Entregar em</span>
                <span className="font-bold text-slate-700 max-w-[200px] truncate text-right">
                  {address.rua}, {address.numero} - {address.cidade}/{address.estado}
                </span>
              </div>
              <div className="flex justify-between">
                <span>CEP</span>
                <span className="font-bold text-slate-700">{address.cep}</span>
              </div>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-red-600 font-bold leading-normal whitespace-pre-line shadow-sm">
                ⚠️ {apiError}
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 pl-1">Escolha a de Pagamento</h3>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                
                {/* Method 1: PIX */}
                <div
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 cursor-pointer transition ${paymentMethod === 'pix' ? 'bg-rose-50/10' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      <div className={`w-4 id-radio h-4 rounded-full border mt-1 flex items-center justify-center ${paymentMethod === 'pix' ? 'border-[#ee4d2d]' : 'border-slate-300'}`}>
                        {paymentMethod === 'pix' && <div className="w-2 h-2 rounded-full bg-[#ee4d2d]"></div>}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-800">Pix</span>
                          <span className="text-[9px] bg-[#ee4d2d] text-white px-1.5 py-0.5 rounded font-extrabold tracking-wider uppercase">Recomendado</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Aprovação imediata · Desconto de até 10% no fechamento geral
                        </p>
                      </div>
                    </div>
                    {/* Pix Icon logo */}
                    <svg width="24" height="24" viewBox="0 0 100 100" className="opacity-90">
                      <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="#32BCAD" strokeWidth="6" />
                      <path d="M50 35 L65 50 L50 65 L35 50 Z" fill="#32BCAD" />
                    </svg>
                  </div>
                </div>

                {/* Method 2: Credit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 cursor-pointer transition ${paymentMethod === 'card' ? 'bg-[#ee4d2d]/5' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex space-x-3">
                      <div className={`w-4 id-radio h-4 rounded-full border mt-1 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#ee4d2d]' : 'border-slate-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#ee4d2d]"></div>}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800">Cartão de Crédito</span>
                        <p className="text-xs text-slate-400 mt-1">
                          Em até 12x no cartão com aprovação rápida e segura de dados
                        </p>
                      </div>
                    </div>
                    {/* Visa / MasterCard Mini logos container */}
                    <div className="flex space-x-1">
                      <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 font-bold border border-slate-200">Visa</span>
                      <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 font-bold border border-slate-200">Master</span>
                    </div>
                  </div>

                  {/* Dynamic inputs for Card details */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-200/50 animate-fade-in text-slate-800" onClick={e => e.stopPropagation()}>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Nome Impresso no Cartão</label>
                        <input
                          type="text"
                          placeholder="Ex: ISABELA FREITAS N"
                          className={`w-full p-2 border text-xs rounded bg-white ${errors.cardName ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-[#ee4d2d]'}`}
                          value={cardName}
                          onChange={e => setCardName(e.target.value.toUpperCase())}
                        />
                        {errors.cardName && <span className="text-[10px] text-red-500">{errors.cardName}</span>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Número do Cartão</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className={`w-full p-2 border text-xs rounded bg-white ${errors.cardNumber ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-[#ee4d2d]'}`}
                          value={cardNumber}
                          onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        />
                        {errors.cardNumber && <span className="text-[10px] text-red-500">{errors.cardNumber}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Validade (MM/AA)</label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className={`w-full p-2 border text-xs text-center rounded bg-white ${errors.cardExpiry ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'}`}
                            value={cardExpiry}
                            onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                          />
                          {errors.cardExpiry && <span className="text-[10px] text-red-500">{errors.cardExpiry}</span>}
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Código (CVV)</label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            className={`w-full p-2 border text-xs text-center rounded bg-white ${errors.cardCVV ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'}`}
                            value={cardCVV}
                            onChange={e => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          />
                          {errors.cardCVV && <span className="text-[10px] text-red-500">{errors.cardCVV}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-0.5" id="installLabel">Opções de Parcelamento</label>
                        <select
                          className="w-full p-2 border border-slate-200 text-xs rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
                          value={installments}
                          onChange={e => setInstallments(e.target.value)}
                          aria-labelledby="installLabel"
                        >
                          <option value="1">1x de R$ {totalPrice.toFixed(2)} (Sem juros)</option>
                          <option value="2">2x de R$ {(totalPrice / 2).toFixed(2)} (Sem juros)</option>
                          <option value="3">3x de R$ {(totalPrice / 3).toFixed(2)} (Sem juros)</option>
                          <option value="4">4x de R$ {(totalPrice / 4 + 0.35).toFixed(2)} (Pequena taxa)</option>
                          <option value="6">6x de R$ {(totalPrice / 6 + 0.50).toFixed(2)}</option>
                          <option value="10">10x de R$ {(totalPrice / 10 + 0.70).toFixed(2)}</option>
                          <option value="12">12x de R$ {(totalPrice / 12 + 0.85).toFixed(2)}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Method 3: Boleto Bancário */}
                <div
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-4 cursor-pointer transition ${paymentMethod === 'boleto' ? 'bg-[#ee4d2d]/5' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      <div className={`w-4 id-radio h-4 rounded-full border mt-1 flex items-center justify-center ${paymentMethod === 'boleto' ? 'border-[#ee4d2d]' : 'border-slate-300'}`}>
                        {paymentMethod === 'boleto' && <div className="w-2 h-2 rounded-full bg-[#ee4d2d]"></div>}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800">Boleto Bancário</span>
                        <p className="text-xs text-slate-400 mt-1">
                          Emissão imediata para pagamento via app de bancos ou lotérica
                        </p>
                      </div>
                    </div>
                    {/* Barcode icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-slate-400">
                      <line x1="3" y1="5" x2="3" y2="19" />
                      <line x1="6" y1="5" x2="6" y2="19" />
                      <line x1="10" y1="5" x2="10" y2="19" />
                      <line x1="13" y1="5" x2="13" y2="19" strokeWidth="2.5" />
                      <line x1="17" y1="5" x2="17" y2="19" />
                      <line x1="21" y1="5" x2="21" y2="19" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Secure guarantee banner */}
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center space-x-2 text-emerald-800 text-xs mt-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span><strong>Segurança Garantida:</strong> Dados criptografados no padrão SSL.</span>
              </div>
            </div>

            {/* Price Table Details breakdown */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2 mt-4 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Calça Legging Flare Flanelada</span>
                <span className="font-bold text-slate-700">R$ {productPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de envio ({shippingMethod === 'frete-gratis' ? 'Grátis' : 'Sedex Express'})</span>
                <span className={`font-bold ${shippingMethod === 'frete-gratis' ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {shippingMethod === 'frete-gratis' ? 'Grátis' : `R$ ${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="h-px bg-slate-100 my-2"></div>
              <div className="flex justify-between text-sm">
                <span className="font-extrabold text-slate-800">Total a Pagar</span>
                <span className="font-extrabold text-[#ee4d2d] text-base">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION / QR PIX SCREEN */}
        {step === 3 && (
          <div className="p-4 space-y-4 animate-fade-in">
            {/* Top success badge banner */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-black text-slate-800">Seu Pedido foi Recebido!</h1>
                <p className="text-xs text-slate-400 mt-1">Número de transação: #SHO-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
            </div>

            {/* Output conditional on payment choice */}
            {paymentMethod === 'pix' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-center text-slate-800">
                <div className="bg-rose-50 border border-rose-100/60 rounded-xl py-2 px-3 inline-block">
                  <span className="text-xs font-bold text-[#ee4d2d] flex items-center justify-center space-x-1.5 animate-pulse">
                    <span>⚡ Pague em até</span>
                    <strong className="text-sm font-mono">{formatPixTimer()}</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-700">Código "Copia e Cola" do Pix</h2>
                  <p className="text-xs text-slate-400 leading-normal px-2.5">
                    Copie o código hash abaixo e pague diretamente na aba PIX de qualquer aplicativo bancário.
                  </p>
                </div>

                {/* QR Code placeholder image visualization */}
                <div className="flex justify-center my-3 relative">
                  <div className="relative p-2.5 bg-slate-50 border border-slate-100 rounded-xl shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixCopyPaste || "00020101021226950014br.gov.bcb.pix2573pay.finalizeoficiall.com/calca-legging520400005303986540559.905802BR5915Ditalia Oficial6009Sao Paulo62070503***63047C2F")}`}
                      alt="PIX QR Code"
                      className="w-36 h-36 border border-slate-200 rounded"
                    />
                    {pixStatus === 'approved' && (
                      <div className="absolute inset-0 bg-[#fff]/95 flex flex-col items-center justify-center animate-fade-in p-4 rounded-xl">
                        <div className="text-emerald-500 bg-emerald-50 rounded-full p-2 border border-emerald-100 animate-spin">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                        <span className="text-xs font-black text-emerald-800 mt-2">Pagamento Confirmado!</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 text-center leading-tight">Recebemos seu Pix. O despacho do pedido já foi iniciado!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={copyPixCode}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${copied ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#ee4d2d] text-white hover:bg-rose-600'}`}
                  >
                    {copied ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Copiado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copiar Código do Pix</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400">Instruções enviadas também no e-mail <strong>{user.email}</strong></p>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-center text-slate-800">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl space-y-1">
                  <h2 className="text-sm font-bold">Excelente, {user.nome}!</h2>
                  <p className="text-xs text-slate-500 leading-normal">
                    Seu pagamento no cartão de crédito foi aceito e faturado em <strong>{installments}x</strong>. O comprovante bancário foi encaminhado com sucesso!
                  </p>
                </div>
                <div className="text-xs text-left space-y-2 border border-slate-100 p-3.5 rounded-xl bg-slate-50/50">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destinatário:</span>
                    <span className="font-bold text-slate-700">{user.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CPF:</span>
                    <span className="font-mono text-slate-700">{user.cpf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entrega:</span>
                    <span className="font-bold text-slate-700 max-w-[180px] break-words text-right">
                      {address.rua}, {address.numero}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rastreamento:</span>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1 border border-blue-100 rounded">
                      BR-{Math.floor(100000 + Math.random() * 900000)}-SL
                    </span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-center text-slate-800">
                <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl leading-normal text-xs">
                  <strong>Boleto Gerado Core!</strong><br />
                  A compensação bancária é realizada em até 1 dia útil após o pagamento. Garanta o pagamento hoje para segurar a oferta promocional!
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const rawBarcode = "34191.79001 01043.513184 91020.150008 7 90020000006190";
                    navigator.clipboard.writeText(rawBarcode).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 3000);
                    });
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                >
                  {copied ? 'Código Barras Copiado!' : 'Copiar Código de Barras Boleto'}
                </button>
              </div>
            )}

            <button
              onClick={onBackToProduct}
              type="button"
              className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl text-center text-sm transition duration-150"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>

      {/* FOOTER BAR STICKY FOR STEP 1 & STEP 2 */}
      {step !== 3 && (
        <footer className="fixed bottom-0 max-w-md w-full bg-white border-t border-slate-100 p-3.5 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="flex flex-col text-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subtotal Geral</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-black text-[#ee4d2d]">R$ {totalPrice.toFixed(2)}</span>
              {shippingMethod === 'frete-gratis' && <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded">Sem Frete</span>}
            </div>
          </div>

          {step === 1 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-[#ee4d2d] hover:bg-[#d73d1f] text-white text-sm font-black rounded-lg shadow-md transition duration-150 hover:shadow-lg focus:outline-none"
            >
              Ir para Pagamento
            </button>
          ) : (
            <button
              onClick={handlePaymentSubmit}
              disabled={loading}
              className="px-6 py-3 bg-[#ee4d2d] hover:bg-[#d73d1f] text-white text-sm font-black rounded-lg shadow-md transition duration-150 flex items-center col-span-2 space-x-1.5 focus:outline-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processando...</span>
                </>
              ) : (
                <span>{paymentMethod === 'pix' ? 'Finalizar Pedido com Pix' : paymentMethod === 'card' ? 'Concluir Pagamento' : 'Gerar Meu Boleto'}</span>
              )}
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
