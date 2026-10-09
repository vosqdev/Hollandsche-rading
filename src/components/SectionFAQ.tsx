import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    q: 'Is er al een besluit genomen over woningbouw op deze locatie?',
    a: 'Nee, pertinent niet. Er is géén besluit genomen over woningbouw en er ligt géén kant-en-klaar plan. Dit traject betreft een open gebiedsverkenning om gezamenlijk met inwoners en belanghebbenden te onderzoeken of, en zo ja onder welke strikte landschappelijke en verkeerskundige randvoorwaarden, een ontwikkeling hier passend zou kunnen zijn.',
  },
  {
    q: 'Wie is de initiatiefnemer van deze verkenning?',
    a: 'De gebiedsverkenning wordt uitgevoerd in nauwe afstemming met de betrokken grondeigenaren, stedenbouwkundigen en de gemeente De Bilt. Doel is om ruimtelijke kwaliteit en dorpsbehoeften centraal te stellen vóórdat er formele procedures worden gestart.',
  },
  {
    q: 'Wat gebeurt er concreet met mijn reactie en ideeën?',
    a: 'Elke stem op prioriteiten, geplaatst idee op de kaart en tekstuele reactie wordt geregistreerd in het openbare participatiedossier. Een onafhankelijk participatieteam bundelt dit in een openbaar participatieverslag dat direct wordt overhandigd aan het college en de gemeenteraad van De Bilt.',
  },
  {
    q: 'Waarom wordt juist naar dit gebied ten oosten van de Tolakkerweg gekeken?',
    a: 'Het gebied bevindt zich op loop- en fietsafstand van Station Hollandsche Rading (hoogwaardig openbaar vervoer richting Hilversum en Utrecht) en sluit aan op de bestaande dorpskern. Tegelijk vormt het de kwetsbare overgang naar het open weidelandschap en de bosgebieden, wat vraagt om uiterst zorgvuldige verkenning.',
  },
  {
    q: 'Hoe verhoudt dit zich tot de natuur en het Utrechts Landschap?',
    a: 'Behoud en versterking van ecologische verbindingen staat voorop. Onderzocht wordt hoe een eventuele ontwikkeling juist kan bijdragen aan substantiële natuurontwikkeling, herstel van houtwallen en een robuuste groene buffer tussen dorp, spoor en A27.',
  },
  {
    q: 'Hoe zit het met de verkeersveiligheid op de Tolakkerweg (N417)?',
    a: 'Verkeersveiligheid en leefbaarheid langs de N417 zijn absolute randvoorwaarden. Er kan pas sprake zijn van verdere plannen als aantoonbaar vaststaat dat verkeersdruk niet onevenredig toeneemt en veilige oversteekpunten voor fietsers en voetgangers worden gerealiseerd.',
  },
];

export const SectionFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-36 bg-[#F4F0E8] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
            10 / Veelgestelde Vragen
          </span>
          <h2
            className="font-light tracking-tight text-[#1A1D1A] leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
          >
            Duidelijkheid over het traject.
          </h2>
          <p className="text-sm sm:text-base text-[#5A6059] font-light mt-3">
            Antwoorden op veelgestelde vragen over de status van de verkenning, de participatieprocedure en de besluitvorming.
          </p>
        </div>

        <div className="max-w-4xl space-y-3">
          {FAQ_LIST.map((item, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                className="border border-[#D5CDC0] rounded-xl bg-[#FBF9F5] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-[#1A1D1A] text-base hover:text-[#3D5A45] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 text-[#8C7B6B] ${
                      isOpen ? 'rotate-180 text-[#3D5A45]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#4A4F49] font-light leading-relaxed border-t border-[#E2DDD2]/60 pt-4">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-[#EAE4D7]/70 border border-[#D5CDC0] max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D5A45] text-white flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1A1D1A]">Staat je vraag er niet tussen?</h4>
              <p className="text-xs text-[#5A6059]">Stel je vraag direct via het contactformulier onderaan of stuur een e-mail.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl bg-[#1A1D1A] hover:bg-[#3D5A45] text-white text-xs font-semibold transition-colors shrink-0"
          >
            Stel een vraag
          </a>
        </div>
      </div>
    </section>
  );
};
