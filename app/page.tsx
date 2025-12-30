'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FileUpload from '@/components/upload/FileUpload';
import IdentitySlide from '@/components/slides/IdentitySlide';
import IntroSlide from '@/components/slides/IntroSlide';
import IntensitySlide from '@/components/slides/IntensitySlide';
import PowerSlide from '@/components/slides/PowerSlide';
import ElevationSlide from '@/components/slides/ElevationSlide';
import GravitySlide from '@/components/slides/GravitySlide';
import TrailSlide from '@/components/slides/TrailSlide';
import CalorieSlide from '@/components/slides/CalorieSlide';
import ChronosSlide from '@/components/slides/ChronosSlide';
import ChronosMonthSlide from '@/components/slides/ChronosMonthSlide';
import ChronosDaySlide from '@/components/slides/ChronosDaySlide';
import WeatherSlide from '@/components/slides/WeatherSlide';
import ConsistencySlide from '@/components/slides/ConsistencySlide';
import ActivityBreakdownSlide from '@/components/slides/ActivityBreakdownSlide';
import RecordsSlide from '@/components/slides/RecordsSlide';
import KudosSlide from '@/components/slides/KudosSlide';
import MoteurSlide from '@/components/slides/MoteurSlide';
import SocialButterflySlide from '@/components/slides/SocialButterflySlide';
import SummarySlide from '@/components/slides/SummarySlide';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { filterActivitiesByYear } from '@/lib/csvParser';
import { processActivities } from '@/lib/dataProcessor';
import { parseStravaZip } from '@/lib/zipParser';
import { detectDominance } from '@/lib/dominanceDetector';
import { exportSlideToImage, shareToSocial, getRecommendedQuality } from '@/lib/exportStories';
import { shouldShowSlide } from '@/lib/fallbackRules';
import { ProcessedStats } from '@/types';
import { trackZipUpload, trackFunnelStep, trackConversionComplete, trackError } from '@/lib/analytics';

function HomeContent() {
  const { applyTheme } = useTheme();
  const { t } = useLanguage();
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Track zip upload
      trackZipUpload(file.name, file.size);

      // Hardcoded year for Strava Wrapped 2025
      const year = 2025;

      // Parse Strava ZIP export with year filter for social data
      const zipData = await parseStravaZip(file, year);

      if (zipData.activities.length === 0) {
        throw new Error(t('upload.error.noActivities'));
      }

      // Filter activities for 2025
      const yearActivities = filterActivitiesByYear(zipData.activities, year);

      console.log(`DEBUG: Total activities in ZIP: ${zipData.activities.length}`);
      console.log(`DEBUG: Activities filtered for ${year}: ${yearActivities.length}`);

      // Always use year-filtered activities for 2025
      const activitiesToProcess = yearActivities.length > 0 ? yearActivities : zipData.activities;

      // Process activities with additional data
      const processedStats = processActivities(
        activitiesToProcess,
        yearActivities.length > 0 ? year : undefined,
        {
          profile: zipData.profile,
          preferences: zipData.preferences,
          comments: zipData.comments,
          social: zipData.social,
          logins: zipData.logins,
          followers: zipData.followers,
          challenges: zipData.challenges,
        }
      );

      setStats(processedStats);

      // Detect dominance profile and apply theme
      const dominance = detectDominance(processedStats);
      applyTheme(dominance.theme);

      setCurrentSlide(0);

      // Track first funnel step (Intro slide)
      trackFunnelStep(0, 'Intro');
    } catch (err) {
      console.error('Error processing file:', err);
      const errorMessage = err instanceof Error ? err.message : 'Impossible de traiter le fichier';
      setError(errorMessage);

      // Track error
      trackError('File Processing', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme, t]);

  // Helper function to get slide names in order
  const getSlideNames = useCallback(() => {
    if (!stats) return [];
    const names = [];

    names.push('Intro');
    if (stats.profile) names.push('Identity');
    if (Object.keys(stats.activitiesByType).length > 1) names.push('Activity Breakdown');
    if (shouldShowSlide('IntensitySlide', stats)) names.push('Intensity');
    if (shouldShowSlide('PowerSlide', stats)) names.push('Power');
    names.push('Elevation');
    if (shouldShowSlide('GravitySlide', stats)) names.push('Gravity');
    if (shouldShowSlide('TrailSlide', stats)) names.push('Trail');
    if (shouldShowSlide('CalorieSlide', stats)) names.push('Calories');
    if (Object.keys(stats.activitiesByMonth).length > 0) names.push('Chronos Month');
    if (Object.keys(stats.activitiesByDayOfWeek).length > 0) names.push('Chronos Day');
    names.push('Chronos');
    if (shouldShowSlide('WeatherSlide', stats)) names.push('Weather');
    if (stats.comments.length > 0 || stats.social.totalKudos > 0) names.push('Kudos');
    if (shouldShowSlide('MoteurSlide', stats)) names.push('Moteur');
    if (shouldShowSlide('SocialButterflySlide', stats)) names.push('Social Butterfly');
    names.push('Consistency');
    names.push('Records');
    names.push('Summary');

    return names;
  }, [stats]);

  // Helper function to get total slides count
  const getTotalSlides = useCallback(() => {
    return getSlideNames().length;
  }, [getSlideNames]);

  const handleNext = useCallback(() => {
    if (!stats) return;

    const totalSlides = getTotalSlides();
    const nextIndex = currentSlide + 1;

    if (nextIndex >= totalSlides) {
      // Track conversion complete before resetting
      trackConversionComplete(totalSlides, stats.totalActivities);

      // Reset to upload screen
      setStats(null);
      setCurrentSlide(0);
    } else {
      setCurrentSlide(nextIndex);

      // Track funnel step
      const slideNames = getSlideNames();
      if (slideNames[nextIndex]) {
        trackFunnelStep(nextIndex, slideNames[nextIndex]);
      }
    }
  }, [currentSlide, stats, getTotalSlides, getSlideNames]);

  const handlePrevious = useCallback(() => {
    if (!stats) return;

    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide, stats]);

  // Handle left/right tap navigation on mobile
  const handleTapNavigation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stats) return;

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // Don't interfere with progress indicator clicks
    if ((e.target as HTMLElement).closest('.no-export')) {
      return;
    }

    // Prevent the slide's onClick from also firing
    e.preventDefault();
    e.stopPropagation();

    // Left third of screen = previous, right two-thirds = next
    if (clickX < width / 3) {
      handlePrevious();
    } else {
      handleNext();
    }
  }, [stats, handleNext, handlePrevious]);

  // Keyboard navigation
  useEffect(() => {
    if (!stats) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stats, handleNext, handlePrevious]);

  const renderSlide = () => {
    if (!stats) return null;

    // Build slide order based on available data (with intelligent fallbacks)
    const slides = [];

    // 1. Intro (Dashboard/Tableau de bord)
    slides.push(<IntroSlide key="intro" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);

    // 2. Identity (if profile exists)
    if (stats.profile) {
      slides.push(<IdentitySlide key="identity" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 3. Activity Breakdown (répartition par type)
    if (Object.keys(stats.activitiesByType).length > 1) {
      slides.push(<ActivityBreakdownSlide key="breakdown" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 4. Intensity (Heart rate zones) - with fallback
    if (shouldShowSlide('IntensitySlide', stats)) {
      slides.push(<IntensitySlide key="intensity" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 5. Power (Puissance) - with fallback
    if (shouldShowSlide('PowerSlide', stats)) {
      slides.push(<PowerSlide key="power" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 6. Elevation (Dénivelé)
    slides.push(<ElevationSlide key="elevation" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);

    // 7. Gravity (Gravité) - with fallback
    if (shouldShowSlide('GravitySlide', stats)) {
      slides.push(<GravitySlide key="gravity" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 8. Trail Factor - with fallback
    if (shouldShowSlide('TrailSlide', stats)) {
      slides.push(<TrailSlide key="trail" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 9. Calorie Converter (Carburant) - with fallback
    if (shouldShowSlide('CalorieSlide', stats)) {
      slides.push(<CalorieSlide key="calories" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 10. Chronos Month (split par mois)
    if (Object.keys(stats.activitiesByMonth).length > 0) {
      slides.push(<ChronosMonthSlide key="chronos-month" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 11. Chronos Day (split par jour de semaine)
    if (Object.keys(stats.activitiesByDayOfWeek).length > 0) {
      slides.push(<ChronosDaySlide key="chronos-day" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 12. Chronos (split par heure de journée - 5 périodes)
    slides.push(<ChronosSlide key="chronos" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);

    // 13. Weather (Météo) - with fallback >= 5 activities
    if (shouldShowSlide('WeatherSlide', stats)) {
      slides.push(<WeatherSlide key="weather" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 14. Kudos (Chasseur de kudos)
    if (stats.comments.length > 0 || stats.social.totalKudos > 0) {
      slides.push(<KudosSlide key="kudos" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 15. Moteur - with fallback
    if (shouldShowSlide('MoteurSlide', stats)) {
      slides.push(<MoteurSlide key="moteur" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 16. Social Butterfly (followers/challenges) - with fallback
    if (shouldShowSlide('SocialButterflySlide', stats)) {
      slides.push(<SocialButterflySlide key="social-butterfly" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);
    }

    // 17. Consistency (Régularité)
    slides.push(<ConsistencySlide key="consistency" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);

    // 18. Records (Hall of Fame)
    slides.push(<RecordsSlide key="records" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);

    // 19. Summary (Récapitulatif final)
    slides.push(<SummarySlide key="summary" data={stats} onNext={handleNext} onPrevious={handlePrevious} />);

    return slides[currentSlide];
  };

  // Handle export slide to PNG
  const handleExportSlide = async () => {
    setIsExporting(true);
    try {
      const slideElement = document.querySelector('.slide-container') as HTMLElement;
      if (!slideElement) {
        throw new Error('Slide element not found');
      }

      console.log('📸 Exporting slide...');
      const blob = await exportSlideToImage(slideElement, {
        quality: getRecommendedQuality(),
      });

      const success = await shareToSocial(blob, `Strava Wrapped - Slide ${currentSlide + 1}`);

      if (success) {
        console.log('✅ Export successful!');
      }
    } catch (error) {
      console.error('❌ Export error:', error);
      alert(`Erreur lors de l'export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <main className="min-h-screen bg-strava-dark">
      {/* Mobile viewport (9:16 aspect ratio) */}
      <div className="h-screen w-full max-w-[500px] mx-auto relative bg-strava-anthracite shadow-2xl">
        {!stats && !isLoading && (
          <FileUpload onFileSelect={handleFileSelect} />
        )}

        {isLoading && (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-strava-orange mx-auto mb-4"></div>
              <p className="text-white text-xl font-semibold mb-2">{t('upload.loading')}</p>
              <p className="text-gray-400 text-sm">{t('upload.extracting')}</p>
              <p className="text-gray-500 text-xs mt-4">{t('upload.wait')}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setStats(null);
                }}
                className="bg-strava-orange hover:bg-strava-orange/90 text-white font-semibold py-3 px-6 rounded-full transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {stats && (
          <div
            className="slide-container h-full w-full cursor-pointer"
            onClickCapture={handleTapNavigation}
          >
            <AnimatePresence mode="wait">
              {renderSlide()}
            </AnimatePresence>
          </div>
        )}

        {/* Progress Indicator */}
        {stats && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50 no-export">
            {Array.from({ length: getTotalSlides() }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                  i === currentSlide
                    ? 'bg-strava-orange w-8'
                    : 'bg-gray-600 w-1 hover:w-2'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}


      </div>
    </main>
  );
}

// Wrap in ThemeProvider and LanguageProvider
export default function Home() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <HomeContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}
