import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Lock,
  Cookie,
  AlertCircle,
  CheckCircle2,
  Mail,
  Printer,
  Sliders,
  Scale,
  Code2,
  Sparkles,
} from 'lucide-react';
import { store } from '../../services/store';

export type LegalTab = 'privacy' | 'cookies' | 'disclaimer';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(true);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    const consent = store.getCookieConsent();
    if (consent) {
      setAnalyticsConsent(consent.analytics);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCookiePreferences = () => {
    store.setCookieConsent(analyticsConsent);
    setSavedFeedback('Jouw voorkeuren zijn direct opgeslagen.');
    setTimeout(() => setSavedFeedback(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#FBF9F5] text-[#1A1D1A] rounded-2xl sm:rounded-3xl border border-[#D5CDC0] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#E2DDD2] bg-[#F4F0E8]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D5A45] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-subtle uppercase tracking-widest text-[#736B63] font-semibold">
                  Transparant &amp; Toegankelijk
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E3ECE5] text-[#2C4030] font-mono-subtle font-medium border border-[#C5D5C8]">
                  Privacy &amp; Voorwaarden
                </span>
              </div>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-[#1A1D1A]">
                Privacy, Cookies &amp; Disclaimer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5CDC0] text-xs text-[#555] hover:text-[#1A1D1A] hover:bg-[#EAE4D7] transition-colors"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printen</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#555] hover:text-[#1A1D1A] hover:bg-[#EAE4D7] transition-colors"
              aria-label="Sluit dialoogvenster"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E2DDD2] px-6 sm:px-8 bg-[#F4F0E8]/40 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-[#3D5A45] text-[#1A1D1A] font-semibold bg-[#FBF9F5]'
                : 'border-transparent text-[#736B63] hover:text-[#1A1D1A]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#3D5A45]" />
            <span>Privacyverklaring</span>
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cookies'
                ? 'border-[#3D5A45] text-[#1A1D1A] font-semibold bg-[#FBF9F5]'
                : 'border-transparent text-[#736B63] hover:text-[#1A1D1A]'
            }`}
          >
            <Cookie className="w-3.5 h-3.5 text-[#3D5A45]" />
            <span>Cookies &amp; Voorkeuren</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'border-[#3D5A45] text-[#1A1D1A] font-semibold bg-[#FBF9F5]'
                : 'border-transparent text-[#736B63] hover:text-[#1A1D1A]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#3D5A45]" />
            <span>Disclaimer &amp; Spelregels</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm text-[#4A4F49] leading-relaxed">
          {/* TAB 1: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Creator & Contact Banner */}
              <div className="p-4 rounded-xl bg-[#EBE4D5]/80 border border-[#D5CDC0] text-xs text-[#2C4030] flex items-start gap-3">
                <Code2 className="w-5 h-5 text-[#3D5A45] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-[#1A1D1A]">
                    Website ontwikkeld door Vovon Development
                  </p>
                  <p>
                    Deze participatiewebsite voor de gebiedsverkenning Dorpsrand Hollandsche Rading is ontworpen en gebouwd door <strong>Vovon Development</strong>. Heb je vragen over de werking van de website, suggesties of wil je gegevens laten aanpassen? Stuur gerust een bericht naar{' '}
                    <a href="mailto:info@vovon.nl" className="text-[#3D5A45] underline font-semibold hover:text-[#1A1D1A]">
                      info@vovon.nl
                    </a>.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Heldere en eerlijke omgang met jouw gegevens
                </h3>
                <p>
                  Wij vinden jouw privacy belangrijk. We verzamelen en verwerken daarom alleen de gegevens die strikt nodig zijn om jou te informeren en om samen na te denken over de toekomst van de dorpsrand. Geen onnodige juridische taal: hieronder lees je precies wat we doen, waarom we dat doen en wat jouw rechten zijn.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Welke gegevens verzamelen we en waarom?
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Nieuwsbrief:</strong> Als je je aanmeldt, bewaren we je e-mailadres en of je inwoner of geïnteresseerde bent. We gebruiken dit uitsluitend om je op de hoogte te houden van bijeenkomsten en tussenstanden. Je kunt je met één klik op elk gewenst moment weer uitschrijven.
                  </li>
                  <li>
                    <strong>Vragen via het contactformulier:</strong> Als je ons een vraag stelt, noteren we je naam (optioneel), e-mailadres en je bericht, zodat we je een passend antwoord kunnen geven.
                  </li>
                  <li>
                    <strong>Interactieve kaart &amp; peilingen:</strong> Wanneer je een prikker met een suggestie of idee op de kaart plaatst of deelneemt aan een dorpspeiling, wordt je reactie anoniem verwerkt om een representatief beeld van het dorp te krijgen. We raden je aan geen persoonlijke gegevens (zoals privégegevens of gevoelige details) in openbare reacties te zetten.
                  </li>
                  <li>
                    <strong>Veiligheid &amp; betrouwbaarheid van stemmen:</strong> Om te voorkomen dat geautomatiseerde programma's (bots) stemmen manipuleren of dat iemand per ongeluk tien keer achter elkaar stemt, slaat de website een tijdelijke anonieme controlewaarde op in je eigen browser.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Geen verkoop aan derden &amp; veilige opslag
                </h3>
                <p>
                  Wij verkopen jouw gegevens <strong>nooit</strong> aan derden en gebruiken ze niet voor reclame. De gegevens worden veilig opgeslagen binnen gecertificeerde Europese datacenters die voldoen aan strenge beveiligingsnormen.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Hoe lang bewaren we jouw gegevens?
                </h3>
                <p>
                  Niet langer dan nodig voor het project:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Nieuwsbriefaanmeldingen blijven bewaard tot je je uitschrijft of tot afronding van de gebiedsverkenning.</li>
                  <li>Contactvragen worden bewaard totdat je vraag volledig is beantwoord.</li>
                  <li>Peilingen en ideeën op de kaart worden anoniem gebundeld in het eindrapport voor de dorpsdialoog en de gemeenteraad.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Jouw rechten
                </h3>
                <p>
                  Jij hebt altijd het recht om te zien welke gegevens we van je hebben, deze te laten corrigeren of direct te laten wissen. Wil je je gegevens laten verwijderen of heb je een vraag? Stuur een e-mail naar{' '}
                  <a href="mailto:info@vovon.nl" className="text-[#3D5A45] underline font-medium">
                    info@vovon.nl
                  </a>{' '}
                  en we regelen het direct voor je.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#EBE4D5]/80 border border-[#D5CDC0] text-xs text-[#2C4030]">
                <p>
                  <strong>Geen tracking- of advertentiecookies:</strong> Wij houden van een rustige en privacyvriendelijke website. Wij plaatsen géén advertentiecookies en géén volg-software van commerciële netwerken.
                </p>
              </div>

              {/* Preferences Switcher */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5CDC0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#3D5A45]" />
                    <h3 className="font-bold text-base text-[#1A1D1A]">
                      Jouw instellingen aanpassen
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono-subtle text-[#736B63]">
                    Direct aanpasbaar
                  </span>
                </div>

                {/* 1. Noodzakelijk */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1A1D1A]">1. Noodzakelijk voor de werking</span>
                      <span className="text-[10px] font-mono-subtle uppercase px-2 py-0.5 rounded bg-[#3D5A45] text-white">
                        Altijd Actief
                      </span>
                    </div>
                    <p className="text-xs text-[#736B63]">
                      Zorgt dat de kaart goed opstart, dat jouw gemaakte keuzes niet verloren gaan en voorkomt dat er per ongeluk dubbel wordt gestemd. Dit wordt veilig opgeslagen in jouw eigen browser.
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 accent-[#3D5A45] cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>

                {/* 2. Anonieme statistieken */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1A1D1A]">2. Anonieme statistieken</span>
                      <span className="text-[10px] font-mono-subtle uppercase px-2 py-0.5 rounded bg-[#EAE4D7] text-[#2C4030] border border-[#D5CDC0]">
                        Optioneel
                      </span>
                    </div>
                    <p className="text-xs text-[#736B63]">
                      Helpt het projectteam te zien welke onderdelen (zoals de verschillende denkrichtingen of de interactieve kaart) veel bekeken worden. Geheel anoniem en zonder profielen.
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analyticsConsent}
                        onChange={(e) => setAnalyticsConsent(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#D5CDC0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D5CDC0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3D5A45]"></div>
                    </label>
                  </div>
                </div>

                {/* Save button & notification */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-[#3D5A45] font-medium">
                    {savedFeedback && (
                      <span className="flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-[#3D5A45]" />
                        <span>{savedFeedback}</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSaveCookiePreferences}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1A1D1A] hover:bg-[#3D5A45] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#85A38C]" />
                    <span>Voorkeuren Opslaan</span>
                  </button>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-[#1A1D1A]">
                  Wat wordt er in je browser opgeslagen?
                </h3>
                <p className="text-xs text-[#736B63]">
                  We slaan alleen een paar kleine instellingen lokaal op je eigen apparaat op:
                </p>
                <div className="border border-[#E2DDD2] rounded-xl overflow-hidden bg-white text-xs">
                  <div className="grid grid-cols-12 bg-[#F4F0E8] p-2.5 font-semibold text-[#1A1D1A] border-b border-[#E2DDD2]">
                    <span className="col-span-5">Sleutel</span>
                    <span className="col-span-7">Doel</span>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 border-b border-[#F0EBE1]">
                    <span className="col-span-5 font-mono text-[11px] text-[#3D5A45]">hdr_cookie_consent</span>
                    <span className="col-span-7">Onthoudt jouw keuze over statistieken zodat je de melding niet steeds opnieuw krijgt.</span>
                  </div>
                  <div className="grid grid-cols-12 p-2.5">
                    <span className="col-span-5 font-mono text-[11px] text-[#3D5A45]">hdr_participant</span>
                    <span className="col-span-7">Houdt bij aan welke vragenlijsten je hebt meegedaan om dubbele invoer te voorkomen.</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#F2EDE4] border border-[#D5CDC0] text-xs text-[#2C4030] flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-[#3D5A45] shrink-0 mt-0.5" />
                <p>
                  <strong>Verkennende fase:</strong> Dit platform dient ter oriëntatie en gedachtevorming (Fase 1: Luisteren &amp; Verkennen). Alle beelden, kaarten en scenario's zijn bedoeld als vertrekpunt voor het dorpsgesprek.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Geen rechten ontleenbaar
                </h3>
                <p>
                  Aan de informatie, denkrichtingen, impressies, woningmarktcijfers en kaarten op deze website kunnen <strong>geen rechten</strong> worden ontleend. Er zijn nog geen besluiten genomen over eventuele woningbouw, exacte aantallen of kavels. De formele besluiten over het vervolg worden te zijner tijd door de gemeenteraad van De Bilt genomen.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Zorgvuldigheid
                </h3>
                <p>
                  Vovon Development en het projectteam besteden grote zorg aan de nauwkeurigheid en betrouwbaarheid van alle getoonde informatie. Desondanks kan er soms een foutje of verouderde informatie op de website staan. We zijn niet aansprakelijk voor eventuele directe of indirecte gevolgen hiervan. Zie je iets dat niet klopt of beter kan? Laat het ons weten via{' '}
                  <a href="mailto:info@vovon.nl" className="text-[#3D5A45] underline font-semibold">
                    info@vovon.nl
                  </a>.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Spelregels voor meedenken &amp; reacties
                </h3>
                <p>
                  Dit platform is bedoeld voor een open, eerlijke en opbouwende dorpsdialoog. Om het voor iedereen prettig en veilig te houden, vragen we je rekening te houden met de volgende spelregels:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#555]">
                  <li>Blijf respectvol naar mede-dorpsbewoners, ondernemers en ambtenaren.</li>
                  <li>Plaats geen kwetsende, discriminerende of persoonlijke aanvallen.</li>
                  <li>Plaats geen commerciële reclame of spam.</li>
                </ul>
                <p className="text-xs text-[#736B63] pt-1">
                  Reacties die deze basisregels overschrijden kunnen door de beheerders worden verwijderd.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1D1A]">
                  Realisatie &amp; Contact
                </h3>
                <p>
                  Deze website is met zorg ontwikkeld door <strong>Vovon Development</strong>. Heb je technische vragen, feedback over het platform of opmerkingen over de gegevensverwerking? Neem gerust contact op via{' '}
                  <a href="mailto:info@vovon.nl" className="text-[#3D5A45] underline font-semibold">
                    info@vovon.nl
                  </a>.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 sm:px-8 py-4 border-t border-[#E2DDD2] bg-[#F4F0E8]/70 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#736B63]">
            <Code2 className="w-3.5 h-3.5 text-[#3D5A45]" />
            <span>Gemaakt door Vovon Development • Contact: <a href="mailto:info@vovon.nl" className="text-[#3D5A45] underline">info@vovon.nl</a></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#3D5A45] hover:bg-[#2C4030] text-white font-medium transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
