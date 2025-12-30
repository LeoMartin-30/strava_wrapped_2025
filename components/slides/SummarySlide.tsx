'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Trophy, RotateCcw, Star, Sparkles, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SummarySlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);

  const topActivityType = Object.entries(data.activitiesByType).reduce(
    (max, [type, stats]) => (stats.count > max.stats.count ? { type, stats } : max),
    { type: 'N/A', stats: { count: 0, totalDistance: 0, totalTime: 0, totalElevation: 0 } }
  );

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(true);

    try {
      const slideElement = document.querySelector('.slide-container') as HTMLElement;
      if (!slideElement) throw new Error('Slide element not found');

      const dataUrl = await toPng(slideElement, {
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        filter: (node) => {
          // Exclude elements with 'no-export' class
          if (node.classList) {
            return !node.classList.contains('no-export');
          }
          return true;
        },
      });

      const blob = await fetch(dataUrl).then(r => r.blob());
      const file = new File([blob], `strava-wrapped-${Date.now()}.png`, { type: 'image/png' });

      // Try native share (mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t('slide.summary.shareTitle'),
          text: `🔥 ${t('slide.summary.shareText')}`,
        });
      } else {
        // Fallback: Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert(t('slide.summary.exportError'));
    } finally {
      setIsExporting(false);
    }
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
      {/* Animated grid pattern background */}
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

      {/* Share Button - Top Right Corner */}
      <motion.button
        onClick={handleShare}
        disabled={isExporting}
        className="absolute top-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center no-export"
        style={{
          background: isExporting
            ? 'rgba(100, 100, 100, 0.5)'
            : 'linear-gradient(135deg, #FC4C02 0%, #FF8C00 100%)',
          boxShadow: '0 4px 20px rgba(252, 76, 2, 0.4)',
          border: '2px solid rgba(252, 76, 2, 0.6)',
        }}
        whileHover={!isExporting ? { scale: 1.1 } : {}}
        whileTap={!isExporting ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
      >
        <Camera className="w-6 h-6 text-white" />
      </motion.button>

      {/* Radial glow - larger for finale */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(252, 76, 2, 0.5) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20,
            }}
            animate={{
              y: ['0vh', '100vh'],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, Math.random() * 720 - 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: ['#FC4C02', '#FBBF24', '#22c55e', '#6366f1'][Math.floor(Math.random() * 4)],
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating celebration emojis */}
      {['🏆', '⭐', '🎉', '💪', '🔥', '✨'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-8"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
        {/* Trophy Icon Header */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 1, type: 'spring', bounce: 0.5 }}
          className="mb-6"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{
              background: 'radial-gradient(circle, rgba(252, 76, 2, 0.3) 0%, rgba(252, 76, 2, 0.1) 100%)',
              border: '4px solid rgba(252, 76, 2, 0.6)',
              boxShadow: '0 0 60px rgba(252, 76, 2, 0.4), inset 0 0 30px rgba(252, 76, 2, 0.2)',
            }}
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
            >
              <Trophy className="w-14 h-14 text-orange-400" />
            </motion.div>

            {/* Sparkles around trophy */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * Math.PI / 2) * 60],
                  y: [0, Math.sin(i * Math.PI / 2) * 60],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2
            className="text-5xl font-black mb-3"
            style={{
              background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('slide.summary.incredibleYear')}
          </h2>
          <p className="text-xl text-gray-400">{t('slide.summary.wrapped')}</p>
        </motion.div>

        {/* Key Stats Summary Cards */}
        <div className="space-y-4 w-full max-w-sm mb-8">
          {/* Total Activities */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
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
                <div
                  className="text-6xl font-black mb-2"
                  style={{
                    color: '#FC4C02',
                    textShadow: '0 2px 30px rgba(252, 76, 2, 0.6)',
                  }}
                >
                  {data.totalActivities}
                </div>
                <div className="text-lg text-gray-300 font-semibold">{t('slide.summary.totalActivities')}</div>
              </div>
            </div>
          </motion.div>

          {/* Total Hours */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              }}
            >
              {/* Diagonal shine */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                }}
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />

              <div className="relative text-center">
                <div
                  className="text-6xl font-black mb-2 text-white"
                  style={{
                    textShadow: '0 2px 20px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {data.totalHours} <span className="text-3xl">{t('slide.summary.hours')}</span>
                </div>
                <div className="text-lg text-gray-300 font-semibold">{t('slide.summary.trainingTime')}</div>
              </div>
            </div>
          </motion.div>

          {/* Favorite Activity */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.03) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                    rotate: [0, -10, 10, 0],
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
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '2px solid rgba(34, 197, 94, 0.5)',
                    }}
                  >
                    <Star className="w-8 h-8 text-green-400" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest text-green-400 uppercase mb-1">
                    {t('slide.summary.favoriteActivity')}
                  </div>
                  <div
                    className="text-3xl font-black mb-1"
                    style={{
                      color: '#22c55e',
                      textShadow: '0 2px 20px rgba(34, 197, 94, 0.5)',
                    }}
                  >
                    {topActivityType.type}
                  </div>
                  <div className="text-sm text-gray-400">
                    {topActivityType.stats.count} {t('slide.summary.times')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action - Restart Button */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.6, type: 'spring' }}
          className="mb-4"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="group relative px-10 py-4 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FC4C02 0%, #FF8C00 100%)',
              boxShadow: '0 10px 40px rgba(252, 76, 2, 0.4)',
            }}
          >
            {/* Button shimmer */}
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              }}
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />

            <div className="relative flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-white font-black text-lg tracking-wide">
                {t('slide.summary.restart')}
              </span>
            </div>
          </button>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm mb-1">
            {t('slide.summary.keepMoving')}
          </p>
          <p
            className="text-lg font-black"
            style={{
              background: 'linear-gradient(90deg, #FC4C02 0%, #FF8C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('slide.summary.seeYouIn2026')}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
