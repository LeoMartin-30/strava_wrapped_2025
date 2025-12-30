'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  className = '',
  suffix = '',
  prefix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => {
    return decimals > 0 ? latest.toFixed(decimals) : Math.round(latest);
  });

  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const timer = setTimeout(() => {
      const controls = animate(count, to, {
        duration,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(decimals > 0 ? parseFloat(latest.toFixed(decimals)) : Math.round(latest));
        },
      });

      return controls.stop;
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [to, duration, delay, count, decimals]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
