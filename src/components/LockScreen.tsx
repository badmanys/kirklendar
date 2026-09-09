import React, { useState, useRef, useEffect } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isShaking, setIsShaking] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newPin = [...pin];
      newPin[index] = '';
      setPin(newPin);
      return;
    }

    const digit = cleaned.slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setHasError(false);

    // Auto-advance to next box if not last
    if (index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Check if PIN is complete
    const fullPin = newPin.join('');
    if (fullPin.length === 4) {
      validatePin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasteData) return;

    const newPin = ['', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      newPin[i] = pasteData[i];
    }
    setPin(newPin);
    setHasError(false);

    if (pasteData.length === 4) {
      validatePin(pasteData);
    } else {
      inputRefs[pasteData.length]?.current?.focus();
    }
  };

  const validatePin = (enteredPin: string) => {
    if (enteredPin === '6969') {
      setIsSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 300);
    } else {
      setIsShaking(true);
      setHasError(true);
      setTimeout(() => {
        setIsShaking(false);
        setPin(['', '', '', '']);
        inputRefs[0].current?.focus();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b] text-[#f4f4f5] select-none">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,67,89,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Center Lock Card */}
      <div
        className={`relative w-full max-w-sm p-8 rounded-2xl bg-[#111115] border border-zinc-800/90 shadow-[0_0_50px_rgba(255,67,89,0.22)] flex flex-col items-center text-center transition-all duration-300 ${
          isShaking ? 'animate-shake border-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.4)]' : ''
        } ${isSuccess ? 'border-emerald-500/80 shadow-[0_0_40px_rgba(16,185,129,0.3)] scale-[0.98]' : ''}`}
      >
        {/* Charlie with Pigeon Avatar */}
        <div className="relative mb-5 group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#ff4359]/70 shadow-[0_0_30px_rgba(255,67,89,0.45)] bg-zinc-900 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/images.jpeg"
              alt="Charlie s holubem"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.endsWith('/images.jpeg')) {
                  target.src = '/avatar.jpg';
                }
              }}
            />
          </div>
          <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#18181b] border border-zinc-700 flex items-center justify-center shadow-md">
            {isSuccess ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#ff4359]" />
            )}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold tracking-tight text-white mb-1">
          Kirklendář
        </h1>
        <p className="text-xs font-medium text-zinc-400 tracking-wide uppercase mb-6 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4359] animate-pulse" />
          Pouze pro zvané
        </p>

        {/* 4-digit PIN Inputs */}
        <div className="flex items-center justify-center gap-3 mb-5" onPaste={handlePaste}>
          {pin.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-[#18181b] border transition-all duration-150 outline-none tabular-nums ${
                hasError
                  ? 'border-rose-500 text-rose-400 ring-1 ring-rose-500'
                  : digit
                  ? 'border-[#ff4359] text-white shadow-[0_0_15px_rgba(255,67,89,0.3)]'
                  : 'border-zinc-800 text-zinc-300 focus:border-[#ff4359] focus:ring-1 focus:ring-[#ff4359]'
              }`}
            />
          ))}
        </div>

        {/* Status Message */}
        <div className="h-5 flex items-center justify-center">
          {hasError ? (
            <span className="text-xs font-medium text-rose-400 animate-fade-in">
              Nesprávný kód. Zkuste to znovu.
            </span>
          ) : isSuccess ? (
            <span className="text-xs font-medium text-emerald-400 animate-fade-in flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ověřeno. Otevírám kalendář...
            </span>
          ) : (
            <span className="text-xs text-zinc-500">
              Zadejte 4místný PIN pro vstup
            </span>
          )}
        </div>

        {/* Quick Submit Button */}
        <button
          type="button"
          onClick={() => validatePin(pin.join(''))}
          disabled={pin.join('').length < 4 || isSuccess}
          className="mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#ff4359] to-[#ff5e72] hover:from-[#ff5266] hover:to-[#ff6d80] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,67,89,0.35)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Vstoupit do Kirklendáře</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
