'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Users, Trophy, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SocialButterflySlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { followerStats, challengeStats, comments } = data;

  // Network nodes for visual effect
  const networkNodes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 50 + Math.cos((i / 12) * Math.PI * 2) * 35,
    y: 50 + Math.sin((i / 12) * Math.PI * 2) * 35,
    delay: i * 0.08,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
      className="h-full w-full relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f1419 100%)',
      }}
    >
      {/* Radial network pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.3)" />
              <line x1="50" y1="50" x2="80" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="20" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network)" />
        </svg>
      </div>

      {/* Animated connection lines background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        <svg className="w-full h-full" style={{ filter: 'blur(1px)' }}>
          {networkNodes.map((node, i) => {
            const nextNode = networkNodes[(i + 1) % networkNodes.length];
            return (
              <motion.line
                key={i}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="rgba(99, 102, 241, 0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{
                  duration: 2,
                  delay: node.delay,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Central glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative h-full w-full flex flex-col items-center justify-between slide-container py-8 px-6 safe-top safe-bottom">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div
            className="inline-block mb-4 relative"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Butterfly wings effect */}
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-16 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  border: '2px solid rgba(99, 102, 241, 0.4)',
                  transformOrigin: 'right center',
                }}
                animate={{
                  scaleX: [1, 1.2, 1],
                  rotate: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-16 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.2) 100%)',
                  border: '2px solid rgba(236, 72, 153, 0.4)',
                  transformOrigin: 'left center',
                }}
                animate={{
                  scaleX: [1, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
                style={{
                  background: 'rgba(16, 24, 39, 0.9)',
                  border: '2px solid rgba(99, 102, 241, 0.5)',
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </motion.div>

          <h2
            className="text-3xl font-black mb-1.5 slide-title"
            style={{
              background: 'linear-gradient(to right, #6366F1 0%, #EC4899 50%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('slide.social.title')}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide slide-subtitle">{t('slide.social.subtitle')}</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-2xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Followers Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(99, 102, 241, 0.3) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                }}
              />

              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="inline-block mb-3"
                >
                  <Users className="w-8 h-8 text-indigo-400 slide-icon" />
                </motion.div>

                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                  {t('slide.social.followers')}
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: 'spring', bounce: 0.5 }}
                  className="text-4xl font-black mb-1"
                  style={{
                    color: '#6366F1',
                    textShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                  }}
                >
                  {followerStats.total}
                </motion.div>

                <div className="text-xs text-gray-400">
                  Abonnés sur Strava
                </div>
              </div>
            </motion.div>

            {/* Total Challenges Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8, type: 'spring' }}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '2px solid rgba(236, 72, 153, 0.3)',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(236, 72, 153, 0.3) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                }}
              />

              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="inline-block mb-3"
                >
                  <Trophy className="w-8 h-8 text-pink-400 slide-icon" />
                </motion.div>

                <div className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-2">
                  {t('slide.social.challenges')}
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: 'spring', bounce: 0.5 }}
                  className="text-4xl font-black mb-1"
                  style={{
                    color: '#EC4899',
                    textShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                  }}
                >
                  {challengeStats.completed}
                </motion.div>

                <div className="text-xs text-gray-400">
                  {t('slide.social.completedOf')} {challengeStats.total}
                </div>
              </div>
            </motion.div>

            {/* Comments Published Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                }}
              />

              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="inline-block mb-3"
                >
                  <MessageCircle className="w-8 h-8 text-purple-400 slide-icon" />
                </motion.div>

                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                  {t('slide.social.comments')}
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, type: 'spring', bounce: 0.5 }}
                  className="text-4xl font-black mb-1"
                  style={{
                    color: '#8B5CF6',
                    textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                  }}
                >
                  {comments.length}
                </motion.div>

                <div className="text-xs text-gray-400">
                  {t('slide.social.publishedOn')}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Connection message */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.8, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-xl"
        >
          <div
            className="p-4 rounded-2xl relative overflow-hidden text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
              border: '2px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Animated particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#6366F1' : '#EC4899',
                  left: `${20 + i * 15}%`,
                  top: '20%',
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            <div className="relative">
              <div className="text-2xl font-black mb-2" style={{ color: '#E0E7FF' }}>
                🌐 {t('slide.social.title')}
              </div>
              <div className="text-sm text-gray-300">
                {t('slide.social.community')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
