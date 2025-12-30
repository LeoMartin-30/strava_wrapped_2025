import {
  StravaActivity,
  ProcessedStats,
  ActivityTypeStats,
  HeartRateZone,
  TimeOfDayDistribution,
  TemperatureRecords,
  ConsistencyStreak,
  PowerStats,
  ActivityRecord,
  MonthStats,
  DayOfWeekStats,
  FollowerStats,
  ChallengeStats,
} from '@/types';
import {
  getMonthName,
  getDayOfWeekName,
  getDayOfWeekFrench,
  getDayMessage,
  getDayEmoji,
} from './dateUtils';

/**
 * Calculate heart rate zones based on average heart rate
 * Personalized zones based on % of Max HR:
 * Zone 1: 0-60% of Max HR (Recovery)
 * Zone 2: 60-70% of Max HR (Easy)
 * Zone 3: 70-80% of Max HR (Aerobic)
 * Zone 4: 80-90% of Max HR (Threshold)
 * Zone 5: 90-100%+ of Max HR (Max)
 *
 * @param activities - Activities to analyze
 * @param userMaxHR - Optional user's max heart rate. If not provided or 0, defaults to 190 bpm
 */
function calculateHeartRateZones(activities: StravaActivity[], userMaxHR?: number): HeartRateZone[] {
  const activitiesWithHR = activities.filter(a => a.averageHeartRate);

  if (activitiesWithHR.length === 0) {
    return [];
  }

  // Use provided max HR, or default to 190 bpm if not provided or 0
  const maxHR = userMaxHR && userMaxHR > 0 ? userMaxHR : 190;

  console.log(`💓 Calculating HR zones with Max HR: ${maxHR} bpm ${userMaxHR && userMaxHR > 0 ? '(from user profile)' : '(default fallback)'}`);

  // Calculate zone thresholds based on % of max HR
  const zones = [
    {
      zone: 'Zone 1 (Recovery)',
      min: 0,
      max: Math.round(maxHR * 0.60),
      count: 0,
      color: '#94A3B8'
    },
    {
      zone: 'Zone 2 (Easy)',
      min: Math.round(maxHR * 0.60),
      max: Math.round(maxHR * 0.70),
      count: 0,
      color: '#60A5FA'
    },
    {
      zone: 'Zone 3 (Aerobic)',
      min: Math.round(maxHR * 0.70),
      max: Math.round(maxHR * 0.80),
      count: 0,
      color: '#34D399'
    },
    {
      zone: 'Zone 4 (Threshold)',
      min: Math.round(maxHR * 0.80),
      max: Math.round(maxHR * 0.90),
      count: 0,
      color: '#FBBF24'
    },
    {
      zone: 'Zone 5 (Max)',
      min: Math.round(maxHR * 0.90),
      max: 999,
      count: 0,
      color: '#FC4C02'
    },
  ];

  console.log('HR Zone thresholds:', zones.map(z => `${z.zone}: ${z.min}-${z.max === 999 ? `${maxHR}+` : z.max} bpm`).join(', '));

  activitiesWithHR.forEach(activity => {
    const hr = activity.averageHeartRate!;
    const zone = zones.find(z => hr >= z.min && hr < z.max);
    if (zone) {
      zone.count++;
    }
  });

  const total = activitiesWithHR.length;

  return zones.map(z => ({
    zone: z.zone,
    percentage: Math.round((z.count / total) * 100),
    count: z.count,
    color: z.color,
  }));
}

/**
 * Calculate time of day distribution
 * Matches Python logic EXACTLY: Matin (5-12), Midi (12-14), Après-midi (14-18), Soirée (18-22), Nuit (22-5)
 */
function calculateTimeOfDayDistribution(activities: StravaActivity[]): TimeOfDayDistribution {
  const distribution: TimeOfDayDistribution = {
    morning: 0,   // 5h-12h (Matin)
    midday: 0,    // 12h-14h (Midi)
    afternoon: 0, // 14h-18h (Après-midi)
    evening: 0,   // 18h-22h (Soirée)
    night: 0,     // 22h-5h (Nuit)
  };

  activities.forEach(activity => {
    if (!activity.date) return; // Skip null dates
    const hour = activity.date.getHours();

    if (hour >= 5 && hour < 12) {
      distribution.morning++;
    } else if (hour >= 12 && hour < 14) {
      distribution.midday++;
    } else if (hour >= 14 && hour < 18) {
      distribution.afternoon++;
    } else if (hour >= 18 && hour < 22) {
      distribution.evening++;
    } else {
      distribution.night++;
    }
  });

  return distribution;
}

/**
 * Calculate temperature records
 */
function calculateTemperatureRecords(activities: StravaActivity[]): TemperatureRecords {
  const activitiesWithTemp = activities.filter(a =>
    a.averageTemperature !== undefined &&
    a.averageTemperature !== null &&
    a.averageTemperature !== 0
  );

  console.log(`Temperature debug: ${activitiesWithTemp.length} activities with temperature data`);
  if (activitiesWithTemp.length > 0) {
    const temps = activitiesWithTemp.map(a => a.averageTemperature).slice(0, 10);
    console.log('Sample temperatures:', temps);
  }

  if (activitiesWithTemp.length === 0) {
    return {
      coldest: { temperature: 0, date: new Date(), activityType: 'N/A' },
      hottest: { temperature: 0, date: new Date(), activityType: 'N/A' },
      averageTemperature: 0,
      activitiesWithTemp: 0,
    };
  }

  const coldest = activitiesWithTemp.reduce((min, activity) =>
    activity.averageTemperature! < min.averageTemperature! ? activity : min
  );

  const hottest = activitiesWithTemp.reduce((max, activity) =>
    activity.averageTemperature! > max.averageTemperature! ? activity : max
  );

  const averageTemperature =
    activitiesWithTemp.reduce((sum, a) => sum + a.averageTemperature!, 0) /
    activitiesWithTemp.length;

  console.log(`Temperature range: ${coldest.averageTemperature}°C to ${hottest.averageTemperature}°C`);

  return {
    coldest: {
      temperature: Math.round(coldest.averageTemperature!),
      date: coldest.date!,
      activityType: coldest.activityType,
    },
    hottest: {
      temperature: Math.round(hottest.averageTemperature!),
      date: hottest.date!,
      activityType: hottest.activityType,
    },
    averageTemperature: Math.round(averageTemperature),
    activitiesWithTemp: activitiesWithTemp.length,
  };
}

/**
 * Calculate activities by month
 * Returns stats for each month with activities
 */
function calculateActivitiesByMonth(activities: StravaActivity[]): Record<string, MonthStats> {
  const monthsMap: Record<string, MonthStats> = {};

  activities.forEach(activity => {
    if (!activity.date) return; // Skip null dates
    const monthName = getMonthName(activity.date);
    const monthNumber = activity.date.getMonth() + 1; // 1-12

    if (!monthsMap[monthName]) {
      monthsMap[monthName] = {
        month: monthName,
        monthNumber,
        count: 0,
        totalDistance: 0,
        totalTime: 0,
        totalElevation: 0,
      };
    }

    monthsMap[monthName].count++;
    monthsMap[monthName].totalDistance += activity.distance;
    monthsMap[monthName].totalTime += activity.movingTime;
    monthsMap[monthName].totalElevation += activity.elevationGain;
  });

  console.log(`📅 Activities by month: ${Object.keys(monthsMap).length} months with activities`);
  Object.entries(monthsMap).forEach(([month, stats]) => {
    console.log(`  ${month} (month ${stats.monthNumber}): ${stats.count} activities, ${stats.totalDistance.toFixed(1)} km`);
  });

  // Check if December exists
  const decemberExists = Object.values(monthsMap).some(m => m.monthNumber === 12);
  if (!decemberExists) {
    console.warn('⚠️ Décembre (month 12) not found in activities! Checking all activity dates...');
    const decemberActivities = activities.filter(a => a.date && a.date.getMonth() === 11); // 11 = December (0-indexed)
    console.log(`Found ${decemberActivities.length} December activities in raw data:`,
      decemberActivities.slice(0, 5).map(a => ({
        date: a.date?.toISOString(),
        month: a.date?.getMonth(),
        monthName: a.date ? getMonthName(a.date) : 'null'
      }))
    );
  }

  return monthsMap;
}

/**
 * Calculate activities by day of week
 * Returns stats for each day with activities
 */
function calculateActivitiesByDayOfWeek(activities: StravaActivity[]): Record<string, DayOfWeekStats> {
  const daysMap: Record<string, DayOfWeekStats> = {};

  activities.forEach(activity => {
    if (!activity.date) return; // Skip null dates
    const dayName = getDayOfWeekName(activity.date);
    const dayNumber = getDayOfWeekFrench(activity.date); // 0=Lundi, 6=Dimanche

    if (!daysMap[dayName]) {
      daysMap[dayName] = {
        day: dayName,
        dayNumber,
        count: 0,
        totalDistance: 0,
        totalTime: 0,
        message: getDayMessage(dayName),
        emoji: getDayEmoji(dayName),
      };
    }

    daysMap[dayName].count++;
    daysMap[dayName].totalDistance += activity.distance;
    daysMap[dayName].totalTime += activity.movingTime;
  });

  console.log(`Activities by day of week: ${Object.keys(daysMap).length} days with activities`);
  Object.entries(daysMap).forEach(([day, stats]) => {
    console.log(`  ${day}: ${stats.count} activities, ${stats.totalDistance.toFixed(1)} km`);
  });

  return daysMap;
}

/**
 * Calculate consistency streak
 */
function calculateConsistencyStreak(activities: StravaActivity[], year?: number): ConsistencyStreak {
  if (activities.length === 0) {
    return {
      longestStreak: 0,
      currentStreak: 0,
      totalWeeksActive: 0,
      activeDaysPercentage: 0,
    };
  }

  // Filter out null dates first, then sort
  const validActivities = activities.filter(a => a.date !== null);
  const sortedActivities = [...validActivities].sort((a, b) => a.date!.getTime() - b.date!.getTime());

  // Get unique active days
  const activeDays = new Set(
    sortedActivities.map(a => a.date!.toISOString().split('T')[0])
  );

  // Calculate streaks
  let longestStreak = 1;
  let currentStreak = 1;
  let tempStreak = 1;

  const sortedDays = Array.from(activeDays).sort();

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1]);
    const currDate = new Date(sortedDays[i]);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Check if current streak is ongoing
  const lastActivityDate = new Date(sortedDays[sortedDays.length - 1]);
  const today = new Date();
  const daysSinceLastActivity = Math.floor(
    (today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  currentStreak = daysSinceLastActivity <= 1 ? tempStreak : 0;

  // Calculate weeks active and percentage
  // If we're analyzing a specific year, calculate based on that year's days
  let totalDaysInPeriod: number;

  if (year) {
    // For a specific year, use 365 days (or 366 for leap year)
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    totalDaysInPeriod = isLeapYear ? 366 : 365;
  } else {
    // For all-time stats, calculate based on first to last activity
    const firstDate = new Date(sortedDays[0]);
    const lastDate = new Date(sortedDays[sortedDays.length - 1]);
    totalDaysInPeriod = Math.floor(
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1; // +1 to include both first and last day
  }

  const totalWeeksActive = Math.floor(totalDaysInPeriod / 7);
  const activeDaysPercentage = Math.round((activeDays.size / totalDaysInPeriod) * 100);

  return {
    longestStreak,
    currentStreak,
    totalWeeksActive,
    activeDaysPercentage,
  };
}

/**
 * Calculate power statistics
 */
function calculatePowerStats(activities: StravaActivity[]): PowerStats | undefined {
  const activitiesWithPower = activities.filter(a => a.averagePower);

  if (activitiesWithPower.length === 0) {
    return undefined;
  }

  const totalPower = activitiesWithPower.reduce((sum, a) => sum + a.averagePower!, 0);
  const averagePower = Math.round(totalPower / activitiesWithPower.length);
  const peakPower = Math.round(
    Math.max(...activitiesWithPower.map(a => a.averagePower!))
  );

  return {
    averagePower,
    peakPower,
    totalActivitiesWithPower: activitiesWithPower.length,
  };
}

/**
 * Calculate trail factor (percentage of distance on trails)
 */
function calculateTrailFactor(activities: StravaActivity[]): number {
  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0);
  const trailDistance = activities
    .filter(a => a.isTrail)
    .reduce((sum, a) => sum + a.distance, 0);

  if (totalDistance === 0) return 0;
  return Math.round((trailDistance / totalDistance) * 100);
}

/**
 * Extract top 3 emojis from activity names
 */
function extractTopEmojis(activities: StravaActivity[]): string[] {
  // Enhanced emoji regex to catch more emoji types
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Extended_Pictographic})/gu;
  const emojiCounts: Record<string, number> = {};

  activities.forEach(activity => {
    const name = activity.activityName || '';
    const emojis = name.match(emojiRegex);
    if (emojis) {
      emojis.forEach(emoji => {
        // Clean up variation selectors
        const cleanEmoji = emoji.replace(/\uFE0F/g, '').trim();
        if (cleanEmoji) {
          emojiCounts[cleanEmoji] = (emojiCounts[cleanEmoji] || 0) + 1;
        }
      });
    }
  });

  // Sort by count and return top 3
  return Object.entries(emojiCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([emoji]) => emoji);
}

/**
 * Group activities by type
 * Uses movingTime for accurate time tracking
 */
function groupActivitiesByType(activities: StravaActivity[]): Record<string, ActivityTypeStats> {
  const grouped: Record<string, ActivityTypeStats> = {};

  activities.forEach(activity => {
    const type = activity.activityType;

    if (!grouped[type]) {
      grouped[type] = {
        count: 0,
        totalDistance: 0,
        totalTime: 0,
        totalElevation: 0,
      };
    }

    grouped[type].count++;
    grouped[type].totalDistance += activity.distance;
    grouped[type].totalTime += activity.movingTime;
    grouped[type].totalElevation += activity.elevationGain;
  });

  return grouped;
}

/**
 * Calculate record-breaking activities
 * Uses movingTime for accurate speed calculations (excludes pauses)
 */
function calculateActivityRecords(activities: StravaActivity[]): {
  longestByDistance?: ActivityRecord;
  longestByDuration?: ActivityRecord;
  fastest?: ActivityRecord;
  averageSpeed: number;
} {
  if (activities.length === 0) {
    return { averageSpeed: 0 };
  }

  // Filter activities with movement (distance > 0 and movingTime > 0)
  const movingActivities = activities.filter(a => a.distance > 0 && a.movingTime > 0);

  if (movingActivities.length === 0) {
    return { averageSpeed: 0 };
  }

  // Find longest by distance
  const longestByDistance = movingActivities.reduce((max, activity) =>
    activity.distance > max.distance ? activity : max
  );

  // Find longest by duration (using movingTime)
  const longestByDuration = movingActivities.reduce((max, activity) =>
    activity.movingTime > max.movingTime ? activity : max
  );

  // Calculate speeds using movingTime and find fastest
  const activitiesWithSpeed = movingActivities.map(activity => ({
    activity,
    speed: (activity.distance / (activity.movingTime / 3600)), // km/h
  }));

  const fastest = activitiesWithSpeed.reduce((max, item) =>
    item.speed > max.speed ? item : max
  );

  // Calculate average speed across all activities using movingTime
  const totalDistance = movingActivities.reduce((sum, a) => sum + a.distance, 0);
  const totalTime = movingActivities.reduce((sum, a) => sum + a.movingTime, 0);
  const averageSpeed = totalDistance / (totalTime / 3600); // km/h

  return {
    longestByDistance: {
      distance: longestByDistance.distance,
      duration: longestByDistance.movingTime,
      date: longestByDistance.date!,
      activityType: longestByDistance.activityType,
      activityName: longestByDistance.activityName,
      averageSpeed: longestByDistance.distance / (longestByDistance.movingTime / 3600),
    },
    longestByDuration: {
      distance: longestByDuration.distance,
      duration: longestByDuration.movingTime,
      date: longestByDuration.date!,
      activityType: longestByDuration.activityType,
      activityName: longestByDuration.activityName,
      averageSpeed: longestByDuration.distance / (longestByDuration.movingTime / 3600),
    },
    fastest: {
      distance: fastest.activity.distance,
      duration: fastest.activity.movingTime,
      date: fastest.activity.date!,
      activityType: fastest.activity.activityType,
      activityName: fastest.activity.activityName,
      averageSpeed: fastest.speed,
    },
    averageSpeed,
  };
}

/**
 * Calculate daily activity breakdown (for heatmap/calendar view)
 */
function calculateDailyActivities(activities: StravaActivity[], year?: number): Record<string, number> {
  const dailyCount: Record<string, number> = {};

  activities.forEach(activity => {
    if (!activity.date) return; // Skip null dates
    const dateKey = activity.date.toISOString().split('T')[0]; // YYYY-MM-DD
    dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
  });

  return dailyCount;
}

/**
 * Process all activities and return comprehensive stats
 */
export function processActivities(
  activities: StravaActivity[],
  year?: number,
  additionalData?: {
    profile?: any;
    preferences?: any;
    comments?: any[];
    social?: any;
    logins?: any;
    followers?: any[];
    challenges?: any[];
  }
): ProcessedStats {
  const totalActivities = activities.length;
  // Use movingTime (like Python's "Durée de déplacement") instead of elapsedTime
  const totalHours = activities.reduce((sum, a) => sum + a.movingTime, 0) / 3600;
  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0);
  const totalElevation = activities.reduce((sum, a) => sum + a.elevationGain, 0);
  const totalElevationLoss = activities.reduce((sum, a) => sum + a.elevationLoss, 0);
  const totalCalories = activities.reduce((sum, a) => sum + (a.calories || 0), 0);
  const activitiesWithCalories = activities.filter(a => a.calories && a.calories > 0).length;
  const totalSteps = activities.reduce((sum, a) => sum + (a.totalSteps || 0), 0);

  // Get unique active days (filter null dates)
  const activeDays = new Set(
    activities
      .filter(a => a.date !== null)
      .map(a => a.date!.toISOString().split('T')[0])
  );

  const activitiesByType = groupActivitiesByType(activities);

  // Extract user's max HR from preferences (if available)
  const userMaxHR = additionalData?.preferences?.maxHR;
  const heartRateZones = calculateHeartRateZones(activities, userMaxHR);

  const timeOfDayDistribution = calculateTimeOfDayDistribution(activities);
  const temperatureRecords = calculateTemperatureRecords(activities);
  const consistencyStreak = calculateConsistencyStreak(activities, year);
  const powerStats = calculatePowerStats(activities);
  const trailFactor = calculateTrailFactor(activities);
  const topEmojis = extractTopEmojis(activities);
  const activityRecords = calculateActivityRecords(activities);
  const dailyActivities = calculateDailyActivities(activities, year);

  // NEW: Calculate temporal stats
  const activitiesByMonth = calculateActivitiesByMonth(activities);
  const activitiesByDayOfWeek = calculateActivitiesByDayOfWeek(activities);

  // NEW: Process followers and challenges
  const followers = additionalData?.followers || [];
  const challenges = additionalData?.challenges || [];

  const followerStats: FollowerStats = {
    total: followers.length,
    new2025: undefined, // No date data in followers.csv
  };

  const challengeStats: ChallengeStats = {
    total: challenges.length,
    completed: challenges.filter((c: any) => c.completed).length,
    completed2025: challenges.filter((c: any) => c.completed && c.dateJoined?.getFullYear() === year).length,
  };

  console.log(`Follower stats: ${followerStats.total} total`);
  console.log(`Challenge stats: ${challengeStats.total} total, ${challengeStats.completed} completed, ${challengeStats.completed2025} completed in ${year || 'all time'}`);

  return {
    // Profile & Preferences
    profile: additionalData?.profile,
    preferences: additionalData?.preferences,

    // Activity Stats
    totalActivities,
    totalHours: Math.round(totalHours),
    totalDistance: Math.round(totalDistance),
    totalElevation: Math.round(totalElevation),
    totalElevationLoss: Math.round(totalElevationLoss),
    totalCalories: Math.round(totalCalories),
    totalSteps,
    activitiesWithCalories,
    trailFactor,
    topEmojis,
    activitiesByType,
    dailyActivities,
    heartRateZones,
    timeOfDayDistribution,
    temperatureRecords,
    consistencyStreak,
    powerStats,
    longestActivityByDistance: activityRecords.longestByDistance,
    longestActivityByDuration: activityRecords.longestByDuration,
    longestActivity: activityRecords.longestByDistance, // Alias for convenience
    fastestActivity: activityRecords.fastest,
    averageSpeed: Math.round(activityRecords.averageSpeed * 10) / 10, // Round to 1 decimal
    totalActiveDays: activeDays.size,

    // Temporal Stats (NEW)
    activitiesByMonth,
    activitiesByDayOfWeek,

    // Social Stats
    comments: additionalData?.comments || [],
    social: additionalData?.social || {
      totalMessages: 0,
      totalClubs: 0,
      totalKudos: 0,
    },
    followerStats, // NEW
    challengeStats, // NEW

    // Login Stats
    logins: additionalData?.logins || {
      peakHour: 0,
      peakDay: '',
      totalLogins: 0,
    },
  };
}
