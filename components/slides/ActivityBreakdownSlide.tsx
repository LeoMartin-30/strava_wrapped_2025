'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Activity, TrendingUp, Clock, Mountain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ActivityBreakdownSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  // Sort activities by count
  const sortedActivities = Object.entries(data.activitiesByType)
    .map(([type, stats]) => ({ type, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 activities

  const totalActivities = data.totalActivities;
  const maxCount = sortedActivities[0]?.count || 1;

  // Activity type emoji mapping
  const activityEmojis: Record<string, string> = {
    'Course à pied': '🏃',
    'Run': '🏃',
    'Running': '🏃',
    'Vélo': '🚴',
    'Ride': '🚴',
    'Cycling': '🚴',
    'Bike': '🚴',
    'Randonnée': '🥾',
    'Hike': '🥾',
    'Hiking': '🥾',
    'Natation': '🏊',
    'Swim': '🏊',
    'Swimming': '🏊',
    'Marche': '🚶',
    'Walk': '🚶',
    'Walking': '🚶',
    'Trail': '⛰️',
    'Ski': '⛷️',
    'Skiing': '⛷️',
    'Canoë': '🛶',
    'Kayak': '🛶',
    'Vélo électrique': '🚲',
    'E-Bike': '🚲',
  };

  const getActivityEmoji = (type: string): string => {
    // Try exact match first
    if (activityEmojis[type]) return activityEmojis[type];

    // Try partial match
    const lowerType = type.toLowerCase();
    for (const [key, emoji] of Object.entries(activityEmojis)) {
      if (lowerType.includes(key.toLowerCase())) return emoji;
    }

    return '⚡'; // Default emoji
  };

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
          background: 'radial-gradient(circle, rgba(252, 76, 2, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-4"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(252, 76, 2, 0.3) 0%, rgba(252, 76, 2, 0.1) 100%)',
                border: '3px solid rgba(252, 76, 2, 0.5)',
                boxShadow: '0 0 40px rgba(252, 76, 2, 0.3), inset 0 0 20px rgba(252, 76, 2, 0.2)',
              }}
            >
              <Activity className="w-10 h-10 text-orange-400" />
            </div>
          </motion.div>

          <h2
            className="text-4xl font-black mb-2"
            style={{
              background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('slide.breakdown.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.breakdown.subtitle')}</p>
        </motion.div>

        {/* Activity Breakdown Bars */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-sm space-y-3 mb-6"
        >
          {sortedActivities.map((activity, index) => {
            const percentage = Math.round((activity.count / totalActivities) * 100);
            const barWidthPercentage = (activity.count / maxCount) * 100;
            const emoji = getActivityEmoji(activity.type);

            const colors = [
              { bg: 'rgba(252, 76, 2, 0.15)', border: 'rgba(252, 76, 2, 0.5)', color: '#FC4C02' },
              { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.5)', color: '#3B82F6' },
              { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.5)', color: '#22C55E' },
              { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.5)', color: '#A855F7' },
              { bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.5)', color: '#FBBF24' },
            ];
            const colorScheme = colors[index % colors.length];

            return (
              <motion.div
                key={activity.type}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="relative"
              >
                <div
                  className="p-4 rounded-xl relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.bg} 0%, ${colorScheme.bg.replace('0.12', '0.03')} 100%)`,
                    border: `2px solid ${colorScheme.border}`,
                    boxShadow: `0 4px 20px ${colorScheme.border.replace('0.5', '0.2')}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                  }}
                >
                  {/* Background bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 opacity-20 rounded-xl"
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidthPercentage}%` }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                    style={{
                      background: colorScheme.color,
                    }}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{emoji}</div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm">
                          {activity.type}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(activity.totalDistance)} km • {Math.round(activity.totalTime / 3600)}h
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-2xl font-black"
                        style={{ color: colorScheme.color }}
                      >
                        {activity.count}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm"
        >
          <div
            className="p-5 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            <div className="relative text-center">
              <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                {t('slide.breakdown.diversity')}
              </div>
              <div className="text-4xl font-black text-white">
                {Object.keys(data.activitiesByType).length} {t('slide.breakdown.activityTypes')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-6 right-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-600 text-xs tracking-widest uppercase font-semibold"
          >
            {t('slide.breakdown.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
