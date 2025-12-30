'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { User, MapPin, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function IdentitySlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { profile } = data;

  if (!profile) {
    // Fallback if no profile data
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onNext}
        className="h-full w-full bg-strava-dark flex items-center justify-center cursor-pointer"
      >
        <h1 className="text-4xl text-white">Strava Wrapped 2025</h1>
      </motion.div>
    );
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

      {/* Diagonal scan line effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent 0%, rgba(252, 76, 2, 0.1) 50%, transparent 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 200%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative h-full w-full flex flex-col items-center justify-between slide-container py-4 px-4 safe-top safe-bottom">
        {/* Year Badge - Top */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <div
            className="px-6 py-2 rounded-full border-2 relative overflow-hidden"
            style={{
              borderColor: 'rgba(252, 76, 2, 0.5)',
              background: 'rgba(252, 76, 2, 0.1)',
              boxShadow: '0 0 30px rgba(252, 76, 2, 0.2)',
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
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
            <span
              className="relative text-sm font-black tracking-widest"
              style={{
                color: '#FC4C02',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              ★ 2025 Edition ★
            </span>
          </div>
        </motion.div>

        {/* Main Card Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.5, duration: 1, type: 'spring' }}
          className="w-full max-w-sm relative"
          style={{
            perspective: '1000px',
          }}
        >
          {/* Card */}
          <div
            className="relative p-6 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.9) 0%, rgba(20, 25, 35, 0.9) 100%)',
              border: '2px solid rgba(252, 76, 2, 0.3)',
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            {/* Corner stamps */}
            <div className="absolute top-3 left-3 w-12 h-12 opacity-10 rotate-12">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="#FC4C02" strokeWidth="3" strokeDasharray="5,5" />
                <text x="50" y="60" textAnchor="middle" fill="#FC4C02" fontSize="30" fontWeight="bold">★</text>
              </svg>
            </div>

            <div className="absolute bottom-3 right-3 w-12 h-12 opacity-10 -rotate-12">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="#FC4C02" strokeWidth="3" strokeDasharray="5,5" />
                <text x="50" y="60" textAnchor="middle" fill="#FC4C02" fontSize="30" fontWeight="bold">✓</text>
              </svg>
            </div>

            {/* Header section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center mb-6 relative"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase opacity-70">
                  {t('slide.identity.certifiedAthlete')}
                </span>
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              </div>
            </motion.div>

            {/* Name - BIG and BOLD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8, type: 'spring' }}
              className="text-center mb-6"
            >
              <h1
                className="text-5xl font-black tracking-tight leading-none mb-2"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 20px rgba(252, 76, 2, 0.3)',
                  letterSpacing: '-0.02em',
                }}
              >
                {t('slide.identity.hello')}
              </h1>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-4xl font-black mb-1"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: '#FC4C02',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textShadow: '0 0 40px rgba(252, 76, 2, 0.5)',
                }}
              >
                {profile.firstName} !
              </motion.h2>

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="h-1 w-24 mx-auto rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #FC4C02 50%, transparent 100%)',
                }}
              />
            </motion.div>

            {/* 2025 Edition Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <div
                className="px-8 py-4 rounded-2xl border-3 relative overflow-hidden"
                style={{
                  borderColor: 'rgba(252, 76, 2, 0.6)',
                  background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.15) 0%, rgba(252, 76, 2, 0.05) 100%)',
                  boxShadow: '0 0 40px rgba(252, 76, 2, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  border: '3px solid rgba(252, 76, 2, 0.5)',
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
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
                <h3
                  className="relative text-3xl font-black tracking-widest text-center"
                  style={{
                    color: '#FC4C02',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    textShadow: '0 0 30px rgba(252, 76, 2, 0.5)',
                  }}
                >
                  ★ 2025 Edition ★
                </h3>
              </div>
            </motion.div>

            {/* Bio */}
            {profile.bio && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="flex items-start gap-2 px-4 py-3 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400 italic leading-relaxed">
                  "{profile.bio}"
                </p>
              </motion.div>
            )}

            {/* Stamp Effect */}
            <motion.div
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: -12, opacity: 0.15 }}
              transition={{ delay: 2, duration: 0.6, type: 'spring', bounce: 0.5 }}
              className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none"
            >
              <div
                className="px-6 py-3 rounded-lg border-4 font-black text-4xl"
                style={{
                  borderColor: '#FC4C02',
                  color: '#FC4C02',
                  transform: 'rotate(-12deg)',
                  letterSpacing: '0.1em',
                }}
              >
                ✓
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
