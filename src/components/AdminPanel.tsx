import React, { useState, useEffect } from 'react';
import {
  Shield,
  X,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Filter,
  Users,
  MapPin,
  Heart,
  Mail,
  Sliders,
  Key,
  Layers,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  Compass,
  Building2,
} from 'lucide-react';
import { store } from '../services/store';
import { MapIdea, ParticipationResponse, NewsletterSubscription, ProjectSettings } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(store.isSystemAdmin());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ideas' | 'responses' | 'settings' | 'newsletter'>('ideas');

  const [ideas, setIdeas] = useState<MapIdea[]>(store.getAllIdeas());
  const [responses, setResponses] = useState<ParticipationResponse[]>(store.getResponses());
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>(store.getNewsletters());
  const [settings, setSettings] = useState<ProjectSettings>(store.getSettings());

  const refreshData = () => {
    setIsAuthenticated(store.isSystemAdmin());
    setIdeas(store.getAllIdeas());
    setResponses(store.getResponses());
    setNewsletters(store.getNewsletters());
    setSettings(store.getSettings());
  };

  useEffect(() => {
    setIsAuthenticated(store.isSystemAdmin());
    const unsub = store.subscribe(refreshData);
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = store.loginSystemAdmin(passwordInput);
    if (success) {
      setAuthError('');
      setPasswordInput('');
      setIsAuthenticated(true);
    } else {
      setAuthError('Onjuiste code. Gebruik 2026 of klik op direct activeren.');
    }
  };

  const handleDirectActivate = () => {
    store.loginSystemAdmin('2026');
    setAuthError('');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    store.logoutSystemAdmin();
    setIsAuthenticated(false);
  };

  const showDownloadNotice = (label: string) => {
    setDownloadSuccess(label);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadPlangebied = () => {
    const data = store.exportPlangebiedGeoJSON();
    store.downloadBlob(
      data,
      `plangebied_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.geojson`,
      'application/geo+json;charset=utf-8;'
    );
    showDownloadNotice('Plangebied (.geojson) gedownload!');
  };

  const handleDownloadEnquetes = () => {
    const data = store.exportEnquetesCSV();
    store.downloadBlob(
      data,
      `participatie_enquetes_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    );
    showDownloadNotice('Enquêtes (.csv) gedownload!');
  };

  const handleDownloadDashboardStats = () => {
    const data = store.exportDashboardStatsJSON();
    store.downloadBlob(
      data,
      `dashboard_statistieken_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json;charset=utf-8;'
    );
    showDownloadNotice('Dashboard statistieken (.json) gedownload!');
  };

  const handleDownloadDashboardStatsCSV = () => {
    const data = store.exportDashboardStatsCSV();
    store.downloadBlob(
      data,
      `dashboard_statistieken_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    );
    showDownloadNotice('Dashboard statistieken (.csv) gedownload!');
  };

  if (!isOpen) return null;

  const handleApproveIdea = (id: string) => {
    store.approveIdea(id);
  };

  const handleApproveAllPending = () => {
    const count = store.approveAllPendingIdeas();
    showDownloadNotice(`${count} ideeën goedgekeurd voor de dorpskaart!`);
  };

  const handleRejectIdea = (id: string) => {
    store.rejectIdea(id);
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm('Weet je zeker dat je dit idee wilt verwijderen?')) {
      store.deleteIdea(id);
    }
  };

  const handleExportCSV = () => {
    const csvContent = store.exportIdeasCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dorpsrand_ideeen_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonContent = store.exportAllDataJSON();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dorpsrand_participatiedata_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePhaseChange = (phaseNumber: number, phaseName: string) => {
    store.updatePhase(phaseNumber, phaseName);
  };

  const handleToggleParticipation = () => {
    store.toggleParticipationActive();
  };

  const pendingIdeasCount = ideas.filter((i) => i.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#1A1D1A] text-[#FBF9F5] border border-[#3A403A] rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#242824] border border-[#3A403A] text-[#85A38C]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#FBF9F5]">
                  Beheermodule & Moderatie
                </h2>
                {isAuthenticated && (
                  <span className="px-2 py-0.5 rounded-full bg-[#243527] border border-[#3D5A45] text-[#A3D9AE] text-[10px] font-mono-subtle flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                    Systeembeheerder
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8C7B6B] font-mono-subtle">
                Gebiedsverkenning Dorpsrand Hollandsche Rading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-[#242824] border border-[#3A403A] text-xs font-semibold text-[#8C7B6B] hover:text-[#E11D48] transition-colors"
                title="Systeembeheerder deactiveren"
              >
                Afmelden
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#8C7B6B] hover:text-white hover:bg-[#242824]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-[#243527] border-b border-[#3D5A45] px-6 py-2.5 text-xs text-[#A3D9AE] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#242824] border border-[#3A403A] flex items-center justify-center text-[#85A38C] shadow-lg">
              <Key className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FBF9F5]">Systeembeheerder Toegang</h3>
              <p className="text-sm text-[#8C7B6B] mt-1.5">
                Voer de beheerder pincode in om exports te downloaden en instellingen te beheren.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Voer pincode in (bijv. 2026)"
                  className="w-full px-4 py-3 rounded-xl bg-[#242824] border border-[#3A403A] text-white placeholder-[#666] text-center tracking-widest text-lg font-mono focus:border-[#85A38C] focus:outline-none"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-[#E11D48] mt-2 font-mono">{authError}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#3D5A45] hover:bg-[#2F4535] text-white font-medium text-sm transition-colors"
                >
                  Inloggen
                </button>
                <button
                  type="button"
                  onClick={handleDirectActivate}
                  className="py-2.5 px-4 rounded-xl bg-[#242824] border border-[#3A403A] text-[#85A38C] hover:text-white hover:bg-[#2e342e] font-medium text-xs transition-colors"
                >
                  Direct Activeren
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* System Admin Quick Download Banner */}
            <div className="bg-[#1F241F] border-b border-[#303830] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#D5CDC0]">
                <Download className="w-4 h-4 text-[#85A38C]" />
                <span className="font-semibold text-white">Systeembeheerder Downloads:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleDownloadPlangebied}
                  className="px-3 py-1.5 rounded-lg bg-[#283229] border border-[#3D5A45] text-xs font-medium text-[#A3D9AE] hover:bg-[#3D5A45] hover:text-white transition-colors flex items-center gap-1.5"
                  title="Download Plangebied als GIS-bestand (GeoJSON)"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Plangebied (GeoJSON)</span>
                </button>
                <button
                  onClick={handleDownloadEnquetes}
                  className="px-3 py-1.5 rounded-lg bg-[#283229] border border-[#3D5A45] text-xs font-medium text-[#A3D9AE] hover:bg-[#3D5A45] hover:text-white transition-colors flex items-center gap-1.5"
                  title="Download alle enquête reacties (CSV)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Enquêtes (CSV)</span>
                </button>
                <button
                  onClick={handleDownloadDashboardStats}
                  className="px-3 py-1.5 rounded-lg bg-[#283229] border border-[#3D5A45] text-xs font-medium text-[#A3D9AE] hover:bg-[#3D5A45] hover:text-white transition-colors flex items-center gap-1.5"
                  title="Download aggregaties en statistieken (JSON)"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dashboard (JSON)</span>
                </button>
                <button
                  onClick={handleDownloadDashboardStatsCSV}
                  className="px-3 py-1.5 rounded-lg bg-[#283229] border border-[#3D5A45] text-xs font-medium text-[#A3D9AE] hover:bg-[#3D5A45] hover:text-white transition-colors flex items-center gap-1.5"
                  title="Download aggregaties en statistieken (CSV)"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dashboard (CSV)</span>
                </button>
              </div>
            </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#333] flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('ideas')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ideas'
                ? 'border-[#85A38C] text-[#85A38C]'
                : 'border-transparent text-[#8C7B6B] hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Kaartideeën ({ideas.length})</span>
            {pendingIdeasCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#E11D48] text-white text-[10px] font-bold">
                {pendingIdeasCount} te keuren
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('responses')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'responses'
                ? 'border-[#85A38C] text-[#85A38C]'
                : 'border-transparent text-[#8C7B6B] hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Participatieresultaten ({responses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'newsletter'
                ? 'border-[#85A38C] text-[#85A38C]'
                : 'border-transparent text-[#8C7B6B] hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Nieuwsbrief & Contact ({newsletters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-[#85A38C] text-[#85A38C]'
                : 'border-transparent text-[#8C7B6B] hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Projectinstellingen & Fasering</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: IDEAS MODERATION */}
          {activeTab === 'ideas' && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-[#8C7B6B] pb-2 border-b border-[#2C302C]">
                <div>
                  <span>Totaal {ideas.length} ideeën geregistreerd ({ideas.filter((i) => i.status === 'pending').length} in afwachting).</span>
                </div>
                {ideas.some((i) => i.status === 'pending') && (
                  <button
                    type="button"
                    onClick={handleApproveAllPending}
                    className="px-3 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#1A1D1A] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Keur alle ({ideas.filter((i) => i.status === 'pending').length}) direct goed</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono-subtle font-bold bg-[#1A1D1A] text-[#85A38C]">
                          {idea.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            idea.status === 'approved'
                              ? 'bg-[#166534] text-[#DCFCE7]'
                              : idea.status === 'pending'
                              ? 'bg-[#854D0E] text-[#FEF3C7]'
                              : 'bg-[#991B1B] text-[#FEE2E2]'
                          }`}
                        >
                          {idea.status === 'approved'
                            ? 'Goedgekeurd (Openbaar)'
                            : idea.status === 'pending'
                            ? 'Wacht op moderatie'
                            : 'Afgewezen'}
                        </span>
                        <span className="text-[11px] text-[#8C7B6B] font-mono-subtle">
                          Locatie: {idea.lat.toFixed(4)}, {idea.lng.toFixed(4)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#FBF9F5]">
                        {idea.title}
                      </h4>
                      <p className="text-xs text-[#D5CDC0] font-light leading-relaxed">
                        {idea.description}
                      </p>

                      <div className="text-[10px] text-[#8C7B6B] font-mono-subtle flex gap-4 pt-1">
                        <span>Auteur: {idea.authorName || 'Anoniem'}</span>
                        {idea.authorEmail && <span>E-mail: {idea.authorEmail}</span>}
                        <span>❤️ {idea.votesCount} stemmen</span>
                        <span>Datum: {new Date(idea.createdAt).toLocaleString('nl-NL')}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {idea.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveIdea(idea.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-semibold flex items-center gap-1"
                          title="Keur goed en toon op openbare kaart"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Goedkeuren</span>
                        </button>
                      )}

                      {idea.status !== 'rejected' && (
                        <button
                          onClick={() => handleRejectIdea(idea.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#2A2E2A] hover:bg-[#333] text-[#E11D48] text-xs font-semibold flex items-center gap-1 border border-[#3A403A]"
                          title="Afkeuren voor de openbare kaart"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Afkeuren</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="p-1.5 rounded-lg hover:bg-[#E11D48]/20 text-[#E11D48]"
                        title="Verwijder definitief"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PARTICIPATION RESPONSES */}
          {activeTab === 'responses' && (
            <div className="space-y-4">
              <div className="text-xs text-[#8C7B6B]">
                Inzendingen op prioriteiten, doelgroepen en 'wat moet blijven'.
              </div>

              <div className="space-y-3">
                {responses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-4 rounded-xl bg-[#242824] border border-[#3A403A] text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center text-[#8C7B6B] font-mono-subtle text-[11px]">
                      <span className="uppercase text-[#85A38C] font-semibold">
                        Type: {resp.type === 'woonwens' ? 'Woonwens (Woondata • Woningzoekend)' : resp.type}
                      </span>
                      <span>{new Date(resp.createdAt).toLocaleString('nl-NL')}</span>
                    </div>

                    {resp.woonwensData && (
                      <div className="bg-[#1A1D1A] p-2.5 rounded-lg border border-[#333] space-y-1 text-xs">
                        <div className="text-white font-medium">
                          {resp.woonwensData.woningtype} • {resp.woonwensData.prijsklasse}
                        </div>
                        <div className="text-[#8C7B6B]">
                          Doelgroep: <span className="text-[#85A38C]">{resp.woonwensData.doelgroep}</span> | Contact: {resp.woonwensData.naam || 'Anoniem'} {resp.woonwensData.email ? `(${resp.woonwensData.email})` : ''}
                        </div>
                      </div>
                    )}

                    {resp.selectedKeys && resp.selectedKeys.length > 0 && !resp.woonwensData && (
                      <div className="flex flex-wrap gap-1.5">
                        {resp.selectedKeys.map((key) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 rounded bg-[#1A1D1A] text-[#FBF9F5] border border-[#333]"
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    )}

                    {resp.customText && !resp.woonwensData && (
                      <p className="text-[#D5CDC0] font-light bg-[#1A1D1A] p-2.5 rounded-lg border border-[#333]">
                        "{resp.customText}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NEWSLETTER & CONTACT */}
          {activeTab === 'newsletter' && (
            <div className="space-y-4">
              <div className="text-xs text-[#8C7B6B]">
                Aangemelde e-mailadressen voor updates en notificaties.
              </div>

              <div className="space-y-2">
                {newsletters.map((nl) => (
                  <div
                    key={nl.id}
                    className="p-3 rounded-lg bg-[#242824] border border-[#3A403A] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#FBF9F5]">{nl.email}</span>
                      <div className="flex gap-3 text-[10px] text-[#8C7B6B] font-mono-subtle mt-1">
                        <span>Inwoner: {nl.isResident ? 'Ja' : 'Nee'}</span>
                        <span>Bijeenkomsten: {nl.keepUpdatedOnEvents ? 'Ja' : 'Nee'}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#8C7B6B] font-mono-subtle">
                      {new Date(nl.createdAt).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & PHASE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <div className="bg-[#242824] p-5 rounded-xl border border-[#3A403A] space-y-4">
                <h4 className="text-sm font-bold text-[#FBF9F5]">
                  Fasering van het project instellen
                </h4>
                <p className="text-xs text-[#D5CDC0]">
                  Huidige fase in navigatie en tijdlijn: <strong>Fase {settings.currentPhase} – {settings.phaseName}</strong>
                </p>

                <div className="space-y-2">
                  {[
                    { num: 1, name: 'Luisteren & Verkenning' },
                    { num: 2, name: 'Synthese van de inbreng' },
                    { num: 3, name: 'Ruimtelijke kaders & randvoorwaarden' },
                    { num: 4, name: 'Uitwerken van mogelijke scenario’s' },
                    { num: 5, name: 'Tweede participatieronde' },
                    { num: 6, name: 'Bestuurlijke besluitvorming' },
                    { num: 7, name: 'Vervolgstappen' },
                  ].map((p) => (
                    <button
                      key={p.num}
                      onClick={() => handlePhaseChange(p.num, p.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex justify-between ${
                        settings.currentPhase === p.num
                          ? 'bg-[#3D5A45] text-white'
                          : 'bg-[#1A1D1A] text-[#D5CDC0] hover:bg-[#2A2E2A]'
                      }`}
                    >
                      <span>Fase {p.num}: {p.name}</span>
                      {settings.currentPhase === p.num && <span>(Actief)</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#242824] p-5 rounded-xl border border-[#3A403A] space-y-4">
                <h4 className="text-sm font-bold text-[#FBF9F5]">
                  Participatiestatus
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#D5CDC0]">
                    Inzendingen toestaan:{' '}
                    <strong>{settings.participationActive ? 'Open' : 'Gesloten'}</strong>
                  </span>
                  <button
                    onClick={handleToggleParticipation}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      settings.participationActive
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-[#3D5A45] text-white'
                    }`}
                  >
                    {settings.participationActive ? 'Participatie sluiten' : 'Participatie openen'}
                  </button>
                </div>
              </div>

              {/* Module Woningbouwprojecten op Kaart (Afbeelding 2) */}
              <div className="bg-[#242824] p-5 rounded-xl border border-[#3A403A] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#FBF9F5] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#4ADE80]" />
                    <span>Module Woningbouwprojecten (Afbeelding 2)</span>
                  </h4>
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
                <p className="text-xs text-[#D5CDC0] leading-relaxed">
                  Schakel de officiële woningbouwprojecten van De Bilt en Hollandsche Rading (afbeelding 2) in of uit voor de interactieve participatiekaart (afbeelding 1).
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#333]">
                  <span className="text-xs text-[#8C7B6B]">
                    Status voor bezoekers: <strong>{store.isProjectsModuleEnabled() ? 'Zichtbaar' : 'Verborgen'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = store.toggleProjectsModule();
                      setDownloadSuccess(
                        next
                          ? 'Module Woningbouwprojecten ingeschakeld op de kaart!'
                          : 'Module Woningbouwprojecten uitgeschakeld voor bezoekers.'
                      );
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      store.isProjectsModuleEnabled()
                        ? 'bg-[#E11D48] text-white hover:bg-[#BE123C]'
                        : 'bg-[#22C55E] text-[#111411] hover:bg-[#16A34A]'
                    }`}
                  >
                    {store.isProjectsModuleEnabled() ? 'Module Uitschakelen' : 'Module Aanzetten'}
                  </button>
                </div>
              </div>

              {/* Kaart Centrering & Uitsnede */}
              <div className="bg-[#242824] p-5 rounded-xl border border-[#3A403A] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#FBF9F5] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#85A38C]" />
                    <span>Standaard Kaartcentrering & Uitsnede</span>
                  </h4>
                  <span className="text-[11px] font-mono-subtle text-[#85A38C]">
                    Zoom {store.getMapView().zoom}
                  </span>
                </div>
                <p className="text-xs text-[#D5CDC0] leading-relaxed">
                  Bezoekers zien de interactieve kaart standaard gecentreerd op Lat: {store.getMapView().lat.toFixed(4)}, Lng: {store.getMapView().lng.toFixed(4)}. Op de kaart zelf kun je via het beheerderspaneel de huidige uitsnede met 1 klik opslaan.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="#interactieve-kaart"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-lg bg-[#3D5A45] hover:bg-[#2F4535] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Ga naar kaart om positie te bepalen</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      store.resetMapView();
                      showDownloadNotice('Standaard kaartuitsnede hersteld naar fabrieksinstelling.');
                    }}
                    className="px-3 py-2 rounded-lg bg-[#1A1D1A] hover:bg-[#2A2E2A] text-[#8C7B6B] hover:text-[#D5CDC0] border border-[#333] text-xs transition-colors"
                  >
                    Herstel fabrieksinstelling
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      )}
      </div>
    </div>
  );
};
