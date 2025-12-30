'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Heart, Activity } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

export default function IntensitySlide({ data, onNext, onPrevious }: SlideProps) {
  const { heartRateZones } = data;

  if (heartRateZones.length === 0) {
    return null;
  }

  const zonesWithData = heartRateZones.filter(zone => zone.count > 0);

  // If no zones have data, don't render
  if (zonesWithData.length === 0) {
    return null;
  }

  const dominantZone = zonesWithData.reduce((max, zone) =>
    zone.count > max.count ? zone : max
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

      {/* Floating heartbeats */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-5"
          style={{
            left: `${15 + i * 18}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 1.5 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          💓
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
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-4"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)',
                border: '3px solid rgba(239, 68, 68, 0.5)',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.2)',
              }}
            >
              <Heart className="w-10 h-10 text-red-400 fill-red-400" />
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
            Zones Cardiaques
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">Distribution de ton intensité</p>
        </motion.div>

        {/* Heart Rate Zones Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-sm mb-6"
        >
          <div className="space-y-3">
            {zonesWithData.map((zone, i) => (
              <motion.div
                key={zone.zone}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
              >
                <div
                  className="p-4 rounded-xl relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${zone.color}20 0%, ${zone.color}08 100%)`,
                    border: `2px solid ${zone.color}40`,
                    boxShadow: `0 4px 16px ${zone.color}15`,
                  }}
                >
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: zone.color,
                          boxShadow: `0 0 12px ${zone.color}`,
                        }}
                      />
                      <div>
                        <div className="text-sm font-bold text-white">{zone.zone}</div>
                        <div className="text-xs text-gray-500">{zone.count} activités</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className="text-3xl font-black"
                        style={{
                          color: zone.color,
                          textShadow: `0 2px 15px ${zone.color}60`,
                        }}
                      >
                        <AnimatedCounter to={zone.percentage} duration={1.5} delay={1 + i * 0.1} />%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${zone.color} 0%, ${zone.color}80 100%)`,
                        boxShadow: `0 0 10px ${zone.color}`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.percentage}%` }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dominant Zone Highlight */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
          className="w-full max-w-sm"
        >
          <div
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${dominantZone.color}18 0%, ${dominantZone.color}05 100%)`,
              border: `2px solid ${dominantZone.color}50`,
              boxShadow: `0 8px 32px ${dominantZone.color}30, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
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
                <Activity className="w-4 h-4" style={{ color: dominantZone.color }} />
                <div className="text-xs text-gray-400 uppercase tracking-wider">Zone dominante</div>
              </div>
              <div
                className="text-3xl font-black mb-1"
                style={{
                  color: dominantZone.color,
                  textShadow: `0 2px 20px ${dominantZone.color}60`,
                }}
              >
                {dominantZone.zone}
              </div>
              <div className="text-sm text-gray-400">
                Passé {dominantZone.percentage}% du temps dans cette zone
              </div>
            </div>
          </div>
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
