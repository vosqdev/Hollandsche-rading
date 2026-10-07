import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Check, Send, CheckCircle2 } from 'lucide-react';
import { store } from '../services/store';

const TARGET_GROUPS = [
  { id: 'STARTERS', label: 'STARTERS', desc: 'Jongeren en jonge volwassenen uit het dorp die zelfstandig willen gaan wonen.' },
  { id: 'JONGE HUISHOUDENS', label: 'JONGE HUISHOUDENS', desc: 'Beginnende huishoudens die binding hebben met de streek.' },
  { id: 'GEZINNEN', label: 'GEZINNEN', desc: 'Woningen met tuin voor opgroeiende kinderen bij basisschool en sport.' },
  { id: 'SENIOREN', label: 'SENIOREN', desc: 'Gelijkvloerse, levensloopbestendige woningen zodat dorpsgenoten kunnen doorstromen.' },
  { id: 'GECLUSTERD WONEN', label: 'GECLUSTERD WONEN', desc: 'Samen wonen rond een gemeenschappelijke binnentuin of hof.' },
  { id: 'WONEN + LICHTE ZORG', label: 'WONEN + LICHTE ZORG', desc: 'Zelfstandig wonen met de nabijheid van voorzieningen en burenhulp.' },
  { id: 'BETAALBARE WONINGEN', label: 'BETAALBARE WONINGEN', desc: 'Sociale huur en betaalbare koop onder de NHG-grens.' },
  { id: 'VRIJE SECTOR', label: 'VRIJE SECTOR', desc: 'Vrijstaande of twee-onder-één-kapwoningen in het hogere segment.' },
];

export const SectionDoelgroepen: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [targetAggregates, setTargetAggregates] = useState<{ [key: string]: number }>({});
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  const loadData = () => {
    const agg = store.getTargetGroupAggregates();
    setTargetAggregates(agg);
    const count = store.getResponses().filter((r) => r.type === 'target_groups').length;
    setTotalSubmissions(count);
  };

  useEffect(() => {
    loadData();
    const unsub = store.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const toggleGroup = (id: string) => {
    if (submitted) return;
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      if (selected.length >= 3) return;
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) return;

    store.addResponse({
      participantId: store.getParticipant().id,
      type: 'target_groups',
      selectedKeys: selected,
    });

    setSubmitted(true);
  };

  const values = Object.values(targetAggregates) as number[];
  const maxVotes = Math.max(...(values.length > 0 ? values : [0]), 1);

  return (
    <section id="doelgroepen" className="py-24 md:py-36 bg-[#FBF9F5] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
            06 / Doelgroepen
          </span>
          <h2
            className="font-light tracking-tight text-[#1A1D1A] leading-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
          >
            Voor wie zou hier
            <br />
            <span className="font-editorial italic text-[#3D5A45]">
              ruimte moeten zijn?
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#5A6059] font-light">
            Vraag aan het dorp: <em>"Voor wie mist Hollandsche Rading op dit moment woningen?"</em> Kies maximaal <strong>3 doelgroepen</strong>.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TARGET_GROUPS.map((group) => {
                const isSelected = selected.includes(group.id);
                const disabled = !isSelected && selected.length >= 3;

                return (
                  <button
                    type="button"
                    key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    disabled={disabled}
                    className={`p-6 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[170px] ${
                      isSelected
                        ? 'bg-[#1A1D1A] text-[#FBF9F5] border-[#1A1D1A] shadow-lg scale-[1.02]'
                        : disabled
                        ? 'bg-[#F2ECE1]/40 border-[#E2DDD2] text-[#A39182] opacity-50 cursor-not-allowed'
                        : 'bg-[#F4F0E8] border-[#D5CDC0] text-[#1A1D1A] hover:border-[#8C7B6B] hover:bg-[#EAE4D7]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-mono-subtle font-bold tracking-wider">
                          {group.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#85A38C] border-[#85A38C] text-[#1A1D1A]'
                              : 'border-[#A39182]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-[#D5CDC0]' : 'text-[#666]'}`}>
                        {group.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#333]/15 text-[10px] font-mono-subtle opacity-75">
                      {isSelected ? 'Geselecteerd' : 'Tik om te kiezen'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E2DDD2]">
              <div className="text-sm text-[#5A6059]">
                <span className="font-mono-subtle font-semibold text-[#1A1D1A]">
                  {selected.length}/3
                </span>{' '}
                doelgroepen gekozen
              </div>

              <button
                type="submit"
                disabled={selected.length === 0}
                className={`px-8 py-3.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  selected.length > 0
                    ? 'bg-[#3D5A45] text-white hover:bg-[#2C4030] shadow-md cursor-pointer'
                    : 'bg-[#D5CDC0] text-[#736B63] cursor-not-allowed'
                }`}
              >
                <span>Bevestig mijn inbreng</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#242824] text-[#FBF9F5] rounded-2xl p-8 sm:p-12 shadow-xl border border-[#3A403A]"
          >
            <div className="flex items-center gap-2.5 text-[#85A38C] mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs uppercase font-mono-subtle tracking-wider font-semibold">
                Opgeslagen in verkenning
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">
              Voor wie zoekt Hollandsche Rading oplossingen?
            </h3>
            <p className="text-xs sm:text-sm text-[#A39182] mb-8 font-light">
              Totaal {totalSubmissions} geregistreerde antwoorden van dorpsgenoten:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TARGET_GROUPS.map((group) => {
                const count = targetAggregates[group.id] || 0;
                const percentage = totalSubmissions > 0 ? Math.round((count / totalSubmissions) * 100) : 0;
                const isUserPick = selected.includes(group.id);

                return (
                  <div
                    key={group.id}
                    className={`p-4 rounded-xl border ${
                      isUserPick
                        ? 'bg-[#2E362F] border-[#85A38C]'
                        : 'bg-[#1A1D1A] border-[#333]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className={`font-semibold ${isUserPick ? 'text-[#85A38C]' : 'text-[#FBF9F5]'}`}>
                        {group.label} {isUserPick && '★'}
                      </span>
                      <span className="font-mono-subtle text-[#A39182]">
                        {count} stemmen ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#111] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isUserPick ? 'bg-[#85A38C]' : 'bg-[#4A6B53]'}`}
                        style={{ width: `${(count / maxVotes) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-[#3A403A] flex justify-between items-center text-xs">
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#A39182] hover:text-white underline underline-offset-4"
              >
                Mijn keuze wijzigen
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
