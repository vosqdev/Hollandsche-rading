import React, { useState } from 'react';
import { Sliders, RotateCcw, AlertCircle, CheckCircle2, Send, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveLandscapeModel } from './InteractiveLandscapeModel';
import { store } from '../services/store';

export const SectionVariantVergelijker: React.FC = () => {
  // Slider values from 0 to 100
  const [sliderLandscapeLiving, setSliderLandscapeLiving] = useState<number>(35); // 0 = 100% landschap, 100 = 100% wonen
  const [sliderScale, setSliderScale] = useState<number>(30); // 0 = zeer kleinschalig, 100 = grotere dorpsafronding
  const [sliderTypology, setSliderTypology] = useState<number>(35); // 0 = collectief hofje, 100 = individueel
  const [sliderGreenBuilding, setSliderGreenBuilding] = useState<number>(25); // 0 = groen dominant, 100 = compacte bebouwing

  // Active slider hover/drag for floating value badge
  const [activeSlider, setActiveSlider] = useState<number | null>(null);

  // Active preset tracker
  const [activePreset, setActivePreset] = useState<'A' | 'B' | 'C' | null>('B');

  // Preset tooltip hover
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  // Participation feedback state
  const [feedbackChoice, setFeedbackChoice] = useState<'ja' | 'aanpassen' | null>(null);
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleReset = () => {
    setSliderLandscapeLiving(35);
    setSliderScale(30);
    setSliderTypology(35);
    setSliderGreenBuilding(25);
    setActivePreset('B');
    setFeedbackChoice(null);
    setIsSubmitted(false);
  };

  // Presets mapping to the three study directions for instant architectural comparisons
  const applyPreset = (presetKey: 'A' | 'B' | 'C', living: number, scale: number, typology: number, green: number) => {
    setSliderLandscapeLiving(living);
    setSliderScale(scale);
    setSliderTypology(typology);
    setSliderGreenBuilding(green);
    setActivePreset(presetKey);
  };

  // Calculated spatial proportions (unified math logic)
  const calculatedLandscapePct = Math.round(
    100 - (sliderLandscapeLiving * 0.45 + sliderGreenBuilding * 0.35)
  );
  const calculatedBuildingPct = 100 - calculatedLandscapePct;

  // Qualitative architectural readings
  const getKarakterLabel = () => {
    if (sliderScale < 35) return 'Kleinschalig (erven)';
    if (sliderScale < 68) return 'Landschappelijk buurtschap';
    return 'Dorpsafronding';
  };

  const getWoonvormLabel = () => {
    if (sliderTypology < 38) return 'Collectieve hofjes';
    if (sliderTypology < 68) return 'Erven & hofjes';
    return 'Individuele kavels';
  };

  const handleOpenPreferenceModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmitPreference = (e: React.FormEvent) => {
    e.preventDefault();
    const participant = store.getParticipant();

    store.addResponse({
      participantId: participant.id,
      type: 'variant_preference',
      selectedKeys: [
        `Landschap / Wonen: ${calculatedLandscapePct}% / ${calculatedBuildingPct}%`,
        `Karakter: ${getKarakterLabel()} (schaal ${sliderScale}%)`,
        `Woonvorm: ${getWoonvormLabel()} (typologie ${sliderTypology}%)`,
        `Groen/Water: ${100 - sliderGreenBuilding}%`,
        `Keuze: ${feedbackChoice === 'ja' ? 'Ja, ongeveer passend' : feedbackChoice === 'aanpassen' ? 'Ik zou iets aanpassen' : 'Geen directe keuze'}`,
      ],
      customText: feedbackNote || `Verhouding gekozen door inwoner: ${calculatedLandscapePct}% landschap / ${calculatedBuildingPct}% bebouwd.`,
    });

    setIsSubmitted(true);
    setIsModalOpen(false);
  };

  const presetTooltips = {
    A: 'Veel open landschap, zeer beperkte bebouwing in losse volumes.',
    B: 'Kleine erven en hofjes zorgvuldig ingebed in het landschap.',
    C: 'Compactere dorpsafronding aansluitend op het bestaande dorp.',
  };

  return (
    <section id="varianten" className="py-20 md:py-32 bg-[#F4F0E8] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
            06 / Variantvergelijker
          </span>
          <h2
            className="font-light tracking-tight text-[#1A1D1A] leading-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
          >
            Verken de balans tussen
            <br />
            <span className="font-editorial italic text-[#3D5A45]">
              landschap, schaal en bebouwing.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#5A6059] font-light leading-relaxed">
            Verschuif de parameters en onderzoek in de interactieve maquette hoe verschillende stedenbouwkundige keuzes de ruimtelijke verhoudingen beïnvloeden.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-xl bg-[#EAE4D7] border border-[#D5CDC0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#4A4F49]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#3D5A45] shrink-0" />
            <span>
              <strong>Conceptuele ruimtelijke impressie:</strong> Deze visualisatie heeft geen planologische status en dient uitsluitend om gezamenlijk verhoudingen te verkennen.
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-mono-subtle text-[#3D5A45] hover:text-[#1A1D1A] flex items-center gap-1.5 shrink-0 self-start sm:self-auto underline underline-offset-4 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Herstel stand</span>
          </button>
        </div>

        {/* 37% / 63% Desktop Split for Maquette Dominance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
          {/* Left Column: Sliders & Parameters (~37%) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 bg-[#FBF9F5] p-6 sm:p-7 rounded-2xl border border-[#D5CDC0] shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2DDD2]">
              <h3 className="text-base font-semibold text-[#1A1D1A] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3D5A45]" />
                <span>Ruimtelijke Parameters</span>
              </h3>
              <span className="text-[11px] font-mono-subtle text-[#8C7B6B]">4 dimensies</span>
            </div>

            {/* Quick Direction Presets with Hover Explanations */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono-subtle text-[#8C7B6B] block">
                Denkrichting presets:
              </span>
              <div className="grid grid-cols-3 gap-2 relative">
                <button
                  type="button"
                  onClick={() => applyPreset('A', 20, 20, 25, 15)}
                  onMouseEnter={() => setHoveredPreset('A')}
                  onMouseLeave={() => setHoveredPreset(null)}
                  className={`px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all text-center border ${
                    activePreset === 'A'
                      ? 'bg-[#3D5A45] text-white border-[#3D5A45] shadow-xs'
                      : 'bg-[#F4F0E8] hover:bg-[#EAE4D7] text-[#2E3B2F] border-[#D5CDC0]'
                  }`}
                >
                  A. Landschap
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('B', 40, 45, 35, 30)}
                  onMouseEnter={() => setHoveredPreset('B')}
                  onMouseLeave={() => setHoveredPreset(null)}
                  className={`px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all text-center border ${
                    activePreset === 'B'
                      ? 'bg-[#3D5A45] text-white border-[#3D5A45] shadow-xs'
                      : 'bg-[#F4F0E8] hover:bg-[#EAE4D7] text-[#2E3B2F] border-[#D5CDC0]'
                  }`}
                >
                  B. Buurtschap
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('C', 70, 75, 65, 55)}
                  onMouseEnter={() => setHoveredPreset('C')}
                  onMouseLeave={() => setHoveredPreset(null)}
                  className={`px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all text-center border ${
                    activePreset === 'C'
                      ? 'bg-[#3D5A45] text-white border-[#3D5A45] shadow-xs'
                      : 'bg-[#F4F0E8] hover:bg-[#EAE4D7] text-[#2E3B2F] border-[#D5CDC0]'
                  }`}
                >
                  C. Afronding
                </button>
              </div>

              {/* Preset Description / Hover Tooltip */}
              <AnimatePresence>
                {hoveredPreset && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    className="p-2 rounded-lg bg-[#EAE4D7] text-[#3D5A45] text-[11px] font-light leading-snug flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>{presetTooltips[hoveredPreset as 'A' | 'B' | 'C']}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slider 1: Meer landschap <-> Meer wonen */}
            <div className="space-y-2 pt-2 relative">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#3D5A45]">Meer landschap</span>
                <span className="text-[#432838]">Meer wonen</span>
              </div>

              {/* Floating Value Indicator on interaction */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderLandscapeLiving}
                  onFocus={() => setActiveSlider(1)}
                  onBlur={() => setActiveSlider(null)}
                  onMouseEnter={() => setActiveSlider(1)}
                  onMouseLeave={() => setActiveSlider(null)}
                  onChange={(e) => {
                    setSliderLandscapeLiving(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="w-full accent-[#3D5A45] h-2.5 bg-[#E2DDD2] rounded-lg cursor-pointer transition-all"
                />

                {activeSlider === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-[#1C221D] text-[#EAE5DB] text-[10px] font-mono-subtle font-semibold shadow-md whitespace-nowrap pointer-events-none"
                    style={{ left: `calc(${sliderLandscapeLiving}% - 40px)` }}
                  >
                    {100 - sliderLandscapeLiving}% landschap • {sliderLandscapeLiving}% wonen
                  </motion.div>
                )}
              </div>

              <p className="text-[11px] text-[#7A756C] font-light">
                {sliderLandscapeLiving < 35
                  ? 'Grote open kamers, minimale bebouwde voetafdruk, behoud van weidsheid.'
                  : sliderLandscapeLiving < 70
                  ? 'Gebalanceerde verweving tussen nieuwe volumes en open groenzones.'
                  : 'Compacter woningaanbod met duidelijke dorpsstructuur en erfovergangen.'}
              </p>
            </div>

            {/* Slider 2: Zeer kleinschalig <-> Grotere dorpsafronding */}
            <div className="space-y-2 relative">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#3D5A45]">Zeer kleinschalig (erf/hof)</span>
                <span className="text-[#432838]">Grotere dorpsafronding</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderScale}
                  onFocus={() => setActiveSlider(2)}
                  onBlur={() => setActiveSlider(null)}
                  onMouseEnter={() => setActiveSlider(2)}
                  onMouseLeave={() => setActiveSlider(null)}
                  onChange={(e) => {
                    setSliderScale(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="w-full accent-[#3D5A45] h-2.5 bg-[#E2DDD2] rounded-lg cursor-pointer transition-all"
                />

                {activeSlider === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-[#1C221D] text-[#EAE5DB] text-[10px] font-mono-subtle font-semibold shadow-md whitespace-nowrap pointer-events-none"
                    style={{ left: `calc(${sliderScale}% - 40px)` }}
                  >
                    {getKarakterLabel()}
                  </motion.div>
                )}
              </div>

              <p className="text-[11px] text-[#7A756C] font-light">
                {sliderScale < 35
                  ? 'Losse schuurwoningen en kleine erven met veel lucht ertussen.'
                  : sliderScale < 70
                  ? 'Middelgrote clusters geïnspireerd op een historisch buurtschap.'
                  : 'Samenhangende dorpsrand met aaneengesloten volumes.'}
              </p>
            </div>

            {/* Slider 3: Meer collectief <-> Meer individueel */}
            <div className="space-y-2 relative">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#3D5A45]">Collectief (hofjes)</span>
                <span className="text-[#432838]">Individueel (kavels)</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderTypology}
                  onFocus={() => setActiveSlider(3)}
                  onBlur={() => setActiveSlider(null)}
                  onMouseEnter={() => setActiveSlider(3)}
                  onMouseLeave={() => setActiveSlider(null)}
                  onChange={(e) => {
                    setSliderTypology(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="w-full accent-[#3D5A45] h-2.5 bg-[#E2DDD2] rounded-lg cursor-pointer transition-all"
                />

                {activeSlider === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-[#1C221D] text-[#EAE5DB] text-[10px] font-mono-subtle font-semibold shadow-md whitespace-nowrap pointer-events-none"
                    style={{ left: `calc(${sliderTypology}% - 40px)` }}
                  >
                    {getWoonvormLabel()}
                  </motion.div>
                )}
              </div>

              <p className="text-[11px] text-[#7A756C] font-light">
                {sliderTypology < 40
                  ? 'Woningen rondom gedeelde groene boomweides en gezamenlijke schuren.'
                  : sliderTypology < 70
                  ? 'Mix van collectieve hofjes en kleinschalige particuliere erven.'
                  : 'Vrijstaande en halfvrijstaande woningen met particuliere tuinen.'}
              </p>
            </div>

            {/* Slider 4: Meer groen & water <-> Meer compacte bebouwing */}
            <div className="space-y-2 relative">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#3D5A45]">Veel groen & water</span>
                <span className="text-[#432838]">Compactere bebouwing</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderGreenBuilding}
                  onFocus={() => setActiveSlider(4)}
                  onBlur={() => setActiveSlider(null)}
                  onMouseEnter={() => setActiveSlider(4)}
                  onMouseLeave={() => setActiveSlider(null)}
                  onChange={(e) => {
                    setSliderGreenBuilding(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="w-full accent-[#3D5A45] h-2.5 bg-[#E2DDD2] rounded-lg cursor-pointer transition-all"
                />

                {activeSlider === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-[#1C221D] text-[#EAE5DB] text-[10px] font-mono-subtle font-semibold shadow-md whitespace-nowrap pointer-events-none"
                    style={{ left: `calc(${sliderGreenBuilding}% - 40px)` }}
                  >
                    {sliderGreenBuilding < 35
                      ? 'Natuurlijke waterberging & houtwallen'
                      : sliderGreenBuilding < 70
                      ? 'Ingebed in groen'
                      : 'Compacte dorpsstructuur'}
                  </motion.div>
                )}
              </div>

              <p className="text-[11px] text-[#7A756C] font-light">
                {sliderGreenBuilding < 35
                  ? 'Forse natuurlijke kwelzone, brede houtwallen en bloemrijk grasland.'
                  : sliderGreenBuilding < 70
                  ? 'Robuuste groenbuffers richting het spoor en geïntegreerde wadi.'
                  : 'Compacter groen met focus op doelmatige erfvolumes.'}
              </p>
            </div>
          </div>

          {/* Right Column: Tactile Architectural Maquette (~63%) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-[#151916] text-[#FBF9F5] p-4 sm:p-6 rounded-2xl border border-[#2A332B] shadow-2xl flex flex-col justify-between">
            {/* Header: Jouw woonhof */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3.5 border-b border-[#2A332B] mb-3.5 gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono-subtle text-[#85A38C] block mb-1 font-semibold">
                  CONCEPTUELE RUIMTELIJKE IMPRESSIE
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-[#FBF9F5] tracking-tight">
                  Jouw woonhof
                </h3>
                <p className="text-xs text-[#A9A296] font-light mt-0.5">
                  Ontdek hoe wonen, landschap, collectiviteit en water zich tot elkaar kunnen verhouden.
                </p>
                <p className="text-[11px] text-[#7A8B7C] italic font-light mt-0.5">
                  Een mogelijke ruimtelijke bouwsteen voor de dorpsrand.
                </p>
              </div>
              
              {/* Contextuele Schematische Oriëntatie */}
              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <div className="flex items-center gap-1 text-[10px] font-mono-subtle text-[#A9A092] bg-[#1B211D] px-2.5 py-1 rounded-md border border-[#2B362D]">
                  <span className="text-[#8C8578]">H. Rading</span>
                  <span className="text-[#526354]">→</span>
                  <span className="text-[#A9A092]">Dorpsrand</span>
                  <span className="text-[#526354]">→</span>
                  <span className="text-[#85A38C] font-semibold bg-[#27352A] px-1.5 py-0.5 rounded text-[9.5px]">
                    [ JOUW WOONHOF ]
                  </span>
                  <span className="text-[#526354]">→</span>
                  <span className="text-[#8C8578]">Polder</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono-subtle text-[#95B29B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#85A38C] animate-pulse"></span>
                  <span>Schaal 1 : 500 (Hofniveau)</span>
                </div>
              </div>
            </div>

            {/* Maquette Canvas: Enlarged representative courtyard */}
            <div className="relative w-full aspect-[16/10] min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] bg-[#101311] rounded-xl border border-[#273027] overflow-hidden shadow-inner flex items-center justify-center">
              <InteractiveLandscapeModel
                sliderLandscapeLiving={sliderLandscapeLiving}
                sliderScale={sliderScale}
                sliderTypology={sliderTypology}
                sliderGreenBuilding={sliderGreenBuilding}
              />
            </div>

            {/* Subtiele Legenda direct onder de maquette */}
            <div className="mt-3 py-2 px-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-subtle text-[#A9A092] border-b border-[#252E26]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#EDE4D6] border border-[#B3A596]"></span>
                  <span>Hof- & schuurwoningen</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#829F7E]"></span>
                  <span>Gedeeld hof & boomgaard</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3C5C3A]"></span>
                  <span>Houtwal & erfhagen</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A6973]"></span>
                  <span>Natuurlijke wadi</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#C2B5A2] border border-[#A89B88]"></span>
                  <span>Collectief parkeren</span>
                </span>
              </div>
              <span className="text-[10px] text-[#7A7266] italic">
                {Math.min(14, Math.max(8, Math.round(8 + (sliderLandscapeLiving / 100) * 6)))} woningen in ensemble
              </span>
            </div>

            {/* Resultaat: Eén elegante horizontale typografische regel */}
            <div className="mt-4 py-3 px-3.5 rounded-xl bg-[#1D221E] border border-[#2C362E] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm">
                <span className="text-xs uppercase tracking-wider font-mono-subtle font-bold text-[#85A38C]">
                  JOUW WOONHOF:
                </span>
                <span className="font-mono-subtle font-semibold text-[#FBF9F5]">
                  <strong className="text-[#85A38C]">{Math.min(14, Math.max(8, Math.round(8 + (sliderLandscapeLiving / 100) * 6)))} woningen</strong> rond groen hof
                </span>
                <span className="hidden sm:inline text-[#4D5A4F]">|</span>
                <span className="text-[#CFC6B8]">
                  <strong className="text-[#85A38C]">{calculatedLandscapePct}%</strong> landschap • <strong className="text-[#EDE4D6]">{calculatedBuildingPct}%</strong> bebouwd
                </span>
                <span className="hidden sm:inline text-[#4D5A4F]">|</span>
                <span className="text-[#CFC6B8]">
                  Karakter: <strong className="text-[#FBF9F5] font-medium">{getKarakterLabel()}</strong>
                </span>
                <span className="hidden sm:inline text-[#4D5A4F]">|</span>
                <span className="text-[#CFC6B8]">
                  Woonvorm: <strong className="text-[#FBF9F5] font-medium">{getWoonvormLabel()}</strong>
                </span>
              </div>
            </div>

            {/* Disclaimer onderaan */}
            <p className="text-[10.5px] text-[#6E685D] italic font-light mt-2 px-1">
              Deze impressie onderzoekt ruimtelijke principes. Het is geen verkavelingsplan en heeft geen planologische status.
            </p>

            {/* Directe Participatie Koppeling */}
            <div className="mt-5 pt-4 border-t border-[#2A332B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-[#FBF9F5]">
                  Past deze verhouding volgens jou bij Hollandsche Rading?
                </h4>
                <p className="text-[11px] text-[#8C8476] font-light mt-0.5">
                  Geef je mening en bewaar eventueel een toelichting.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackChoice('ja')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    feedbackChoice === 'ja'
                      ? 'bg-[#3D5A45] text-white border border-[#587E60]'
                      : 'bg-[#222923] text-[#D7CCBA] hover:bg-[#2C352D] border border-[#344035]'
                  }`}
                >
                  Ja, ongeveer
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackChoice('aanpassen')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    feedbackChoice === 'aanpassen'
                      ? 'bg-[#6D3838] text-white border border-[#8C4A4A]'
                      : 'bg-[#222923] text-[#D7CCBA] hover:bg-[#2C352D] border border-[#344035]'
                  }`}
                >
                  Ik zou iets aanpassen
                </button>
                <button
                  type="button"
                  onClick={handleOpenPreferenceModal}
                  className="px-3.5 py-1.5 rounded-lg bg-[#3D5A45] hover:bg-[#2F4635] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Bewaar mijn voorkeur</span>
                </button>
              </div>
            </div>

            {/* Submission confirmation banner */}
            {isSubmitted && (
              <div className="mt-4 p-3 rounded-lg bg-[#1D2620] border border-[#2D3E30] flex items-center justify-between text-xs text-[#85A38C]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Je voorkeur voor deze samenstelling is anoniem geregistreerd. Dank voor je inbreng!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-[11px] font-mono-subtle text-[#A9A296] hover:text-white underline ml-3 shrink-0"
                >
                  Aanpassen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPACT MODAL: "WAAROM PAST DIT VOLGENS JOU?" */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-[#1A1F1B] text-[#FBF9F5] rounded-2xl border border-[#364237] shadow-2xl p-6 sm:p-7 relative"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#A9A092] hover:text-white hover:bg-[#273028] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-widest font-mono-subtle text-[#85A38C] block mb-1">
                  PARTICIPATIE INBRENG
                </span>
                <h3 className="text-lg font-bold text-[#FBF9F5]">
                  Waarom past dit volgens jou?
                </h3>
                <p className="text-xs text-[#CFC6B8] font-light mt-1">
                  Je legt de volgende verhouding vast:{' '}
                  <strong className="text-[#85A38C]">{calculatedLandscapePct}% landschap</strong> en{' '}
                  <strong className="text-[#EDE4D6]">{calculatedBuildingPct}% bebouwd</strong> ({getKarakterLabel()}, {getWoonvormLabel()}).
                </p>
              </div>

              <form onSubmit={handleSubmitPreference} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#DCD4C6] mb-1.5">
                    Toelichting of suggestie (optioneel):
                  </label>
                  <textarea
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="Bijvoorbeeld: waarom deze balans goed voelt, welk type woningen (senioren, starters) nodig is, of hoe de groenzone behouden moet blijven..."
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121613] border border-[#344035] text-xs text-[#FBF9F5] focus:outline-none focus:border-[#85A38C] placeholder-[#6A6359] leading-relaxed"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#141815] border border-[#273028] text-[11px] text-[#A9A092] font-light">
                  Je reactie wordt anoniem geregistreerd binnen de open gebiedsverkenning en meegenomen in het participatierapport.
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-[#CFC6B8] hover:bg-[#252D26] transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#3D5A45] hover:bg-[#2F4635] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Verstuur mijn voorkeur</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

