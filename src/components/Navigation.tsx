import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Shield,
  BarChart3,
  ChevronDown,
  ArrowUpRight,
  Calendar,
  FileText,
  Clock,
  HelpCircle,
  Users,
  MapPin,
} from 'lucide-react';
import { store } from '../services/store';
import { ProjectSettings } from '../types';

interface NavigationProps {
  onOpenAdmin: () => void;
  onOpenNewsletter: () => void;
  onOpenKaart: () => void;
  onOpenWoondata?: () => void;
  onOpenOmgevingswet?: () => void;
  currentPage?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenAdmin,
  onOpenNewsletter,
  onOpenKaart,
  onOpenWoondata,
  currentPage,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('de-plek');
  const [settings, setSettings] = useState<ProjectSettings>(store.getSettings());
  const [isSystemAdmin, setIsSystemAdmin] = useState<boolean>(store.isSystemAdmin());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Track active section and scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect current section on viewport (chapters 01 - 10)
      const sections = [
        'de-plek',
        'waarom-deze-verkenning',
        'participatie',
        'denkrichtingen',
        'doelgroepen',
        'proces',
        'agenda',
        'documenten',
        'participatie-dashboard',
        'faq',
      ];

      const scrollPos = window.scrollY + 140;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const unsub = store.subscribe(() => {
      setSettings(store.getSettings());
      setIsSystemAdmin(store.isSystemAdmin());
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  // Primary navigation items (chapters 01 - 05 in sequential order)
  const primaryLinks = [
    { id: 'de-plek', number: '01', label: 'De Plek', href: '#de-plek' },
    { id: 'waarom-deze-verkenning', number: '02', label: 'Opgaven', href: '#waarom-deze-verkenning' },
    { id: 'participatie', number: '03', label: 'Participatie', href: '#participatie' },
    { id: 'denkrichtingen', number: '04', label: 'Denkrichtingen', href: '#denkrichtingen' },
    { id: 'doelgroepen', number: '05', label: 'Doelgroepen', href: '#doelgroepen' },
  ];

  // Secondary items under 'Meer' dropdown (chapters 06 - 10 in sequential order)
  const moreLinks = [
    { id: 'proces', number: '06', label: 'Proces & Fasering', href: '#proces', icon: Clock },
    { id: 'agenda', number: '07', label: 'Agenda & Bijeenkomsten', href: '#agenda', icon: Calendar },
    { id: 'documenten', number: '08', label: 'Documenten & Beleid', href: '#documenten', icon: FileText },
    { id: 'participatie-dashboard', number: '09', label: 'Participatiemonitor', href: '#participatie-dashboard', icon: BarChart3 },
    { id: 'faq', number: '10', label: 'Veelgestelde Vragen', href: '#faq', icon: HelpCircle },
  ];

  const isMoreActive = moreLinks.some((l) => l.id === activeSection);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
          scrolled
            ? 'bg-[#FBF9F5]/95 backdrop-blur-md border-[#E2DDD2] shadow-xs'
            : 'bg-[#FBF9F5]/90 backdrop-blur-xs border-[#E5DFD5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[76px] flex items-center justify-between gap-6">
          {/* ZONE 1: Links - Compact merkblok */}
          <a
            href="#"
            className="group flex flex-col justify-center shrink-0 focus:outline-none select-none"
            id="nav-logo-link"
          >
            <span className="text-[10px] sm:text-[11px] font-mono-subtle uppercase tracking-[0.22em] text-[#8C7B6B] font-semibold group-hover:text-[#3D5A45] transition-colors leading-none">
              HOLLANDSCHE RADING
            </span>
            <span className="text-base sm:text-[17px] font-bold tracking-tight text-[#1A1D1A] leading-tight mt-0.5">
              Dorpsrandverkenning
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#5A6059] font-mono-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A45] animate-pulse" />
              <span>Fase {settings.currentPhase} · {settings.phaseName || 'Luisteren'}</span>
            </div>
          </a>

          {/* ZONE 2: Midden - Primaire navigatie + 'Meer' dropdown */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-[15px] font-medium text-[#4A4F49] h-full">
            {primaryLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md transition-all relative font-normal hover:text-[#1A1D1A] ${
                    isActive
                      ? 'text-[#1A1D1A] font-semibold'
                      : 'text-[#4A4F49] hover:bg-[#F2ECE1]/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-[-18px] left-3 right-3 h-[2px] bg-[#3D5A45] rounded-full" />
                  )}
                </a>
              );
            })}

            {/* 'Meer' dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 hover:text-[#1A1D1A] ${
                  isMoreActive || dropdownOpen
                    ? 'text-[#1A1D1A] font-semibold bg-[#F2ECE1]/60'
                    : 'text-[#4A4F49] hover:bg-[#F2ECE1]/60'
                }`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Meer</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#736B63] transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-[#1A1D1A]' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#FBF9F5] border border-[#D5CDC0] shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-mono-subtle uppercase tracking-wider text-[#8C7B6B] border-b border-[#EAE4D7] mb-1 font-semibold flex items-center justify-between">
                    <span>Onderdelen</span>
                    <span>06 – 10</span>
                  </div>

                  {moreLinks.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeSection === subItem.id;
                    return (
                      <a
                        key={subItem.id}
                        href={subItem.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors ${
                          isSubActive
                            ? 'bg-[#EAE4D7] text-[#1A1D1A] font-medium'
                            : 'text-[#4A4F49] hover:bg-[#F2ECE1] hover:text-[#1A1D1A]'
                        }`}
                      >
                        <SubIcon className="w-4 h-4 text-[#736B63] shrink-0" />
                        <span className="text-[11px] font-mono-subtle text-[#8C7B6B] font-semibold w-5 shrink-0">
                          {subItem.number}
                        </span>
                        <span className="truncate">{subItem.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ZONE 3: Rechts - Acties (Woondata, Interactieve Kaart, Beheer) */}
          <div className="hidden sm:flex items-center space-x-2.5 shrink-0">
            {/* Secundaire Outlined Button: Woondata */}
            {onOpenWoondata && (
              <button
                type="button"
                onClick={onOpenWoondata}
                className="px-3.5 py-2 rounded-lg border border-[#D5CDC0] hover:border-[#1A1D1A] bg-transparent hover:bg-[#EAE4D7]/70 text-[#1A1D1A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                id="nav-woondata-btn"
                title="Woningmarkt Dashboard De Bilt & Hollandsche Rading"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#3D5A45]" />
                <span>Woondata</span>
              </button>
            )}

            {/* Primaire Groene CTA: Interactieve Kaart */}
            <button
              type="button"
              onClick={onOpenKaart}
              className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm ${
                currentPage === 'kaart'
                  ? 'bg-[#2E4733] text-[#DCFCE7] ring-2 ring-[#4ADE80]'
                  : 'bg-[#3D5A45] hover:bg-[#2C4030] text-white'
              }`}
              id="nav-kaart-btn"
              title="Open de Interactieve Gebiedskaart & Woningbouwprojecten"
            >
              <MapPin className="w-3.5 h-3.5 text-[#A3B8A8]" />
              <span>Interactieve Kaart</span>
            </button>

            {/* Tertiary Rustige Button met Shield: Beheer */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs ${
                isSystemAdmin
                  ? 'border-[#3D5A45] bg-[#E3ECE5] text-[#2C4030]'
                  : 'border-transparent text-[#736B63] hover:text-[#1A1D1A] hover:bg-[#EAE4D7]/60'
              }`}
              title={isSystemAdmin ? 'Systeembeheerder Actief' : 'Systeembeheer Toegang'}
              id="nav-admin-btn"
              aria-label="Systeembeheer"
            >
              <Shield className={`w-4 h-4 ${isSystemAdmin ? 'text-[#3D5A45]' : 'text-[#736B63]'}`} />
              {isSystemAdmin && (
                <span className="hidden xl:inline text-[11px] font-mono-subtle font-medium text-[#2C4030]">
                  Beheer
                </span>
              )}
            </button>
          </div>

          {/* Tablet & Mobile Right Trigger: Hamburger + Admin */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenAdmin}
              className={`p-2 rounded-lg border transition-colors ${
                isSystemAdmin
                  ? 'border-[#3D5A45] bg-[#E3ECE5] text-[#2C4030]'
                  : 'border-transparent text-[#736B63] hover:bg-[#EAE4D7]'
              }`}
              title="Systeembeheer Toegang"
            >
              <Shield className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1A1D1A] hover:bg-[#EAE4D7] border border-[#D5CDC0] transition-colors"
              aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Fullscreen/Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[76px] z-30 bg-[#FBF9F5] border-b border-[#E2DDD2] p-6 flex flex-col justify-between overflow-y-auto lg:hidden animate-in fade-in duration-200">
          <div className="space-y-6">
            {/* Primary navigation list */}
            <div>
              <span className="text-[10px] font-mono-subtle uppercase tracking-wider text-[#8C7B6B] block mb-2 font-semibold flex items-center justify-between">
                <span>Onderdelen</span>
                <span>01 – 05</span>
              </span>
              <div className="space-y-1">
                {primaryLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-base font-medium text-[#1A1D1A] hover:bg-[#EAE4D7] transition-colors"
                  >
                    <span className="text-xs font-mono-subtle text-[#8C7B6B] font-semibold w-6 shrink-0">
                      {item.number}
                    </span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Meer section */}
            <div className="pt-4 border-t border-[#E2DDD2]">
              <span className="text-[10px] font-mono-subtle uppercase tracking-wider text-[#8C7B6B] block mb-2 font-semibold flex items-center justify-between">
                <span>Vervolg Onderdelen</span>
                <span>06 – 10</span>
              </span>
              <div className="space-y-1">
                {moreLinks.map((subItem) => (
                  <a
                    key={subItem.id}
                    href={subItem.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm text-[#4A4F49] hover:bg-[#EAE4D7] transition-colors"
                  >
                    <span className="text-xs font-mono-subtle text-[#8C7B6B] font-semibold w-6 shrink-0">
                      {subItem.number}
                    </span>
                    <span>{subItem.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons at bottom of mobile menu */}
          <div className="pt-6 border-t border-[#E2DDD2] flex flex-col gap-3">
            {onOpenWoondata && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWoondata();
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#D5CDC0] text-[#1A1D1A] font-semibold text-sm flex items-center justify-center gap-2 bg-[#F4F0E8] hover:bg-[#EAE4D7] transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-[#3D5A45]" />
                <span>Bekijk Woondata</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenKaart();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#3D5A45] hover:bg-[#2C4030] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              id="mobile-nav-kaart-btn"
            >
              <MapPin className="w-4 h-4 text-[#A3B8A8]" />
              <span>Open Interactieve Gebiedskaart</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl border border-transparent text-[#736B63] hover:text-[#1A1D1A] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Systeembeheer (/admin)</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
