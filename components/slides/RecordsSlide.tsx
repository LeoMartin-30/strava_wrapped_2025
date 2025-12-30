'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Trophy, Clock, Gauge, Ruler, Award, Sparkles } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RecordsSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t, language } = useLanguage();
  const { longestActivityByDistance, longestActivityByDuration, fastestActivity, averageSpeed } = data;

  // NULL STATE GUARD - Prevent crash if no records exist
  if (!longestActivityByDistance || !longestActivityByDuration || !fastestActivity) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onNext}
        className="h-full w-full flex items-center justify-center cursor-pointer"
        style={{
          background: 'radial-gradient(ellipse at top, #1a0f0a 0%, #0a0604 50%, #000000 100%)',
        }}
      >
        <div className="text-center p-8">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">{t('slide.records.noRecords')}</h2>
          <p className="text-sm text-gray-600">{t('slide.records.uploadMore')}</p>
        </div>
      </motion.div>
    );
  }

  // Helper to format time
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Helper to format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
      className="h-full w-full relative overflow-hidden cursor-pointer"
      style={{
        background: 'radial-gradient(ellipse at top, #1a0f0a 0%, #0a0604 50%, #000000 100%)',
      }}
    >
      {/* Animated spotlight beams */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 100px, rgba(255,215,0,0.03) 100px, rgba(255,215,0,0.03) 102px)',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '200px 0px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial glow effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative h-full w-full flex flex-col items-center justify-start p-6 overflow-y-auto">
        {/* Header with trophy */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{
            delay: 0.2,
            duration: 1,
            type: 'spring',
            stiffness: 100,
          }}
          className="text-center mb-6 relative"
        >
          {/* Glow behind trophy */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)',
            }}
          />

          <motion.div
            className="relative flex items-center justify-center mb-3"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Trophy className="w-20 h-20" style={{
              fill: 'url(#gold-gradient)',
              filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))',
            }} />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <h2
            className="text-5xl font-black tracking-tight mb-1 relative"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'linear-gradient(to bottom, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255,215,0,0.3)',
            }}
          >
            {t('slide.records.title')}
          </h2>
          <p className="text-sm tracking-widest text-amber-200/60 uppercase font-semibold">
            ★ {t('slide.records.subtitle')} ★
          </p>
        </motion.div>

        {/* Trophy cases */}
        <div className="w-full max-w-md space-y-3 relative z-10">
          {/* Longest Distance - GOLD MEDAL */}
          {longestActivityByDistance && (
            <motion.div
              initial={{ x: -100, opacity: 0, rotateY: -45 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
              className="relative group"
            >
              {/* Spotlight effect */}
              <motion.div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.4), rgba(255,140,0,0.2))',
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              <div
                className="relative p-5 rounded-2xl overflow-hidden border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,140,0,0.05) 100%)',
                  borderColor: 'rgba(255,215,0,0.4)',
                  boxShadow: '0 8px 32px rgba(255,215,0,0.15), inset 0 1px 0 rgba(255,215,0,0.3)',
                }}
              >
                {/* Diagonal shine effect */}
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
                    repeatDelay: 2,
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Award className="w-12 h-12 text-yellow-400" style={{
                        filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))',
                      }} />
                    </motion.div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black tracking-widest text-yellow-400 uppercase">
                        🥇 {t('slide.records.longestDistance')}
                      </span>
                    </div>
                    <div className="text-4xl font-black text-white mb-1 tracking-tight" style={{
                      textShadow: '0 2px 10px rgba(255,215,0,0.3)',
                    }}>
                      <AnimatedCounter to={longestActivityByDistance.distance} decimals={1} duration={1.5} delay={0.7} />
                      <span className="text-2xl ml-1 text-yellow-400/80">km</span>
                    </div>
                    <div className="text-xs text-amber-200/70 font-medium">
                      {longestActivityByDistance.activityType} • {formatDate(longestActivityByDistance.date)}
                    </div>
                    <div className="text-xs text-amber-200/50 mt-0.5">
                      {formatTime(longestActivityByDistance.duration)} • {longestActivityByDistance.averageSpeed.toFixed(1)} km/h
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Longest Duration - SILVER MEDAL */}
          {longestActivityByDuration && (
            <motion.div
              initial={{ x: 100, opacity: 0, rotateY: 45 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}
              className="relative group"
            >
              <motion.div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(192,192,192,0.4), rgba(128,128,128,0.2))',
                }}
                animate={{
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />

              <div
                className="relative p-5 rounded-2xl overflow-hidden border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(192,192,192,0.12) 0%, rgba(128,128,128,0.05) 100%)',
                  borderColor: 'rgba(192,192,192,0.3)',
                  boxShadow: '0 8px 32px rgba(192,192,192,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                  }}
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: 0.5,
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <Clock className="w-11 h-11 text-slate-300 flex-shrink-0" style={{
                    filter: 'drop-shadow(0 0 8px rgba(192,192,192,0.4))',
                  }} />

                  <div className="flex-1">
                    <div className="text-xs font-black tracking-widest text-slate-300 uppercase mb-1">
                      🥈 {t('slide.records.longestDuration')}
                    </div>
                    <div className="text-4xl font-black text-white mb-1 tracking-tight" style={{
                      textShadow: '0 2px 10px rgba(192,192,192,0.3)',
                    }}>
                      {formatTime(longestActivityByDuration.duration)}
                    </div>
                    <div className="text-xs text-slate-300/70 font-medium">
                      {longestActivityByDuration.activityType} • {formatDate(longestActivityByDuration.date)}
                    </div>
                    <div className="text-xs text-slate-300/50 mt-0.5">
                      {longestActivityByDuration.distance.toFixed(1)} km • {longestActivityByDuration.averageSpeed.toFixed(1)} km/h
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Fastest Activity - BRONZE MEDAL */}
          {fastestActivity && (
            <motion.div
              initial={{ x: -100, opacity: 0, rotateY: -45 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.9, duration: 0.8, type: 'spring' }}
              className="relative group"
            >
              <motion.div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(205,127,50,0.4), rgba(139,69,19,0.2))',
                }}
                animate={{
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1,
                }}
              />

              <div
                className="relative p-5 rounded-2xl overflow-hidden border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(205,127,50,0.12) 0%, rgba(139,69,19,0.05) 100%)',
                  borderColor: 'rgba(205,127,50,0.3)',
                  boxShadow: '0 8px 32px rgba(205,127,50,0.1), inset 0 1px 0 rgba(205,127,50,0.2)',
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                  }}
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: 1,
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Gauge className="w-11 h-11 text-orange-400 flex-shrink-0" style={{
                      filter: 'drop-shadow(0 0 8px rgba(255,140,0,0.5))',
                    }} />
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-black tracking-widest text-orange-300 uppercase mb-1">
                      🥉 {t('slide.records.fastestActivity')}
                    </div>
                    <div className="text-4xl font-black text-white mb-1 tracking-tight" style={{
                      textShadow: '0 2px 10px rgba(255,140,0,0.3)',
                    }}>
                      <AnimatedCounter to={fastestActivity.averageSpeed} decimals={1} duration={1.5} delay={1.1} />
                      <span className="text-2xl ml-1 text-orange-400/80">km/h</span>
                    </div>
                    <div className="text-xs text-orange-200/70 font-medium">
                      {fastestActivity.activityType} • {formatDate(fastestActivity.date)}
                    </div>
                    <div className="text-xs text-orange-200/50 mt-0.5">
                      {fastestActivity.distance.toFixed(1)} km • {formatTime(fastestActivity.duration)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Average Speed - SPECIAL RECOGNITION */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="relative p-6 rounded-2xl overflow-hidden border"
              style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(20,83,45,0.05) 100%)',
                borderColor: 'rgba(34,197,94,0.2)',
                boxShadow: '0 4px 20px rgba(34,197,94,0.1)',
              }}
            >
              {/* Sparkle particles */}
              <motion.div
                className="absolute top-2 right-2"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-5 h-5 text-green-400/40" />
              </motion.div>

              <div className="text-center relative">
                <div className="text-xs font-black tracking-widest text-green-400 uppercase mb-3 flex items-center justify-center gap-2">
                  <span>⚡</span>
                  <span>{t('slide.records.globalAverageSpeed')}</span>
                  <span>⚡</span>
                </div>
                <div className="text-5xl font-black text-white tracking-tight" style={{
                  textShadow: '0 2px 15px rgba(34,197,94,0.4)',
                }}>
                  <AnimatedCounter to={averageSpeed} decimals={1} duration={1.5} delay={1.3} />
                  <span className="text-3xl ml-2 text-green-400/80">km/h</span>
                </div>
                <div className="text-xs text-green-200/50 mt-2 font-medium tracking-wide">
                  {t('slide.records.averagePerformance')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
