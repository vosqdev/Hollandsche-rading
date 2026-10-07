import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        return prev + 20;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#1A1D1A] text-[#FBF9F5] p-8 md:p-16 pointer-events-auto"
        >
          <div className="flex justify-between items-center text-xs tracking-widest uppercase text-[#8C7B6B] font-mono-subtle">
            <span>Hollandsche Rading</span>
            <span>Gebiedsverkenning 2026</span>
          </div>

          <div className="max-w-3xl my-auto">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-sm md:text-base tracking-[0.25em] uppercase text-[#D9D2C5] mb-4"
            >
              Hollandsche Rading
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#FBF9F5] leading-none"
            >
              Een dorp in beweging.
            </motion.h1>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono-subtle text-[#8C7B6B]">
              <span>Participatieplatform geopend</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#2A2E2A] h-[2px] overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-[#E7E1D6]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
