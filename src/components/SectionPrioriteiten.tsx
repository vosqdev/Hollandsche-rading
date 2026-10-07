import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CheckCircle2, Send, AlertCircle, BarChart3 } from 'lucide-react';
import { store } from '../services/store';

const PRIORITY_OPTIONS = [
  'Betaalbare woningen',
  'Woningen voor starters',
  'Woningen voor senioren',
  'Woningen voor gezinnen',
  'Landschap behouden',
  'Meer natuur',
  'Verkeersveiligheid',
  'Wandel- en fietsroutes',
  'Water en klimaat',
  'Energiezuinig ontwikkelen',
  'Rust en ruimte',
  'Anders, namelijk...',
];

export const SectionPrioriteiten: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [priorityAggregates, setPriorityAggregates] = useState<{ [key: string]: number }>({});
  const [totalRespondents, setTotalRespondents] = useState(0);

  const loadAggregates = () => {
    const agg = store.getPriorityAggregates();
    setPriorityAggregates(agg);
    const respCount = store.getResponses().filter((r) => r.type === 'priorities').length;
    setTotalRespondents(respCount);
  };

  useEffect(() => {
    loadAggregates();
    const unsub = store.subscribe(() => {
      loadAggregates();
    });
    return () => unsub();
  }, []);

  const toggleOption = (option: string) => {
    if (submitted) return;
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      if (selected.length >= 5) return;
      setSelected([...selected, option]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) return;

    store.addResponse({
      participantId: store.getParticipant().id,
      type: 'priorities',
      selectedKeys: selected,
      customText: selected.includes('Anders, namelijk...') ? customText : undefined,
    });

    setSubmitted(true);
  };

  // Find max count to scale visual comparison bars
  const values = Object.values(priorityAggregates) as number[];
  const maxCount = Math.max(...(values.length > 0 ? values : [0]), 1);

  return (
    <section id="participatie" className="py-24 md:py-36 bg-[#FBF9F5] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
            03 / Participatie
          </span>
          <h2
            className="font-light tracking-tight text-[#1A1D1A] leading-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
          >
            Als we over de toekomst van deze plek nadenken:
            <br />
            <span className="font-editorial italic text-[#3D5A45]">
              wat vind jij dan het belangrijkste?
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#5A6059] font-light">
            Kies maximaal <strong>5 onderwerpen</strong> die voor jou zwaar wegen. Jouw stem wordt direct opgeslagen in de openbare verkenning.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PRIORITY_OPTIONS.map((option) => {
                const isChecked = selected.includes(option);
                const disabled = !isChecked && selected.length >= 5;

                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => toggleOption(option)}
                    disabled={disabled}
                    className={`relative p-5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                      isChecked
                        ? 'bg-[#2C4030] text-[#FBF9F5] border-[#2C4030] shadow-md scale-[1.01]'
                        : disabled
                        ? 'bg-[#F2ECE1]/40 border-[#E2DDD2] text-[#A39182] opacity-50 cursor-not-allowed'
                        : 'bg-[#F4F0E8] border-[#D5CDC0] text-[#1A1D1A] hover:border-[#8C7B6B] hover:bg-[#EAE4D7]'
                    }`}
                  >
                    <span className="text-base font-medium pr-4">{option}</span>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-[#85A38C] border-[#85A38C] text-[#1A1D1A]'
                          : 'border-[#A39182]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* If 'Anders, namelijk...' selected */}
            <AnimatePresence>
              {selected.includes('Anders, namelijk...') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-2"
                >
                  <label className="block text-sm font-medium text-[#1A1D1A]">
                    Licht toe: welk ander onderwerp mis je nog?
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Bijvoorbeeld: wateroverlast in specifieke straat, behoud hondenlosloopgebied..."
                    className="w-full max-w-2xl px-4 py-3 rounded-xl border border-[#D5CDC0] bg-[#FBF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#3D5A45]"
                    maxLength={300}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selection counter & submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E2DDD2]">
              <div className="flex items-center gap-2 text-sm text-[#5A6059]">
                <span className="font-mono-subtle font-semibold text-[#1A1D1A]">
                  {selected.length}/5
                </span>
                <span>geselecteerd</span>
                {selected.length === 5 && (
                  <span className="text-xs text-[#8C7B6B] font-mono-subtle">
                    (maximum bereikt)
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={selected.length === 0}
                className={`px-8 py-3.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  selected.length > 0
                    ? 'bg-[#3D5A45] text-white hover:bg-[#2C4030] shadow-md cursor-pointer'
                    : 'bg-[#D5CDC0] text-[#736B63] cursor-not-allowed'
                }`}
                id="submit-priorities-btn"
              >
                <span>Sla mijn prioriteiten op</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#242824] text-[#FBF9F5] rounded-2xl p-8 sm:p-12 shadow-xl border border-[#3A403A]"
          >
            <div className="flex items-center gap-3 text-[#85A38C] mb-6">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-sm uppercase tracking-wider font-mono-subtle font-semibold">
                Bedankt voor jouw inbreng
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">
              Dit vinden inwoners belangrijk
            </h3>
            <p className="text-sm text-[#A39182] mb-8 font-light">
              Gebaseerd op <strong>{totalRespondents} geverifieerde inzendingen</strong> van inwoners en belanghebbenden uit Hollandsche Rading en omgeving.
            </p>

            {/* Real Aggregates Bar Chart */}
            <div className="space-y-4 max-w-4xl">
              {(Object.entries(priorityAggregates) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([label, count]) => {
                  const percentage = totalRespondents > 0 ? Math.round((count / totalRespondents) * 100) : 0;
                  const isUserPick = selected.includes(label);

                  return (
                    <div key={label} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={`font-medium ${isUserPick ? 'text-[#85A38C] font-semibold' : 'text-[#D5CDC0]'}`}>
                          {label} {isUserPick && '★ (jouw keuze)'}
                        </span>
                        <span className="font-mono-subtle text-[#A39182]">
                          {count} {count === 1 ? 'keer' : 'keer'} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#1A1D1A] h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxCount) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isUserPick ? 'bg-[#85A38C]' : 'bg-[#4A6B53]'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-[#3A403A] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A39182] hover:text-white underline underline-offset-4"
              >
                Mijn selectie aanpassen
              </button>
              <a
                href="#interactieve-kaart"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-[#3D5A45] text-white hover:bg-[#2F4535] transition-colors"
              >
                <span>Plaats nu ook een idee op de kaart</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
