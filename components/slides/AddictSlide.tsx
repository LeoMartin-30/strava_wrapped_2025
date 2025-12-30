'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Clock, Calendar, LogIn } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

export default function AddictSlide({ data, onNext, onPrevious }: SlideProps) {
  const { logins } = data;

  // Skip if no login data
  if (!logins || logins.totalLogins === 0) {
    return null;
  }

  // Format peak hour as readable time (e.g., "18h00")
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}h00`;
  };

  // Get time period description
  const getTimePeriod = (hour: number) => {
    if (hour >= 5 && hour < 12) return "Lève-tôt";
    if (hour >= 12 && hour < 17) return "Après-midi";
    if (hour >= 17 && hour < 22) return "Soirée";
    return "Noctambule";
  };

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

      {/* Floating clocks */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-5"
          style={{
            left: `${10 + i * 18}%`,
            top: `${12 + i * 15}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          ⏰
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
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-4"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(14, 165, 233, 0.1) 100%)',
                border: '3px solid rgba(14, 165, 233, 0.5)',
                boxShadow: '0 0 40px rgba(14, 165, 233, 0.3), inset 0 0 20px rgba(14, 165, 233, 0.2)',
              }}
            >
              <Clock className="w-10 h-10 text-sky-400" />
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
            L'Accro
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">Tes habitudes Strava en 2025</p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          {/* Total Logins */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
                border: '2px solid rgba(14, 165, 233, 0.3)',
                boxShadow: '0 8px 32px rgba(14, 165, 233, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                <div
                  className="text-6xl font-black mb-2"
                  style={{
                    color: '#0EA5E9',
                    textShadow: '0 2px 30px rgba(14, 165, 233, 0.6)',
                  }}
                >
                  <AnimatedCounter to={logins.totalLogins} duration={2} delay={0.8} />
                </div>
                <div className="text-lg text-gray-300 font-semibold mb-1">
                  connexions
                </div>
                <div className="text-xs text-gray-500">
                  en 2025
                </div>
              </div>
            </div>
          </motion.div>

          {/* Peak Hour */}
          {logins.peakHour >= 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
            >
              <div
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.12) 0%, rgba(252, 76, 2, 0.03) 100%)',
                  border: '2px solid rgba(252, 76, 2, 0.25)',
                  boxShadow: '0 8px 32px rgba(252, 76, 2, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(252, 76, 2, 0.2)',
                        border: '2px solid rgba(252, 76, 2, 0.4)',
                      }}
                    >
                      <LogIn className="w-7 h-7 text-orange-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-1">
                      Heure de Pic
                    </div>
                    <div
                      className="text-4xl font-black tracking-tight"
                      style={{
                        color: '#FC4C02',
                        textShadow: '0 2px 20px rgba(252, 76, 2, 0.5)',
                      }}
                    >
                      {formatHour(logins.peakHour)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getTimePeriod(logins.peakHour)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Peak Day */}
          {logins.peakDay && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8, type: 'spring' }}
            >
              <div
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.03) 100%)',
                  border: '2px solid rgba(34, 197, 94, 0.25)',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
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
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '2px solid rgba(34, 197, 94, 0.4)',
                      }}
                    >
                      <Calendar className="w-7 h-7 text-green-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest text-green-400 uppercase mb-1">
                      Jour Favori
                    </div>
                    <div
                      className="text-3xl font-black tracking-tight capitalize"
                      style={{
                        color: '#22C55E',
                        textShadow: '0 2px 20px rgba(34, 197, 94, 0.5)',
                      }}
                    >
                      {logins.peakDay}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ton jour le plus actif
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Addiction level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic flex items-center gap-2 justify-center">
            <Clock className="w-4 h-4 text-sky-400" />
            {logins.totalLogins > 365
              ? "Accro confirmé"
              : logins.totalLogins > 180
              ? "Très régulier"
              : "Connecté modéré"}
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
            Tap pour continuer
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
