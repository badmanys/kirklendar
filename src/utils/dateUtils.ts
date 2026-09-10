export interface CalendarDay {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

export const CZECH_MONTHS = [
  'Leden',
  'Únor',
  'Březen',
  'Duben',
  'Květen',
  'Červen',
  'Červenec',
  'Srpen',
  'Září',
  'Říjen',
  'Listopad',
  'Prosinec',
];

export const CZECH_DAYS_SHORT = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export const CZECH_DAYS_FULL = [
  'Pondělí',
  'Úterý',
  'Středa',
  'Čtvrtek',
  'Pátek',
  'Sobota',
  'Neděle',
];

export const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getMonthDays = (year: number, monthIndex: number): CalendarDay[] => {
  const todayStr = formatDateToYMD(new Date());
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // First day of current month
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  // Total days in current month
  const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
  // Convert so Monday = 0, ..., Sunday = 6
  let firstDayWeekday = firstDayOfMonth.getDay() - 1;
  if (firstDayWeekday < 0) firstDayWeekday = 6;

  const days: CalendarDay[] = [];

  // Previous month padding
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const prevDate = new Date(year, monthIndex - 1, daysInPrevMonth - i);
    const dateStr = formatDateToYMD(prevDate);
    const checkDate = new Date(prevDate);
    checkDate.setHours(0, 0, 0, 0);

    days.push({
      date: prevDate,
      dateStr,
      dayNumber: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: checkDate.getTime() < todayDate.getTime(),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const currDate = new Date(year, monthIndex, d);
    const dateStr = formatDateToYMD(currDate);
    const checkDate = new Date(currDate);
    checkDate.setHours(0, 0, 0, 0);

    days.push({
      date: currDate,
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isPast: checkDate.getTime() < todayDate.getTime(),
    });
  }

  // Next month padding to complete rows of 7 (up to 35 or 42)
  const remainingCells = (7 - (days.length % 7)) % 7;
  const targetTotal = days.length + remainingCells < 35 ? 35 : days.length + remainingCells;
  const extraNeeded = targetTotal - days.length;

  for (let nextDay = 1; nextDay <= extraNeeded; nextDay++) {
    const nextDate = new Date(year, monthIndex + 1, nextDay);
    const dateStr = formatDateToYMD(nextDate);
    const checkDate = new Date(nextDate);
    checkDate.setHours(0, 0, 0, 0);

    days.push({
      date: nextDate,
      dateStr,
      dayNumber: nextDay,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: checkDate.getTime() < todayDate.getTime(),
    });
  }

  return days;
};

export const formatCountdown = (startDateStr: string, startTime: string): string => {
  const [year, month, day] = startDateStr.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);

  const eventDateTime = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();

  const diffMs = eventDateTime.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const todayStr = formatDateToYMD(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDateToYMD(tomorrow);

  if (diffMs < 0) {
    if (startDateStr === todayStr) {
      return `Dnes (${startTime})`;
    }
    const pastDays = Math.abs(diffDays);
    return pastDays <= 1 ? 'Včera' : `Před ${pastDays} dny`;
  }

  if (startDateStr === todayStr) {
    if (diffHours <= 0) return 'Právě probíhá';
    if (diffHours === 1) return 'Za 1 hodinu';
    if (diffHours < 5) return `Za ${diffHours} hodiny`;
    return `Dnes v ${startTime}`;
  }

  if (startDateStr === tomorrowStr) {
    return `Zítra v ${startTime}`;
  }

  if (diffDays === 2) return `Za 2 dny`;
  if (diffDays === 3) return `Za 3 dny`;
  if (diffDays === 4) return `Za 4 dny`;
  if (diffDays < 7) return `Za ${diffDays} dní`;
  if (diffDays < 14) return `Příští týden`;

  return `${day}. ${CZECH_MONTHS[month - 1].toLowerCase()}`;
};

/**
 * Calculates the Kirk year ("XK") for a specific date (year, month 1-12, day 1-31).
 * Calendar epoch: 9.9.2025 (0K).
 * New year is always on September 9th (9.9.).
 * Example: 2026-09-10 -> 1K (1 year since Kirk's death).
 */
export const getKirkYear = (year: number, month: number, day: number): string => {
  const isAfterOrOnSept9 = month > 9 || (month === 9 && day >= 9);
  const kYear = isAfterOrOnSept9 ? year - 2025 : year - 2026;
  return `${kYear}K`;
};

/**
 * Calculates the Kirk year ("XK") for a calendar month view.
 * The new Kirk year starts in September (monthIndex 8).
 * Months Sep-Dec (8-11) are year - 2025.
 * Months Jan-Aug (0-7) are year - 2026.
 */
export const getKirkYearForMonth = (year: number, monthIndex: number): string => {
  const kYear = monthIndex >= 8 ? year - 2025 : year - 2026;
  return `${kYear}K`;
};

export const formatCzechDateString = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const monthName = CZECH_MONTHS[m - 1] || '';
  const kirkYear = getKirkYear(y, m, d);
  return `${d}. ${monthName.toLowerCase()} ${kirkYear}`;
};

