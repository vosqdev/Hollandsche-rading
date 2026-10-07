import React, { useState, useEffect } from 'react';
import { Shield, Download, X, Layers, FileSpreadsheet, BarChart3, CheckCircle2, LogOut } from 'lucide-react';
import { store } from '../services/store';

interface SysteembeheerBarProps {
  onOpenSysteembeheer: () => void;
}

export const SysteembeheerBar: React.FC<SysteembeheerBarProps> = ({ onOpenSysteembeheer }) => {
  const [isSystemAdmin, setIsSystemAdmin] = useState(store.isSystemAdmin());
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setIsSystemAdmin(store.isSystemAdmin());
    });
    return () => unsub();
  }, []);

  if (!isSystemAdmin) return null;

  const showSuccess = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadPlangebied = () => {
    const data = store.exportPlangebiedGeoJSON();
    store.downloadBlob(
      data,
      `plangebied_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.geojson`,
      'application/geo+json;charset=utf-8;'
    );
    showSuccess('Plangebied (.geojson) gedownload');
  };

  const handleDownloadEnquetes = () => {
    const data = store.exportEnquetesCSV();
    store.downloadBlob(
      data,
      `participatie_enquetes_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    );
    showSuccess('Enquêtes (.csv) gedownload');
  };

  const handleDownloadStats = () => {
    const data = store.exportDashboardStatsJSON();
    store.downloadBlob(
      data,
      `dashboard_statistieken_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json;charset=utf-8;'
    );
    showSuccess('Dashboard statistieken (.json) gedownload');
  };

  const handleLogout = () => {
    store.logoutSystemAdmin();
  };

  return (
    <aside
      aria-label="Systeembeheer actiebalk"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-40 max-w-xl animate-fadeIn"
    >
      <div className="bg-[#1A1D1A]/95 text-[#FBF9F5] backdrop-blur-md border border-[#3D5A45] rounded-2xl p-3 sm:px-4 sm:py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2D4532] text-[#4ADE80] border border-[#4E7555] shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Systeembeheer Modus</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            </div>
            <span className="text-[10px] text-[#A3B3A6] font-mono-subtle block">
              {downloadSuccess ? (
                <span className="text-[#4ADE80] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {downloadSuccess}
                </span>
              ) : (
                'Downloads actief'
              )}
            </span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadPlangebied}
            className="px-2.5 py-1 rounded-lg bg-[#242824] hover:bg-[#2E332E] border border-[#3A403A] text-xs font-medium text-[#D5CDC0] hover:text-white flex items-center gap-1 transition-colors"
            title="Download Plangebied GeoJSON"
          >
            <Layers className="w-3 h-3 text-[#85A38C]" />
            <span className="hidden sm:inline">Plangebied</span>
            <span className="sm:hidden">GIS</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadEnquetes}
            className="px-2.5 py-1 rounded-lg bg-[#242824] hover:bg-[#2E332E] border border-[#3A403A] text-xs font-medium text-[#D5CDC0] hover:text-white flex items-center gap-1 transition-colors"
            title="Download Enquêtes CSV"
          >
            <FileSpreadsheet className="w-3 h-3 text-[#85A38C]" />
            <span>Enquêtes</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadStats}
            className="px-2.5 py-1 rounded-lg bg-[#242824] hover:bg-[#2E332E] border border-[#3A403A] text-xs font-medium text-[#D5CDC0] hover:text-white flex items-center gap-1 transition-colors"
            title="Download Dashboard Statistieken JSON"
          >
            <BarChart3 className="w-3 h-3 text-[#85A38C]" />
            <span>Statistieken</span>
          </button>

          <button
            type="button"
            onClick={onOpenSysteembeheer}
            className="px-2.5 py-1 rounded-lg bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-medium transition-colors"
            title="Open Systeembeheerpaneel"
          >
            Menu
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1 rounded-lg text-[#8C7B6B] hover:text-[#E11D48] hover:bg-[#242824] transition-colors"
            title="Systeembeheerder modus afsluiten"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
