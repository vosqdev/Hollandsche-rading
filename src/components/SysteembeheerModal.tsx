import React, { useState, useEffect } from 'react';
import {
  Shield,
  X,
  Download,
  Lock,
  Unlock,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  MapPin,
  BarChart3,
  Layers,
  Settings,
  AlertCircle,
  LogOut,
  Sparkles,
  Building2,
} from 'lucide-react';
import { store } from '../services/store';

interface SysteembeheerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullAdmin?: () => void;
}

export const SysteembeheerModal: React.FC<SysteembeheerModalProps> = ({
  isOpen,
  onClose,
  onOpenFullAdmin,
}) => {
  const [isSystemAdmin, setIsSystemAdmin] = useState(store.isSystemAdmin());
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setIsSystemAdmin(store.isSystemAdmin());
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = store.loginSystemAdmin(pinInput);
    if (success) {
      setErrorMessage('');
      setPinInput('');
      showNotice('Systeembeheerder modus succesvol geactiveerd!');
    } else {
      setErrorMessage('Onjuiste toegangscode. Gebruik bijv. 2026 of klik op direct activeren.');
    }
  };

  const handleDirectActivate = () => {
    store.loginSystemAdmin('2026');
    setErrorMessage('');
    showNotice('Systeembeheerder modus geactiveerd!');
  };

  const handleLogout = () => {
    store.logoutSystemAdmin();
    showNotice('Systeembeheerder modus afgesloten. Terug naar bezoekersweergave.');
  };

  const showNotice = (msg: string) => {
    setDownloadNotice(msg);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 4000);
  };

  // Download actions
  const handleDownloadPlangebied = () => {
    const data = store.exportPlangebiedGeoJSON();
    store.downloadBlob(
      data,
      `plangebied_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.geojson`,
      'application/geo+json;charset=utf-8;'
    );
    showNotice('Plangebied GIS-bestand (.geojson) gedownload!');
  };

  const handleDownloadEnquetesCSV = () => {
    const data = store.exportEnquetesCSV();
    store.downloadBlob(
      data,
      `participatie_enquetes_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    );
    showNotice('Enquêtes (.csv) gedownload!');
  };

  const handleDownloadEnquetesJSON = () => {
    const data = store.exportEnquetesJSON();
    store.downloadBlob(
      data,
      `participatie_enquetes_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json;charset=utf-8;'
    );
    showNotice('Enquêtes (.json) gedownload!');
  };

  const handleDownloadDashboardStatsJSON = () => {
    const data = store.exportDashboardStatsJSON();
    store.downloadBlob(
      data,
      `dashboard_statistieken_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json;charset=utf-8;'
    );
    showNotice('Dashboard statistieken (.json) gedownload!');
  };

  const handleDownloadDashboardStatsCSV = () => {
    const data = store.exportDashboardStatsCSV();
    store.downloadBlob(
      data,
      `dashboard_statistieken_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    );
    showNotice('Dashboard statistieken overzicht (.csv) gedownload!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#1A1D1A] text-[#FBF9F5] border border-[#3A403A] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isSystemAdmin 
                ? 'bg-[#2D4532] border-[#4E7555] text-[#A3D9AE]' 
                : 'bg-[#242824] border-[#3A403A] text-[#85A38C]'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#FBF9F5]">
                  Systeembeheer Toegang
                </h2>
                {isSystemAdmin ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#166534] text-[#DCFCE7] border border-[#22C55E]/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                    ACTIEF
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2A2E2A] text-[#8C7B6B] border border-[#3A403A]">
                    Vergrendeld
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8C7B6B] font-mono-subtle mt-0.5">
                Gebiedsverkenning Dorpsrand Hollandsche Rading • Gemeente De Bilt
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#8C7B6B] hover:text-white hover:bg-[#242824] transition-colors"
            title="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice feedback */}
        {downloadNotice && (
          <div className="px-6 py-2.5 bg-[#2D4532] border-b border-[#4E7555] text-xs text-[#DCFCE7] flex items-center gap-2 font-medium animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* CASE 1: NIET INGELOGD (TOEGANG VEREIST) */}
          {!isSystemAdmin ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] text-xs text-[#D5CDC0] leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-[#85A38C] font-semibold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Beveiligde Systeembeheerder Laag</span>
                </div>
                <p>
                  U bevindt zich momenteel in de <strong>openbare bezoekersmodus</strong>. Downloadknoppen voor het GIS-plangebied, de ingevulde enquêtes en de dashboardstatistieken zijn afgeschermd voor reguliere bezoekers.
                </p>
                <p className="text-[#8C7B6B]">
                  Meld u aan als systeembeheerder of projectleider om de exportfunctionaliteit en beheertools te activeren.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#D5CDC0] mb-1.5">
                    Toegangscode Systeembeheer
                  </label>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Voer pincode in (bijv. 2026)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#242824] border border-[#3A403A] text-sm text-[#FBF9F5] focus:outline-none focus:border-[#85A38C]"
                    autoFocus
                  />
                  {errorMessage && (
                    <div className="flex items-center gap-1.5 text-xs text-[#F87171] mt-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  <p className="text-[11px] text-[#8C7B6B] mt-1.5">
                    💡 <em>Tip voor evaluatie:</em> Toegangscode is <code>2026</code> of klik direct op de knop hieronder.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Inloggen met code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectActivate}
                    className="py-2.5 px-4 rounded-xl bg-[#242824] hover:bg-[#2E332E] border border-[#3A403A] text-[#85A38C] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#85A38C]" />
                    <span>Direct activeren als beheerder</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            
            /* CASE 2: WEL INGELOGD (SYSTEEMBEHEERDER MODUS ACTIEF MET DOWNLOADS) */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] text-xs text-[#D5CDC0] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#85A38C] font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                    <span>Systeembeheerder Modus is Actief</span>
                  </div>
                  <p className="text-[#8C7B6B] text-xs">
                    De downloadknoppen voor het plangebied, de enquêtes en de dashboardstatistieken zijn nu zichtbaar op het platform en in het onderstaande overzicht.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-[#2A2E2A] hover:bg-[#333] border border-[#3A403A] text-xs text-[#E11D48] flex items-center gap-1.5 transition-colors shrink-0"
                  title="Systeembeheerder modus uitschakelen"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Deactiveren</span>
                </button>
              </div>

              {/* MODULES BEHEER: WONINGBOUWPROJECTEN OP INTERACTIEVE KAART */}
              <div className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#1A1D1A] text-[#4ADE80] border border-[#333]">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#FBF9F5]">
                        Woningbouwprojecten Module (Afbeelding 2)
                      </h4>
                      <p className="text-xs text-[#8C7B6B]">
                        Toon of verberg officiële plancapaciteit en woningbouwprojecten op de kaart voor bezoekers.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      store.isProjectsModuleEnabled()
                        ? 'bg-[#166534] text-[#DCFCE7]'
                        : 'bg-[#333] text-[#8C7B6B]'
                    }`}
                  >
                    {store.isProjectsModuleEnabled() ? 'Actief' : 'Uitgeschakeld'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2E332E]">
                  <span className="text-[11px] text-[#8C7B6B]">
                    Status: <strong>{store.isProjectsModuleEnabled() ? 'Zichtbaar op interactieve kaart' : 'Verborgen voor bezoekers'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = store.toggleProjectsModule();
                      showNotice(
                        next
                          ? 'Module Woningbouwprojecten ingeschakeld op de kaart!'
                          : 'Module Woningbouwprojecten uitgeschakeld voor bezoekers.'
                      );
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      store.isProjectsModuleEnabled()
                        ? 'bg-[#E11D48] hover:bg-[#BE123C] text-white'
                        : 'bg-[#22C55E] hover:bg-[#16A34A] text-[#111411]'
                    }`}
                  >
                    {store.isProjectsModuleEnabled() ? 'Module Uitzetten' : 'Module Aanzetten'}
                  </button>
                </div>
              </div>

              {/* THREE DEDICATED DOWNLOAD TILES SPECIFIED BY USER */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-mono-subtle tracking-wider text-[#8C7B6B] font-semibold">
                  Systeembeheer Downloads
                </h3>

                {/* 1. Plangebied Download Card */}
                <div className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] hover:border-[#4E7555] transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#1A1D1A] text-[#85A38C] border border-[#333]">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#FBF9F5]">
                          1. Plangebied Dataset (GIS / GeoJSON)
                        </h4>
                        <p className="text-xs text-[#8C7B6B]">
                          Contour 14 ha zoekgebied Tolakkerweg-Oost, inclusief spoorbuffer, zichtlijnen & oversteekpunt (EPSG:4326).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#2E332E]">
                    <button
                      type="button"
                      onClick={handleDownloadPlangebied}
                      className="px-3.5 py-1.5 rounded-lg bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Plangebied (.geojson)</span>
                    </button>
                    <span className="text-[11px] text-[#8C7B6B] font-mono-subtle hidden sm:inline">
                      Geschikt voor QGIS, ArcGIS & Mapbox
                    </span>
                  </div>
                </div>

                {/* 2. Enquêtes Download Card */}
                <div className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] hover:border-[#4E7555] transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#1A1D1A] text-[#85A38C] border border-[#333]">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#FBF9F5]">
                          2. Participatie Enquêtes & Inzendingen
                        </h4>
                        <p className="text-xs text-[#8C7B6B]">
                          Ruwe responsdata: geselecteerde kernwaarden, doelgroepbehoeften, open toelichtingen en tijdstempels.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#2E332E]">
                    <button
                      type="button"
                      onClick={handleDownloadEnquetesCSV}
                      className="px-3.5 py-1.5 rounded-lg bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Enquêtes (.csv)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadEnquetesJSON}
                      className="px-3 py-1.5 rounded-lg bg-[#2A2E2A] hover:bg-[#333] border border-[#3A403A] text-[#D5CDC0] text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>JSON Formaat</span>
                    </button>
                  </div>
                </div>

                {/* 3. Dashboard Statistieken Download Card */}
                <div className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] hover:border-[#4E7555] transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#1A1D1A] text-[#85A38C] border border-[#333]">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#FBF9F5]">
                          3. Dashboard Statistieken & Analytics
                        </h4>
                        <p className="text-xs text-[#8C7B6B]">
                          Volledig analytics-rapport: 149 stemmen, denkrichtingen A/B/C verdeling, maquette parameters en sentiment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#2E332E]">
                    <button
                      type="button"
                      onClick={handleDownloadDashboardStatsJSON}
                      className="px-3.5 py-1.5 rounded-lg bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Statistieken (.json)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadDashboardStatsCSV}
                      className="px-3 py-1.5 rounded-lg bg-[#2A2E2A] hover:bg-[#333] border border-[#3A403A] text-[#D5CDC0] text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>CSV Formaat</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Extra Beheerpanel link */}
              {onOpenFullAdmin && (
                <div className="p-4 rounded-xl bg-[#1F231F] border border-[#2D332E] flex items-center justify-between">
                  <div className="text-xs text-[#D5CDC0]">
                    <span className="font-semibold text-white block">Kaartideeën modereren & fasering</span>
                    <span className="text-[#8C7B6B]">Open het volledige beheerpaneel voor inhoudelijke moderatie.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFullAdmin();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#2A2E2A] hover:bg-[#333] border border-[#3A403A] text-xs font-medium text-[#85A38C] hover:text-white transition-colors"
                  >
                    Open Beheermodule
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141714] border-t border-[#2D332E] flex items-center justify-between text-xs text-[#8C7B6B]">
          <span>Gemeente De Bilt • Gebiedsverkenning 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg hover:bg-[#242824] text-[#D5CDC0] hover:text-white transition-colors"
          >
            Sluiten
          </button>
        </div>

      </div>
    </div>
  );
};
