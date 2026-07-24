import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UtensilsCrossed } from 'lucide-react';

export default function SessionCreate() {
  const { tableId, startSession } = useApp();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      startSession(name);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-palette-gradient flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md bg-palette-light-gradient shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between p-6 pb-12 animate-fade-up border border-[#8EB69B]/20">
        
        {/* Header Icon */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-[#0B2B26]/10 rounded-full flex items-center justify-center text-[#0B2B26] animate-bounce">
            <UtensilsCrossed className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <span className="bg-[#0B2B26] text-[#8EB69B] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              Table {tableId} Detected
            </span>
            <h1 className="font-serif text-[#051F20] text-3xl font-bold pt-2">
              Start Dining Experience
            </h1>
            <p className="text-[#163832] text-sm max-w-[280px] mx-auto">
              Please enter your name below so we can attach your active session to Table {tableId}.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#235347] font-semibold pl-1">
              Guest Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#8EB69B]/50 rounded-2xl py-4 px-5 text-[#051F20] placeholder-[#8EB69B]/70 focus:outline-none focus:ring-2 focus:ring-[#8EB69B] focus:border-[#235347] transition-all duration-200 text-[15px]"
              maxLength={25}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0B2B26] hover:bg-[#163832] text-[#E3EFE6] py-4 rounded-full font-semibold shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer text-[15px] border border-[#8EB69B]/20"
          >
            Start Dining
          </button>
        </form>

      </div>
    </div>
  );
}
