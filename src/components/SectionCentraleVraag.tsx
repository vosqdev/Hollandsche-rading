import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, RefreshCw } from 'lucide-react';

export const SectionCentraleVraag: React.FC = () => {
  const [toggleState, setToggleState] = useState<'maar' | 'niet'>('maar');

  return (
    <section id="centrale-vraag" className="relative min-h-[85vh] py-24 md:py-36 bg-[#FBF9F5] border-y border-[#E2DDD2] flex items-center justify-center overflow-hidden">
      {/* Architectural subtle watermark grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1A1D1A_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE4D7] text-xs font-mono-subtle text-[#4A4F49] uppercase tracking-wider mb-12">
          <HelpCircle className="w-3.5 h-3.5 text-[#3D5A45]" />
          <span>De Essentie van de Verkenning</span>
        </div>

        {/* The "NIET" clause - strike-through / de-emphasized */}
        <div className="mb-10 max-w-2xl mx-auto transition-all duration-700">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-2">
            Niet de startvraag:
          </span>
          <p className="text-lg sm:text-xl md:text-2xl text-[#8C7B6B] font-light line-through decoration-[#8C7B6B]/60 decoration-1">
            "Hoeveel woningen kunnen hier komen?"
          </p>
        </div>

        {/* Transition divider */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="w-16 h-[1px] bg-[#D5CDC0]" />
          <span className="text-xs uppercase tracking-[0.3em] font-mono-subtle text-[#3D5A45] font-semibold">
            MAAR JUIST:
          </span>
          <div className="w-16 h-[1px] bg-[#D5CDC0]" />
        </div>

        {/* The Central Question: Giant Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto my-6"
        >
          <h2
            className="font-light tracking-tight text-[#1A1D1A] leading-[1.04]"
            style={{ fontSize: 'clamp(2.4rem, 6.2vw, 5.8rem)' }}
          >
            "WAT IS EEN GOEDE
            <br />
            <span className="font-editorial italic font-normal text-[#3D5A45]">
              DORPSRAND VOOR
            </span>
            <br />
            HOLLANDSCHE RADING?"
          </h2>
        </motion.div>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-[#5A6059] font-light mt-8 leading-relaxed">
          Eerst kijken we naar het landschap, de leefbaarheid, de dorpsgemeenschap en de bereikbaarheid. Pas daarna kijken we of en hoe daar een passende invulling bij hoort.
        </p>
      </div>
    </section>
  );
};
