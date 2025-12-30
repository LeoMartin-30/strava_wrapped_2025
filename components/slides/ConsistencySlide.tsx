'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Calendar, Award, TrendingUp, Target } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ConsistencySlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { consistencyStreak, totalActiveDays } = data;

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
            linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
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

      {/* Floating calendar/check emojis in background */}
      {['✓', '📅', '🎯', '💪', '⭐', '🔥'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{
            left: `${8 + i * 16}%`,
            top: `${12 + (i % 3) * 22}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)',
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
              <Award className="w-10 h-10 text-orange-400" />
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
            {t('slide.consistency.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.consistency.subtitle')}</p>
        </motion.div>

        {/* Longest Streak - Big Hero */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm mb-6"
        >
          <div
            className="p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.15) 0%, rgba(252, 76, 2, 0.05) 100%)',
              border: '3px solid rgba(252, 76, 2, 0.5)',
              boxShadow: '0 12px 40px rgba(252, 76, 2, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
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

            {/* Flame icon */}
            <motion.div
              className="absolute top-4 right-4"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <div className="text-3xl">🔥</div>
            </motion.div>

            <div className="relative text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-6 h-6 text-orange-400" />
                <div className="text-xs font-bold tracking-widest text-orange-400 uppercase">
                  {t('slide.consistency.recordStreak')}
                </div>
              </div>
              <div
                className="text-8xl font-black mb-2"
                style={{
                  color: '#FC4C02',
                  textShadow: '0 2px 40px rgba(252, 76, 2, 0.6)',
                }}
              >
                <AnimatedCounter to={consistencyStreak.longestStreak} duration={2} delay={0.8} />
              </div>
              <div className="text-xl text-gray-300 font-semibold">
                {t('slide.consistency.consecutiveDays')}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4 w-full max-w-sm">
          {/* Current Streak */}
          {consistencyStreak.currentStreak > 0 && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
              className="relative"
            >
              <div
                className="p-5 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.03) 100%)',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '2px solid rgba(34, 197, 94, 0.5)',
                      }}
                    >
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest text-green-400 uppercase mb-1">
                      {t('slide.consistency.currentStreak')}
                    </div>
                    <div
                      className="text-4xl font-black"
                      style={{
                        color: '#22c55e',
                        textShadow: '0 2px 20px rgba(34, 197, 94, 0.5)',
                      }}
                    >
                      <AnimatedCounter
                        to={consistencyStreak.currentStreak}
                        duration={1.5}
                        delay={1.4}
                        suffix={` ${t('slide.consistency.days')}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Percentage */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.03) 100%)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                  delay: 0.5,
                }}
              />

              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="flex-shrink-0"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '2px solid rgba(99, 102, 241, 0.5)',
                    }}
                  >
                    <Target className="w-6 h-6 text-indigo-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-1">
                    {t('slide.consistency.activeDays')}
                  </div>
                  <div
                    className="text-4xl font-black mb-1"
                    style={{
                      color: '#6366f1',
                      textShadow: '0 2px 20px rgba(99, 102, 241, 0.5)',
                    }}
                  >
                    <AnimatedCounter
                      to={consistencyStreak.activeDaysPercentage}
                      duration={2}
                      delay={1.7}
                      suffix="%"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalActiveDays} {t('slide.consistency.activeDaysOfYear')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weeks Active */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              }}
            >
              {/* Diagonal shine */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                }}
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />

              <div className="relative text-center">
                <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                  {t('slide.consistency.totalWeeksActive')}
                </div>
                <div
                  className="text-5xl font-black text-white"
                  style={{
                    textShadow: '0 2px 20px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <AnimatedCounter
                    to={consistencyStreak.totalWeeksActive}
                    duration={1.5}
                    delay={2}
                    suffix={` ${t('slide.consistency.weeks')}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fun message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic">
            {consistencyStreak.longestStreak > 30
              ? `${t('slide.consistency.disciplineChamp')} 🏆`
              : consistencyStreak.longestStreak > 14
              ? `${t('slide.consistency.habitMakesStrength')} 💪`
              : `${t('slide.consistency.keepItUp')} 🎯`}
          </p>
        </motion.div>

        {/* Bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="absolute bottom-6 right-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-600 text-xs tracking-widest uppercase font-semibold"
          >
            {t('slide.consistency.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
