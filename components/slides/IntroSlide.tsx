'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import AnimatedCounter from '../AnimatedCounter';
import { Activity, TrendingUp, Mountain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function IntroSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
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
        {/* Header with year badge */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 1, type: 'spring', bounce: 0.3 }}
            className="inline-block mb-4"
          >
            <div
              className="px-8 py-3 rounded-full border-2 relative overflow-hidden"
              style={{
                borderColor: 'rgba(252, 76, 2, 0.5)',
                background: 'rgba(252, 76, 2, 0.1)',
                boxShadow: '0 0 30px rgba(252, 76, 2, 0.3)',
              }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                }}
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span
                className="relative text-lg font-black tracking-widest"
                style={{
                  color: '#FC4C02',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                ★ 2025 ★
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-4xl font-black mb-3"
            style={{
              background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('slide.intro.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-gray-400 text-sm tracking-wide"
          >
            {t('slide.intro.subtitle')}
          </motion.p>
        </motion.div>

        {/* Stats Grid - 3 analog meters */}
        <div className="w-full max-w-sm space-y-4">
          {/* Activities Counter */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 1, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.15) 0%, rgba(252, 76, 2, 0.05) 100%)',
                border: '2px solid rgba(252, 76, 2, 0.3)',
                boxShadow: '0 8px 32px rgba(252, 76, 2, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
                <svg viewBox="0 0 100 100">
                  <path d="M100,0 L100,100 L0,100 Z" fill="#FC4C02" />
                </svg>
              </div>

              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="flex-shrink-0"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(252, 76, 2, 0.2)',
                      border: '2px solid rgba(252, 76, 2, 0.5)',
                    }}
                  >
                    <Activity className="w-7 h-7 text-orange-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-1">
                    {t('slide.intro.activities')}
                  </div>
                  <div
                    className="text-5xl font-black tracking-tight"
                    style={{
                      color: '#FC4C02',
                      textShadow: '0 2px 20px rgba(252, 76, 2, 0.5)',
                    }}
                  >
                    <AnimatedCounter to={data.totalActivities} duration={2} delay={1.2} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t('slide.intro.activitiesDesc')}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Distance Counter */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
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

              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="flex-shrink-0"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <TrendingUp className="w-7 h-7 text-blue-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-blue-300 uppercase mb-1">
                    {t('slide.intro.distance')}
                  </div>
                  <div
                    className="text-5xl font-black tracking-tight text-white"
                    style={{
                      textShadow: '0 2px 20px rgba(96, 165, 250, 0.3)',
                    }}
                  >
                    <AnimatedCounter to={data.totalDistance} duration={2} delay={1.4} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t('slide.intro.distanceDesc')}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Elevation Counter */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 1.4, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.03) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.2)',
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(34, 197, 94, 0.2)',
              }}
            >
              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="flex-shrink-0"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '2px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <Mountain className="w-7 h-7 text-green-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-green-400 uppercase mb-1">
                    {t('slide.intro.elevation')}
                  </div>
                  <div
                    className="text-5xl font-black tracking-tight text-white"
                    style={{
                      textShadow: '0 2px 20px rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <AnimatedCounter to={data.totalElevation} duration={2} delay={1.6} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t('slide.intro.elevationDesc')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Epic message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-base mb-1">{t('slide.intro.message1')}</p>
          <p
            className="text-2xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #FC4C02 0%, #FF8C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('slide.intro.message2')}
          </p>
        </motion.div>

        {/* Bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="absolute bottom-6 right-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-gray-600 text-xs tracking-widest uppercase font-semibold">
              {t('slide.intro.swipeToContinue')}
            </div>
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-transparent rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
