export type ParticipantName = 'Adam' | 'Míša' | 'Šárka' | 'Lucka' | 'Lukáš' | 'Ondra';

export interface ParticipantInfo {
  name: ParticipantName;
  initials: string;
  avatarBg: string;
  textColor: string;
  borderColor: string;
}

export interface EventItem {
  id: string; // UUID nebo timestamp
  title: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: string;  // např. "2h" nebo "Celý den"
  location: string;
  participants: string[]; // podmnožina: ["Adam", "Míša", ...]
  createdAt: number;
}

export type FilterState = {
  selectedParticipants: ParticipantName[];
  searchQuery: string;
};
