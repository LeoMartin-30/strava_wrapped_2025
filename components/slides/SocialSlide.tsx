'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Users, MessageSquare, Flag } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

export default function SocialSlide({ data, onNext, onPrevious }: SlideProps) {
  const { social } = data;

  // Skip if no social data
  if (social.totalMessages === 0 && social.totalClubs === 0) {
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

      {/* Floating social icons */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-5"
          style={{
            left: `${12 + i * 18}%`,
            top: `${8 + i * 16}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          {i % 2 === 0 ? '💬' : '👥'}
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
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%)',
                border: '3px solid rgba(59, 130, 246, 0.5)',
                boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.2)',
              }}
            >
              <Users className="w-10 h-10 text-blue-400" />
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
            Social Butterfly
          </h2>
          <p className="text-sm text-gray-400 tracking-wide">Ton réseau en 2025</p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          {/* Messages Counter */}
          {social.totalMessages > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
            >
              <div
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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

                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
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
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '2px solid rgba(59, 130, 246, 0.5)',
                      }}
                    >
                      <MessageSquare className="w-7 h-7 text-blue-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-1">
                      Messages Envoyés
                    </div>
                    <div
                      className="text-5xl font-black tracking-tight"
                      style={{
                        color: '#3B82F6',
                        textShadow: '0 2px 20px rgba(59, 130, 246, 0.5)',
                      }}
                    >
                      <AnimatedCounter to={social.totalMessages} duration={2} delay={0.8} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">conversations</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Clubs Counter */}
          {social.totalClubs > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
            >
              <div
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
                  border: '2px solid rgba(168, 85, 247, 0.3)',
                  boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                    repeatDelay: 1.5,
                  }}
                />

                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(168, 85, 247, 0.2)',
                        border: '2px solid rgba(168, 85, 247, 0.5)',
                      }}
                    >
                      <Flag className="w-7 h-7 text-purple-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-1">
                      Clubs Rejoints
                    </div>
                    <div
                      className="text-5xl font-black tracking-tight"
                      style={{
                        color: '#A855F7',
                        textShadow: '0 2px 20px rgba(168, 85, 247, 0.5)',
                      }}
                    >
                      <AnimatedCounter to={social.totalClubs} duration={2} delay={1} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">communautés</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Combined Stats */}
          {social.totalMessages > 0 && social.totalClubs > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
            >
              <div
                className="p-4 rounded-xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.1) 0%, rgba(252, 76, 2, 0.02) 100%)',
                  border: '2px solid rgba(252, 76, 2, 0.2)',
                }}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Indice Social</div>
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="text-3xl font-black"
                      style={{
                        background: 'linear-gradient(90deg, #3B82F6 0%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <AnimatedCounter
                        to={Math.round((social.totalMessages + social.totalClubs * 10) / 2)}
                        duration={2}
                        delay={1.4}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {social.totalMessages + social.totalClubs * 10 > 100
                      ? "Super connecté"
                      : social.totalMessages + social.totalClubs * 10 > 50
                      ? "Bien intégré"
                      : "Réseau en croissance"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Social message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 italic flex items-center gap-2 justify-center">
            <Users className="w-4 h-4 text-blue-400" />
            Connecté à la communauté
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
