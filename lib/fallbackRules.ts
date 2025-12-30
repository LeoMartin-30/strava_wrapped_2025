import { ProcessedStats } from '@/types';

/**
 * Intelligent Fallback System
 * Determines which slides should be displayed based on available data
 */

export interface FallbackRule {
  slideType: string;
  requiredData: string[];
  minThreshold?: number;
}

export const FALLBACK_RULES: FallbackRule[] = [
  {
    slideType: 'IntensitySlide',
    requiredData: ['heartRateZones'],
    minThreshold: 1,
  },
  {
    slideType: 'PowerSlide',
    requiredData: ['powerStats.averagePower'],
    minThreshold: 1,
  },
  {
    slideType: 'WeatherSlide',
    requiredData: ['temperatureRecords.activitiesWithTemp'],
    minThreshold: 5,
  },
  {
    slideType: 'EmojiSlide',
    requiredData: ['topEmojis'],
    minThreshold: 1,
  },
  {
    slideType: 'SocialButterflySlide',
    requiredData: ['followerStats.total', 'challengeStats.completed'],
    minThreshold: 1,
  },
  {
    slideType: 'GravitySlide',
    requiredData: ['totalElevationLoss'],
    minThreshold: 1,
  },
  {
    slideType: 'TrailSlide',
    requiredData: ['trailFactor'],
    minThreshold: 0.01,
  },
  {
    slideType: 'CalorieSlide',
    requiredData: ['totalCalories'],
    minThreshold: 1,
  },
  {
    slideType: 'MoteurSlide',
    requiredData: ['preferences.ftp', 'preferences.maxHR'],
    minThreshold: 1,
  },
];

/**
 * Check if a slide should be displayed based on available data
 */
export function shouldShowSlide(
  slideType: string,
  stats: ProcessedStats
): boolean {
  const rule = FALLBACK_RULES.find((r) => r.slideType === slideType);

  // No rule = always show (default behavior)
  if (!rule) {
    return true;
  }

  // Check all required data fields
  for (const dataPath of rule.requiredData) {
    const value = getNestedValue(stats, dataPath);

    // Array check
    if (Array.isArray(value)) {
      if (value.length < (rule.minThreshold || 1)) {
        console.log(`❌ ${slideType} hidden: ${dataPath} has ${value.length} items (need ${rule.minThreshold || 1})`);
        return false;
      }
    }
    // Number check
    else if (typeof value === 'number') {
      if (value < (rule.minThreshold || 1)) {
        console.log(`❌ ${slideType} hidden: ${dataPath} = ${value} (need >= ${rule.minThreshold || 1})`);
        return false;
      }
    }
    // Existence check (null/undefined)
    else if (value === null || value === undefined) {
      console.log(`❌ ${slideType} hidden: ${dataPath} is ${value}`);
      return false;
    }
  }

  console.log(`✅ ${slideType} will be displayed`);
  return true;
}

/**
 * Get nested value from object using dot notation path
 * Example: getNestedValue(stats, 'powerStats.normalizedPower')
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    return current[key];
  }, obj);
}

/**
 * Get count of slides that will be displayed
 */
export function getVisibleSlideCount(stats: ProcessedStats): number {
  let count = 0;

  // Always shown
  count++; // DominanceRevealSlide
  count++; // IntroSlide
  count++; // ActivityBreakdownSlide (if multiple types)
  count++; // ElevationSlide
  count++; // ChronosMonthSlide
  count++; // ChronosDaySlide
  count++; // ChronosSlide
  count++; // KudosSlide
  count++; // ConsistencySlide
  count++; // RecordsSlide
  count++; // SummarySlide

  // Conditional
  if (stats.profile) count++; // IdentitySlide
  if (shouldShowSlide('IntensitySlide', stats)) count++;
  if (shouldShowSlide('PowerSlide', stats)) count++;
  if (shouldShowSlide('GravitySlide', stats)) count++;
  if (shouldShowSlide('TrailSlide', stats)) count++;
  if (shouldShowSlide('CalorieSlide', stats)) count++;
  if (shouldShowSlide('WeatherSlide', stats)) count++;
  if (shouldShowSlide('EmojiSlide', stats)) count++;
  if (shouldShowSlide('MoteurSlide', stats)) count++;
  if (shouldShowSlide('SocialButterflySlide', stats)) count++;

  return count;
}

/**
 * Validate stats object has minimum required data
 */
export function hasMinimumData(stats: ProcessedStats): boolean {
  return (
    stats.totalActivities > 0 &&
    stats.totalDistance > 0 &&
    stats.totalHours > 0
  );
}
