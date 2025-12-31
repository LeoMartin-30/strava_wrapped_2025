'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { detectDominance } from '@/lib/dominanceDetector';

interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  condition: (stats: any) => boolean;
  priority: number;
}

export default function BadgeSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t, language } = useLanguage();
  const dominance = detectDominance(data);

  // Define all available badges
  const allBadges: Badge[] = [
    // Original Explorer badge (from dominanceDetector)
    {
      id: 'explorer',
      emoji: '🧭',
      name: language === 'fr' ? 'Découvreur de Routes' : 'Route Discoverer',
      description: language === 'fr'
        ? `Tu explores sans relâche avec ${Object.keys(data.activitiesByType).length} types d'activités différents et ${Math.round(data.totalDistance)} km parcourus. L'inconnu t'appelle !`
        : `You explore relentlessly with ${Object.keys(data.activitiesByType).length} different activity types and ${Math.round(data.totalDistance)} km covered. The unknown calls you!`,
      condition: (stats) => dominance.profile === 'explorateur',
      priority: 1,
    },
    // New badge for climbers
    {
      id: 'climber',
      emoji: '🏔️',
      name: language === 'fr' ? 'Grimpeur Élite' : 'Elite Climber',
      description: language === 'fr'
        ? `Tu as conquis ${Math.round(data.totalElevation)} mètres de dénivelé. Les sommets sont ton terrain de jeu !`
        : `You conquered ${Math.round(data.totalElevation)} meters of elevation. Summits are your playground!`,
      condition: (stats) => dominance.profile === 'ame-des-cimes',
      priority: 2,
    },
    // New badge for power/HIIT warriors
    {
      id: 'warrior',
      emoji: '⚡',
      name: language === 'fr' ? 'Puissance Brute' : 'Raw Power',
      description: language === 'fr'
        ? `Intensité maximale ! Ton approche sans compromis fait de toi une vraie machine de guerre.`
        : `Maximum intensity! Your uncompromising approach makes you a true war machine.`,
      condition: (stats) => dominance.profile === 'machine-de-guerre',
      priority: 3,
    },
    // New badge for consistent runners
    {
      id: 'metronome',
      emoji: '🎯',
      name: language === 'fr' ? 'Régularité Parfaite' : 'Perfect Consistency',
      description: language === 'fr'
        ? `${data.consistencyStreak.longestStreak} jours de série maximale ! Ta discipline est légendaire.`
        : `${data.consistencyStreak.longestStreak} days max streak! Your discipline is legendary.`,
      condition: (stats) => dominance.profile === 'metronome',
      priority: 4,
    },
    // New badge for distance cyclists
    {
      id: 'endurance-cyclist',
      emoji: '🚴',
      name: language === 'fr' ? 'Cycliste d\'Endurance' : 'Endurance Cyclist',
      description: language === 'fr'
        ? `${Math.round(data.activitiesByType['Ride']?.totalDistance || 0)} km à vélo ! Tu dévores les kilomètres sans faiblir.`
        : `${Math.round(data.activitiesByType['Ride']?.totalDistance || 0)} km by bike! You devour kilometers without weakening.`,
      condition: (stats) => {
        const rideDist = stats.activitiesByType['Ride']?.totalDistance || 0;
        return rideDist > 500 && rideDist / stats.totalDistance > 0.5;
      },
      priority: 5,
    },
    // New badge for speed demons
    {
      id: 'speed-demon',
      emoji: '🔥',
      name: language === 'fr' ? 'Démon de Vitesse' : 'Speed Demon',
      description: language === 'fr'
        ? `Vitesse moyenne de ${data.averageSpeed.toFixed(1)} km/h ! Tu ne connais qu'une seule allure : rapide.`
        : `Average speed of ${data.averageSpeed.toFixed(1)} km/h! You know only one pace: fast.`,
      condition: (stats) => stats.averageSpeed > 18,
      priority: 6,
    },
    // New badge for century riders
    {
      id: 'century-rider',
      emoji: '💯',
      name: language === 'fr' ? 'Centurion du Vélo' : 'Century Rider',
      description: language === 'fr'
        ? `Plus de 100 km en une sortie ! Tu repousses les limites du possible.`
        : `More than 100 km in one ride! You push the limits of what's possible.`,
      condition: (stats) => {
        return stats.longestActivityByDistance && stats.longestActivityByDistance.distance > 100;
      },
      priority: 7,
    },
    // New badge for all-weather warriors
    {
      id: 'all-weather',
      emoji: '☔',
      name: language === 'fr' ? 'Guerrier Tout-Temps' : 'All-Weather Warrior',
      description: language === 'fr'
        ? `De ${Math.round(data.temperatureRecords.coldest.temperature)}°C à ${Math.round(data.temperatureRecords.hottest.temperature)}°C ! Aucune météo ne t'arrête.`
        : `From ${Math.round(data.temperatureRecords.coldest.temperature)}°C to ${Math.round(data.temperatureRecords.hottest.temperature)}°C! No weather stops you.`,
      condition: (stats) => {
        const tempRange = stats.temperatureRecords.hottest.temperature - stats.temperatureRecords.coldest.temperature;
        return tempRange > 30 && stats.temperatureRecords.activitiesWithTemp > 20;
      },
      priority: 8,
    },
  ];

  // Find the badge that matches the user's profile
  const earnedBadge = allBadges.find(badge => badge.condition(data)) || allBadges[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
      className="h-full w-full relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(160deg, #0f1419 0%, #1a1f29 50%, #0a0d12 100%)',
      }}
    >
      {/* Animated grid pattern background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(252, 76, 2, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(252, 76, 2, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, ${dominance.theme.colors.primary}40 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      <div className="relative h-full w-full flex flex-col items-center justify-center slide-container py-8 px-4 safe-top safe-bottom">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-8 slide-header"
        >
          <h2
            className="text-2xl font-black mb-2 slide-title"
            style={{
              background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {language === 'fr' ? 'Badge Débloqué' : 'Badge Unlocked'}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide slide-subtitle">
            {language === 'fr' ? 'Ton accomplissement unique' : 'Your unique achievement'}
          </p>
        </motion.div>

        {/* Giant Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, type: 'spring', bounce: 0.4 }}
          className="relative mb-8"
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${dominance.theme.colors.primary}30 0%, transparent 70%)`,
              filter: 'blur(30px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Badge container */}
          <div
            className="relative w-48 h-48 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${dominance.theme.colors.primary}20 0%, ${dominance.theme.colors.primary}05 100%)`,
              border: `4px solid ${dominance.theme.colors.primary}`,
              boxShadow: `0 0 60px ${dominance.theme.colors.primary}40, inset 0 2px 20px ${dominance.theme.colors.primary}20`,
            }}
          >
            {/* Emoji */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-8xl"
            >
              {earnedBadge.emoji}
            </motion.div>

            {/* Corner sparkles */}
            <motion.div
              className="absolute top-4 right-4 text-3xl"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0,
              }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4 text-3xl"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.5,
              }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>

        {/* Badge Info Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.9) 0%, rgba(20, 25, 35, 0.9) 100%)',
              border: `2px solid ${dominance.theme.colors.primary}50`,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${dominance.theme.colors.primary}20 50%, transparent 100%)`,
              }}
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />

            <div className="relative">
              {/* Badge name */}
              <h3
                className="text-2xl font-black text-center mb-4"
                style={{
                  color: dominance.theme.colors.primary,
                  textShadow: `0 0 20px ${dominance.theme.colors.primary}50`,
                  letterSpacing: '0.05em',
                }}
              >
                {earnedBadge.name}
              </h3>

              {/* Divider */}
              <div
                className="h-1 w-24 mx-auto mb-4 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${dominance.theme.colors.primary} 50%, transparent 100%)`,
                }}
              />

              {/* Description */}
              <p className="text-sm text-gray-300 text-center leading-relaxed">
                {earnedBadge.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
