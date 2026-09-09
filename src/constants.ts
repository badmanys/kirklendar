import type { ParticipantName, ParticipantInfo } from './types';

export const ALL_PARTICIPANTS: ParticipantName[] = [
  'Adam',
  'Míša',
  'Šárka',
  'Lucka',
  'Lukáš',
  'Ondra',
];

export const PARTICIPANT_DETAILS: Record<ParticipantName, ParticipantInfo> = {
  Adam: {
    name: 'Adam',
    initials: 'AD',
    avatarBg: 'bg-rose-500/20',
    textColor: 'text-[#ff4359]',
    borderColor: 'border-[#ff4359]/40',
  },
  Míša: {
    name: 'Míša',
    initials: 'MÍ',
    avatarBg: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
  },
  Šárka: {
    name: 'Šárka',
    initials: 'ŠÁ',
    avatarBg: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
  },
  Lucka: {
    name: 'Lucka',
    initials: 'LU',
    avatarBg: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
  },
  Lukáš: {
    name: 'Lukáš',
    initials: 'LK',
    avatarBg: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
  },
  Ondra: {
    name: 'Ondra',
    initials: 'ON',
    avatarBg: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
  },
};

export const DURATION_PRESETS = [
  '30 min',
  '1 h',
  '2 h',
  '4 h',
  'Celý den',
];

