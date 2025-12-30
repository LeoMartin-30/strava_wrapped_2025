'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMemo } from 'react';

export default function ChronosSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { timeOfDayDistribution } = data;

  const chartData = useMemo(() => [
    {
      name: t('common.morning'),
      value: timeOfDayDistribution.morning,
      icon: Sun,
      time: '5h-12h',
      color: '#FBBF24',
      emoji: '🌅',
    },
    {
      name: t('common.midday'),
      value: timeOfDayDistribution.midday,
      icon: Sun,
      time: '12h-14h',
      color: '#FCD34D',
      emoji: '☀️',
    },
    {
      name: t('common.afternoon'),
      value: timeOfDayDistribution.afternoon,
      icon: Sun,
      time: '14h-18h',
      color: '#FC4C02',
      emoji: '🏖️',
    },
    {
      name: t('common.evening'),
      value: timeOfDayDistribution.evening,
      icon: Sunset,
      time: '18h-22h',
      color: '#F97316',
      emoji: '🌆',
    },
    {
      name: t('common.night'),
      value: timeOfDayDistribution.night,
      icon: Moon,
      time: '22h-5h',
      color: '#6366F1',
      emoji: '🌙',
    },
  ], [t, timeOfDayDistribution]);

  const maxValue = Math.max(...chartData.map((item) => item.value));
  const favoriteTime = chartData.reduce((max, item) =>
    item.value > max.value ? item : max
  );

  const FavoriteIcon = favoriteTime.icon;

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
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
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

      {/* Floating time emojis in background */}
      {chartData.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-5"
          style={{
            left: `${15 + i * 20}%`,
            top: `${20 + (i % 2) * 30}%`,
          }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative h-full w-full flex flex-col items-center justify-between slide-container py-8 px-6 safe-top safe-bottom">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-4 slide-header"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="inline-block mb-3"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center slide-icon-container"
              style={{
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 100%)',
                border: '3px solid rgba(99, 102, 241, 0.5)',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.2)',
              }}
            >
              <Clock className="w-8 h-8 text-indigo-400 slide-icon" />
            </div>
          </motion.div>

          <h2
            className="text-3xl font-black mb-1.5 slide-title"
            style={{
              background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('slide.chronos.title')}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide slide-subtitle">{t('slide.chronos.subtitle')}</p>
        </motion.div>

        {/* Custom Bar Chart */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-sm mb-6"
        >
          <div className="flex items-end justify-between gap-3 h-64">
            {chartData.map((item, index) => {
              const Icon = item.icon;
              const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
              const barHeight = Math.max(heightPercentage, 10); // Minimum 10% for visibility

              return (
                <div
                  key={item.name}
                  className="flex-1 flex flex-col items-center justify-end"
                  style={{ height: '100%' }}
                >
                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ delay: 0.8 + index * 0.15, duration: 0.8, type: 'spring', bounce: 0.3 }}
                    className="w-full rounded-t-xl relative overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}80 100%)`,
                      border: `2px solid ${item.color}`,
                      boxShadow: `0 4px 20px ${item.color}40, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                    }}
                  >
                    {/* Shimmer */}
                    <motion.div
                      className="absolute inset-0 opacity-50"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                      }}
                      animate={{
                        y: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />

                    {/* Value on bar */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-sm">
                      {item.value}
                    </div>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                    className="mt-3"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: `${item.color}20`,
                        border: `1px solid ${item.color}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                  </motion.div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <div className="text-xs text-gray-400 font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Favorite Time Card */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.8, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm"
        >
          <div
            className="p-4 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.15) 0%, rgba(252, 76, 2, 0.05) 100%)',
              border: '2px solid rgba(252, 76, 2, 0.3)',
              boxShadow: '0 8px 32px rgba(252, 76, 2, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
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

            <div className="relative flex items-center gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex-shrink-0"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(252, 76, 2, 0.2)',
                    border: '2px solid rgba(252, 76, 2, 0.5)',
                  }}
                >
                  <FavoriteIcon className="w-8 h-8 text-orange-400 slide-icon" />
                </div>
              </motion.div>

              <div className="flex-1">
                <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-1">
                  {t('slide.chronos.favoriteTime')}
                </div>
                <div
                  className="text-3xl font-black mb-1"
                  style={{
                    color: '#FC4C02',
                    textShadow: '0 2px 20px rgba(252, 76, 2, 0.5)',
                  }}
                >
                  {favoriteTime.name}
                </div>
                <div className="text-sm text-gray-400">
                  {favoriteTime.value} {t('common.activities')} • {favoriteTime.time}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
