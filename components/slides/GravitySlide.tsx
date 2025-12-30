'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { TrendingDown, Zap } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GravitySlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { totalElevationLoss } = data;

  if (totalElevationLoss === 0) {
    return null;
  }

  // Calculate knee impacts (rough estimate: 1 descent meter = 4x impact vs flat)
  const kneeImpacts = Math.round(totalElevationLoss * 4);

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
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
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

      {/* Floating down arrows in background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{
            left: `${15 + i * 15}%`,
            top: `${10 + i * 12}%`,
          }}
          animate={{
            y: [0, 40, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          ⬇️
        </motion.div>
      ))}

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
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
              y: [0, -10, 0],
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
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(147, 51, 234, 0.1) 100%)',
                border: '3px solid rgba(147, 51, 234, 0.5)',
                boxShadow: '0 0 40px rgba(147, 51, 234, 0.3), inset 0 0 20px rgba(147, 51, 234, 0.2)',
              }}
            >
              <TrendingDown className="w-10 h-10 text-purple-400" />
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
            {t('slide.gravity.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.gravity.subtitle')}</p>
        </motion.div>

        {/* Total Descent Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="w-full max-w-sm mb-6"
        >
          <div
            className="p-8 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
              border: '2px solid rgba(147, 51, 234, 0.3)',
              boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
              <div className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-2">
                {t('slide.gravity.negativeElevation')}
              </div>
              <div
                className="text-7xl font-black mb-2"
                style={{
                  color: '#a855f7',
                  textShadow: '0 2px 30px rgba(147, 51, 234, 0.6)',
                }}
              >
                <AnimatedCounter to={totalElevationLoss} duration={2} delay={0.8} />
              </div>
              <div className="text-lg text-gray-300 font-semibold">
                {t('slide.gravity.metersOfDescent')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Knee Impact Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ delay: 1, duration: 0.8, type: 'spring' }}
          className="w-full max-w-sm"
        >
          <div
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.12) 0%, rgba(252, 76, 2, 0.03) 100%)',
              border: '2px solid rgba(252, 76, 2, 0.2)',
              boxShadow: '0 8px 32px rgba(252, 76, 2, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="flex-shrink-0"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(252, 76, 2, 0.2)',
                    border: '2px solid rgba(252, 76, 2, 0.4)',
                  }}
                >
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
              </motion.div>

              <div className="flex-1">
                <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-1">
                  {t('slide.gravity.kneesImpacts')}
                </div>
                <div
                  className="text-4xl font-black"
                  style={{
                    color: '#FC4C02',
                    textShadow: '0 2px 20px rgba(252, 76, 2, 0.5)',
                  }}
                >
                  <AnimatedCounter to={kneeImpacts} duration={1.5} delay={1.2} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{t('slide.gravity.equivalentImpacts')}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic">
            {t('slide.gravity.jointsDeserveMedal')}
          </p>
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
            {t('slide.gravity.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
