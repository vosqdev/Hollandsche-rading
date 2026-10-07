import React, { useState } from 'react';
import { X, Send, CheckCircle2, Mail } from 'lucide-react';
import { store } from '../services/store';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isResident, setIsResident] = useState(true);
  const [keepUpdated, setKeepUpdated] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    store.subscribeNewsletter(email, isResident, keepUpdated);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1A1D1A] text-[#FBF9F5] border border-[#3A403A] rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8C7B6B] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#242824] text-[#85A38C] border border-[#3A403A]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono-subtle text-[#8C7B6B]">
                  Nieuwsbrief
                </span>
                <h3 className="text-xl font-light text-[#FBF9F5]">
                  Blijf op de hoogte
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#D5CDC0] font-light leading-relaxed">
              Ontvang updates over het participatieproces, uitnodigingen voor bewonersavonden en het officiële participatieverslag.
            </p>

            <div>
              <label className="block text-xs font-mono-subtle text-[#8C7B6B] uppercase mb-1">
                E-mailadres *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw.naam@voorbeeld.nl"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#242824] border border-[#3A403A] text-sm text-[#FBF9F5] focus:outline-none focus:border-[#85A38C]"
              />
            </div>

            <div className="space-y-2 text-xs text-[#A39182]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isResident}
                  onChange={(e) => setIsResident(e.target.checked)}
                  className="rounded-sm accent-[#3D5A45]"
                />
                <span>Ik woon of werk in Hollandsche Rading of omgeving</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepUpdated}
                  onChange={(e) => setKeepUpdated(e.target.checked)}
                  className="rounded-sm accent-[#3D5A45]"
                />
                <span>Houd mij op de hoogte van fysieke bijeenkomsten</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#3D5A45] hover:bg-[#2F4535] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Aanmelden voor updates</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#85A38C] mx-auto" />
            <h4 className="text-xl font-light text-[#FBF9F5]">
              Aanmelding geslaagd!
            </h4>
            <p className="text-xs text-[#D5CDC0]">
              We hebben je e-mailadres toegevoegd. Je ontvangt bericht zodra er nieuws is.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
