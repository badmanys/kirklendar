import React, { useMemo } from 'react';
import type { EventItem, ParticipantName } from '../types';
import { ALL_PARTICIPANTS, PARTICIPANT_DETAILS } from '../constants';
import { formatCountdown } from '../utils/dateUtils';
import { MapPin, Clock, Users, CalendarDays, FilterX, RotateCcw } from 'lucide-react';

interface SidebarProps {
  events: EventItem[];
  selectedParticipants: ParticipantName[];
  onToggleParticipant: (name: ParticipantName) => void;
  onClearFilters: () => void;
  onSelectEvent: (event: EventItem) => void;
  onClearAllEvents?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  events,
  selectedParticipants,
  onToggleParticipant,
  onClearFilters,
  onSelectEvent,
  onClearAllEvents,
}) => {
  // Calculate participant event counts
  const participantCounts = useMemo(() => {
    const counts: Record<ParticipantName, number> = {
      Adam: 0,
      Míša: 0,
      Šárka: 0,
      Lucka: 0,
      Lukáš: 0,
      Ondra: 0,
    };
    for (const evt of events) {
      for (const p of evt.participants) {
        if (p in counts) {
          counts[p as ParticipantName]++;
        }
      }
    }
    return counts;
  }, [events]);

  // Upcoming events (today and future events, sorted chronologically)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;

    return [...events]
      .filter((evt) => {
        // Filter by selected participants if any active
        if (
          selectedParticipants.length > 0 &&
          !selectedParticipants.some((p) => evt.participants.includes(p))
        ) {
          return false;
        }
        // Only today and future
        return evt.startDate >= todayStr;
      })
      .sort((a, b) => {
        if (a.startDate !== b.startDate) {
          return a.startDate.localeCompare(b.startDate);
        }
        return a.startTime.localeCompare(b.startTime);
      })
      .slice(0, 6);
  }, [events, selectedParticipants]);

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col gap-6 flex-shrink-0">
      {/* 1. Quick Filters by People */}
      <div className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#ff4359]" />
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Filtrovat podle lidí
            </h2>
          </div>
          {selectedParticipants.length > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-zinc-400 hover:text-[#ff4359] flex items-center gap-1 transition-colors"
              title="Zrušit filtr"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Zrušit</span>
            </button>
          )}
        </div>

        {/* Member Chips Grid */}
        <div className="grid grid-cols-2 gap-2">
          {ALL_PARTICIPANTS.map((name) => {
            const isSelected = selectedParticipants.includes(name);
            const info = PARTICIPANT_DETAILS[name];
            const count = participantCounts[name] || 0;

            return (
              <button
                key={name}
                type="button"
                onClick={() => onToggleParticipant(name)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#ff4359]/20 border border-[#ff4359] text-white shadow-[0_0_12px_rgba(255,67,89,0.35)]'
                    : 'bg-[#18181b] border border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-[#ff4359] text-white' : `${info.avatarBg} ${info.textColor}`
                    }`}
                  >
                    {info.initials}
                  </span>
                  <span className="truncate">{name}</span>
                </div>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-[#ff4359]/40 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Upcoming Nearest Events */}
      <div className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-4 shadow-lg flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#ff4359]" />
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Nejbližší akce
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {upcomingEvents.length} {upcomingEvents.length === 1 ? 'akce' : 'akcí'}
          </span>
        </div>

        {/* Events list */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[520px] pr-1">
          {upcomingEvents.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <CalendarDays className="w-8 h-8 text-zinc-700 mb-2" />
              <p className="text-xs text-zinc-400">Žádné nadcházející akce</p>
              {selectedParticipants.length > 0 && (
                <button
                  onClick={onClearFilters}
                  className="mt-2 text-xs text-[#ff4359] hover:underline"
                >
                  Zrušit aktivní filtr
                </button>
              )}
            </div>
          ) : (
            upcomingEvents.map((evt) => {
              const countdown = formatCountdown(evt.startDate, evt.startTime);

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="group relative flex flex-col gap-2 p-3 rounded-xl bg-[#18181b] border border-zinc-800/90 hover:border-[#ff4359]/60 hover:bg-[#1a1a20] shadow-sm transition-all duration-200 cursor-pointer"
                >
                  {/* Countdown badge & Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ff4359]/15 text-[#ff4359] border border-[#ff4359]/30">
                      {countdown}
                    </span>
                    <span className="text-xs font-medium text-zinc-400 tabular-nums flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {evt.startTime} ({evt.duration})
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-[#f4f4f5] group-hover:text-white transition-colors line-clamp-1">
                    {evt.title}
                  </h3>

                  {/* Location */}
                  {evt.location && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  )}

                  {/* Full Participant Tags */}
                  <div className="flex flex-wrap gap-1 mt-1 pt-2 border-t border-zinc-800/60">
                    {evt.participants.map((pName) => {
                      const pInfo = PARTICIPANT_DETAILS[pName as ParticipantName];
                      return (
                        <span
                          key={pName}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                            pInfo?.borderColor || 'border-zinc-700'
                          } ${pInfo?.avatarBg || 'bg-zinc-800'} ${
                            pInfo?.textColor || 'text-zinc-300'
                          }`}
                        >
                          {pName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span>Úložiště: LocalStorage</span>
          {events.length > 0 && onClearAllEvents && (
            <button
              onClick={onClearAllEvents}
              className="flex items-center gap-1 text-zinc-500 hover:text-rose-400 transition-colors text-[11px]"
              title="Smazat všechny uložené akce"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Vymazat vše</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
