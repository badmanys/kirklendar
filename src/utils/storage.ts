import type { EventItem } from '../types';

const STORAGE_KEY = 'kirklendar_events_v2';
const AUTH_KEY = 'kirklendar_auth';

export const loadEvents = (): EventItem[] => {
  try {
    // Clear old demo data key if present
    if (localStorage.getItem('eventflow_events_v1')) {
      localStorage.removeItem('eventflow_events_v1');
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Chyba při načítání z LocalStorage:', err);
    return [];
  }
};

export const saveEvents = (events: EventItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Chyba při ukládání do LocalStorage:', err);
  }
};

export const clearAllEvents = (): EventItem[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
};

export const isUserAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setUserAuthenticated = (auth: boolean): void => {
  try {
    if (auth) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (err) {
    console.error('Chyba při ukládání stavu přihlášení:', err);
  }
};
