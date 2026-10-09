import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  FileText,
  ExternalLink,
  Users,
  ArrowRight,
} from 'lucide-react';
import { store } from '../services/store';
import { AgendaEvent, ProjectDocument } from '../types';

export const SectionAgendaDocumenten: React.FC = () => {
  const [events] = useState<AgendaEvent[]>(store.getAgendaEvents());
  const [documents, setDocuments] = useState<ProjectDocument[]>(store.getDocuments());
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDocuments(store.getDocuments());
    });
    return unsub;
  }, []);

  const handleDownloadDoc = (doc: ProjectDocument) => {
    const textContent = `================================================================================
OFFICIËLE BELEIDSDOCUMENTATIE GEMEENTE DE BILT
================================================================================
Document:        ${doc.title}
Beleidsthema:    ${doc.category}
Status/Periode:  ${doc.date}
Bron / Orgaan:   ${doc.sourceLabel || 'Gemeente De Bilt / Regio Utrecht'}
Officiële URL:   ${doc.externalUrl || 'https://www.debilt.nl'}
Bestandsformaat: ${doc.fileType} (${doc.fileSize})

1. SAMENVATTING & INHOUDELIJK KADER
${doc.description}

2. RELEVANTIE VOOR DE PARTICIPATIE DORPSRAND HOLLANDSCHE RADING
${doc.relevanceForParticipation || 'Dit openbare beleidsstuk vormt het formele ruimtelijke, maatschappelijke of participatieve toetsingskader voor het participatietraject.'}

3. RAADPLEGING & OPENBAARHEID
Gepubliceerd via het officiële gemeenteloket van Gemeente De Bilt (www.debilt.nl) en het Digitaal Stelsel Omgevingswet (DSO).

---
Geraadpleegd via: Participatieplatform Dorpsrandverkenning Hollandsche Rading
Datum van download: ${new Date().toLocaleDateString('nl-NL')}
`;
    const safeName = doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 45);
    store.downloadBlob(textContent, `${safeName}.txt`, 'text/plain;charset=utf-8');

    setDownloadNotice(`Document "${doc.title}" succesvol gedownload.`);
    setTimeout(() => setDownloadNotice(null), 4500);
  };

  return (
    <section className="py-24 md:py-36 bg-[#F4F0E8] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-28">
        {/* Sub-section 1: Agenda */}
        <div id="agenda">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
              07 / Bijeenkomsten &amp; Agenda
            </span>
            <h2
              className="font-light tracking-tight text-[#1A1D1A] leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
            >
              Ontmoet ons in het dorp.
            </h2>
            <p className="text-sm sm:text-base text-[#5A6059] font-light mt-3">
              De participatie start in eerste instantie via dit digitale platform. Later volgt een gebiedsatelier bijeenkomst en daarna de inloopavond &amp; informatiebijeenkomst gebiedsverkenning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#FBF9F5] border border-[#D5CDC0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#3D5A45] transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-mono-subtle font-bold px-2.5 py-1 rounded ${
                      event.id === 'evt-1'
                        ? 'bg-[#3D5A45] text-white'
                        : 'bg-[#EAE4D7] text-[#2C4030]'
                    }`}>
                      {event.date}
                    </span>
                    <span className="text-[11px] font-mono-subtle text-[#8C7B6B]">
                      {event.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1D1A] tracking-tight leading-snug mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#555] font-light leading-relaxed mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2DDD2] flex items-center justify-between text-xs text-[#8C7B6B] font-mono-subtle">
                  <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#3D5A45]" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  {event.id === 'evt-1' ? (
                    <a
                      href="#participatie"
                      className="text-[#3D5A45] hover:underline font-semibold flex items-center gap-1 shrink-0"
                    >
                      <span>Direct meedoen</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#3D5A45] font-semibold shrink-0">
                      {event.statusLabel || 'Vrije inloop'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-section 2: Gemeentelijk Beleid & Openbare Kaders */}
        <div id="documenten">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
              08 / Kennis &amp; Gemeentelijk Beleidskader
            </span>
            <h2
              className="font-light tracking-tight text-[#1A1D1A] leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
            >
              Openbare stukken &amp; beleidskaders.
            </h2>
            <p className="text-sm sm:text-base text-[#5A6059] font-light mt-3">
              Standaard openbare publicaties van Gemeente De Bilt en Regio Utrecht die de formele randvoorwaarden en participatiespelregels bepalen voor de verkenning dorpsrand Hollandsche Rading.
            </p>
          </div>

          {downloadNotice && (
            <div className="mb-6 p-4 rounded-xl bg-[#E8F4EC] border border-[#A7D7B5] text-[#20542E] text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
              <span>✓ {downloadNotice}</span>
              <button
                onClick={() => setDownloadNotice(null)}
                className="text-[#20542E] hover:underline text-xs"
              >
                Sluiten
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {documents.slice(0, 8).map((doc) => (
              <div
                key={doc.id}
                className="bg-[#FBF9F5] border border-[#D5CDC0] rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-[#3D5A45] hover:shadow-sm transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-xl bg-[#EAE4D7] text-[#3D5A45] shrink-0 group-hover:bg-[#3D5A45] group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-mono-subtle font-bold px-2 py-0.5 rounded bg-[#E8F0EA] text-[#2C6E3D] border border-[#C6DCB9]">
                            {doc.category}
                          </span>
                          <span className="text-xs text-[#8C7B6B] font-mono-subtle">
                            — {doc.date}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#1A1D1A] leading-snug group-hover:text-[#2C6E3D] transition-colors">
                          {doc.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {doc.externalUrl && (
                        <a
                          href={doc.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#FAF8F3] hover:bg-[#EAE4D7] border border-[#D5CDC0] text-xs font-semibold text-[#3D5A45] transition-colors flex items-center gap-1"
                          title="Open officiële gemeentelijke publicatie"
                        >
                          <span className="hidden sm:inline">Naar bron</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDownloadDoc(doc)}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#F4F0E8] hover:bg-[#3D5A45] hover:text-white border border-[#D5CDC0] text-xs font-semibold text-[#1A1D1A] transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
                        title="Download kadersamenvatting"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#555047] leading-relaxed mt-3.5 pl-0 sm:pl-[52px]">
                    {doc.description}
                  </p>

                  {doc.relevanceForParticipation && (
                    <div className="mt-3 pl-0 sm:pl-[52px]">
                      <div className="text-[11px] text-[#2C4030] bg-[#F2EDE2] px-3 py-2 rounded-lg border border-[#E0D8C8] leading-relaxed">
                        <strong className="text-[#1A1D1A] font-semibold">Relevant voor participatie: </strong>
                        {doc.relevanceForParticipation}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#EDE8DD] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#736B63] font-mono-subtle pl-0 sm:pl-[52px]">
                  <span>Formaat: {doc.fileType} ({doc.fileSize})</span>
                  {doc.sourceLabel && (
                    <span className="text-[#3D5A45] font-medium truncate max-w-[240px]">
                      {doc.sourceLabel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
