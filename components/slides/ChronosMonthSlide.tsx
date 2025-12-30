'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChronosMonthSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();
  const { activitiesByMonth } = data;

  // Convert to array and sort by month number
  const monthsArray = Object.values(activitiesByMonth).sort((a, b) => a.monthNumber - b.monthNumber);

  // Find most active month
  const mostActiveMonth = monthsArray.reduce((max, month) =>
    month.count > max.count ? month : max
  , monthsArray[0] || { month: '', count: 0, monthNumber: 0, totalDistance: 0, totalTime: 0, totalElevation: 0 });

  const maxCount = Math.max(...monthsArray.map(m => m.count));

  // Seasonal color mapping
  const getSeasonalColor = (monthNum: number) => {
    if (monthNum >= 12 || monthNum <= 2) return { primary: '#6366F1', secondary: '#818CF8', glow: 'rgba(99, 102, 241, 0.4)' }; // Winter
    if (monthNum >= 3 && monthNum <= 5) return { primary: '#34D399', secondary: '#6EE7B7', glow: 'rgba(52, 211, 153, 0.4)' }; // Spring
    if (monthNum >= 6 && monthNum <= 8) return { primary: '#FBBF24', secondary: '#FCD34D', glow: 'rgba(251, 191, 36, 0.4)' }; // Summer
    return { primary: '#F97316', secondary: '#FC4C02', glow: 'rgba(249, 115, 22, 0.4)' }; // Fall
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
      className="h-full w-full relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #0a0d12 0%, #1a1f29 50%, #0f1419 100%)',
      }}
    >
      {/* Animated calendar grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-6"
        >
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
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(249, 115, 22, 0.3) 100%)',
                border: '2px solid rgba(99, 102, 241, 0.4)',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.3), inset 0 0 15px rgba(99, 102, 241, 0.15)',
              }}
            >
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <h2
            className="text-3xl font-black mb-1"
            style={{
              background: 'linear-gradient(90deg, #6366F1 0%, #34D399 25%, #FBBF24 50%, #F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('slide.chronosMonth.title')}
          </h2>
          <p className="text-xs text-gray-400 tracking-wide">{t('slide.chronosMonth.subtitle')}</p>
        </motion.div>

        {/* All 12 months in a compact grid */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-md space-y-1.5 mb-5"
        >
          {monthsArray.map((month, index) => {
            const colors = getSeasonalColor(month.monthNumber);
            const widthPercentage = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
            const isMostActive = month.monthNumber === mostActiveMonth.monthNumber;

            return (
              <motion.div
                key={month.month}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                {/* Month label */}
                <div className="w-16 text-right">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: isMostActive ? colors.primary : '#9CA3AF',
                    }}
                  >
                    {month.month.substring(0, 3)}
                  </span>
                </div>

                {/* Horizontal bar */}
                <div className="flex-1 relative h-7 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      boxShadow: isMostActive
                        ? `0 0 15px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`
                        : `0 2px 8px ${colors.glow}20, inset 0 1px 0 rgba(255,255,255,0.2)`,
                      border: isMostActive ? `1px solid ${colors.secondary}` : 'none',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(widthPercentage, 5)}%` }}
                    transition={{ delay: 0.8 + index * 0.05, duration: 0.8, type: 'spring', bounce: 0.3 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                        repeatDelay: 1,
                      }}
                    />

                    {/* Count inside bar */}
                    {widthPercentage > 15 && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-black">
                        {month.count}
                      </div>
                    )}
                  </motion.div>

                  {/* Count outside bar if too small */}
                  {widthPercentage <= 15 && month.count > 0 && (
                    <div
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-black"
                      style={{ color: colors.primary }}
                    >
                      {month.count}
                    </div>
                  )}
                </div>

                {/* Distance */}
                <div className="w-14 text-left">
                  <span className="text-xs text-gray-500 font-medium">
                    {Math.round(month.totalDistance)}km
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Most active month highlight */}
        <motion.div
          initial={{ scale: 0, rotateY: -90 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: 1.8, duration: 1, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm"
        >
          <div
            className="p-4 rounded-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${getSeasonalColor(mostActiveMonth.monthNumber).glow}90 0%, rgba(0,0,0,0.4) 100%)`,
              border: `2px solid ${getSeasonalColor(mostActiveMonth.monthNumber).primary}`,
              boxShadow: `0 8px 30px ${getSeasonalColor(mostActiveMonth.monthNumber).glow}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
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
                className="text-lg font-black mb-1"
                style={{
                  color: getSeasonalColor(mostActiveMonth.monthNumber).primary,
                  textShadow: `0 2px 20px ${getSeasonalColor(mostActiveMonth.monthNumber).glow}`,
                }}
              >
                {mostActiveMonth.month}
              </div>
              <div className="text-xs text-gray-300 font-medium">
                {t('slide.chronosMonth.mostActive')}: {mostActiveMonth.count} {t('common.activities')} • {Math.round(mostActiveMonth.totalDistance)} {t('common.km')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom right indicator */}
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
            {t('common.tapToContinue')}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
