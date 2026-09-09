import type { EventItem } from '../types';
import { supabase, mapRowToEvent, mapEventToRow, type DatabaseEventRow } from '../lib/supabase';

const STORAGE_KEY = 'kirklendar_events_v2';
const AUTH_KEY = 'kirklendar_auth';

// 1. LocalStorage Fallback Helpers
export const loadEventsFromLocal = (): EventItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Lokální paměť prázdná nebo nedostupná:', err);
    return [];
  }
};

export const saveEventsToLocal = (events: EventItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('Chyba při ukládání do LocalStorage:', err);
  }
};

// 2. Supabase Cloud DB Methods
export const fetchEvents = async (): Promise<EventItem[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.warn('Supabase fetch notice (používám lokální cache):', error.message);
      return loadEventsFromLocal();
    }

    if (data) {
      const items = (data as DatabaseEventRow[]).map(mapRowToEvent);
      saveEventsToLocal(items);
      return items;
    }

    return loadEventsFromLocal();
  } catch (err) {
    console.warn('Chyba spojení se Supabase, přecházím na offline cache:', err);
    return loadEventsFromLocal();
  }
};

export const syncUpsertEvent = async (event: EventItem): Promise<void> => {
  try {
    const row = mapEventToRow(event);
    const { error } = await supabase.from('events').upsert(row);
    if (error) {
      console.warn('Supabase upsert notice:', error.message);
    }
  } catch (err) {
    console.warn('Chyba při odesílání akce do Supabase:', err);
  }
};

export const syncDeleteEvent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete notice:', error.message);
    }
  } catch (err) {
    console.warn('Chyba při mazání akce ze Supabase:', err);
  }
};

export const syncClearAllEvents = async (): Promise<void> => {
  try {
    const { error } = await supabase.from('events').delete().neq('id', '___');
    if (error) {
      console.warn('Supabase clear notice:', error.message);
    }
  } catch (err) {
    console.warn('Chyba při čištění Supabase:', err);
  }
  saveEventsToLocal([]);
};

// 3. Authentication Persistence
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
