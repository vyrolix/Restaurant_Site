import React, { useState, useRef } from 'react';
import { MapPin, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MobileContainer from '../components/MobileContainer';
import steakImg from '../assets/steak.png';
import tableImg from '../assets/table.png';
import salmonImg from '../assets/salmon.png';
import interiorImg from '../assets/interior.png';
import saladImg from '../assets/salad.png';

export default function Welcome() {
  const { setCurrentScreen, isAdminLoggedIn } = useApp();
  const [holdingProgress, setHoldingProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const handleExplore = () => {
    setCurrentScreen('session-create');
  };

  const startHold = () => {
    setHoldingProgress(0);
    const startTime = Date.now();
    const duration = 800;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setHoldingProgress(pct);
    }, 16);

    timerRef.current = setTimeout(() => {
      clearInterval(progressIntervalRef.current);
      setHoldingProgress(100);
      if (isAdminLoggedIn) {
        setCurrentScreen('admin-dashboard');
      } else {
        setCurrentScreen('admin-login');
      }
    }, duration);
  };

  const cancelHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    if (holdingProgress > 0 && holdingProgress < 100) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
    setHoldingProgress(0);
  };

  return (
    <MobileContainer>
      <div className="h-full w-full flex flex-col justify-between relative bg-palette-light-gradient select-none">
        
        {/* Top Hint Toast */}
        {showToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#04291F]/90 text-[#D4AF37] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-xl backdrop-blur-md animate-fade-up">
            Hold shield for 1 sec for Manager Portal
          </div>
        )}

        {/* Top Right Floating Admin Shield Icon Button (Long Press Trigger) */}
        <div className="absolute top-4 right-4 z-50">
          <button 
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            className="w-10 h-10 rounded-full bg-[#04291F]/80 text-[#D4AF37] border border-[#D4AF37]/50 shadow-2xl flex items-center justify-center relative overflow-hidden backdrop-blur-md cursor-pointer transition-transform active:scale-95"
            title="Press & hold for Manager Portal"
          >
            {/* Long Press SVG Circular Progress Ring */}
            {holdingProgress > 0 && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                <path
                  className="text-[#D4AF37]"
                  strokeDasharray="100, 100"
                  strokeDashoffset={100 - holdingProgress}
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            )}
            <Shield className={`w-4 h-4 transition-transform duration-200 ${holdingProgress > 0 ? 'scale-110 text-white' : ''}`} />
          </button>
        </div>

        {/* Full Page Hero Collage Grid Section */}
        <div 
          className="bg-gradient-to-br from-[#04291F] via-[#06382B] to-[#0B4A3A] relative overflow-hidden h-[45dvh] min-h-[45dvh] sm:h-[380px] sm:min-h-[380px] border-b border-[#D4AF37]/30 shrink-0 shadow-lg"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 93%, 0 100%)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#04291F]/90 to-transparent pointer-events-none z-20" />
          
          <div className="absolute inset-0 p-3 z-10 animate-float-collage">
            <div className="absolute top-[3%] left-[3%] w-[53%] h-[38%] overflow-hidden rounded-tl-[28px] rounded-br-[28px] rounded-tr-[10px] rounded-bl-[10px] border-2 border-[#04291F] shadow-lg animate-fade-up delay-100">
              <img src={steakImg} alt="Ribeye Steak" className="w-full h-full object-cover" />
            </div>

            <div className="absolute top-[3%] right-[3%] w-[38%] h-[38%] overflow-hidden rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[10px] rounded-br-[10px] border-2 border-[#04291F] shadow-lg animate-fade-up delay-200">
              <img src={tableImg} alt="Table Setting" className="w-full h-full object-cover" />
            </div>

            <div className="absolute top-[44%] left-[3%] w-[19%] h-[18%] overflow-hidden rounded-[10px] border-2 border-[#04291F] shadow-md animate-fade-up delay-300">
              <img src={steakImg} alt="Prep Ingredients" className="w-full h-full object-cover scale-[1.7] object-bottom rotate-12 filter brightness-95 saturate-110" />
            </div>

            <div className="absolute top-[44%] left-[25%] w-[47%] h-[36%] overflow-hidden rounded-bl-[40px] rounded-tr-[40px] rounded-tl-[10px] rounded-br-[10px] border-2 border-[#04291F] shadow-xl z-20 animate-fade-up delay-400">
              <img src={salmonImg} alt="Seared Salmon" className="w-full h-full object-cover" />
            </div>

            <div className="absolute top-[44%] right-[3%] w-[25%] h-[18%] overflow-hidden rounded-[10px] border-2 border-[#04291F] shadow-md animate-fade-up delay-500">
              <img src={saladImg} alt="Fresh Salad" className="w-full h-full object-cover" />
            </div>

            <div className="absolute bottom-[9%] left-[3%] w-[19%] h-[18%] overflow-hidden rounded-[10px] border-2 border-[#04291F] shadow-md animate-fade-up delay-300">
              <img src={tableImg} alt="Table Details" className="w-full h-full object-cover scale-[1.9] object-left-top filter contrast-125 saturate-50 brightness-75" />
            </div>

            <div className="absolute bottom-[9%] right-[3%] w-[69%] h-[31%] overflow-hidden rounded-br-[28px] rounded-tl-[28px] rounded-tr-[10px] rounded-bl-[10px] border-2 border-[#04291F] shadow-xl z-10 animate-fade-up delay-500">
              <img src={interiorImg} alt="Restaurant Interior" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between px-6 pt-4 pb-8 sm:pb-10 bg-palette-light-gradient z-30">
          <div className="text-center my-auto space-y-3 sm:space-y-4 flex flex-col justify-center">
            <h1 className="font-serif text-[#06382B] text-3xl sm:text-[38px] font-bold leading-tight tracking-wide animate-fade-up delay-200">
              Welcome to<br />K/N Restaurant
            </h1>
            
            <div className="flex justify-center animate-fade-up delay-300">
              <div className="w-12 h-[2px] bg-[#D4AF37] rounded-full" />
            </div>

            <p className="text-[#06382B]/80 font-serif italic text-[14px] sm:text-base px-2 animate-fade-up delay-400">
              Authentic tastes and unforgettable dining experiences.
            </p>

            <div className="flex items-start justify-center gap-1.5 text-[#06382B] text-[12px] sm:text-sm px-4 pt-1 leading-relaxed animate-fade-up delay-500">
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span>
                Parma Kinjaraho Rd, near Nova Showroom, SherGanj, Satna, MP 485001
              </span>
            </div>
          </div>

          <div className="px-2 mt-4 animate-fade-up delay-500">
            <button 
              onClick={handleExplore} 
              className="w-full bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] py-3.5 sm:py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:shadow-xl group cursor-pointer border border-[#D4AF37]/40 shadow-lg animate-pulse-glow"
            >
              <div className="flex items-center gap-1 text-[#D4AF37] mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm10-5H18v7.5c0 1.25-.8 2.3-1.9 2.5v7.5h-2.5v-7.5c-1.1-.2-1.9-1.25-1.9-2.5V4h3.5v-2h2.5v2h1.8v2z"/>
                </svg>
              </div>
              <div className="h-5 w-[1px] bg-[#D4AF37]/50 mr-4" />
              <span className="text-[#D4AF37] font-bold text-[14px] sm:text-[15px] tracking-wide uppercase">
                Explore Menu
              </span>
            </button>
          </div>
        </div>

      </div>
    </MobileContainer>
  );
}
