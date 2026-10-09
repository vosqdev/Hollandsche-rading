import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Circle,
  HelpCircle,
  AlertCircle,
  Users,
  Calendar,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { store } from '../services/store';

interface SectionProcesProps {
  onOpenOmgevingswet?: () => void;
}

const PROCESS_PHASES = [
  {
    step: 1,
    title: 'Verkenning & Luisteren',
    isCurrent: true,
    isPassed: false,
    period: 'Q1 – Q2 2026',
    whatHappens:
      'Open gesprekken, dorpswandelingen, ophalen van ideeën, zorgen en waarden via deze website en dorpssessies.',
    whatNotHappens:
      'Er worden géén bouwplannen getekend, géén woningaantallen vastgesteld en géén onomkeerbare besluiten genomen.',
    howToParticipate:
      'Plaats ideeën op de kaart, geef prioriteiten aan, deel wat moet blijven, en meld je aan voor de bewonersbijeenkomsten.',
  },
  {
    step: 2,
    title: 'Synthese van de inbreng',
    isCurrent: false,
    isPassed: false,
    period: 'Zomer 2026',
    whatHappens:
      'Alle binnengekomen reacties, data van het participatieplatform en gespreksverslagen worden gebundeld in een openbaar participatieverslag.',
    whatNotHappens:
      'Er vindt nog geen selectie plaats van een definitieve denkrichting.',
    howToParticipate:
      'Het participatieverslag wordt openbaar gepubliceerd en gedeeld via de nieuwsbrief.',
  },
  {
    step: 3,
    title: 'Ruimtelijke kaders & randvoorwaarden',
    isCurrent: false,
    isPassed: false,
    period: 'Najaar 2026',
    whatHappens:
      'Toetsing van verkeersveiligheid (N417), geluidsbelasting spoor/A27, waterbergingscapaciteit en landschappelijke inpassing met experts.',
    whatNotHappens:
      'Geen geheime onderhandelingen; kaders worden afgestemd met gemeente en provincie.',
    howToParticipate:
      'Thematische verdiepingsbijeenkomsten over verkeer, natuur en water.',
  },
  {
    step: 4,
    title: 'Uitwerken van mogelijke scenario’s',
    isCurrent: false,
    isPassed: false,
    period: 'Winter 2026/2027',
    whatHappens:
      'Op basis van de participatie en technische onderzoeken worden 2 of 3 ruimtelijke scenario’s inzichtelijk gemaakt.',
    whatNotHappens:
      'Nog geen definitief plan.',
    howToParticipate:
      'Presentatie van de scenario’s tijdens een dorpsbijeenkomst in Hollandsche Rading.',
  },
  {
    step: 5,
    title: 'Tweede participatieronde',
    isCurrent: false,
    isPassed: false,
    period: 'Voorjaar 2027',
    whatHappens:
      'Inwoners kunnen gedetailleerd reageren op de uitgewerkte scenario’s en nuances aanbrengen.',
    whatNotHappens:
      'Geen voldongen feiten.',
    howToParticipate:
      'Digitale reactieronde en inloopateliers.',
  },
  {
    step: 6,
    title: 'Bestuurlijke besluitvorming',
    isCurrent: false,
    isPassed: false,
    period: 'Zomer 2027',
    whatHappens:
      'Gemeenteraad van De Bilt beoordeelt de gebiedsverkenning en weegt de inbreng van inwoners mee in een principebesluit.',
    whatNotHappens:
      'Start van de bouw; dit betreft uitsluitend planologische koersbepaling.',
    howToParticipate:
      'Inwoners kunnen inspreken tijdens openbare raadscommissies.',
  },
  {
    step: 7,
    title: 'Vervolgstappen',
    isCurrent: false,
    isPassed: false,
    period: '2028 en verder',
    whatHappens:
      'Pas als er een positief besluit ligt, volgt een eventueel formeel bestemmingsplan/omgevingsplanproces met wettelijke inspraak.',
    whatNotHappens:
      'Geen automatische uitvoering zonder verdere toetsing.',
    howToParticipate:
      'Wettelijke zienswijzen en klankbordgroepen.',
  },
];

export const SectionProces: React.FC<SectionProcesProps> = ({ onOpenOmgevingswet }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const selectedPhase = PROCESS_PHASES.find((p) => p.step === activeStep) || PROCESS_PHASES[0];

  return (
    <section id="proces" className="py-24 md:py-36 bg-[#FBF9F5] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
            06 / Proces &amp; Fasering
          </span>
          <h2
            className="font-light tracking-tight text-[#1A1D1A] leading-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
          >
            Zeven fasen naar een
            <br />
            <span className="font-editorial italic text-[#3D5A45]">
              gedragen dorpsvisie.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#5A6059] font-light">
            Transparantie vanaf dag één. Bekijk precies in welke stap we ons nu bevinden, wat er wel én wat er nadrukkelijk nog niet gebeurt.
          </p>
        </div>

        {/* Current phase indicator pill + Button to Omgevingswet Page */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#EAE4D7] border border-[#D5CDC0] text-xs text-[#2C4030] font-medium shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3D5A45] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3D5A45]" />
            </span>
            <span className="font-mono-subtle uppercase tracking-wider">
              HUIDIGE STATUS: FASE 1 • VERKENNING & LUISTEREN
            </span>
          </div>

          {onOpenOmgevingswet && (
            <button
              onClick={onOpenOmgevingswet}
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#1A1D1A] hover:bg-[#3D5A45] text-[#FBF9F5] text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md group"
              id="btn-omgevingswet-proces-header"
              title="Bekijk de uitleg over de Omgevingswet en participatieniveaus 1 t/m 6"
            >
              <Scale className="w-4 h-4 text-[#85A38C]" />
              <span>Omgevingswet &amp; Participatie (Level 1 t/m 6)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#85A38C] transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* Interactive Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-10">
          {PROCESS_PHASES.map((phase) => {
            const isSelected = activeStep === phase.step;

            return (
              <button
                key={phase.step}
                onClick={() => setActiveStep(phase.step)}
                className={`p-4 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? 'bg-[#1A1D1A] text-[#FBF9F5] border-[#1A1D1A] shadow-md'
                    : phase.isCurrent
                    ? 'bg-[#EAE4D7] border-[#3D5A45] text-[#1A1D1A] ring-1 ring-[#3D5A45]'
                    : 'bg-[#F4F0E8] border-[#D5CDC0] text-[#736B63] hover:bg-[#EAE4D7]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-subtle font-bold">
                    0{phase.step}
                  </span>
                  {phase.isCurrent && (
                    <span className="text-[10px] uppercase tracking-wider font-mono-subtle px-1.5 py-0.5 rounded-sm bg-[#3D5A45] text-white">
                      Nu
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold leading-tight line-clamp-2 block mt-2">
                    {phase.title}
                  </span>
                  <span className="text-[10px] font-mono-subtle opacity-70 block mt-1">
                    {phase.period}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Detail Card for the Selected Phase */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#242824] text-[#FBF9F5] border border-[#3A403A] rounded-2xl p-8 sm:p-12 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#3A403A] pb-6 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-mono-subtle text-[#85A38C] uppercase tracking-widest mb-1">
                <span>Fase 0{selectedPhase.step} van 07</span>
                {selectedPhase.isCurrent && (
                  <span className="px-2 py-0.5 rounded-full bg-[#3D5A45] text-white text-[10px]">
                    Actief op dit moment
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#FBF9F5]">
                {selectedPhase.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono-subtle text-[#D5CDC0] px-3 py-1.5 rounded-lg bg-[#1A1D1A]">
              <Calendar className="w-3.5 h-3.5 text-[#85A38C]" />
              <span>Verwachte periode: {selectedPhase.period}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* What happens */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono-subtle text-[#85A38C] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#85A38C]" />
                <span>Wat gebeurt er?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D5CDC0] font-light leading-relaxed">
                {selectedPhase.whatHappens}
              </p>
            </div>

            {/* What DOES NOT happen */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono-subtle text-[#E11D48] font-semibold">
                <AlertCircle className="w-4 h-4 text-[#E11D48]" />
                <span>Wat gebeurt er nog NIET?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D5CDC0] font-light leading-relaxed">
                {selectedPhase.whatNotHappens}
              </p>
            </div>

            {/* How to participate */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono-subtle text-[#60A5FA] font-semibold">
                <Users className="w-4 h-4 text-[#60A5FA]" />
                <span>Hoe doe je mee?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D5CDC0] font-light leading-relaxed">
                {selectedPhase.howToParticipate}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Omgevingswet Callout Banner */}
        {onOpenOmgevingswet && (
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-[#EAE4D7] border border-[#D5CDC0] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono-subtle text-[#3D5A45] uppercase tracking-wider font-semibold">
                <Scale className="w-4 h-4 text-[#3D5A45]" />
                <span>Wettelijk Kader &amp; Participatieniveaus</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-light text-[#1A1D1A] font-editorial">
                Hoe verhoudt dit proces zich tot de Omgevingswet?
              </h4>
              <p className="text-xs sm:text-sm text-[#5A6059] font-light leading-relaxed">
                Bekijk de animatievideo van het Digitaal Stelsel Omgevingswet (DSO-LV) en leer hoe de zes participatieniveaus (Level 1 t/m 6) worden toegepast in Hollandsche Rading.
              </p>
            </div>

            <button
              onClick={onOpenOmgevingswet}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1A1D1A] hover:bg-[#3D5A45] text-white text-xs sm:text-sm font-semibold transition-all shrink-0 shadow-md group"
              id="btn-omgevingswet-proces-card"
            >
              <span>Bekijk Omgevingswet &amp; Participatieladder</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
