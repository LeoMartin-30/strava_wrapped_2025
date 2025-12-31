'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Heart, MessageCircle, Trophy } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function KudosSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { comments, social, profile } = data;
  const gender = profile?.gender;

  if (comments.length === 0 && social.totalKudos === 0) {
    return null;
  }

  // Format comments for marquee display
  const displayComments = comments.length > 0
    ? comments.slice(0, 20) // Limit to 20 most recent
    : [];

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

      {/* Floating hearts in background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-5"
          style={{
            left: `${10 + i * 15}%`,
            top: `${5 + i * 12}%`,
          }}
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          ❤️
        </motion.div>
      ))}

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
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-3"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center slide-icon-container"
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)',
                border: '3px solid rgba(239, 68, 68, 0.5)',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.2)',
              }}
            >
              <Heart className="w-8 h-8 text-red-400 fill-red-400 slide-icon" />
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
            {t('slide.kudos.title', gender)}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide slide-subtitle">{t('slide.kudos.subtitle')}</p>
        </motion.div>

        {/* Main Kudos Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="w-full max-w-sm mb-8"
        >
          <div
            className="p-4 rounded-2xl relative overflow-hidden"
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
                repeatDelay: 1,
              }}
            />

            <div className="relative text-center">
              <div
                className="text-5xl font-black mb-2"
                style={{
                  color: '#EF4444',
                  textShadow: '0 2px 30px rgba(239, 68, 68, 0.6)',
                }}
              >
                <AnimatedCounter to={social.totalKudos} duration={2} delay={0.8} />
              </div>
              <div className="text-lg text-gray-300 font-semibold mb-2">
                {t('slide.kudos.kudosReceived')}
              </div>
              <div className="text-xs text-gray-500">
                {t('slide.kudos.onActivities')} {data.totalActivities} {t('slide.kudos.activitiesShared')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Marquee Section */}
        {displayComments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="w-full mb-6"
          >
            <div className="text-center mb-4 slide-header">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} {comments.length > 1 ? t('slide.kudos.commentsPlural') : t('slide.kudos.comments')} {t('slide.kudos.encouragement')}</span>
              </div>
            </div>

            {/* Scrolling marquee */}
            <div className="relative overflow-hidden py-4">
              {/* Gradient overlays for fade effect */}
              <div
                className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, #0f1419 0%, transparent 100%)',
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(to left, #0f1419 0%, transparent 100%)',
                }}
              />

              {/* First marquee row */}
              <motion.div
                className="flex gap-4 mb-3"
                animate={{
                  x: [0, -1000],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {[...displayComments, ...displayComments].map((comment, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 px-4 py-2 rounded-lg"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    <p className="text-sm text-gray-300 italic whitespace-nowrap">
                      "{comment.text.substring(0, 60)}{comment.text.length > 60 ? '...' : ''}"
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* Second marquee row (reverse direction) */}
              {displayComments.length > 5 && (
                <motion.div
                  className="flex gap-4"
                  animate={{
                    x: [-1000, 0],
                  }}
                  transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  {[...displayComments.slice(5), ...displayComments.slice(5)].map((comment, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 px-4 py-2 rounded-lg"
                      style={{
                        background: 'rgba(252, 76, 2, 0.1)',
                        border: '1px solid rgba(252, 76, 2, 0.2)',
                      }}
                    >
                      <p className="text-sm text-gray-300 italic whitespace-nowrap">
                        "{comment.text.substring(0, 60)}{comment.text.length > 60 ? '...' : ''}"
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Trophy message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 italic flex items-center gap-2 justify-center">
            <Trophy className="w-4 h-4 text-yellow-500" />
            {social.totalKudos > 1000
              ? t('slide.kudos.legendCommunity')
              : social.totalKudos > 500
              ? t('slide.kudos.risingStar')
              : t('slide.kudos.encouragementChamp')}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
