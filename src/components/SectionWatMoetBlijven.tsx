import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Send, CheckCircle2, MapPin, Trees } from 'lucide-react';
import { store } from '../services/store';

export const SectionWatMoetBlijven: React.FC = () => {
  const [text, setText] = useState('');
  const [locationName, setLocationName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    store.addResponse({
      participantId: store.getParticipant().id,
      type: 'wat_moet_blijven',
      customText: locationName ? `[Locatie: ${locationName}] ${text}` : text,
    });

    setSubmitted(true);
  };

  return (
    <section className="relative py-28 md:py-40 bg-[#1A1D1A] text-[#FBF9F5] overflow-hidden">
      {/* Subtle landscape background glow */}
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D1A] via-[#1A1D1A]/90 to-[#1A1D1A]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3D5A45]/30 border border-[#3D5A45]/60 text-xs font-mono-subtle text-[#85A38C] uppercase tracking-wider mb-6">
            <Heart className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>Dorpsidentiteit & Waarden</span>
          </div>

          <h2
            className="font-light tracking-tight text-[#FBF9F5] leading-[1.02]"
            style={{ fontSize: 'clamp(2.4rem, 6.2vw, 5.5rem)' }}
          >
            VERANDEREN BEGINT
            <br />
            <span className="font-editorial italic font-normal text-[#E7E1D6]">
              MET WETEN WAT MOET BLIJVEN.
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-[#D5CDC0] font-light leading-relaxed">
            Wat mogen we hier nooit kwijtraken? Een zichtlijn, de stilte, oude bomen, het dorpsgevoel, of een geliefd wandelpaadje?
          </p>
        </div>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-[#242824] border border-[#3A403A] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6"
          >
            <div>
              <label className="block text-xs font-mono-subtle text-[#85A38C] uppercase tracking-wider mb-2">
                Plek of herkenningspunt (optioneel)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8C7B6B] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Bijv. De zichtlijn achter de Tolakkerweg, het bosrandpad..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A1D1A] border border-[#3A403A] text-sm text-[#FBF9F5] focus:outline-none focus:border-[#85A38C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-subtle text-[#85A38C] uppercase tracking-wider mb-2">
                Wat mag hier nooit verloren gaan? *
              </label>
              <textarea
                required
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Vertel in je eigen woorden wat deze plek voor jou of voor het dorp betekent..."
                maxLength={800}
                className="w-full px-4 py-3.5 rounded-xl bg-[#1A1D1A] border border-[#3A403A] text-sm text-[#FBF9F5] focus:outline-none focus:border-[#85A38C] leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-[#8C7B6B] font-mono-subtle">
                Wordt anoniem meegenomen in de dorpsanalyse
              </span>

              <button
                type="submit"
                disabled={!text.trim()}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#FBF9F5] text-[#1A1D1A] font-semibold text-sm hover:bg-[#E8E2D5] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-40"
              >
                <span>Deel wat moet blijven</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-[#242824] border border-[#3A403A] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-2xl"
          >
            <CheckCircle2 className="w-12 h-12 text-[#85A38C] mx-auto" />
            <h3 className="text-2xl font-light text-[#FBF9F5]">
              Dank voor je waardevolle inbreng
            </h3>
            <p className="text-sm text-[#D5CDC0] font-light leading-relaxed">
              Jouw observatie over wat bewaard moet blijven is opgeslagen. Het helpt de onderzoekers en het verkenningsteam om de onvervangbare kwaliteiten van Hollandsche Rading te respecteren.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setText('');
                setLocationName('');
              }}
              className="text-xs text-[#85A38C] hover:text-white underline underline-offset-4 pt-2 block mx-auto"
            >
              Nog iets delen
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
