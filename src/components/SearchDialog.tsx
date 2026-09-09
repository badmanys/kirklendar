import React, { useState, useEffect, useRef } from 'react';
import type { EventItem, ParticipantName } from '../types';
import { PARTICIPANT_DETAILS } from '../constants';
import { formatCzechDateString } from '../utils/dateUtils';
import { Search, X, MapPin, Calendar, ArrowRight } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  events,
  onSelectEvent,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredEvents = events.filter((evt) => {
    if (!normalizedQuery) return true;
    const matchTitle = evt.title.toLowerCase().includes(normalizedQuery);
    const matchLocation = evt.location.toLowerCase().includes(normalizedQuery);
    const matchParticipant = evt.participants.some((p) =>
      p.toLowerCase().includes(normalizedQuery)
    );
    const matchDate = evt.startDate.includes(normalizedQuery);
    return matchTitle || matchLocation || matchParticipant || matchDate;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111115] border border-zinc-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800/80 gap-3">
          <Search className="w-5 h-5 text-[#ff4359]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat podle názvu, lokace nebo jména účastníka..."
            className="flex-1 bg-transparent text-sm text-[#f4f4f5] placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[11px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              Nebyly nalezeny žádné akce odpovídající &bdquo;{query}&ldquo;
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  onSelectEvent(evt);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#18181b] border border-transparent hover:border-zinc-800 cursor-pointer transition-all duration-150"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white truncate">
                      {evt.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                      {evt.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {formatCzechDateString(evt.startDate)} v {evt.startTime}
                    </span>
                    {evt.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {evt.location}
                      </span>
                    )}
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-1 mt-0.5">
                    {evt.participants.map((p) => {
                      const info = PARTICIPANT_DETAILS[p as ParticipantName];
                      return (
                        <span
                          key={p}
                          className={`text-[9px] px-1.5 py-0.2 rounded border ${
                            info?.borderColor || 'border-zinc-700'
                          } ${info?.textColor || 'text-zinc-300'}`}
                        >
                          {p}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="text-zinc-600 group-hover:text-[#ff4359] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0d0d10] border-t border-zinc-800/60 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Nalezeno {filteredEvents.length} akcí</span>
          <span>Stiskněte ESC pro zavření</span>
        </div>
      </div>
    </div>
  );
};
