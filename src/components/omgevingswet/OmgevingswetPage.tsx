import React, { useState } from 'react';
import {
  ArrowLeft,
  Video,
  ExternalLink,
  Play,
  CheckCircle2,
  Info,
  Layers,
  Scale,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface OmgevingswetPageProps {
  onBack: () => void;
  onNavigateToParticipatie?: () => void;
}

interface ParticipatieLevel {
  level: number;
  title: string;
  shortTitle: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  inHollandscheRading: string;
  statusText?: string;
  isCurrent?: boolean;
}

const PARTICIPATIE_LEVELS: ParticipatieLevel[] = [
  {
    level: 1,
    title: '1. Informeren',
    shortTitle: 'Informeren',
    badgeBg: 'bg-[#2A312B]',
    badgeText: 'text-[#D5CDC0]',
    description:
      'De gemeente of ontwikkelaar verschaft tijdige, objectieve informatie over plannen, wetgeving en randvoorwaarden zonder directe invloed.',
    inHollandscheRading:
      'De openbare projectwebsite, raadsinformatiebrieven, fysieke flyers in het dorp en bewonersbrieven garanderen dat iedereen op de hoogte is.',
    statusText: 'Actief (continu)',
  },
  {
    level: 2,
    title: '2. Ophalen',
    shortTitle: 'Ophalen',
    badgeBg: 'bg-[#2A312B]',
    badgeText: 'text-[#D5CDC0]',
    description:
      'Inwoners en belanghebbenden worden geraadpleegd via enquêtes en prikkerkaarten om meningen en lokale signalen in kaart te brengen.',
    inHollandscheRading:
      'Prikkerkaart met ruimtelijke ideeën, peilingen over dorpsprioriteiten, doelgroepenbehoefte en het register "Wat moet blijven".',
  },
  {
    level: 3,
    title: '3. Samen ontwerpen',
    shortTitle: 'Samen ontwerpen',
    badgeBg: 'bg-[#2A312B]',
    badgeText: 'text-[#D5CDC0]',
    description:
      'Omwonenden en experts denken mee aan ontwerptafels en dragen alternatieven aan. De projectgroep motiveert wat wordt overgenomen.',
    inHollandscheRading:
      'Dorpsateliers en ontwerpsessies waarin inwoners samen met stedenbouwkundigen en landschapsarchitecten scenario’s schetsen.',
  },
  {
    level: 4,
    title: '4. Optimaliseren',
    shortTitle: 'Optimaliseren',
    badgeBg: 'bg-[#2A312B]',
    badgeText: 'text-[#D5CDC0]',
    description:
      'Inwoners, ondernemers en ontwikkelaars werken als partners aan een gezamenlijk programma van eisen of deelontwerp binnen vastgestelde kaders.',
    inHollandscheRading:
      'Afstemming van verkeersmaatregelen op de N417, groenbuffers naar het polderlandschap en exacte afstanden tot bestaande percelen.',
    statusText: 'Fase 4 & 5 (Najaar 2026 / 2027)',
  },
  {
    level: 5,
    title: '5. Terugkoppelen',
    shortTitle: 'Terugkoppelen',
    badgeBg: 'bg-[#2A312B]',
    badgeText: 'text-[#D5CDC0]',
    description:
      'De initiatiefnemer en gemeente verbinden zich aan uitkomsten van de participatie binnen de vooraf gestelde kaders van de gemeenteraad.',
    inHollandscheRading:
      'Het openbare participatieverslag met de motiveringsplicht wordt overhandigd aan de gemeenteraad van De Bilt bij de besluitvorming.',
    statusText: 'Fase 6 (Zomer 2027)',
  },
  {
    level: 6,
    title: '6. Blijven betrekken',
    shortTitle: 'Blijven betrekken',
    badgeBg: 'bg-[#2A312B]',
    badgeText: 'text-[#D5CDC0]',
    description:
      'De regie ligt primair bij de bewoners of wijkcoöperatie (bijv. CPO of buurtgroen). De overheid en ontwikkelaar faciliteren en borgen.',
    inHollandscheRading:
      'Mogelijke vormen van collectief particulier opdrachtgeverschap (CPO), gezamenlijk natuurbeheer van houtwallen en dorpsgroen.',
    statusText: 'Realisatie- en beheerfase',
  },
];

export const OmgevingswetPage: React.FC<OmgevingswetPageProps> = ({
  onBack,
  onNavigateToParticipatie,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeLevel, setActiveLevel] = useState<number>(3);

  // Official Omgevingswet animation on YouTube (Digitaal Stelsel Omgevingswet LV / DSO-LV)
  const YOUTUBE_VIDEO_ID = 'Svl4T40_yWk';
  const YOUTUBE_URL = 'https://www.youtube.com/watch?v=Svl4T40_yWk';

  return (
    <div className="min-h-screen bg-[#0F1412] text-[#F3F4F1] selection:bg-[#3D5A45] selection:text-white font-sans antialiased">
      {/* Top sticky bar */}
      <header className="sticky top-0 z-40 bg-[#0F1412]/95 backdrop-blur-md border-b border-[#242E27] py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#A3B3A5] hover:text-white transition-colors bg-[#172019] hover:bg-[#1E2A21] px-3.5 py-2 rounded-lg border border-[#2B3B2E]"
            title="Terug naar de hoofdpagina van de gebiedsverkenning"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Terug naar gebiedsverkenning</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A261D] text-[#86EFAC] text-xs font-mono-subtle border border-[#2E4834]">
              <Scale className="w-3.5 h-3.5" />
              <span>Wettelijk Kader Omgevingswet</span>
            </span>

            {onNavigateToParticipatie && (
              <button
                onClick={onNavigateToParticipatie}
                className="text-xs px-3.5 py-2 rounded-lg bg-[#3D5A45] hover:bg-[#2F4736] text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Direct meedoen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-10 sm:space-y-14">
        {/* Header Title Section */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1B251E] border border-[#2D3E31] text-[11px] font-mono-subtle uppercase tracking-wider text-[#A7C2AB]">
            <BookOpen className="w-3 h-3 text-[#86EFAC]" />
            <span>Kennis &amp; Wettelijke Spelregels</span>
          </div>

          <h1
            className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight font-editorial"
          >
            Uitleg: Omgevingswet &amp; Participatieniveaus (Level 1 t/m 6)
          </h1>

          <p className="text-sm sm:text-base text-[#9FA89F] font-light max-w-3xl leading-relaxed">
            Hoe de gemeente De Bilt en initiatiefnemers samen met inwoners van initiatief tot realisatie bouwen binnen de kaders van de Omgevingswet.
          </p>
        </section>

        {/* Video Card Container */}
        <section className="rounded-2xl sm:rounded-3xl bg-[#161D18] border border-[#27352A] p-4 sm:p-7 shadow-2xl space-y-4">
          <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0A0E0B] border border-[#2D3C30] shadow-inner group">
            {isPlayingVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                title="Animatie Participatie volgens de Omgevingswet"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div
                className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.7)), url('https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg')`,
                }}
              >
                {/* Custom Overlay Header matching screenshot */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1F2C22] border border-[#3C5542] flex items-center justify-center p-1.5 shadow-md">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#3D5A45] to-[#84CC16] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white/90" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-sm">
                        Animatie Participatie volgens de Omgevingswet
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#A8B6A8]">
                        Digitaal Stelsel Omgevingswet LV (DSO-LV)
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-white/80">
                    <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-white/10 font-mono-subtle">
                      HD
                    </span>
                  </div>
                </div>

                {/* Big Center Play Trigger */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 hover:bg-[#3D5A45] text-white border-2 border-white/60 hover:border-white transition-all transform hover:scale-105 flex items-center justify-center shadow-xl group/btn"
                    title="Start video"
                  >
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 text-white fill-white transition-transform group-hover/btn:scale-110" />
                  </button>
                </div>

                {/* Bottom Timeline Preview bar matching screenshot */}
                <div className="space-y-3 z-10">
                  {/* Subtitle snippet banner */}
                  <div className="mx-auto max-w-xl text-center px-4 py-2 rounded-lg bg-black/75 backdrop-blur-xs border border-white/10 text-xs sm:text-sm text-[#F1F5F0] font-light">
                    "Of 't nu gaat om nieuwe plannen van de overheid, een ondernemer, van uw buren of van uzelf..."
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/80 font-mono-subtle pt-1">
                    <span>0:22 / 1:57</span>
                    <button
                      onClick={() => setIsPlayingVideo(true)}
                      className="hover:text-white underline text-xs font-sans"
                    >
                      Klik om video af te spelen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Source Link Bar (Matching screenshot style) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[#111713] border border-[#243126]">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#95A597]">
              <Video className="w-4 h-4 text-[#86EFAC]" />
              <span>Bron: YouTube • Uitleg Omgevingswet</span>
            </div>

            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#86EFAC] hover:text-white hover:underline transition-colors w-fit"
            >
              <span>Open op YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* The 6 Participatieniveaus (Grid Matching Screenshot) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#243126] pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-mono-subtle text-[#7E8E81] block mb-1">
                De Participatieladder
              </span>
              <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                Zes Niveaus van Betrokkenheid
              </h2>
            </div>
            <p className="text-xs text-[#95A597] font-light max-w-sm">
              In elke fase van de gebiedsverkenning Hollandsche Rading is vooraf helder welk participatieniveau van toepassing is.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {PARTICIPATIE_LEVELS.map((item) => {
              const isSelected = activeLevel === item.level;

              return (
                <div
                  key={item.level}
                  onClick={() => setActiveLevel(item.level)}
                  className={`rounded-2xl p-5 sm:p-6 border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#18231B] border-[#86EFAC] shadow-lg ring-1 ring-[#86EFAC]/30'
                      : 'bg-[#151D17] border-[#263529] hover:border-[#3E5543] hover:bg-[#1A241C]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {/* Number badge */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm font-mono-subtle transition-colors ${
                            isSelected
                              ? 'bg-[#3D5A45] text-white border border-[#52775C]'
                              : 'bg-[#253228] text-white border border-[#344637]'
                          }`}
                        >
                          {item.level}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#B4C0B6] font-light leading-relaxed pl-0 sm:pl-11">
                      {item.description}
                    </p>
                  </div>

                  {/* Context in Hollandsche Rading */}
                  <div className="pt-3 border-t border-[#233026] text-xs space-y-1 pl-0 sm:pl-11">
                    <div className="text-[11px] font-semibold text-[#86EFAC] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#86EFAC] shrink-0" />
                      <span>Toepassing in Hollandsche Rading:</span>
                    </div>
                    <p className="text-xs text-[#90A092] leading-snug">
                      {item.inHollandscheRading}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Wat betekent de Omgevingswet concreet voor inwoners? */}
        <section className="rounded-2xl sm:rounded-3xl bg-[#162119] border border-[#2B3E2F] p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-mono-subtle text-[#86EFAC] block">
              Wettelijke Verankering
            </span>
            <h3 className="text-xl sm:text-2xl font-light text-white font-editorial">
              De Motiveringsplicht onder de Omgevingswet
            </h3>
            <p className="text-xs sm:text-sm text-[#A2B1A4] font-light leading-relaxed">
              Sinds 1 januari 2024 stelt de Omgevingswet strikte eisen aan participatie. Dit betekent dat overheden en initiatiefnemers niet zomaar kunnen volstaan met een formaliteit:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#111A13] border border-[#253528] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#1E2E21] text-[#86EFAC] flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-white text-sm">Transparant participatieverslag</h4>
              <p className="text-[#8E9E90] leading-relaxed">
                Elke binnengekomen reactie, kaartprikker en enquête-stem wordt openbaar gerapporteerd in een participatieverslag.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111A13] border border-[#253528] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#1E2E21] text-[#86EFAC] flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-white text-sm">Motiveringsplicht</h4>
              <p className="text-[#8E9E90] leading-relaxed">
                De gemeenteraad van De Bilt moet formeel kunnen toetsen wát er met de inbreng van inwoners is gedaan en waaróm eventuele suggesties wel of niet zijn overgenomen.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111A13] border border-[#253528] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#1E2E21] text-[#86EFAC] flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-white text-sm">Gelijke kansen voor iedereen</h4>
              <p className="text-[#8E9E90] leading-relaxed">
                Zowel jong als oud, huurders en woningeigenaren, omwonenden en woningzoekenden krijgen een gelijkwaardige stem in het traject.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#253528] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#8E9E90] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#86EFAC] shrink-0" />
              <span>Gebiedsverkenning Dorpsrand Hollandsche Rading • Gemeente De Bilt</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onBack}
                className="w-full sm:w-auto text-xs px-4 py-2.5 rounded-lg bg-[#202E24] hover:bg-[#283B2D] text-white border border-[#344939] transition-colors text-center"
              >
                Terug naar proces &amp; fasering
              </button>

              {onNavigateToParticipatie && (
                <button
                  onClick={onNavigateToParticipatie}
                  className="w-full sm:w-auto text-xs px-4 py-2.5 rounded-lg bg-[#3D5A45] hover:bg-[#2C4030] text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
                >
                  <span>Deelnemen aan Fase 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#202B22] py-8 text-center text-xs text-[#6F7F72]">
        <p>© 2026 Gebiedsverkenning Dorpsrand Hollandsche Rading • Gemeente De Bilt</p>
      </footer>
    </div>
  );
};
