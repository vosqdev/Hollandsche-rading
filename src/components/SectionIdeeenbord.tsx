import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Filter,
  ArrowUpDown,
  MessageSquare,
  Sparkles,
  Calendar,
  Check,
} from 'lucide-react';
import { store } from '../services/store';
import { MapIdea, CategoryType } from '../types';

const CATEGORY_LABELS: Record<string, { label: string; icon: string; bg: string; text: string }> = {
  idee: { label: 'Idee', icon: '💡', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
  groen: { label: 'Groen', icon: '🌳', bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  wonen: { label: 'Wonen', icon: '🏠', bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
  verkeer: { label: 'Verkeer', icon: '🚲', bg: 'bg-[#F3E8FF]', text: 'text-[#6B21A8]' },
  water: { label: 'Water', icon: '💧', bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]' },
  natuur: { label: 'Natuur', icon: '🌿', bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' },
  energie: { label: 'Energie', icon: '⚡', bg: 'bg-[#FFEDD5]', text: 'text-[#9A3412]' },
  behouden: { label: 'Behouden', icon: '❤️', bg: 'bg-[#FFE4E6]', text: 'text-[#9F1239]' },
  aandachtspunt: { label: 'Aandachtspunt', icon: '⚠', bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
};

export const SectionIdeeenbord: React.FC = () => {
  const [ideas, setIdeas] = useState<MapIdea[]>(store.getApprovedIdeas());
  const [filterCat, setFilterCat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setIdeas(store.getApprovedIdeas());
    });
    return () => unsub();
  }, []);

  const handleVote = (id: string) => {
    if (votedIds.includes(id)) return;
    store.voteMapIdea(id);
    setVotedIds([...votedIds, id]);
  };

  // Filter & sort
  const filteredIdeas = ideas
    .filter((idea) => filterCat === 'all' || idea.category === filterCat)
    .sort((a, b) => {
      if (sortBy === 'votes') {
        return b.votesCount - a.votesCount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const categoriesWithCounts = ['all', ...Object.keys(CATEGORY_LABELS)];

  return (
    <section id="ideeenbord" className="py-24 md:py-36 bg-[#FBF9F5] border-b border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
              08 / Openbaar Ideeënbord
            </span>
            <h2
              className="font-light tracking-tight text-[#1A1D1A] leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
            >
              Inzendingen van
              <br />
              <span className="font-editorial italic text-[#3D5A45]">
                inwoners & dorpsgenoten.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-[#5A6059] font-light">
            Alle goedgekeurde suggesties, zorgen en ideeën. Steun een bijdrage door erop te stemmen.
          </p>
        </div>

        {/* Controls Bar: Categories & Sorting */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2DDD2]">
          {/* Category badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar text-xs">
            <span className="text-[#8C7B6B] font-mono-subtle flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
            </span>
            {categoriesWithCounts.map((catKey) => {
              const isActive = filterCat === catKey;
              const count =
                catKey === 'all'
                  ? ideas.length
                  : ideas.filter((i) => i.category === catKey).length;

              const label =
                catKey === 'all'
                  ? 'Alle ideeën'
                  : CATEGORY_LABELS[catKey]?.label || catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => setFilterCat(catKey)}
                  className={`px-3 py-1.5 rounded-full shrink-0 transition-all font-medium flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1A1D1A] text-white shadow-xs'
                      : 'bg-[#F4F0E8] text-[#555] hover:bg-[#EAE4D7] border border-[#D5CDC0]'
                  }`}
                >
                  {catKey !== 'all' && <span>{CATEGORY_LABELS[catKey]?.icon}</span>}
                  <span>{label}</span>
                  <span className="text-[10px] opacity-75 font-mono-subtle">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2 text-xs self-end lg:self-auto shrink-0">
            <span className="text-[#8C7B6B] font-mono-subtle flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sorteer:
            </span>
            <button
              onClick={() => setSortBy('votes')}
              className={`px-3 py-1 rounded-md transition-colors ${
                sortBy === 'votes'
                  ? 'bg-[#3D5A45] text-white font-medium'
                  : 'bg-[#EAE4D7] text-[#4A4F49]'
              }`}
            >
              Meest gesteund
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1 rounded-md transition-colors ${
                sortBy === 'recent'
                  ? 'bg-[#3D5A45] text-white font-medium'
                  : 'bg-[#EAE4D7] text-[#4A4F49]'
              }`}
            >
              Nieuwste
            </button>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredIdeas.map((idea) => {
              const cat = CATEGORY_LABELS[idea.category] || CATEGORY_LABELS.idee;
              const hasVoted = votedIds.includes(idea.id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={idea.id}
                  className="bg-[#F4F0E8] border border-[#D5CDC0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#8C7B6B] hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Top Row: Category badge & date */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${cat.bg} ${cat.text}`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>

                      <span className="text-[11px] font-mono-subtle text-[#8C7B6B] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(idea.createdAt).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#1A1D1A] tracking-tight leading-snug mb-2 group-hover:text-[#3D5A45] transition-colors">
                      {idea.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#4A4F49] font-light leading-relaxed mb-6">
                      {idea.description}
                    </p>
                  </div>

                  {/* Bottom Row: Author & Upvote Button */}
                  <div className="pt-4 border-t border-[#E2DDD2] flex items-center justify-between">
                    <span className="text-xs text-[#8C7B6B] font-mono-subtle truncate max-w-[140px]">
                      Door: {idea.authorName || 'Inwoner'}
                    </span>

                    <button
                      onClick={() => handleVote(idea.id)}
                      disabled={hasVoted}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                        hasVoted
                          ? 'bg-[#3D5A45] text-white cursor-default'
                          : 'bg-[#FBF9F5] border border-[#D5CDC0] text-[#1A1D1A] hover:border-[#E11D48] hover:text-[#E11D48] active:scale-95'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          hasVoted ? 'fill-white text-white' : 'text-[#E11D48]'
                        }`}
                      />
                      <span>{idea.votesCount}</span>
                      <span className="hidden sm:inline">
                        {hasVoted ? 'Gesteund' : 'Steun dit'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredIdeas.length === 0 && (
          <div className="text-center py-16 bg-[#F4F0E8] rounded-2xl border border-dashed border-[#D5CDC0]">
            <p className="text-[#736B63] text-sm">
              Geen ideeën gevonden in deze categorie.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="#interactieve-kaart"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1D1A] text-white hover:bg-[#333] transition-colors text-xs font-semibold tracking-wide uppercase font-mono-subtle shadow-md"
          >
            <span>Heb je zelf een idee? Zet het op de kaart</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
