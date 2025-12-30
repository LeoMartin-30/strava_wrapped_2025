'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Zap, Heart, Gauge } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MoteurSlide({ data, onNext, onPrevious }: SlideProps) {
  const { preferences, powerStats, heartRateZones } = data;
  const { t } = useLanguage();

  // Skip if no FTP or HR data
  if (!preferences || (preferences.ftp === 0 && preferences.maxHR === 0)) {
    return null;
  }

  const hasPowerData = powerStats && powerStats.averagePower > 0;
  const hasHRData = heartRateZones && heartRateZones.length > 0;

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
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-5"
          style={{
            left: `${15 + i * 20}%`,
            top: `${10 + i * 18}%`,
          }}
          animate={{
            y: [0, -35, 0],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          ⚡
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
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
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
                background: 'radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, rgba(234, 179, 8, 0.1) 100%)',
                border: '3px solid rgba(234, 179, 8, 0.5)',
                boxShadow: '0 0 40px rgba(234, 179, 8, 0.3), inset 0 0 20px rgba(234, 179, 8, 0.2)',
              }}
            >
              <Zap className="w-10 h-10 text-yellow-400 fill-yellow-400" />
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
            {t('slide.moteur.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.moteur.subtitle')}</p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          {/* FTP Display */}
          {preferences.ftp > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
            >
              <div
                className="p-6 rounded-2xl relative overflow-hidden"
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

                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(234, 179, 8, 0.2)',
                        border: '2px solid rgba(234, 179, 8, 0.5)',
                      }}
                    >
                      <Gauge className="w-7 h-7 text-yellow-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-1">
                      {t('slide.moteur.ftpThreshold')}
                    </div>
                    <div
                      className="text-5xl font-black tracking-tight"
                      style={{
                        color: '#EAB308',
                        textShadow: '0 2px 20px rgba(234, 179, 8, 0.5)',
                      }}
                    >
                      <AnimatedCounter to={preferences.ftp} duration={2} delay={0.8} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{t('slide.power.watts')}</div>
                  </div>
                </div>

                {/* FTP Zones */}
                {hasPowerData && (
                  <div className="mt-4 pt-4 border-t border-yellow-400/20">
                    <div className="text-xs text-gray-400 mb-2">{t('slide.moteur.averagePowerInActivity')}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-yellow-300">
                        <AnimatedCounter to={powerStats.averagePower} duration={2} delay={1} />
                      </span>
                      <span className="text-sm text-gray-500">{t('slide.power.watts')}</span>
                      <span className="text-xs text-gray-600 ml-2">
                        ({Math.round((powerStats.averagePower / preferences.ftp) * 100)}% FTP)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Max HR Display */}
          {preferences.maxHR > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
            >
              <div
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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

                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '2px solid rgba(239, 68, 68, 0.5)',
                      }}
                    >
                      <Heart className="w-7 h-7 text-red-400 fill-red-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest text-red-400 uppercase mb-1">
                      {t('slide.moteur.maxHeartRate')}
                    </div>
                    <div
                      className="text-5xl font-black tracking-tight"
                      style={{
                        color: '#EF4444',
                        textShadow: '0 2px 20px rgba(239, 68, 68, 0.5)',
                      }}
                    >
                      <AnimatedCounter to={preferences.maxHR} duration={2} delay={1} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{t('slide.moteur.bpm')}</div>
                  </div>
                </div>

                {/* HR Zones Preview */}
                {hasHRData && (
                  <div className="mt-4 pt-4 border-t border-red-400/20">
                    <div className="text-xs text-gray-400 mb-2">{t('slide.moteur.mostFrequentZones')}</div>
                    <div className="flex gap-2">
                      {heartRateZones.slice(0, 3).map((zone, i) => (
                        <div
                          key={i}
                          className="flex-1 px-2 py-1 rounded text-center"
                          style={{
                            background: `${zone.color}20`,
                            border: `1px solid ${zone.color}40`,
                          }}
                        >
                          <div className="text-xs font-bold" style={{ color: zone.color }}>
                            {zone.zone}
                          </div>
                          <div className="text-xs text-gray-500">{zone.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Engine message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic flex items-center gap-2 justify-center">
            <Zap className="w-4 h-4 text-yellow-400" />
            {t('slide.moteur.calibratedForPerformance')}
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
            {t('slide.moteur.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
