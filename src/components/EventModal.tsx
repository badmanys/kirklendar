import React, { useState, useEffect } from 'react';
import type { EventItem, ParticipantName } from '../types';
import { ALL_PARTICIPANTS, DURATION_PRESETS, PARTICIPANT_DETAILS } from '../constants';
import { X, MapPin, Calendar, Check, Trash2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<EventItem, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
  initialDate?: string; // YYYY-MM-DD
  editingEvent?: EventItem | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  editingEvent,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('18:00');
  const [duration, setDuration] = useState('2 h');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState<ParticipantName[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<{
    title?: string;
    startDate?: string;
    startTime?: string;
    participants?: string;
  }>({});

  // Reset or populate fields when modal opens or editingEvent changes
  useEffect(() => {
    if (isOpen) {
      setConfirmDelete(false);
      setErrors({});

      if (editingEvent) {
        setTitle(editingEvent.title);
        setStartDate(editingEvent.startDate);
        setStartTime(editingEvent.startTime);
        setLocation(editingEvent.location || '');
        setParticipants(editingEvent.participants as ParticipantName[]);

        if (DURATION_PRESETS.includes(editingEvent.duration)) {
          setDuration(editingEvent.duration);
          setIsCustomDuration(false);
          setCustomDurationValue('');
        } else {
          setDuration('custom');
          setIsCustomDuration(true);
          setCustomDurationValue(editingEvent.duration);
        }
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        setTitle('');
        setStartDate(initialDate || todayStr);
        setStartTime('18:00');
        setDuration('2 h');
        setIsCustomDuration(false);
        setCustomDurationValue('');
        setLocation('');
        // Default to all or current user
        setParticipants(['Adam', 'Míša']);
      }
    }
  }, [isOpen, editingEvent, initialDate]);

  // Handle ESC key
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

  // Toggle participant
  const toggleParticipant = (name: ParticipantName) => {
    setParticipants((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
    if (errors.participants) {
      setErrors((prev) => ({ ...prev, participants: undefined }));
    }
  };

  const selectAllParticipants = () => {
    setParticipants([...ALL_PARTICIPANTS]);
    setErrors((prev) => ({ ...prev, participants: undefined }));
  };

  const clearParticipants = () => {
    setParticipants([]);
  };

  // Validation
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Název akce je povinný';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Název musí mít alespoň 2 znaky';
    } else if (title.trim().length > 60) {
      newErrors.title = 'Název může mít maximálně 60 znaků';
    }

    if (!startDate) {
      newErrors.startDate = 'Vyberte platné datum';
    }

    if (!startTime) {
      newErrors.startTime = 'Zadejte čas začátku';
    }

    if (participants.length === 0) {
      newErrors.participants = 'Vyberte alespoň jednoho účastníka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalDuration = isCustomDuration ? customDurationValue.trim() || '2 h' : duration;

    onSave(
      {
        title: title.trim(),
        startDate,
        startTime,
        duration: finalDuration,
        location: location.trim(),
        participants,
      },
      editingEvent ? editingEvent.id : undefined
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#111115] border border-zinc-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 animate-scale-in text-[#f4f4f5] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient glow accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#ff4359]/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff4359]/15 border border-[#ff4359]/30 flex items-center justify-center text-[#ff4359]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {editingEvent ? 'Upravit událost' : 'Nová událost'}
              </h2>
              <p className="text-xs text-zinc-400">Vyplňte podrobnosti o společné akci</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors"
            title="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. Název akce */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                Název akce <span className="text-[#ff4359]">*</span>
              </label>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                {title.length}/60
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="např. Páteční pivo & deskovky"
              maxLength={60}
              className={`w-full h-11 px-3.5 rounded-xl bg-[#18181b] border ${
                errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#27272a]'
              } focus:border-[#ff4359] focus:ring-1 focus:ring-[#ff4359] text-sm text-[#f4f4f5] placeholder:text-zinc-500 focus:outline-none transition-all`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title}</p>}
          </div>

          {/* 2. Datum a čas začátku */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-1">
                Datum začátku <span className="text-[#ff4359]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate)
                      setErrors((prev) => ({ ...prev, startDate: undefined }));
                  }}
                  className={`w-full h-11 px-3 rounded-xl bg-[#18181b] border ${
                    errors.startDate ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#27272a]'
                  } focus:border-[#ff4359] focus:ring-1 focus:ring-[#ff4359] text-sm text-[#f4f4f5] focus:outline-none transition-all`}
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-xs text-rose-400">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-1">
                Čas začátku <span className="text-[#ff4359]">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    if (errors.startTime)
                      setErrors((prev) => ({ ...prev, startTime: undefined }));
                  }}
                  className={`w-full h-11 px-3 rounded-xl bg-[#18181b] border ${
                    errors.startTime ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#27272a]'
                  } focus:border-[#ff4359] focus:ring-1 focus:ring-[#ff4359] text-sm text-[#f4f4f5] focus:outline-none transition-all tabular-nums`}
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-xs text-rose-400">{errors.startTime}</p>
              )}
            </div>
          </div>

          {/* 3. Doba trvání */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-1.5">
              Doba trvání
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_PRESETS.map((preset) => {
                const active = !isCustomDuration && duration === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setIsCustomDuration(false);
                      setDuration(preset);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#ff4359] text-white shadow-[0_0_12px_rgba(255,67,89,0.4)]'
                        : 'bg-[#18181b] border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomDuration(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCustomDuration
                    ? 'bg-[#ff4359] text-white shadow-[0_0_12px_rgba(255,67,89,0.4)]'
                    : 'bg-[#18181b] border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                Vlastní
              </button>
            </div>

            {isCustomDuration && (
              <input
                type="text"
                value={customDurationValue}
                onChange={(e) => setCustomDurationValue(e.target.value)}
                placeholder="např. 3 dny, 90 min, víkend..."
                className="mt-2 w-full h-10 px-3 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#ff4359] focus:ring-1 focus:ring-[#ff4359] text-sm text-[#f4f4f5] focus:outline-none"
              />
            )}
          </div>

          {/* 4. Místo konání */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-1">
              Místo konání
            </label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="např. Vnitroblock, Letná, Karlín..."
                className="w-full h-11 pl-9 pr-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#ff4359] focus:ring-1 focus:ring-[#ff4359] text-sm text-[#f4f4f5] placeholder:text-zinc-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* 5. Účastníci (Multi-select skupina) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                Účastníci <span className="text-[#ff4359]">*</span>
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllParticipants}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Vybrat všechny
                </button>
                <span className="text-zinc-600">•</span>
                <button
                  type="button"
                  onClick={clearParticipants}
                  className="text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  Zrušit výběr
                </button>
              </div>
            </div>

            {/* Pill chips */}
            <div className="grid grid-cols-3 gap-2">
              {ALL_PARTICIPANTS.map((name) => {
                const isSelected = participants.includes(name);
                const info = PARTICIPANT_DETAILS[name];

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleParticipant(name)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#ff4359] text-white shadow-[0_0_15px_rgba(255,67,89,0.35)] border border-[#ff4359]'
                        : 'bg-[#18181b] border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                          isSelected ? 'bg-white/25 text-white' : `${info.avatarBg} ${info.textColor}`
                        }`}
                      >
                        {name.charAt(0)}
                      </span>
                      <span className="truncate">{name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
            {errors.participants && (
              <p className="mt-1.5 text-xs text-rose-400">{errors.participants}</p>
            )}
          </div>

          {/* 6. Controls */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-800/80 gap-3">
            {editingEvent && onDelete ? (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(editingEvent.id);
                      onClose();
                    }}
                    className="px-3 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                  >
                    Opravdu smazat?
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Ne
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Smazat</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#ff4359] to-[#ff5e72] hover:from-[#ff5266] hover:to-[#ff6d80] shadow-[0_0_20px_rgba(255,67,89,0.35)] hover:shadow-[0_0_25px_rgba(255,67,89,0.5)] transition-all active:scale-[0.98]"
              >
                {editingEvent ? 'Uložit změny' : 'Uložit akci'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
