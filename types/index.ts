export interface StravaActivity {
  date: Date | null;
  activityType: string;
  activityName: string; // For emoji analysis
  distance: number; // in km
  elapsedTime: number; // in seconds (total time)
  movingTime: number; // in seconds (time actually moving, excludes pauses)
  elevationGain: number; // in meters
  elevationLoss: number; // in meters (negative elevation)
  isTrail: boolean; // Trail vs road
  calories?: number; // Calories burned
  averageHeartRate?: number;
  averagePower?: number;
  averageTemperature?: number;
  totalSteps?: number; // Total steps (for running activities)
}

export interface ActivityRecord {
  distance: number;
  duration: number; // in seconds
  date: Date;
  activityType: string;
  activityName: string;
  averageSpeed: number; // km/h
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  city: string;
  bio: string;
  gender?: string; // M or F
}

export interface PreferencesData {
  ftp: number;
  maxHR: number;
}

export interface CommentData {
  date: Date;
  text: string;
}

export interface SocialData {
  totalMessages: number;
  totalClubs: number;
  totalKudos: number;
}

export interface LoginData {
  peakHour: number;
  peakDay: string;
  totalLogins: number;
}

export interface ProcessedStats {
  // Profile & Preferences
  profile?: ProfileData;
  preferences?: PreferencesData;

  // Activity Stats
  totalActivities: number;
  totalHours: number; // Moving time in hours (excludes pauses)
  totalDistance: number; // Total distance in km
  totalElevation: number; // Total elevation gain in meters
  totalElevationLoss: number; // Total elevation loss in meters
  totalCalories: number; // Total calories burned
  totalSteps: number; // Total steps (running activities)
  activitiesWithCalories: number; // Count of activities with calorie data
  trailFactor: number; // Trail Factor (percentage)
  topEmojis: string[]; // Top 3 emojis from activity names
  activitiesByType: Record<string, ActivityTypeStats>;
  dailyActivities: Record<string, number>; // Daily activity breakdown (date -> count)
  heartRateZones: HeartRateZone[];
  timeOfDayDistribution: TimeOfDayDistribution;
  temperatureRecords: TemperatureRecords;
  consistencyStreak: ConsistencyStreak;
  powerStats?: PowerStats;
  longestActivityByDistance?: ActivityRecord;
  longestActivityByDuration?: ActivityRecord;
  longestActivity?: ActivityRecord; // Longest activity (by distance)
  fastestActivity?: ActivityRecord;
  averageSpeed: number; // km/h across all activities
  totalActiveDays: number; // Total unique days with activities

  // Temporal Stats (NEW)
  activitiesByMonth: Record<string, MonthStats>; // Activities grouped by month
  activitiesByDayOfWeek: Record<string, DayOfWeekStats>; // Activities grouped by day of week

  // Social Stats
  comments: CommentData[];
  social: SocialData;
  followerStats: FollowerStats; // NEW
  challengeStats: ChallengeStats; // NEW

  // Login Stats
  logins: LoginData;
}

export interface ActivityTypeStats {
  count: number;
  totalDistance: number;
  totalTime: number;
  totalElevation: number;
}

export interface HeartRateZone {
  zone: string;
  percentage: number;
  count: number;
  color: string;
}

export interface TimeOfDayDistribution {
  morning: number; // 5h-12h
  midday: number; // 12h-14h
  afternoon: number; // 14h-18h
  evening: number; // 18h-22h
  night: number; // 22h-5h
}

export interface TemperatureRecords {
  coldest: {
    temperature: number;
    date: Date;
    activityType: string;
  };
  hottest: {
    temperature: number;
    date: Date;
    activityType: string;
  };
  averageTemperature: number;
  activitiesWithTemp: number; // Count of activities with temperature data
}

export interface ConsistencyStreak {
  longestStreak: number;
  currentStreak: number;
  totalWeeksActive: number;
  activeDaysPercentage: number;
}

export interface PowerStats {
  averagePower: number;
  peakPower: number;
  totalActivitiesWithPower: number;
}

export interface SlideProps {
  data: ProcessedStats;
  onNext: () => void;
  onPrevious: () => void;
}

// New interfaces for temporal stats
export interface MonthStats {
  month: string; // "Janvier", "Février"...
  monthNumber: number; // 1-12
  count: number;
  totalDistance: number;
  totalTime: number;
  totalElevation: number;
}

export interface DayOfWeekStats {
  day: string; // "Lundi", "Mardi"...
  dayNumber: number; // 0-6 (0=Lundi, 6=Dimanche)
  count: number;
  totalDistance: number;
  totalTime: number;
  message: string; // Personalized message for the day
  emoji: string; // Emoji for the day
}

// New interfaces for followers and challenges
export interface FollowerStats {
  total: number;
  new2025?: number; // New followers in 2025 (if date available)
}

export interface ChallengeStats {
  total: number;
  completed: number;
  completed2025: number; // Challenges completed in 2025
}
