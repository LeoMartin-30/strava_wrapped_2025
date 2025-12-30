'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TapToContinueProps {
  delay?: number; // Delay in milliseconds before showing (default 15000ms = 15s)
}

export default function TapToContinue({ delay = 15000 }: TapToContinueProps) {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
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
  );
}
