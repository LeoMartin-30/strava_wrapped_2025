import { ProcessedStats } from '@/types';

/**
 * Dominance & Auras Engine
 * Analyzes activity profile and assigns a dynamic theme
 */

export type DominanceProfile =
  | 'ame-des-cimes'      // High D+/Distance ratio or Trail dominant
  | 'machine-de-guerre'  // HIIT dominant or high Power
  | 'metronome'          // Running Route >80% or perfect regularity
  | 'explorateur';       // High variety of activities/locations

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  gradients: {
    main: string;      // Main gradient for backgrounds
    overlay: string;   // Glow overlay for effects
  };
  badge: {
    emoji: string;
    label: string;
  };
}

export interface DominanceResult {
  profile: DominanceProfile;
  title: string;
  description: string;
  theme: ThemeConfig;
  confidence: number; // 0-100
}

// Theme configurations for each profile
const THEMES: Record<DominanceProfile, ThemeConfig> = {
  'ame-des-cimes': {
    name: "L'Âme des Cimes",
    colors: {
      primary: '#2D7A4F',    // Forest Green
      secondary: '#50C878',  // Emerald
      accent: '#E8F4EA',     // Mist
      background: '#1A1F1A', // Dark Earth
    },
    gradients: {
      main: 'linear-gradient(135deg, #1A3A2A 0%, #2D7A4F 50%, #50C878 100%)',
      overlay: 'radial-gradient(circle, rgba(80, 200, 120, 0.2) 0%, transparent 70%)',
    },
    badge: {
      emoji: '🏔️',
      label: 'Grimpeur Élite',
    },
  },
  'machine-de-guerre': {
    name: 'La Machine de Guerre',
    colors: {
      primary: '#9333EA',    // Electric Violet
      secondary: '#C026D3',  // Neon Fuchsia
      accent: '#0A0A0A',     // Deep Black
      background: '#0F0F0F', // Almost Black
    },
    gradients: {
      main: 'linear-gradient(135deg, #0A0A0A 0%, #9333EA 50%, #C026D3 100%)',
      overlay: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
    },
    badge: {
      emoji: '⚡',
      label: 'Puissance Brute',
    },
  },
  'metronome': {
    name: 'Le Métronome',
    colors: {
      primary: '#FC4C02',    // Strava Orange
      secondary: '#FC5200',  // Bright Orange
      accent: '#FFFFFF',     // White
      background: '#1A1A1A', // Dark Gray
    },
    gradients: {
      main: 'linear-gradient(135deg, #1A1A1A 0%, #FC4C02 50%, #FFFFFF 100%)',
      overlay: 'radial-gradient(circle, rgba(252, 76, 2, 0.2) 0%, transparent 70%)',
    },
    badge: {
      emoji: '🎯',
      label: 'Régularité Parfaite',
    },
  },
  'explorateur': {
    name: "L'Explorateur",
    colors: {
      primary: '#3B82F6',    // Blue Horizon
      secondary: '#F59E0B',  // Yellow Sun
      accent: '#D4A574',     // Sand
      background: '#0F1419', // Dark Blue-Gray
    },
    gradients: {
      main: 'linear-gradient(135deg, #0F1419 0%, #3B82F6 50%, #F59E0B 100%)',
      overlay: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
    },
    badge: {
      emoji: '🧭',
      label: 'Découvreur de Routes',
    },
  },
};

// Profile titles
const PROFILE_TITLES: Record<DominanceProfile, string> = {
  'ame-des-cimes': "L'Âme des Cimes",
  'machine-de-guerre': 'La Machine de Guerre',
  'metronome': 'Le Métronome',
  'explorateur': "L'Explorateur",
};

// Profile descriptions
const PROFILE_DESCRIPTIONS: Record<DominanceProfile, string> = {
  'ame-des-cimes': 'Les sommets t\'appellent, tu réponds présent. Ton terrain de jeu : les montagnes. Ta devise : plus haut, toujours plus haut. Chaque mètre de dénivelé est une victoire que tu graves dans la roche.',
  'machine-de-guerre': 'Tu ne t\'entraînes pas, tu combats. Intensité maximale, puissance brute, zéro compromis. Chaque séance est une bataille que tu domines avec une férocité implacable.',
  'metronome': 'Régularité absolue, discipline de fer. Quand les autres abandonnent, toi tu persistes. Ta constance est légendaire. Jour après jour, kilomètre après kilomètre, tu construis ta légende.',
  'explorateur': 'Les sentiers battus t\'ennuient. Tu cherches l\'inconnu, repousses les frontières, découvres de nouveaux horizons. Ta curiosité est sans limite, ton terrain de jeu est le monde entier.',
};

/**
 * Detects the dominant profile based on activity stats
 */
export function detectDominance(stats: ProcessedStats): DominanceResult {
  const scores: Record<DominanceProfile, number> = {
    'ame-des-cimes': 0,
    'machine-de-guerre': 0,
    'metronome': 0,
    'explorateur': 0,
  };

  // L'Âme des Cimes: High D+/Distance ratio OR Trail dominant
  if (stats.totalDistance > 0) {
    const elevationRatio = stats.totalElevation / stats.totalDistance;
    if (elevationRatio > 15) scores['ame-des-cimes'] += 40; // >15m D+ per km
    else if (elevationRatio > 10) scores['ame-des-cimes'] += 20;
  }

  if (stats.trailFactor > 0.3) scores['ame-des-cimes'] += 30;
  else if (stats.trailFactor > 0.15) scores['ame-des-cimes'] += 15;

  const trailRunningCount = stats.activitiesByType['Trail Running']?.count || 0;
  if (trailRunningCount > stats.totalActivities * 0.5) {
    scores['ame-des-cimes'] += 30;
  } else if (trailRunningCount > stats.totalActivities * 0.3) {
    scores['ame-des-cimes'] += 15;
  }

  // La Machine de Guerre: HIIT dominant OR high Power
  const hiitCount = stats.activitiesByType['HIIT']?.count || 0;
  const workoutCount = stats.activitiesByType['Workout']?.count || 0;
  const intensityCount = hiitCount + workoutCount;

  if (intensityCount > stats.totalActivities * 0.3) {
    scores['machine-de-guerre'] += 50;
  } else if (intensityCount > stats.totalActivities * 0.2) {
    scores['machine-de-guerre'] += 25;
  }

  if (stats.powerStats && stats.powerStats.averagePower > 200) {
    scores['machine-de-guerre'] += 30;
  } else if (stats.powerStats && stats.powerStats.averagePower > 150) {
    scores['machine-de-guerre'] += 15;
  }

  // High average speed indicates intensity
  if (stats.totalHours > 0) {
    const avgSpeed = stats.totalDistance / stats.totalHours;
    if (avgSpeed > 12) scores['machine-de-guerre'] += 20;
    else if (avgSpeed > 10) scores['machine-de-guerre'] += 10;
  }

  // Le Métronome: Running/Route >80% OR perfect regularity
  const runningCount = stats.activitiesByType['Running']?.count || 0;
  const runningPct = runningCount / stats.totalActivities;

  if (runningPct > 0.8) scores['metronome'] += 40;
  else if (runningPct > 0.6) scores['metronome'] += 20;

  if (stats.consistencyStreak.activeDaysPercentage > 80) scores['metronome'] += 40;
  else if (stats.consistencyStreak.activeDaysPercentage > 60) scores['metronome'] += 20;

  const streakDays = stats.consistencyStreak.longestStreak || 0;
  if (streakDays > 30) scores['metronome'] += 20;
  else if (streakDays > 14) scores['metronome'] += 10;

  // L'Explorateur: High variety of activities/locations
  const activityTypeVariety = Object.keys(stats.activitiesByType).length;
  if (activityTypeVariety >= 5) scores['explorateur'] += 30;
  else if (activityTypeVariety >= 3) scores['explorateur'] += 15;

  // Explorers cover significant ground
  if (stats.totalDistance > 2000) scores['explorateur'] += 30;
  else if (stats.totalDistance > 1000) scores['explorateur'] += 15;

  // Variety in monthly activity distribution suggests exploration
  if (stats.activitiesByMonth) {
    const monthsWithActivities = Object.keys(stats.activitiesByMonth).length;
    if (monthsWithActivities >= 10) scores['explorateur'] += 20;
    else if (monthsWithActivities >= 6) scores['explorateur'] += 10;
  }

  // Day variety also suggests exploration mindset
  if (stats.activitiesByDayOfWeek) {
    const daysWithActivities = Object.keys(stats.activitiesByDayOfWeek).length;
    if (daysWithActivities === 7) scores['explorateur'] += 10;
  }

  // Find dominant profile
  let maxScore = 0;
  let dominantProfile: DominanceProfile = 'metronome'; // Default fallback

  Object.entries(scores).forEach(([profile, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantProfile = profile as DominanceProfile;
    }
  });

  // Log scores for debugging
  console.log('🎭 Dominance Detection Scores:', scores);
  console.log(`🏆 Dominant Profile: ${dominantProfile} (${maxScore} points)`);

  return {
    profile: dominantProfile,
    title: PROFILE_TITLES[dominantProfile],
    description: PROFILE_DESCRIPTIONS[dominantProfile],
    theme: THEMES[dominantProfile],
    confidence: Math.min(maxScore, 100),
  };
}

export function getProfileTitle(profile: DominanceProfile): string {
  return PROFILE_TITLES[profile];
}

export function getProfileDescription(profile: DominanceProfile): string {
  return PROFILE_DESCRIPTIONS[profile];
}

export function getThemeConfig(profile: DominanceProfile): ThemeConfig {
  return THEMES[profile];
}
