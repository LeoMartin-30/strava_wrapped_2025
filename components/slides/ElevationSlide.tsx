'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Mountain, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ElevationSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { totalElevation } = data;

  // Famous mountain comparisons (in meters)
  const mountains = [
    { name: 'Tour Eiffel', height: 330, emoji: '🗼' },
    { name: 'Burj Khalifa', height: 828, emoji: '🏗️' },
    { name: 'Mont Fuji', height: 3776, emoji: '🗻' },
    { name: 'Mont Blanc', height: 4808, emoji: '⛰️' },
    { name: 'Everest', height: 8849, emoji: '🏔️' },
  ];

  // Find the closest comparison
  const comparison = mountains.reduce((closest, mountain) => {
    const diff = Math.abs(totalElevation - mountain.height);
    const closestDiff = Math.abs(totalElevation - closest.height);
    return diff < closestDiff ? mountain : closest;
  });

  const ratio = (totalElevation / comparison.height).toFixed(1);

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

      {/* Floating mountains */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{
            left: `${15 + i * 22}%`,
            top: `${12 + i * 18}%`,
          }}
          animate={{
            y: [0, -25, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          ⛰️
        </motion.div>
      ))}

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
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-4"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 100%)',
                border: '3px solid rgba(34, 197, 94, 0.5)',
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.2)',
              }}
            >
              <Mountain className="w-10 h-10 text-green-400" />
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
            {t('slide.elevation.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.elevation.subtitle')}</p>
        </motion.div>

        {/* Total Elevation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="w-full max-w-sm mb-6"
        >
          <div
            className="p-8 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '2px solid rgba(34, 197, 94, 0.3)',
              boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div className="text-xs text-green-400 uppercase tracking-wider font-bold">{t('slide.elevation.elevationGain')}</div>
              </div>
              <div
                className="text-7xl font-black mb-2"
                style={{
                  color: '#22C55E',
                  textShadow: '0 2px 30px rgba(34, 197, 94, 0.6)',
                }}
              >
                <AnimatedCounter to={totalElevation} duration={2.5} delay={0.8} />
              </div>
              <div className="text-lg text-gray-300 font-semibold">
                {t('slide.elevation.metersClimbed')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm"
        >
          <div
            className="p-8 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.12) 0%, rgba(252, 76, 2, 0.03) 100%)',
              border: '2px solid rgba(252, 76, 2, 0.25)',
              boxShadow: '0 8px 32px rgba(252, 76, 2, 0.15)',
            }}
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="text-6xl mb-3"
              >
                {comparison.emoji}
              </motion.div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                {t('slide.elevation.equivalentTo')}
              </div>
              <div
                className="text-5xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #FC4C02 0%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <AnimatedCounter to={parseFloat(ratio)} decimals={1} duration={1.5} delay={1.4} />×
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {comparison.name}
              </div>
              <div className="text-xs text-gray-600">
                ({comparison.height}m)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mountain message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic flex items-center gap-2 justify-center">
            <Mountain className="w-4 h-4 text-green-400" />
            {t('slide.elevation.message')}
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
            className="text-gray-600 text-xs tracking-widest uppercase font-semibold"
          >
            {t('slide.elevation.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
