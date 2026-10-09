/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { SectionPlek } from './components/SectionPlek';
import { SectionStorySequence } from './components/SectionStorySequence';
import { SectionPrioriteiten } from './components/SectionPrioriteiten';
import { SectionInteractieveKaart } from './components/SectionInteractieveKaart';
import { SectionDenkrichtingen } from './components/SectionDenkrichtingen';
import { SectionDoelgroepen } from './components/SectionDoelgroepen';
import { SectionWatMoetBlijven } from './components/SectionWatMoetBlijven';
import { SectionParticipatieDashboard } from './components/SectionParticipatieDashboard';
import { SectionProces } from './components/SectionProces';
import { SectionAgendaDocumenten } from './components/SectionAgendaDocumenten';
import { SectionFAQ } from './components/SectionFAQ';
import { SectionContactFooter } from './components/SectionContactFooter';
import { AdminPanel } from './components/AdminPanel';
import { SysteembeheerModal } from './components/SysteembeheerModal';
import { SysteembeheerBar } from './components/SysteembeheerBar';
import { NewsletterModal } from './components/NewsletterModal';
import { WoningmarktDashboard } from './components/woondata/WoningmarktDashboard';
import { OmgevingswetPage } from './components/omgevingswet/OmgevingswetPage';
import { LegalModal, LegalTab } from './components/legal/LegalModal';
import { CookieBanner } from './components/legal/CookieBanner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'verkenning' | 'woondata' | 'omgevingswet' | 'kaart'>('verkenning');
  const [isSysteembeheerOpen, setIsSysteembeheerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');

  // Support direct `/admin`, `#admin`, `#woondata`, `#omgevingswet`, `#kaart`, or legal hash routing
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminOpen(true);
      }
      if (window.location.hash === '#woondata' || window.location.pathname === '/woondata') {
        setCurrentPage('woondata');
      } else if (window.location.hash === '#omgevingswet' || window.location.pathname === '/omgevingswet') {
        setCurrentPage('omgevingswet');
      } else if (
        window.location.hash === '#kaart' ||
        window.location.hash === '#interactieve-kaart' ||
        window.location.hash === '#gebiedskaart' ||
        window.location.pathname === '/kaart'
      ) {
        setCurrentPage('kaart');
      } else if (window.location.hash === '#privacy') {
        setLegalTab('privacy');
        setIsLegalOpen(true);
      } else if (window.location.hash === '#cookies' || window.location.hash === '#cookiebeleid') {
        setLegalTab('cookies');
        setIsLegalOpen(true);
      } else if (window.location.hash === '#disclaimer') {
        setLegalTab('disclaimer');
        setIsLegalOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenWoondata = () => {
    setCurrentPage('woondata');
    window.location.hash = '#woondata';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOmgevingswet = () => {
    setCurrentPage('omgevingswet');
    window.location.hash = '#omgevingswet';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenKaart = () => {
    setCurrentPage('kaart');
    window.location.hash = '#kaart';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const handleBackToVerkenning = () => {
    setCurrentPage('verkenning');
    if (
      window.location.hash === '#woondata' ||
      window.location.hash === '#omgevingswet' ||
      window.location.hash === '#kaart' ||
      window.location.hash === '#interactieve-kaart' ||
      window.location.hash === '#gebiedskaart'
    ) {
      history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleParticipateClick = () => {
    if (currentPage !== 'verkenning') {
      setCurrentPage('verkenning');
    }
    setTimeout(() => {
      const el = document.getElementById('participatie');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1D1A] selection:bg-[#3D5A45] selection:text-white font-sans">
      {/* Cinematic Entrance Preloader */}
      <Preloader />

      {currentPage === 'omgevingswet' ? (
        <OmgevingswetPage
          onBack={handleBackToVerkenning}
          onNavigateToParticipatie={() => {
            handleBackToVerkenning();
            setTimeout(handleParticipateClick, 100);
          }}
        />
      ) : currentPage === 'woondata' ? (
        <WoningmarktDashboard
          onBack={handleBackToVerkenning}
          onNavigateToParticipatie={() => {
            handleBackToVerkenning();
            setTimeout(handleParticipateClick, 100);
          }}
        />
      ) : currentPage === 'kaart' ? (
        <SectionInteractieveKaart
          isStandalonePage={true}
          onBack={handleBackToVerkenning}
          onOpenWoondata={handleOpenWoondata}
          onOpenNewsletter={() => setIsNewsletterOpen(true)}
        />
      ) : (
        <>
          {/* Global Navigation */}
          <Navigation
            onOpenAdmin={() => setIsSysteembeheerOpen(true)}
            onOpenNewsletter={() => setIsNewsletterOpen(true)}
            onOpenKaart={handleOpenKaart}
            onOpenWoondata={handleOpenWoondata}
            onOpenOmgevingswet={handleOpenOmgevingswet}
            currentPage={currentPage}
          />

          <main>
            {/* Section: Cinematic Hero */}
            <Hero
              onWoondataClick={handleOpenWoondata}
              onParticipateClick={handleParticipateClick}
            />

            {/* Section 01: De Plek (Leaflet map with layers) */}
            <SectionPlek />

            {/* Section 02: Waarom deze verkenning? (Storytelling sequence: Wonen, Landschap, Verkeer, Water, Natuur, Energie) */}
            <SectionStorySequence />

            {/* Section 03: Participatie Prioriteiten (Max 5, real aggregates) */}
            <SectionPrioriteiten />

            {/* Section 04: Drie Denkrichtingen (Richting A, B, C) */}
            <SectionDenkrichtingen />

            {/* Section 05: Doelgroepen (Voor wie mist Hollandsche Rading woningen?) */}
            <SectionDoelgroepen />

            {/* Section: Wat Moet Blijven? (Emotional values & identity) */}
            <SectionWatMoetBlijven />

            {/* Section 06: Het Proces (7 fasen, We zijn hier) */}
            <SectionProces onOpenOmgevingswet={handleOpenOmgevingswet} />

            {/* Section 07 & 08: Bijeenkomsten, Agenda & Gemeentelijk Beleidskader */}
            <SectionAgendaDocumenten />

            {/* Section 09: Participatiemonitor & Voortgang (Dashboard) */}
            <SectionParticipatieDashboard />

            {/* Section 10: Veelgestelde Vragen (FAQ) */}
            <SectionFAQ />
          </main>

          {/* Section: Newsletter, Direct Question & Footer */}
          <SectionContactFooter
            onOpenAdmin={() => setIsSysteembeheerOpen(true)}
            onOpenLegal={handleOpenLegal}
          />
        </>
      )}

      {/* Floating Nieuwsbrief Button (Links onderin, beweegt continu mee over de website) */}
      <button
        type="button"
        onClick={() => setIsNewsletterOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#1A1D1A]/95 hover:bg-[#252E25] text-[#FBF9F5] border border-[#3D5A45] hover:border-[#4ADE80] shadow-2xl hover:shadow-[#3D5A45]/30 rounded-full pl-3.5 pr-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold transition-all duration-200 group active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="Aanmelden dorpsnieuwsbrief"
        title="Blijf op de hoogte via de dorpsnieuwsbrief"
        id="floating-newsletter-btn"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]"></span>
        </span>
        <Mail className="w-4 h-4 text-[#85A38C] group-hover:text-[#4ADE80] transition-colors shrink-0" />
        <span className="tracking-tight text-white font-medium">Nieuwsbrief</span>
      </button>

      {/* Systeembeheer Toegang & Downloads Modal */}
      <SysteembeheerModal
        isOpen={isSysteembeheerOpen}
        onClose={() => setIsSysteembeheerOpen(false)}
        onOpenFullAdmin={() => {
          setIsSysteembeheerOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Full Admin Panel Dialog (/admin) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating Systeembeheerder Quick Action Bar (Visible only when system admin mode is active) */}
      <SysteembeheerBar onOpenSysteembeheer={() => setIsSysteembeheerOpen(true)} />

      {/* Quick Newsletter Modal */}
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      {/* Legal & AVG Gegevensbescherming Modal (Privacy, Cookies & Disclaimer) */}
      <LegalModal
        isOpen={isLegalOpen}
        initialTab={legalTab}
        onClose={() => {
          setIsLegalOpen(false);
          if (
            window.location.hash === '#privacy' ||
            window.location.hash === '#cookies' ||
            window.location.hash === '#cookiebeleid' ||
            window.location.hash === '#disclaimer'
          ) {
            history.pushState(null, '', window.location.pathname);
          }
        }}
      />

      {/* Privacy-first Cookie Banner (Conform AVG & Telecommunicatiewet) */}
      <CookieBanner
        onOpenCookiePolicy={() => handleOpenLegal('cookies')}
        onOpenPrivacyPolicy={() => handleOpenLegal('privacy')}
      />
    </div>
  );
}
