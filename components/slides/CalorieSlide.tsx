'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Flame, Coffee } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

export default function CalorieSlide({ data, onNext, onPrevious }: SlideProps) {
  const { totalCalories, activitiesWithCalories, totalActivities } = data;

  if (totalCalories === 0) {
    return null;
  }

  // Calorie conversions
  const croissants = Math.round(totalCalories / 200); // ~200 kcal per croissant
  const percentageWithCalories = Math.round((activitiesWithCalories / totalActivities) * 100);

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

      {/* Floating croissants in background */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          🥐
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
              <Flame className="w-10 h-10 text-orange-400" />
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
            Le Carburant
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">Calories brûlées en 2025</p>
        </motion.div>

        {/* Main Calories Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="w-full max-w-sm mb-6"
        >
          <div
            className="p-8 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.15) 0%, rgba(252, 76, 2, 0.05) 100%)',
              border: '2px solid rgba(252, 76, 2, 0.3)',
              boxShadow: '0 8px 32px rgba(252, 76, 2, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                  color: '#FC4C02',
                  textShadow: '0 2px 30px rgba(252, 76, 2, 0.6)',
                }}
              >
                <AnimatedCounter to={totalCalories} duration={2} delay={0.8} />
              </div>
              <div className="text-lg text-gray-300 font-semibold mb-3">
                kcal brûlées
              </div>
              <div className="text-xs text-gray-500">
                Sur {activitiesWithCalories} activité{activitiesWithCalories > 1 ? 's' : ''} ({percentageWithCalories}% du total)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Croissant Conversion - BIG REVEAL */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm mb-4"
        >
          <div
            className="p-10 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.05) 100%)',
              border: '3px solid rgba(255, 193, 7, 0.3)',
              boxShadow: '0 12px 40px rgba(255, 193, 7, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
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

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="text-6xl"
                >
                  🥐
                </motion.div>
                <div>
                  <div className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-1">
                    Équivalent
                  </div>
                  <div className="text-xs text-gray-500">
                    @ 200 kcal/croissant
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className="text-6xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 20px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  <AnimatedCounter to={croissants} duration={2} delay={1.4} />
                </div>
                <div className="text-sm text-gray-400 mt-1">croissants</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 italic flex items-center gap-2 justify-center">
            <Coffee className="w-4 h-4" />
            La boulangerie te remercie
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
            Tap pour continuer
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
