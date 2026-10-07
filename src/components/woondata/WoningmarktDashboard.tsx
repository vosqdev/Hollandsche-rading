import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Building2,
  TrendingUp,
  Users,
  Compass,
  LayoutDashboard,
  Home,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';
import {
  WOONDATA_KPI,
  BOUWPRODUCTIE_DATA,
  WONINGTYPEN_DATA,
  BOUWJAAR_DATA,
  GBO_OPPERVLAKTE_DATA,
  KERN_VOORRAAD_DATA,
  PLANCAPACITEIT_KERNEN,
  DEMOGRAFIE_DATA,
  BENCHMARK_DATA,
  exportVoorraaddataCsv,
  downloadCsvFile,
} from '../../data/woondataData';
import { store } from '../../services/store';

interface WoningmarktDashboardProps {
  onBack: () => void;
  onNavigateToParticipatie?: () => void;
}

type TabType =
  | 'overzicht'
  | 'typologie'
  | 'bouwproductie'
  | 'demografie'
  | 'benchmark';

export const WoningmarktDashboard: React.FC<WoningmarktDashboardProps> = ({
  onBack,
  onNavigateToParticipatie,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overzicht');
  const [hoveredGboIndex, setHoveredGboIndex] = useState<number | null>(null);
  const [activeChartYear, setActiveChartYear] = useState<number | null>(null);
  const [isWoonwensModalOpen, setIsWoonwensModalOpen] = useState(false);
  const [woonwensSuccess, setWoonwensSuccess] = useState(false);

  // Woonwens form state
  const [woonwensForm, setWoonwensForm] = useState({
    naam: '',
    email: '',
    doelgroep: 'Starter',
    woningtype: 'Compacte beneden-/bovenwoning of hofwoning',
    prijsklasse: 'Betaalbare koop (< € 390.000)',
    toelichting: '',
  });

  const handleWoonwensSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Add explicitly to the store as a Woonwens response that feeds into the Participatie Monitor!
    // Each woonwens counts 100% as active woningzoekende in the participation monitor.
    store.addWoonwens({
      naam: woonwensForm.naam,
      email: woonwensForm.email,
      doelgroep: woonwensForm.doelgroep,
      woningtype: woonwensForm.woningtype,
      prijsklasse: woonwensForm.prijsklasse,
      toelichting: woonwensForm.toelichting,
    });

    // 2. Also register on the interactive map so other residents can see the housing preference
    store.addMapIdea({
      title: `Woonwens: ${woonwensForm.woningtype} (${woonwensForm.doelgroep})`,
      category: 'wonen',
      authorName: woonwensForm.naam || 'Woningzoekende Hollandsche Rading',
      authorEmail: woonwensForm.email || undefined,
      lat: 52.1792 + (Math.random() - 0.5) * 0.002,
      lng: 5.1805 + (Math.random() - 0.5) * 0.002,
      description: `Woonwens ingediend via Woondata. Doelgroep: ${woonwensForm.doelgroep}. Prijsklasse: ${woonwensForm.prijsklasse}. ${woonwensForm.toelichting || ''}`,
    });

    setWoonwensSuccess(true);
    setTimeout(() => {
      setWoonwensSuccess(false);
      setIsWoonwensModalOpen(false);
      setWoonwensForm({
        naam: '',
        email: '',
        doelgroep: 'Starter',
        woningtype: 'Compacte beneden-/bovenwoning of hofwoning',
        prijsklasse: 'Betaalbare koop (< € 390.000)',
        toelichting: '',
      });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1D1A] font-sans">
      {/* Top Header / Navigation Bar styled like in images */}
      <header className="sticky top-0 z-50 bg-[#161916] text-[#FBF9F5] border-b border-[#2B302B] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Top Bar */}
          <div className="flex items-center justify-between py-3.5 border-b border-[#262B26]/80">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-xs font-medium text-[#C8C2B7] hover:text-white px-3 py-1.5 rounded-lg bg-[#242A24] hover:bg-[#2F362F] transition-all border border-[#3A423A]"
                id="btn-terug-verkenning"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Terug naar verkenning</span>
              </button>

              <div className="h-5 w-px bg-[#2E352E] hidden sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3D5A45] flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  <Building2 className="w-4 h-4 text-[#FBF9F5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold tracking-tight text-white text-base">
                      WOONDATA
                    </span>
                    <span className="hidden md:inline-block text-[10px] font-mono-subtle uppercase px-2 py-0.5 rounded bg-[#273027] text-[#93B89B] border border-[#3A453A]">
                      VNG • BAG • CBS STATLINE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A69F94] leading-tight hidden sm:block">
                    Woningmarktmonitor Gemeente De Bilt & Dorpsrand Hollandsche Rading
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWoonwensModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#E5D77D] text-[#161916] hover:bg-[#F2E590] text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-2"
                id="btn-woonwens-doorgeven"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#161916]" />
                <span>Woonwens doorgeven</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('overzicht')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeTab === 'overzicht'
                  ? 'bg-[#FBF9F5] text-[#161916] font-bold shadow-xs'
                  : 'text-[#C5BFB5] hover:text-white hover:bg-[#252B25]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#3D5A45]" />
              <span>Overzicht &amp; Kerncijfers</span>
            </button>

            <button
              onClick={() => setActiveTab('typologie')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeTab === 'typologie'
                  ? 'bg-[#FBF9F5] text-[#161916] font-bold shadow-xs'
                  : 'text-[#C5BFB5] hover:text-white hover:bg-[#252B25]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#3D5A45]" />
              <span>Woningvoorraad &amp; Typologie</span>
            </button>

            <button
              onClick={() => setActiveTab('bouwproductie')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeTab === 'bouwproductie'
                  ? 'bg-[#FBF9F5] text-[#161916] font-bold shadow-xs'
                  : 'text-[#C5BFB5] hover:text-white hover:bg-[#252B25]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#3D5A45]" />
              <span>Bouwproductie &amp; Plancapaciteit</span>
            </button>

            <button
              onClick={() => setActiveTab('demografie')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeTab === 'demografie'
                  ? 'bg-[#FBF9F5] text-[#161916] font-bold shadow-xs'
                  : 'text-[#C5BFB5] hover:text-white hover:bg-[#252B25]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#3D5A45]" />
              <span>Demografie &amp; Huishoudens</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeTab === 'benchmark'
                  ? 'bg-[#FBF9F5] text-[#161916] font-bold shadow-xs'
                  : 'text-[#C5BFB5] hover:text-white hover:bg-[#252B25]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#3D5A45]" />
              <span>Benchmark &amp; Regio</span>
            </button>

            {onNavigateToParticipatie && (
              <button
                onClick={onNavigateToParticipatie}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#93B89B] hover:text-[#DCFCE7] hover:bg-[#252B25] transition-all shrink-0 ml-auto border border-[#3A453A]"
                title="Bekijk de dorpskaart met woningbouwprojecten"
              >
                <span>🗺️</span>
                <span>Naar interactieve dorpskaart</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#93B89B]" />
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* =========================================================================
            TAB 1: OVERZICHT & KERNCIJFERS (IMAGE 1)
        ========================================================================= */}
        {activeTab === 'overzicht' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 4 Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Woningvoorraad */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#736C62]">
                    Woningvoorraad
                  </span>
                  <span className="text-[10px] font-mono-subtle font-bold px-2 py-0.5 rounded-md bg-[#E8F4EC] text-[#2C6E3D] border border-[#C2E2CB]">
                    CBS 2025
                  </span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-[#161916]">
                  {WOONDATA_KPI.woningvoorraad.toLocaleString('nl-NL')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] font-semibold mt-1 mb-4">
                  <span>↗ +{WOONDATA_KPI.nettoToevoegingJaar}</span>
                  <span className="text-[#877E71] font-normal">netto toevoeging afgelopen jaar</span>
                </div>
                <div className="pt-3 border-t border-[#F0ECE2] grid grid-cols-3 gap-1 text-[11px] text-[#736C62]">
                  <div>
                    <span className="block text-[#161916] font-semibold">28,9%</span>
                    <span>De Bilt</span>
                  </div>
                  <div>
                    <span className="block text-[#161916] font-semibold">53,0%</span>
                    <span>Bilthoven</span>
                  </div>
                  <div>
                    <span className="block text-[#3D5A45] font-bold">4,3%</span>
                    <span>H. Rading</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Eigendom Koop / Huur */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#736C62]">
                    Eigendom Koop/Huur
                  </span>
                  <span className="text-[10px] font-mono-subtle font-bold px-2 py-0.5 rounded-md bg-[#EBF3FB] text-[#1967B2] border border-[#C9E0F6]">
                    Verdeling
                  </span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-[#161916]">
                  {WOONDATA_KPI.koopPercentage.toString().replace('.', ',')}%{' '}
                  <span className="text-lg font-medium text-[#736C62]">koop</span>
                </div>
                <p className="text-xs text-[#736C62] mt-1 mb-4">
                  {WOONDATA_KPI.corporatiePercentage.toString().replace('.', ',')}% Corporatiehuur (SSW) •{' '}
                  {WOONDATA_KPI.particulierPercentage.toString().replace('.', ',')}% Vrij
                </p>
                <div className="pt-3 border-t border-[#F0ECE2] text-[11px] text-[#736C62]">
                  <span>Doel nieuwbouw: min. 30% sociaal / 40% betaalbaar</span>
                </div>
              </div>

              {/* Card 3: Plancapaciteit */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#736C62]">
                    Plancapaciteit
                  </span>
                  <span className="text-[10px] font-mono-subtle font-bold px-2 py-0.5 rounded-md bg-[#FEF4E8] text-[#B85D00] border border-[#FCD9B3]">
                    Opgave {WOONDATA_KPI.opgave2030}
                  </span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-[#161916]">
                  {WOONDATA_KPI.plancapaciteitTotaal.toLocaleString('nl-NL')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] font-semibold mt-1 mb-4">
                  <span>{WOONDATA_KPI.dekkingsgraad}% dekking</span>
                  <span className="text-[#877E71] font-normal">t.o.v. Woonvisie 2030</span>
                </div>
                <div className="pt-3 border-t border-[#F0ECE2] text-[11px] text-[#736C62] flex justify-between">
                  <span>Hard: {WOONDATA_KPI.hardeCapaciteit} woningen</span>
                  <span>Zacht: {WOONDATA_KPI.zachteCapaciteit}</span>
                </div>
              </div>

              {/* Card 4: Inwoners De Bilt */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#736C62]">
                    Inwoners De Bilt
                  </span>
                  <span className="text-[10px] font-mono-subtle font-bold px-2 py-0.5 rounded-md bg-[#E8F4EC] text-[#2C6E3D] border border-[#C2E2CB]">
                    Doel: 48.500
                  </span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-[#161916]">
                  {WOONDATA_KPI.inwoners.toLocaleString('nl-NL')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] font-semibold mt-1 mb-4">
                  <span>+{WOONDATA_KPI.inwonersSinds2015.toLocaleString('nl-NL')} inwoners</span>
                  <span className="text-[#877E71] font-normal">sinds 2015</span>
                </div>
                <div className="pt-3 border-t border-[#F0ECE2] text-[11px] text-[#736C62] flex justify-between">
                  <span>Huishoudensgrootte: {WOONDATA_KPI.huishoudensgrootte.toString().replace('.', ',')} pers.</span>
                  <span className="text-[#3D5A45] font-medium">H. Rading: ~1.620</span>
                </div>
              </div>
            </div>

            {/* Mid Section: Interactive Charts (Two Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Chart (7 cols): Nieuwbouwproductie & Bouwvergunningen */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#161916]">
                        Nieuwbouwproductie &amp; Verleende Bouwvergunningen
                      </h3>
                      <p className="text-xs text-[#736C62]">
                        Bron: CBS StatLine 84400NED, BAG &amp; Gemeentelijke opleveringen (2020 – 2026)
                      </p>
                    </div>
                    <span className="self-start sm:self-auto text-[11px] font-mono-subtle px-2.5 py-1 rounded bg-[#F4F1EA] text-[#635C52] border border-[#DDD6C8]">
                      CBS Open Data
                    </span>
                  </div>

                  {/* SVG Chart with bars and lines */}
                  <div className="h-64 sm:h-72 w-full mt-6 relative">
                    <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                      {/* Grid horizontal lines */}
                      {[0, 150, 300, 450, 600].map((val, idx) => {
                        const y = 200 - (val / 600) * 180;
                        return (
                          <g key={idx}>
                            <line
                              x1="40"
                              y1={y}
                              x2="580"
                              y2={y}
                              stroke="#EBE6DC"
                              strokeDasharray="4 4"
                            />
                            <text
                              x="32"
                              y={y + 4}
                              textAnchor="end"
                              className="text-[10px] fill-[#8C8477] font-mono-subtle"
                            >
                              {val}
                            </text>
                          </g>
                        );
                      })}

                      {/* Bars for Netto Opgeleverd */}
                      {BOUWPRODUCTIE_DATA.map((d, idx) => {
                        const x = 70 + idx * 75;
                        const barWidth = 42;
                        const barHeight = (d.opgeleverd / 600) * 180;
                        const y = 200 - barHeight;
                        const isHovered = activeChartYear === d.jaar;

                        return (
                          <g
                            key={d.jaar}
                            className="cursor-pointer"
                            onMouseEnter={() => setActiveChartYear(d.jaar)}
                            onMouseLeave={() => setActiveChartYear(null)}
                          >
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={barHeight}
                              rx="4"
                              fill={isHovered ? '#199F64' : '#00BA7C'}
                              className="transition-all duration-200"
                            />
                            {/* Year label */}
                            <text
                              x={x + barWidth / 2}
                              y="218"
                              textAnchor="middle"
                              className={`text-[11px] font-medium ${
                                isHovered ? 'fill-[#161916] font-bold' : 'fill-[#736C62]'
                              }`}
                            >
                              {d.jaar}
                            </text>
                          </g>
                        );
                      })}

                      {/* Line: Bouwvergunningen (Blue) */}
                      <path
                        d={BOUWPRODUCTIE_DATA.map((d, idx) => {
                          const x = 70 + idx * 75 + 21;
                          const y = 200 - (d.vergund / 600) * 180;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#0084D1"
                        strokeWidth="2.5"
                      />

                      {/* Circles on Bouwvergunningen line */}
                      {BOUWPRODUCTIE_DATA.map((d, idx) => {
                        const x = 70 + idx * 75 + 21;
                        const y = 200 - (d.vergund / 600) * 180;
                        return (
                          <circle
                            key={`vergund-${d.jaar}`}
                            cx={x}
                            cy={y}
                            r="4.5"
                            fill="#FFFFFF"
                            stroke="#0084D1"
                            strokeWidth="2.5"
                            className="cursor-pointer"
                            onMouseEnter={() => setActiveChartYear(d.jaar)}
                          />
                        );
                      })}

                      {/* Line: In Aanbouw (Purple dashed) */}
                      <path
                        d={BOUWPRODUCTIE_DATA.map((d, idx) => {
                          const x = 70 + idx * 75 + 21;
                          const y = 200 - (d.inAanbouw / 600) * 180;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        strokeDasharray="5 4"
                      />

                      {/* Circles on In Aanbouw line */}
                      {BOUWPRODUCTIE_DATA.map((d, idx) => {
                        const x = 70 + idx * 75 + 21;
                        const y = 200 - (d.inAanbouw / 600) * 180;
                        return (
                          <circle
                            key={`aanbouw-${d.jaar}`}
                            cx={x}
                            cy={y}
                            r="3.5"
                            fill="#FFFFFF"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            className="cursor-pointer"
                            onMouseEnter={() => setActiveChartYear(d.jaar)}
                          />
                        );
                      })}
                    </svg>

                    {/* Interactive Tooltip Card */}
                    {activeChartYear && (
                      <div className="absolute top-2 right-4 bg-[#181B18] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-[#303830] z-20">
                        <div className="font-bold text-[#E5D77D] border-b border-[#333C33] pb-1">
                          Jaar {activeChartYear}
                        </div>
                        {(() => {
                          const d = BOUWPRODUCTIE_DATA.find((x) => x.jaar === activeChartYear)!;
                          return (
                            <>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#A49D92]">Opgeleverd:</span>
                                <span className="font-bold text-[#00BA7C]">{d.opgeleverd}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#A49D92]">Vergund:</span>
                                <span className="font-bold text-[#0084D1]">{d.vergund}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#A49D92]">In Aanbouw:</span>
                                <span className="font-bold text-[#8B5CF6]">{d.inAanbouw}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#A49D92]">Netto toevoeging:</span>
                                <span className="font-bold text-white">+{d.netto}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Chart Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-[#F0ECE2] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border-2 border-[#0084D1] bg-white" />
                      <span className="text-[#555047] font-medium">Bouwvergunningen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-1.5 border-b-2 border-dashed border-[#8B5CF6]" />
                      <span className="text-[#555047] font-medium">In Aanbouw</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-xs bg-[#00BA7C]" />
                      <span className="text-[#555047] font-medium">Opgeleverd (Netto)</span>
                    </div>
                  </div>
                </div>

                {/* Footer Callout */}
                <div className="mt-6 pt-3 border-t border-[#F0ECE2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#736C62]">
                    <span>🚀 2026 bevat actuele projectie met label</span>
                    <span className="font-bold text-[#D88935] bg-[#FEF4E8] px-1.5 py-0.5 rounded border border-[#FCD9B3]">
                      [PROGNOSE]
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('bouwproductie')}
                    className="text-[#3D5A45] hover:text-[#25392B] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>Bekijk alle productiedata</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Chart (5 cols): Eigendomsverhouding Donut */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#161916]">
                      Eigendomsverhouding De Bilt
                    </h3>
                    <span className="text-[11px] font-mono-subtle px-2 py-0.5 rounded bg-[#F4F1EA] text-[#635C52] border border-[#DDD6C8]">
                      CBS 83765NED
                    </span>
                  </div>
                  <p className="text-xs text-[#736C62] mb-6">
                    Verdeling bestaande voorraad ({WOONDATA_KPI.woningvoorraad.toLocaleString('nl-NL')} woningen)
                  </p>

                  {/* Donut SVG */}
                  <div className="flex items-center justify-center my-4 relative">
                    <svg viewBox="0 0 200 200" className="w-52 h-52">
                      {/* Koopwoningen (64.8% -> 233.28 deg) */}
                      {/* Circumference = 2 * PI * 65 ≈ 408.4 */}
                      <circle
                        cx="100"
                        cy="100"
                        r="65"
                        fill="none"
                        stroke="#0084D1"
                        strokeWidth="28"
                        strokeDasharray={`${0.648 * 408.4} ${408.4}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                      />
                      {/* Corporatiehuur (22.6% -> 92.3 deg) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="65"
                        fill="none"
                        stroke="#00BA7C"
                        strokeWidth="28"
                        strokeDasharray={`${0.226 * 408.4} ${408.4}`}
                        strokeDashoffset={`${-0.648 * 408.4}`}
                        transform="rotate(-90 100 100)"
                      />
                      {/* Particuliere huur (12.6% -> 51.4 deg) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="65"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="28"
                        strokeDasharray={`${0.126 * 408.4} ${408.4}`}
                        strokeDashoffset={`${-(0.648 + 0.226) * 408.4}`}
                        transform="rotate(-90 100 100)"
                      />

                      {/* Center label */}
                      <text
                        x="100"
                        y="95"
                        textAnchor="middle"
                        className="text-xs font-bold fill-[#736C62] font-mono-subtle"
                      >
                        VOORRAAD
                      </text>
                      <text
                        x="100"
                        y="114"
                        textAnchor="middle"
                        className="text-base font-extrabold fill-[#161916]"
                      >
                        19.645
                      </text>
                    </svg>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-3 mt-6 pt-4 border-t border-[#F0ECE2] text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#0084D1]" />
                        <span className="text-[#36322C] font-medium">Koopwoningen</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#161916]">12.730</span>
                        <span className="text-[#736C62] ml-1.5">(64,8%)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#00BA7C]" />
                        <span className="text-[#36322C] font-medium">Corporatiehuur (SSW)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#161916]">4.440</span>
                        <span className="text-[#736C62] ml-1.5">(22,6%)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                        <span className="text-[#36322C] font-medium">Particuliere huur / Vrije sector</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#161916]">2.475</span>
                        <span className="text-[#736C62] ml-1.5">(12,6%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#F0ECE2] bg-[#FAF8F3] -mx-6 -mb-6 p-4 rounded-b-2xl border-t">
                  <p className="text-[11px] text-[#736C62] leading-relaxed">
                    💡 <strong className="text-[#161916]">Beleidsdoel De Bilt:</strong> Minimaal 30% van alle
                    nieuwbouw dient sociale huur te zijn, en 40% middelduur/betaalbaar om starters en doorstromers te behouden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: WONINGVOORRAAD & TYPOLOGIE (IMAGE 2 & IMAGE 6)
        ========================================================================= */}
        {activeTab === 'typologie' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Databron banner (like Image 2) */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono-subtle uppercase tracking-wider font-bold text-[#2C6E3D] bg-[#E8F4EC] px-2 py-0.5 rounded border border-[#C2E2CB] inline-block mb-1.5">
                  DATABRON
                </span>
                <h2 className="text-lg font-bold text-[#161916]">
                  Woningvoorraad en typologie
                </h2>
                <p className="text-xs text-[#736C62] mt-0.5">
                  Officiële CBS StatLine &amp; BAG • Peildatum: 1 januari 2025
                </p>
              </div>

              <button
                onClick={() => {
                  const csv = exportVoorraaddataCsv();
                  downloadCsvFile(csv, 'woningvoorraad_de_bilt_hollandsche_rading.csv');
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF8F3] hover:bg-[#F2EDE2] text-[#36322C] text-xs font-semibold border border-[#DCD6C8] transition-all flex items-center gap-2 shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#3D5A45]" />
                <span>Download Voorraaddata (CSV)</span>
              </button>
            </div>

            {/* 4 Cards Grid (2x2) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Woningtypen */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
                <h3 className="text-base font-bold text-[#161916]">
                  1. Woningtypen in de Gemeente &amp; Hollandsche Rading
                </h3>
                <p className="text-xs text-[#736C62] mb-6">
                  Sterke nadruk op eengezinswoningen en ruimtelijk wonen
                </p>

                {/* Horizontal bar chart */}
                <div className="space-y-4">
                  {WONINGTYPEN_DATA.map((item) => (
                    <div key={item.type} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-[#36322C]">{item.type}</span>
                        <div className="space-x-1.5">
                          <span className="font-bold text-[#161916]">{item.percentage}%</span>
                          <span className="text-[#8C8477]">({item.aantal.toLocaleString('nl-NL')})</span>
                        </div>
                      </div>
                      <div className="w-full h-4 bg-[#F2EDE2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0084D1] rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage * 2.5}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Badges footer */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6 pt-5 border-t border-[#F0ECE2] text-[11px]">
                  <div className="bg-[#FAF8F3] p-2 rounded-lg border border-[#EDE8DD]">
                    <span className="text-[#736C62] block">Rij- en tussenwoningen:</span>
                    <span className="font-bold text-[#161916]">35%</span>
                  </div>
                  <div className="bg-[#FAF8F3] p-2 rounded-lg border border-[#EDE8DD]">
                    <span className="text-[#736C62] block">Vrijstaand &amp; Geschakeld:</span>
                    <span className="font-bold text-[#161916]">25%</span>
                  </div>
                  <div className="bg-[#FAF8F3] p-2 rounded-lg border border-[#EDE8DD]">
                    <span className="text-[#736C62] block">Twee-onder-een-kap:</span>
                    <span className="font-bold text-[#161916]">23%</span>
                  </div>
                  <div className="bg-[#FAF8F3] p-2 rounded-lg border border-[#EDE8DD]">
                    <span className="text-[#736C62] block">Appartementen:</span>
                    <span className="font-bold text-[#161916]">13%</span>
                  </div>
                  <div className="bg-[#FAF8F3] p-2 rounded-lg border border-[#EDE8DD]">
                    <span className="text-[#736C62] block">Patios / Hofjes / Overig:</span>
                    <span className="font-bold text-[#161916]">4%</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Bouwjaarperiodes */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
                <h3 className="text-base font-bold text-[#161916]">
                  2. Bouwjaarperiodes (Dorpsontstaansgeschiedenis)
                </h3>
                <p className="text-xs text-[#736C62] mb-6">
                  Van historische lintbebouwing tot naoorlogs en moderne nieuwbouw
                </p>

                {/* Vertical Bar Chart */}
                <div className="h-52 w-full flex items-end justify-between gap-3 px-2 pt-4">
                  {BOUWJAAR_DATA.map((b) => {
                    const heightPercent = (b.aantal / 6000) * 100;
                    return (
                      <div key={b.periode} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] font-bold text-[#161916]">
                          {b.aantal.toLocaleString('nl-NL')}
                        </span>
                        <div
                          className="w-full bg-[#00BA7C] rounded-t-md hover:bg-[#199F64] transition-all"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[9px] text-[#736C62] text-center font-mono-subtle leading-tight h-8 flex items-center">
                          {b.periode}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-[#F0ECE2] flex items-center justify-between text-xs bg-[#FAF8F3] p-3 rounded-xl border border-[#EDE8DD]">
                  <span className="text-[#555047]">
                    Wederopbouw &amp; dorpsgroei (1945-1990) vormt de grootste tranche: <strong className="text-[#161916]">56%</strong>
                  </span>
                  <span className="text-[#2C6E3D] font-bold">Nieuwbouw na 2016: 15%</span>
                </div>
              </div>

              {/* Card 3: Gebruiksoppervlakte m² GBO (Image 6 Area curve) */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-[#161916]">
                    3. Gebruiksoppervlakte (m² GBO)
                  </h3>
                  <span className="text-[11px] font-mono-subtle text-[#736C62]">
                    BAG Data
                  </span>
                </div>
                <p className="text-xs text-[#736C62] mb-6">
                  48% van de woningen is tussen 100 en 150 m² groot
                </p>

                {/* Interactive Area Curve SVG */}
                <div className="h-56 w-full relative">
                  <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    {[0, 2500, 5000, 7500, 10000].map((v) => {
                      const y = 170 - (v / 10000) * 150;
                      return (
                        <g key={v}>
                          <line x1="40" y1={y} x2="480" y2={y} stroke="#EBE6DC" strokeDasharray="3 3" />
                          <text x="35" y={y + 3} textAnchor="end" className="text-[9px] fill-[#8C8477]">
                            {v}
                          </text>
                        </g>
                      );
                    })}

                    {/* Smooth Area Path */}
                    <path
                      d="M 60 170 L 60 142 Q 130 110, 160 109 Q 220 100, 260 28 Q 310 32, 360 128 Q 410 140, 460 146 L 460 170 Z"
                      fill="#00BA7C"
                      fillOpacity="0.15"
                    />

                    {/* Stroke line */}
                    <path
                      d="M 60 142 Q 130 110, 160 109 Q 220 100, 260 28 Q 310 32, 360 128 Q 410 140, 460 146"
                      fill="none"
                      stroke="#00BA7C"
                      strokeWidth="2.5"
                    />

                    {/* Nodes for categories */}
                    {[
                      { idx: 0, x: 60, y: 142, val: 1840 },
                      { idx: 1, x: 160, y: 109, val: 4050 },
                      { idx: 2, x: 260, y: 28, val: 9430 },
                      { idx: 3, x: 360, y: 128, val: 2765 },
                      { idx: 4, x: 460, y: 146, val: 1560 },
                    ].map((pt) => {
                      const isHovered = hoveredGboIndex === pt.idx;
                      return (
                        <g
                          key={pt.idx}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredGboIndex(pt.idx)}
                          onMouseLeave={() => setHoveredGboIndex(null)}
                          onClick={() => setHoveredGboIndex(pt.idx)}
                        >
                          {/* Invisible larger hit target to easily hover over the circle */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={18}
                            fill="transparent"
                          />
                          {isHovered && (
                            <line
                              x1={pt.x}
                              y1={pt.y}
                              x2={pt.x}
                              y2="170"
                              stroke="#00BA7C"
                              strokeDasharray="2 2"
                            />
                          )}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 6.5 : 4}
                            fill="#FFFFFF"
                            stroke="#00BA7C"
                            strokeWidth={isHovered ? 3 : 2.5}
                            className="transition-all duration-150"
                          />
                        </g>
                      );
                    })}

                    {/* Labels below */}
                    <text x="60" y="188" textAnchor="middle" className="text-[9px] fill-[#736C62]">&lt; 75 m²</text>
                    <text x="160" y="188" textAnchor="middle" className="text-[9px] fill-[#736C62]">75 – 100 m²</text>
                    <text x="260" y="188" textAnchor="middle" className="text-[9px] fill-[#736C62]">100 – 150 m²</text>
                    <text x="360" y="188" textAnchor="middle" className="text-[9px] fill-[#736C62]">150 – 200 m²</text>
                    <text x="460" y="188" textAnchor="middle" className="text-[9px] fill-[#736C62]">&gt; 200 m²</text>
                  </svg>

                  {/* Pop-up tooltip: alleen zichtbaar wanneer je op een rondje staat */}
                  {hoveredGboIndex !== null && (() => {
                    const item = GBO_OPPERVLAKTE_DATA[hoveredGboIndex];
                    if (!item) return null;
                    return (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-[#121614] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#2E3630] z-20 flex flex-col items-center pointer-events-none animate-fadeIn">
                        <span className="text-xs font-bold text-[#E5D77D]">{item.range} ({item.label})</span>
                        <span className="text-xs text-[#00BA7C] font-semibold">Voorraad: {item.aantal.toLocaleString('nl-NL')} woningen ({item.percentage}%)</span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Card 4: Verdeling Woningvoorraad per Kern */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#161916]">
                    4. Verdeling Woningvoorraad per Kern
                  </h3>
                  <p className="text-xs text-[#736C62] mb-6">
                    Bilthoven, De Bilt, Maartensdijk, Hollandsche Rading &amp; Buitengebied
                  </p>

                  <div className="space-y-4">
                    {KERN_VOORRAAD_DATA.map((k) => (
                      <div key={k.kern} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={`font-semibold ${k.kern.includes('Hollandsche Rading') ? 'text-[#2C6E3D]' : 'text-[#262420]'}`}>
                            {k.kern}
                          </span>
                          <span className="text-[#635C52]">
                            <strong className="text-[#161916]">{k.aantal.toLocaleString('nl-NL')}</strong> woningen ({k.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-3 bg-[#F2EDE2] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              k.kern.includes('Hollandsche Rading') ? 'bg-[#00BA7C]' : 'bg-[#0084D1]'
                            }`}
                            style={{ width: `${k.percentage * 1.8}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0ECE2] bg-[#FAF8F3] p-3.5 rounded-xl border border-[#EDE8DD]">
                  <p className="text-xs text-[#5A544B] leading-relaxed">
                    💡 <strong className="text-[#161916]">Inzicht voor Hollandsche Rading:</strong> Het aandeel
                    eengezinswoningen en ruime kavels is zeer hoog (bijna 85%). Er is een acute vraag naar
                    kleinschalige seniorenwoningen en betaalbare starterswoningen zodat senioren uit grote huizen
                    kunnen doorstromen en jonge mensen in het dorp kunnen blijven wonen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: BOUWPRODUCTIE & PLANCAPACITEIT (IMAGE 3)
        ========================================================================= */}
        {activeTab === 'bouwproductie' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (8 cols): Plancapaciteit Table */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
                <h3 className="text-base font-bold text-[#161916] mb-1">
                  Plancapaciteit per Kern t.o.v. Woonopgave 2030
                </h3>
                <p className="text-xs text-[#736C62] mb-4">
                  Verdeling van harde (onherroepelijke) en zachte plannen
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#E8E2D5] text-[#8C8477] font-mono-subtle uppercase text-[10px]">
                        <th className="py-2.5 font-semibold">Kern</th>
                        <th className="py-2.5 font-semibold text-right">Harde Cap.</th>
                        <th className="py-2.5 font-semibold text-right">Zachte Cap.</th>
                        <th className="py-2.5 font-semibold text-right">Totaal</th>
                        <th className="py-2.5 font-semibold text-right">Opgave 2030</th>
                        <th className="py-2.5 font-semibold text-center">Dekkingsgraad</th>
                        <th className="py-2.5 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EDE2]">
                      {PLANCAPACITEIT_KERNEN.map((row) => (
                        <tr key={row.kern} className="hover:bg-[#FAF8F3] transition-colors">
                          <td className="py-3 font-semibold text-[#161916]">{row.kern}</td>
                          <td className="py-3 text-right font-medium text-[#00BA7C]">{row.hardeCapaciteit}</td>
                          <td className="py-3 text-right font-medium text-[#D88935]">{row.zachteCapaciteit}</td>
                          <td className="py-3 text-right font-bold text-[#161916]">{row.totaalPlannen}</td>
                          <td className="py-3 text-right text-[#736C62]">{row.opgave2030}</td>
                          <td className="py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-[#E8F4EC] text-[#2C6E3D] border border-[#C2E2CB] text-[11px]">
                              {row.dekkingsgraad}%
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                row.status === 'Voldoende'
                                  ? 'bg-[#E8F4EC] text-[#2C6E3D]'
                                  : 'bg-[#FEF4E8] text-[#B85D00]'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {/* Total summary row */}
                      <tr className="bg-[#FAF8F3] font-bold text-[#161916] border-t-2 border-[#E0D9CB]">
                        <td className="py-3.5">Totaal Gemeente De Bilt</td>
                        <td className="py-3.5 text-right text-[#00BA7C]">{WOONDATA_KPI.hardeCapaciteit}</td>
                        <td className="py-3.5 text-right text-[#D88935]">{WOONDATA_KPI.zachteCapaciteit}</td>
                        <td className="py-3.5 text-right">{WOONDATA_KPI.plancapaciteitTotaal}</td>
                        <td className="py-3.5 text-right">{WOONDATA_KPI.opgave2030}</td>
                        <td className="py-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-full font-bold bg-[#E8F4EC] text-[#2C6E3D] border border-[#C2E2CB] text-[11px]">
                            {WOONDATA_KPI.dekkingsgraad}%
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F4EC] text-[#2C6E3D]">
                            Voldoende
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Toelichting hard/zacht box */}
                <div className="mt-6 p-4 rounded-xl bg-[#FAF8F3] border border-[#EDE8DD] text-xs text-[#555047] space-y-1.5">
                  <div className="font-bold text-[#161916] mb-1">Toelichting hard/zacht:</div>
                  <p>
                    • <strong className="text-[#00BA7C]">Harde plancapaciteit:</strong> Onherroepelijke
                    bestemmingsplannen, vastgestelde omgevingsvergunningen of bouwrijpe gronden (bijv. Kwinkelier en Larenstein).
                  </p>
                  <p>
                    • <strong className="text-[#D88935]">Zachte plancapaciteit:</strong> Plannen in ambtelijke
                    voorbereiding, structuurvisies, voorontwerpen of intentieovereenkomsten met ontwikkelaars (waaronder de Gebiedsverkenning Hollandsche Rading).
                  </p>
                </div>
              </div>

              {/* Right Column (4 cols): Hard vs Zacht Donut */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#161916] mb-1">
                    Harde vs. Zachte Verhouding
                  </h3>
                  <p className="text-xs text-[#736C62] mb-6">
                    56% harde plancapaciteit (onherroepelijk)
                  </p>

                  <div className="flex items-center justify-center my-4">
                    <svg viewBox="0 0 200 200" className="w-48 h-48">
                      {/* Harde capaciteit: 56% */}
                      <circle
                        cx="100"
                        cy="100"
                        r="65"
                        fill="none"
                        stroke="#00BA7C"
                        strokeWidth="26"
                        strokeDasharray={`${0.56 * 408.4} ${408.4}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                      />
                      {/* Zachte capaciteit: 44% */}
                      <circle
                        cx="100"
                        cy="100"
                        r="65"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="26"
                        strokeDasharray={`${0.44 * 408.4} ${408.4}`}
                        strokeDashoffset={`${-0.56 * 408.4}`}
                        transform="rotate(-90 100 100)"
                      />
                      <text x="100" y="96" textAnchor="middle" className="text-xs font-bold fill-[#736C62] font-mono-subtle">
                        TOTAAL
                      </text>
                      <text x="100" y="116" textAnchor="middle" className="text-lg font-extrabold fill-[#161916]">
                        {WOONDATA_KPI.plancapaciteitTotaal}
                      </text>
                    </svg>
                  </div>

                  <div className="space-y-3 mt-6 pt-4 border-t border-[#F0ECE2] text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#00BA7C]" />
                        <span className="text-[#36322C] font-medium">Harde plancapaciteit:</span>
                      </div>
                      <span className="font-bold text-[#161916]">
                        {WOONDATA_KPI.hardeCapaciteit} <span className="text-[#736C62] font-normal">(56%)</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                        <span className="text-[#36322C] font-medium">Zachte plancapaciteit:</span>
                      </div>
                      <span className="font-bold text-[#161916]">
                        {WOONDATA_KPI.zachteCapaciteit} <span className="text-[#736C62] font-normal">(44%)</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0ECE2] text-[11px] text-[#736C62]">
                  <span>Doelstelling provincie Utrecht: minimaal 130% plancapaciteit om uitval en vertraging van plannen op te vangen.</span>
                </div>
              </div>
            </div>

            {/* Bottom: Detailed CBS StatLine Table (Image 3) */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-[#161916]">
                  Gedetailleerde Bouwproductietabel (2020 – 2026)
                </h3>
                <span className="text-[11px] font-mono-subtle text-[#736C62]">
                  Tabel 84400NED
                </span>
              </div>
              <p className="text-xs text-[#736C62] mb-6">
                CBS StatLine Tabel 84400NED aangevuld met kwartaalrapportages van de Gemeente De Bilt
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E8E2D5] text-[#8C8477] font-mono-subtle uppercase text-[10px]">
                      <th className="py-2.5 font-semibold">Jaar</th>
                      <th className="py-2.5 font-semibold text-right">Opgeleverde Woningen</th>
                      <th className="py-2.5 font-semibold text-right">Vergunde Woningen</th>
                      <th className="py-2.5 font-semibold text-right">In Aanbouw (Einde Jaar)</th>
                      <th className="py-2.5 font-semibold text-right">Sloop / Onttrekking</th>
                      <th className="py-2.5 font-semibold text-right">Netto Toevoeging</th>
                      <th className="py-2.5 font-semibold text-center">Data Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EDE2]">
                    {BOUWPRODUCTIE_DATA.map((row) => (
                      <tr key={row.jaar} className="hover:bg-[#FAF8F3] transition-colors">
                        <td className="py-3 font-bold text-[#161916]">{row.jaar}</td>
                        <td className="py-3 text-right font-semibold text-[#00BA7C]">{row.opgeleverd}</td>
                        <td className="py-3 text-right font-semibold text-[#0084D1]">{row.vergund}</td>
                        <td className="py-3 text-right font-semibold text-[#8B5CF6]">{row.inAanbouw}</td>
                        <td className="py-3 text-right text-[#C0392B]">{row.sloop}</td>
                        <td className="py-3 text-right font-bold text-[#161916]">+{row.netto}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono-subtle font-bold border ${
                              row.dataType === 'CBS STATLINE'
                                ? 'bg-[#E8F4EC] text-[#2C6E3D] border-[#C2E2CB]'
                                : row.dataType === 'PROGNOSE'
                                ? 'bg-[#FEF4E8] text-[#B85D00] border-[#FCD9B3]'
                                : 'bg-[#EBF3FB] text-[#1967B2] border-[#C9E0F6]'
                            }`}
                          >
                            {row.dataType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Banner: Woningbouwprojecten op Interactieve Dorpskaart */}
            <div className="bg-[#FAF8F3] border border-[#E5E1D8] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#3D5A45] text-white shrink-0 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#161916]">
                    Woningbouwprojecten op de Interactieve Dorpskaart
                  </h4>
                  <p className="text-xs text-[#555047] mt-0.5 max-w-2xl">
                    De actuele woningbouwprojecten en plancapaciteit van De Bilt en Hollandsche Rading zijn geïntegreerd in de interactieve dorpskaart (Kaartlaag Woningbouwprojecten).
                  </p>
                </div>
              </div>

              {onNavigateToParticipatie && (
                <button
                  type="button"
                  onClick={onNavigateToParticipatie}
                  className="px-4 py-2.5 rounded-xl bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
                >
                  <span>Naar interactieve dorpskaart</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: DEMOGRAFIE & HUISHOUDENS (IMAGE 4)
        ========================================================================= */}
        {activeTab === 'demografie' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Banner (Image 4) */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
              <span className="text-[10px] font-mono-subtle uppercase tracking-wider font-bold text-[#2C6E3D] bg-[#E8F4EC] px-2 py-0.5 rounded border border-[#C2E2CB] inline-block mb-1.5">
                DEMOGRAFISCHE ONTWIKKELING
              </span>
              <h2 className="text-lg font-bold text-[#161916]">
                Bevolking, Huishoudensgroei &amp; Vergrijzing
              </h2>
              <p className="text-xs text-[#736C62] mt-0.5">
                CBS Bevolkingsstatistiek 85408NED &amp; Primos Bevolkingsprognose tot 2050 ({WOONDATA_KPI.inwoners.toLocaleString('nl-NL')} inwoners)
              </p>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (8 cols): Groeipad Chart (Image 4) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
                <h3 className="text-base font-bold text-[#161916]">
                  Groeipad Inwoners en Huishoudens (2015 – 2050)
                </h3>
                <p className="text-xs text-[#736C62] mb-6">
                  Groei van {WOONDATA_KPI.inwoners.toLocaleString('nl-NL')} (huidig) naar de stip op de horizon van ~48.500 inwoners
                </p>

                {/* SVG Multi-line Chart */}
                <div className="h-64 sm:h-72 w-full relative">
                  <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                    {/* Horizontal grid lines */}
                    {[0, 15000, 30000, 45000, 60000].map((v) => {
                      const y = 200 - (v / 60000) * 180;
                      return (
                        <g key={v}>
                          <line x1="40" y1={y} x2="580" y2={y} stroke="#EBE6DC" strokeDasharray="3 3" />
                          <text x="35" y={y + 4} textAnchor="end" className="text-[10px] fill-[#8C8477] font-mono-subtle">
                            {v}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area fill under Inwoners */}
                    <path
                      d={`${DEMOGRAFIE_DATA.map((d, idx) => {
                        const x = 60 + idx * 72;
                        const y = 200 - (d.inwoners / 60000) * 180;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')} L ${60 + (DEMOGRAFIE_DATA.length - 1) * 72} 200 L 60 200 Z`}
                      fill="#0084D1"
                      fillOpacity="0.06"
                    />

                    {/* Inwoners line (Blue) */}
                    <path
                      d={DEMOGRAFIE_DATA.map((d, idx) => {
                        const x = 60 + idx * 72;
                        const y = 200 - (d.inwoners / 60000) * 180;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#0084D1"
                      strokeWidth="2.5"
                    />

                    {/* Huishoudens line (Green) */}
                    <path
                      d={DEMOGRAFIE_DATA.map((d, idx) => {
                        const x = 60 + idx * 72;
                        const y = 200 - (d.huishoudens / 60000) * 180;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#00BA7C"
                      strokeWidth="3"
                    />

                    {/* Senioren line (Orange dashed) */}
                    <path
                      d={DEMOGRAFIE_DATA.map((d, idx) => {
                        const x = 60 + idx * 72;
                        const y = 200 - (d.senioren / 60000) * 180;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                    />

                    {/* Circles on Huishoudens */}
                    {DEMOGRAFIE_DATA.map((d, idx) => {
                      const x = 60 + idx * 72;
                      const y = 200 - (d.huishoudens / 60000) * 180;
                      return (
                        <circle
                          key={`hh-${d.jaar}`}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#FFFFFF"
                          stroke="#00BA7C"
                          strokeWidth="2.5"
                        />
                      );
                    })}

                    {/* Year text labels */}
                    {DEMOGRAFIE_DATA.map((d, idx) => {
                      const x = 60 + idx * 72;
                      return (
                        <text
                          key={`yr-${d.jaar}`}
                          x={x}
                          y="218"
                          textAnchor="middle"
                          className="text-[11px] fill-[#736C62] font-mono-subtle"
                        >
                          {d.jaar}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-[#F0ECE2] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-1 bg-[#0084D1] rounded" />
                    <span className="text-[#36322C] font-semibold">Inwoners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-1 bg-[#00BA7C] rounded" />
                    <span className="text-[#36322C] font-semibold">Aantal Huishoudens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-1 border-b-2 border-dashed border-[#F59E0B]" />
                    <span className="text-[#36322C] font-semibold">Senioren (65+)</span>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Huishoudensverdunning Card (Image 4) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#161916] mb-1">
                    Huishoudensverdunning
                  </h3>
                  <p className="text-xs text-[#736C62] mb-6">
                    Gemiddeld aantal personen per woning
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EDE8DD]">
                      <span className="text-xs text-[#736C62] font-medium">2015:</span>
                      <span className="text-base font-bold text-[#161916]">2,31 personen</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#E8F4EC] border border-[#C2E2CB]">
                      <span className="text-xs text-[#2C6E3D] font-bold">2025 (Huidig):</span>
                      <span className="text-lg font-extrabold text-[#2C6E3D]">2,21 personen</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EDE8DD]">
                      <span className="text-xs text-[#736C62] font-medium">2050 (Prognose):</span>
                      <span className="text-base font-bold text-[#161916]">2,08 personen</span>
                    </div>
                  </div>
                </div>

                {/* Callout matching Image 4 */}
                <div className="mt-6 p-4 rounded-xl bg-[#FAF8F3] border border-[#EDE8DD]">
                  <p className="text-xs text-[#555047] leading-relaxed">
                    📌 <strong className="text-[#161916]">Beleidsimplicatie:</strong> Zelfs bij een gematigd
                    inwoneraantal zijn er substantieel meer woningen nodig door huishoudensverdunning. De vraag
                    verschuift sterk naar 1- en 2-persoonswoningen, seniorenhofjes en compacte starterswoningen om verhuisstromen op gang te brengen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: BENCHMARK & REGIO
        ========================================================================= */}
        {activeTab === 'benchmark' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
              <span className="text-[10px] font-mono-subtle uppercase tracking-wider font-bold text-[#1967B2] bg-[#EBF3FB] px-2 py-0.5 rounded border border-[#C9E0F6] inline-block mb-1.5">
                REGIONAL BENCHMARK
              </span>
              <h2 className="text-lg font-bold text-[#161916]">
                Gemeente De Bilt t.o.v. Regio Utrecht (U10) en Nederland
              </h2>
              <p className="text-xs text-[#736C62] mt-0.5">
                Vergelijking van marktdruk, betaalbaarheid, eigendom en vergrijzing
              </p>
            </div>

            {/* Benchmark Comparative Table & Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENCHMARK_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono-subtle text-[#8C8477] uppercase font-bold block mb-2">
                      {item.bron}
                    </span>
                    <h4 className="text-base font-bold text-[#161916] mb-4">
                      {item.indicator}
                    </h4>

                    {/* Metric comparison bars/grid */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#E8F4EC] border border-[#C2E2CB]">
                        <span className="text-xs font-bold text-[#2C6E3D]">Gemeente De Bilt:</span>
                        <span className="text-sm font-extrabold text-[#2C6E3D]">{item.deBilt}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F3] border border-[#EDE8DD]">
                        <span className="text-xs text-[#736C62]">Regio Utrecht (U10):</span>
                        <span className="text-xs font-semibold text-[#161916]">{item.regioUtrecht}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F3] border border-[#EDE8DD]">
                        <span className="text-xs text-[#736C62]">Nederland gemiddeld:</span>
                        <span className="text-xs font-semibold text-[#161916]">{item.nederland}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#555047] leading-relaxed pt-3 border-t border-[#F0ECE2]">
                    💡 {item.toelichting}
                  </p>
                </div>
              ))}
            </div>

            {/* Regional Policy Context */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-xs">
              <h3 className="text-base font-bold text-[#161916] mb-2">
                Conclusie voor Gebiedsverkenning Dorpsrand Hollandsche Rading
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#555047] leading-relaxed mt-4">
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EDE8DD]">
                  <strong className="block text-[#161916] text-sm mb-1.5">1. Doorstroming Senioren</strong>
                  Hollandsche Rading kent een sterk vergrijzende bevolking in ruime vrijstaande woningen. Door levensloopbestendige hofwoningen te realiseren ontstaat er verhuisbereidheid en komen gezinswoningen vrij.
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EDE8DD]">
                  <strong className="block text-[#161916] text-sm mb-1.5">2. Kansen voor Jonge Dorpsbewoners</strong>
                  Jongeren die in het dorp zijn opgegroeid kunnen thans niet doorstromen wegens extreem hoge koopprijzen (€ 598.000 gemiddeld). Betaalbare startersappartementen of compacte dorpswoningen zijn essentieel.
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EDE8DD]">
                  <strong className="block text-[#161916] text-sm mb-1.5">3. Behoud Groen &amp; Dorpsidentiteit</strong>
                  Uit de benchmark en participatie blijkt dat vergroting van de woningvoorraad alleen draagvlak heeft als dit kleinschalig gebeurt, ingebed in de bossen en zonder aantasting van het open landschap en dorpskarakter.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Woonwens Doorgeven */}
      {isWoonwensModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D5CDC0] relative">
            <button
              onClick={() => setIsWoonwensModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F2EDE2] text-[#736C62] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E8F4EC] text-[#2C6E3D] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#161916]">
                  Geef uw Woonwens Door
                </h3>
                <p className="text-xs text-[#736C62]">
                  Help ons in kaart brengen welke woningen gemist worden in Hollandsche Rading
                </p>
              </div>
            </div>

            {woonwensSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#2C6E3D] mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-[#161916]">
                  Hartelijk dank voor uw woonwens!
                </h4>
                <p className="text-xs text-[#736C62]">
                  Uw woonwens is direct opgenomen in de Participatiemonitor en telt mee voor 100% als woningzoekende in de dorpsstatistieken.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWoonwensSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#161916] mb-1">
                    Uw Doelgroep
                  </label>
                  <select
                    value={woonwensForm.doelgroep}
                    onChange={(e) => setWoonwensForm({ ...woonwensForm, doelgroep: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D5CDC0] bg-[#FAF8F3] text-[#161916]"
                  >
                    <option value="Starter (alleenstaand of stel)">Starter (alleenstaand of stel)</option>
                    <option value="Senior / Doorstromer (levensloopbestendig)">Senior / Doorstromer (levensloopbestendig)</option>
                    <option value="Jong gezin">Jong gezin</option>
                    <option value="Zorgbehoevende / Beschut wonen">Zorgbehoevende / Beschut wonen</option>
                    <option value="Dorpsbewoner met terugkeerwens">Dorpsbewoner met terugkeerwens</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161916] mb-1">
                    Gewenst Type Woning
                  </label>
                  <select
                    value={woonwensForm.woningtype}
                    onChange={(e) => setWoonwensForm({ ...woonwensForm, woningtype: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D5CDC0] bg-[#FAF8F3] text-[#161916]"
                  >
                    <option value="Compacte starterswoning (tot 75 m²)">Compacte starterswoning (tot 75 m²)</option>
                    <option value="Levensloopbestendige hofwoning (gelijkvloers, 75-100 m²)">Levensloopbestendige hofwoning (gelijkvloers, 75-100 m²)</option>
                    <option value="Appartement nabij het station">Appartement nabij het station</option>
                    <option value="Betaalbare eengezinswoning (100-120 m²)">Betaalbare eengezinswoning (100-120 m²)</option>
                    <option value="CPO / Collectief particulier bouwen in het groen">CPO / Collectief particulier bouwen in het groen</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161916] mb-1">
                    Financiële Prijsklasse
                  </label>
                  <select
                    value={woonwensForm.prijsklasse}
                    onChange={(e) => setWoonwensForm({ ...woonwensForm, prijsklasse: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D5CDC0] bg-[#FAF8F3] text-[#161916]"
                  >
                    <option value="Sociale huur (tot € 879/mnd)">Sociale huur (tot € 879/mnd)</option>
                    <option value="Middenhuur (€ 879 - € 1.150/mnd)">Middenhuur (€ 879 - € 1.150/mnd)</option>
                    <option value="Betaalbare koop (< € 390.000 NHG-grens)">Betaalbare koop (&lt; € 390.000 NHG-grens)</option>
                    <option value="Middelduur koop (€ 390.000 - € 500.000)">Middelduur koop (€ 390.000 - € 500.000)</option>
                    <option value="Vrijesector koop (> € 500.000)">Vrijesector koop (&gt; € 500.000)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161916] mb-1">
                    Toelichting of specifieke wensen (optioneel)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Bijv. tuin, balkon, liftvoorziening, gemeenschappelijke binnentuin..."
                    value={woonwensForm.toelichting}
                    onChange={(e) => setWoonwensForm({ ...woonwensForm, toelichting: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#D5CDC0] bg-[#FAF8F3] text-[#161916]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#161916] mb-1">
                      Uw Naam (optioneel)
                    </label>
                    <input
                      type="text"
                      placeholder="Bijv. Jan de Vries"
                      value={woonwensForm.naam}
                      onChange={(e) => setWoonwensForm({ ...woonwensForm, naam: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#D5CDC0] bg-[#FAF8F3]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#161916] mb-1">
                      E-mailadres (optioneel)
                    </label>
                    <input
                      type="email"
                      placeholder="naam@voorbeeld.nl"
                      value={woonwensForm.email}
                      onChange={(e) => setWoonwensForm({ ...woonwensForm, email: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#D5CDC0] bg-[#FAF8F3]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWoonwensModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-[#736C62] hover:bg-[#F2EDE2]"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#3D5A45] hover:bg-[#2C4030] text-white font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Versturen</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
