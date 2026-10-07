import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Home, Trees, ShieldAlert, Droplets, Leaf, Zap, ArrowRight } from 'lucide-react';

interface OpgaveItem {
  id: string;
  word: string;
  question: string;
  icon: React.ElementType;
  context: string;
  bgTone: string;
  accent: string;
}

const OPGAVEN: OpgaveItem[] = [
  {
    id: 'wonen',
    word: 'WONEN',
    question: 'Welke woningen heeft het dorp nodig?',
    icon: Home,
    context: 'Niet de aantallen staan voorop, maar de lokale behoefte. Hoe zorgen we voor doorstroming van senioren naar passende hofjes en betaalbare kansen voor jonge starters uit Hollandsche Rading?',
    bgTone: 'bg-[#F4F0E8]',
    accent: 'text-[#3D5A45]',
  },
  {
    id: 'landschap',
    word: 'LANDSCHAP',
    question: 'Hoe kan ontwikkeling bijdragen aan een mooiere dorpsrand?',
    icon: Trees,
    context: 'De overgang tussen de Tolakkerweg en de open polder is nu rafelig. Een zorgvuldige inpassing kan de dorpsentree versterken en cultuurhistorische zichtlijnen juist herstellen.',
    bgTone: 'bg-[#EAE4D7]',
    accent: 'text-[#2C4030]',
  },
  {
    id: 'verkeer',
    word: 'VERKEER',
    question: 'Hoe houden we de Tolakkerweg en omgeving veilig?',
    icon: ShieldAlert,
    context: 'De N417 is een drukke verkeersader met hoge rijsnelheden. Extra verkeersdruk is onwenselijk; een oplossing moet juist bijdragen aan veiligere kruisingen en snelle fietsroutes naar het station.',
    bgTone: 'bg-[#E3DBD0]',
    accent: 'text-[#432838]',
  },
  {
    id: 'water',
    word: 'WATER',
    question: 'Hoe kunnen waterberging en klimaatadaptatie onderdeel worden van het gebied?',
    icon: Droplets,
    context: 'Met veranderende weerpatronen en hoge kweldruk in het veen is robuuste waterretentie cruciaal. Wadi’s en ecologische watergangen kunnen het gebied klimaatbestendig maken.',
    bgTone: 'bg-[#E8EDE9]',
    accent: 'text-[#2E5C6E]',
  },
  {
    id: 'natuur',
    word: 'NATUUR',
    question: 'Kan ontwikkeling juist leiden tot meer biodiversiteit en landschappelijke kwaliteit?',
    icon: Leaf,
    context: 'Kan een verkenning kansen bieden om verarmde weidegronden om te vormen naar biodiverse bosranden, houtwallen en bloemrijke akkerranden die aansluiten op het Utrechts Landschap?',
    bgTone: 'bg-[#E2EBE4]',
    accent: 'text-[#3D5A45]',
  },
  {
    id: 'energie',
    word: 'ENERGIE',
    question: 'Hoe ontwikkelen we een gebied met een beperkte energiepiek en zo weinig mogelijk belasting van het elektriciteitsnet?',
    icon: Zap,
    context: 'Netcongestie speelt overal in Utrecht. Een toekomstige dorpsrand moet slim ontworpen worden: lokaal opwekken, slim bufferen en minimale belasting van het stroomnet.',
    bgTone: 'bg-[#EBE7E1]',
    accent: 'text-[#B87A2B]',
  },
];

export const SectionStorySequence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section id="waarom-deze-verkenning" className="relative py-24 md:py-36 bg-[#1A1D1A] text-[#FBF9F5] overflow-hidden">
      {/* Background Image with atmospheric dark overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url('https://www.image2url.com/r2/default/images/1789668518272-2e4e0ef6-ba39-4901-812b-2c070bc68258.jpg')`,
            opacity: 0.52,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1D1A]/75 via-[#1A1D1A]/50 to-[#1A1D1A]/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1A1D1A]/30 to-[#1A1D1A]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Intro */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
            02 / Waarom deze verkenning?
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#FBF9F5] leading-tight">
            Zes thema’s die bepalen wat er
            <span className="font-editorial italic font-normal text-[#E7E1D6]"> werkelijk toe doet.</span>
          </h2>
          <p className="mt-6 text-[#A39182] text-base sm:text-lg leading-relaxed font-light">
            We starten niet met plattegronden of blokken, maar met fundamentele vragen. Selecteer een opgave om de context te verkennen.
          </p>
        </div>

        {/* Studio Foundry Style Interactive Sequence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Giant Words List */}
          <div className="lg:col-span-5 flex flex-col space-y-2 sm:space-y-3">
            {OPGAVEN.map((item, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(index)}
                  className={`group text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between border ${
                    isActive
                      ? 'bg-[#252925] border-[#3D5A45] shadow-lg text-[#FBF9F5]'
                      : 'bg-transparent border-transparent text-[#8C7B6B] hover:text-[#D5CDC0] hover:bg-[#202320]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono-subtle text-[#6B655D]">
                      0{index + 1}
                    </span>
                    <span
                      className={`text-2xl sm:text-3xl md:text-4xl font-light tracking-tight transition-transform ${
                        isActive ? 'font-medium tracking-wide translate-x-1 text-[#FBF9F5]' : ''
                      }`}
                    >
                      {item.word}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-x-0 text-[#85A38C]' : 'opacity-0 -translate-x-2'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Rich Editorial Content Card */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#242824] border border-[#3A403A] rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#3A403A] pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1A1D1A] border border-[#3A403A]">
                    {React.createElement(OPGAVEN[activeTab].icon, {
                      className: 'w-5 h-5 text-[#85A38C]',
                    })}
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-mono-subtle text-[#8C7B6B]">
                    Opgave 0{activeTab + 1}
                  </span>
                </div>
                <span className="text-xs font-mono-subtle text-[#8C7B6B]">
                  Hollandsche Rading
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-[#FBF9F5] leading-snug mb-6">
                {OPGAVEN[activeTab].question}
              </h3>

              <p className="text-[#D5CDC0] text-base sm:text-lg font-light leading-relaxed mb-8">
                {OPGAVEN[activeTab].context}
              </p>

              <div className="pt-6 border-t border-[#3A403A] flex flex-wrap items-center justify-between gap-4 text-xs font-mono-subtle text-[#8C7B6B]">
                <span>Inbreng inwoners in fase 1 weegt mee</span>
                <a
                  href="#participatie"
                  className="inline-flex items-center gap-1.5 text-[#85A38C] hover:text-[#FBF9F5] transition-colors"
                >
                  <span>Geef jouw mening over dit thema</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
