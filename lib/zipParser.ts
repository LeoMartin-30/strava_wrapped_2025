import JSZip from 'jszip';
import Papa from 'papaparse';
import { StravaActivity } from '@/types';

/**
 * Complete Strava ZIP Parser
 * Extracts all relevant data from a Strava export ZIP
 */

// Helper: Parse French dates (ex: "19 janv. 2023, 15:31:11")
export function parseFrenchDate(dateStr: string): Date {
  if (!dateStr) return new Date();

  const monthMap: Record<string, number> = {
    'janv': 0, 'févr': 1, 'mars': 2, 'avr': 3, 'mai': 4, 'juin': 5,
    'juil': 6, 'août': 7, 'sept': 8, 'oct': 9, 'nov': 10, 'déc': 11,
  };

  // Match "31 déc. 2025, 14:30:00" or "31 déc. 2025 à 14:30:00"
  const match = dateStr.match(/(\d{1,2})\s+(\w+)\.\s+(\d{4})/);
  if (match) {
    const [, day, monthStr, year] = match;
    const month = monthMap[monthStr] ?? 0;

    // Try to extract time if present
    const timeMatch = dateStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
      const [, hours, minutes, seconds] = timeMatch;
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
  return new Date(dateStr);
}

// Helper: Convert French decimal to number (ex: "10,50" -> 10.5)
export function parseFrenchNumber(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  const cleaned = value.trim().replace(',', '.').replace(/\s/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Helper: Parse CSV content to array of objects
async function parseCSVContent(content: string, skipEmptyLines = true): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

// Profile data interface
export interface ProfileData {
  firstName: string;
  lastName: string;
  city: string;
  bio: string;
  email: string;
  gender?: string; // M or F
}

// Preferences data
export interface PreferencesData {
  ftp: number; // Functional Threshold Power in watts
  maxHR: number; // Max heart rate
  birthDate: string;
}

// Comments data
export interface CommentData {
  date: Date;
  text: string;
}

// Social data
export interface SocialData {
  totalMessages: number;
  totalClubs: number;
  totalKudos: number;
}

// Login data
export interface LoginData {
  peakHour: number;
  peakDay: string;
  totalLogins: number;
}

// Route data
export interface RouteData {
  totalRoutes: number;
  totalTrailDistance: number;
}

// Follower data
export interface FollowerData {
  athleteId: string;
  status: string;
  dateFollowed?: Date; // If available in CSV
}

// Challenge data
export interface ChallengeData {
  name: string;
  dateJoined: Date;
  completed: boolean;
}

// Complete Strava data
export interface StravaZipData {
  profile: ProfileData;
  preferences: PreferencesData;
  activities: StravaActivity[];
  comments: CommentData[];
  social: SocialData;
  logins: LoginData;
  routes: RouteData;
  followers: FollowerData[];
  challenges: ChallengeData[];
}

/**
 * Main function to parse the Strava ZIP export
 * @param file - The ZIP file to parse
 * @param year - Optional year to filter social data (comments, kudos, logins)
 */
export async function parseStravaZip(file: File, year?: number): Promise<StravaZipData> {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(file);

  // Initialize result object
  const result: StravaZipData = {
    profile: {
      firstName: '',
      lastName: '',
      city: '',
      bio: '',
      email: '',
    },
    preferences: {
      ftp: 0,
      maxHR: 0,
      birthDate: '',
    },
    activities: [],
    comments: [],
    social: {
      totalMessages: 0,
      totalClubs: 0,
      totalKudos: 0,
    },
    logins: {
      peakHour: 0,
      peakDay: '',
      totalLogins: 0,
    },
    routes: {
      totalRoutes: 0,
      totalTrailDistance: 0,
    },
    followers: [],
    challenges: [],
  };

  // Parse profile.csv
  const profileFile = zipContent.file('profile.csv');
  if (profileFile) {
    const content = await profileFile.async('string');
    const data = await parseCSVContent(content);
    if (data.length > 0) {
      const row = data[0];
      result.profile = {
        firstName: row['Prénom'] || '',
        lastName: row['Nom'] || '',
        city: row['Ville'] || '',
        bio: row['Description'] || '',
        email: row['Adresse e-mail'] || '',
        gender: row['Sexe'] || row['Gender'] || undefined,
      };
    }
  }

  // Parse general_preferences.csv
  const prefsFile = zipContent.file('general_preferences.csv');
  if (prefsFile) {
    const content = await prefsFile.async('string');
    const data = await parseCSVContent(content);
    if (data.length > 0) {
      const row = data[0];
      result.preferences = {
        ftp: parseFrenchNumber(row['Seuil fonctionnel de puissance'] || '0'),
        maxHR: parseFrenchNumber(row['Fréquence cardiaque maximale'] || '0'),
        birthDate: row['Date de naissance'] || '',
      };
    }
  }

  // Parse comments.csv
  const commentsFile = zipContent.file('comments.csv');
  if (commentsFile) {
    const content = await commentsFile.async('string');
    const data = await parseCSVContent(content);
    const allComments = data
      .map((row: any) => ({
        date: parseFrenchDate(row['Date du commentaire']),
        text: row['Commenter'] || '',
      }))
      .filter(c => c.text);

    result.comments = year
      ? allComments.filter(c => c.date.getFullYear() === year)
      : allComments;

    console.log(`ZIP Parser - Comments: ${allComments.length} total${year ? ` → ${result.comments.length} for ${year}` : ''}`);
  }

  // Parse messaging.json for message count
  const messagingFile = zipContent.file('messaging.json');
  if (messagingFile) {
    const content = await messagingFile.async('string');
    try {
      const messages = JSON.parse(content);
      result.social.totalMessages = Array.isArray(messages) ? messages.length : 0;
    } catch (e) {
      console.warn('Failed to parse messaging.json:', e);
    }
  }

  // Parse memberships.csv for club count
  const membershipsFile = zipContent.file('memberships.csv');
  if (membershipsFile) {
    const content = await membershipsFile.async('string');
    const data = await parseCSVContent(content);
    result.social.totalClubs = data.length;
  }

  // Parse reactions.csv for kudos count
  const reactionsFile = zipContent.file('reactions.csv');
  if (reactionsFile) {
    const content = await reactionsFile.async('string');
    const data = await parseCSVContent(content);

    // Filter by year if provided (using date field from reactions CSV)
    const filteredReactions = year
      ? data.filter((row: any) => {
          const dateStr = row['Date de réaction'] || row['Reaction Date'] || row['Date'];
          if (dateStr) {
            const date = parseFrenchDate(dateStr);
            return date.getFullYear() === year;
          }
          return false;
        })
      : data;

    result.social.totalKudos = filteredReactions.length;
    console.log(`ZIP Parser - Kudos: ${data.length} total${year ? ` → ${filteredReactions.length} for ${year}` : ''}`);
  }

  // Parse logins.csv for peak activity time
  const loginsFile = zipContent.file('logins.csv');
  if (loginsFile) {
    const content = await loginsFile.async('string');
    const data = await parseCSVContent(content);

    // Filter by year if provided
    const filteredLogins = year
      ? data.filter((row: any) => {
          const dateStr = row['Date et heure de connexion'] || row['Date de connexion'] || row['Login Date'];
          if (dateStr) {
            const date = parseFrenchDate(dateStr);
            return date.getFullYear() === year;
          }
          return false;
        })
      : data;

    result.logins.totalLogins = filteredLogins.length;
    console.log(`ZIP Parser - Logins: ${data.length} total${year ? ` → ${filteredLogins.length} for ${year}` : ''}`);

    // Calculate peak hour
    const hourCounts: Record<number, number> = {};
    const dayCounts: Record<string, number> = {};

    filteredLogins.forEach((row: any) => {
      const dateStr = row['Date et heure de connexion'] || row['Date de connexion'] || row['Login Date'];
      if (dateStr) {
        const date = parseFrenchDate(dateStr);
        const hour = date.getHours();
        const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });

        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    });

    // Find peak hour
    let maxHourCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxHourCount) {
        maxHourCount = count;
        result.logins.peakHour = parseInt(hour);
      }
    });

    // Find peak day
    let maxDayCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        result.logins.peakDay = day;
      }
    });
  }

  // Parse followers.csv
  const followersFile = zipContent.file('followers.csv');
  if (followersFile) {
    const content = await followersFile.async('string');
    const data = await parseCSVContent(content);
    result.followers = data.map((row: any) => ({
      athleteId: row["ID de l'athlète abonné(e)"] || row['Follower Athlete ID'] || '',
      status: row['Statut d\'abonnement'] || row['Following Status'] || '',
      dateFollowed: undefined, // No date in followers.csv
    })).filter(f => f.athleteId);

    console.log(`ZIP Parser - Followers: ${result.followers.length} total`);
  }

  // Parse global_challenges.csv
  const challengesFile = zipContent.file('global_challenges.csv');
  if (challengesFile) {
    const content = await challengesFile.async('string');
    const data = await parseCSVContent(content);
    const allChallenges = data.map((row: any) => ({
      name: row['Nom'] || row['Name'] || '',
      dateJoined: parseFrenchDate(row['Date d\'inscription'] || row['Join Date']),
      completed: row['Terminé'] === 'true' || row['Terminé'] === true || row['Completed'] === 'true' || row['Completed'] === true,
    })).filter(c => c.name);

    // Filter by year if provided (challenges joined in specified year)
    result.challenges = year
      ? allChallenges.filter(c => c.dateJoined.getFullYear() === year)
      : allChallenges;

    console.log(`ZIP Parser - Challenges: ${allChallenges.length} total${year ? ` → ${result.challenges.length} joined in ${year}` : ''}`);
    const completedCount = result.challenges.filter(c => c.completed).length;
    console.log(`ZIP Parser - Challenges completed: ${completedCount} of ${result.challenges.length}`);
  }

  // Parse activities.csv (using the existing parser logic)
  const activitiesFile = zipContent.file('activities.csv');
  if (activitiesFile) {
    const content = await activitiesFile.async('string');
    // We'll reuse the existing parseStravaCSV logic
    // For now, create a temporary File object
    const blob = new Blob([content], { type: 'text/csv' });
    const tempFile = new File([blob], 'activities.csv', { type: 'text/csv' });

    // Import the existing parser
    const { parseStravaCSV } = await import('./csvParser');
    result.activities = await parseStravaCSV(tempFile);
  }

  return result;
}
