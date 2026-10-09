import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trees, Layers, Building2, ChevronRight, ChevronLeft } from 'lucide-react';

interface Denkrichting {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  spatialFocus: string;
  landscapeRatio: string;
  icon: React.ElementType;
  accentBg: string;
  imageUrl: string;
  imageAlt: string;
}

const DENKRICHTINGEN: Denkrichting[] = [
  {
    id: 'richting-a',
    letter: 'A',
    title: 'LANDSCHAP',
    subtitle: 'Agrarisch-landschappelijke versterking met zeer beperkte bebouwing',
    description:
      'In deze denkrichting blijft het open polderkarakter dominant. De focus ligt op het herstellen van historische houtwallen, plas-drasoevers voor weidevogels en wandelpaden. Bebouwing is hooguit incidenteel, zoals een erfensemble dat naadloos overgaat in het groen.',
    characteristics: [
      'Grote openheid behouden naar het oosten',
      'Versterking van biodiversiteit en waterretentie',
      'Minimale toename van verkeer op de Tolakkerweg',
      'Zeer beperkte bijdrage aan de dorpswoningbehoefte',
    ],
    spatialFocus: '85% Landschap & Natuur • 15% Zachte invulling',
    landscapeRatio: 'Zeer hoog',
    icon: Trees,
    accentBg: 'from-[#2D4533] to-[#1C2C20]',
    imageUrl: 'https://www.image2url.com/r2/default/images/1789666916130-630145b5-a873-475e-a8ec-aebbee2e0fd3.png',
    imageAlt: 'Open agrarisch landschap met weiden en bomen',
  },
  {
    id: 'richting-b',
    letter: 'B',
    title: 'BUURTSCHAP',
    subtitle: 'Kleinschalig woonerf of ensemble van erven en hofjes',
    description:
      'Een compact, organisch ensemble geïnspireerd op traditionele boerenerven of hofjes. Woningen zijn geclusterd rondom gemeenschappelijke groene hoven, waardoor het omliggende landschap vrij blijft en er een sterke sociale dorpsband ontstaat voor jong en oud.',
    characteristics: [
      'Geclusterde hofjesstructuur met veel gemeenschappelijk groen',
      'Focus op senioren- en starterswoningen rond rustige erven',
      'Verkeer blijft aan de rand; autoluw binnenmilieu',
      'Duidelijke, landschappelijk ingepaste dorpsgrens',
    ],
    spatialFocus: '65% Landschap & Hoven • 35% Geclusterd wonen',
    landscapeRatio: 'Gebalanceerd',
    icon: Layers,
    accentBg: 'from-[#3A3832] to-[#24221E]',
    imageUrl: 'https://www.image2url.com/r2/default/images/1789666448302-e4eda15e-afbc-42e2-af70-463149ac14eb.jpg',
    imageAlt: 'Kleinschalige schuurwoningen ingebed in het groen',
  },
  {
    id: 'richting-c',
    letter: 'C',
    title: 'DORPSAFRONDING',
    subtitle: 'Een grotere maar compacte afronding van het dorp',
    description:
      'Een meer samenhangende dorpsuitbreiding die de overgang tussen Tolakkerweg en de spoorzone definitief vormgeeft. Dit scenario kan alleen worden overwogen indien landschappelijke inpassing, verkeersafwikkeling, geluid van de A27/spoorlijn en waterberging dit aantoonbaar kunnen dragen.',
    characteristics: [
      'Substantiële kans voor betaalbaar wonen voor het hele dorp',
      'Forse groene geluidswal/bufferzone nodig langs spoor en A27',
      'Noodzaak tot herinrichting van de kruisingen op de Tolakkerweg',
      'Maximale ruimtelijke onderbouwing vereist',
    ],
    spatialFocus: '50% Landschappelijke buffer • 50% Dorpsmilieu',
    landscapeRatio: 'Compact met randbuffer',
    icon: Building2,
    accentBg: 'from-[#3D2D38] to-[#251B22]',
    imageUrl: 'https://www.image2url.com/r2/default/images/1789666741484-5140baed-8439-44b0-80c2-3585f1614c6f.jpg',
    imageAlt: 'Dorpsafronding met aaneengesloten bebouwing en groenbuffer',
  },
];

export const SectionDenkrichtingen: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number>(0);

  return (
    <section id="denkrichtingen" className="py-24 md:py-36 bg-[#FBF9F5] border-b border-[#E2DDD2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Editorial Section Header */}
        <div className="max-w-4xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
            04 / Denkrichtingen
          </span>
          <h2
            className="font-light tracking-tight text-[#1A1D1A] leading-[1.02]"
            style={{ fontSize: 'clamp(2.4rem, 5.8vw, 5.2rem)' }}
          >
            NIET DRIE PLANNEN.
            <br />
            <span className="font-editorial italic text-[#3D5A45]">
              DRIE MANIEREN OM TE DENKEN.
            </span>
          </h2>
        </div>

        {/* Cinematic Horizontal Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {DENKRICHTINGEN.map((richting, index) => {
            const Icon = richting.icon;
            const isSelected = activeCard === index;

            return (
              <div
                key={richting.id}
                onClick={() => setActiveCard(index)}
                className={`group cursor-pointer rounded-2xl p-7 sm:p-9 transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-[#1A1D1A] text-[#FBF9F5] border-[#1A1D1A] shadow-xl ring-2 ring-[#3D5A45]/50'
                    : 'bg-[#F4F0E8] text-[#1A1D1A] border-[#D5CDC0] hover:border-[#8C7B6B] hover:bg-[#ECE6DA]'
                }`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-[#333]/20 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono-subtle px-2.5 py-1 rounded-md uppercase font-bold tracking-wider ${
                          isSelected
                            ? 'bg-[#3D5A45] text-white'
                            : 'bg-[#E2DDD2] text-[#1A1D1A]'
                        }`}
                      >
                        Richting {richting.letter}
                      </span>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#85A38C]' : 'text-[#5A6059]'}`} />
                    </div>
                    <span className={`text-xs font-mono-subtle ${isSelected ? 'text-[#8C7B6B]' : 'text-[#8C7B6B]'}`}>
                      Verkenning
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">
                    {richting.title}
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium mb-5 leading-snug ${isSelected ? 'text-[#D5CDC0]' : 'text-[#736B63]'}`}>
                    {richting.subtitle}
                  </p>

                  {/* Visual Image with percentage text at the bottom */}
                  <div
                    className={`relative h-32 sm:h-36 rounded-xl mb-6 overflow-hidden border shadow-xs ${
                      isSelected ? 'border-[#3D4D3E]' : 'border-[#D5CDC0]'
                    }`}
                  >
                    <img
                      src={richting.imageUrl}
                      alt={richting.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle gradient overlay to ensure contrast and elegance */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                    {/* ONLY the percentage texts at the bottom of the image */}
                    <div className="absolute bottom-0 inset-x-0 p-3 z-10">
                      <span className="text-[11px] sm:text-xs font-mono-subtle font-medium text-white tracking-wide block drop-shadow-xs">
                        {richting.spatialFocus}
                      </span>
                    </div>
                  </div>

                  {/* Body text */}
                  <p className={`text-xs sm:text-sm font-light leading-relaxed mb-6 ${isSelected ? 'text-[#D5CDC0]' : 'text-[#4A4F49]'}`}>
                    {richting.description}
                  </p>

                  {/* Key Characteristics */}
                  <div className="space-y-2">
                    <span className={`text-[11px] uppercase tracking-wider font-mono-subtle block ${isSelected ? 'text-[#8C7B6B]' : 'text-[#736B63]'}`}>
                      Kenmerken:
                    </span>
                    {richting.characteristics.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs leading-tight">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${isSelected ? 'bg-[#85A38C]' : 'bg-[#3D5A45]'}`} />
                        <span className={isSelected ? 'text-[#FBF9F5]' : 'text-[#333]'}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
