'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileArchive, AlertCircle, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = async (file: File): Promise<boolean> => {
    // Check if file is a ZIP
    if (!file.name.endsWith('.zip')) {
      setError(t('upload.error.zipOnly'));
      return false;
    }

    // Check file size (max 2GB for ZIP - generous limit for large exports)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError(t('upload.error.tooLarge'));
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (await validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (await validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-strava-dark via-strava-anthracite to-strava-dark relative">
      {/* Language selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="absolute top-6 right-6 flex gap-2"
      >
        <motion.button
          onClick={() => setLanguage('fr')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            language === 'fr'
              ? 'bg-strava-orange text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🇫🇷 FR
        </motion.button>
        <motion.button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            language === 'en'
              ? 'bg-strava-orange text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🇬🇧 EN
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-bold mb-4"
          >
            <span className="text-gradient-orange">{t('upload.title').split(' ')[0]}</span>{' '}
            <span className="text-white">{t('upload.title').split(' ')[1]}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-base mb-2"
          >
            {t('upload.subtitle')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 text-sm italic max-w-sm mx-auto"
          >
            {t('upload.humor')}
          </motion.p>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center
            transition-all duration-300 cursor-pointer
            ${
              isDragging
                ? 'border-strava-orange bg-strava-orange/10 scale-105'
                : 'border-strava-gray hover:border-strava-orange/50 hover:bg-strava-orange/5'
            }
            ${isValidating ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input
            type="file"
            accept=".zip"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
            disabled={isValidating}
          />

          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                y: isDragging ? -10 : 0,
                scale: isDragging ? 1.1 : 1,
                rotate: isValidating ? 360 : 0,
              }}
              transition={{
                duration: isValidating ? 1 : 0.2,
                repeat: isValidating ? Infinity : 0,
                ease: isValidating ? "linear" : "easeOut"
              }}
            >
              {isDragging || isValidating ? (
                <Upload
                  className={`w-16 h-16 mb-4 ${
                    isDragging ? 'text-strava-orange' : 'text-strava-gray'
                  }`}
                />
              ) : (
                <FileArchive className="w-16 h-16 mb-4 text-strava-gray" />
              )}
            </motion.div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {isValidating ? t('upload.processing') : t('upload.dropzone')}
            </h3>
            <p className="text-gray-400 mb-4">
              {isValidating ? t('upload.pleaseWait') : t('upload.instruction')}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileArchive className="w-4 h-4" />
              <span>{t('upload.fileType')}</span>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p className="mb-3 font-semibold text-gray-400">{t('tutorial.howTo')}</p>
          <ol className="text-left space-y-2 max-w-sm mx-auto">
            <li className="flex gap-2">
              <span className="text-strava-orange font-semibold min-w-[20px]">1.</span>
              <span>
                {t('tutorial.step1')}{' '}
                <a
                  href="https://www.strava.com/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-strava-orange hover:underline"
                >
                  Strava.com/account
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-strava-orange font-semibold min-w-[20px]">2.</span>
              <span>
                {t('tutorial.step2')}{' '}
                <a
                  href="https://www.strava.com/athlete/delete_your_account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-strava-orange hover:underline"
                >
                  {t('tutorial.step2Link')}
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-strava-orange font-semibold min-w-[20px]">3.</span>
              <span>{t('tutorial.step3')}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-strava-orange font-semibold min-w-[20px]">4.</span>
              <span>{t('tutorial.step4')}</span>
            </li>
          </ol>
          <p className="mt-4 text-xs text-gray-600">
            {t('upload.privacy')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
