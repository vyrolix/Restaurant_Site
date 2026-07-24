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
    <div className="h-[100dvh] w-full bg-neutral-900 flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md bg-restaurant-cream shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between p-6 pb-12 animate-fade-up">
        
        {/* Header Icon */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-restaurant-green/10 rounded-full flex items-center justify-center text-restaurant-green animate-bounce">
            <UtensilsCrossed className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <span className="bg-restaurant-green text-restaurant-gold px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              Table {tableId} Detected
            </span>
            <h1 className="font-serif text-[#052217] text-3xl font-bold pt-2">
              Start Dining Experience
            </h1>
            <p className="text-neutral-500 text-sm max-w-[280px] mx-auto">
              Please enter your name below so we can attach your active session to Table {tableId}.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold pl-1">
              Guest Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-2xl py-4 px-5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-restaurant-gold/50 focus:border-restaurant-gold transition-all duration-200 text-[15px]"
              maxLength={25}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1C1C1C] hover:bg-neutral-800 text-[#F7F6F3] py-4 rounded-full font-semibold shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer text-[15px]"
          >
            Start Dining
          </button>
        </form>

      </div>
    </div>
  );
}
