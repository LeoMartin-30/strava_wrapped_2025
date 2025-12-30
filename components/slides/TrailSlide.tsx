'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Trees, Award } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TrailSlide({ data, onNext, onPrevious }: SlideProps) {
  const { trailFactor } = data;
  const { t } = useLanguage();

  // Only show if there's trail activity
  if (trailFactor === 0) {
    return null;
  }

  const getBadgeMessage = (factor: number) => {
    if (factor >= 50) return t('slide.trail.trailMaster');
    if (factor >= 20) return t('slide.trail.trailExplorer');
    return t('slide.trail.trailCurious');
  };

  const badgeMessage = getBadgeMessage(trailFactor);

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

      {/* Floating trees in background */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-5"
          style={{
            left: `${10 + i * 14}%`,
            top: `${15 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          🌲
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
              scale: [1, 1.1, 1],
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
              <Trees className="w-10 h-10 text-green-400" />
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
            {t('slide.trail.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.trail.subtitle')}</p>
        </motion.div>

        {/* Trail Percentage - Big Reveal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm mb-8"
        >
          <div
            className="p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '3px solid rgba(34, 197, 94, 0.3)',
              boxShadow: '0 12px 40px rgba(34, 197, 94, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
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

            {/* Sparkle effect */}
            <motion.div
              className="absolute top-4 right-4"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <div className="text-3xl">✨</div>
            </motion.div>

            <div className="relative text-center">
              <div
                className="text-8xl font-black mb-4"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #86efac 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 40px rgba(34, 197, 94, 0.6)',
                }}
              >
                <AnimatedCounter to={trailFactor} duration={2} delay={0.8} suffix="%" />
              </div>
              <div className="text-lg text-gray-300 font-semibold">
                {t('slide.trail.ofDistanceOnTrails')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badge (if earned) */}
        {trailFactor >= 20 && (
          <motion.div
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="w-full max-w-sm"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.12) 0%, rgba(252, 76, 2, 0.03) 100%)',
                border: '2px solid rgba(252, 76, 2, 0.3)',
                boxShadow: '0 8px 32px rgba(252, 76, 2, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
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
                    <Award className="w-8 h-8 text-orange-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-1">
                    {t('slide.trail.badgeUnlocked')}
                  </div>
                  <div
                    className="text-2xl font-black"
                    style={{
                      color: '#FC4C02',
                      textShadow: '0 2px 20px rgba(252, 76, 2, 0.5)',
                    }}
                  >
                    {badgeMessage}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fun message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic">
            {trailFactor >= 50
              ? t('slide.trail.bornForTrails')
              : trailFactor >= 20
              ? t('slide.trail.natureCalls')
              : t('slide.trail.keepExploring')}
          </p>
        </motion.div>

        {/* Bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="absolute bottom-6 right-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-600 text-xs tracking-widest uppercase font-semibold"
          >
            {t('slide.trail.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
