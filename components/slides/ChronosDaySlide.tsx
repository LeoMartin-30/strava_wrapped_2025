'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChronosDaySlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { activitiesByDayOfWeek } = data;

  // Convert to array and sort by day number (Monday=0 to Sunday=6)
  const daysArray = Object.values(activitiesByDayOfWeek).sort((a, b) => a.dayNumber - b.dayNumber);

  // Find favorite day
  const favoriteDay = daysArray.reduce((max, day) =>
    day.count > max.count ? day : max
  , daysArray[0] || { day: '', dayNumber: 0, count: 0, totalDistance: 0, totalTime: 0, message: '', emoji: '' });

  const maxCount = Math.max(...daysArray.map(d => d.count));

  // Week day color progression (Monday purple -> Sunday warm orange)
  const getDayColor = (dayNum: number) => {
    const colors = [
      { primary: '#8B5CF6', secondary: '#A78BFA', glow: 'rgba(139, 92, 246, 0.5)' }, // Monday - Purple
      { primary: '#EC4899', secondary: '#F472B6', glow: 'rgba(236, 72, 153, 0.5)' }, // Tuesday - Pink
      { primary: '#EF4444', secondary: '#F87171', glow: 'rgba(239, 68, 68, 0.5)' },   // Wednesday - Red
      { primary: '#F59E0B', secondary: '#FBBF24', glow: 'rgba(245, 158, 11, 0.5)' },  // Thursday - Amber
      { primary: '#10B981', secondary: '#34D399', glow: 'rgba(16, 185, 129, 0.5)' },  // Friday - Green
      { primary: '#3B82F6', secondary: '#60A5FA', glow: 'rgba(59, 130, 246, 0.5)' },  // Saturday - Blue
      { primary: '#F97316', secondary: '#FB923C', glow: 'rgba(249, 115, 22, 0.5)' },  // Sunday - Orange
    ];
    return colors[dayNum] || colors[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
      className="h-full w-full relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(160deg, #0f1419 0%, #1e1b2e 50%, #0a0d12 100%)',
      }}
    >
      {/* Diagonal stripes pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 2px,
            transparent 2px,
            transparent 12px
          )`,
        }}
        animate={{
          backgroundPosition: ['0px 0px', '100px 100px'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating day emojis */}
      {daysArray.slice(0, 7).map((day, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-8"
          style={{
            left: `${8 + i * 13}%`,
            top: `${12 + (i % 2) * 35}%`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 8, -8, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          {day.emoji}
        </motion.div>
      ))}

      {/* Rainbow glow effect */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10"
        style={{
          background: `conic-gradient(
            from 0deg,
            rgba(139, 92, 246, 0.3) 0deg,
            rgba(236, 72, 153, 0.3) 51deg,
            rgba(239, 68, 68, 0.3) 102deg,
            rgba(245, 158, 11, 0.3) 153deg,
            rgba(16, 185, 129, 0.3) 204deg,
            rgba(59, 130, 246, 0.3) 255deg,
            rgba(249, 115, 22, 0.3) 306deg,
            rgba(139, 92, 246, 0.3) 360deg
          )`,
          filter: 'blur(120px)',
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
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-4"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(249, 115, 22, 0.25) 100%)',
                border: '2px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.15)',
              }}
            >
              <TrendingUp className="w-10 h-10 text-purple-400 relative z-10" />
              {/* Rotating gradient overlay */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(249, 115, 22, 0.3) 180deg, transparent 360deg)',
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
          </motion.div>

          <h2
            className="text-4xl font-black mb-2"
            style={{
              background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 25%, #EF4444 50%, #10B981 75%, #F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('slide.chronosDay.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.chronosDay.subtitle')}</p>
        </motion.div>

        {/* Day bars - radial/circular arrangement */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-md mb-6"
        >
          <div className="flex items-end justify-between gap-2 h-64">
            {daysArray.map((day, index) => {
              const colors = getDayColor(day.dayNumber);
              const heightPercentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              const barHeight = Math.max(heightPercentage, 10); // Minimum 10% for visibility
              const isFavorite = day.dayNumber === favoriteDay.dayNumber;

              return (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center justify-end"
                  style={{ height: '100%' }}
                >
                  {/* Emoji indicator */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.5 + index * 0.1, type: 'spring', bounce: 0.6 }}
                    className="mb-2 text-2xl"
                    style={{
                      filter: isFavorite ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' : 'none',
                    }}
                  >
                    {day.emoji}
                  </motion.div>

                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8, type: 'spring', bounce: 0.3 }}
                    className="w-full rounded-t-xl relative overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary}95 100%)`,
                      boxShadow: isFavorite
                        ? `0 0 25px ${colors.glow}, 0 -4px 20px ${colors.glow}, inset 0 2px 0 rgba(255,255,255,0.4)`
                        : `0 4px 12px ${colors.glow}30, inset 0 2px 0 rgba(255,255,255,0.2)`,
                      border: isFavorite ? `2px solid ${colors.secondary}` : `1px solid ${colors.primary}60`,
                    }}
                  >
                      {/* Animated shimmer */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
                        }}
                        animate={{
                          y: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: index * 0.3,
                          repeatDelay: 0.5,
                        }}
                      />

                      {/* Count badge */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2">
                        <div className="text-white font-black text-sm drop-shadow-lg">
                          {day.count}
                        </div>
                      </div>

                      {/* Pulse ring for favorite */}
                      {isFavorite && (
                        <motion.div
                          className="absolute inset-0 rounded-t-xl"
                          style={{
                            border: `3px solid ${colors.primary}`,
                          }}
                          animate={{
                            opacity: [0.8, 0, 0.8],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </motion.div>

                  {/* Day label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                    className="mt-2 text-center"
                  >
                    <div
                      className="text-xs font-bold"
                      style={{
                        color: isFavorite ? colors.primary : '#9CA3AF',
                      }}
                    >
                      {day.day.substring(0, 3).toUpperCase()}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Favorite Day Message Card */}
        <motion.div
          initial={{ scale: 0, rotateY: -90 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: 2.2, duration: 1.2, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-md"
        >
          <div
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${getDayColor(favoriteDay.dayNumber).glow}90 0%, rgba(0,0,0,0.4) 100%)`,
              border: `2px solid ${getDayColor(favoriteDay.dayNumber).primary}`,
              boxShadow: `0 12px 40px ${getDayColor(favoriteDay.dayNumber).glow}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
            }}
          >
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${getDayColor(favoriteDay.dayNumber).primary}40 0%, transparent 50%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
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

            <div className="relative text-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="text-5xl mb-3"
              >
                {favoriteDay.emoji}
              </motion.div>

              <div
                className="text-2xl font-black mb-2"
                style={{
                  color: getDayColor(favoriteDay.dayNumber).primary,
                  textShadow: `0 2px 25px ${getDayColor(favoriteDay.dayNumber).glow}, 0 0 10px ${getDayColor(favoriteDay.dayNumber).glow}`,
                }}
              >
                {favoriteDay.message}
              </div>

              <div className="text-sm text-gray-300 font-medium">
                {favoriteDay.count} {t('common.activities')} • {Math.round(favoriteDay.totalDistance)} {t('common.km')}
              </div>

              {/* Decorative elements */}
              <div className="flex justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.5 + i * 0.1, type: 'spring' }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: getDayColor(favoriteDay.dayNumber).primary }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom right indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="absolute bottom-6 right-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-600 text-xs tracking-widest uppercase font-semibold"
          >
            {t('common.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
