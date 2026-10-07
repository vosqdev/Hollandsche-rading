import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Shield, ArrowUp, Compass, Lock, Cookie, Scale } from 'lucide-react';
import { store } from '../services/store';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenLegal?: (tab: 'privacy' | 'cookies' | 'disclaimer') => void;
}

export const SectionContactFooter: React.FC<FooterProps> = ({ onOpenAdmin, onOpenLegal }) => {
  const [email, setEmail] = useState('');
  const [isResident, setIsResident] = useState(true);
  const [keepUpdated, setKeepUpdated] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Direct question state
  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    store.subscribeNewsletter(email, isResident, keepUpdated);
    setSubmitted(true);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionEmail || !questionText) return;

    store.addResponse({
      participantId: store.getParticipant().id,
      type: 'contact_vraag',
      customText: `[Vraag van ${questionName || 'Inwoner'} (${questionEmail})]: ${questionText}`,
    });

    setQuestionSubmitted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#1A1D1A] text-[#FBF9F5] border-t border-[#2C302C] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Top Split: Newsletter & Direct Question */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-[#333]">
          {/* Newsletter Box */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block">
              Nieuwsbrief
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-[#FBF9F5]">
              Blijf op de hoogte van het
              <span className="font-editorial italic text-[#85A38C]"> participatieverslag.</span>
            </h3>
            <p className="text-sm text-[#D5CDC0] font-light leading-relaxed">
              We sturen uitsluitend updates over openbare dorpsbijeenkomsten, de publicatie van het participatiedocument en besluitvorming in de raad.
            </p>

            {!submitted ? (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Jouw e-mailadres..."
                    className="flex-1 px-4 py-3.5 rounded-xl bg-[#242824] border border-[#3A403A] text-sm text-[#FBF9F5] focus:outline-none focus:border-[#85A38C]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-[#3D5A45] hover:bg-[#2F4535] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Inschrijven</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-1 text-xs text-[#A39182]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isResident}
                      onChange={(e) => setIsResident(e.target.checked)}
                      className="rounded-sm accent-[#3D5A45]"
                    />
                    <span>Ik woon of werk in (de omgeving van) Hollandsche Rading</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepUpdated}
                      onChange={(e) => setKeepUpdated(e.target.checked)}
                      className="rounded-sm accent-[#3D5A45]"
                    />
                    <span>Houd mij op de hoogte van fysieke bijeenkomsten</span>
                  </label>
                </div>
              </form>
            ) : (
              <div className="p-5 rounded-xl bg-[#242824] border border-[#3D5A45] flex items-center gap-3 text-xs sm:text-sm text-[#85A38C]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Bedankt! Je e-mailadres is aangemeld. Zodra er een update is ontvang je bericht.</span>
              </div>
            )}
          </div>

          {/* Direct Question Form */}
          <div className="lg:col-span-6 bg-[#242824] border border-[#3A403A] rounded-2xl p-6 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block">
              Contact met het team
            </span>
            <h4 className="text-xl font-light text-[#FBF9F5]">
              Heb je een specifieke vraag of toelichting?
            </h4>
            <p className="text-xs text-[#D5CDC0] font-light">
              Het participatieteam beantwoordt inhoudelijke vragen over de verkenning en procedure.
            </p>

            {!questionSubmitted ? (
              <form onSubmit={handleQuestionSubmit} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={questionName}
                    onChange={(e) => setQuestionName(e.target.value)}
                    placeholder="Naam"
                    className="px-3.5 py-2.5 rounded-lg bg-[#1A1D1A] border border-[#3A403A] text-xs text-[#FBF9F5]"
                  />
                  <input
                    type="email"
                    required
                    value={questionEmail}
                    onChange={(e) => setQuestionEmail(e.target.value)}
                    placeholder="E-mailadres *"
                    className="px-3.5 py-2.5 rounded-lg bg-[#1A1D1A] border border-[#3A403A] text-xs text-[#FBF9F5]"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Stel hier je vraag..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1A1D1A] border border-[#3A403A] text-xs text-[#FBF9F5] focus:outline-none focus:border-[#85A38C]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Verstuur vraag</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-[#1A1D1A] text-xs text-[#85A38C] flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vraag verzonden! We nemen zo spoedig mogelijk contact op.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Editorial Branding & Links */}
        <div className="pt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#85A38C]" />
              <span className="text-base font-bold tracking-tight text-[#FBF9F5]">
                Dorpsrand Hollandsche Rading
              </span>
            </div>
            <p className="text-xs text-[#8C7B6B] leading-relaxed max-w-sm">
              Een open, transparante gebiedsverkenning naar de toekomst van de dorpsrand ten oosten van de Tolakkerweg (N417), in de gemeente De Bilt.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs text-[#D5CDC0]">
            <span className="font-mono-subtle uppercase text-[#8C7B6B] block mb-2">
              Navigatie
            </span>
            <div className="flex flex-col space-y-1.5">
              <a href="#de-plek" className="hover:text-[#85A38C] transition-colors">
                01 · De Plek
              </a>
              <a href="#waarom-deze-verkenning" className="hover:text-[#85A38C] transition-colors">
                02 · Waarom deze verkenning
              </a>
              <a href="#participatie" className="hover:text-[#85A38C] transition-colors">
                03 · Participatie Prioriteiten
              </a>
              <a href="#interactieve-kaart" className="hover:text-[#85A38C] transition-colors">
                04 · Interactieve Kaart
              </a>
              <a href="#denkrichtingen" className="hover:text-[#85A38C] transition-colors">
                05 · Denkrichtingen
              </a>
              <a href="#doelgroepen" className="hover:text-[#85A38C] transition-colors">
                06 · Doelgroepen
              </a>
              <a href="#proces" className="hover:text-[#85A38C] transition-colors">
                07 · Proces &amp; Fasering
              </a>
              <a href="#agenda" className="hover:text-[#85A38C] transition-colors">
                08 · Agenda &amp; Bijeenkomsten
              </a>
              <a href="#documenten" className="hover:text-[#85A38C] transition-colors">
                09 · Documenten &amp; Kaders
              </a>
              <a href="#participatie-dashboard" className="hover:text-[#85A38C] transition-colors">
                10 · Participatiemonitor
              </a>
              <a href="#faq" className="hover:text-[#85A38C] transition-colors">
                11 · Veelgestelde Vragen
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs text-[#D5CDC0]">
            <span className="font-mono-subtle uppercase text-[#8C7B6B] block mb-2">
              Privacy &amp; Informatie
            </span>
            <div className="flex flex-col space-y-1.5">
              <button
                type="button"
                onClick={() => onOpenLegal && onOpenLegal('privacy')}
                className="hover:text-[#85A38C] transition-colors text-left flex items-center gap-1.5"
                id="footer-privacy-btn"
              >
                <Lock className="w-3 h-3 text-[#85A38C]" />
                <span>Privacyverklaring</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal && onOpenLegal('cookies')}
                className="hover:text-[#85A38C] transition-colors text-left flex items-center gap-1.5"
                id="footer-cookie-btn"
              >
                <Cookie className="w-3 h-3 text-[#85A38C]" />
                <span>Cookies &amp; Voorkeuren</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal && onOpenLegal('disclaimer')}
                className="hover:text-[#85A38C] transition-colors text-left flex items-center gap-1.5"
                id="footer-disclaimer-btn"
              >
                <Scale className="w-3 h-3 text-[#85A38C]" />
                <span>Disclaimer &amp; Spelregels</span>
              </button>
              <div className="pt-2 text-[11px] text-[#8C7B6B] leading-snug">
                Website gebouwd door Vovon Development. Vragen of opmerkingen? Mail naar{' '}
                <a href="mailto:info@vovon.nl" className="text-[#85A38C] underline hover:text-white">
                  info@vovon.nl
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 text-xs text-[#D5CDC0]">
            <span className="font-mono-subtle uppercase text-[#8C7B6B] block mb-2">
              Beheer &amp; Systeem
            </span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#242824] border border-[#3A403A] text-xs text-[#85A38C] hover:text-white hover:border-[#85A38C] transition-colors w-full justify-center"
              id="footer-admin-btn"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Beheeromgeving</span>
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#242824] border border-[#3A403A] text-xs text-[#D5CDC0] hover:text-white transition-colors w-full justify-center"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Terug naar boven</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-14 pt-8 border-t border-[#2C302C] text-[11px] text-[#736B63] font-light leading-relaxed flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <p>
              <strong>Verkennende status:</strong> Dit is een onafhankelijk participatieplatform in het kader van de dorpsrandverkenning Hollandsche Rading (Fase 1: Verkenning &amp; Luisteren). Er kunnen geen rechten worden ontleend aan de getoonde impressies of voorlopige denkrichtingen.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[#8C7B6B]">
              <button
                type="button"
                onClick={() => onOpenLegal && onOpenLegal('privacy')}
                className="hover:text-white underline underline-offset-2 transition-colors"
              >
                Privacyverklaring
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenLegal && onOpenLegal('cookies')}
                className="hover:text-white underline underline-offset-2 transition-colors"
              >
                Cookies &amp; Voorkeuren
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenLegal && onOpenLegal('disclaimer')}
                className="hover:text-white underline underline-offset-2 transition-colors"
              >
                Disclaimer &amp; Spelregels
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1 shrink-0 text-[#8C7B6B]">
            <span>© 2026 Gebiedsverkenning Hollandsche Rading</span>
            <span className="text-[10px] text-[#736B63]">
              Gemaakt door <span className="text-[#A7B3A9]">Vovon Development</span> (<a href="mailto:info@vovon.nl" className="hover:text-[#85A38C] underline">info@vovon.nl</a>)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
