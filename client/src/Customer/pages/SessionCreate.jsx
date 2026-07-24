import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MobileContainer from '../../components/MobileContainer';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function SessionCreate() {
  const { tableId, setGuestName, setCurrentScreen } = useApp();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = name.trim() || 'Valued Guest';
    setGuestName(finalName);
    if (tableId) {
      localStorage.setItem(`kn_guest_name_t${tableId}`, finalName);
    }
    setCurrentScreen('home');
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7FAF7] overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 my-auto">
          <div className="w-20 h-20 bg-[#06382B] text-[#D4AF37] rounded-3xl flex items-center justify-center shadow-xl border border-[#D4AF37]/40 animate-bounce">
            <UtensilsCrossed className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <span className="bg-[#06382B] text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 shadow-xs">
              Table {tableId || 1} Selected
            </span>
            <h1 className="font-serif text-[#06382B] text-3xl font-bold pt-1">
              Welcome to Fine Dining
            </h1>
            <p className="text-neutral-500 text-xs max-w-[280px] mx-auto leading-relaxed">
              Please enter your name below to personalize your dining experience.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 pb-6">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#06382B] font-bold pl-1">
              Your Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Gaurav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-2xl py-4 px-5 text-[#06382B] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-semibold text-base shadow-2xs"
              maxLength={25}
              required
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer text-sm border border-[#D4AF37]/40 flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </MobileContainer>
  );
}
