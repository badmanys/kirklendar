import { createClient } from '@supabase/supabase-js';
import type { EventItem } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tbgagueofudqspyfyvhv.supabase.co';
// Clean URL so it points to the base domain without /rest/v1
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ2FndWVvZnVkcXNweWZ5dmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODU3NTQsImV4cCI6MjEwNDU2MTc1NH0.E014KCDNmSnfJ7u0AlqrJ9T2QXF9Ro4qaGYdz2cRmH8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DatabaseEventRow {
  id: string;
  title: string;
  start_date: string;
  start_time: string;
  duration: string;
  location: string | null;
  participants: string[];
  created_at?: string | number;
}

export const mapRowToEvent = (row: DatabaseEventRow): EventItem => ({
  id: row.id,
  title: row.title,
  startDate: row.start_date,
  startTime: row.start_time,
  duration: row.duration,
  location: row.location || '',
  participants: row.participants || [],
  createdAt:
    typeof row.created_at === 'number'
      ? row.created_at
      : row.created_at
      ? new Date(row.created_at).getTime()
      : Date.now(),
});

export const mapEventToRow = (evt: EventItem): DatabaseEventRow => ({
  id: evt.id,
  title: evt.title,
  start_date: evt.startDate,
  start_time: evt.startTime,
  duration: evt.duration,
  location: evt.location || '',
  participants: evt.participants || [],
  created_at: evt.createdAt,
});
