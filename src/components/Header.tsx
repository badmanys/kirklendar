import React, { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { CZECH_MONTHS } from '../utils/dateUtils';

interface HeaderProps {
  currentYear: number;
  currentMonth: number; // 0-11
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onOpenAddEvent: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSearchDialog: () => void;
  onLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  onOpenAddEvent,
  searchQuery,
  onSearchChange,
  onOpenSearchDialog,
  onLock,
}) => {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Avatar + Brand + Live Sync */}
        <div className="flex items-center gap-4 min-w-[240px]">
          {/* Avatar with red neon ring */}
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#ff4359]/60 shadow-[0_0_15px_rgba(255,67,89,0.3)] transition-transform duration-300 group-hover:scale-105 bg-zinc-900 flex items-center justify-center">
              {!avatarError ? (
                <img
                  src="/avatar.jpg"
                  alt="Charlie s holubem"
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-sm font-bold text-[#ff4359]">CK</span>
              )}
            </div>
            {/* Status dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
          </div>

          {/* App title and Live Sync badge */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#f4f4f5] flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Kirklendář
                </span>
              </h1>
              {/* Live Sync Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
                title="Synchronizace s LocalStorage aktivní"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="tracking-wide">Live Sync</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">Minimalistický Event Tracker</p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div
            onClick={onOpenSearchDialog}
            className="relative flex items-center w-full h-11 px-3.5 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-zinc-600 focus-within:border-[#ff4359] focus-within:ring-1 focus-within:ring-[#ff4359] shadow-inner cursor-pointer transition-all duration-200 group"
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Hledat akce, místa, účastníky..."
              className="w-full bg-transparent px-3 text-sm text-[#f4f4f5] placeholder:text-zinc-500 focus:outline-none"
            />
            {/* Keyboard shortcut badge */}
            <kbd
              onClick={onOpenSearchDialog}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 rounded-md shadow-sm select-none"
            >
              <span>⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right: Calendar Navigation & Add Event CTA & Lock Button */}
        <div className="flex items-center gap-3 min-w-[370px] justify-end">
          {/* Navigation Month/Year controls */}
          <div className="flex items-center gap-1 bg-[#111115] border border-zinc-800/80 rounded-xl p-1 shadow-sm">
            <button
              onClick={onPrevMonth}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
              title="Předchozí měsíc"
              aria-label="Předchozí měsíc"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onToday}
              className="px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-md transition-colors"
              title="Skočit na dnešní datum"
            >
              Dnes
            </button>

            <button
              onClick={onNextMonth}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
              title="Následující měsíc"
              aria-label="Následující měsíc"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

            <div className="px-2 text-xs font-medium text-zinc-200 whitespace-nowrap min-w-[100px] text-center">
              <span className="font-semibold text-white">{CZECH_MONTHS[currentMonth]}</span>{' '}
              <span className="text-zinc-400">{currentYear}</span>
            </div>
          </div>

          {/* Add Event Button */}
          <button
            onClick={onOpenAddEvent}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#ff4359] to-[#ff5e72] hover:from-[#ff5266] hover:to-[#ff6d80] active:scale-[0.98] shadow-[0_0_20px_rgba(255,67,89,0.35)] hover:shadow-[0_0_25px_rgba(255,67,89,0.5)] transition-all duration-200"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Přidat akci</span>
          </button>

          {/* Lock / Logout Button */}
          <button
            onClick={onLock}
            className="p-2.5 rounded-xl bg-[#111115] border border-zinc-800 hover:border-[#ff4359]/60 text-zinc-400 hover:text-[#ff4359] transition-all"
            title="Zamknout aplikaci (odhlásit)"
            aria-label="Zamknout aplikaci"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
