/**
 * Date Utilities for Strava Wrapped
 * Universal date parsing and extraction functions
 */

/**
 * Parse Strava date strings in French format
 * Handles formats like: "2 janv. 2025, 17:34:30"
 */
export function parseStravaDate(dateStr: string): Date {
  if (!dateStr) return new Date();

  const dateString = String(dateStr);

  // Combined month map for French and English (full and abbreviated)
  const monthMap: Record<string, number> = {
    // French abbreviated
    'janv': 0, 'févr': 1, 'mars': 2, 'avr': 3, 'mai': 4, 'juin': 5,
    'juil': 6, 'août': 7, 'aout': 7, 'sept': 8, 'oct': 9, 'nov': 10, 'déc': 11, 'dec': 11,
    // French full
    'janvier': 0, 'février': 1, 'fevrier': 1, 'avril': 3, 'juillet': 6,
    'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11, 'decembre': 11,
    // English abbreviated
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8,
    // English full
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
  };

  // Try day-month-year format with optional time (French): "2 janv. 2025, 17:34:30"
  const dayMonthYearMatch = dateString.match(/(\d{1,2})\s+(\w+)\.?\s+(\d{4})(?:,?\s+(\d{1,2}):(\d{2}):(\d{2}))?/);
  if (dayMonthYearMatch) {
    const [, day, monthStr, year, hours, minutes, seconds] = dayMonthYearMatch;
    const month = monthMap[monthStr.toLowerCase()] ?? 0;

    // If time is present, include it
    if (hours !== undefined) {
      return new Date(
        parseInt(year),
        month,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
    }

    return new Date(parseInt(year), month, parseInt(day));
  }

  // Try month-day-year format (English): "Jan 31, 2025" or "January 31, 2025"
  const monthDayYearMatch = dateString.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})(?:,?\s+(\d{1,2}):(\d{2}):(\d{2}))?/);
  if (monthDayYearMatch) {
    const [, monthStr, day, year, hours, minutes, seconds] = monthDayYearMatch;
    const month = monthMap[monthStr.toLowerCase()] ?? 0;

    // If time is present, include it
    if (hours !== undefined) {
      return new Date(
        parseInt(year),
        month,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
    }

    return new Date(parseInt(year), month, parseInt(day));
  }

  // Fallback to standard parsing
  return new Date(dateString);
}

/**
 * Get year from date
 */
export function getYear(date: Date): number {
  return date.getFullYear();
}

/**
 * Get month from date (0-11)
 */
export function getMonth(date: Date): number {
  return date.getMonth();
}

/**
 * Get month name in French
 */
export function getMonthName(date: Date): string {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return monthNames[date.getMonth()];
}

/**
 * Get day of week (0-6, where 0 is Sunday)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Get day of week name in French
 * Returns Monday-Sunday format (0=Lundi, 6=Dimanche)
 */
export function getDayOfWeekName(date: Date): string {
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return dayNames[date.getDay()];
}

/**
 * Get day of week for French week format (0=Monday, 6=Sunday)
 * Converts JavaScript's Sunday-first (0-6) to Monday-first (0-6)
 */
export function getDayOfWeekFrench(date: Date): number {
  const jsDay = date.getDay();
  // Convert: Sunday (0) -> 6, Monday (1) -> 0, ..., Saturday (6) -> 5
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Get hour from date (0-23)
 */
export function getHour(date: Date): number {
  return date.getHours();
}

/**
 * Get time of day period based on hour
 * Matches Python logic exactly:
 * - 5-12: Matin
 * - 12-14: Midi
 * - 14-18: Après-midi
 * - 18-22: Soirée
 * - 22-5: Nuit
 */
export function getTimeOfDay(date: Date): string {
  const hour = date.getHours();
  return getTimeOfDayPeriod(hour);
}

/**
 * Get time of day period from hour value
 * Corresponds exactly to Python logic
 */
export function getTimeOfDayPeriod(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Matin';
  if (hour >= 12 && hour < 14) return 'Midi';
  if (hour >= 14 && hour < 18) return 'Après-midi';
  if (hour >= 18 && hour < 22) return 'Soirée';
  return 'Nuit';
}

/**
 * Get formatted date string
 * Returns format like "2 janvier 2025"
 */
export function getFormattedDate(date: Date): string {
  const day = date.getDate();
  const monthName = getMonthName(date).toLowerCase();
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

/**
 * Check if a date is in a specific year
 */
export function isInYear(date: Date, year: number): boolean {
  return date.getFullYear() === year;
}

/**
 * Get personalized message for day of week
 */
export function getDayMessage(dayName: string): string {
  const dayMessages: Record<string, string> = {
    'Lundi': 'Lundi Motivation! 💪',
    'Mardi': 'Mardi Puissance! ⚡',
    'Mercredi': 'Mercredi Mi-semaine! 🔥',
    'Jeudi': 'Jeudi Détermination! 🎯',
    'Vendredi': 'Vendredi Liberté! 🎉',
    'Samedi': 'Samedi Aventure! 🏔️',
    'Dimanche': 'Dimanche Récupération! 🌅'
  };
  return dayMessages[dayName] || dayName;
}

/**
 * Get emoji for day of week
 */
export function getDayEmoji(dayName: string): string {
  const dayEmojis: Record<string, string> = {
    'Lundi': '💼',
    'Mardi': '⚡',
    'Mercredi': '🔥',
    'Jeudi': '🎯',
    'Vendredi': '🎉',
    'Samedi': '🏔️',
    'Dimanche': '🌅'
  };
  return dayEmojis[dayName] || '📅';
}
