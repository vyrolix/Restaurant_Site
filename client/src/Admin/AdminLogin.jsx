import React from 'react';
import { useApp } from '../context/AppContext';
import MobileContainer from '../components/MobileContainer';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin, setCurrentScreen } = useApp();

  const handleDirectLogin = () => {
    adminLogin();
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col justify-between p-6 pb-20 bg-palette-light-gradient relative overflow-y-auto">
        <button 
          onClick={() => setCurrentScreen('welcome')}
          className="absolute top-6 left-6 text-[#1A1A1A] hover:text-[#5E4B43] flex items-center gap-1.5 text-xs font-semibold cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Manager
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 pt-10">
          <div className="w-20 h-20 bg-[#06382B] text-[#D4AF37] rounded-3xl flex items-center justify-center shadow-xl border border-[#D4AF37]/40 animate-pulse-glow">
            <Shield className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-serif text-[#06382B] text-2xl font-bold">
              Manager Portal
            </h1>
            <p className="text-[#06382B]/80 text-xs max-w-[260px] mx-auto leading-relaxed">
              Access live Kitchen KDS, Table Manager, Analytics, and Menu controls.
            </p>
          </div>
        </div>

        <div className="w-full space-y-4 pb-4">
          <button 
            type="button"
            onClick={handleDirectLogin}
            className="w-full bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer text-sm border border-[#D4AF37]/40 flex items-center justify-center gap-2"
          >
            Access Dashboard Directly <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
