'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Smile, Award, Trophy, Medal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EmojiSlide({ data, onNext, onPrevious }: SlideProps) {
  const { topEmojis } = data;
  const { t } = useLanguage();

  if (topEmojis.length === 0) {
    return null;
  }

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
            linear-gradient(rgba(251, 191, 36, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.3) 1px, transparent 1px)
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

      {/* Floating emojis in background */}
      {topEmojis.slice(0, 5).map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{
            left: `${10 + i * 18}%`,
            top: `${10 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -35, 0],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

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
              rotate: [0, -10, 10, -10, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-3"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center slide-icon-container"
              style={{
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.1) 100%)',
                border: '3px solid rgba(251, 191, 36, 0.5)',
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.2)',
              }}
            >
              <Smile className="w-8 h-8 text-yellow-400 slide-icon" />
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
            {t('slide.emoji.title')}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide slide-subtitle">{t('slide.emoji.subtitle')}</p>
        </motion.div>

        {/* Top 3 Emojis - Big Display */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          {topEmojis.slice(0, 3).map((emoji, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 0.8 + index * 0.2,
                duration: 0.6,
                type: 'spring',
                stiffness: 200,
              }}
              className={`${
                index === 0 ? 'text-9xl' : index === 1 ? 'text-7xl' : 'text-6xl'
              }`}
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }}
              >
                {emoji}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Podium Display */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex items-end justify-center gap-3 mb-6"
        >
          {/* Second Place */}
          {topEmojis[1] && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.6, duration: 0.6, type: 'spring' }}
              className="relative"
              style={{ transformOrigin: 'bottom' }}
            >
              <div
                className="px-6 py-8 rounded-t-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.05) 100%)',
                  border: '2px solid rgba(192, 192, 192, 0.3)',
                  boxShadow: '0 8px 32px rgba(192, 192, 192, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                  <div className="text-5xl mb-2">{topEmojis[1]}</div>
                  <div className="flex items-center justify-center gap-1 text-gray-400">
                    <Medal className="w-4 h-4" />
                    <div className="text-xs font-bold">N°2</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* First Place */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.5, duration: 0.6, type: 'spring' }}
            className="relative"
            style={{ transformOrigin: 'bottom' }}
          >
            <div
              className="px-8 py-12 rounded-t-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.15) 0%, rgba(252, 76, 2, 0.05) 100%)',
                border: '3px solid rgba(252, 76, 2, 0.5)',
                boxShadow: '0 12px 40px rgba(252, 76, 2, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Shimmer */}
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

              {/* Sparkles */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <div className="text-2xl">✨</div>
              </motion.div>

              <div className="relative text-center">
                <div className="text-6xl mb-2">{topEmojis[0]}</div>
                <div className="flex items-center justify-center gap-1 text-orange-400">
                  <Trophy className="w-5 h-5" />
                  <div className="text-sm font-black">N°1</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Third Place */}
          {topEmojis[2] && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.7, duration: 0.6, type: 'spring' }}
              className="relative"
              style={{ transformOrigin: 'bottom' }}
            >
              <div
                className="px-4 py-6 rounded-t-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, rgba(205, 127, 50, 0.05) 100%)',
                  border: '2px solid rgba(205, 127, 50, 0.3)',
                  boxShadow: '0 8px 32px rgba(205, 127, 50, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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

                <div className="relative text-center">
                  <div className="text-4xl mb-2">{topEmojis[2]}</div>
                  <div className="flex items-center justify-center gap-1 text-amber-600">
                    <Award className="w-3 h-3" />
                    <div className="text-xs font-bold">N°3</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Fun message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 italic">
            {t('slide.emoji.emotionsInMotion')}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
