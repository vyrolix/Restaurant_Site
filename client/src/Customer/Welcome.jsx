import React from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import steakImg from '../assets/steak.png';
import tableImg from '../assets/table.png';
import salmonImg from '../assets/salmon.png';
import interiorImg from '../assets/interior.png';
import saladImg from '../assets/salad.png';

export default function Welcome() {
  const { setCurrentScreen, tableId, isDineIn } = useApp();

  const handleExplore = () => {
    if (tableId) {
      if (isDineIn) {
        setCurrentScreen('menu');
      } else {
        setCurrentScreen('session-create');
      }
    } else {
      setCurrentScreen('menu');
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-neutral-900 sm:bg-neutral-900 flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      {/* Mobile-first card container - exactly 100dvh, zero margins, no scrollbar */}
      <div className="w-full max-w-md bg-restaurant-cream shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between relative border border-neutral-200/20 select-none animate-fade-up">
        
        {/* Collage Grid Section with Dark Green Theme - exactly 45% of height */}
        <div 
          className="bg-[#052217] relative overflow-hidden h-[45dvh] min-h-[45dvh] sm:h-[380px] sm:min-h-[380px] border-b border-emerald-950/20"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 93%, 0 100%)' }}
        >
          {/* Subtle glow highlights */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-950/40 to-transparent pointer-events-none z-20" />
          
          {/* Floating Collage Wrapper */}
          <div className="absolute inset-0 p-3 z-10 animate-float-collage">
            {/* Top Left Steak */}
            <div className="absolute top-[3%] left-[3%] w-[53%] h-[38%] overflow-hidden rounded-tl-[28px] rounded-br-[28px] rounded-tr-[10px] rounded-bl-[10px] border-2 border-[#052217] shadow-lg animate-fade-up delay-100">
              <img 
                src={steakImg} 
                alt="Ribeye Steak" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Top Right Table Setting */}
            <div className="absolute top-[3%] right-[3%] w-[38%] h-[38%] overflow-hidden rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[10px] rounded-br-[10px] border-2 border-[#052217] shadow-lg animate-fade-up delay-200">
              <img 
                src={tableImg} 
                alt="Table Setting" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Far Left Prep Ingredients */}
            <div className="absolute top-[44%] left-[3%] w-[19%] h-[18%] overflow-hidden rounded-[10px] border-2 border-[#052217] shadow-md animate-fade-up delay-300">
              <img 
                src={steakImg} 
                alt="Prep Ingredients" 
                className="w-full h-full object-cover scale-[1.7] object-bottom rotate-12 filter brightness-95 saturate-110"
              />
            </div>

            {/* Center/Left Salmon (large organic leaf shape) */}
            <div className="absolute top-[44%] left-[25%] w-[47%] h-[36%] overflow-hidden rounded-bl-[40px] rounded-tr-[40px] rounded-tl-[10px] rounded-br-[10px] border-2 border-[#052217] shadow-xl z-20 animate-fade-up delay-400">
              <img 
                src={salmonImg} 
                alt="Seared Salmon" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Middle Right Salad */}
            <div className="absolute top-[44%] right-[3%] w-[25%] h-[18%] overflow-hidden rounded-[10px] border-2 border-[#052217] shadow-md animate-fade-up delay-500">
              <img 
                src={saladImg} 
                alt="Fresh Salad" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Left Ingredients Details */}
            <div className="absolute bottom-[9%] left-[3%] w-[19%] h-[18%] overflow-hidden rounded-[10px] border-2 border-[#052217] shadow-md animate-fade-up delay-300">
              <img 
                src={tableImg} 
                alt="Table Details" 
                className="w-full h-full object-cover scale-[1.9] object-left-top filter contrast-125 saturate-50 brightness-75"
              />
            </div>

            {/* Bottom Right Restaurant Interior */}
            <div className="absolute bottom-[9%] right-[3%] w-[69%] h-[31%] overflow-hidden rounded-br-[28px] rounded-tl-[28px] rounded-tr-[10px] rounded-bl-[10px] border-2 border-[#052217] shadow-xl z-10 animate-fade-up delay-500">
              <img 
                src={interiorImg} 
                alt="Restaurant Interior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content & Typography Section - occupies remaining 55% of height */}
        <div className="flex-1 flex flex-col justify-between px-6 pt-4 pb-8 sm:pb-10 bg-restaurant-cream z-30">
          
          {/* Welcome Text and Address - around 25% height */}
          <div className="text-center my-auto space-y-3 sm:space-y-4 h-[25dvh] flex flex-col justify-center">
            
            {/* Title (Staggered Animation) */}
            <h1 className="font-serif text-[#052217] text-3xl sm:text-[38px] font-bold leading-tight tracking-wide animate-fade-up delay-200">
              Welcome to<br />K/N Restaurant
            </h1>
            
            {/* Golden thin divider */}
            <div className="flex justify-center animate-fade-up delay-300">
              <div className="w-12 h-[2px] bg-[#C5A880] rounded-full" />
            </div>

            {/* Subtitle */}
            <p className="text-neutral-600 font-serif italic text-[14px] sm:text-base px-2 animate-fade-up delay-400">
              Authentic tastes and unforgettable dining experiences.
            </p>

            {/* Location Address */}
            <div className="flex items-start justify-center gap-1.5 text-neutral-500 text-[12px] sm:text-sm px-4 pt-1 leading-relaxed animate-fade-up delay-500">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <span>
                Parma Kinjaraho Rd, near Nova Showroom, SherGanj, Satna, MP 485001
              </span>
            </div>
          </div>

          {/* Action Button Section: Explore Menu - Staggered fade in, stays at bottom */}
          <div className="px-2 mt-4 animate-fade-up delay-500">
            <button onClick={handleExplore} className="w-full bg-[#1C1C1C] hover:bg-neutral-800 text-white py-3.5 sm:py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:-translate-y-[2px] hover:shadow-xl active:translate-y-0 group cursor-pointer animate-pulse-glow">
              {/* Fork and Spoon Icon */}
              <div className="flex items-center gap-1 text-[#C5A880] mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm10-5H18v7.5c0 1.25-.8 2.3-1.9 2.5v7.5h-2.5v-7.5c-1.1-.2-1.9-1.25-1.9-2.5V4h3.5v-2h2.5v2h1.8v2z"/>
                </svg>
              </div>

              {/* Vertical line divider */}
              <div className="h-5 w-[1px] bg-neutral-600 mr-4" />

              {/* Button Text */}
              <span className="text-[#F7F6F3] font-semibold text-[14px] sm:text-[15px] tracking-wide">
                Explore Menu
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
