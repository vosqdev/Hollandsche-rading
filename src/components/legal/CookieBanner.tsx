import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, SlidersHorizontal } from 'lucide-react';
import { store } from '../../services/store';

interface CookieBannerProps {
  onOpenCookiePolicy: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onOpenCookiePolicy,
  onOpenPrivacyPolicy,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const hasAnswered = store.hasAnsweredCookieConsent();
    if (!hasAnswered) {
      // Small delay for smooth arrival after preloader
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    store.setCookieConsent(true);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    store.setCookieConsent(false);
    setIsVisible(false);
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 sm:max-w-2xl sm:ml-auto z-40 animate-in slide-in-from-bottom-4 duration-300"
      role="region"
      aria-label="Cookie & Privacy Melding"
    >
      <div className="bg-[#1A1D1A]/95 text-[#FBF9F5] backdrop-blur-md border border-[#3A403A] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3D5A45] text-white flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                Privacyvriendelijk &amp; Zonder Advertenties
              </h4>
              <span className="text-[10px] text-[#A7B3A9] font-mono-subtle">
                Ontwikkeld door Vovon Development
              </span>
            </div>
          </div>

          <button
            onClick={handleAcceptNecessary}
            className="text-[#888] hover:text-white p-1 rounded-md transition-colors"
            title="Sluiten en alleen noodzakelijke functies gebruiken"
            aria-label="Sluit cookie melding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-[#D5CDC0] font-light leading-relaxed">
          Wij gebruiken uitsluitend <strong>noodzakelijke lokale opslag</strong> zodat de interactieve dorpskaart en peilingen goed werken. We plaatsen <strong>géén tracking cookies</strong> en verkopen geen gegevens.{' '}
          <button
            onClick={onOpenPrivacyPolicy}
            className="text-[#85A38C] hover:text-white underline underline-offset-2 transition-colors font-normal"
          >
            Lees onze privacyverklaring
          </button>.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#2D332D]">
          <button
            onClick={onOpenCookiePolicy}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#A7B3A9] hover:text-white transition-colors py-1"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#85A38C]" />
            <span>Voorkeuren aanpassen</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleAcceptNecessary}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-[#242824] hover:bg-[#2F352F] text-white text-xs font-medium border border-[#3A403A] transition-colors text-center"
            >
              Alleen Noodzakelijk
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-[#3D5A45] hover:bg-[#2C4030] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs text-center"
            >
              <Check className="w-3 h-3 text-[#A3B8A8]" />
              <span>Alles Accepteren</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
