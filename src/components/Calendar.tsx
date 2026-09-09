import React, { useMemo } from 'react';
import type { EventItem, ParticipantName } from '../types';
import { getMonthDays, CZECH_DAYS_SHORT } from '../utils/dateUtils';
import { PARTICIPANT_DETAILS } from '../constants';
import { Plus } from 'lucide-react';

interface CalendarProps {
  year: number;
  month: number;
  events: EventItem[];
  onSelectDate: (dateStr: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onOpenDayDetails: (dateStr: string, eventsOnDay: EventItem[]) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  events,
  onSelectDate,
  onSelectEvent,
  onOpenDayDetails,
}) => {
  const days = getMonthDays(year, month);

  // Group events by dateStr: YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const evt of events) {
      const list = map.get(evt.startDate) || [];
      list.push(evt);
      map.set(evt.startDate, list);
    }

    // Sort events on each day by startTime
    map.forEach((list) => {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return map;
  }, [events]);

  return (
    <div className="flex-1 flex flex-col bg-[#111115] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Weekday Header Row (Po - Ne) */}
      <div className="grid grid-cols-7 border-b border-zinc-800/80 bg-[#16161c]">
        {CZECH_DAYS_SHORT.map((dayName, idx) => {
          const isWeekend = idx === 5 || idx === 6;
          return (
            <div
              key={dayName}
              className={`py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                isWeekend ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {dayName}
            </div>
          );
        })}
      </div>

      {/* Days Grid: 7 columns, min-height 120px per cell */}
      <div className="grid grid-cols-7 divide-x divide-y divide-zinc-800/60 bg-[#09090b]/40">
        {days.map((day) => {
          const dayEvents = eventsByDate.get(day.dateStr) || [];
          const visibleEvents = dayEvents.slice(0, 3);
          const extraCount = dayEvents.length - visibleEvents.length;

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDate(day.dateStr)}
              className={`group relative flex flex-col p-2 min-h-[125px] xl:min-h-[135px] transition-colors cursor-pointer select-none ${
                day.isCurrentMonth
                  ? 'bg-[#111115] hover:bg-[#15151b]'
                  : 'bg-[#0d0d10] opacity-35 hover:opacity-70'
              } ${day.isToday ? 'ring-1 ring-[#ff4359]/30' : ''}`}
            >
              {/* Day Cell Header: Number and Quick Add Button on Hover */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-medium inline-flex items-center justify-center transition-all ${
                    day.isToday
                      ? 'w-6 h-6 rounded-full bg-[#ff4359] text-white font-bold shadow-[0_0_12px_rgba(255,67,89,0.5)]'
                      : day.isCurrentMonth
                      ? 'text-zinc-300 group-hover:text-white'
                      : 'text-zinc-500'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Subtle '+' icon appearing on cell hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDate(day.dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-[#ff4359] hover:bg-zinc-800/80 rounded transition-all"
                  title="Přidat akci na tento den"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Event chips stack */}
              <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                {visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                    className="group/chip flex items-center justify-between gap-1.5 px-2 py-1 rounded-lg bg-[#18181b] hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#ff4359]/60 shadow-sm transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {/* Event Start Time */}
                      <span className="text-[10px] font-semibold text-[#ff4359] tabular-nums whitespace-nowrap">
                        {event.startTime}
                      </span>
                      {/* Event Title */}
                      <span className="text-xs text-zinc-200 group-hover/chip:text-white truncate font-normal">
                        {event.title}
                      </span>
                    </div>

                    {/* Participant dots / avatars */}
                    <div className="flex items-center -space-x-1 flex-shrink-0">
                      {event.participants.slice(0, 3).map((pName) => {
                        const info = PARTICIPANT_DETAILS[pName as ParticipantName];
                        return (
                          <span
                            key={pName}
                            title={pName}
                            className={`w-3.5 h-3.5 rounded-full ring-1 ring-[#18181b] flex items-center justify-center text-[8px] font-bold ${
                              info?.avatarBg || 'bg-zinc-700'
                            } ${info?.textColor || 'text-zinc-300'}`}
                          >
                            {pName.charAt(0)}
                          </span>
                        );
                      })}
                      {event.participants.length > 3 && (
                        <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 ring-1 ring-[#18181b] flex items-center justify-center text-[7px] text-zinc-400">
                          +{event.participants.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* More events indicator if > 3 */}
                {extraCount > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDayDetails(day.dateStr, dayEvents);
                    }}
                    className="text-left px-2 py-0.5 text-[11px] font-medium text-zinc-400 hover:text-[#ff4359] hover:bg-zinc-800/40 rounded transition-colors"
                  >
                    +{extraCount} {extraCount === 1 ? 'další' : extraCount < 5 ? 'další' : 'dalších'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
