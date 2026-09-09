import { useState, useEffect, useMemo, useCallback } from 'react';
import type { EventItem, ParticipantName } from './types';
import {
  loadEvents,
  saveEvents,
  clearAllEvents,
  isUserAuthenticated,
  setUserAuthenticated,
} from './utils/storage';
import { LockScreen } from './components/LockScreen';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { Sidebar } from './components/Sidebar';
import { EventModal } from './components/EventModal';
import { SearchDialog } from './components/SearchDialog';
import { DayDetailsModal } from './components/DayDetailsModal';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserAuthenticated());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantName[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string>('');

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [dayDetailsState, setDayDetailsState] = useState<{
    isOpen: boolean;
    dateStr: string;
    events: EventItem[];
  }>({
    isOpen: false,
    dateStr: '',
    events: [],
  });

  // Load events from LocalStorage on mount
  useEffect(() => {
    const loaded = loadEvents();
    setEvents(loaded);
  }, []);

  // Save to LocalStorage whenever events state changes
  const updateEvents = useCallback((newEvents: EventItem[]) => {
    setEvents(newEvents);
    saveEvents(newEvents);
  }, []);

  // Auth unlock / lock handlers
  const handleUnlock = () => {
    setUserAuthenticated(true);
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    setUserAuthenticated(false);
    setIsAuthenticated(false);
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && isAuthenticated) {
        e.preventDefault();
        setIsSearchDialogOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Participant filter toggle
  const handleToggleParticipant = (name: ParticipantName) => {
    setSelectedParticipants((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleClearFilters = () => {
    setSelectedParticipants([]);
    setSearchQuery('');
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Participant filter
      if (
        selectedParticipants.length > 0 &&
        !selectedParticipants.some((p) => evt.participants.includes(p))
      ) {
        return false;
      }

      // Search bar filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = evt.title.toLowerCase().includes(query);
        const matchLocation = evt.location.toLowerCase().includes(query);
        const matchParticipant = evt.participants.some((p) =>
          p.toLowerCase().includes(query)
        );
        const matchDate = evt.startDate.includes(query);
        if (!matchTitle && !matchLocation && !matchParticipant && !matchDate) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedParticipants, searchQuery]);

  // Modal open triggers
  const handleOpenAddEvent = (dateStr?: string) => {
    setEditingEvent(null);
    setModalInitialDate(dateStr || new Date().toISOString().split('T')[0]);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setModalInitialDate(event.startDate);
    setIsEventModalOpen(true);
  };

  const handleOpenDayDetails = (dateStr: string, dayEvents: EventItem[]) => {
    setDayDetailsState({
      isOpen: true,
      dateStr,
      events: dayEvents,
    });
  };

  // CRUD actions
  const handleSaveEvent = (
    eventData: Omit<EventItem, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Edit
      const updated = events.map((item) =>
        item.id === existingId ? { ...item, ...eventData } : item
      );
      updateEvents(updated);
    } else {
      // Create
      const newEvent: EventItem = {
        ...eventData,
        id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        createdAt: Date.now(),
      };
      updateEvents([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((item) => item.id !== id);
    updateEvents(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Opravdu si přejete smazat veškeré naplánované akce?')) {
      const cleared = clearAllEvents();
      setEvents(cleared);
      setSelectedParticipants([]);
      setSearchQuery('');
    }
  };

  // Gatekeeper: If not authenticated, display Lock Screen
  if (!isAuthenticated) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col selection:bg-[#ff4359]/30">
      {/* Background subtle radial ambient glows */}
      <div className="fixed inset-0 ambient-glow pointer-events-none" />
      <div className="fixed inset-0 ambient-glow-corner pointer-events-none" />

      {/* Header */}
      <Header
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onOpenAddEvent={() => handleOpenAddEvent()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSearchDialog={() => setIsSearchDialogOpen(true)}
        onLock={handleLock}
      />

      {/* Active filter banner if filtering */}
      {(selectedParticipants.length > 0 || searchQuery.trim()) && (
        <div className="bg-[#111115] border-b border-zinc-800/80 px-4 py-2 text-xs flex items-center justify-between max-w-[1600px] w-full mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-400">Aktivní filtr:</span>
            {selectedParticipants.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff4359]/20 border border-[#ff4359]/40 text-white font-medium"
              >
                {p}
                <button
                  onClick={() => handleToggleParticipant(p)}
                  className="hover:text-rose-200"
                >
                  ×
                </button>
              </span>
            ))}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                Hledáno: &bdquo;{searchQuery}&ldquo;
                <button onClick={() => setSearchQuery('')} className="hover:text-white">
                  ×
                </button>
              </span>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-xs text-[#ff4359] hover:underline font-medium"
          >
            Zrušit všechny filtry
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Dominant Large Calendar */}
        <div className="flex-1 flex flex-col min-w-0">
          <Calendar
            year={currentYear}
            month={currentMonth}
            events={filteredEvents}
            onSelectDate={handleOpenAddEvent}
            onSelectEvent={handleOpenEditEvent}
            onOpenDayDetails={handleOpenDayDetails}
          />
        </div>

        {/* Sidebar Panel */}
        <Sidebar
          events={events}
          selectedParticipants={selectedParticipants}
          onToggleParticipant={handleToggleParticipant}
          onClearFilters={handleClearFilters}
          onSelectEvent={handleOpenEditEvent}
          onClearAllEvents={handleClearAll}
        />
      </main>

      {/* Event Add/Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={modalInitialDate}
        editingEvent={editingEvent}
      />

      {/* Cmd+K Global Search Dialog */}
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        events={events}
        onSelectEvent={handleOpenEditEvent}
      />

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={dayDetailsState.isOpen}
        onClose={() => setDayDetailsState((prev) => ({ ...prev, isOpen: false }))}
        dateStr={dayDetailsState.dateStr}
        events={dayDetailsState.events}
        onSelectEvent={handleOpenEditEvent}
        onAddNewEvent={handleOpenAddEvent}
      />
    </div>
  );
}

export default App;
