import Papa from 'papaparse';
import { StravaActivity } from '@/types';

/**
 * ROBUST HEADER-BASED CSV PARSER
 *
 * This parser uses header names with fallback mappings for French/English compatibility.
 * It handles various number formats (French "1 200,50" and English "1,200.50").
 */

// Header mappings: canonical name -> possible header variations
const HEADER_MAPPINGS: Record<string, string[]> = {
  activityDate: ['Activity Date', 'Date de l\'activité', 'Date'],
  activityName: ['Activity Name', 'Nom de l\'activité', 'Nom'],
  activityType: ['Activity Type', 'Type d\'activité', 'Type'],
  elapsedTime: ['Elapsed Time', 'Temps écoulé'],
  movingTime: ['Moving Time', 'Durée de déplacement'],
  distance: ['Distance'],
  elevationGain: ['Elevation Gain', 'Dénivelé positif', 'Elevation'],
  elevationLoss: ['Elevation Loss', 'Dénivelé négatif'],
  calories: ['Calories'],
  averageHeartRate: ['Average Heart Rate', 'Fréquence cardiaque moyenne', 'Avg HR'],
  averagePower: ['Average Power', 'Puissance moyenne', 'Avg Power'],
  averageTemperature: ['Average Temperature', 'Température moyenne', 'Avg Temp'],
  totalSteps: ['Total Steps', 'Nombre total de pas'],
};

/**
 * Clean numeric value - handles French format (non-breaking spaces, commas)
 * Examples: "1 200,50" -> 1200.5, "1,200.50" -> 1200.5, "1200" -> 1200
 */
function cleanNumeric(value: any): number {
  if (value === null || value === undefined || value === '') return 0;

  const str = String(value)
    .replace(/\u00A0/g, '') // Remove non-breaking spaces (French thousands separator)
    .replace(/\s/g, '')      // Remove all other spaces
    .trim();

  if (str === '') return 0;

  // Check if it's a comma decimal (French: "1200,50") or dot decimal (English: "1200.50")
  // If both exist, assume English format (comma = thousands, dot = decimal)
  const hasComma = str.includes(',');
  const hasDot = str.includes('.');

  let cleaned: string;
  if (hasComma && hasDot) {
    // English format: "1,200.50" -> remove commas
    cleaned = str.replace(/,/g, '');
  } else if (hasComma) {
    // French format: "1200,50" -> replace comma with dot
    cleaned = str.replace(',', '.');
  } else {
    // Already clean or integer
    cleaned = str;
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse time value - handles seconds (number), "HH:MM:SS", or "MM:SS" formats
 */
function parseTimeToSeconds(timeValue: any): number {
  if (!timeValue) return 0;

  // If it's already a number (seconds), return it
  if (typeof timeValue === 'number') return timeValue;

  const str = String(timeValue).trim();

  // Try parsing as number first
  const asNumber = cleanNumeric(str);
  if (asNumber > 0 && !str.includes(':')) {
    return asNumber;
  }

  // Parse HH:MM:SS or MM:SS format
  const parts = str.split(':').map(p => parseInt(p.trim(), 10));

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

/**
 * Parse distance - auto-detects if value is in meters or km
 * If value > 1000, assumes it's meters and converts to km
 */
function parseDistance(distValue: any): number {
  const cleaned = cleanNumeric(distValue);

  // Auto-detect: if distance > 1000, it's likely in meters
  if (cleaned > 1000) {
    return cleaned / 1000; // Convert meters to km
  }

  return cleaned; // Already in km
}

/**
 * Parse elevation - always in meters
 */
function parseElevation(elevValue: any): number {
  return cleanNumeric(elevValue);
}

/**
 * Determine if an activity is trail-based
 */
function isTrailActivity(activityType: string): boolean {
  const trailKeywords = [
    'trail', 'randonnée', 'hike', 'hiking', 'trek', 'mountain',
    'sentier', 'chemin', 'montagne', 'gravel'
  ];
  const typeLower = activityType.toLowerCase();
  return trailKeywords.some(keyword => typeLower.includes(keyword));
}

/**
 * Parse date string - handles French/English formats in LOCAL TIME (not UTC)
 *
 * CRITICAL: Parses in local time to prevent evening activities from shifting to previous day
 * CRITICAL: Returns null for invalid/missing dates to prevent "December Bug"
 *
 * Handles formats:
 * - "2 janv. 2025, 17:34:30" (French with time)
 * - "Jan 31, 2025, 5:30:00 PM" (English with time)
 * - ISO format fallback
 *
 * @returns Date object in local time, or null if parsing fails
 */
function parseDate(dateValue: any): Date | null {
  // Return null for missing/empty values (prevents December Bug)
  if (!dateValue || String(dateValue).trim() === '') return null;

  const dateStr = String(dateValue).trim();

  // DEBUG: Log December dates specifically
  if (dateStr.toLowerCase().includes('déc') || dateStr.toLowerCase().includes('dec')) {
    console.log('🔍 Parsing December date:', dateStr);
  }

  // Month mappings (normalized to lowercase, without accents)
  const monthMap: Record<string, number> = {
    // French abbreviated (with and without period)
    'janv': 0, 'janv.': 0, 'févr': 1, 'févr.': 1, 'fevr': 1, 'fevr.': 1,
    'mars': 2, 'mars.': 2, 'avr': 3, 'avr.': 3,
    'mai': 4, 'juin': 5, 'juil': 6, 'juil.': 6,
    'août': 7, 'août.': 7, 'aout': 7, 'aout.': 7,
    'sept': 8, 'sept.': 8,
    'déc': 11, 'déc.': 11, 'décembre': 11,
    // French full
    'janvier': 0, 'fevrier': 1, 'février': 1, 'avril': 3, 'juillet': 6,
    'septembre': 8, 'octobre': 9, 'novembre': 10, 'decembre': 11,
    // English abbreviated
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
    // English full
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
  };

  // Try day-month-year format (French): "2 janv. 2025, 17:34:30"
  // CRITICAL: Use [^\s,]+ instead of \w+ to capture accented characters (é, è, etc.)
  const dayMonthYearMatch = dateStr.match(/(\d{1,2})\s+([^\s,]+\.?)\s+(\d{4})(?:,?\s+(\d{1,2}):(\d{2}):(\d{2}))?/);
  if (dayMonthYearMatch) {
    const [, day, monthStr, year, hours, minutes, seconds] = dayMonthYearMatch;
    const month = monthMap[monthStr.toLowerCase()];

    if (month !== undefined) {
      // Create date in LOCAL time (not UTC)
      return new Date(
        parseInt(year),
        month,
        parseInt(day),
        hours ? parseInt(hours) : 0,
        minutes ? parseInt(minutes) : 0,
        seconds ? parseInt(seconds) : 0
      );
    }
  }

  // Try month-day-year format (English): "Jan 31, 2025, 5:30:00 PM"
  const monthDayYearMatch = dateStr.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})(?:,?\s+(\d{1,2}):(\d{2}):(\d{2})(?:\s+(AM|PM))?)?/);
  if (monthDayYearMatch) {
    const [, monthStr, day, year, hours, minutes, seconds, ampm] = monthDayYearMatch;
    const month = monthMap[monthStr.toLowerCase()];

    if (month !== undefined) {
      let hour = hours ? parseInt(hours) : 0;

      // Handle AM/PM
      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
        if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
      }

      // Create date in LOCAL time (not UTC)
      return new Date(
        parseInt(year),
        month,
        parseInt(day),
        hour,
        minutes ? parseInt(minutes) : 0,
        seconds ? parseInt(seconds) : 0
      );
    }
  }

  // Fallback: try ISO format
  const standardDate = new Date(dateStr);

  // DEBUG: Log if December date failed to parse
  if ((dateStr.toLowerCase().includes('déc') || dateStr.toLowerCase().includes('dec')) &&
      isNaN(standardDate.getTime())) {
    console.error('❌ Failed to parse December date:', dateStr);
  }

  return isNaN(standardDate.getTime()) ? null : standardDate;
}

/**
 * Find header index by trying multiple possible names
 */
function findHeaderIndex(headers: string[], possibleNames: string[]): number {
  for (const name of possibleNames) {
    const index = headers.findIndex(h => h.trim().toLowerCase() === name.toLowerCase());
    if (index !== -1) return index;
  }
  return -1;
}

/**
 * Parse CSV file and return array of StravaActivity objects
 * Uses header names with fallback mappings for language compatibility
 */
export async function parseStravaCSV(file: File): Promise<StravaActivity[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, // Parse with headers to get objects
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, any>[];
          const headers = results.meta.fields || [];

          console.log('📋 CSV Headers detected:', headers.slice(0, 10));

          // Map canonical names to actual column indices
          const columnMap: Record<string, number> = {};
          for (const [canonical, possibleNames] of Object.entries(HEADER_MAPPINGS)) {
            const index = findHeaderIndex(headers, possibleNames);
            if (index !== -1) {
              columnMap[canonical] = index;
            }
          }

          console.log('🗺️ Column mappings:', columnMap);

          const activities: StravaActivity[] = data.map((row) => {
            // Get values by canonical name
            const getValue = (canonical: string): any => {
              const colIndex = columnMap[canonical];
              if (colIndex === undefined) return undefined;
              return row[headers[colIndex]];
            };

            const activityType = String(getValue('activityType') || 'Unknown').trim();
            const activityName = String(getValue('activityName') || '').trim();
            const distanceRaw = getValue('distance');
            const movingTimeRaw = getValue('movingTime') || getValue('elapsedTime'); // Fallback if moving time missing

            const activity: StravaActivity = {
              date: parseDate(getValue('activityDate')),
              activityType,
              activityName,
              distance: parseDistance(distanceRaw),
              elapsedTime: parseTimeToSeconds(getValue('elapsedTime')),
              movingTime: parseTimeToSeconds(movingTimeRaw),
              elevationGain: parseElevation(getValue('elevationGain')),
              elevationLoss: parseElevation(getValue('elevationLoss')),
              isTrail: isTrailActivity(activityType),
              calories: cleanNumeric(getValue('calories')) || undefined,
              averageHeartRate: cleanNumeric(getValue('averageHeartRate')) || undefined,
              averagePower: cleanNumeric(getValue('averagePower')) || undefined,
              averageTemperature: cleanNumeric(getValue('averageTemperature')) || undefined,
              totalSteps: cleanNumeric(getValue('totalSteps')) || undefined,
            };

            return activity;
          });

          // Filter valid activities - CRITICAL: Filter out null dates (December Bug fix)
          const now = new Date();
          const validActivities = activities.filter(a =>
            a.date !== null && // Filter out null dates
            a.date instanceof Date &&
            !isNaN(a.date.getTime()) &&
            a.date <= now &&
            (a.distance > 0 || a.elapsedTime > 0) // At least some data
          );

          // Log filtered count
          const filteredCount = activities.length - validActivities.length;
          if (filteredCount > 0) {
            console.log(`🗑️ Filtered out ${filteredCount} invalid activities (null/bad dates or no data)`);
          }

          // Debug: Log year distribution
          const yearCounts: Record<number, number> = {};
          validActivities.forEach(a => {
            const year = a.date!.getFullYear();
            yearCounts[year] = (yearCounts[year] || 0) + 1;
          });
          console.log('📊 Activities by year:', yearCounts);
          console.log('📅 Sample dates (first 5):', validActivities.slice(0, 5).map(a => ({
            raw: a.activityName,
            parsed: a.date!.toLocaleString('fr-FR'),
            year: a.date!.getFullYear(),
          })));

          // Debug: Check what got filtered by future date check
          const futureActivities = activities.filter(a =>
            a.date !== null &&
            a.date instanceof Date &&
            !isNaN(a.date.getTime()) &&
            a.date > now
          );
          if (futureActivities.length > 0) {
            console.warn(`⚠️ Filtered ${futureActivities.length} future-dated activities!`);
            console.log('Sample future activities:', futureActivities.slice(0, 5).map(a => ({
              name: a.activityName,
              parsed: a.date!.toLocaleString('fr-FR'),
              year: a.date!.getFullYear(),
              month: a.date!.getMonth() + 1,
            })));
          }

          // Debug: Check December specifically BEFORE filtering
          const decemberBeforeFilter = activities.filter(a =>
            a.date !== null &&
            a.date instanceof Date &&
            !isNaN(a.date.getTime()) &&
            a.date.getMonth() === 11 // December = 11 (0-indexed)
          );
          console.log(`🎄 December activities BEFORE filtering: ${decemberBeforeFilter.length}`);
          if (decemberBeforeFilter.length > 0) {
            console.log('Sample December (before filter):', decemberBeforeFilter.slice(0, 3).map(a => ({
              name: a.activityName,
              parsed: a.date!.toLocaleString('fr-FR'),
              year: a.date!.getFullYear(),
              isFuture: a.date! > now,
            })));
          }

          resolve(validActivities);
        } catch (error) {
          console.error('❌ Error parsing CSV:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('❌ PapaParse error:', error);
        reject(error);
      },
    });
  });
}

/**
 * Filter activities for a specific year
 */
export function filterActivitiesByYear(
  activities: StravaActivity[],
  year: number
): StravaActivity[] {
  const filtered = activities.filter(activity =>
    activity.date !== null && activity.date.getFullYear() === year
  );
  console.log(`🔍 Filter: ${activities.length} total → ${filtered.length} for year ${year}`);

  // Show year distribution
  const yearDist: Record<number, number> = {};
  activities.forEach(a => {
    if (a.date !== null) {
      const y = a.date.getFullYear();
      yearDist[y] = (yearDist[y] || 0) + 1;
    }
  });
  console.log('📊 Year distribution:', yearDist);

  // Check December specifically
  const decemberCount = filtered.filter(a => a.date && a.date.getMonth() === 11).length;
  console.log(`📅 December ${year} activities: ${decemberCount}`);
  if (decemberCount > 0) {
    console.log('Sample December activities:', filtered.filter(a => a.date && a.date.getMonth() === 11).slice(0, 3).map(a => ({
      date: a.date?.toISOString(),
      name: a.activityName,
    })));
  }

  return filtered;
}

/**
 * Validate that a file appears to be a Strava CSV
 */
export function validateStravaCSV(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      preview: 2, // Only parse first 2 rows
      complete: (results) => {
        try {
          const headers = results.meta.fields || [];

          // Check if we have key Strava headers
          const hasActivityDate = findHeaderIndex(headers, HEADER_MAPPINGS.activityDate) !== -1;
          const hasActivityType = findHeaderIndex(headers, HEADER_MAPPINGS.activityType) !== -1;
          const hasDistance = findHeaderIndex(headers, HEADER_MAPPINGS.distance) !== -1;

          const isValid = hasActivityDate && hasActivityType && hasDistance;

          if (!isValid) {
            console.warn('⚠️ CSV validation failed - missing required headers');
            console.warn('Headers found:', headers.slice(0, 10));
          }

          resolve(isValid);
        } catch (error) {
          console.error('❌ Validation error:', error);
          resolve(false);
        }
      },
      error: () => resolve(false),
    });
  });
}
