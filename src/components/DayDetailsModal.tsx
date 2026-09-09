import React from 'react';
import type { EventItem, ParticipantName } from '../types';
import { PARTICIPANT_DETAILS } from '../constants';
import { formatCzechDateString } from '../utils/dateUtils';
import { X, Plus, Calendar, Clock, MapPin } from 'lucide-react';

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onAddNewEvent: (dateStr: string) => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  events,
  onSelectEvent,
  onAddNewEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#111115] border border-zinc-800 rounded-2xl shadow-2xl p-6 animate-scale-in text-[#f4f4f5] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff4359]/15 border border-[#ff4359]/30 flex items-center justify-center text-[#ff4359]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {formatCzechDateString(dateStr)}
              </h2>
              <p className="text-xs text-zinc-400">
                {events.length} {events.length === 1 ? 'akce' : events.length < 5 ? 'akce' : 'akcí'} na tento den
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of events */}
        <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {events.length === 0 ? (
            <p className="text-center py-6 text-sm text-zinc-500">
              Na tento den nejsou naplánovány žádné akce.
            </p>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  onSelectEvent(evt);
                  onClose();
                }}
                className="group p-3.5 rounded-xl bg-[#18181b] border border-zinc-800/90 hover:border-[#ff4359]/60 hover:bg-[#1c1c22] transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#ff4359] tabular-nums flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {evt.startTime} ({evt.duration})
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">
                    Upravit klikem
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-[#ff4359] transition-colors">
                  {evt.title}
                </h3>

                {evt.location && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{evt.location}</span>
                  </div>
                )}

                {/* Participant badges */}
                <div className="flex flex-wrap gap-1 mt-1 pt-2 border-t border-zinc-800/60">
                  {evt.participants.map((p) => {
                    const info = PARTICIPANT_DETAILS[p as ParticipantName];
                    return (
                      <span
                        key={p}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                          info?.borderColor || 'border-zinc-700'
                        } ${info?.avatarBg || 'bg-zinc-800'} ${info?.textColor || 'text-zinc-300'}`}
                      >
                        {p}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Add new event to this day */}
        <div className="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onAddNewEvent(dateStr);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#ff4359] to-[#ff5e72] hover:shadow-[0_0_15px_rgba(255,67,89,0.35)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Přidat akci na tento den</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
};
