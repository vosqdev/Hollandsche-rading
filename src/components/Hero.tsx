import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, BarChart3, MessageSquareCode } from 'lucide-react';

interface HeroProps {
  onWoondataClick: () => void;
  onParticipateClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onWoondataClick, onParticipateClick }) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#1A1D1A] text-[#FBF9F5]">
      {/* Background Aerial Landscape with parallax and subtle slow zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.15, opacity: 0.35 }}
          animate={{ scale: 1.02, opacity: 0.55 }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://www.image2url.com/r2/default/images/1789668156026-13974eef-c08d-4760-a952-0e448042f6ab.png')`,
          }}
        />
        {/* Subtle architectural grid line overlay and gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D1A] via-[#1A1D1A]/60 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1A1D1A]/40 to-[#1A1D1A]" />
      </div>

      {/* Top spacing */}
      <div className="relative z-10 pt-32 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#D9D2C5] font-mono-subtle border border-[#E7E1D6]/20 px-4 py-1.5 rounded-full backdrop-blur-xs bg-[#1A1D1A]/50"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A45]" />
          <span>Gebiedsverkenning ten oosten van de Tolakkerweg (N417)</span>
        </motion.div>
      </div>

      {/* Center typography: Extreme headline scale clamp(3.5rem, 9vw, 10rem) */}
      <div className="relative z-10 px-6 sm:px-12 max-w-7xl mx-auto w-full my-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-light tracking-tight text-[#FBF9F5] leading-[0.92] select-none"
            style={{ fontSize: 'clamp(3.2rem, 8.5vw, 9.5rem)' }}
          >
            DE DORPSRAND
            <br />
            <span className="font-editorial italic font-normal text-[#E7E1D6]">
              VAN MORGEN.
            </span>
          </h1>
        </motion.div>

        {/* Subtext and CTAs */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="lg:col-span-7 space-y-3 text-base sm:text-lg md:text-xl font-light text-[#D5CDC0] leading-relaxed max-w-2xl"
          >
            <p className="text-[#FBF9F5] font-medium">
              Wat heeft Hollandsche Rading nodig?
            </p>
            <p className="text-[#A39182]">
              Nog geen bouwplan. Nog geen vastgesteld aantal woningen.
              <br />
              Wel een plek. Een aantal opgaven. En vooral veel vragen.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="lg:col-span-5 flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={onParticipateClick}
              className="px-7 py-3.5 rounded-full bg-[#FBF9F5] text-[#1A1D1A] font-semibold text-sm tracking-wide hover:bg-[#E8E2D5] transition-all transform active:scale-98 flex items-center gap-2.5 shadow-lg shadow-black/20"
              id="hero-cta-participate"
            >
              <MessageSquareCode className="w-4 h-4 text-[#3D5A45]" />
              <span>Denk mee</span>
            </button>

            <button
              onClick={onWoondataClick}
              className="px-7 py-3.5 rounded-full border border-[#E7E1D6]/40 text-[#FBF9F5] font-medium text-sm tracking-wide hover:bg-[#FBF9F5]/10 transition-all backdrop-blur-xs flex items-center gap-2.5"
              id="hero-cta-woondata"
            >
              <BarChart3 className="w-4 h-4 text-[#D9D2C5]" />
              <span>Bekijk de woondata</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom ticker / metadata */}
      <div className="relative z-10 border-t border-[#E7E1D6]/15 py-5 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#8C7B6B] font-mono-subtle gap-3">
        <div className="flex items-center gap-4">
          <span>52°10'44"N 5°10'33"E</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Gemeente De Bilt / Provincie Utrecht</span>
        </div>
        <div className="flex items-center gap-2 text-[#D9D2C5]">
          <span>Scroll voor verkenning</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
