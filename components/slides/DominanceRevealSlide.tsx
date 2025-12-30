'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SlideProps } from '@/types';
import { DominanceResult } from '@/lib/dominanceDetector';
import { useEffect } from 'react';

interface DominanceRevealSlideProps extends SlideProps {
  dominanceResult: DominanceResult;
}

export default function DominanceRevealSlide({
  dominanceResult,
  onNext,
  onPrevious
}: DominanceRevealSlideProps) {
  const { theme, title, description, confidence } = dominanceResult;
  const badge = theme.badge;

  // Auto-advance after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onNext]);

  // Generate radiating beams
  const beams = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12,
    delay: i * 0.05,
  }));

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full relative overflow-hidden cursor-pointer"
      onClick={onNext}
      style={{
        background: '#000000',
      }}
    >
      {/* Gradient background that fades in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{
          background: theme.gradients.main,
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Animated noise texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: theme.colors.secondary,
            boxShadow: `0 0 ${particle.size * 2}px ${theme.colors.secondary}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Radiating beams from center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-[600px] h-[600px]"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.8, type: 'spring', bounce: 0.3 }}
        >
          {beams.map((beam) => (
            <motion.div
              key={beam.id}
              className="absolute left-1/2 top-1/2 origin-left"
              style={{
                transform: `rotate(${beam.angle}deg) translateY(-50%)`,
                width: '300px',
                height: '2px',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
              transition={{
                duration: 0.8,
                delay: 1.0 + beam.delay,
                ease: 'easeOut',
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(90deg, ${theme.colors.primary} 0%, transparent 100%)`,
                  boxShadow: `0 0 10px ${theme.colors.primary}`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Central glow pulse */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle, ${theme.colors.primary}40 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Main content container */}
      <div className="relative h-full w-full flex flex-col items-center justify-between slide-container py-8 px-6 safe-top safe-bottom">
        {/* Badge reveal */}
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{
            duration: 1,
            delay: 1.5,
            type: 'spring',
            bounce: 0.4,
          }}
          className="relative mb-8"
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.primary})`,
              padding: '4px',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ background: '#000' }}
            />
          </motion.div>

          {/* Badge container */}
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${theme.colors.primary}30 0%, ${theme.colors.background} 100%)`,
              border: `3px solid ${theme.colors.primary}`,
              boxShadow: `
                0 0 40px ${theme.colors.primary}80,
                inset 0 0 40px ${theme.colors.primary}20,
                0 0 80px ${theme.colors.primary}40
              `,
            }}
          >
            {/* Emoji */}
            <motion.div
              className="text-6xl"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 1.8,
                type: 'spring',
                bounce: 0.6,
              }}
            >
              {badge.emoji}
            </motion.div>

            {/* Rotating shimmer */}
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${theme.colors.secondary}40 90deg, transparent 180deg)`,
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Title reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="text-center mb-4 slide-header"
        >
          <motion.h1
            className="text-5xl font-black mb-1.5 tracking-tight"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `0 0 40px ${theme.colors.primary}40`,
            }}
          >
            {title}
          </motion.h1>

          <motion.div
            className="text-xs font-bold tracking-widest uppercase"
            style={{
              color: theme.colors.secondary,
              opacity: 0.8,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            {badge.label}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="text-center max-w-md text-lg leading-relaxed"
          style={{
            color: theme.colors.accent,
            fontWeight: 500,
          }}
        >
          {description}
        </motion.p>

        {/* Confidence indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.8 }}
          className="mt-8 flex items-center gap-2"
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <motion.div
                key={i}
                className="w-2 h-8 rounded-full"
                style={{
                  background: i < Math.floor(confidence / 20)
                    ? theme.colors.primary
                    : `${theme.colors.primary}20`,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 2.9 + i * 0.1,
                  type: 'spring',
                }}
              />
            ))}
          </div>
          <span
            className="text-xs font-bold uppercase tracking-wider ml-2"
            style={{ color: theme.colors.secondary, opacity: 0.6 }}
          >
            Profil détecté
          </span>
        </motion.div>

        {/* Auto-advance hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{
            duration: 2,
            delay: 3,
            repeat: Infinity,
          }}
          className="text-center mt-4 text-[10px] uppercase tracking-widest font-bold"
          style={{ color: theme.colors.accent, opacity: 0.4 }}
        >
          Préparation de ton récap...
        </motion.div>
      </div>

      {/* Corner accent decorations */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32"
        initial={{ opacity: 0, x: -50, y: -50 }}
        animate={{ opacity: 0.3, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}40 0%, transparent 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32"
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 0.3, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${theme.colors.secondary}40 100%)`,
            clipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
