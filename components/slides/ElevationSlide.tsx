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
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-3"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center slide-icon-container"
              style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 100%)',
                border: '3px solid rgba(34, 197, 94, 0.5)',
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.2)',
              }}
            >
              <Mountain className="w-8 h-8 text-green-400 slide-icon" />
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
            {t('slide.elevation.title')}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide slide-subtitle">{t('slide.elevation.subtitle')}</p>
        </motion.div>

        {/* Total Elevation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="w-full max-w-sm flex-1 flex flex-col justify-center"
        >
          <div
            className="p-6 rounded-2xl relative overflow-hidden"
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
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <div className="text-[10px] text-green-400 uppercase tracking-wider font-bold">{t('slide.elevation.elevationGain')}</div>
              </div>
              <div
                className="text-6xl font-black mb-1.5"
                style={{
                  color: '#22C55E',
                  textShadow: '0 2px 30px rgba(34, 197, 94, 0.6)',
                }}
              >
                <AnimatedCounter to={totalElevation} duration={2.5} delay={0.8} />
              </div>
              <div className="text-base text-gray-300 font-semibold">
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
            className="p-6 rounded-2xl relative overflow-hidden"
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
                className="text-5xl mb-2"
              >
                {comparison.emoji}
              </motion.div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
                {t('slide.elevation.equivalentTo')}
              </div>
              <div
                className="text-4xl font-black mb-1.5"
                style={{
                  background: 'linear-gradient(135deg, #FC4C02 0%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <AnimatedCounter to={parseFloat(ratio)} decimals={1} duration={1.5} delay={1.4} />×
              </div>
              <div className="text-xl font-bold text-white mb-0.5">
                {comparison.name}
              </div>
              <div className="text-[10px] text-gray-600">
                ({comparison.height}m)
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
