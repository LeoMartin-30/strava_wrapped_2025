'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Zap, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PowerSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { powerStats } = data;

  if (!powerStats) {
    return null;
  }

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
      {/* Animated grid */}
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

      {/* Floating lightning bolts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-5"
          style={{
            left: `${12 + i * 16}%`,
            top: `${8 + i * 14}%`,
          }}
          animate={{
            y: [0, -35, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          ⚡
        </motion.div>
      ))}

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
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-3"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center slide-icon-container"
              style={{
                background: 'radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, rgba(234, 179, 8, 0.1) 100%)',
                border: '3px solid rgba(234, 179, 8, 0.5)',
                boxShadow: '0 0 40px rgba(234, 179, 8, 0.3), inset 0 0 20px rgba(234, 179, 8, 0.2)',
              }}
            >
              <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400 slide-icon" />
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
            {t('slide.power.title')}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide slide-subtitle">{t('slide.power.subtitle')}</p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          {/* Peak Power */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          >
            <div
              className="p-4 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.05) 100%)',
                border: '2px solid rgba(234, 179, 8, 0.3)',
                boxShadow: '0 8px 32px rgba(234, 179, 8, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Shimmer effect */}
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

              <div className="relative text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <div className="text-xs text-yellow-400 uppercase tracking-wider font-bold">{t('slide.power.peakPower')}</div>
                </div>
                <div
                  className="text-5xl font-black mb-2"
                  style={{
                    color: '#EAB308',
                    textShadow: '0 2px 30px rgba(234, 179, 8, 0.6)',
                  }}
                >
                  <AnimatedCounter to={powerStats.peakPower} duration={2} delay={0.8} />
                </div>
                <div className="text-base text-gray-300 font-semibold mb-1">
                  {t('slide.power.watts')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('slide.power.mostPowerfulOutput')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Average Power */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
          >
            <div
              className="p-4 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.03) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.25)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Shimmer effect */}
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
                  repeatDelay: 1.5,
                }}
              />

              <div className="relative text-center">
                <div className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-2">
                  {t('slide.power.averagePower')}
                </div>
                <div
                  className="text-4xl font-black mb-2"
                  style={{
                    color: '#3B82F6',
                    textShadow: '0 2px 25px rgba(59, 130, 246, 0.5)',
                  }}
                >
                  <AnimatedCounter to={powerStats.averagePower} duration={2} delay={1} />
                </div>
                <div className="text-base text-gray-300 font-semibold mb-1">
                  {t('slide.power.watts')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('slide.power.onAllRidesWithSensor')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activities with Power */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
          >
            <div
              className="p-4 rounded-xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.1) 0%, rgba(252, 76, 2, 0.02) 100%)',
                border: '2px solid rgba(252, 76, 2, 0.2)',
              }}
            >
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">{t('slide.power.powerData')}</div>
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="text-2xl font-black"
                    style={{
                      background: 'linear-gradient(90deg, #EAB308 0%, #3B82F6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    <AnimatedCounter
                      to={powerStats.totalActivitiesWithPower}
                      duration={1.5}
                      delay={1.4}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t('slide.power.activitiesWithSensor')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Power message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic flex items-center gap-2 justify-center">
            <Zap className="w-4 h-4 text-yellow-400" />
            {t('slide.power.electrifying')}
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
