'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Thermometer, Snowflake, Flame } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WeatherSlide({ data, onNext, onPrevious }: SlideProps) {
  const { temperatureRecords } = data;
  const { t } = useLanguage();

  if (temperatureRecords.averageTemperature === 0) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const tempRange = Math.round(
    temperatureRecords.hottest.temperature - temperatureRecords.coldest.temperature
  );

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
            linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
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

      {/* Floating weather emojis in background */}
      {['❄️', '🌡️', '🔥', '☀️', '🌨️'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{
            left: `${10 + i * 18}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 5 + i * 0.6,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
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
              <Thermometer className="w-10 h-10 text-orange-400" />
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
            {t('slide.weather.title')}
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">{t('slide.weather.subtitle')}</p>
        </motion.div>

        <div className="space-y-4 w-full max-w-sm mb-6">
          {/* Coldest Day */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="flex-shrink-0"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '2px solid rgba(59, 130, 246, 0.5)',
                    }}
                  >
                    <Snowflake className="w-8 h-8 text-blue-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-1">
                    {t('slide.weather.coldestDay') || 'Jour le plus froid'}
                  </div>
                  <div
                    className="text-5xl font-black mb-1"
                    style={{
                      color: '#60a5fa',
                      textShadow: '0 2px 30px rgba(59, 130, 246, 0.6)',
                    }}
                  >
                    <AnimatedCounter
                      to={temperatureRecords.coldest.temperature}
                      duration={2}
                      delay={0.8}
                      suffix="°C"
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(temperatureRecords.coldest.date)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {temperatureRecords.coldest.activityType}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hottest Day */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '2px solid rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    <Flame className="w-8 h-8 text-red-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-red-400 uppercase mb-1">
                    {t('slide.weather.hottestDay') || 'Jour le plus chaud'}
                  </div>
                  <div
                    className="text-5xl font-black mb-1"
                    style={{
                      color: '#f87171',
                      textShadow: '0 2px 30px rgba(239, 68, 68, 0.6)',
                    }}
                  >
                    <AnimatedCounter
                      to={temperatureRecords.hottest.temperature}
                      duration={2}
                      delay={1.1}
                      suffix="°C"
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(temperatureRecords.hottest.date)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {temperatureRecords.hottest.activityType}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Average Temperature Card */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.4, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm"
        >
          <div
            className="p-8 rounded-2xl relative overflow-hidden"
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

            <div className="relative text-center">
              <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-2">
                {t('slide.weather.averageTemperature') || 'Température Moyenne'}
              </div>
              <div
                className="text-6xl font-black mb-2"
                style={{
                  color: '#FC4C02',
                  textShadow: '0 2px 30px rgba(252, 76, 2, 0.6)',
                }}
              >
                <AnimatedCounter
                  to={temperatureRecords.averageTemperature}
                  duration={1.5}
                  delay={1.6}
                  suffix="°C"
                />
              </div>
              <div className="text-sm text-gray-300 font-semibold">
                {t('slide.weather.thermalRange') || 'Amplitude thermique'}: {tempRange}°C
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic">
            {tempRange > 40
              ? t('slide.weather.nothingStopsYou') || "Rien ne vous arrête 💪"
              : tempRange > 25
              ? t('slide.weather.expertAdaptation') || "Adaptation niveau expert 🌡️"
              : t('slide.weather.alwaysReadyForAdventure') || "Toujours prêt pour l'aventure ⛅"}
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
            {t('common.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
